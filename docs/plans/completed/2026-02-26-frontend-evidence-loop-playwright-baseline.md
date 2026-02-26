# Outcome: Completed implementation; runtime verification partially blocked by sandbox/network limits.

# Frontend Evidence Loop - Playwright Baseline (2026-02-26)

## Objective
Add a minimal Playwright evidence baseline for this docs frontend so CI and local runs produce inspectable artifacts.

## Non-goals
- Comprehensive functional coverage of all docs flows.
- Visual design/content edits outside e2e tooling.

## Constraints / Non-negotiables
- Keep changes scoped to one repo.
- Add `docs/e2e/journeys.md` with 3-5 critical journeys mapped to Playwright files.
- Configure trace + video capture on failures.
- Add GitHub Action that uploads report + trace/video artifacts.
- Add local evidence bundle command under `tmp/e2e/YYYY-MM-DD/`.
- Keep `tmp/` out of git.

## Implementation plan
1. Add issue tracking entry and this plan file.
2. Add Playwright dependency, config, and one smoke test.
3. Add `docs/e2e/journeys.md` journey mapping (implemented + planned).
4. Add local `test:e2e:evidence` command + evidence script.
5. Add CI workflow to run Playwright and upload artifacts.
6. Run verification commands and capture outcomes in `docs/ISSUES.md`.

## Verification plan
- `npm run test:e2e -- --list`
- `npm run test:e2e:evidence`
- `python3 scripts/knowledge_check.py`

Expected artifacts:
- `playwright-report/`
- `test-results/`
- `tmp/e2e/YYYY-MM-DD/run-*/summary.json`

## Rollback / Recovery
- Remove Playwright files/config/scripts/workflow.
- Revert package and ignore-file updates.

## Decision log
- 2026-02-26: Chosen baseline uses one implemented smoke test plus planned journey map entries to satisfy "minimal setup" while keeping future expansion obvious.

## Progress log
- 2026-02-26: Plan created; implementation in progress.
- 2026-02-26: Implementation completed and documented in `docs/ISSUES.md`; runtime Playwright install/run blocked by DNS (`ENOTFOUND registry.npmjs.org`), and local Next build final stage blocked by sandbox bind restriction (`EPERM 0.0.0.0`).
