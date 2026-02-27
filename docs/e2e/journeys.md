# E2E Journeys

Critical user journeys covered by Playwright:

1. Landing smoke: core docs shell and hero content renders.
   - Test file: `tests/e2e/smoke.spec.ts`
2. Intro narrative access: users can open the vision/introduction section.
   - Test file: `tests/e2e/introduction.spec.ts`
3. Tokenomics reference access: users can open tokenomics overview content.
   - Test file: `tests/e2e/tokenomics.spec.ts`
4. Documentation navigation stability: users can navigate from home into mechanics content.
   - Test file: `tests/e2e/navigation.spec.ts`

Notes:
- Failure artifacts are configured via Playwright (`trace`, `video`, `screenshot`) and retained on failures.
- Evidence bundles are generated with `npm run test:e2e:evidence` under `tmp/e2e/YYYY-MM-DD/`.
