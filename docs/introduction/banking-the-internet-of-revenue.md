# Banking the Internet of Revenue

attn is a protocol that tries to answer a simple question:

> “If onchain apps and creators already have revenues,  
> why don’t they have something that looks like a bank relationship?”

Instead of improvising around one-off OTC deals, attn standardizes three things:

1. A **revenue account** for your app, DAO, or token.
2. **Revenue-based funding products** (advances and credit lines).
3. A **USD yield token** backed by many such deals.

You never have to think in terms of fixed-income jargon.  
From your side, it looks like:

- “this is my revenue account”  
- “this is my advance / credit line”  
- “this is the USD yield token the other side holds”

The machinery underneath stays in the background unless you want to see it.

---

## 1. A real revenue account for onchain businesses

You connect your fee stream (e.g. Pump.fun creator rewards, protocol fee switch, DePIN income) to an **attn revenue account**.

That account is:

- jointly governed (creator / DAO + attn),
- wired so that:
  - when **no financing is active**, you withdraw like usual,
  - when **a deal is active**, agreed rules decide how much of incoming fees goes first to repayment.

It is the onchain analogue of a **business operating account with covenants**:

- one place where revenue lands,
- predictable rules on who gets paid when,
- the minimum needed for credit to be underwritten seriously.

---

## 2. Revenue-based funding instead of only token sales

Once fees flow through that account, you can choose between:

### a) One-off revenue advances

You sell a slice of upcoming revenue for cash now.

You configure:

- share of future fees (e.g. 20–40%),
- horizon (e.g. 3, 6, 12 months).

Capital on the other side pays you up front and, in return, gets that share of fees until the agreed amount is repaid.

From your UI, it’s phrased in business language:

- “Sell 30% of the next 6 months of fees for X today.”

<details>
<summary>Example – “Bridge the next release without selling tokens”</summary>

- Your protocol earns around $20,000/month in net fees.
- You’d like $30,000 to ship a new product and list on a major venue.
- You decide to sell **40%** of the next **4 months** of fees.

Estimated path:

- 4 × $20,000 = $80,000 of fees.
- 40% of that = $32,000.

attn (or an LP) offers:

- $30,000 up front,
- in exchange for routing 40% of those fees until $32,000 has been collected.

You trade 40% of 4 months of income for $30k now,  
without touching your governance token.

</details>

---

### b) Revenue-backed credit lines

For ongoing needs, you can open a **revolving line** sized by:

- your revenue history,
- volatility,
- diversification.

You get:

- a limit,
- a drawdown balance,
- a rule like “up to X% of new fees goes to repayment when the line is used.”

It behaves like a **corporate revolver**, except:

- the “covenants” are not a PDF with signatures,
- they’re enforced by how your revenue account routes funds.

For larger or earlier projects, this line can also be backed by:

- vesting token collateral,
- launchpad reputation,
- and explicit commitments to route future fees once live.

---

## 3. A USD yield token backed by many revenue deals

On the other side of the table sit LPs.

They deposit stablecoins (USDC, USDT, USDe, USDC+) and receive a **USD-denominated share token** whose value is backed by:

- the stablecoin basket itself,
- plus the portfolio of revenue advances and credit lines.

Over time, as deals:

- amortize,
- default,
- recover,

the vault’s net asset value moves, and the USD token tracks that.

It is **not** a promise of a fixed rate or a risk-free stable:

- it can drift around 1 depending on performance and losses,
- it is explicitly a way to hold **revenue-backed credit risk** in exchange for yield.

Details on how this works structurally live in:

- [How attn works (non-technical)](../mechanics/how-it-works-nontechnical.md),
- [PT, YT, and attnUSD – Technical Design](../mechanics/pt-yt-attnusd.md),
- [LP Guide](../mechanics/lp-guide.md).

---

In short, “banking the internet of revenue” means:

- giving onchain businesses a proper revenue account,
- letting them fund themselves from income instead of only tokens,
- and giving LPs a clear, pooled way to own that revenue risk.
