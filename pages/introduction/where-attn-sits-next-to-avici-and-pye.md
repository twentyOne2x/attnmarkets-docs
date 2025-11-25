# Where attn Sits Next to Avici, Pye, Wildcat, Altitude, 3Jane, Xitadel, Colossus, and Klarna + Tempo

attn is easier to understand when seen next to other projects that work on credit, yield, and onchain underwriting.

Especially relevant points of comparison:

- **Avici.money** – internet banking for people  
- **Pye.fi** – structured markets for staking yield  
- **Wildcat.finance** – undercollateralised credit markets for vetted borrowers  
- **Altitude (Squads.xyz)** – stablecoin business accounts and treasury  
- **3Jane.xyz** – unsecured credit lines underwritten on verified assets + offchain credit data (EVM-first)  
- **Xitadel.fi** – Liquid Treasury Tokens (LTTs) backed by project treasuries  
- **Colossus.credit** – stablecoin card and payment-network stack built as an Ethereum L2 (very early / sparse public detail)  
- **Klarna + Tempo** – consumer BNPL network and USD stablecoin on a payments-focused L1  

attn.markets focuses on a different object:

> the revenues of apps, creators, DAOs, and networks.

Instead of banking deposits, stake, or pure reputation, attn.markets banks the **revenue stream itself** and turns it into collateral, while also providing ways for those revenues to earn yield when idle.

Skim the table and exec summaries first. Expand a project if you want detail.

---

## At a glance

| Project           | Layer / object                                   | What it focuses on                                                                     | Primary users                                      | How it intersects with attn                                                                                  |
|------------------|---------------------------------------------------|----------------------------------------------------------------------------------------|----------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **Avici.money**  | Individual banking + personal trust layer         | Accounts, cards, and spending limits based on an individual Trust Score               | Individuals, freelancers, small businesses         | Avici.money handles **personal** cashflow and card credit; attn.markets handles **app / creator onchain revenue** and credit at the project layer |
| **Pye.fi**       | Stake / validator-yield layer                     | Splitting staked SOL into principal and yield, structuring yield                      | Stakers, infra protocols, yield traders            | Similar PT/YT mental model, but on validator rewards vs attn.markets’s protocol / creator revenues                   |
| **Wildcat.finance** | Market / reputation credit layer               | Under-collateralised loan “markets” based on borrower reputation & terms              | Whitelisted borrowers, stablecoin lenders          | attn.markets uses wired revenues as collateral; Wildcat.finance relies more on market design and borrower reputation         |
| **Altitude (Squads.xyz)** | Treasury and payments layer              | Stablecoin business accounts, fiat/stable rails, treasury tooling                     | DAOs, protocols, companies running ops/treasury    | Altitude (Squads.xyz) holds operating cash; attn.markets structures credit and yield on revenue flows                             |
| **3Jane.xyz**    | Credit-account / future-yield layer               | Unsecured USDC credit lines and USD3 yield-bearing stablecoin, sized via verified assets + credit inputs | Asset-rich users with verifiable credit footprint  | 3Jane.xyz requires linking real-world accounts/credit data; attn.markets sizes lines only on live onchain revenues |
| **Xitadel.fi**   | Treasury / native-token collateral layer          | Liquid Treasury Tokens: overcollateralised, fixed-term debt against token treasuries  | Token-rich projects, DAOs, foundations, credit LPs | Xitadel.fi finances against **treasury tokens**; attn.markets finances against **revenues**. A project can use both at once. |
| **Colossus.credit** | Payments / card-network layer (EVM)           | Stablecoin credit-card stack and payment-network rails, aiming to turn EMV taps into onchain (ERC-4337) settlements | Merchants, acquirers, issuers, card users in stablecoins | Adjacent only: Colossus.credit targets consumer/merchant payments; attn.markets targets revenue-collateralised credit for onchain businesses |
| **Klarna + Tempo** | Consumer BNPL + payments L1 layer              | BNPL lending, merchant checkout, and a USD stablecoin issued on a payments-optimised L1 for cheaper global payments | Consumers, merchants, BNPL investors; payment and platform partners | Klarna + Tempo target **consumer BNPL and payments**; attn.markets targets **revenue-backed credit to entities**. In principle, Klarna-style BNPL providers or merchants on Tempo could tap attn.markets for entity-level financing against their revenues, while consumer risk stays on their own balance sheet. |
| **attn.markets** | Revenue layer                                     | Revenue accounts, revenue-backed credit, pooled revenue yield                         | Apps, DAOs, creators, networks, LPs                | Provides the revenue accounts and PT/YT positions that other layers could plug into                          |

