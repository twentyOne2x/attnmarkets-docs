# attnCredit Engine and attnUSD

This page is the canonical technical model for **attnCredit**.

attnCredit is a revolving credit system for onchain businesses, with repayment automated from routed cashflows.

Hover highlighted terms for quick glossary definitions.

## 1. Core objects

- **Revenue account**
  Controlled destination for eligible fee flows (typically a Squads multisig + vault setup with timelocks and spending-limit allowlists).
- **Facility**
  Revolving credit agreement with dynamic limits and servicing rules.
- **<abbr title="Risk-adjusted lendable amount calculated from collectable routed revenue.">Borrowing base</abbr>**
  Risk-adjusted lendable amount derived from observed collectable revenue.
- **Credit pool**
  Capital bucket with its own risk policy (Pump lane or Settlement lane).
- **<abbr title="LP portfolio share token over managed credit pool exposure and performance.">attnUSD</abbr>**
  LP share in one or more managed credit pools, marked from underlying facility performance.

## 2. Control plane

The control plane enforces collection and repayment integrity:

- approved routing into controlled revenue accounts,
- signer policy and timelocks for sensitive config updates,
- spending-limit allowlists that constrain automated sweeps to approved destinations,
- restricted payout paths during stress/default modes,
- auditability for config changes and operational actions.

See also: [Revenue Accounts and Signing Model](./revenue-accounts-and-signing-model.md).

## 3. Credit policy

Each facility computes lendable capacity from cashflow quality and enforceability.

Policy components:

- trailing revenue windows,
- concentration and volatility haircuts,
- enforceability horizon,
- reserve requirements (including <abbr title="Debt Service Reserve Account: reserve buffer for scheduled debt service under policy.">DSRA</abbr> thresholds where required),
- lane-level and borrower-level caps.

## 4. Servicing policy

Servicing is continuous and rule-based:

- **<abbr title="Automated repayment sweeps from routed revenue into debt service paths.">Hard sweeps</abbr>:** routed fees are swept to debt service according to policy.
- **<abbr title="Rule that requires utilization to drop below configured thresholds on schedule.">Mandatory paydown</abbr>:** utilization must periodically drop below policy thresholds.
- **<abbr title="Real-time availability updates based on revenue and risk signal changes.">Dynamic limits</abbr>:** availability updates as revenue and risk signals change.
- **<abbr title="Controlled increases in facility capacity when performance conditions are met.">Step controls</abbr>:** well-performing facilities can step up within cap rules.

## 5. Shock policy

When risk deteriorates, controls escalate deterministically:

- **<abbr title="First stress mode: reduce draw availability and increase sweep intensity.">Throttle mode</abbr>:** reduce draw availability and increase sweep intensity.
- **<abbr title="Intermediate stress mode: tighten parameter bands and require faster deleveraging.">Protect mode</abbr>:** tighten parameter bands and require faster deleveraging.
- **<abbr title="Hard stop mode: block new draws while repayment routing stays active.">Freeze mode</abbr>:** block new draws while repayment routing remains active.

Typical trigger classes:

- sudden fee drawdowns,
- volatility regime shifts,
- routing/control integrity failures,
- covenant breaches.

## 6. Default and acceleration policy

If stress is not cured, facilities enter deterministic default handling:

- new borrowing remains frozen,
- all eligible routed fees service repayment,
- acceleration rules apply where policy requires,
- cure and resolution states are logged for audit and reporting.

## 7. Capital segmentation (two lanes)

### 7.1 Pump lane (wedge / proving ground)

- high-volatility borrower profile,
- tighter caps and faster control reactions,
- high-yield pricing consistent with tail risk and operating cost,
- fully automated policy enforcement.

### 7.2 Settlement lane (settlement liquidity lane)

- conservative settlement liquidity profile,
- stricter reporting and governance requirements,
- lower-variance underwriting box,
- buyer profile: issuer/treasury/capital markets.

### 7.3 No early commingling

Lanes operate with separate credit pools and risk boxes in early stages.

## 8. attnUSD model

<abbr title="LP portfolio share token over managed credit pool exposure and performance.">attnUSD</abbr> is a portfolio share over managed credit pool exposure:

- NAV reflects credit pool composition, facility performance, reserves, and realized losses/recoveries.
- There is no implied 1:1 principal guarantee.
- Disclosure is credit-pool-explicit (allocation, utilization, performance, incidents).

See also: [For Liquidity Providers](../users/for-liquidity-providers.md).

## 9. Lender-grade tape

The reporting package includes:

- facility-level balances, utilization, and repayment flows,
- sweep performance and exceptions,
- configuration-change logs and approvals,
- incident timeline and drill outcomes,
- lane/credit-pool exposure snapshots and concentration metrics.

Related pages:

- [Risk, Limits, and Concentration Framework](./risk-and-limits.md)
- [Pricing, Spreads, and Core Parameters](./pricing-and-parameters.md)

## 10. Legacy note (PT/YT)

Earlier versions of these docs described positions with PT/YT vocabulary.
That abstraction is now legacy context, not the primary product model.
The canonical model is facility underwriting + servicing + control modes as described above.
