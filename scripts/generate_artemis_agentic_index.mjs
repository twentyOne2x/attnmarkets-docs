import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://agenticpayments.artemisanalytics.com/";
const OUTPUT_PATH = "../components/artemisAgenticCommerceIndexData.ts";

function humanizeProtocol(protocol) {
  return protocol
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => {
      if (/^[a-z]?\d+[a-z]?$/i.test(part) || /^[A-Z0-9]+$/.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

async function fetchText(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function extractSupabaseConfig() {
  const html = await fetchText(SOURCE_URL);
  const bundleMatch = html.match(/\/_next\/static\/chunks\/app\/page-[^"]+?\.js\?dpl=[^"]+/);
  if (!bundleMatch) {
    throw new Error("Could not find Artemis page bundle.");
  }

  const bundleUrl = new URL(bundleMatch[0], SOURCE_URL).toString();
  const bundle = await fetchText(bundleUrl);
  const configMatch = bundle.match(/let c="([^"]+supabase\.co)",d="([^"]+)"/);
  if (!configMatch) {
    throw new Error("Could not extract public Supabase config from Artemis bundle.");
  }

  return {
    supabaseUrl: configMatch[1],
    anonKey: configMatch[2],
    bundleUrl,
  };
}

function dedupeAndSortLabels(labels) {
  return [...new Set(labels)].sort((a, b) => a.localeCompare(b));
}

async function main() {
  const { supabaseUrl, anonKey, bundleUrl } = await extractSupabaseConfig();
  const restHeaders = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: "application/json",
  };

  const [categories, protocolsCategories, protocolsMetadata] = await Promise.all([
    fetchJson(`${supabaseUrl}/rest/v1/categories` , { headers: restHeaders }),
    fetchJson(
      `${supabaseUrl}/rest/v1/protocols_categories?select=id,protocol,category,description,website,twitter&order=id.asc`,
      { headers: restHeaders },
    ),
    fetchJson(`${supabaseUrl}/rest/v1/protocols_metadata`, { headers: restHeaders }),
  ]);

  const categoryLabelById = new Map(categories.map((category) => [category.category, category.label]));
  const metadataByProtocol = new Map(protocolsMetadata.map((row) => [row.protocol, row]));
  const categoryRowsByProtocol = new Map();

  for (const row of protocolsCategories) {
    const rows = categoryRowsByProtocol.get(row.protocol) ?? [];
    rows.push(row);
    categoryRowsByProtocol.set(row.protocol, rows);
  }

  const uniqueProtocols = [...new Set([
    ...protocolsMetadata.map((row) => row.protocol),
    ...protocolsCategories.map((row) => row.protocol),
  ])];

  const firms = uniqueProtocols
    .map((protocol) => {
      const metadata = metadataByProtocol.get(protocol) ?? {};
      const categoryRows = categoryRowsByProtocol.get(protocol) ?? [];
      const firstRow = categoryRows[0] ?? {};
      const categoryIds = dedupeAndSortLabels(categoryRows.map((row) => row.category));
      const categoryLabels = categoryIds.map((categoryId) => categoryLabelById.get(categoryId) ?? categoryId);

      return {
        protocol,
        name: metadata.name ?? humanizeProtocol(protocol),
        description: metadata.description ?? firstRow.description ?? null,
        website: metadata.website ?? firstRow.website ?? null,
        twitter: metadata.twitter ?? firstRow.twitter ?? null,
        artemisProjectPage: metadata.artemisProjectPage ?? null,
        categories: categoryIds,
        categoryLabels,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const categorySections = categories.map((category) => {
    const items = protocolsCategories
      .filter((row) => row.category === category.category)
      .map((row) => {
        const metadata = metadataByProtocol.get(row.protocol) ?? {};
        return {
          protocol: row.protocol,
          name: metadata.name ?? humanizeProtocol(row.protocol),
          description: row.description ?? metadata.description ?? null,
          website: row.website ?? metadata.website ?? null,
          twitter: row.twitter ?? metadata.twitter ?? null,
          artemisProjectPage: metadata.artemisProjectPage ?? null,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      id: category.category,
      label: category.label,
      bucket: category.bucket,
      itemCount: items.length,
      items,
    };
  });

  const dataset = {
    sourceUrl: SOURCE_URL,
    sourceBundleUrl: bundleUrl,
    generatedAt: new Date().toISOString(),
    uniqueFirmCount: firms.length,
    categoryCount: categorySections.length,
    categoryListingCount: protocolsCategories.length,
    firms,
    categories: categorySections,
  };

  const fileContents = `// Generated by scripts/generate_artemis_agentic_index.mjs.\n// Source snapshot: ${SOURCE_URL}\n\nexport type ArtemisIndexedFirm = {\n  protocol: string;\n  name: string;\n  description: string | null;\n  website: string | null;\n  twitter: string | null;\n  artemisProjectPage: string | null;\n  categories: string[];\n  categoryLabels: string[];\n};\n\nexport type ArtemisCategoryFirm = {\n  protocol: string;\n  name: string;\n  description: string | null;\n  website: string | null;\n  twitter: string | null;\n  artemisProjectPage: string | null;\n};\n\nexport type ArtemisCategorySection = {\n  id: string;\n  label: string;\n  bucket: string;\n  itemCount: number;\n  items: ArtemisCategoryFirm[];\n};\n\nexport type ArtemisAgenticCommerceIndexDataset = {\n  sourceUrl: string;\n  sourceBundleUrl: string;\n  generatedAt: string;\n  uniqueFirmCount: number;\n  categoryCount: number;\n  categoryListingCount: number;\n  firms: ArtemisIndexedFirm[];\n  categories: ArtemisCategorySection[];\n};\n\nexport const ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA: ArtemisAgenticCommerceIndexDataset = ${JSON.stringify(dataset, null, 2)};\n`;

  const outputFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), OUTPUT_PATH);
  await fs.writeFile(outputFile, fileContents);
  console.log(`Wrote ${outputFile}`);
  console.log(`Unique firms: ${firms.length}`);
  console.log(`Category listings: ${protocolsCategories.length}`);
  console.log(`Categories: ${categorySections.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
