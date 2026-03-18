Outcome: completed 2026-03-18. Expanded the dedicated agentic-commerce quadrant to make payment rails, wallet infrastructure, and commerce surfaces distinct, added `Tempo` as a source-backed machine-payments node, and captured refreshed full-view screenshot proof.

# Plan: Agentic-Commerce Quadrant Wallets, Rails, and Tempo Expansion

Last reviewed: 2026-03-18

## Goal
Expand the dedicated agentic-commerce quadrant so it clearly separates trust, credit execution, payment rails, wallet infrastructure, and commerce surfaces, while adding Tempo as a source-backed machine-payments and settlement node.

## Scope
- In scope:
  - Add a new `tempo` project record for the dedicated quadrant.
  - Refine the `agentic_commerce` / `agentic_commerce_full` preset membership, coordinates, and cluster taxonomy.
  - Update `attn in context` and the standalone appendix copy so the map narrative matches the refined taxonomy.
  - Capture a refreshed full-view screenshot proof of the widened quadrant.
- Out of scope:
  - Reworking the broader strategic map taxonomy beyond what is needed to avoid duplicate Tempo narratives.
  - Rebuilding the Artemis snapshot data.
  - Editing unrelated files already dirty in the worktree.

## Constraints
- Preserve the current interaction model, canvas style, and overall docs layout.
- Treat Tempo as payment and settlement infrastructure, not as an underwriting or credit protocol.
- Use the shared-knowledge capture and official Tempo materials as the positioning basis.
- Keep the existing `Klarna + Tempo` strategic-map narrative intact unless a change is required to prevent confusion.

## Plan
1. Add the issue entry and plan artifact before code edits.
2. Extend quadrant data with a dedicated Tempo node and refine the agentic-commerce preset into trust, credit execution, payment rails, wallet infra, and commerce-surface clusters.
3. Update `attn in context` plus the appendix copy so the written taxonomy matches the wider quadrant.
4. Run `npm run build` and `python3 scripts/knowledge_check.py`.
5. Start the local docs server, capture a refreshed full-view screenshot for the agentic-commerce section, then move this plan to `docs/plans/completed/`.

## Risks
- The agentic-commerce map can get crowded quickly once wallet infra is added, so coordinates and label spacing may need tuning.
- Adding Tempo to `PROJECTS` could unintentionally duplicate the existing `Klarna + Tempo` narrative in broader maps unless it is excluded there.
- The repo already has unrelated local changes in some target files, so patches must stay narrow.

## Validation
- `npm run build`
- `python3 scripts/knowledge_check.py`
- Screenshot proof of the full-view `#agentic-commerce` section after the taxonomy update

## Rollback
- Revert only the files touched for this request if the new quadrant reads worse than the current version.
- Leave pre-existing unrelated worktree changes intact.

## Decision Log
- 2026-03-18: Treat this as a medium change because it revises the dedicated quadrant taxonomy, adds a new project record, and updates multiple docs surfaces.
- 2026-03-18: Use the shared knowledge capture plus Tempo's official March 18, 2026 mainnet post as the source basis.
- 2026-03-18: Preserve the distinction that the launch artifact is `Machine Payments Protocol (MPP)` rather than a general `MCP` label.

## Progress Log
- 2026-03-18: Confirmed the shared knowledge graph already preserves Tempo as machine-payments and settlement infrastructure distinct from credit.
- 2026-03-18: Added `tempo`, widened the dedicated quadrant to five clusters, and updated `attn in context` plus appendix copy to match the new taxonomy.
- 2026-03-18: Verified with `npm run build`, `python3 scripts/knowledge_check.py`, and refreshed full-view screenshots at:
  - `/Users/user/PycharmProjects/attnmarkets-docs/tmp/full-view-agentic-commerce-section-20260318.png`
  - `/Users/user/PycharmProjects/attnmarkets-docs/tmp/full-view-agentic-commerce-map-20260318.png`
