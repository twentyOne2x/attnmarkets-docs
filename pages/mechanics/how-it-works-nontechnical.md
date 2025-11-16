# How attn Works (Non-Technical)

This page explains how attn works end-to-end without going into program code.

There are three main pieces:

1. **Revenue accounts** – where your onchain income lands.  
2. **Products** – advances and credit lines written against that income.  
3. **attnUSD** – the USD share token held by liquidity providers on the other side.

Everything else (PT, YT, vault accounting) exists to make these three behave in a predictable way.

---

## 1. The actors

There are four main actors:

- **Projects** – apps, DAOs, creators, DePIN networks.  
- **Launchpads / partners** – who help projects launch and structure products.  
- **Liquidity providers (LPs)** – who bring stablecoins and want yield.  
- **attn protocol** – the onchain coordination layer that:
  - hosts revenue accounts,  
  - wires up repayment rules,  
  - interfaces with PT/YT tokenisation,  
  - and runs the attnUSD vault.

---

## 2. Step one: set up a revenue account

A project connects its income to an **attn revenue account**.

Examples of revenue sources:

- Pump.fun creator rewards,  
- protocol fee switches (DEX, lending, perp, infra fees),  
- DePIN income routed onchain,  
- other programmatic revenue streams.

The revenue account is:

- a **jointly governed vault**:
  - signers: the project (multisig/DAO) + attn,  
- configured with simple rules:
  - if **no deal is open**, the project can withdraw freely,  
  - if **a deal is open**, an agreed share of new revenues goes first to repayment.

On top of that, the account can:

- move **unencumbered balances** into safe onchain yield sources (e.g. staked SOL, yield-bearing stablecoins),  
- while keeping funds instantly available for withdrawals and collateral.

From the project’s point of view, this feels like:

- “this is where my revenues land”,  
- “this account has a built-in rule set if I borrow against those revenues”,  
- “idle balances earn something by default”.

---

## 3. Step two: attn measures your revenue and sets limits

Before you can borrow, attn:

- reads your **historical revenue data** (onchain traces, indexers, dashboards),  
- looks at:
  - level and stability of income,  
  - concentration (is it all from one product or many?),  
  - volatility and drawdowns,  
- and derives **risk limits** for that revenue account.

The output is:

- a maximum **advance size** (for one-offs),  
- a maximum **credit line limit** (for revolving facilities),  
- plus guardrails on:
  - revenue share %,  
  - maximum duration,  
  - and how quickly facilities must amortise.

These limits are updated over time as more data arrives.

---

## 4. Step three: a project picks a product

Once the revenue account exists and limits are set, a project can choose:

### A) One-off revenue advance

- “Sell X% of the next N days / months of revenues for cash now.”

This is good for:

- shipping a release,  
- listings, campaigns, short bursts of hiring,  
- “bridge the next few months” type use-cases.

### B) Revenue-backed credit line

- “Get a revolving limit sized by your revenues, and repay from income as you draw.”

This is good for:

- ongoing working capital,  
- creator “lifestyle lines” backed by predictable earnings,  
- DAOs and apps that want reusable borrowing capacity.

The UI stays in business language:

- “Advance: 30% of the next 6 months for $X today.”  
- “Credit line: up to $Y, repaid from Z% of monthly revenues.”

---

## 5. Step four: what happens onchain when you open a deal

Under the hood, attn does three things when a deal is opened:

1. **Locks in a share of your future revenues** for a fixed period and/or until a target amount is repaid.  
2. **Mints claim tokens** (PT and YT) that represent:
   - the “principal” leg of the position,  
   - the “yield / cashflow” leg between now and maturity.  
3. **Matches you with capital**:
   - attnUSD vault (or other LP capital) pays you out in stablecoins,  
   - in exchange for those cashflow claims on your revenue.

You only see:

- the cash in your wallet or treasury,  
- the open “advance” or “credit line” in your dashboard,  
- the share of revenues that is now committed to repayment.

LPs only see:

- their attnUSD balance,  
- the current share price / yield,  
- high-level portfolio metrics.

The PT/YT layer exists so that products of different shapes can be standardised and risk-managed in one system.

(Details on PT/YT live in [PT, YT, and attnUSD – Technical Design](./pt-yt-attnusd.md).)

---

## 6. Step five: how repayment works

Every time new revenue hits the revenue account while a deal is open:

1. The attn logic checks:
   - which product positions are active,  
   - their agreed **revenue share** and **repayment priority**,  
   - how much each one still needs to be repaid.
2. It splits incoming revenues accordingly:
   - first into **repayment buckets** for open product positions,  
   - then any leftover stays in the project’s free balance (which can earn base yield).
3. It updates onchain state:
   - outstanding principal per deal,  
   - how much revenue has been collected,  
   - whether a deal is fully repaid, in good standing, or in default.

For a one-off advance:

- once the **target repayment amount** has been collected,  
- that deal is automatically marked as complete,  
- the revenue share drops back to 0%,  
- and all future revenues go back to the project (unless another deal is active).

For a credit line:

- revenue shares are applied to **whatever is currently drawn**,  
- as you repay and draw again, the same rules apply,  
- limits can adjust over time as performance improves or deteriorates.

---

## 7. Step six: what LPs see via attnUSD

LPs deposit stablecoins into an **attnUSD vault**.

In exchange, they receive attnUSD, a **USD-denominated share token** whose value is backed by:

- a stablecoin basket (USDC, USDT, USDe, USDC+),  
- plus a portfolio of revenue-backed advances and credit lines.

Over time:

- as positions pay in, default, and recover,  
- the vault’s **net asset value (NAV)** moves,  
- and the attnUSD share price tracks that NAV.

Yield comes from:

- interest and fees on revenue from opened positions,  
- sometimes the underlying base yield on pledged assets,  
- minus losses, operating costs, and reserves.

LPs do not have to understand each individual deal. They mainly care about:

- what backs attnUSD,  
- performance and risk metrics,  
- diversification.

(Details live in [For Liquidity Providers](../users/for-liquidity-providers.md) and the LP Guide.)

---

## 8. Failure modes and protections (high-level)

If a project underperforms:

- their revenues may be lower than expected,  
- repayment may take longer or may not reach the target amount by maturity.

The protocol’s response includes:

- **position-level controls**:
  - conservative initial limits (LTV, term, revenue share),  
  - automatic stoppage of new borrowing when performance breaks thresholds,  
  - the ability to restructure or extend positions on-chain if both sides agree.  
- **portfolio-level controls**:
  - concentration limits per project, sector, and revenue type,  
  - buffers and reserves at the attnUSD vault level,  
  - diversified exposure across many independent revenue streams.

Losses from bad positions:

- are first absorbed by any reserves,  
- then by the attnUSD vault NAV,  
- and therefore ultimately by attnUSD holders.

attnUSD is explicitly **not** a guarantee of 1:1 return of principal; it is a tokenised exposure to revenue-backed credit risk.

---

## 9. Mapping back to the user-facing story

From a project’s perspective, everything above reduces to:

- “This is my **revenue account**.”  
- “These are my **advances** and **credit line** backed by that revenue.”  
- “This is my **available balance**, some of which can earn yield while idle.”

From an LP’s perspective, it reduces to:

- “I deposit stables and receive **attnUSD**.”  
- “attnUSD gives me diversified exposure to **revenue-backed products** instead of just token price.”  
- “My return is the vault’s performance, marked transparently on-chain.”

From attn’s perspective, PT/YT and vault mechanics are the glue that makes these experiences consistent and auditable across many different revenue sources and deal shapes.
