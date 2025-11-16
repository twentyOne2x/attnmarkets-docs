# The Missing Layer for Onchain Revenues

Onchain infrastructure makes it easy to:

- launch tokens,  
- route trades through DEXs,  
- turn on fee switches and revenue PDAs,  
- and track protocol and app revenues via dashboards and indexers.

What is still missing is a **product layer on top of those revenues**: a way for recurring onchain income to behave like an asset that can support advances, credit lines, and pooled yield in a predictable way.

---

## How revenues behave today

For most projects, revenues:

- land in a generic wallet or PDA,  
- are moved around manually when someone remembers,  
- are mixed with other funds (treasury, speculation, runway),  
- are not bound by clear rules on who gets paid when.

Even if an analytics dashboard can say “this app generated $X in the last 30 days”, there is usually no:

- designated **revenue account** with simple, enforceable rules,  
- standard way to **pledge those revenues** as collateral,  
- shared template for **repayment waterfalls** or priorities,  
- clean instrument that gives outside capital a **defined claim on that income** instead of on the token.

As a result, teams with real income still tend to rely on:

- repeated token sales or emissions,  
- ad-hoc OTC arrangements,  
- or under-investing relative to what their revenues could support.

---

## What capital can and cannot see

Capital providers can now see:

- protocol and app revenue numbers on aggregators,  
- fee switches and routing on-chain,  
- basic growth and retention metrics.

What they still cannot buy easily is **a standardised, enforceable slice of those revenues**:

- there is no canonical “revenue account + rules” they can underwrite,  
- no widely used primitive for “X% of revenues for Y months with these covenants”,  
- no USD numeraire built explicitly on a diversified book of such positions.

Most credit risk therefore remains either:

- fully undercollateralised and reputation-based, or  
- overcollateralised against volatile tokens,

rather than being anchored in contractual revenue flows.

---

## The gap attn focuses on

attn is built around this specific missing layer.

The protocol aims to turn onchain revenues into **bankable collateral**, by adding:

- a dedicated **revenue account** with clear governance and rules,  
- standard **revenue-based funding products** (advances and credit lines),  
- and a **USD yield token** backed by a portfolio of those positions.

Once revenues live in that structure, they can support:

- non-dilutive funding for apps, DAOs, and creators,  
- repeatable credit templates for launchpads and incubators,  
- and pooled revenue-backed yield for LPs,

instead of remaining only a number on a dashboard or idle balances in miscellaneous wallets.
