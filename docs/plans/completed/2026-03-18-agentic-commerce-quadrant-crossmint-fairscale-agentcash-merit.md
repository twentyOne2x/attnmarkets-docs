Outcome: completed 2026-03-18. Added `Crossmint`, `FairScale`, `AgentCash`, and `Merit Systems` to the dedicated agentic-commerce quadrant, updated the canonical docs taxonomy to match, and captured refreshed full-view screenshot proof.

# Plan: Agentic-Commerce Quadrant Additions for Crossmint, FairScale, AgentCash, and Merit Systems

Last reviewed: 2026-03-18

## Goal
Add `Crossmint`, `FairScale`, `AgentCash`, and `Merit Systems` as first-class nodes in the dedicated agentic-commerce quadrant, while preserving the current trust / credit / rails / wallets / commerce taxonomy.

## Scope
- In scope:
  - Add four source-backed project records to the shared quadrant data.
  - Extend the `agentic_commerce` and `agentic_commerce_full` presets with those nodes and retune coordinates/cluster membership.
  - Update `attn in context` and the appendix references so the prose matches the plotted taxonomy.
  - Capture a refreshed full-view screenshot after the additions.
- Out of scope:
  - Reworking the broader strategic map.
  - Rebuilding the generated Artemis snapshot.
  - Refactoring unrelated dirty files in the repo.

## Constraints
- Keep the existing five-lane agentic-commerce framing intact.
- `FairScale` should stay on the trust / qualification side of the map.
- `Crossmint` should stay on the embedded-wallet infrastructure side.
- `AgentCash` and `Merit Systems` should stay in the open-agentic-commerce / paid-access surface lane, not the underwriting lane.

## Plan
1. Record the request in `docs/ISSUES.md` before editing.
2. Add project records and extend the dedicated quadrant membership and coordinates.
3. Update `attn in context` plus narrow appendix references where needed.
4. Run `npm run build` and `python3 scripts/knowledge_check.py`.
5. Capture a refreshed full-view screenshot and move this plan to `docs/plans/completed/`.

## Risks
- The dedicated quadrant can become visually noisy as more labels are added, so label scaling and node spacing may need tuning.
- `AgentCash` / `Merit Systems` overlap conceptually with the existing commerce-surface narrative, so wording has to stay crisp.
- `Crossmint` already appears in the Artemis snapshot, so appendix edits should stay additive and avoid duplicating generated content unnecessarily.

## Validation
- `npm run build`
- `python3 scripts/knowledge_check.py`
- Refreshed screenshot of the standalone full-view agentic-commerce quadrant

## Rollback
- Revert only the files touched for this follow-up if the quadrant becomes harder to read.
- Leave unrelated worktree changes intact.

## Decision Log
- 2026-03-18: Treat this as medium because the quadrant membership and copy both need to move again.
- 2026-03-18: Keep these additions inside the dedicated quadrant instead of spreading them into the broader strategic map.

## Progress Log
- 2026-03-18: Confirmed `AgentCash` and `Merit Systems` are already captured in shared knowledge and docs prose, while `Crossmint` is already present in the Artemis snapshot.
- 2026-03-18: Added all four nodes to the dedicated quadrant, retuned the five cluster lanes, and updated `attn in context` plus the appendix references.
- 2026-03-18: Verified with `npm run build`, `python3 scripts/knowledge_check.py`, and refreshed screenshots at:
  - `/Users/user/PycharmProjects/attnmarkets-docs/tmp/full-view-agentic-commerce-section-20260318-b.png`
  - `/Users/user/PycharmProjects/attnmarkets-docs/tmp/full-view-agentic-commerce-map-20260318-b.png`
