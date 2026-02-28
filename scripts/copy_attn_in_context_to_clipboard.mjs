#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const pagePath = path.join(repoRoot, "pages", "introduction", "attn-in-context.mdx");
const mapDataPath = path.join(repoRoot, "components", "quadrantMapData.ts");
const scatterMapPath = path.join(repoRoot, "components", "QuadrantScatterMap.tsx");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractBlock(source, marker, openChar, closeChar) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }

  let start = source.indexOf(openChar, markerIndex);
  if (start === -1) {
    throw new Error(`Opening char '${openChar}' not found after marker: ${marker}`);
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escape = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (inSingle) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === "'") {
        inSingle = false;
      }
      continue;
    }
    if (inDouble) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === "\"") {
        inDouble = false;
      }
      continue;
    }
    if (inTemplate) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === "`") {
        inTemplate = false;
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === "\"") {
      inDouble = true;
      continue;
    }
    if (ch === "`") {
      inTemplate = true;
      continue;
    }

    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  throw new Error(`Unclosed block for marker: ${marker}`);
}

function parseLiteral(literalSource, label) {
  try {
    return vm.runInNewContext(`(${literalSource})`, Object.create(null), {
      filename: `${label}.js`,
    });
  } catch (err) {
    throw new Error(`Failed to parse ${label}: ${err.message}`);
  }
}

function loadProjects() {
  const src = readText(mapDataPath);
  const literal = extractBlock(src, "export const PROJECTS", "{", "}");
  return parseLiteral(literal, "PROJECTS");
}

function loadClusterDefs() {
  const src = readText(scatterMapPath);
  const broadLiteral = extractBlock(src, "const BROAD_CLUSTER_DEFS", "[", "]");
  const zoomLiteral = extractBlock(src, "const REVENUE_RECEIVABLES_CLUSTER_DEFS", "[", "]");
  return {
    broad: parseLiteral(broadLiteral, "BROAD_CLUSTER_DEFS"),
    zoom: parseLiteral(zoomLiteral, "REVENUE_RECEIVABLES_CLUSTER_DEFS"),
  };
}

function stripMdxImports(mdxSource) {
  return mdxSource
    .split("\n")
    .filter((line) => !line.trim().startsWith("import "))
    .join("\n")
    .trim();
}

function formatList(items, emptyValue = "n/a") {
  if (!items || !items.length) return emptyValue;
  return items.map((item) => `  - ${item}`).join("\n");
}

function formatSources(sources) {
  if (!sources || !sources.length) return "  - n/a";
  return sources.map((s) => `  - ${s.label}: ${s.url}`).join("\n");
}

function formatFirmHoverData(projects) {
  const entries = Object.values(projects).sort((a, b) => a.label.localeCompare(b.label));
  const blocks = entries.map((p) => {
    const lines = [
      `## ${p.label} (${p.id})`,
      `- Narrative: ${p.narrative ?? "n/a"}`,
      `- Credit / rails: ${p.creditModel ?? "n/a"}`,
      `- Borrower type: ${p.borrowerType ?? "n/a"}`,
      `- Distribution model: ${p.distributionModel ?? "n/a"}`,
      `- Execution plane: ${p.plane ?? "n/a"}`,
      `- Stack: ${p.stack ?? "n/a"}`,
      `- Control primitive: ${p.controlPrimitive ?? "n/a"}`,
      `- Dot coordinates: x=${p.x}, y=${p.y}`,
      `- Potential client: ${p.potentialClient ? "Yes" : "No"}`,
      `- Infra dependencies: Privy=${p.infra?.privy ?? "n/a"}; Squads=${p.infra?.squads ?? "n/a"}`,
      p.infra?.asOf ? `- Infra as of: ${p.infra.asOf}` : null,
      p.infra?.note ? `- Infra note: ${p.infra.note}` : null,
      p.creditVolume
        ? `- Credit volume: ${p.creditVolume.display} (${p.creditVolume.basis ?? "Best-public signal"})`
        : "- Credit volume: n/a",
      p.creditVolume?.note ? `- Credit volume note: ${p.creditVolume.note}` : null,
      "- Who they use / rely on:",
      formatList(p.b2b2smbReliance),
      "- Who they service (examples):",
      formatList(p.exampleClients),
      "- Scale:",
      formatList(p.scale),
      "- Why here:",
      formatList(p.why),
      "- Sources:",
      formatSources(p.sources),
      `- Link: ${p.href ?? "n/a"}`,
    ].filter(Boolean);

    return lines.join("\n");
  });

  return blocks.join("\n\n");
}

