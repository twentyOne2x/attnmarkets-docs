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

## 2026-02-20 - Roadmap UX: add command-style action rail CTA

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested a command-line style CTA rail on roadmap so readers have immediate next steps.
- Missing info/questions: None.
- Context + suspected cause:
  - `/roadmap` currently communicates milestones but has no explicit "do this now" action path.
  - This creates drop-off at the moment of interest.
- Fix intent:
  - Add a compact action rail directly under title/introduction:
    - `> OPEN DEMO`
    - `> REQUEST ACCESS`
  - Add concise microcopy clarifying pilot access posture.
- Acceptance criteria:
  - Roadmap page shows two command-style CTA links near top.
  - Microcopy states: pilot permissioned, demo public.
  - Links point to demo and request-access destinations.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/roadmap.md` only.
  - Preserve roadmap content structure.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/roadmap.md`:
  - Added top-level `Action rail` directly under roadmap intro.
  - Added command-style CTA links:
    - `> OPEN DEMO` -> `https://app.attn.markets/credit-line`
    - `> REQUEST ACCESS` -> `https://attn.markets/request-access`
  - Added microcopy:
    - `Pilot is permissioned. Demo is public.`
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/roadmap` generated successfully).
  - `rg -n "Action rail|OPEN DEMO|REQUEST ACCESS|Pilot is permissioned\\. Demo is public\\." pages/roadmap.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Roadmap UX: add contextual micro-CTAs per phase

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested contextual micro-CTAs inside each roadmap phase to convert intent into action.
- Missing info/questions: None.
- Context + suspected cause:
  - Roadmap phase blocks read like internal notes and do not provide phase-specific next actions.
  - Users cannot self-select by phase context (borrower vs LP vs settlement partner).
- Fix intent:
  - Add a low-weight "If this is you" line with one link under each phase block.
  - Keep links tertiary (text links), not button-style.
- Acceptance criteria:
  - Each phase block (0-4) includes one contextual micro-CTA line.
  - Existing phase content remains intact.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/roadmap.md` only.
  - Keep command-line tone and low visual weight.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/roadmap.md`:
  - Added one contextual micro-CTA line under each phase block (0 through 4).
  - Kept these as low-weight text links (tertiary style), not buttons.
  - Mapped phase context to relevant action/link:
    - Phase 0 -> Estimate credit line
    - Phase 1 -> Request access
    - Phase 2 -> For Liquidity Providers
    - Phase 3 -> For Cards, Commerce, and Settlement Partners
    - Phase 4 -> For Launchpads & Incubators
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/roadmap` generated successfully).
  - `rg -n "If this is you|Estimate credit line|Request access|For Liquidity Providers|For Cards, Commerce, and Settlement Partners|For Launchpads & Incubators" pages/roadmap.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Roadmap UX: add sticky bottom CTA bar

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested a sticky bottom CTA bar for roadmap end-of-scroll conversion.
- Missing info/questions: None.
- Context + suspected cause:
  - Roadmap now has top action rail + per-phase links, but mobile/end-of-page users can still lose the primary action.
- Fix intent:
  - Add a thin sticky bottom bar on roadmap with:
    - one primary command CTA (`> REQUEST ACCESS`),
    - one low-weight fallback link (`Demo`).
  - Place the sticky block after hero/action-rail so it appears once users move into content.
- Acceptance criteria:
  - Roadmap includes sticky bottom CTA bar with one primary action.
  - Primary action points to request-access flow.
  - Optional fallback demo link present as low-weight text.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/roadmap.md` only.
  - Keep command-line visual tone and minimal footprint.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/roadmap.md`:
  - Added a thin sticky bottom CTA bar directly below the hero/action-rail section.
  - Bar includes:
    - primary command CTA: `> REQUEST ACCESS` -> `https://attn.markets/request-access`
    - low-weight fallback link: `Demo` -> `https://app.attn.markets/credit-line`
  - Kept visual footprint minimal with command-line tone.
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/roadmap` generated successfully).
  - `rg -n "Want in\\?|REQUEST ACCESS|Demo|position: sticky; bottom: 0" pages/roadmap.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Roadmap CTA hierarchy: permissioned-alpha ordering

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested CTA hierarchy update for permissioned alpha.
- Missing info/questions: None.
- Context + suspected cause:
  - Roadmap action rail currently lists demo before request access.
  - In permissioned alpha, conversion should prioritize access request first.
