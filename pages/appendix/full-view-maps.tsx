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
      "Closest-comparator lane for attn. This full view keeps the map narrow in concept but large in canvas, so volume-scaled dots and pill labels are easier to read.",
    preset: "revenue_receivables_zoom_full" as const,
    maxWidth: 2880,
  },
  {
    id: "strategic-context",
    eyebrow: "Appendix / Full View 02",
    title: "Strategic Credit, Spend & Settlement",
    description:
      "Broader landscape with the Web2 revenue/receivables cohort exploded back into individual firms. Use this view for detailed positioning rather than compressed docs-page scanning.",
    preset: "broad_detailed_full" as const,
    maxWidth: 3080,
  },
];

export default function FullViewMapsPage() {
  return (
    <>
      <Head>
        <title>attn full-view maps</title>
        <meta
          name="description"
          content="Standalone full-view maps for attn in context: revenue and receivables credit plus the strategic credit, spend, and settlement landscape."
        />
      </Head>

      <div className="shell">
        <div className="ambient ambientA" aria-hidden="true" />
        <div className="ambient ambientB" aria-hidden="true" />

        <header className="topbar">
          <div className="brandBlock">
            <div className="brand">attn.markets</div>
            <div className="subbrand">appendix // full-view maps</div>
          </div>

          <nav className="nav" aria-label="Map section navigation">
            <a href="#revenue-credit">Map 1</a>
            <a href="#strategic-context">Map 2</a>
            <Link href="/appendix">Appendix</Link>
            <Link href="/introduction/attn-in-context">Back to docs view</Link>
          </nav>
        </header>

        <main className="scrollStack">
          {mapSections.map((section) => (
            <section key={section.id} id={section.id} className="panel">
              <div className="panelHeader">
                <p className="eyebrow">{section.eyebrow}</p>
                <h1>{section.title}</h1>
                <p className="description">{section.description}</p>
              </div>

              <div className="mapStage">
                <QuadrantScatterMap
                  asOf={AS_OF}
                  preset={section.preset}
                  maxWidth={section.maxWidth}
                />
              </div>
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        .shell {
          --page-bg: #041018;
          --page-bg-alt: #071e28;
          --page-text: #e7f2f6;
          --page-muted: rgba(231, 242, 246, 0.72);
          --page-border: rgba(125, 182, 196, 0.24);
          --page-accent: #84f0da;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(132, 240, 218, 0.16), transparent 32%),
            radial-gradient(circle at 85% 18%, rgba(98, 146, 255, 0.16), transparent 30%),
            linear-gradient(180deg, var(--page-bg) 0%, var(--page-bg-alt) 100%);
          color: var(--page-text);
        }

        .ambient {
          position: fixed;
          inset: auto;
          pointer-events: none;
          z-index: 0;
          border-radius: 999px;
          filter: blur(60px);
          opacity: 0.44;
        }

        .ambientA {
          width: 22rem;
          height: 22rem;
          top: 10vh;
          left: -6rem;
          background: rgba(132, 240, 218, 0.15);
        }

        .ambientB {
          width: 26rem;
          height: 26rem;
          right: -8rem;
          bottom: 10vh;
          background: rgba(98, 146, 255, 0.14);
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.25rem;
          backdrop-filter: blur(16px);
          background: linear-gradient(180deg, rgba(4, 16, 24, 0.9), rgba(4, 16, 24, 0.72));
          border-bottom: 1px solid var(--page-border);
        }

        .brandBlock {
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
        }

        .brand {
          font-size: 0.9rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .subbrand {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--page-muted);
        }

        .nav {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 0.65rem;
        }

        .nav :global(a) {
          text-decoration: none;
          color: var(--page-text);
          border: 1px solid var(--page-border);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.6rem 0.92rem;
          border-radius: 999px;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
        }

        .nav :global(a:hover) {
          border-color: rgba(132, 240, 218, 0.56);
          background: rgba(132, 240, 218, 0.1);
          color: var(--page-accent);
        }

        .scrollStack {
          position: relative;
          z-index: 1;
        }

        .panel {
          min-height: 100vh;
          padding: 1.4rem 1.2rem 2rem;
          scroll-margin-top: 5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
        }

        .panelHeader {
          max-width: none;
          margin: 0 auto;
          width: 100%;
        }

        .eyebrow {
          margin: 0 0 0.45rem;
          color: var(--page-accent);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 0.78rem;
          font-weight: 700;
        }

        h1 {
          margin: 0;
          font-size: clamp(1.9rem, 3vw, 3.2rem);
          line-height: 0.94;
          letter-spacing: -0.04em;
          font-weight: 900;
          max-width: none;
          white-space: nowrap;
        }

        .description {
          margin: 0.8rem 0 0;
          max-width: none;
          font-size: clamp(0.92rem, 0.92vw, 1.02rem);
          line-height: 1.45;
          color: var(--page-muted);
          white-space: nowrap;
        }

        .mapStage {
          width: 100%;
        }

        @media (min-width: 960px) {
          .scrollStack {
            scroll-snap-type: y proximity;
          }

          .panel {
            scroll-snap-align: start;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            padding: 0.9rem 1rem;
          }

          .nav {
            justify-content: flex-start;
          }

          .panel {
            padding: 1rem 0.6rem 1.4rem;
            min-height: auto;
          }

          h1 {
            max-width: none;
            white-space: normal;
          }

          .description {
            white-space: normal;
          }
        }
      `}</style>
    </>
  );
}