function dedupeValues(values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    const clean = String(value ?? "").trim();
    if (!clean) continue;
    if (seen.has(clean)) continue;
    seen.add(clean);
    output.push(clean);
  }
  return output;
}

function computeUnderwritingLine(cluster, projects) {
  const members = cluster.projectIds
    .map((id) => projects[id])
    .filter(Boolean);
  const known = members
    .map((p) => p?.creditVolume?.normalizedUsdBn)
    .filter((v) => typeof v === "number" && Number.isFinite(v) && v > 0);

  if (!known.length) return "n/a (public cumulative totals not disclosed)";

  const sum = known.reduce((acc, n) => acc + n, 0);
  const undisclosedCount = members.filter(
    (m) =>
      !(
        typeof m?.creditVolume?.normalizedUsdBn === "number" &&
        Number.isFinite(m.creditVolume.normalizedUsdBn) &&
        m.creditVolume.normalizedUsdBn > 0
      ),
  ).length;
  const undisclosedText = undisclosedCount
    ? `; ${undisclosedCount} member${undisclosedCount === 1 ? "" : "s"} undisclosed`
    : "";

  return `$${sum.toFixed(1)}b (sum of known public figures${undisclosedText})`;
}

function formatClusterHoverData(title, clusterDefs, projects) {
  const blocks = clusterDefs.map((cluster) => {
    const members = cluster.projectIds
      .map((id) => projects[id])
      .filter(Boolean);
    const memberNames = members.map((m) => m.label);
    const clientExamples = dedupeValues(
      members.flatMap((m) => (Array.isArray(m.exampleClients) ? m.exampleClients : [])),
    );
    const finalClientExamples = clientExamples.length
      ? clientExamples
      : ["Public named clients not disclosed in cited sources."];

    return [
      `## ${cluster.label} (${cluster.id})`,
      `- One-liner: ${cluster.oneLiner ?? "n/a"}`,
      `- Members (${memberNames.length}): ${memberNames.join(", ") || "n/a"}`,
      `- Cumulative underwriting (sum): ${computeUnderwritingLine(cluster, projects)}`,
      "- Client examples:",
      formatList(finalClientExamples),
    ].join("\n");
  });

  return [`# ${title}`, ...blocks].join("\n\n");
}

function copyToClipboard(text) {
  const candidates = [
    ["pbcopy", []],
    ["wl-copy", []],
    ["xclip", ["-selection", "clipboard"]],
    ["clip", []],
  ];

  for (const [cmd, args] of candidates) {
    const res = spawnSync(cmd, args, { input: text, encoding: "utf8", stdio: ["pipe", "ignore", "ignore"] });
    if (!res.error && res.status === 0) return cmd;
  }
  return null;
}

function main() {
  const mdxSource = readText(pagePath);
  const pageBody = stripMdxImports(mdxSource);
  const projects = loadProjects();
  const clusterDefs = loadClusterDefs();
  const timestamp = new Date().toISOString();

  const output = [
    "ATTN in context export (page + hover data)",
    `Generated: ${timestamp}`,
    `Page source: ${path.relative(repoRoot, pagePath)}`,
    "",
    "==== Page Content (MDX body) ====",
    pageBody,
    "",
    "==== Hover Data: Firm Tooltips (PROJECTS) ====",
    formatFirmHoverData(projects),
    "",
    "==== Hover Data: Cluster Tooltips (Revenue & Receivables Zoom) ====",
    formatClusterHoverData("Revenue & Receivables clusters", clusterDefs.zoom, projects),
    "",
    "==== Hover Data: Cluster Tooltips (Broad Map) ====",
    formatClusterHoverData("Broad strategic clusters", clusterDefs.broad, projects),
    "",
  ].join("\n");

  const tmpPath = path.join(repoRoot, "tmp", "attn-in-context-export.txt");
  fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
  fs.writeFileSync(tmpPath, output, "utf8");

  const copiedBy = copyToClipboard(output);
  if (copiedBy) {
    console.log(`Copied attn-in-context export to clipboard via ${copiedBy}.`);
  } else {
    console.log("No clipboard command found; export written to:");
    console.log(tmpPath);
    process.exitCode = 1;
  }
  console.log(`Export length: ${output.length} chars`);
}

main();
