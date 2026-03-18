Outcome: completed 2026-03-18. Added `aGDP.io` to the dedicated commerce-surface lane, corrected the `Virtuals` ACP wallet/provider note from stale `Privy` framing to the current `Alchemy` context supplied by the user, and refreshed screenshot proof.

# Plan: aGDP.io Placement and Virtuals ACP Correction

Last reviewed: 2026-03-18

## Goal
Add `aGDP.io` to the dedicated agentic-commerce quadrant and correct the `Virtuals` ACP wallet/provider framing so the docs reflect ACP as an end-to-end commerce flow rather than a generic job board.

## Scope
- In scope:
  - Add a source-backed `aGDP.io` project record.
  - Extend the dedicated agentic-commerce quadrant with the new node and tuned coordinates.
  - Correct the `Virtuals` infra note so it no longer implies current `Privy` usage.
  - Update `attn in context` and the appendix wording to reflect the broader ACP flow.
- Out of scope:
  - Reworking the broader strategic map.
  - Rebuilding the generated Artemis snapshot.
  - Editing unrelated files already dirty in the worktree.

## Constraints
- Keep `aGDP.io` in the `Commerce Surfaces` cluster.
- Preserve the distinction between the broader `Virtuals` / `ACP` protocol layer and the product-level `aGDP.io` marketplace surface.
- Use the user-supplied `Alchemy` correction as current operator context for the `Virtuals` entry.

## Plan
1. Record the correction in `docs/ISSUES.md` before editing.
2. Add `aGDP.io` data and update the `Virtuals` ACP/provider notes.
3. Update the dedicated quadrant membership and docs prose.
4. Run `npm run build` and `python3 scripts/knowledge_check.py`.
5. Capture a refreshed full-view quadrant screenshot and move this plan to `docs/plans/completed/`.

## Risks
- The commerce-surface lane is already dense, so adding one more label may require a small coordinate retune.
- The public ACP docs and the user-supplied provider correction diverge, so the docs need to preserve that distinction carefully.

## Validation
- `npm run build`
- `python3 scripts/knowledge_check.py`
- Refreshed screenshot of the standalone full-view agentic-commerce quadrant

## Rollback
- Revert only the files touched for this correction if the quadrant becomes less readable.
- Leave unrelated worktree changes intact.

## Decision Log
- 2026-03-18: Place `aGDP.io` in `Commerce Surfaces`, slightly to the settlement side of `Virtuals`, because it is a user-facing marketplace/product surface that still includes escrow and payments.

## Progress Log
- 2026-03-18: Confirmed `agdp.io` presents itself as a marketplace for autonomous agents powered by Virtuals Protocol.
- 2026-03-18: Added `aGDP.io` to the dedicated quadrant, updated the `Virtuals` ACP framing, and reflected the correction in `attn in context` plus the appendix.
- 2026-03-18: Verified with `npm run build`, `python3 scripts/knowledge_check.py`, and refreshed screenshots at:
  - `/Users/user/PycharmProjects/attnmarkets-docs/tmp/full-view-agentic-commerce-section-20260318-c.png`
  - `/Users/user/PycharmProjects/attnmarkets-docs/tmp/full-view-agentic-commerce-map-20260318-c.png`
