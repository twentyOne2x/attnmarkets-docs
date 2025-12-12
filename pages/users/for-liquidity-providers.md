# For Liquidity Providers

This page is for:

- funds  
- DAOs  
- yield-focused individuals,

who want to deploy capital into **revenue-backed yield** rather than only trading tokens.

---

## What you hold when you hold attnUSD

attnUSD is a **USD-denominated share** backed by:

- a basket of stablecoins (USDC, USDT, USDe, USDC+),  
- revenue-backed advances and loans to:
  - apps  
  - creators  
  - DAOs  
  - other revenue-generating onchain businesses.

You deposit stables and receive attnUSD. Over time:

- as loans amortise and revenue products pay in (or default),  
- the vault’s value moves,  
- and attnUSD tracks that value.

It is **not** a pure 1:1 stablecoin:

- it can trade above or below 1,  
- depending on performance and losses.

---

## Where your yield comes from

Yield comes from:

- interest and revenues on revenue advances,  
- spreads on revenue-backed credit lines,  
- where applicable, underlying base yield on pledged assets (e.g. if pledged revenues are held in staked SOL or yield-bearing stablecoins),  
- economics shared from more complex products (e.g. hybrid vesting + revenue structures).

It does **not** come from:

- pure token emissions without underlying business,  
- hidden leverage on unrelated risky assets (unless explicitly disclosed).

---

## What risks you take

High-level risks include:

- **Credit risk** – some projects will underperform or default.  
- **Stablecoin risk** – any basket asset can be impaired.  
- **Concentration risk** – poor diversification can make one failure more painful.  
- **Operational and program risk** – Solana, programs, keepers, or routes can fail.

The detailed mechanics live in:

- [PT, YT, and attnUSD – Technical Design](../mechanics/pt-yt-attnusd.md)  
- [LP Guide](../mechanics/lp-guide.md)

The key point:

> You are explicitly buying revenue-backed credit risk (plus, in some cases, underlying base yield) in exchange for returns.

This is different from assuming you always get 1:1 back in any circumstance.

---

## Example scenarios

<details>
<summary>Example – Steady performance</summary>

- Vault TVL: $40M in stables and revenue loans.  
- Over a year:
  - revenue products make ~8% net yield after losses,  
  - operations and costs absorb 2%.

Result:

- net ~6% yield flows into the vault,  
- NAV per share increases from 1.00 to ~1.06,  
- your attnUSD position tracks that appreciation.

</details>

<details>
<summary>Example – One large default</summary>

- One large project, representing 10% of the revenue book, fails badly.  
- Recovery is only 20% of principal on that slice.

Effect:

- ~8% hit to the vault NAV from that position,  
- partially offset if other positions perform well,  
- NAV per share could dip from 1.06 to ~0.99, for example.

The exact numbers depend on diversification, reserves, and how the rest of the book performs.

</details>

---

## How you can participate

You can choose how far you go down the stack:

1. **attnUSD only**  
   - treat it as a diversified revenue-backed yield position.

2. **PT/YT and structured products (later phases)**  
   - buy specific revenue bonds,  
   - buy or sell specific revenue slices,  
   - provide liquidity in PT/USDC pools, etc.

The first phase of the protocol is designed so you mainly need to understand:

- what backs attnUSD,  
- what the yield is,  
- how defaults and losses are handled.

The detailed mechanics live in:

- [PT, YT, and attnUSD – Technical Design](../mechanics/pt-yt-attnusd.md)  
- [LP Guide](../mechanics/lp-guide.md)