---

## Avici.money

- Layer: individual banking + personal trust.  
- Focus: accounts, cards, and retail credit tied to a Trust Score.  
- Primary users: individuals, freelancers, small businesses.  
- Difference vs attn.markets: Avici.money underwrites **people and personal cashflow**; attn.markets underwrites **projects and onchain revenue streams**.  
- Relationship: complementary (personal banking for teams; revenue banking for the project).

<details>
<summary>Deep dive</summary>

**Avici.money** is building an internet-native neobank:

- accounts and cards  
- on-/off-ramps  
- an onchain “Trust Score” to unlock credit  
- income and spending tools anchored in self-custody

The primary customer is:

- a person or small business that wants:
  - to get paid  
  - to spend globally  
  - to access familiar banking primitives without a legacy retail bank

attn.markets looks one layer up:

- the projects and businesses themselves:
  - apps and protocols  
  - creator economies  
  - DAOs  
  - DePIN networks

and asks:

- Where do your revenues go?  
- How do you fund yourself from them?  
- How can outside capital own a slice of that income onchain?

If Avici.money is about banking individuals and their income,  
attn.markets is about banking the revenue streams of onchain businesses.

In practice, they can be complementary:

- an individual might receive income via Avici.money-style tools,  
- while the underlying app or token routes its revenues into an attn.markets revenue account for credit and yield.

</details>

---

## Pye.fi

- Layer: stake / validator-yield structuring on Solana.  
- Focus: splitting staked SOL into principal and yield legs.  
- Primary users: stakers, infra protocols, yield traders.  
- Difference vs attn.markets: Pye.fi slices **validator rewards**; attn.markets slices **protocol/creator revenues**.  
- Relationship: shared PT/YT mental model, different collateral base.

<details>
<summary>Deep dive</summary>

**Pye.fi** focuses on Solana staking yield:

- staked positions are decomposed into:
  - a principal component  
  - a yield component  
- and those pieces can be traded or structured separately

The underlying risk is:

- validator and protocol performance  
- staking rewards and MEV  
- stake mechanics

attn.markets uses a similar “principal / yield” mental model but with a different underlying:

- protocol and creator revenues, not validator rewards

Where Pye.fi enables positions around future staking income,  
attn.markets enables positions around future protocol and creator income:

- revenue advances  
- revenue-backed credit lines  
- pooled revenue yield via a USD share token  
- plus base-layer yield on idle balances in revenue accounts, where appropriate

In short:

- Pye.fi = slicing up stake yield  
- attn.markets = slicing up business revenue

</details>

---

## Wildcat.finance

- Layer: undercollateralised credit markets on reputation + terms.  
- Focus: borrower-defined markets with reserves, lockups, and whitelisting.  
- Primary users: vetted borrowers and stablecoin lenders.  
- Difference vs attn.markets: Wildcat.finance relies on **market parameters + reputation**; attn.markets relies on **wired revenue collateral + routing rules**.  
- Relationship: alternative approach to onchain unsecured credit.

<details>
<summary>Deep dive</summary>

**Wildcat.finance** builds undercollateralised credit markets:

- vetted borrowers deploy their own loan “markets” with:
  - fixed terms  
  - reserve requirements  
  - withdrawal rules  
- lenders deposit stablecoins into those markets and earn interest

Protection there comes from:

- market design (reserves, penalties, lockups)  
- whitelists and screening  
- optional off-chain legal agreements  
- the borrower’s reputation

attn.markets is more prescriptive about what backs the loan:

- credit is explicitly backed by tokenised revenue streams:
  - revenues are routed into a dual-controlled vault (e.g. Squads 2/2)  
  - those revenues mint PT (principal) and YT (future revenue) claims  
  - advances and credit lines are written directly against those PT/YT/SY positions

At a high level:

- Wildcat.finance = structured undercollateralised credit where “collateral” is mostly reputation + market parameters  
- attn.markets = undercollateralised credit anchored in concrete, wired revenue flows and their PT/YT tokens

</details>

---

## Altitude (Squads.xyz)

- Layer: treasury, stablecoin accounts, and payments for organisations.  
- Focus: business accounts, fiat/stable rails, and low-risk yield on balances.  
- Primary users: DAOs, protocols, companies with ops/treasury needs.  
- Difference vs attn.markets: Altitude (Squads.xyz) manages **operating cash and payments**; attn.markets manages **revenue routing, financing, and revenue-native yield**.  
- Relationship: complementary treasury + revenue stack.

