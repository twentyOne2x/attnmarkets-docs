# For Pump.fun Creators, Devs, and Memecoin CTOs

This page is for teams with real onchain fee flow that need short-cycle working capital.

## Your situation

You have:

- recurring creator or protocol earnings,
- active build and distribution costs,
- a need to fund operations without repeatedly selling token inventory.

attnCredit helps convert routed earnings into an enforceable financing facility.

## What you get

### 1. Controlled revenue account

Your eligible earnings are routed into a configured revenue account with clear policy behavior:

- if no facility is active, withdrawals follow normal policy,
- if a facility is active, debt service sweeps are prioritized.

This makes repayment legible and auditable.

Implementation note (v1): this is typically implemented as a Squads-controlled revenue account (timelocked config + spending limits),
so sweeps to repayment can run without giving an executor broad permissions.

### 2. Revenue-swept advances

You can take a short-dated advance against a policy-defined share of expected earnings.

Typical use cases:

- funding content and growth cycles,
- paying contractors and infra costs,
- bridging short operating windows.

### 3. Scaling into revolving lines

As flow continuity improves, facilities can move from one-off advances to revolving usage:

- dynamic limits based on observed revenue,
- mandatory utilization discipline,
- deterministic throttle/freeze behavior under stress.

## Typical flow (timeline)

```text
Apply -> Route fees -> Draw -> Sweeps -> Close
```

1. **Apply**
   Share recent fee-flow history and operating requirements.
2. **Route fees**
   Configure eligible earnings into the controlled revenue account.
3. **Draw**
   Access short-cycle advance liquidity within approved policy limits.
4. **Sweeps**
   Automated repayment sweeps run from routed earnings while the facility is active.
5. **Close**
   Facility winds down after repayment and returns to normal operating policy.

## Optional collateral extensions

For larger tickets, launchpad or DAO structures can add collateral overlays while keeping repayment anchored in routed earnings.

See: [For Launchpads & Incubators](./for-launchpads-and-incubators.md)

## What to communicate to your community

Teams should disclose:

- what share of routed earnings is pledged,
- what facility proceeds are used for,
- how policy controls protect repayment discipline.

## Related pages

- [View demo app](https://app.attn.markets/credit-line)
- [How attnCredit works (non-technical)](../mechanics/how-it-works-nontechnical.md)
- [attnCredit Engine and attnUSD](../mechanics/pt-yt-attnusd.md)
- [Risk, Limits, and Concentration Framework](../mechanics/risk-and-limits.md)
