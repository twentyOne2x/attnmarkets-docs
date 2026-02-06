# Risk, Limits, and Concentration Framework

attnCredit manages risk through policy-bounded underwriting plus deterministic servicing controls.
The objective is controlled loss behavior under stress, not discretionary reaction.

## 1. Risk types

- **Cashflow risk**
  Revenue declines, volatility shocks, or unstable fee continuity.
- **Concentration risk**
  Overexposure to one borrower, source, or correlated cohort.
- **Control-integrity risk**
  Routing changes, signer/config drift, or policy bypass attempts.
- **Liquidity risk**
  Redemption and funding pressure at credit pool level.
- **Operational risk**
  Execution delays, monitoring faults, or incident response failures.

## 2. Facility-level limits

Each facility is bounded by policy limits such as:

- borrowing base from trailing collectable fees,
- volatility and concentration haircuts,
- utilization ceiling and mandatory paydown windows,
- max outstanding and draw cadence constraints,
- reserve and DSRA requirements where applicable.

## 3. Lane-level and portfolio limits

- **Pump lane**
  - lower borrower caps,
  - tighter concentration bands,
  - faster throttling and stricter freeze thresholds.
- **Settlement lane**
  - conservative concentration profile,
  - stronger reporting/covenant expectations,
  - slower but stricter governance-controlled parameter changes.

No early commingling: lane limits and credit pool accounting stay separate.

## 4. Deterministic control modes

### 4.1 Throttle mode

Activated when risk worsens but remains serviceable.
Effects:

- draw availability reduced,
- sweep intensity increased,
- step-up privileges suspended.

### 4.2 Freeze mode

Activated when risk exceeds safe operating range.
Effects:

- new draws blocked,
- routing and sweeps continue,
- operations constrained to servicing and cure actions.

### 4.3 Default/acceleration mode

Activated when cure conditions fail or severe events occur.
Effects:

- all eligible routed fees prioritize repayment,
- policy-defined acceleration behavior applies,
- recovery and resolution actions are logged and reported.

## 5. Trigger classes and governance

Trigger classes include:

- fee drawdown and volatility shocks,
- concentration breaches,
- routing/signing integrity failures,
- covenant breaches and unresolved exceptions.

Governance scope:

- parameter bands and cap updates,
- reserve policy,
- lane-level risk budgets,
- incident and drill standards.

## 6. LP impact model

- Losses and recoveries are reflected at credit pool level.
- attnUSD holders are exposed according to credit pool composition.
- There is no implied principal guarantee.

## 7. Related pages

- [attnCredit Engine and attnUSD](./pt-yt-attnusd.md)
- [Pricing, Spreads, and Core Parameters](./pricing-and-parameters.md)
- [For Liquidity Providers](../users/for-liquidity-providers.md)
