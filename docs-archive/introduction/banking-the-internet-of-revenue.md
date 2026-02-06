# Banking the Internet of Revenue

attn treats onchain revenue as financeable cashflow when repayment is enforceable and observable.

## 1. Core model

The attnCredit model combines:

- controlled routing of eligible fees,
- dynamic underwriting from observed cashflows,
- automated servicing through sweeps,
- deterministic control modes under stress.

## 2. Products built on the model

### 2.1 Revenue-swept advances

- borrower routes fees into a controlled vault,
- facility is sized from risk-adjusted trailing revenue,
- repayment is serviced directly from routed flows.

### 2.2 Revenue-backed revolving lines

- availability updates as risk and cashflows change,
- utilization discipline and paydown rules are enforced,
- stress controls can tighten or freeze new draws.

## 3. attnUSD for LP exposure

attnUSD represents sleeve-level exposure to managed facility portfolios.
It is not framed as principal-guaranteed yield.

## 4. Lane strategy

- **Pump lane:** proving ground for high-volatility flow with strict controls.
- **Settlement lane:** conservative settlement liquidity facilities for institutional buyer profiles.

Early-stage sleeve separation avoids commingled risk.

## 5. Why this matters

This model moves from narrative credit to operational credit:

- repayment is enforced, not requested,
- risk responses are policy-bounded, not ad hoc,
- reporting is loan-level and auditable.

## 6. Go deeper

- [How attnCredit works (non-technical)](../mechanics/how-it-works-nontechnical.md)
- [attnCredit Engine and attnUSD](../mechanics/pt-yt-attnusd.md)
- [Risk, Limits, and Concentration Framework](../mechanics/risk-and-limits.md)