- Fix intent:
  - Reorder top action-rail CTAs to:
    - primary: `> REQUEST ACCESS`
    - secondary: `> OPEN DEMO`
  - Keep sticky bar unchanged (already request-access first).
- Acceptance criteria:
  - Top action rail presents request access first.
  - Demo remains present as secondary fallback.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/roadmap.md` only.
  - Keep command-style tone and existing links.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/roadmap.md`:
  - Reordered top action-rail CTAs for permissioned alpha hierarchy:
    - primary first: `> REQUEST ACCESS`
    - secondary second: `> OPEN DEMO`
  - Kept sticky bar ordering unchanged (already request-access first).
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/roadmap` generated successfully).
  - `rg -n "> REQUEST ACCESS|> OPEN DEMO" pages/roadmap.md` -> request access appears first in action rail.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Tokenomics clarity: explicit current status (no token today)

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested explicit token status language to reduce speculation.
- Missing info/questions: None.
- Context + suspected cause:
  - `/tokenomics/tokenomics-overview` describes directional governance/tokenomics but does not explicitly state present-day token status.
- Fix intent:
  - Add a clear "Current status" statement:
    - no live attn token today,
    - token design/scope TBD,
    - governance implementation TBD.
- Acceptance criteria:
  - Target page clearly states there is no token today.
  - Status statement is explicit and non-speculative.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/tokenomics/tokenomics-overview.md` only.
  - Keep language short and explicit.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/tokenomics/tokenomics-overview.md`:
  - Added explicit `Current status` section:
    - no live token today,
    - token design is TBD,
    - governance implementation is TBD.
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/tokenomics/tokenomics-overview` generated successfully).
  - `rg -n "Current status|no live attn token today|TBD" pages/tokenomics/tokenomics-overview.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Mechanics UX: add inline glossary tooltips on attnCredit engine page

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested inline glossary tooltips that match app labels on `/mechanics/pt-yt-attnusd`.
- Missing info/questions: None.
- Context + suspected cause:
  - The page is technically complete but dense; key terms are not self-defined inline.
  - Readers need fast definitions for terms like borrowing base, throttle, and DSRA without leaving the page.
- Fix intent:
  - Add inline hover glossary tooltips (`abbr` + `title`) to key terms while preserving existing structure/copy.
- Acceptance criteria:
  - Target page includes inline glossary tooltips for key terms (borrowing base, DSRA, hard sweeps, mandatory paydown, throttle/protect/freeze modes, attnUSD).
  - Labels remain aligned with app terminology.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/mechanics/pt-yt-attnusd.md` only.
  - Keep wording concise and avoid changing model semantics.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/mechanics/pt-yt-attnusd.md`:
  - Added inline glossary tooltip wrappers (`abbr` with `title`) for key terms:
    - Borrowing base
    - attnUSD
    - DSRA
    - Hard sweeps
    - Mandatory paydown
    - Dynamic limits
    - Step controls
    - Throttle mode
    - Protect mode
    - Freeze mode
  - Added short page hint: `Hover highlighted terms for quick glossary definitions.`
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/mechanics/pt-yt-attnusd` generated successfully).
  - `rg -n "abbr title=|Borrowing base|DSRA|Hard sweeps|Mandatory paydown|Throttle mode|Protect mode|Freeze mode" pages/mechanics/pt-yt-attnusd.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Trust page clarity: add plain-English "Who can move funds?" section

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested a plain-English "Who can move funds?" section on the trust-critical signing model page.
- Missing info/questions: None.
- Context + suspected cause:
  - The page covers custody/signing mechanics but does not provide a single role-based answer for who can move funds during an active facility.
  - This creates repeated confusion around "co-signer on everything" vs "frozen config + monitored rails."
- Fix intent:
  - Add a concise section that explicitly separates powers of:
    - borrower governance / ops,
    - automated sweeper,
    - attn / lender governance.
  - Clarify that config authority posture determines whether config can be changed instantly.
- Acceptance criteria:
  - `pages/mechanics/revenue-accounts-and-signing-model.md` contains a clearly labeled plain-English "Who can move funds?" section.
  - Section states borrower vs sweeper vs attn permissions in simple language and aligns with v1 enforcement posture.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/mechanics/revenue-accounts-and-signing-model.md` only.
  - Keep wording short and user-trust oriented.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/mechanics/revenue-accounts-and-signing-model.md`:
  - Added `Who can move funds? (plain English)` subsection.
  - Explicitly separated permissions for:
    - borrower governance/ops,
    - automated sweeper,
    - attn/lender governance.
  - Added concise config-authority nuance (autonomous vs controlled safe posture).
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/mechanics/revenue-accounts-and-signing-model` generated successfully).
  - `rg -n "Who can move funds\\? \\(plain English\\)|Borrower \\(governance \\+ ops\\)|Automated sweeper|attn / lender governance|Config-authority nuance" pages/mechanics/revenue-accounts-and-signing-model.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Creator page UX: add typical flow timeline + demo CTA

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested a timeline-style "Typical flow" addition for `/users/for-creators-devs-and-ctos`.
- Missing info/questions: None.
- Context + suspected cause:
  - Page explains value and mechanics but lacks a one-glance end-to-end flow diagram.
  - CTA to the demo app is implicit, not direct.
- Fix intent:
  - Add a "Typical flow (timeline)" section showing:
    - Apply -> Route fees -> Draw -> Sweeps -> Close
  - Add direct demo CTA link.
- Acceptance criteria:
  - Target page includes a clearly labeled timeline section with the requested sequence.
  - Target page includes direct demo app link.
  - Existing related pages remain intact.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/users/for-creators-devs-and-ctos.md` only.
  - Keep concise creator-facing tone.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/users/for-creators-devs-and-ctos.md`:
  - Added `Typical flow (timeline)` section with requested sequence:
    - `Apply -> Route fees -> Draw -> Sweeps -> Close`
  - Added a short five-step timeline walkthrough under the diagram.
  - Added direct demo CTA link under related pages:
    - `View demo app` -> `https://app.attn.markets/credit-line`
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/users/for-creators-devs-and-ctos` generated successfully).
  - `rg -n "Typical flow \\(timeline\\)|Apply -> Route fees -> Draw -> Sweeps -> Close|View demo app" pages/users/for-creators-devs-and-ctos.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Borrower page UX: add implementation checklist + direct estimate CTA

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested an implementation checklist on `/users/for-apps-daos-and-builders` and clearer next action for estimating a line.
- Missing info/questions: None.
- Context + suspected cause:
  - The page explains borrower value and enforcement model but lacks a concrete implementation checklist.
  - There is no direct "Estimate credit line" action on the page.
