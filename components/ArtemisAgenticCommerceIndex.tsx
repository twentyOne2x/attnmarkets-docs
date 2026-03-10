"use client";

import React, { useMemo, useState } from "react";
import { ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA } from "./artemisAgenticCommerceIndexData";

function formatGeneratedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function linkMatches(value: string | null, query: string) {
  return Boolean(value && value.toLowerCase().includes(query));
}

function firmMatches(
  firm: (typeof ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.firms)[number],
  query: string,
) {
  if (!query) return true;
  return (
    firm.name.toLowerCase().includes(query) ||
    firm.protocol.toLowerCase().includes(query) ||
    firm.categoryLabels.some((label) => label.toLowerCase().includes(query)) ||
    (firm.description ?? "").toLowerCase().includes(query) ||
    linkMatches(firm.website, query) ||
    linkMatches(firm.twitter, query)
  );
}

function FirmLinks(props: {
  website: string | null;
  twitter: string | null;
  artemisProjectPage: string | null;
}) {
  const links = [
    props.website ? { href: props.website, label: "Website" } : null,
    props.twitter ? { href: props.twitter, label: "X" } : null,
    props.artemisProjectPage ? { href: props.artemisProjectPage, label: "Artemis" } : null,
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  if (!links.length) {
    return <span className="emptyLink">No public links</span>;
  }

  return (
    <div className="firmLinks">
      {links.map((link) => (
        <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function ArtemisAgenticCommerceIndex() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredFirms = useMemo(
    () =>
      ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.firms.filter((firm) =>
        firmMatches(firm, normalizedQuery),
      ),
    [normalizedQuery],
  );

  const visibleProtocols = useMemo(
    () => new Set(filteredFirms.map((firm) => firm.protocol)),
    [filteredFirms],
  );

  const filteredCategories = useMemo(
    () =>
      ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => visibleProtocols.has(item.protocol)),
        }))
        .filter((category) => category.items.length > 0),
    [visibleProtocols],
  );

  return (
    <div className="artemisIndexWrap">
      <div className="summaryGrid">
        <div className="summaryCard">
          <div className="summaryLabel">Unique firms</div>
          <div className="summaryValue">
            {ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.uniqueFirmCount}
          </div>
        </div>
        <div className="summaryCard">
          <div className="summaryLabel">Category placements</div>
          <div className="summaryValue">
            {ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.categoryListingCount}
          </div>
        </div>
        <div className="summaryCard">
          <div className="summaryLabel">Categories</div>
          <div className="summaryValue">
            {ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.categoryCount}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <label className="searchField">
          <span>Search firms or categories</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Privy, payment, x402, wallets"
          />
        </label>
        <div className="metaPanel">
          <a
            href={ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open Artemis map
          </a>
          <div>Snapshot generated {formatGeneratedAt(ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.generatedAt)}</div>
          <div>Same firm can appear in multiple categories.</div>
        </div>
      </div>

      <div className="jumpGrid">
        {filteredCategories.map((category) => (
          <a key={category.id} href={`#artemis-${category.id}`} className="jumpPill">
            {category.label}
            <span>{category.items.length}</span>
          </a>
        ))}
      </div>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>Firm Index</h2>
          <div className="sectionMeta">
            Showing {filteredFirms.length} of {ARTEMIS_AGENTIC_COMMERCE_INDEX_DATA.uniqueFirmCount}
          </div>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Firm</th>
                <th>Categories</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredFirms.map((firm) => (
                <tr key={firm.protocol}>
                  <td>
                    <div className="firmCell">
                      <div className="firmName">{firm.name}</div>
                      {firm.description ? (
                        <div className="firmDescription">{firm.description}</div>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div className="categoryPills">
                      {firm.categoryLabels.map((label) => (
                        <span key={`${firm.protocol}-${label}`} className="categoryPill">
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <FirmLinks
                      website={firm.website}
                      twitter={firm.twitter}
                      artemisProjectPage={firm.artemisProjectPage}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <h2>By Artemis Category</h2>
          <div className="sectionMeta">Preserves the source map grouping.</div>
        </div>

        <div className="categorySectionList">
          {filteredCategories.map((category) => (
            <section
              key={category.id}
              id={`artemis-${category.id}`}
              className="categorySection"
            >
              <div className="categorySectionHeader">
                <div>
                  <h3>{category.label}</h3>
                  <div className="bucketLabel">{category.bucket}</div>
                </div>
                <div className="categoryCount">{category.items.length}</div>
              </div>
              <div className="categoryFirmGrid">
                {category.items.map((item) => (
                  <div key={`${category.id}-${item.protocol}`} className="categoryFirmCard">
                    <div className="categoryFirmName">{item.name}</div>
                    <FirmLinks
                      website={item.website}
                      twitter={item.twitter}
                      artemisProjectPage={item.artemisProjectPage}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <style jsx>{`
        .artemisIndexWrap {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin: 1.1rem 0 2rem;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .summaryCard {
          border: 1px solid rgba(53, 82, 127, 0.18);
          border-radius: 14px;
          background: #f7fbff;
          padding: 0.9rem 1rem;
        }

        .summaryLabel {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(31, 50, 83, 0.66);
          font-weight: 800;
        }

        .summaryValue {
          margin-top: 0.35rem;
          font-size: 1.8rem;
          line-height: 1;
          font-weight: 900;
          color: #102d55;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
          gap: 0.9rem;
          align-items: start;
        }

        .searchField {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.84rem;
          font-weight: 700;
          color: #173b67;
        }

        .searchField input {
          width: 100%;
          border: 1px solid rgba(53, 82, 127, 0.2);
          border-radius: 12px;
          padding: 0.85rem 0.95rem;
          font-size: 0.97rem;
          background: #ffffff;
          color: #102d55;
        }

        .metaPanel {
          border: 1px solid rgba(53, 82, 127, 0.18);
          border-radius: 14px;
          background: #f7fbff;
          padding: 0.9rem 1rem;
          font-size: 0.9rem;
          line-height: 1.45;
          color: rgba(16, 45, 85, 0.82);
        }

        .metaPanel a {
          display: inline-block;
          margin-bottom: 0.3rem;
          color: #173b67;
          font-weight: 800;
          text-decoration: none;
        }

        .metaPanel a:hover {
          text-decoration: underline;
        }

        .jumpGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .jumpPill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid rgba(53, 82, 127, 0.18);
          border-radius: 999px;
          background: #f7fbff;
          padding: 0.45rem 0.7rem;
          color: #173b67;
          font-size: 0.86rem;
          font-weight: 760;
          text-decoration: none;
        }

        .jumpPill span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.45rem;
          height: 1.45rem;
          border-radius: 999px;
          background: rgba(53, 82, 127, 0.12);
          font-size: 0.77rem;
          font-weight: 900;
        }

        .sectionBlock {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .sectionHeader {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .sectionHeader h2 {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.1;
          color: #102d55;
        }

        .sectionMeta {
          color: rgba(16, 45, 85, 0.66);
          font-size: 0.9rem;
        }

        .tableWrap {
          overflow-x: auto;
          border: 1px solid rgba(53, 82, 127, 0.14);
          border-radius: 16px;
          background: #ffffff;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead th {
          text-align: left;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(16, 45, 85, 0.6);
          background: #f7fbff;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid rgba(53, 82, 127, 0.12);
        }

        tbody td {
          vertical-align: top;
          padding: 0.95rem 1rem;
          border-top: 1px solid rgba(53, 82, 127, 0.08);
        }

        tbody tr:first-child td {
          border-top: none;
        }

        .firmCell {
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
        }

        .firmName {
          font-weight: 860;
          color: #102d55;
        }

        .firmDescription {
          font-size: 0.86rem;
          line-height: 1.42;
          color: rgba(16, 45, 85, 0.74);
        }

        .categoryPills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.38rem;
        }

        .categoryPill {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(53, 82, 127, 0.14);
          border-radius: 999px;
          background: #f7fbff;
          padding: 0.28rem 0.55rem;
          font-size: 0.79rem;
          font-weight: 700;
          color: #173b67;
        }

        .firmLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .firmLinks a,
        .emptyLink {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(53, 82, 127, 0.2);
          border-radius: 999px;
          padding: 0.28rem 0.55rem;
          font-size: 0.8rem;
          font-weight: 800;
          text-decoration: none;
          color: #102d55;
          background: #f4f8ff;
        }

        .firmLinks a:hover {
          background: #e8f1ff;
        }

        .emptyLink {
          color: rgba(16, 45, 85, 0.52);
          background: #f8fafc;
        }

        .categorySectionList {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .categorySection {
          border: 1px solid rgba(53, 82, 127, 0.14);
          border-radius: 16px;
          background: #ffffff;
          padding: 0.9rem 1rem 1rem;
        }

        .categorySectionHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
        }

        .categorySectionHeader h3 {
          margin: 0;
          color: #102d55;
          font-size: 1rem;
        }

        .bucketLabel {
          margin-top: 0.18rem;
          font-size: 0.77rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(16, 45, 85, 0.54);
          font-weight: 800;
        }

        .categoryCount {
          font-size: 0.86rem;
          font-weight: 900;
          color: #173b67;
          border: 1px solid rgba(53, 82, 127, 0.14);
          background: #f7fbff;
          border-radius: 999px;
          padding: 0.35rem 0.62rem;
        }

        .categoryFirmGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.65rem;
        }

        .categoryFirmCard {
          border: 1px solid rgba(53, 82, 127, 0.12);
          border-radius: 12px;
          background: #fbfdff;
          padding: 0.7rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .categoryFirmName {
          font-size: 0.9rem;
          font-weight: 800;
          color: #102d55;
        }

        @media (max-width: 960px) {
          .summaryGrid,
          .toolbar {
            grid-template-columns: 1fr;
          }

          .sectionHeader,
          .categorySectionHeader {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 720px) {
          .summaryGrid {
            grid-template-columns: 1fr;
          }

          .categoryFirmGrid {
            grid-template-columns: 1fr;
          }

          thead {
            display: none;
          }

          table,
          tbody,
          tr,
          td {
            display: block;
            width: 100%;
          }

          tbody td {
            border-top: none;
            padding-top: 0.3rem;
          }

          tbody tr {
            border-top: 1px solid rgba(53, 82, 127, 0.08);
            padding: 0.75rem 0;
          }

          tbody tr:first-child {
            border-top: none;
          }
        }
      `}</style>
    </div>
  );
}
