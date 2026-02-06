# attn in context: adjacent protocols and fintech layers

attn is easiest to understand when seen next to other projects that work on credit, payments, yield, and underwriting.

attn's focus is **attnCredit**: revenue-underwritten, onchain-enforced revolving credit and servicing against **routed onchain revenue accounts**.

## The comparison set

These are common points of comparison:

- **Avici.money** - internet neobank with payroll accounts, spend cards, and a personal credit roadmap
- **Slash** - business banking, corporate cards, and global USD accounts for entities
- **Krak (Kraken KRAK app + card)** - consumer money app with multi-asset card rails
- **Pye.fi** - structured markets for staking yield and rate products
- **Wildcat.finance** - undercollateralized credit markets for vetted borrowers
- **Altitude (Squads.xyz)** - stablecoin business accounts, treasury, and ops tooling
- **3Jane.xyz** - unsecured credit lines underwritten on verified assets + offchain credit inputs
- **Xitadel.fi** - fixed-term debt against project treasuries (native-token collateral)
- **Colossus.credit** - stablecoin card and payment-network stack (early)
- **Klarna + Tempo** - consumer BNPL network + payments-focused L1 narrative

Skim the matrix first. The goal is not perfect taxonomy; it's a quick map for BD, partners, and capital.

## At a glance (matrix)

| Project | Layer / object | What it focuses on | Primary users / buyers | How it intersects with attn |
| --- | --- | --- | --- | --- |
| **Avici.money** | Individual banking + payroll + personal credit | Accounts, cards, payroll networks, consumer underwriting and credit distribution | Individuals, employees, freelancers; eventually payroll operators | Avici targets **people** and payroll rails; attn targets **entities** and their **onchain revenue accounts** for working capital and settlement liquidity |
| **Slash** | Business banking + cards + rails | Regulated entity accounts, corporate cards, payment rails, working capital UX | SMEs, internet businesses, Web3 teams | Slash is a spend/ops surface; attn can sit behind as a revenue-underwritten credit and servicing layer for entities with onchain fees |
| **Krak** | Consumer money app + card rails | Retail balances, P2P, spend, and consumer distribution | Individuals and retail users | Adjacent: Krak is a distribution endpoint; attn is financing for the fee-generating entities that pay into or interact with consumer rails |
| **Pye.fi** | Yield and rate structuring | Tokenized rate products (staking yield and beyond) | Yield users, traders, infra protocols | Pye structures yield as a traded object; attn structures **credit servicing and enforcement** around routed revenues. Interop is possible, but the core object differs |
| **Wildcat.finance** | Market-based credit | Under-collateralized lending markets with negotiated terms | Whitelisted borrowers and stable lenders | Wildcat is market/term design; attn is a servicing-first model with **hard sweeps**, dynamic limits, and deterministic stress modes anchored in routed cashflows |
| **Altitude (Squads.xyz)** | Treasury and ops | Business accounts, safes, payouts, accounting-friendly flows | DAOs, protocols, ops teams | Complementary: Altitude holds operating cash; attn provides credit servicing and repayment controls on routed revenue accounts |
| **3Jane.xyz** | Credit accounts and yield stablecoins | Unsecured lines and yield products sized via offchain/verified inputs | Asset-rich users with verifiable credit footprint | 3Jane underwrites via offchain verification; attn underwrites from onchain revenue stability and enforceable routing controls |
| **Xitadel.fi** | Treasury / native-token collateral | Fixed-term debt against token treasuries | Token-rich projects, DAOs, credit pools | Xitadel finances against treasury assets; attn finances against **live routed revenue**. A project may use both (treasury debt + revenue facility) |
| **Colossus.credit** | Payments network + card stack | Stablecoin payments and card-network primitives | Merchants, acquirers, issuers (aspirational) | Adjacent: payments rails and settlement primitives can consume liquidity facilities; attn is a credit + servicing layer that can plug in where routed receivables exist |
| **Klarna + Tempo** | Consumer BNPL + payments infra | Consumer underwriting, merchant checkout, and payments rails narrative | Consumers, merchants, BNPL capital | Klarna/BNPL is consumer risk; attn is **entity-level** revenue-swept credit. In principle, merchants or platforms can use attn for working capital while consumer risk stays separate |
| **attn (attnCredit)** | Revenue credit + servicing control plane | Revenue accounts, revenue-swept facilities, dynamic limits, deterministic control modes, lender-grade tape | Onchain fee businesses, LPs, issuer/treasury stacks | Provides the enforcement and servicing rails that make onchain revenue financeable without relying on token collateral alone |

## What to take away

- attn is not trying to be the front-end bank, payroll provider, or card issuer.
- attn is the credit control layer: **underwriting + servicing + enforcement + reporting** against routed cashflows.
- The key design choice is **enforceability**: routed revenue accounts, sweeps, mandatory paydown, throttles, and deterministic freeze/default handling.

## Related pages

- [How attnCredit works (non-technical)](../mechanics/how-it-works-nontechnical.md)
- [attnCredit Engine and attnUSD](../mechanics/pt-yt-attnusd.md)
- [For Cards, Commerce, and Settlement Partners](../users/for-cards-and-commerce-partners.md)
- [For Liquidity Providers](../users/for-liquidity-providers.md)

