# attn in context: adjacent protocols and fintech layers

attn is easiest to understand when seen next to other projects that work on credit, payments, yield, and underwriting.

attn's focus is **attnCredit**: revenue-underwritten, onchain-enforced revolving credit and servicing against **routed onchain revenue accounts**.

## The comparison set

These are common points of comparison:

- **creditcoop.xyz** - credit cooperative / bridge funding against future cash flows (receivables + settlement liquidity)
- **claw.credit** - autonomous credit for AI agents on Solana; agents can apply for lines and spend on x402 services (underwritten by t54 risk engine)
- **Yumi.finance** - onchain BNPL rails (credit-as-a-feature for platforms)
- **Pyra.fi** - consumer neobank: invest paycheck into yield assets + spend via DeFi credit (no forced selling)
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

Skim the summary first. The goal is not perfect taxonomy; it's a quick map for BD, partners, and capital.

## 3 quick takeaways

- **attn is the control layer:** underwriting + servicing + enforceability rails around routed revenue.
- **attn targets entity-level revenue risk, not consumer credit underwriting.**
- **attn can sit behind distribution/payment products** (cards, payroll, checkout) as their working-capital and settlement-liquidity engine.

> **Condensed comparison summary**
>
> attn = enforcement + servicing + reporting against routed revenue.

## At a glance (expand by project)

<details>
<summary><strong>creditcoop.xyz</strong> — Receivables + settlement liquidity</summary>

- **Focus:** Bridge funding against future cash flows (including onchain receivables).
- **Primary users / buyers:** Card programs, neobanks, payments stacks.
- **How it intersects with attn:** creditcoop is a liquidity provider against receivables; attn is the onchain enforcement + servicing layer that makes those receivables financeable.
</details>

<details>
<summary><strong>claw.credit</strong> — Autonomous credit for AI agents</summary>

- **Focus:** Autonomous credit lines for AI agents on Solana that can be spent across x402 services without manual wallet top-ups.
- **Primary users / buyers:** Agent builders, operators, and agent-first application stacks.
- **How it intersects with attn:** claw.credit is agent-native credit execution; attn is the revenue-account control, servicing, and enforceability layer for entity-level onchain revenue.
</details>

<details>
<summary><strong>Yumi.finance</strong> — BNPL / credit-as-a-feature</summary>

- **Focus:** Onchain BNPL rails for platforms that do not want to build underwriting + financing from scratch.
- **Primary users / buyers:** Neobanks, card programs, checkout/payroll platforms, fintech apps.
- **How it intersects with attn:** Yumi is a credit product surface; attn is the entity-level credit + servicing + enforcement layer against routed revenues.
</details>

<details>
<summary><strong>Pyra.fi</strong> — Consumer neobank + DeFi credit + card</summary>

- **Focus:** Invest paychecks into yield assets; spend using DeFi credit.
- **Primary users / buyers:** Individuals / retail users.
- **How it intersects with attn:** Pyra is a distribution endpoint; attn underwrites company settlement/working-capital needs against fee revenues and routed receivables.
</details>

<details>
<summary><strong>Avici.money</strong> — Individual banking + payroll + personal credit</summary>

- **Focus:** Accounts, cards, payroll networks, and consumer underwriting.
- **Primary users / buyers:** Individuals, employees, freelancers, payroll operators.
- **How it intersects with attn:** Avici targets people; attn targets entities and their onchain revenue accounts.
</details>

<details>
<summary><strong>Slash</strong> — Business banking + cards + rails</summary>

- **Focus:** Regulated entity accounts, corporate cards, payment rails, working-capital UX.
- **Primary users / buyers:** SMEs, internet businesses, Web3 teams.
- **How it intersects with attn:** Slash is a spend/ops surface; attn can sit behind it as revenue-underwritten credit and servicing.
</details>

<details>
<summary><strong>Krak (Kraken KRAK app + card)</strong> — Consumer money app + card rails</summary>