- Fix intent:
  - Add an "Implementation checklist" section covering:
    - routing readiness,
    - multisig setup,
    - policy constraints.
  - Add a direct `Estimate credit line` link.
- Acceptance criteria:
  - Page includes an implementation checklist with the three requested categories.
  - Page includes a direct `Estimate credit line` link.
  - Existing related links remain intact.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/users/for-apps-daos-and-builders.md` only.
  - Keep concise borrower-facing tone.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/users/for-apps-daos-and-builders.md`:
  - Added `Implementation checklist` section covering:
    - routing readiness,
    - multisig setup,
    - policy constraints.
  - Added direct next-step CTA link:
    - `Estimate credit line` -> `https://app.attn.markets/credit-line`
  - Kept existing related pages section unchanged.
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/users/for-apps-daos-and-builders` generated successfully).
  - `rg -n "Implementation checklist|Routing readiness|Multisig setup|Policy constraints|Estimate credit line" pages/users/for-apps-daos-and-builders.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - attn-in-context UX: top takeaways + mobile-friendly comparison cards

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested improving `/introduction/attn-in-context` with a concise summary and a mobile-friendly alternative to the large matrix.
- Missing info/questions: None.
- Context + suspected cause:
  - The page currently relies on a large 5-column matrix that is hard to scan on mobile.
  - Core positioning exists but lacks an explicit top-level "top 3 takeaways" summary.
- Fix intent:
  - Add a "3 quick takeaways" section near the top.
  - Add a condensed summary line: `attn = enforcement + servicing + reporting against routed revenue`.
  - Replace the large matrix with expandable project cards (`<details>`) for better mobile UX.
- Acceptance criteria:
  - Page includes top takeaways + condensed comparison summary.
  - Comparison section is rendered as collapsible project cards instead of a giant matrix.
  - Related page links remain intact.
  - Build/knowledge checks pass.