<details>
<summary>Deep dive</summary>

**Altitude (Squads.xyz)** is a stablecoin-powered financial product for businesses:

- USD and EUR “accounts” backed by stablecoins, with local details for ACH, wire and SEPA transfers  
- tools for sending and receiving bank transfers and stablecoin payments through the same interface  
- yield on balances via short-term U.S. Treasuries, presented as an APY on idle cash  
- multi-user controls, approvals, and workflows aimed at ops and finance teams  
- roadmap features like corporate cards and a CFO tool suite (invoicing, bill pay, accounting)

It is positioned as:

- a replacement or complement to traditional business bank accounts  
- with global availability and onchain settlement under the hood

attn.markets sits alongside this, rather than inside the same problem:

- Altitude (Squads.xyz) focuses on **where your stablecoin cash lives, how it earns low-risk yield, and how you pay people**  
- attn.markets focuses on **how your onchain revenues are routed, pledged, financed, and optionally put to work while idle**

A single protocol or DAO could reasonably:

- hold operating cash, payroll, and vendors in an Altitude (Squads.xyz)-style account  
- route protocol / creator revenues into an attn.markets revenue account for financing and base yield  
- treat attnUSD as a separate credit-yield sleeve on top of its core treasury

Altitude (Squads.xyz) is treasury and payments; attn.markets is revenue-backed structuring, credit, and revenue-native yield.

</details>

---

## 3Jane.xyz

- Layer: credit-account / future-yield underwriting on Ethereum.  
- Focus: unsecured credit lines sized by verified onchain + offchain assets and credit data.  
- Primary users: asset-rich borrowers with verifiable credit footprint; LPs via USD3.  
- Difference vs attn.markets: 3Jane.xyz needs **identity/asset verification + offchain enforcement**; attn.markets needs **onchain revenue routing only**.  
- Relationship: both underwrite future cashflows, different trust models and target users.

<details>
<summary>Deep dive</summary>

**3Jane.xyz** is a credit-based money market on Ethereum:

- borrowers receive **unsecured USDC credit lines** with no onchain collateral posted,  
- underwriting uses a **multi-source credit engine**:
  - onchain DeFi / CEX / RWA positions across many protocols and asset types,  
  - offchain credit data (e.g. U.S. credit scores, income, bank balances) verified via zkTLS and partners like Cred Protocol,  
  - combined into a proprietary score and limits model.   
- capital suppliers deposit USDC to mint **USD3**, a yield-bearing stablecoin that represents a share of the credit pool,  
- USD3 can be staked into **sUSD3** for levered exposure to the same credit book.   

This implies a different trust and privacy model:

- 3Jane.xyz’s lines depend on linking wallets to real-world financial accounts and credit data.
- attn.markets does **not** require any of that. attn.markets underwrites strictly from **onchain revenue routing** into governed revenue accounts.

The core mechanics:

- **Borrower side**  
  - target segment today is high-balance users (e.g. U.S. residents with substantial verified assets and strong scores),  
  - credit lines are sized by aggregate verified assets and credit quality,  
  - minimum monthly payments and utilisation rules are enforced offchain via legal agreements and, if needed, collections.   

- **LP side**  
  - suppliers face a diversified pool of unsecured lines,  
  - yield is driven by interest and fees on those lines,  
  - loss protection uses an insurance / first-loss structure plus diversification and conservative caps on pool utilisation.   

How this differs from attn.markets:

- **Collateral type**  
  - 3Jane.xyz: lines are economically unsecured at the onchain level; protection relies on verified asset snapshots, credit scores, and enforceable legal recourse.  
  - attn.markets: positions are explicitly secured by **live revenue routing** into governed revenue accounts (e.g. fee PDAs, creator rewards, machine income), with programmable waterfalls on those flows.

- **Who it primarily serves**  
  - 3Jane.xyz: credit accounts for individuals and entities with substantial, verifiable asset footprints and credit histories; borrowing against future yield and portfolios, mostly in a U.S.-centric regulatory frame.   
  - attn.markets: revenue infrastructure for apps, DAOs, creators, and networks that want to fund work directly out of protocol or creator income, often natively pseudonymous and global.

