Outcome: completed 2026-03-18. Added a dedicated agentic-commerce quadrant, added `bond.credit` and `Valiron` to the canonical docs framing, refreshed the live Artemis snapshot timestamp, and preserved both names in the appendix without folding `bond.credit` into generated snapshot data.

# Plan: Agentic Commerce Quadrant and Requested Project Additions

Last reviewed: 2026-03-18

## Goal
Add `bond.credit` and `Valiron` to the canonical docs, create a dedicated agentic-commerce quadrant in the same visual style as the existing `attn in context` maps, and position `attn` relative to agentic trust, credit, and commerce surfaces without breaking the existing strategic-map taxonomy.

## Scope
- In scope:
  - Add a new agentic-commerce quadrant preset to the shared map component.
  - Add `bond.credit` and `Valiron` project records with source-backed hover data.
  - Update `attn in context` narrative and grouped project lists.
  - Update the Artemis appendix page so both names are explicitly preserved there.
  - Keep the generated Artemis snapshot separate from manual supplements unless the live Artemis source already contains the requested additions.
- Out of scope:
  - Rewriting the generated Artemis dataset schema.
  - Broadening the new quadrant into a full taxonomy of every agentic-commerce project in the appendix.
  - Reworking unrelated Colossus, mechanics, or creator docs changes already present in the worktree.

## Constraints
- Preserve the current look and interaction model of the quadrant maps.
- Use official project pages as primary positioning sources when possible.
- Do not silently merge `bond.credit` into the generated Artemis snapshot if it is still absent upstream.
- Work with the current dirty git state; do not overwrite unrelated edits.

## Plan
1. Capture the request in `docs/ISSUES.md` and verify whether the live Artemis snapshot already contains the requested firms.
2. Add source-backed `PROJECTS` entries for `bond.credit` and `Valiron`, then wire a dedicated `agentic_commerce` preset into `QuadrantScatterMap`.
3. Update `attn in context` with the new quadrant and matching narrative/segment references.
4. Update the Artemis appendix manual supplement so both requested names are explicitly preserved there.
5. Run `npm run build` and `python3 scripts/knowledge_check.py`, then move this plan to `docs/plans/completed/` if the change set passes verification.

## Risks
- The docs repo is already dirty in some target files, so patching must avoid clobbering in-flight edits.
- `Valiron` already exists in the generated Artemis snapshot, but `bond.credit` does not, so the appendix has to remain explicit about manual vs generated coverage.
- A new quadrant can create label collisions unless coordinates and cluster groupings are tuned carefully.

## Validation
- `npm run build`
- `python3 scripts/knowledge_check.py`
- Review rendered map/page diffs to ensure the new quadrant reads consistently with the existing page sequence.

## Rollback
- Revert only the files touched for this request if the new quadrant or copy changes render poorly.
- Leave unrelated pre-existing worktree changes intact.

## Decision Log
- 2026-03-18: Treat this as a medium docs/map update because it adds a new quadrant preset and multi-page narrative changes.
- 2026-03-18: Keep `bond.credit` in the manual appendix supplement unless a live Artemis refresh proves it is now in the upstream dataset.

## Progress Log
- 2026-03-18: Located the live docs repo, verified the existing page sources, and confirmed the user-requested X handles.
- 2026-03-18: Refreshed the live Artemis snapshot path; `Valiron` is already present in the generated dataset, while `bond.credit` is still absent upstream.
- 2026-03-18: Added `bond.credit` / `Valiron` map records, a new `agentic_commerce` quadrant preset, and updated `attn in context` plus the Artemis appendix.
- 2026-03-18: Verified with `npm run build`, `python3 scripts/knowledge_check.py`, and rendered screenshots captured from the local built docs server.
