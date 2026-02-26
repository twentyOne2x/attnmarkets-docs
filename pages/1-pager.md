# attnCredit - Revenue-Backed Credit for Onchain Businesses

attnCredit helps onchain businesses turn routed revenue into working capital.
Think YouLend-style revenue financing, rebuilt for onchain businesses with programmable repayment rails and onchain-verifiable controls.

## What this is

attnCredit is a revolving credit and control system designed to do two things at once:
- give businesses faster access to capital against observable cashflows,
- keep lender risk bounded with deterministic controls and monitoring.

## Product system

- **Control plane:** revenue account setup, signer policy, timelocks, and spending constraints.
- **Credit engine:** dynamic borrowing base, policy-based limit adjustments, and pricing bands.
- **Servicing engine:** repayment-first sweeps, mandatory paydown checks, and freeze/default handling.
- **Monitoring and tape:** loan-level reporting, reconciliations, event logs, and incident history.

## Operating lanes (separated by design)

- **Pump lane (proving ground):**
  higher-volatility revenue advances and lines with tighter caps and stricter automation.
- **Settlement lane (institutional path):**
  conservative settlement liquidity revolvers with institutional reporting expectations.
- **No early commingling:**
  lane-specific risk boxes and separate credit pools.

## Lifecycle (from setup to servicing)

1. Set up routed revenue controls and signer posture.
2. Verify enforceability posture before activation.
3. Activate facility with policy-bound parameters.
4. Run continuous servicing and repayment-first cashflow handling.
5. Monitor for weakening signals and trigger freeze workflows when required.

## Why this sequencing

- Pump lane generates operating proof quickly.
- The same control rails can then support lower-volatility settlement flows.
- Servicing history and incident discipline improve long-term financeability.

## Governance and risk policy

Governance scope centers on:
- pool-level exposure caps,
- parameter bands for limits and throttles,
- reserve and loss-allocation policy,
- reporting standards and incident discipline.

## Roadmap shape

1. Scale Pump lane with strict controls and bounded exposure.
2. Build repeatable servicing tape and incident response evidence.
3. Expand settlement lane with separate capital and reporting standards.
4. Add allocator layer only after independent credit pools are proven.

## Next actions

> **What to do next**
>
> - [Estimate credit line](https://app.attn.markets/credit-line)
> - [View demo dashboard](https://app.attn.markets/monitoring)
> - [Read non-technical overview](./mechanics/how-it-works-nontechnical.md)
