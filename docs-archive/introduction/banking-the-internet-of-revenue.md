# Banking the Internet of Revenue

attn is a **revenue bank** for onchain businesses.

It is **Solana-native and fully onchain**:
- no KYC
- no bank-account linking
- no credit-score or offchain asset proofs
- no offchain data wrangling

You only connect **onchain revenue routes**. Credit and yield are written strictly against those routed revenues, with transparent onchain rules.

Concretely, it gives you three things:

1. A governed **revenue account** for your app, DAO, or token.  
2. **Revenue-backed financing rails** (one-off advances and revolving credit lines).  
3. **attnUSD**, a USD share token backed by a portfolio of those positions and stablecoins.

This page is the product view: what lives where, how money moves, and what each side sees.

---

## 1. Revenue account: where revenues land and how they are routed

You connect your revenue stream (Pump.fun creator rewards, protocol fee switches, DePIN income, etc.) to an **attn revenue account**. 

At a high level, this account is:

- a jointly governed vault (e.g. creator / DAO + attn for configuration),  
- the canonical destination for protocol / creator revenues,  
- the place where repayment logic is enforced.

### 1.1 Behaviour with and without financing

Two states matter:

- **No position open**  
  - incoming revenues accrue in the account,  
  - you can withdraw or redeploy them as usual.

- **Position open (advance or credit line)**  
  - an agreed share of incoming revenues is automatically routed to repayment first,  
  - the remainder behaves like normal working capital.

This makes the revenue account the onchain analogue of a **business operating account with enforceable terms**:

- a single place where revenue lands,  
- predictable rules on who gets paid when,  
- enough structure for credit to be underwritten seriously.

### 1.2 Idle balances and base yield

When revenues are not pledged to a position, the account can:

- allocate **unencumbered balances** into simple, transparent onchain yield sources  
  (e.g. staked SOL or yield-bearing stablecoins),  
- keep funds available for operations and as collateral,  
- avoid large idle balances sitting in non-yielding wallets.

The goal is to provide:

- a default, low-friction way for revenues to earn something,  
- without breaking accounting or risk assumptions.

---

## 2. Revenue-backed financing rails

Once revenues flow through the account, you can use them to fund work instead of only selling tokens.

attn exposes two main product types:

- **One-off revenue advances**: short, finite positions against a defined slice of upcoming revenues.  
- **Revenue-backed credit lines**: ongoing borrowing capacity that adjusts with your revenues.

### 2.1 One-off revenue advances

A revenue advance is:

- “get a defined amount of cash today, repaid from a slice of upcoming revenues.”

In the UI you mostly choose:

- the **upfront amount** you want (e.g. $30,000),  
- optionally a **max payback window** (e.g. “up to 6 weeks”) or a **max revenue share** you are comfortable with.

Given your revenue history, attn proposes a position:

- a revenue share (e.g. 20–40%),  
- an effective horizon (e.g. 3–6 weeks),  
- a target repayment amount (principal + fees),  
- plus any internal limits (caps, concentration, etc.).

You see this as a single line such as:

> “Get $30,000 now, repay from up to 35% of revenues over the next 6 weeks (capped at $32,000 total).”

Under the hood (see [PT/YT docs](../mechanics/pt-yt-attnusd.md)), the position is represented as a yield token (YT) backed by a share of your future cashflows into the revenue account until maturity or the cap is reached.

<details>
<summary>Example – Fund a release without selling tokens</summary>

- Your protocol earns around $20,000/month in net revenues.  
- You request **$30,000** to ship a new product and list on a major venue.  
- You are comfortable using up to **40%** of revenues for **around 4 weeks** to repay.

attn simulates against your history and proposes:

- route **40%** of the next **4 weeks** of revenues to repayment,  
- with a **repayment cap** of $32,000 (principal + fees).

Estimates:

- 4 × $20,000 = $80,000 of revenues.  
- 40% slice = $32,000.

attn (or an LP via attnUSD) funds the position:

