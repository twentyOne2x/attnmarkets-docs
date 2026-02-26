# E2E Critical Journeys

This map tracks the highest-risk user paths and the Playwright files that verify them.

| Journey | Risk focus | Playwright file | Status |
| --- | --- | --- | --- |
| Docs shell smoke (home + introduction) | Site availability and core routing | `tests/e2e/smoke.spec.js` | Implemented |
| Intro and mechanics navigation | Primary onboarding path continuity | `tests/e2e/navigation.spec.js` | Planned |
| Search + page discovery flow | Content findability regression risk | `tests/e2e/search.spec.js` | Planned |
| Resource links sanity check | Broken external/internal link risk | `tests/e2e/resources.spec.js` | Planned |
