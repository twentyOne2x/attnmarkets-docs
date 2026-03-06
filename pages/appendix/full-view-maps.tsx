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
    stageMaxWidth: "min(100%, 840px, 80vh)",
  },
  {
    id: "strategic-context",
    eyebrow: "Appendix / Full View 02",
    title: "Strategic Credit, Spend & Settlement",
    description:
      "Broader landscape with the Web2 revenue/receivables cohort exploded back into individual firms. Use this view for detailed positioning rather than compressed docs-page scanning.",
    preset: "broad_detailed_full" as const,
    maxWidth: 3080,
    stageMaxWidth: "min(100%, 900px, 84vh)",
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

      <main className="page">
        <div className="content">
          <header className="pageHeader">
            <div className="eyebrow">Appendix</div>
            <h1>Full-view maps</h1>
            <p className="lede">
              Standalone map views for `attn in context`, kept outside the embedded docs frame so the map itself can stay readable.
            </p>
            <nav className="pageNav" aria-label="Full view map navigation">
              <a href="#revenue-credit">Revenue map</a>
              <a href="#strategic-context">Strategic map</a>
              <Link href="/appendix">Appendix index</Link>
              <Link href="/introduction/attn-in-context">Back to docs view</Link>
            </nav>
          </header>

          <div className="sections">
            {mapSections.map((section) => (
              <section key={section.id} id={section.id} className="sectionCard">
                <div className="sectionHeader">
                  <p className="sectionEyebrow">{section.eyebrow}</p>
                  <h2>{section.title}</h2>
                  <p className="description">{section.description}</p>
                </div>

                <div className="mapStage" style={{ maxWidth: section.stageMaxWidth }}>
                  <QuadrantScatterMap
                    asOf={AS_OF}
                    preset={section.preset}
                    maxWidth={section.maxWidth}
                  />
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
        }

        .content {
          max-width: 1180px;
          margin: 0 auto;
          padding: 1.1rem 1rem 2.4rem;
        }

        .pageHeader {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }

        .eyebrow,
        .sectionEyebrow {
          margin: 0;
          font-size: 0.76rem;
          line-height: 1.2;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(94, 234, 212, 0.92);
        }

        h1 {
          margin: 0;
          font-size: clamp(1.7rem, 2.2vw, 2.35rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        .lede {
          margin: 0;
          max-width: 72ch;
          font-size: 0.94rem;
          line-height: 1.5;
          color: rgba(226, 232, 240, 0.78);
        }

        .pageNav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          margin-top: 0.15rem;
        }

        .pageNav :global(a),
        .pageNav a {
          text-decoration: none;
          color: inherit;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.34);
          padding: 0.48rem 0.82rem;
          border-radius: 999px;
          font-size: 0.78rem;
          line-height: 1;
          font-weight: 600;
          transition: border-color 0.18s ease, background-color 0.18s ease;
        }

        .pageNav :global(a:hover),
        .pageNav a:hover {
          border-color: rgba(94, 234, 212, 0.42);
          background: rgba(20, 184, 166, 0.09);
        }

        .sections {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sectionCard {
          scroll-margin-top: 5rem;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.16);
          padding: 0.95rem 0.95rem 1.05rem;
          backdrop-filter: blur(10px);
        }

        .sectionHeader {
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
          margin-bottom: 0.7rem;
        }

        h2 {
          margin: 0;
          font-size: clamp(1.45rem, 1.95vw, 2rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        .description {
          margin: 0;
          font-size: 0.87rem;
          line-height: 1.4;
          color: rgba(226, 232, 240, 0.72);
        }

        .mapStage {
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .content {
            padding: 0.9rem 0.7rem 1.6rem;
          }

          .pageHeader {
            gap: 0.42rem;
            padding-bottom: 0.85rem;
            margin-bottom: 0.85rem;
          }

          .sectionCard {
            padding: 0.8rem 0.7rem 0.85rem;
            border-radius: 16px;
          }
        }
      `}</style>
    </>
  );
}