- you receive $30,000 upfront,  
- 40% of those revenues are routed to repayment until $32,000 has been collected.

You trade a bounded slice of ~4 weeks of income for $30k now,  
without issuing or dumping governance tokens.

Unpledged revenues in the account can continue to earn base yield throughout.

</details>

These are useful for:

- specific launches, campaigns, listings, or one-off spend,  
- creators who want a defined budget against near-term volume.

---

### 2.2 Revenue-backed credit lines

For ongoing needs, you can open a **revolving credit line** backed by your revenues.

Internal sizing takes into account:

- your revenue history and volatility,  
- diversification of sources (e.g. multiple products / markets),  
- any additional **onchain** collateral (vesting tokens, launchpad backing, etc.).

It does **not** take into account:
- bank balances
- credit scores
- real-world asset statements

Everything is derived from onchain revenue performance and optional onchain escrow. 

You receive:

- a limit in USD terms,  
- a current drawn balance,  
- a rule such as “up to X% of new revenues goes to repayment when utilisation > 0”.

It behaves like a **corporate revolver**:

- you draw when you need cash,  
- repayments happen automatically as revenues hit the account,  
- as the line amortises and performance improves, limits can be revisited.

For larger or earlier-stage projects, the line can also be secured by:

- vesting token collateral held in escrow,  
- explicit commitments to point future fee switches and creator rewards into the revenue account once they exist,  
- launchpad or incubator guarantees.

While the line is unused, unencumbered balances in the revenue account continue to earn simple onchain yield.

---

## 3. attnUSD: pooled exposure to revenue-backed positions

On the other side of the table sit LPs.

They deposit stablecoins (USDC, USDT, USDe, USDC+) and receive **attnUSD**, a USD-denominated share token whose value is backed by:

- the underlying stablecoin basket,  
- plus a portfolio of revenue advances and credit lines represented as PT/YT positions.

### 3.1 What attnUSD represents

Let:

- `NAV(t)` = total marked value of the vault’s assets minus liabilities at time `t`,  
- `S(t)` = total supply of attnUSD at time `t`.

Then:

- **attnUSD share price** `P(t) = NAV(t) / S(t)`.

LPs:

- deposit stables and mint attnUSD at or near `P(t)`,  
- burn attnUSD to withdraw a pro-rata share of the underlying.

Yield comes from:

- interest and fees on revenue advances and credit lines,  
- where applicable, base yield on pledged assets (e.g. if pledged revenues sit in staked or yield-bearing form),  
- minus losses from underperforming or defaulted positions and operating costs.

attnUSD is **not** a fixed-rate instrument or a promise of a 1:1 stable:

- it can drift around 1 depending on portfolio performance and losses,  
- it is explicitly a way to hold **revenue-backed credit risk** in exchange for yield.

---

## 4. How this shows up in the UI

From a user’s perspective, the mechanics above reduce to a few simple objects:

- “**This is my revenue account**”  
  - where my protocol / creator / network revenues land,  
  - with clear rules when financing is active vs inactive.

- “**This is my advance / credit line**”  
  - one-off or revolving,  
  - defined by a revenue share, horizon, and size.

- “**This is the USD token LPs hold on the other side**”  
  - attnUSD,  
  - whose yield comes from a diversified book of these revenue-backed positions.

The PT / YT details sit under the hood and only matter if you want to go deeper into:

- how individual positions are priced and risk-managed,  
- how attnUSD is constructed and marked.

For that, see:

- [How attn works (non-technical)](../mechanics/how-it-works-nontechnical.md)  
- [PT, YT, and attnUSD – Technical Design](../mechanics/pt-yt-attnusd.md)  
- [For Liquidity Providers](../users/for-liquidity-providers.md)

---

In short, “banking the internet of revenue” means:

- giving onchain businesses a proper revenue account that can also earn on idle balances,  
- letting them fund themselves directly from income instead of only tokens,  
- and giving LPs a clear, pooled way to own that revenue risk via attnUSD.