- **Focus:** Retail balances, P2P, spend, consumer distribution.
- **Primary users / buyers:** Individuals / retail users.
- **How it intersects with attn:** Krak is a distribution endpoint; attn finances fee-generating entities operating around those rails.
</details>

<details>
<summary><strong>Pye.fi</strong> — Yield and rate structuring</summary>

- **Focus:** Tokenized rate products (staking yield and beyond).
- **Primary users / buyers:** Yield users, traders, infrastructure protocols.
- **How it intersects with attn:** Pye structures yield as the object; attn structures credit servicing/enforcement around routed revenues.
</details>

<details>
<summary><strong>Wildcat.finance</strong> — Market-based credit</summary>

- **Focus:** Undercollateralized lending markets with negotiated terms.
- **Primary users / buyers:** Whitelisted borrowers and stable lenders.
- **How it intersects with attn:** Wildcat is market/term design; attn is servicing-first with hard sweeps, dynamic limits, and deterministic stress modes.
</details>

<details>
<summary><strong>Altitude (Squads.xyz)</strong> — Treasury and ops</summary>

- **Focus:** Business accounts, safes, payouts, accounting-friendly operations.
- **Primary users / buyers:** DAOs, protocols, ops teams.
- **How it intersects with attn:** Altitude holds operating cash; attn provides credit servicing and repayment controls on routed revenue accounts.
</details>

<details>
<summary><strong>3Jane.xyz</strong> — Credit accounts and yield stablecoins</summary>

- **Focus:** Unsecured lines and yield products sized via offchain/verified inputs.
- **Primary users / buyers:** Asset-rich users with verifiable credit footprints.
- **How it intersects with attn:** 3Jane underwrites via offchain verification; attn underwrites from onchain revenue stability and enforceable routing controls.
</details>

<details>
<summary><strong>Xitadel.fi</strong> — Treasury / native-token collateral</summary>

- **Focus:** Fixed-term debt against token treasuries.
- **Primary users / buyers:** Token-rich projects, DAOs, credit pools.
- **How it intersects with attn:** Xitadel finances treasury assets; attn finances live routed revenue.
</details>

<details>
<summary><strong>Colossus.credit</strong> — Payments network + card stack</summary>

- **Focus:** Stablecoin payments and card-network primitives.
- **Primary users / buyers:** Merchants, acquirers, issuers.
- **How it intersects with attn:** Payment rails can consume liquidity facilities; attn can provide the credit + servicing layer where routed receivables exist.
</details>

<details>
<summary><strong>Klarna + Tempo</strong> — Consumer BNPL + payments infra</summary>

- **Focus:** Consumer underwriting, merchant checkout, and payment rails.
- **Primary users / buyers:** Consumers, merchants, BNPL capital.
- **How it intersects with attn:** consumer BNPL risk is separate; attn provides entity-level revenue-swept credit for merchants/platforms.
</details>

<details>
<summary><strong>attn (attnCredit)</strong> — Revenue credit + servicing control plane</summary>

- **Focus:** Revenue accounts, revenue-swept facilities, dynamic limits, deterministic control modes, lender-grade tape.
- **Primary users / buyers:** Onchain fee businesses, LPs, issuer/treasury stacks.
- **How it intersects with others:** attn supplies the enforcement and servicing rails that make onchain revenue financeable without relying only on token collateral.
</details>

## What to take away

- attn is not trying to be the front-end bank, payroll provider, or card issuer.
- attn is the credit control layer: **underwriting + servicing + enforcement + reporting** against routed cashflows.
- The key design choice is **enforceability**: routed revenue accounts, sweeps, mandatory paydown, throttles, and deterministic freeze/default handling.

## Related pages

- [How attnCredit works (non-technical)](../mechanics/how-it-works-nontechnical.md)
- [attnCredit Engine and attnUSD](../mechanics/pt-yt-attnusd.md)
- [For Cards, Commerce, and Settlement Partners](../users/for-cards-and-commerce-partners.md)
- [For Liquidity Providers](../users/for-liquidity-providers.md)
