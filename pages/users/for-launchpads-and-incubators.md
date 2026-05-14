# For Launchpads & Incubators

This page is for launchpads and ecosystem operators reviewing whether a routed revenue lane could support attn Credit.

## What attn provides

- revenue-account setup patterns,
- policy-bounded facility design,
- repayment servicing requirements,
- monitoring and evidence requirements,
- lane-aware capital allocation standards.

## Why it fits launchpads

- projects can become reviewable for working capital,
- repayment can be tied to routed fees when controls are explicit,
- risk controls are visible to reviewers,
- facility size should follow observed performance, not launch claims.

The current near-term borrower expression is still the Pump creator-fee lane. Broader partner distribution remains review-only until a specific lane has proof, controls, and funding context.

For partners that keep their own wallet and payout infrastructure, the correct near-term shape is narrower:

- first lane funded from attn private treasury,
- partner-managed wallet stack retained,
- and qualification based on explicit payout, control, and readback requirements rather than forced migration into Swig or Squads.

If you want the concrete creator-fee platform handoff guide, use:

- [Partner-managed revenue integration guide](./partner-managed-creator-fee-integration.md)

## Review model

1. Verify project fee-routing readiness.
2. Configure revenue-account control policy (timelock + spending limits).
3. Apply underwriting and lane assignment.
4. Start servicing and reporting loops.

## Risk and operations expectations

- mandatory paydown and utilization discipline,
- dynamic limit updates under changing revenue,
- deterministic throttle/freeze/default controls,
- no early commingling between high-volatility and conservative credit pools.

## Related pages

- [Partner-managed wallet integration requirements](../mechanics/partner-wallet-integration-requirements.md)
- [Partner-managed revenue integration guide](./partner-managed-creator-fee-integration.md)
- [attn Credit Engine and attnUSD](../mechanics/pt-yt-attnusd.md)
- [Risk, Limits, and Concentration Framework](../mechanics/risk-and-limits.md)
- [For Liquidity Providers](./for-liquidity-providers.md)
