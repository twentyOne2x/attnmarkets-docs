# AGENTS

Last reviewed: 2026-03-27

## Quick Map
- Overview: docs/index.md
- Core beliefs: docs/core-beliefs.md
- Architecture: ARCHITECTURE.md
- Plans: docs/plans/active/README.md, docs/plans/completed/README.md
- Plan template: docs/plans/plan-template.md
- Tech debt: docs/plans/tech-debt-tracker.md

## Commands
- Knowledge check: python3 scripts/knowledge_check.py

## Answer Then Act
- Answer the user's question directly.
- If the truthful answer to a sufficiency, completeness, or quality question is "no" and the concrete fix is inferable from the repo and thread context, implement the fix instead of stopping at analysis.
- If the truthful answer is "yes", report that and stop.
- If a real blocker remains, report the blocker clearly.

## Repeated Production-Lane Escalation
- If the same hosted, deployed, production-facing, or user-visible lane comes back after a prior `local closure`, `almost there`, or broad multi-lane pass, stop treating it as a generic backlog item. Escalate it into one narrow owner spec and one narrow executor run for that exact lane.
- For a repeated hosted or user-facing production lane, do not count local green, adjacent-lane progress, or older narrower paths as closure. Require the exact lane named by the user to pass its real-host bar or record one explicit external blocker.
- If the user is asking for one named production lane to land, do not move on from that lane merely because another lane is green.


## Notes
- Keep this file short; link out for details.
