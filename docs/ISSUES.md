# ISSUES

## 2026-02-06 - Pivot docs from PT/YT framing to attnCredit (P0)

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

PLANNER
- Spec check: Solvable. User approved continuing with execution of the attnCredit pivot; start with P0 rewrite set and mechanics nav label update.
- Missing info/questions: None blocking for P0.
- Context + suspected cause: Core docs still center PT/YT language and lack canonical attnCredit control-plane framing.
- Fix intent: Rewrite P0 pages to attnCredit-first messaging and update mechanics sidebar label; retain PT/YT only as a short legacy note in the mechanics anchor page.
- Acceptance criteria:
  - `pages/index.md`, `pages/1-pager.md`, `pages/mechanics/pt-yt-attnusd.md`, and `pages/mechanics/how-it-works-nontechnical.md` are rewritten with attnCredit-first language.
  - `pages/mechanics/_meta.js` label changes from `PT / YT / attnUSD` to `attnCredit engine`.
  - P0 pages contain no primary PT/YT value-prop framing.
  - Internal links across rewritten pages are valid and point to current slugs.
- Executor prompt (files, constraints, tests):
  - Rewrite complete file contents for:
    - `pages/index.md`
    - `pages/1-pager.md`
    - `pages/mechanics/pt-yt-attnusd.md`
    - `pages/mechanics/how-it-works-nontechnical.md`
  - Update label in `pages/mechanics/_meta.js`.
  - Keep public tone lender-grade; avoid banned phrases.
  - Verify with `rg` scans for terminology and `npm run build`.

EXECUTOR
- Rewrote P0 files and nav label:
  - `pages/index.md`
  - `pages/1-pager.md`
  - `pages/mechanics/pt-yt-attnusd.md`
  - `pages/mechanics/how-it-works-nontechnical.md`
  - `pages/mechanics/_meta.js`
- Verification artifacts:
  - Keyword scans confirm attnCredit-first language in rewritten pages.
  - Legacy PT/YT usage in P0 is confined to `pages/mechanics/pt-yt-attnusd.md` legacy note.
  - Build run: `npm run build` completed successfully.

VERIFIER
- Acceptance criteria check: PASS.
- Notes:
  - Screenshot input was not provided by user; verification was completed via successful static build and terminology scans.

## 2026-02-06 - attnCredit pivot P1 pages (architecture/risk/pricing/users)

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

PLANNER
- Spec check: Solvable and in scope as continuation of approved pivot execution.
- Missing info/questions: None blocking for P1.
- Context + suspected cause: High-priority pages still contained PT/YT-first mechanics and lacked lane-separated lender-grade framing.
- Fix intent: Rewrite P1 pages to attnCredit control-plane language with explicit Pump/Settlement separation and no commingling.
- Acceptance criteria:
  - Rewrite `pages/mechanics/architecture-overview.md`, `pages/mechanics/risk-and-limits.md`, `pages/mechanics/pricing-and-parameters.md`, `pages/users/for-liquidity-providers.md`, and `pages/users/for-cards-and-commerce-partners.md`.
  - Include sweeps/paydown/throttle/freeze/default concepts where applicable.
  - Include lane separation and no-commingling policy.
  - Build passes.

EXECUTOR
- Rewrote all five target files with attnCredit-first content.
- Added consistent crosslinks to mechanics/risk/pricing/LP pages.
- Removed PT/YT as primary framing from rewritten files.

VERIFIER
- Acceptance criteria check: PASS.
- Verification artifacts:
  - Terminology scans on rewritten files (attnCredit present; banned phrases absent).
  - `npm run build` completed successfully.
- Notes:
  - Screenshot input was not provided by user; verification completed with static build and text scan.

## 2026-02-06 - attnCredit pivot consistency pass (P2 + adjacent pages)

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

PLANNER
- Spec check: Solvable continuation. Remaining docs needed consistency updates so PT/YT is no longer primary outside the designated legacy note.
- Missing info/questions: None blocking.
- Context + suspected cause: Introduction/roadmap/tokenomics and some user pages still reflected older framing.
- Fix intent: Rewrite consistency pages to attnCredit-first copy and keep PT/YT references only in mechanics legacy note.
- Acceptance criteria:
  - Rewrite P2 targets and adjacent launchpads/creators pages for consistency.
  - Remove old PT/YT link text across docs.
  - Build passes.

EXECUTOR
- Rewrote:
  - `pages/introduction/vision-attn.md`
  - `pages/introduction/banking-the-internet-of-revenue.md`
  - `pages/introduction/where-attn-sits-next-to-avici-and-pye.md`
  - `pages/introduction/who-attn-is-for.md`
  - `pages/introduction/the-missing-layer-for-onchain-revenues.md`
  - `pages/roadmap.md`
  - `pages/tokenomics/tokenomics-overview.md`
  - `pages/users/for-launchpads-and-incubators.md`
  - `pages/users/for-creators-devs-and-ctos.md`
- Ran terminology sweep and removed old PT/YT label text from links.

VERIFIER
- Acceptance criteria check: PASS.
- Verification artifacts:
  - `rg` scan shows PT/YT references only in mechanics legacy note and slug paths.
  - `npm run build` completed successfully.
- Notes:
  - Screenshot input was not provided by user; verification completed with static build and text scan.

## 2026-02-06 - attnCredit consistency finish (apps page + archive sync + commit)

- [x] report captured
- [x] context added
- [ ] fix applied
- [ ] tests run
- [ ] visual/screenshot verification

PLANNER
- Spec check: Solvable. User approved continuation to perform all proposed next steps.
- Missing info/questions: None blocking.
- Context + suspected cause: One user page still had pre-pivot tone/content; `docs-archive` no longer matched active docs after rewrites.
- Fix intent:
  - Rewrite `pages/users/for-apps-daos-and-builders.md` to attnCredit-first language.
  - Sync changed docs files to corresponding `docs-archive` paths.
  - Commit all current pivot changes in required commit-message format.
- Acceptance criteria:
  - Apps/DAOs page aligns with attnCredit controls and lender-grade tone.
  - `docs-archive` mirrors current changed docs where counterpart files exist.
  - Build passes.
  - Commit created with subject + exactly 3 bullets + staged file list.

EXECUTOR
- Apply rewrite, sync archive copies, verify, then commit.

VERIFIER
- Compare proofs to acceptance criteria: PASS/FAIL.
- If FAIL, loop back with updated context.

## 2026-02-06 - Terminology updates: revenue accounts, revenue stability, credit pools

- [x] report captured
- [x] context added
- [ ] fix applied
- [ ] tests run
- [ ] visual/screenshot verification

PLANNER
- Spec check: Solvable. User requested terminology changes:
  - Use "revenue accounts" instead of "revenue vaults".
  - Replace "fee performance" with "revenue stability".
  - Replace "credit sleeves" with "credit pools".
- Missing info/questions: None.
- Fix intent: Update `pages/` and `docs-archive/` to apply terminology changes consistently while retaining "vault" only as an infrastructure implementation detail.
- Acceptance criteria:
  - No remaining "revenue vault" / "controlled vault" phrasing in docs.
  - No remaining "credit sleeves" or "sleeve" framing.
  - Home and archive use "revenue stability".
  - Build passes.

EXECUTOR
- Apply wording changes across the docs and archive mirrors.

VERIFIER
- Compare proofs to acceptance criteria: PASS/FAIL.
