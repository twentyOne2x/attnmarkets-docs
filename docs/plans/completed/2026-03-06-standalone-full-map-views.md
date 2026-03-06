# Outcome
Completed on 2026-03-06. Added an appendix landing page and a standalone `/appendix/full-view-maps` route with two stacked full-view map sections. The standalone broad map uses a detailed preset that restores individual Web2 revenue/receivables firms, while the embedded docs page remains unchanged.

# 2026-03-06 - standalone appendix full-view maps for attn-in-context

## Objective
Add a standalone appendix experience on the docs domain where the two `attn-in-context` diagrams are presented as full-view sections, with the broad map expanded enough to show individual Web2 revenue/receivables firms again.

## Non-goals
- Replacing the existing embedded `attn-in-context` page.
- Reintroducing Solana merchant processing firms that were intentionally removed from the current diagrams.
- Reworking the underlying project dataset or taxonomy beyond what is needed for standalone rendering.

## Constraints / non-negotiables
- Preserve current local uncommitted map changes and build on top of them.
- Keep the full-view routes under the docs site namespace.
- Use one scrollable standalone page where the first map is the top section and the second map appears on scroll.
- Keep interactive behavior intact: hover, pin, cluster toggles, and zoom controls.

## Step-by-step plan
1. Add repo artifacts:
   - `docs/ISSUES.md` entry
   - this active plan file
2. Extend `QuadrantScatterMap` to support:
   - full-view revenue/receivables preset
   - full-view broad detailed preset
   - larger canvas sizing for full views
   - volume-scaled markers and label pills in full-view modes
3. Add appendix routes:
   - `pages/appendix/index.mdx` as a docs discovery page
   - `pages/appendix/full-view-maps.tsx` as a standalone scroll page
   - `pages/appendix/_meta.js` and root sidebar entry
4. Update `attn-in-context` to link out to the standalone appendix view.
5. Validate with build, knowledge check, and screenshots.

## Verification plan
- `npm run build`
- `python3 scripts/knowledge_check.py`
- Capture screenshots of:
  - the standalone full-view page top section
  - the standalone full-view page bottom section

## Rollback / recovery
- Revert only newly added appendix files and targeted `QuadrantScatterMap.tsx` changes if the standalone route regresses the embedded experience.

## Decision log
- 2026-03-06: Use one standalone page with stacked full-height sections instead of two separate pages because the user explicitly wants scroll from the first diagram into the second.
- 2026-03-06: Keep the embedded docs page intact and use new full-view presets rather than mutating the existing embedded presets.

## Progress log
- 2026-03-06: Plan created and linked from `docs/ISSUES.md`.
- 2026-03-06: Added standalone appendix route, appendix docs discovery page, and new full-view map presets.
- 2026-03-06: Verification passed (`npm run build`, `python3 scripts/knowledge_check.py`) and screenshots were captured in `tmp/`.