- Complexity: small
- Executor prompt (files, constraints, tests):
  - Update `pages/introduction/attn-in-context.md`.
  - Keep existing comparison meaning; improve structure and scanability.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/introduction/attn-in-context.md`:
  - Added `3 quick takeaways` above the comparison details.
  - Added condensed summary callout:
    - `attn = enforcement + servicing + reporting against routed revenue.`
  - Replaced the large matrix with expandable project cards using `<details>` blocks for mobile-friendly scanning.
  - Kept `Related pages` links unchanged.
- Proofs:
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/introduction/attn-in-context` generated successfully).
  - `rg -n "3 quick takeaways|Condensed comparison summary|At a glance \\(expand by project\\)|<details>|attn = enforcement \\+ servicing \\+ reporting against routed revenue" pages/introduction/attn-in-context.md` -> expected matches present.

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Intro page clarity: add 30-second borrower example box

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested a concrete borrower story on `/introduction/the-missing-layer-for-onchain-revenues`.
- Missing info/questions: None.
- Context + suspected cause:
  - The page explains the abstract problem clearly but lacks an immediate concrete flow example.
- Fix intent:
  - Add a short "30-second example" box showing the flow:
    - pump.fun creator routes fees
    - attn estimates a credit line
    - automated sweeps repay
- Acceptance criteria:
  - Target page includes a clearly labeled example box with the above flow.
  - Existing section order and links remain intact.
  - Build/knowledge checks pass.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/introduction/the-missing-layer-for-onchain-revenues.md` only.
  - Keep copy concise and non-technical.
  - Run `python3 scripts/knowledge_check.py` and `npm run build`.

EXECUTOR
- Updated `pages/introduction/the-missing-layer-for-onchain-revenues.md`:
  - Added a "30-second example" callout directly after "What attn adds."
  - Example flow now explicitly states:
    - pump.fun creator routes fees into controlled revenue account
    - attn estimates a credit line
    - automated sweeps route fees to repayment
- Proofs:
  - `rg -n "30-second example|Example: a pump.fun creator|estimates a credit line|automated sweeps" pages/introduction/the-missing-layer-for-onchain-revenues.md` -> expected matches present.
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/introduction/the-missing-layer-for-onchain-revenues` generated successfully).

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - 1-pager CTA finish: add Next actions panel + punctuation polish

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided)

PLANNER
- Spec check: Solvable. User requested a clearer end-state CTA panel on `/1-pager` plus a punctuation cleanup in the lanes section.
- Missing info/questions: None.
- Context + suspected cause:
  - The 1-pager is scannable but ends without clear next-step actions.
  - The "No early commingling" lane bullet currently reads as two separate lines without punctuation.
- Fix intent:
  - Add a bottom "Next actions" block with:
    - Estimate credit line
    - View demo dashboard
    - Read non-technical overview
  - Tighten the lane bullet punctuation for polish.
- Acceptance criteria:
  - `pages/1-pager.md` contains a clear bottom next-action section with those three actions.
  - The no-commingling lane line has corrected punctuation.
  - Build passes: `python3 scripts/knowledge_check.py`.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/1-pager.md` only.
  - Keep tone concise and product-forward.
  - Run `python3 scripts/knowledge_check.py` after edits.

EXECUTOR
- Updated `pages/1-pager.md`:
  - Fixed lane punctuation:
    - `No early commingling` line now reads: `No early commingling: separate credit pools and lane-specific risk boxes.`
  - Added bottom CTA section:
    - `Estimate credit line` -> `https://app.attn.markets/credit-line`
    - `View demo dashboard` -> `https://app.attn.markets/monitoring`
    - `Read non-technical overview` -> `./mechanics/how-it-works-nontechnical.md`
