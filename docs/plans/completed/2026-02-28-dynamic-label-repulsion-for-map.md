# Outcome
Completed on 2026-02-28. Firm and cluster labels now use a shared deterministic repulsion layout instead of per-id hardcoded placement branches. Verified by build, knowledge check, and updated map screenshots.

# Plan: Dynamic label repulsion for firm and cluster names in attn-in-context maps

Last reviewed: 2026-02-28

## Objective
Remove manual per-firm/per-cluster label offsets and replace them with a collision-aware layout pass that pushes labels away from each other and from fixed obstacles, while preserving legibility and axis context.

## Non-goals
- Repositioning firm dots themselves.
- Changing cluster membership or axis semantics.
- Building a physics animation; layout remains deterministic and static per render.

## Constraints / non-negotiables
- Keep existing visual style (pills, leaders, cluster envelopes).
- Keep `attn` logo pill treatment.
- Avoid introducing randomness; placement should be deterministic from input data.
- Keep build green (`npm run build`).

## Step-by-step plan
1. Add a generic label relaxation helper that supports:
   - pairwise label repulsion,
   - obstacle repulsion,
   - anchor spring pull,
   - bounds clamping.
2. Refactor firm label placement to:
   - generate anchor-driven candidate starts,
   - remove per-firm hardcoded coordinate locks,
   - run the shared relaxation pass.
3. Refactor cluster title placement to:
   - remove cluster-id-specific placement branches,
   - use anchor-driven candidates + shared relaxation pass.
4. Replace cluster leader-line endpoint branching with generic geometry based on the final label box and anchor.
5. Validate via build and screenshots in `tmp/`.

## Verification plan
- Run `npm run build`.
- Generate screenshots of diagram 1 and diagram 2 and inspect for:
  - no firm-label overlap,
  - no cluster-title overlap,
  - legible leader lines.

## Rollback / recovery
- Revert only `components/QuadrantScatterMap.tsx` to restore previous behavior if regression is severe.
- Keep issue log and plan artifact for traceability.

## Decision log
- 2026-02-28: Chosen approach is deterministic iterative relaxation over pure hardcoded offsets, to reduce maintenance burden as datasets change.

## Progress log
- 2026-02-28 11:10 MST: Plan created and linked from `docs/ISSUES.md`; implementation started.
