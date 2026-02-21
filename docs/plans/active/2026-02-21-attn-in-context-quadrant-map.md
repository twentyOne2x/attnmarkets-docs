# 2026-02-21 - attn-in-context scan-first clustering + interactive quadrant map

## Objective
Refresh `attn-in-context` so it is scan-first for BD decisions, with grouped narratives first and interactive map components (ASCII + scatter) that explain classification via hover/focus.

## Non-goals
- Full exhaustive due-diligence report for every project.
- Adding new site-wide navigation or theme changes.

## Constraints / non-negotiables
- Preserve existing local, unrelated modifications.
- Keep the map readable in plain docs flow.
- Ensure accessibility: keyboard focus tooltips + non-color fallback shapes in scatter legend/markers.
- Include Rain/YouLend/Pipe/Frames/Sponge and keep ATTN framing clear.

## Plan
1. Add shared map dataset in `components/quadrantMapData.ts`.
2. Add `components/AsciiQuadrantMap.tsx` with hover tooltips and execution-plane legend.
3. Add `components/QuadrantScatterMap.tsx` with color + shape fallback markers.
4. Convert `pages/introduction/attn-in-context.md` to MDX and rewrite top section to scan-first grouped narratives.
5. Embed both maps near the top and keep supporting explanatory sections below.
6. Run verification: knowledge check + production build.

## Verification plan
- `python3 scripts/knowledge_check.py`
- `npm run build`
- `rg -n "Quadrant map|Frames|Sponge|YouLend|Pipe|Rain|AsciiQuadrantMap|QuadrantScatterMap" pages/introduction/attn-in-context.mdx components`

## Rollback / recovery
- Revert only files touched in this task if build fails.

## Decision log
- 2026-02-21: Use MDX page conversion to allow importing interactive components in docs page.
- 2026-02-21: Keep both ASCII map (primary scan tool) and scatter map (visual + accessibility fallback).

## Progress log
- 2026-02-21: Plan created.
- 2026-02-21: Added `quadrantMapData.ts`, `AsciiQuadrantMap.tsx`, and `QuadrantScatterMap.tsx`.
- 2026-02-21: Replaced `pages/introduction/attn-in-context.md` with MDX page and embedded both maps.
- 2026-02-21: Verification passed (`python3 scripts/knowledge_check.py`, `npm run build`).