- **What the yield token represents**  
  - 3Jane.xyz’s **USD3**: a yield-bearing USDC-like asset whose backing is a pool of unsecured credit lines, delta-hedged and managed via integrations such as Aave and other yield sources.   
  - **attnUSD**: a USD share in a portfolio of **revenue-backed PT/YT positions and stablecoins**, where each position is tied to a specified revenue account and routing schedule.

You can think of it this way:

- 3Jane.xyz is building a **future-yield credit account** for asset-rich users, with unsecured lines mapped to a yield-bearing stablecoin.  
- attn.markets is building **revenue-native banking rails** for apps and creators, where specific fee and reward streams sit in revenue accounts, support advances and credit lines, and roll up into a pooled revenue-backed USD token.

They share:

- the belief that **future cashflows** (not just static collateral) can back credit,  
- the use of a **yield-bearing USD token** as an access point for LP capital.

They differ in:

- what they treat as primary collateral (multi-source balance sheets vs wired revenues),  
- which users they optimise for,  
- and how much they lean on offchain credit and legal enforcement versus onchain revenue routing.

</details>

---

## Xitadel.fi

- Layer: treasury-backed fixed-income via LTTs.  
- Focus: overcollateralised, fixed-term debt against native-token treasuries.  
- Primary users: token-rich projects/DAOs and credit LPs.  
- Difference vs attn.markets: Xitadel.fi finances **token treasuries**; attn.markets finances **live revenues**.  
- Relationship: can be used together on the same balance sheet.

<details>
<summary>Deep dive</summary>

**Xitadel.fi** focuses on project treasuries and native tokens:

- projects lock a portion of their treasury (typically native tokens) into a collateral vault,  
- against that collateral they mint **Liquid Treasury Tokens (LTTs)**, which are:
  - overcollateralised,  
  - fixed-term,  
  - designed to behave like onchain bond instruments for the project,  
- investors buy LTTs with stablecoins and receive a defined return profile over the term.

The underlying object is:

- the **token treasury** and its market value,  
- not the live revenue stream of the protocol or creator.

The protection stack includes:

- collateral ratios and coverage thresholds,  
- automated monitoring and liquidation rules over the treasury backing,  
- standardised issuance and reporting, so investors know what is backing each LTT.

attn.markets looks at a different part of the same balance sheet:

- Xitadel.fi: “How much capital can you raise against the **tokens** you already hold in your treasury?”  
- attn.markets: “How much capital can you raise against the **revenues** your system produces over time?”

In practice, a project could:

- use Xitadel.fi to unlock a slice of its native-token treasury via LTTs,  
- route protocol or app revenues into an attn.markets revenue account to back advances and credit lines,  
- and let attnUSD or other credit LPs selectively hold LTTs as part of a broader revenue and credit book.

Xitadel.fi is a **treasury-debt** layer; attn.markets is a **revenue-debt and revenue-yield** layer.

</details>

---

## Colossus.credit

- Layer: payments / stablecoin card-network rails on Ethereum L2.  
- Focus: EMV-compatible stablecoin cards using account abstraction.  
- Primary users: merchants, issuers, acquirers, consumer card users.  
- Difference vs attn.markets: Colossus.credit targets **consumer/merchant payments**; attn.markets targets **revenue-collateralised credit and yield for onchain businesses**.  
- Status: early, sparse public detail.

<details>
<summary>Deep dive</summary>

**Colossus.credit** positions itself as a stablecoin credit-card and payments network built as an Ethereum L2. Public materials emphasize:

- compatibility with existing EMV card terminals,  
- using account abstraction (ERC-4337) so card taps can authorize onchain transactions,  
- very fast “preconfirmation” for card authorization,  
- vertical integration of issuer, processor, and network to reduce fees.

There is limited detail available so far beyond the landing-page narrative. No full technical specification, developer documentation set, or public codebase is clearly exposed yet. The project appears early in its process, with many implementation and go-to-market specifics still undisclosed.

Colossus.credit is adjacent to attn.markets only at the highest level (both are financial infrastructure). It targets consumer/merchant payment rails; attn.markets targets revenue-collateralised credit and yield for onchain businesses.

</details>

---

## Klarna + Tempo

