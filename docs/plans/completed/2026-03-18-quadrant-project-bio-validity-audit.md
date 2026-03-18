Outcome: completed on 2026-03-18. Reviewed all 56 quadrant project records, removed all dead 404 official source URLs in the bio layer, and tightened the records where current public sources had drifted.

# Plan: Quadrant Project Bio Validity Audit

Last reviewed: 2026-03-18

## Objective
Audit all project bios in `components/quadrantMapData.ts` against primary sources and tighten any stale, overstated, or weakly-supported copy.

## Non-goals
- Re-plotting the quadrants from scratch.
- Rewriting the full narrative docs outside the project-bio layer unless a data correction requires it.
- Expanding the scope to unrelated docs outside the quadrant surfaces.

## Constraints
- Use primary/official sources only.
- If a claim cannot be re-supported, narrow it or mark it as undisclosed.
- Keep project bios concise and quadrant-appropriate.
- Preserve clear separation between public-source fact and operator correction.

## Audit approach
1. Inventory all 56 project records and tag stale-risk fields:
   - dated stats
   - provider/dependency notes
   - distribution framing
   - product-scope or category claims
2. Review each project against its cited first-party sources and refresh official pages when necessary.
3. Patch project bios conservatively:
   - `narrative`
   - `creditModel`
   - `borrowerType`
   - `distributionModel`
   - `exampleClients`
   - `contextNotes`
   - `infra.note` and related dependency status when needed
4. Sync any renderer/export labels only if the data change requires it.
5. Run build + knowledge checks.
6. Close the issue and move this plan to `docs/plans/completed/`.

## Verification
- `npm run build`
- `python3 scripts/knowledge_check.py`

## Rollback
- Revert only the audited project-bio changes if the pass introduces ambiguity or unsupported wording.

## Decision log
- 2026-03-18: Treat as large because the user requested a repo-wide audit of all quadrant project bios, not a targeted wording fix.

## Progress log
- 2026-03-18: Logged the audit after the stale `sprinter.tech` hover line made it clear the broader project-bio layer needed a full review.
- 2026-03-18: Completed a full source-health sweep across the cited official URLs; this surfaced multiple moved pages and dead 404 links in the current bio layer.
- 2026-03-18: Patched the stale or drifted records (`clearco`, `youlend`, `wayflyer`, `decal`, `moonpay_commerce`, `depay`, `loop_crypto`, `sprinter`, `frames`, `crossmint`, `virtuals`, `slash`) and kept the rest unchanged after review.
- 2026-03-18: Verified the finished audit with `npm run build` and `python3 scripts/knowledge_check.py`.
