# Banking the Internet of Revenue

attn is a protocol for **revenue-backed finance**:

1. A governed **revenue account** for your app, DAO, or token.  
2. **Revenue-based funding products** (advances and credit lines).  
3. A **USD yield token** backed by a portfolio of those products.

It starts from a simple question:

> If onchain apps and creators already have revenues,  
> why isn’t there a standard way to bank them?

Instead of one-off OTC arrangements and bespoke side deals, attn provides a repeatable structure so that:

- projects have a clear place where revenues land and rules on how they are used,  
- capital can underwrite and price revenue-backed positions in a consistent way,  
- LPs can hold a diversified USD share of many such positions.

From a user perspective, this boils down to three primitives:

- “this is my revenue account”  
- “this is my advance / credit line”  
- “this is the USD token LPs hold on the other side”

The PT / YT mechanics sit under the hood and only matter if you want to go deeper.

---

## 1. Revenue account for onchain businesses

You connect your revenue stream (for example, Pump.fun creator rewards, protocol fee switches, or DePIN income) to an **attn revenue account**.

This account is:

- jointly governed (creator / DAO + attn),  
- configured so that:
  - when **no financing is active**, you can withdraw as usual,  
  - when **a position is active**, an agreed share of incoming revenues goes first to repayment.

On top of this, the revenue account can:

- allocate **unencumbered balances** into simple onchain yield sources (e.g. staked SOL or yield-bearing stablecoins),  
- keep funds available for operations and for use as collateral, while avoiding idle balances.

Functionally, it is the onchain analogue of a **business operating account with covenants and base yield**:

- one place where revenue lands,  
- predictable rules on who gets paid when,  
- and default yield on idle balances,  
- enough structure for credit to be underwritten seriously.

---

## 2. Revenue-based funding instead of only token sales

Once revenues flow through that account, you can choose between two main product types.

### a) One-off revenue advances

You sell a defined slice of upcoming revenue for cash now.

You specify:

- the share of future revenues (e.g. 20–40%),  
- the horizon (e.g. 3, 6, 12 months).

Capital on the other side pays you upfront and, in return, receives that share of revenues until the agreed amount has been repaid.

In the UI this is presented in straightforward terms such as:

> “Sell 30% of the next 6 months of revenues for X today.”

<details>
<summary>Example – Fund a release without selling tokens</summary>

- Your protocol earns around $20,000/month in net revenues.  
- You want $30,000 to ship a new product and list on a major venue.  
- You choose to sell **40%** of the next **4 months** of revenues.

Estimates:

- 4 × $20,000 = $80,000 of revenues.  
- 40% slice = $32,000.

attn (or an LP) offers:

- $30,000 upfront,  
- in exchange for 40% of those revenues until $32,000 has been collected.

You trade 40% of 4 months of income for $30k now,  
without issuing or dumping governance tokens.

</details>

Throughout, any unpledged revenues sitting in the account can continue to earn base yield.

---

### b) Revenue-backed credit lines

For ongoing needs, you can open a **revolving credit line** sized by:

- your revenue history,  
- volatility,  
- diversification.

You receive:

- a limit in USD terms,  
- a current drawdown balance,  
- a rule such as “up to X% of new revenues goes to repayment when the line is used”.

It behaves like a **corporate revolver**, except that:

- covenants are enforced by how the revenue account routes funds,  
- adjustments can be made based on live revenue performance and risk limits.

For larger or earlier-stage projects, the line can also be backed by:

- vesting token collateral,  
- launchpad reputation,  
- and explicit commitments to route future revenues once live.

While the line is unused, unencumbered balances in the revenue account can continue to earn simple onchain yield.

---

## 3. A USD yield token backed by revenue products

On the other side of the table sit LPs.

They deposit stablecoins (USDC, USDT, USDe, USDC+) and receive **attnUSD, a USD-denominated share token** whose value is backed by:

- the underlying stablecoin basket,  
- plus the portfolio of revenue advances and credit lines.

Depending on position structure, economics can include:

- interest and fees on advances and credit lines,  
- where applicable, the underlying yield on pledged assets (e.g. if pledged revenues sit in staked or yield-bearing form).

Over time, as attn positions:

- amortise,  
- default and recover,  
- are refinanced or rolled,

the vault’s net asset value moves and the USD token tracks that.

attnUSD is **not** a promise of a fixed rate or a risk-free 1:1 stable:

- it can drift around 1 depending on portfolio performance and losses,  
- it is explicitly a way to hold **revenue-backed credit risk** in exchange for yield.

Details on the structure live in:

- [How attn works (non-technical)](../mechanics/how-it-works-nontechnical.md)  
- [PT, YT, and attnUSD – Technical Design](../mechanics/pt-yt-attnusd.md)  
- [LP Guide](../mechanics/lp-guide.md)

---

In short, “banking the internet of revenue” means:

- giving onchain businesses a proper revenue account that can also earn on idle balances,  
- letting them fund themselves from income instead of only tokens,  
- and giving LPs a clear, pooled way to own that revenue risk.
