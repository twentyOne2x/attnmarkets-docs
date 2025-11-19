# The Missing Layer for Onchain Revenues

Onchain infrastructure makes it easy to:

- launch tokens,  
- route trades through DEXs,  
- turn on fee switches and revenue PDAs,  
- and track protocol and app revenues via dashboards and indexers.

What is still missing is a **product layer on top of those revenues**: a way for recurring onchain income to behave like an asset that can support advances, credit lines, pooled yield, and basic “cash management” (earning something on idle balances) in a predictable way.

---

## How revenues behave today

For most projects, revenues:

- land in a generic wallet or PDA,  
- are moved around manually when someone remembers,  
- are mixed with other funds (treasury, speculation, runway),  
- are not bound by clear rules on who gets paid when.

That usually means there is **no**:

- designated **revenue account** with simple, enforceable rules,  
- standard way to **pledge those revenues** as collateral,  
- shared template for **repayment waterfalls** or priorities,  
- clean instrument that gives outside capital a **defined claim on that income** instead of on the token,  
- default way for those balances to earn yield without breaking accounting or risk assumptions.

As a result, teams with real income still tend to rely on:

- repeated token sales or emissions,  
- ad-hoc OTC arrangements,  
- or under-investing relative to what their revenues could support,  
- while a large portion of revenues sits idle in non-yielding wallets.

---

## What capital can and cannot see

Capital providers can now see:

- protocol and app revenue numbers on aggregators,  
- fee switches and routing on-chain,  
- basic growth and retention metrics.

What they still cannot buy easily is **a standardised, enforceable slice of those revenues**:

- there is no canonical “revenue account + rules” they can underwrite,  
- no widely used primitive for “X% of revenues for Y weeks with these enforceable terms,  
- no USD numeraire built explicitly on a diversified book of such positions.

Most credit risk therefore remains either:

- fully undercollateralised and reputation-based, or  
- overcollateralised against volatile tokens,

rather than being anchored in contractual revenue flows.

---

## The gap attn focuses on

attn is built around this specific missing layer.

The protocol’s job is to turn onchain revenues into **bankable collateral** by:

- giving them a governed place to land (a revenue account),  
- wiring predictable rules for how they can be pledged and repaid,  
- and aggregating those positions into a pooled USD share token for LPs.

This page is about the *why*.  
The next ones cover the *how*:

- [Banking the internet of revenue](./banking-the-internet-of-revenue.md) – product view  
- [How attn works (non-technical)](../mechanics/how-it-works-nontechnical.md) – step-by-step flows  
- [PT, YT, and attnUSD – Technical Design](../mechanics/pt-yt-attnusd.md) – under-the-hood model
