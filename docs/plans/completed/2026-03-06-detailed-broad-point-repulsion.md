# Outcome
Completed on 2026-03-06. The standalone detailed broad map now uses deterministic project-point repulsion in dense regions, and the requested pills for `creditcoop.xyz`, `Shopify Capital`, `pipe.com`, and `clear.co` are larger in the full-view mode.

# 2026-03-06 - point repulsion and larger selected pills for standalone detailed broad map

## Objective
Improve the standalone detailed broad map so marker centers and their rings do not collide in dense areas, while enlarging a few key pills that now have more room in the full-view layout.

## Non-goals
- Reworking the embedded docs maps.
- Changing taxonomy, cluster membership, or project dataset semantics.
- Introducing randomness or animation to map layout.

## Constraints / non-negotiables
- Keep the relaxation deterministic from the current input data.
- Restrict point repulsion to the `broad_detailed_full` preset.
- Ensure cluster envelopes and labels reflect the relaxed point positions.
- Keep build and knowledge checks green.

## Step-by-step plan
1. Add a deterministic point-relaxation helper for project centers.
2. Thread relaxed point positions through:
   - label placement
   - cluster envelope generation
   - marker rendering
3. Add project-specific pill-size boosts for:
   - `creditcoop.xyz`
   - `Shopify Capital`
   - `pipe.com`
   - `clear.co`
4. Validate with build and updated screenshots of the standalone broad map.

## Verification plan
- `npm run build`
- `python3 scripts/knowledge_check.py`
- Capture a fresh screenshot of the standalone second diagram and inspect:
  - no marker/ring overlap in dense areas
  - larger selected pills
  - cluster zones still make sense

## Rollback / recovery
- Revert only the point-relaxation path and label-size overrides in `components/QuadrantScatterMap.tsx` if the new layout regresses readability.

## Decision log
- 2026-03-06: Use deterministic iterative repulsion anchored to original coordinates, matching the existing label-layout philosophy.

## Progress log
- 2026-03-06: Plan created and linked from `docs/ISSUES.md`.
- 2026-03-06: Added project-center relaxation for the standalone detailed broad-map preset and threaded it through labels, cluster zones, and marker rendering.
- 2026-03-06: Increased selected full-view pill sizing and verified with build, knowledge check, and updated screenshot evidence.