- Layer: consumer BNPL network + payments-focused L1.  
- Focus: BNPL lending and a USD-pegged stablecoin used for cheaper, high-volume global payments on a dedicated payments chain.  
- Primary users: consumers and merchants using Klarna at checkout; payment and platform partners integrating Tempo.  
- Difference vs attn.markets: Klarna takes **consumer credit risk** and runs BNPL and checkout; Tempo provides **payments infrastructure** optimised for stablecoin transactions. attn.markets takes risk on **business revenues** and lends only to entities, not to individual shoppers.  
- Relationship: Klarna-style BNPL providers or merchants on Tempo could, in principle, use attn.markets as a **wholesale, revenue-backed credit line**. Consumer receivables and UX remain with Klarna/Tempo; attn.markets would only finance the BNPL or merchant entity against its revenue flows.

<details>
<summary>Deep dive</summary>

**Klarna** is a large BNPL and checkout network that finances consumer purchases and collects instalments from shoppers on behalf of merchants. Its core risk book is consumer receivables and merchant performance, not protocol-level credit to other apps.

Recently, Klarna announced a **USD-pegged stablecoin** to reduce costs for international payments and FX, and to route more of its settlement flow over crypto rails. That stablecoin is planned to launch on **Tempo**, a dedicated payments Layer 1. Tempo is an **EVM-compatible L1** incubated by Stripe and Paradigm, designed for high-volume, real-world payments with a strong focus on stablecoin transactions and low fees.

In that stack:

- Klarna handles:
  - consumer BNPL underwriting,  
  - merchant integration and checkout UX,  
  - collections on consumer instalments.  

- Tempo provides:
  - payments-focused blockspace,  
  - stablecoin settlement for Klarna and other partners,  
  - an environment optimised for high-throughput, low-cost transactions.

Where attn.markets differs and could intersect:

- attn.markets does **not** take consumer risk or originate BNPL receivables.  
- It could, however, lend to:
  - Klarna-style BNPL platforms as **entities**, against their net fee and interest revenue streams, or  
  - merchants and platforms operating on Tempo that have predictable, onchain revenues.

In that setup:

- consumer instalments and credit risk stay on Klarna’s balance sheet (or similar BNPL providers),  
- Tempo remains the payments and settlement L1,  
- attn.markets is a separate revenue-backed credit engine that can fund BNPL providers or merchants at the entity level, without touching individual shoppers.

This keeps the boundary clear:

- Klarna/Tempo = consumer BNPL and payments rails,  
- attn.markets = revenue-backed financing for businesses that happen to run over those rails.

</details>

---

## How the layers line up

All of these projects care about:

- credit  
- yield  
- onchain underwriting

They operate at different layers:

- **Avici.money** – individual layer:  
  income, spending, cards, accounts, and retail credit  

- **Pye.fi** – stake layer:  
  validator yield and structured products on staked assets  

- **Wildcat.finance** – market / reputation layer:  
  bespoke loan markets, reserves, and agreements  

- **Altitude (Squads.xyz)** – treasury and payments layer:  
  stablecoin business accounts, yield on balances, and fiat/stablecoin rails  

- **3Jane.xyz** – credit account / future-yield layer:  
  unsecured USDC credit lines sized by verified assets and credit scores, plus a yield-bearing USD3/sUSD3 stack  

- **Xitadel.fi** – treasury / fixed-income layer:  
  Liquid Treasury Tokens backed by project treasuries, giving investors fixed-income-style exposure to token treasuries  

- **Colossus.credit** – payments / card-network layer:  
  stablecoin-native card authorization and settlement rails mapped to onchain transactions  

- **Klarna + Tempo** – consumer BNPL + payments L1 layer:  
  BNPL receivables, merchant checkout, and a USD stablecoin on a payments-centric L1 for global payments  

- **attn.markets** – revenue layer:  
  revenue accounts, base yield on idle revenues, advances, credit lines, and pooled yield on app and creator income, with revenues themselves wired as collateral

A mature project can realistically touch several of these at once:

- team members using Avici.money-style tools for personal banking  
- the organisation running its treasury and payments on something like Altitude (Squads.xyz)  
- staking positions structured via Pye.fi  
- occasional reputation-based or multi-factor credit via Wildcat.finance or 3Jane.xyz  
- treasury-backed bond-style financing via Xitadel.fi  
- consumer payments or cards via Colossus.credit-style rails  
- BNPL and checkout via Klarna-like platforms on Tempo or similar L1s  
- and revenue-backed financing and yield via attn.markets

attn.markets’s role in that stack is focused and narrow:  
turn onchain revenues into bankable collateral and build products directly on top of those flows.

For deeper mechanics, see:

- _How attn works (non-technical)_ – overview of the flows  
- _PT, YT, and attnUSD – Technical Design_ – the detailed model
