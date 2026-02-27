# Frontend Evidence Loop for `attnmarkets-docs`

Date: 2026-02-27  
Status: completed (execution blocked locally by offline dependency install)

## Objective
Add a baseline E2E evidence loop for this frontend repo: documented critical journeys, Playwright smoke coverage with trace/video on failures, CI artifact upload, and a local evidence-bundle command under `tmp/e2e/YYYY-MM-DD/`.

## Non-Goals
- Building full journey coverage beyond initial smoke validation.
- Refactoring existing app pages/content.

## Constraints
- Touch only this repo in this run.
- Keep `tmp/` ignored by git.
- Preserve existing scripts and local developer flow.

## Steps
1. Add/update issue entry and this plan artifact.
2. Add Playwright setup (config + test + dependencies/scripts) if missing.
3. Add `docs/e2e/journeys.md` mapping 3-5 critical journeys to Playwright tests.
4. Add GitHub Actions workflow to run Playwright and upload report/artifacts.
5. Add local evidence runner script writing to `tmp/e2e/YYYY-MM-DD/run-<timestamp>/`.
6. Run verification commands and capture outcomes.

## Verification Plan
- `npm install`
- `npx playwright install --with-deps chromium` (best effort in sandbox)
- `npm run test:e2e -- --list` (or execute smoke if app can start)
- `npm run test:e2e:evidence` (best effort)
- Confirm files:
  - `docs/e2e/journeys.md`
  - `.github/workflows/playwright.yml`
  - `playwright.config.ts`
  - `tests/e2e/smoke.spec.ts`
  - `scripts/e2e_evidence.mjs`

## Rollback
Revert only the added evidence-loop files and package script/dependency changes if they break repo workflows.

## Decision Log
- Picked `attnmarkets-docs` because it is a frontend repo missing `docs/e2e/journeys.md` and Playwright CI workflow.

## Progress Log
- 2026-02-27T17:01:48Z: Plan created.
- 2026-02-27T17:07:00Z: Added Playwright config/tests/docs/workflow/evidence script and updated ignore/scripts.
- 2026-02-27T17:07:00Z: Verification run attempted; Playwright install and local execution blocked by network (`ENOTFOUND registry.npmjs.org`).
