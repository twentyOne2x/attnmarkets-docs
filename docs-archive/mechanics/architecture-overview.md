# Architecture Overview

attnCredit is organized around control, underwriting, servicing, and reporting.
The architecture is designed so repayment enforcement and risk controls are observable and deterministic.

## 1. Core components

- **Revenue Account Layer**
  - Controlled vault destinations for eligible fee flows.
  - Routing verification and account health checks.

- **Control Plane**
  - Signer policy, timelocks, and restricted config-change paths.
  - Guardrails for payout permissions and emergency mode transitions.

- **Credit Engine**
  - Computes borrowing base from trailing collectable revenue.
  - Applies haircuts, concentration controls, and lane/borrower caps.

- **Servicing Engine**
  - Executes sweeps, utilization checks, mandatory paydown enforcement.
  - Handles throttle/freeze/default state transitions.

- **Risk Engine**
  - Monitors drawdown, volatility, concentration, and control-integrity signals.
  - Emits trigger events to tighten limits or escalate modes.

- **Monitoring and Tape**
  - Produces facility-level reporting, reconciliations, and incident logs.
  - Maintains operational audit history for lenders and governance.

- **Capital Sleeves and attnUSD**
  - Separate Pump and Settlement sleeves.
  - attnUSD reflects sleeve-level portfolio exposure and performance.

## 2. Data flows (simplified)

1. **Onboard and route**
   - Borrower routes eligible fees to controlled revenue accounts.
   - Control plane validates config and policy compliance.

2. **Underwrite and size**
   - Credit engine computes initial limit and policy bounds.
   - Facility is assigned to the appropriate sleeve policy.

3. **Draw and serve**
   - Borrower draws within current availability.
   - Servicing engine runs sweeps and utilization discipline checks.

4. **Monitor and adjust**
   - Risk engine watches live signals.
   - Limits tighten or loosen according to policy and lane constraints.

5. **Escalate if needed**
   - Triggered transitions move facility into throttle, freeze, or default handling.
   - Routing continues to prioritize debt service during stress modes.

6. **Report and reconcile**
   - Monitoring outputs lender tape and governance summaries.
   - LP-facing metrics roll up by sleeve and portfolio.

## 3. Lane separation in architecture

- **Pump lane**
  - Higher volatility assumptions, tighter caps, faster control reactions.
- **Settlement lane**
  - Conservative underwriting, stricter reporting/governance profile.
- **No early commingling**
  - Separate sleeve accounting and risk limits in early phases.

## 4. Related pages

- [How attnCredit works (non-technical)](./how-it-works-nontechnical.md)
- [attnCredit Engine and attnUSD](./pt-yt-attnusd.md)
- [Risk, Limits, and Concentration Framework](./risk-and-limits.md)
- [Pricing, Spreads, and Core Parameters](./pricing-and-parameters.md)
