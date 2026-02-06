# attnCredit Docs Pivot Plan

## 1) Goal

Reposition the docs from a **PT/YT-led framing** to an **attnCredit-led framing**:

- `attnCredit` = revenue-underwritten, onchain-enforced revolving credit.
- Core controls = routed revenue accounts, automated sweeps, dynamic limits, mandatory paydown, freeze/default modes, and lender-grade monitoring tape.
- PT/YT should no longer be the primary user mental model.

## 2) New Positioning (Canonical)

Use this as the default framing across all pages:

- attn is a **credit control plane** for onchain fee businesses.
- Borrowers get fast liquidity against routed fees.
- Lenders get hard repayment rails and deterministic risk controls.
- Product is split into **two lanes**:
  - **Pump lane (wedge):** high-yield, high-volatility, tight caps, fully automated.
  - **Settlement lane (serious):** conservative settlement liquidity revolver, separate capital sleeve, institutional reporting.
- These lanes are **not commingled** early.

## 3) Messaging Rules

### 3.1 Replace old terms

- Replace "PT/YT-backed credit" with "revenue-swept credit facilities."
- Replace "yield-stripping representation" with "facility + servicing model."
- Replace "attnUSD as yield token exposure" with "attnUSD as LP share in managed credit sleeves."

### 3.2 Keep risk language lender-grade

Prefer:

- "self-amortizing revolver"
- "revenue-swept borrowing base facility"
- "settlement liquidity against routed receivables"
- "dynamic borrowing base + throttles"

Avoid:

- "permissionless leverage"
- "degen leverage" (internal slang only)
- "monopoly pricing"

## 4) Information Architecture Changes

### 4.1 Replace mechanics anchor page

- Replace `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/pt-yt-attnusd.md`
  - New title suggestion: `attnCredit Engine and attnUSD`.
  - Keep one short "legacy model" note explaining PT/YT was an earlier modeling abstraction.

### 4.2 Update sidebar label

- Update `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/_meta.js`
  - From: `PT / YT / attnUSD`
  - To: `attnCredit engine`

### 4.3 Optional URL hygiene

- If you rename the file path, keep a redirect/alias from old PT/YT URL.
- If you keep the same slug, fully rewrite content in place for minimal breakage.

## 5) Page-by-Page Edit Plan

### P0 (must change first)

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/index.md`
  - New one-line value prop: revenue-swept credit + cash management + lender controls.
  - Remove "USD yield token" wording.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/1-pager.md`
  - Replace PT/YT positioning with attnCredit wedge strategy.
  - Add explicit "Pump lane now, Settlement lane in parallel" narrative.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/pt-yt-attnusd.md`
  - Rewrite into attnCredit system spec:
    - Vault routing and enforceable controls
    - Borrowing base and cap calculations
    - Mandatory paydown and freeze logic
    - DSRA thresholds
    - Monitoring, reporting, and incident playbooks
    - attnUSD sleeve exposure model

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/how-it-works-nontechnical.md`
  - Reframe lifecycle around facility servicing (not claim-token mechanics).
  - Keep product examples but tie to sweeps/paydown/throttles.

### P1 (high priority)

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/architecture-overview.md`
  - Replace PT/YT layer with `Credit Engine`, `Servicing Engine`, `Risk Engine`, `Monitoring/Tape`.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/risk-and-limits.md`
  - Add hard triggers and deterministic default modes.
  - Separate risk boxes for Pump vs Settlement lanes.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/mechanics/pricing-and-parameters.md`
  - Add lane-specific pricing policy.
  - Replace principal-token references with facility balances, utilization, and repayment bands.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/users/for-liquidity-providers.md`
  - Explain sleeves, commingling policy, and reporting expectations.
  - Clarify high-yield sleeve vs conservative sleeve.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/users/for-cards-and-commerce-partners.md`
  - Shift to settlement liquidity language for issuer/treasury buyers.
  - Emphasize controls, reconciliation, and operating reliability.

### P2 (consistency pass)

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/introduction/vision-attn.md`
  - Explain Pump as rails-proving wedge, not end-state identity.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/introduction/banking-the-internet-of-revenue.md`
  - Replace PT/YT under-the-hood sections with attnCredit servicing flow.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/introduction/attn-in-context.md`
  - Keep comparison, but frame attn as credit/control-plane layer first.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/introduction/who-attn-is-for.md`
  - Update LP and partner value props for sleeve separation and reporting.

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/roadmap.md`
  - Phase framing should reference:
    - live Pump lane tape
    - institutional settlement lane onboarding
    - warehouse/forward-flow readiness

- `/Users/user/PycharmProjects/attnmarkets-docs/pages/tokenomics/tokenomics-overview.md`
  - Remove PT/YT market language.
  - Add governance over sleeve caps, risk params, reserve policy.

## 6) New Sections to Add (in rewritten mechanics page)

- **Control plane**
  - Vault model, signer policy, timelocks, allowed spend paths.
- **Credit policy**
  - Borrowing base formula, haircuts, enforceability horizon.
- **Servicing policy**
  - Sweep cadence, mandatory paydown, amortization gates.
- **Shock policy**
  - Revenue drop triggers, volatility triggers, throttle schedule.
- **Default policy**
  - Freeze behavior, acceleration mode, "all fees to repay."
- **Capital segmentation**
  - Pump sleeve vs Settlement sleeve; no early commingling.
- **Lender tape**
  - Loan-level reporting, reconciliations, incident logs, drill outcomes.

## 7) Suggested Copy Inserts

### 7.1 Homepage strapline

"`attnCredit is a revenue-swept revolving credit engine for onchain businesses: automated repayment, dynamic limits, and lender-grade control.`"

### 7.2 Pump lane positioning

"`High-yield, high-volatility revenue advances with strict caps, mandatory paydown, and deterministic freeze rules.`"

### 7.3 Settlement lane positioning

"`Conservative settlement liquidity facilities for issuer/treasury stacks, with separate capital sleeves and institutional reporting.`"

## 8) Rollout Sequence

1. Rewrite core mechanics page + sidebar label.
2. Update homepage and 1-pager.
3. Update LP + cards/commerce audience pages.
4. Update intro/context pages and roadmap/tokenomics.
5. Run consistency/lint pass and link checks.

## 9) QA Checklist

- No primary-value-prop references to PT/YT remain in `pages/`.
- All old PT/YT links resolve to rewritten attnCredit mechanics content.
- Pump and Settlement are explicitly separated in copy and risk framing.
- LP docs explicitly state sleeve segregation and risk profile differences.
- Risk docs include freeze/default/acceleration behaviors.
- `docs-archive/` is either synced or intentionally marked as historical.

## 10) Definition of Done

- A first-time reader can answer, from docs alone:
  - What attnCredit is.
  - How repayment is enforced.
  - How limits are set and reduced under stress.
  - Why Pump lane does not contaminate Settlement lane.
  - What lenders receive in monitoring/reporting.
