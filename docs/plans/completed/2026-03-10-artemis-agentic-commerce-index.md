Outcome: completed on 2026-03-10 with a new appendix page at `/appendix/artemis-agentic-commerce-index`, a refresh script, and a checked-in Artemis dataset snapshot.

# Plan: Artemis Agentic Commerce Index

Last reviewed: 2026-03-10

## Goal
Add a new appendix docs page that indexes the firms from the live Artemis Agentic Commerce Market Map in a text-first, scannable format backed by a local snapshot of the source dataset.

## Scope
- In scope:
  - fetch the live Artemis category/protocol dataset from its public Supabase-backed source
  - store a local generated snapshot in the repo
  - add a new appendix page that indexes firms by category with links and search/filter support if useful
  - link the page into appendix navigation
- Out of scope:
  - replacing the Artemis map
  - manually enriching every firm beyond the source dataset
  - integrating the new index into the existing attn quadrant maps

## Plan
1. Extract the live Artemis categories, protocols, and metadata into a stable local data snapshot.
2. Build a reusable docs component/page that renders the category index in a readable appendix view.
3. Wire the new page into appendix navigation and overview copy.
4. Verify with build, knowledge check, and a fresh screenshot.

## Risks
- The external Artemis dataset may change shape or availability; a local snapshot reduces runtime/build fragility.
- The page can become visually overwhelming if it mirrors the screenshot too literally; keep the docs version text-first and searchable.

## Validation
- `npm run build`
- `python3 scripts/knowledge_check.py`
- screenshot of the new appendix page
