Outcome: completed 2026-03-18. Replaced the stale B2B2SMB-only hover-note framing with neutral `Context note` copy and audited the affected quadrant records so hover data reads like the actual project instead of a leftover template.

# Plan: Quadrant Hover Context Notes Cleanup

Last reviewed: 2026-03-18

## Objective
Replace the stale B2B2SMB-specific hover-note framing with neutral, context-aware hover data that reads correctly across all quadrants.

## Non-goals
- Reworking the plotted coordinates or cluster membership.
- Rewriting the full docs narrative around each company.
- Expanding hover cards into long-form reference entries.

## Constraints
- Keep hover notes short and skimmable.
- Preserve explicit partner-distribution distinctions for the revenue/receivables cohort where they matter.
- Keep the same high-signal note accessible from the main scatter tooltip, inline `ProjectHoverName`, and clipboard export.

## Plan
1. Add the issue entry and this plan before editing code.
2. Rename the hover-note field in the shared data model to a neutral name.
3. Update tooltip labels/rendering in `QuadrantScatterMap.tsx` and `ProjectHoverName.tsx`.
4. Audit every current note using that field so the wording fits the actual company/protocol.
5. Update the clipboard export so it uses the new label/field.
6. Run `npm run build` and `python3 scripts/knowledge_check.py`.
7. Move this plan to `docs/plans/completed/` and close the issue entry with proofs.

## Verification
- `npm run build`
- `python3 scripts/knowledge_check.py`

## Rollback
- Revert only the hover-note field rename and note-copy changes if the tooltip copy becomes less clear.

## Decision log
- 2026-03-18: Treat as medium because the problem spans schema, multiple renderers, and an audit across many note records.

## Progress log
- 2026-03-18: Logged issue after user flagged the `sprinter.tech` hover copy as a sign the current note template is too narrow.
- 2026-03-18: Renamed the shared hover-note field to `contextNotes` and updated both hover renderers plus the clipboard export.
- 2026-03-18: Audited the affected revenue, payments, agentic-commerce, and strategic-credit notes so the copy now matches each project's route-to-market or dependency context.
- 2026-03-18: Verified with `npm run build` and `python3 scripts/knowledge_check.py`.
