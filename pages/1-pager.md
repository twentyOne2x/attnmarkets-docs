# attnCredit - Revenue-Swept Credit on Solana

attnCredit is **revolving credit for onchain businesses, repaid automatically from routed revenue**.
It turns routed onchain fees into lendable facilities with deterministic controls.

## Product

- **Control plane:** revenue account setup, signer policy, timelocks, and spending constraints.
- **Credit engine:** dynamic borrowing base and live limit adjustments.
- **Servicing engine:** automated sweeps, mandatory paydown checks, and freeze/default actions.
- **Monitoring and tape:** loan-level reporting, reconciliations, event logs, and incident history.

## Lanes (explicitly separated)

- **Pump lane (wedge / proving ground)**
  High-yield, high-volatility revenue advances and lines with tight caps, strict automation, and conservative controls.
- **Settlement lane (settlement liquidity lane)**
  Conservative settlement liquidity revolvers for issuer/treasury/capital-markets buyers with institutional reporting.
- **No early commingling:** separate credit pools and lane-specific risk boxes.

## Why this sequencing

- Pump lane creates live operating proof quickly.
- The same rails are reused for settlement liquidity.
- Track record and servicing tape improve institutional financeability.

## What this enables

- Fast working-capital access against routed fees for onchain businesses.
- Bounded lender exposure via sweeps, throttles, and deterministic control modes.
- A path from experimental flow to institutional-scale facilities.

## Tech stack (functional)

- Revenue account and signing controls.
- Policy engine for limits, haircuts, and lane constraints.
- Automated servicing and trigger engine.
- Monitoring/indexing and lender reporting pipeline.

## Roadmap shape

1. Launch Pump lane with strict controls and small caps.
2. Produce repeatable servicing tape and incident drills.
3. Expand settlement lane partnerships with separate capital.
4. Add allocator layer only after credit pools are proven independently.

## Governance and risk policy

Governance scope centers on:

- pool-level exposure caps,
- parameter bands for limits and throttles,
- reserve and loss-allocation policy,
- reporting standards and incident discipline.

## Next actions

> **What to do next**
>
> - [Estimate credit line](https://app.attn.markets/credit-line)
> - [View demo dashboard](https://app.attn.markets/monitoring)
> - [Read non-technical overview](./mechanics/how-it-works-nontechnical.md)
