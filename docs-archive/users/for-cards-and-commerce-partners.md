# For Cards, Commerce, and Settlement Partners

attnCredit provides settlement liquidity facilities and repayment servicing rails for issuer, treasury, and commerce stacks.

## What attn provides

- revenue-account routing and control setup,
- revolving settlement liquidity facilities,
- automated sweeps and utilization discipline,
- deterministic stress-mode controls,
- lender-grade reporting and reconciliation outputs.

## Primary buyer profile

attn is typically sold to:

- issuer treasury teams,
- capital-markets / structured-credit teams,
- operating partners managing settlement timing gaps.

## Integration patterns

### 1) Settlement liquidity revolver

- Facility sized from routed receivables and policy limits.
- Draws support settlement timing and working-capital gaps.
- Sweeps service repayment directly from eligible routed flows.

### 2) Embedded card/commerce operating support

- Policy-aware top-up behavior for approved settlement paths.
- Tight controls on draw availability during stress regimes.
- Reconciliation outputs for treasury and finance workflows.

### 3) Expansion lanes

- Additional payment/commerce workflows can be added if they reuse the same control and servicing rails.

## Risk and control expectations

Partners should expect:

- hard repayment prioritization from routed fees,
- lane-specific underwriting and concentration policy,
- freeze/default escalation behavior,
- auditable config changes and incident response.

## How this maps to lane strategy

- **Pump lane** proves rails and servicing performance under higher-volatility conditions.
- **Settlement lane** applies the same control plane in a conservative underwriting box with separate capital.

## Related pages

- [Architecture Overview](../mechanics/architecture-overview.md)
- [Risk, Limits, and Concentration Framework](../mechanics/risk-and-limits.md)
- [For Liquidity Providers](./for-liquidity-providers.md)
- [Roadmap (Indicative)](../roadmap.md)
