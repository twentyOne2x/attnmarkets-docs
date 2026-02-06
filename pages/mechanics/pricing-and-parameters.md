# Pricing, Spreads, and Core Parameters

Pricing is policy-driven and lane-specific.
Rates reflect cashflow volatility, enforceability strength, operational cost, and expected loss behavior.

## 1. Objectives

- price risk transparently,
- reward stable repayment behavior,
- tighten economics under stress,
- keep lane risk boxes distinct.

## 2. Core knobs per facility

- **Borrowing base inputs**
  Trailing fees, continuity, concentration, and volatility haircuts.
- **Target repayment profile**
  Principal plus fees over policy-defined service windows.
- **Utilization discipline**
  Mandatory paydown thresholds and windows.
- **Control-mode multipliers**
  Throttle/freeze/default behavior modifies availability and economics.
- **Reserve settings**
  DSRA/reserve requirements where policy applies.

## 3. Pump lane policy

Pump lane pricing reflects high-volatility cashflows and tighter control operations.

Typical characteristics:

- higher base rates,
- tighter caps,
- faster repricing when risk signals worsen,
- stricter step-up criteria.

## 4. Settlement lane policy

Settlement lane pricing reflects conservative underwriting and institutional reporting requirements.

Typical characteristics:

- lower volatility assumptions,
- tighter eligibility and concentration standards,
- slower but governance-bounded repricing,
- stronger covenant and reporting expectations.

## 5. Dynamic adjustments

Pricing and limits adjust based on observed behavior:

- consistent repayments can improve availability within policy,
- adverse signals tighten limits and can increase effective cost,
- unresolved stress transitions facilities into stricter control modes.

## 6. Governance cadence

Governance reviews and updates:

- parameter bands by lane,
- cap frameworks and concentration thresholds,
- reserve policy,
- disclosure and reporting standards.

## 7. Related pages

- [Risk, Limits, and Concentration Framework](./risk-and-limits.md)
- [attnCredit Engine and attnUSD](./pt-yt-attnusd.md)
- [Roadmap (Indicative)](../roadmap.md)
