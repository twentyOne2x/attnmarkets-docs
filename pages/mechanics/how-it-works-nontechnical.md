# How attnCredit Works (Non-Technical)

attnCredit gives onchain businesses liquidity against routed fees while enforcing repayment through automation and controls.

## 1. The actors

- **Borrower:** routes eligible fees and draws from a facility.
- **attn operator stack:** runs policy, servicing, monitoring, and controls.
- **LPs / capital providers:** fund sleeves and receive risk-adjusted exposure.
- **Partners (issuer/treasury stacks):** consume settlement liquidity facilities in the conservative lane.

## 2. Step one: route revenue into a controlled vault

A borrower configures fee routing so eligible revenue flows into a controlled vault account.

Core purpose:

- make repayment collectible,
- make limits measurable,
- make control actions enforceable.

## 3. Step two: limits are set from observed cashflows

The system computes a dynamic lendable amount using trailing revenue and risk policy.

Inputs include:

- revenue continuity and volatility,
- concentration,
- enforceability horizon,
- reserve requirements.

## 4. Step three: borrower draws from the facility

Borrowers can draw up to current availability, subject to lane and policy rules.

Two lane contexts:

- **Pump lane:** tighter caps and faster throttles.
- **Settlement lane:** conservative profile and institutional reporting expectations.

## 5. Step four: servicing runs continuously

Once a facility is active:

- routed fees are swept to debt service,
- utilization discipline is checked continuously,
- limits update when risk changes.

## 6. Step five: utilization discipline is enforced

Borrowers cannot remain permanently maxed out.

If utilization fails policy requirements:

- draw capacity tightens,
- new draws can be frozen,
- sweep intensity can increase.

## 7. Step six: stress controls activate when needed

If revenue deteriorates or risk spikes:

- throttle mode reduces availability,
- freeze mode stops new draws,
- acceleration/default mode can route all eligible fees to repayment.

## 8. Step seven: LPs see sleeve-level exposure and tape

LPs receive exposure through sleeves (and attnUSD where applicable), with reporting on:

- balances and utilization,
- sweep and repayment behavior,
- incidents and corrective actions,
- concentration and performance by lane.

## 9. What this is not

- Not an unsecured blank-check credit model.
- Not a principal-guaranteed cash-equivalent token.
- Not a single commingled risk pool in early stages.

## 10. Where to go deeper

- [attnCredit Engine and attnUSD](./pt-yt-attnusd.md)
- [Risk, limits, and control modes](./risk-and-limits.md)
- [Pricing and parameter policy](./pricing-and-parameters.md)
- [For Liquidity Providers](../users/for-liquidity-providers.md)
