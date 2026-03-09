import Head from "next/head";
import Link from "next/link";
import QuadrantScatterMap from "../../components/QuadrantScatterMap";

const AS_OF = "2026-02-21";

const mapSections = [
  {
    id: "revenue-credit",
    eyebrow: "Appendix / Full View 01",
    title: "Revenue & Receivables Credit",
    description:
      "Closest comparator lane for attn, with larger volume-scaled dots and labels so underwriting size and positioning are readable at a glance.",
    preset: "revenue_receivables_zoom_full" as const,
    maxWidth: 2880,
    stageMaxWidth: "959px",
  },
  {
    id: "credit-only",
    eyebrow: "Appendix / Full View 02",
    title: "Business Credit Models",
    description:
      "Bridge view for business credit: compare what gets underwritten and how repayment is secured across the revenue and receivables cohort plus adjacent reputation-based credit firms.",
    preset: "credit_only_full" as const,
    maxWidth: 3000,
    stageMaxWidth: "1037px",
  },
  {
    id: "strategic-context",
    eyebrow: "Appendix / Full View 03",
    title: "Strategic Credit, Spend & Settlement",
    description:
      "Broader competitive surface with the Web2 revenue and receivables cohort exploded back into individual firms for full-surface scanning.",
    preset: "broad_detailed_full" as const,
    maxWidth: 3080,
    stageMaxWidth: "1037px",
  },
];

export default function FullViewMapsPage() {
  return (
    <>
      <Head>
        <title>attn full-view maps</title>
        <meta
          name="description"
          content="Standalone full-view maps for attn in context: revenue and receivables credit, business credit models, and the strategic credit, spend, and settlement landscape."
        />
      </Head>

      <div className="pageShell">
        <header className="headerShell">
          <div className="pageWidth topbar">
            <div className="brandBlock">
              <Link href="/" className="brandLink">
                attn
              </Link>
              <div className="subbrand">docs appendix // full-view maps</div>
            </div>

            <nav className="nav" aria-label="Map section navigation">
              <a href="#revenue-credit">Revenue map</a>
              <a href="#credit-only">Credit map</a>
              <a href="#strategic-context">Strategic map</a>
              <Link href="/appendix">Appendix</Link>
              <Link href="/introduction/attn-in-context">Back to docs view</Link>
            </nav>
          </div>
        </header>

        <main>
          {mapSections.map((section) => (
            <section key={section.id} id={section.id} className="sectionShell">
              <div className="pageWidth sectionInner">
                <div className="panelHeader">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h1>{section.title}</h1>
                  <p className="description">{section.description}</p>
                </div>

                <div className="mapCard">
                  <div className="mapStage" style={{ maxWidth: section.stageMaxWidth }}>
                    <QuadrantScatterMap
                      asOf={AS_OF}
                      preset={section.preset}
                      maxWidth={section.maxWidth}
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        .pageShell {
          --bg: #f7f6f2;
          --panel: #ffffff;
          --text: #101010;
          --muted: #6b6b6b;
          --border: #dadada;
          --accent: #1a7f5a;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        .pageWidth {
          width: min(1560px, calc(100vw - 32px));
          margin: 0 auto;
        }

        .headerShell {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(247, 246, 242, 0.9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 0;
        }

        .brandBlock {
          display: flex;
          flex-direction: column;
          gap: 0.14rem;
          min-width: max-content;
        }

        .brandLink {
          color: var(--text);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        .brandLink:hover {
          text-decoration: none;
        }

        .subbrand {
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .nav :global(a) {
          color: var(--text);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 0.45rem 0.82rem;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.72);
          transition: border-color 0.16s ease, background-color 0.16s ease;
        }

        .nav :global(a:hover) {
          text-decoration: none;
          border-color: #bdbdbd;
          background: #ffffff;
        }

        .sectionShell {
          min-height: 100vh;
          padding: 1.5rem 0 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
        }

        .sectionInner {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panelHeader {
          width: 100%;
        }

        .eyebrow {
          margin: 0 0 0.45rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 0.78rem;
          font-weight: 700;
        }

        h1 {
          margin: 0;
          font-size: clamp(2.2rem, 4vw, 4rem);
          line-height: 0.96;
          letter-spacing: -0.04em;
          font-weight: 800;
          white-space: nowrap;
        }

        .description {
          margin: 0.5rem 0 0;
          font-size: 0.98rem;
          line-height: 1.35;
          color: var(--muted);
          white-space: nowrap;
        }

        .mapCard {
          width: 100%;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 0.95rem 1rem 1.05rem;
          box-shadow: 0 14px 44px rgba(16, 16, 16, 0.05);
        }

        .mapStage {
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 960px) {
          .sectionShell {
            scroll-margin-top: 5rem;
          }
        }

        @media (max-width: 1180px) {
          h1,
          .description {
            white-space: normal;
          }
        }

        @media (max-width: 900px) {
          .pageWidth {
            width: min(100vw - 20px, 1560px);
          }

          .topbar {
            align-items: flex-start;
            flex-direction: column;
            padding: 0.85rem 0;
          }

          .nav {
            justify-content: flex-start;
          }

          .sectionShell {
            min-height: auto;
            padding: 1rem 0 1.3rem;
          }

          .sectionInner {
            gap: 0.8rem;
          }

          h1 {
            font-size: clamp(1.85rem, 9vw, 2.6rem);
          }

          .description {
            font-size: 0.95rem;
          }

          .mapCard {
            border-radius: 18px;
            padding: 0.55rem 0.45rem 0.7rem;
          }
        }
      `}</style>
    </>
  );
}
