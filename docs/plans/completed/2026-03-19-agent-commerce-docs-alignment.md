# Plan: Agent-Commerce Docs Alignment

Last reviewed: 2026-03-19

## Outcome

Completed on 2026-03-20 after user approval to push.

What shipped:
- aligned the homepage, intro pages, roadmap, and selected mechanics / audience pages to the higher-level agent-commerce baseline
- added the narrower capital-side corrections needed so deeper docs no longer overstate live scope
- verified the docs repo with `python3 scripts/knowledge_check.py`, `git diff --check`, and `npm run build`

## Goal
Align the public docs around the updated 1-pager so the entrypoint story is high-level, agent-commerce-first, and internally consistent without overstating current live scope.

Success criteria:
- landing, intro, roadmap, and non-technical pages read like one product story
- Pump remains the strongest current proof lane
- broader commerce / settlement language is framed as direction and expansion, not blanket current availability
- repo checks pass locally

## Scope
- In scope:
  - landing and docs index language
  - introduction pages that define the story and audience
  - roadmap framing
  - non-technical mechanics page
  - cards / commerce and builders audience pages
- Out of scope:
  - unrelated dirty files
  - deep technical mechanics rewrites
  - pushing or merging changes

## Plan
1. Update the docs entrypoints (`pages/index.md`, `public/llms.txt`) so they describe attn as a credit and servicing layer behind agent commerce and onchain revenue.
2. Rewrite intro pages to simplify the thesis, audience, and long-term direction while keeping current-proof boundaries intact.
3. Rewrite the non-technical mechanics and partner pages to remove old settlement-liquidity-first framing and instead explain the system in broader, simpler terms.
4. Refresh the roadmap so it reads as proving lane -> hardening -> broader commerce expansion rather than an overly specific old lane taxonomy.
5. Run repo checks and summarize the local diff for user review without pushing.

## Risks
- Over-correcting into vague marketing language and losing truthful current boundaries.
- Leaving old lane / pool / attnUSD framing in one high-visibility page and creating another mismatch.
- Accidentally touching unrelated dirty files.

## Validation
- `python3 scripts/knowledge_check.py`
- `git diff --check`
- `npm run build`

## Rollback
- Revert only the files changed in this plan if the new copy drifts from the intended baseline.
- Keep unrelated worktree changes untouched.

## Decision Log
- 2026-03-19: Treat this as a medium docs alignment pass because it spans multiple public entrypoint pages and needs a repo-tracked plan.
- 2026-03-19: Use the current `/1-pager` as the tone baseline rather than the more detailed taxonomy in `pages/introduction/attn-in-context.mdx`.
- 2026-03-19: Keep the plan active until the user reviews the local docs and approves any push.
- 2026-03-20: User approved commit/push/merge, so the plan moved to `completed/`.

## Progress Log
- 2026-03-19: Audited the landing, intro, roadmap, non-technical mechanics, and audience pages. Identified the main mismatch as older revolving-credit / settlement-liquidity wording still leading the story outside `/1-pager`.
- 2026-03-19: Rewrote the public entrypoint pages around the simpler agent-commerce baseline, then added status notes to deeper capital-side docs so they describe target design without implying blanket live scope.
- 2026-03-19: Verified the local repo state with `python3 scripts/knowledge_check.py`, `git diff --check`, and `npm run build`. Leaving the plan in `active/` until user review is complete and push/merge is explicitly requested.
- 2026-03-20: User approved ship; plan closed and moved to `completed/`.