- Proofs:
  - `rg -n "No early commingling|Next actions|What to do next|Estimate credit line|View demo dashboard|Read non-technical overview" pages/1-pager.md` confirms expected copy/links.
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`
  - `npm run build` -> PASS (`/1-pager` generated successfully).

VERIFIER
- Acceptance criteria check: PASS.
- Notes:
  - Screenshot input was not provided by user; verification was completed via text checks + successful build.

## 2026-02-16 - Clarify config authority posture + add FAQ (public docs)

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided; verified via build output)

PLANNER
- Spec check: Solvable. Public docs should not imply "2-of-2 co-signing on everything"; the enforceability posture is "timelocked rails + spending limits + monitoring + freeze", with an explicit requirement that config cannot be changed instantly (Squads v4 `config_authority` posture).
- Missing info/questions: None.
- Context + suspected cause:
  - Some public copy can be read as "shared custody / co-signing" rather than "borrower ops remain borrower-controlled; lender controls config integrity and protocol-level state."
  - Squads v4 config authority nuance is critical: a timelock only matters if config cannot be changed instantly via `config_authority`.
- Fix intent:
  - Update `pages/mechanics/revenue-accounts-and-signing-model.md` to:
    - explain config authority (autonomous vs controlled) at a high level,
    - describe the practical posture during an active credit position (config pinned + rails monitored),
    - add an FAQ section that answers the most common "do I need to co-sign everything?" and "what do you control?" questions.
  - Update `pages/mechanics/architecture-overview.md` to reflect config authority as a control-integrity surface.
- Acceptance criteria:
  - `pages/mechanics/revenue-accounts-and-signing-model.md` includes a short config authority explanation and an FAQ at the bottom.
  - `pages/mechanics/architecture-overview.md` mentions config authority in the revenue account layer/control integrity framing.
  - Build passes: `npm run build`.
- Complexity: small
- Executor prompt (files, constraints, tests):
  - Update:
    - `pages/mechanics/revenue-accounts-and-signing-model.md`
    - `pages/mechanics/architecture-overview.md`
  - Verify:
    - `npm run build`

EXECUTOR
- Updated public mechanics copy to clarify config authority posture and added an FAQ:
  - `pages/mechanics/revenue-accounts-and-signing-model.md`
  - `pages/mechanics/architecture-overview.md`
- Proofs:
  - `npm run build` PASS

VERIFIER
- Acceptance criteria check: PASS.

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
  - `pages/introduction/attn-in-context.md`
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
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

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
- Acceptance criteria check: PASS.
- Verification artifacts:
  - `npm run build` completed successfully.
- Notes:
  - Screenshot input was not provided by user; verification completed with static build and text scan.

## 2026-02-06 - Terminology updates: revenue accounts, revenue stability, credit pools

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

PLANNER
- Spec check: Solvable. User requested terminology changes:
  - Use "revenue accounts" consistently (avoid vault-based wording for the concept name).
  - Replace "fee performance" with "revenue stability".
  - Replace "credit sleeves" with "credit pools".
- Missing info/questions: None.
- Fix intent: Update `pages/` and `docs-archive/` to apply terminology changes consistently while retaining "vault" only as an infrastructure implementation detail.
- Acceptance criteria:
  - No remaining controlled-vault phrasing in docs content.
  - No remaining "credit sleeves" or "sleeve" framing.
  - Home and archive use "revenue stability".
  - Build passes.

EXECUTOR
- Updated terminology across `pages/` and `docs-archive/`:
  - controlled vault -> revenue account terminology (concept name)
  - fee performance -> revenue stability
  - credit sleeves -> credit pools (and related phrasing)
- Fixed a missed \"controlled vault\" mention in architecture overview.
- Verification artifacts:
  - `rg` scans show no remaining \"controlled vault\" or \"credit sleeves\" phrasing.
  - `npm run build` completed successfully.

VERIFIER
- Acceptance criteria check: PASS.
- Notes:
  - Screenshot input was not provided by user; verification completed with static build and text scan.

## 2026-02-06 - Copy refinements: lane naming + private archive of long comparison page

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

PLANNER
- Spec check: Solvable.
- Missing info/questions: None.
- Context + suspected cause:
  - "serious lane" phrasing reads as value judgement.
  - Long comparison page was heavily shortened; prior content needed a non-published archive.
- Fix intent:
  - Replace "serious lane" naming with neutral settlement-liquidity wording.
  - Store pre-pivot long-form comparison page as a private archive file not included in published docs.
  - Ensure no remaining vault-based terminology for revenue accounts anywhere.
- Acceptance criteria:
  - No "serious lane" phrasing in docs.
  - Archived pre-pivot content exists under `docs/private/` and is not part of `pages/`.
  - No remaining vault-based revenue-account wording in repo.
  - Build passes.

EXECUTOR
- Updated lane naming:
  - `Settlement lane (serious lane)` -> `Settlement lane (settlement liquidity lane)`.
- Added private archive copy of the previous long-form comparison page:
  - `docs/private/where-attn-sits-next-to-avici-and-pye_PREPIVOT.md`.
- Verification artifacts:
  - `rg` scan confirms no remaining vault-based revenue-account wording.
  - `rg -n "serious lane"` returns no matches.
  - `npm run build` completed successfully.

VERIFIER
- Acceptance criteria check: PASS.
- Notes:
  - Screenshot input was not provided by user; verification completed with static build and text scan.

## 2026-02-14 - Replace docs favicon with attn-frontend icon

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification

PLANNER
- Spec check: Solvable. User requested using the same browser tab icon (favicon) as `attn-frontend`.
- Missing info/questions: None.
- Context + suspected cause: Docs repo has a legacy gradient favicon set under `public/` that does not match the current `attn-frontend` brand icon.
- Fix intent:
  - Replace docs `public/favicon.svg` with `attn-frontend` icon.
  - Regenerate `public/favicon.ico` and `public/favicon_io/*` icon set to match.
  - Optionally add explicit `<link rel="icon">` tags if required by the docs theme.
- Acceptance criteria:
  - Favicon assets in `public/` match `attn-frontend` icon.
  - `npm run build` passes.

EXECUTOR
- Replaced favicon assets to match `attn-frontend` icon:
  - `public/favicon.svg`
  - `public/favicon.ico`
  - `public/favicon_io/*` icon set
- Verification artifacts:
  - `npm run build` completed successfully.
  - `file` output confirms favicon assets are valid SVG/ICO/PNG.

VERIFIER
- Acceptance criteria check: PASS.
- Notes:
  - Screenshot input was not provided by user; verification completed via successful build and asset-type checks.

## 2026-02-15 - Enable Vercel Analytics on docs site

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided; verified via build output)

PLANNER
- Spec check: Solvable. This repo is a Next.js docs site (Nextra) deployed on Vercel; Vercel Analytics can be enabled by adding `@vercel/analytics` and mounting `<Analytics />`.
- Missing info/questions: None.
- Context + suspected cause: Docs site (`docs.attn.markets`) is a separate repo and does not yet mount Vercel Analytics.
- Fix intent: Add Vercel Analytics dependency and render `<Analytics />` in `pages/_app.jsx`.
- Acceptance criteria:
  - `package.json` includes `@vercel/analytics`.
  - `pages/_app.jsx` renders `<Analytics />`.
  - Build passes: `npm run build`.
- Executor prompt (files, constraints, tests):
  - Update `package.json` (add `@vercel/analytics`).
  - Update `pages/_app.jsx` to import and render `<Analytics />`.
  - Run `npm install` and `npm run build` and record proofs here.

EXECUTOR
- Added Vercel Analytics and mounted it in the docs app shell:
  - `package.json`
  - `pages/_app.jsx`
  - `package-lock.json`
- Proofs:
  - `npm run build` PASS

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-16 - Update public docs: Pump fee sharing + Squads safe requirements

- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (no screenshot provided; verified via build output)

PLANNER
- Spec check: Solvable. Public docs need to reflect the latest shared KB notes on Pump fee sharing + Squads safe enforceability assumptions for attnCredit v1.
- Missing info/questions: None.
- Context + suspected cause:
  - Shared KB notes were updated on 2026-02-16 and include newer/clearer mental models for:
    - Pump fee sharing: `SharingConfig` (recipients) vs admin/lock controls, and
    - Squads safe enforceability: "two safes" (borrower vs pool governance) plus baseline posture checks.
  - The docs site has relevant public copy, but it does not yet explicitly include the "two safes" mental model or the baseline borrower-safe checks.
- Fix intent:
  - Update the public mechanics page that defines revenue account custody/signing assumptions to incorporate:
    - the Pump fee sharing mental model (creator -> SharingConfig PDA; recipients and lock semantics),
    - the "two safes" control-plane model (BorrowerSquads vs PoolGov),
    - a concise list of baseline borrower safe requirements (timelock + spending limits + separation of keys).
- Acceptance criteria:
  - `pages/mechanics/revenue-accounts-and-signing-model.md` includes:
    - an explicit "two safes" explanation (borrower safe vs lender/pool governance safe),
    - a baseline borrower safe requirements list that matches current v1 posture (timelock >= 7d, non-trivial multisig, sweeper separation, strict spending-limit allowlists, no delegates),
    - Pump fee sharing section updated to reflect SharingConfig recipients + admin + permanent lock semantics.
  - Build passes: `npm run build`.
- Complexity: small
- Executor prompt (files, constraints, tests):
  - Update:
    - `pages/mechanics/revenue-accounts-and-signing-model.md`
    - `pages/mechanics/architecture-overview.md`
  - Verify:
    - `npm run build`

EXECUTOR
- Updated public mechanics copy to match current shared KB mental models:
  - `pages/mechanics/revenue-accounts-and-signing-model.md`
  - `pages/mechanics/architecture-overview.md`
- Proofs:
  - `npm run build` PASS

VERIFIER
- Acceptance criteria check: PASS.

## 2026-02-20 - Add `claw.credit` to attn-in-context comparison set (below creditcoop)
PLANNER
- Spec check: solvable. User requested adding `claw.credit` to `attn-in-context` docs and placing it at the top, right below `creditcoop.xyz`.
- Missing info/questions: none.
- Type: docs
- Status: completed
- Context + suspected cause:
  - `pages/introduction/attn-in-context.md` currently lists comparison projects but does not include `claw.credit`.
- Fix intent:
  1) Add `claw.credit` entry directly below `creditcoop.xyz` in the top comparison bullet list.
  2) Add corresponding expanded `<details>` section near the top of the project detail list.
- Acceptance criteria:
  - `claw.credit` appears immediately below `creditcoop.xyz` in the comparison list.
  - `claw.credit` has an expanded details block near the top of the section.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update `pages/introduction/attn-in-context.md` only.
  - Keep tone consistent with existing adjacent-project entries.
  - Verify with `rg` and `python3 scripts/knowledge_check.py`.

EXECUTOR
- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (not requested)
- Implemented:
  - Added `claw.credit` directly below `creditcoop.xyz` in the top comparison-set list.
  - Added a `claw.credit` expanded `<details>` section directly below the `creditcoop.xyz` detail section.
  - File updated:
    - `pages/introduction/attn-in-context.md`
- Proofs:
  - `rg -n "creditcoop\\.xyz|claw\\.credit|Autonomous credit for AI agents|x402|t54 risk engine" pages/introduction/attn-in-context.md` -> expected matches present with `claw.credit` at top placement.
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`

VERIFIER
- Compare proofs to acceptance criteria: PASS
  - PASS: `claw.credit` appears immediately below `creditcoop.xyz` in the comparison list.
  - PASS: `claw.credit` details block is present near the top (immediately after `creditcoop.xyz` details).

## 2026-02-20 - Sync docs favicon with frontend favicon assets
PLANNER
- Spec check: solvable. User requested updating docs favicon to match frontend.
- Missing info/questions: none.
- Type: docs
- Status: completed
- Context + suspected cause:
  - `attnmarkets-docs/public/favicon.svg` and `public/favicon.ico` hashes differ from `attn-frontend/apps/attncredit-landing/public/` source assets.
- Fix intent:
  1) Copy frontend `favicon.svg` and `favicon.ico` into docs repo public assets.
  2) Verify hashes now match frontend source files.
- Acceptance criteria:
  - Docs `public/favicon.svg` and `public/favicon.ico` match frontend assets.
- Complexity: tiny
- Executor prompt (files, constraints, tests):
  - Update only:
    - `public/favicon.svg`
    - `public/favicon.ico`
  - Verify with `shasum` and run `python3 scripts/knowledge_check.py`.

EXECUTOR
- [x] report captured
- [x] context added
- [x] fix applied
- [x] tests run
- [x] visual/screenshot verification (not requested)
- Implemented:
  - Copied frontend favicon assets into docs:
    - `public/favicon.svg`
    - `public/favicon.ico`
- Proofs:
  - `shasum` comparison now matches exactly between:
    - `/Users/user/PycharmProjects/attn-frontend/apps/attncredit-landing/public/favicon.svg`
    - `/Users/user/PycharmProjects/attnmarkets-docs/public/favicon.svg`
    - `/Users/user/PycharmProjects/attn-frontend/apps/attncredit-landing/public/favicon.ico`
    - `/Users/user/PycharmProjects/attnmarkets-docs/public/favicon.ico`
  - `python3 scripts/knowledge_check.py` -> `OK: knowledge base checks passed.`

VERIFIER
- Compare proofs to acceptance criteria: PASS
  - PASS: docs `public/favicon.svg` and `public/favicon.ico` now match frontend assets.
