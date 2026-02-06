# Private Archive: where-attn-sits-next-to-avici-and-pye (pre-pivot)

This is an archived copy of the pre-attnCredit-pivot page content.
It is stored in-repo for reference and is not part of the published docs site.

---

# Where attn Sits Next to Avici, Slash, Krak, Pye, Wildcat, Altitude, 3Jane, Xitadel, Colossus, and Klarna + Tempo

attn is easier to understand when seen next to other projects that work on credit, yield, and onchain underwriting.

Especially relevant points of comparison:

- **Avici.money** – internet neobank with payroll accounts, Visa spend cards, and a trust-score-driven unsecured credit / mortgage roadmap for people  
- **Slash** – business banking, corporate cards, and Global USD accounts for entities  
- **Krak (Kraken KRAK app + card)** – consumer global money app and multi-asset debit card  
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

| Project                         | Layer / object                                   | What it focuses on                                                                     | Primary users                                      | How it intersects with attn                                                                                  |
|---------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------|----------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **Avici.money**                | Individual banking + payroll + personal trust/credit layer | Self-custodial accounts and Visa cards, payroll/salary accounts, and a Trust Score that unlocks unsecured loans and (later) mortgages and major credit lines | Individuals, employees, freelancers; eventually small businesses for payroll | Avici.money handles **personal income, payroll, and retail credit** via a Trust Score; attn.markets handles **app / creator / DAO onchain revenue** and entity-level, revenue-backed credit |
| **Slash**                      | Business banking, cards, and Global USD layer     | Business checking, corporate cards, stablecoin payments, Global USD (USDSL), working capital | SMEs, internet entrepreneurs, Web3 teams, ecommerce, agencies | Slash handles **entity banking, cards, and stablecoin rails**; attn.markets provides **revenue-backed credit and yield**, especially for onchain/Web3 clients who then spend via Slash |
| **Krak (KRAK app + card)**    | Individual + global money-app layer               | Personal account, P2P transfers, yields, and a multi-asset Mastercard debit card that spends 400+ fiat and crypto assets | Individuals, freelancers, crypto users, remitters  | Krak covers **personal accounts, card, and yield**; attn.markets covers **revenue-backed credit for apps/creators/DAOs** that may ultimately pay users into apps like Krak |
| **Pye.fi**                     | Stake / validator-yield layer                     | Splitting staked SOL into principal and yield, structuring yield                      | Stakers, infra protocols, yield traders            | Similar PT/YT mental model, but on validator rewards vs attn.markets’s protocol / creator revenues                   |
| **Wildcat.finance**           | Market / reputation credit layer                  | Under-collateralised loan “markets” based on borrower reputation & terms              | Whitelisted borrowers, stablecoin lenders          | attn.markets uses wired revenues as collateral; Wildcat.finance relies more on market design and borrower reputation         |
| **Altitude (Squads.xyz)**     | Treasury and payments layer                       | Stablecoin business accounts, fiat/stable rails, treasury tooling                     | DAOs, protocols, companies running ops/treasury    | Altitude (Squads.xyz) holds operating cash; attn.markets structures credit and yield on revenue flows                             |
| **3Jane.xyz**                 | Credit-account / future-yield layer               | Unsecured USDC credit lines and USD3 yield-bearing stablecoin, sized via verified assets + credit inputs | Asset-rich users with verifiable credit footprint  | 3Jane.xyz requires linking real-world accounts/credit data; attn.markets sizes lines only on live onchain revenues |
| **Xitadel.fi**                | Treasury / native-token collateral layer          | Liquid Treasury Tokens: overcollateralised, fixed-term debt against token treasuries  | Token-rich projects, DAOs, foundations, credit LPs | Xitadel.fi finances against **treasury tokens**; attn.markets finances against **revenues**. A project can use both at once. |
| **Colossus.credit**           | Payments / card-network layer (EVM)               | Stablecoin credit-card stack and payment-network rails, aiming to turn EMV taps into onchain (ERC-4337) settlements | Merchants, acquirers, issuers, card users in stablecoins | Adjacent only: Colossus.credit targets consumer/merchant payments; attn.markets targets revenue-collateralised credit for onchain businesses |
| **Klarna + Tempo**            | Consumer BNPL + payments L1 layer                 | BNPL lending, merchant checkout, and a USD stablecoin issued on a payments-optimised L1 for cheaper global payments | Consumers, merchants, BNPL investors; payment and platform partners | Klarna + Tempo target **consumer BNPL and payments**; attn.markets targets **revenue-backed credit to entities**. In principle, Klarna-style BNPL providers or merchants on Tempo could tap attn.markets for entity-level financing against their revenues, while consumer risk stays on their own balance sheet. |
| **attn.markets**              | Revenue layer                                     | Revenue accounts, revenue-backed credit, pooled revenue yield                         | Apps, DAOs, creators, networks, LPs                | Provides the revenue accounts and PT/YT positions that other layers could plug into                          |

---

## Avici.money

- Layer: individual banking + payroll + personal trust/credit.  
- Focus: self-custodial Visa spend cards, global payroll/salary accounts, and an “internet native” Trust Score that unlocks unsecured personal and business loans, larger credit lines, and eventually home mortgages.  
- Primary users: individuals, employees, freelancers, and, over time, startups and DAOs using Avici as a primary payroll and spend rail.  
- Difference vs attn.markets: Avici.money underwrites **people and their cashflow** via a Trust Score and aims at mortgages and unsecured loans; attn.markets underwrites **projects and onchain revenue streams** at the entity level.  
- Relationship: complementary (Avici as people + payroll neobank; attn as revenue bank for the underlying apps and DAOs).

<details>
<summary>Deep dive</summary>

**Avici.money** is building a Solana-native, internet neobank aimed at replacing the traditional retail bank account:

- self-custodial **Visa spend cards** connected to stablecoin balances, usable at 150M+ merchants  
- **USD/EUR accounts** via regulated partners for salary deposit and on-/off-ramp  
- an “internet native” **Trust Score** designed as a credit primitive for unsecured lending  
- a roadmap that explicitly includes **unsecured loans, personal and business credit lines, and home mortgages** funded from onchain investor pools  

Their go-to-market emphasises a set of tightly coupled “network effect nodes”:

- **Trust Score** – a programmable, onchain credit identity and scoring primitive  
- **Payroll accounts (smart wallets)** – where users receive paychecks in USD, EUR, or stablecoins  
- **Employers ⇆ employees** – payroll networks where employers pay through Avici rails  
- **Visa spend card** – the front-end to everyday spend and interchange  
- **Credit layer** – unsecured loans, major credit lines, and eventually mortgages for users with strong Trust Scores  

The intended loop is:

- users and employers adopt Avici for **payroll and everyday spend**,  
- data from those flows and other signals feeds the **Trust Score**,  
- the Trust Score unlocks **unsecured loans and mortgages** financed by onchain credit pools,  
- those loans, in turn, further embed Avici as a primary financial home.

Governance and capital formation are designed to be DAO-driven:

- the ICO is structured with no team allocation and a **monthly allowance** from the treasury, gated by futarchy-style **decision markets** rather than a trusted multisig,  
- the long-term goal is a **distributed internet banking infrastructure** that reduces dependence on central banks and fiat interest-rate policy.  

Relative to attn.markets:

- Avici is where **people** bank:
  - receive salaries and income,  
  - hold balances in stablecoins and fiat,  
  - spend via Visa,  
  - and, over time, access unsecured loans and mortgages using a Trust Score.

- attn.markets is where **apps, DAOs, creators, and networks** bank their **revenue streams**:
  - route protocol/creator fees into governed revenue accounts,  
  - borrow against those revenues,  
  - and pool revenue-backed PT/YT positions into attnUSD.

In a realistic stack:

- an employer or DAO might pay contributors into **Avici** accounts and cards,  
- while the protocol or app’s own revenue PDAs are wired into **attn.markets** for advances and revolving credit.

Avici is an **internet neobank and trust-score credit layer for people and payroll**; attn.markets is a **revenue-native credit engine** for the entities and apps generating the income that flows into those personal rails.

</details>

---

## Slash

- Layer: business banking, corporate cards, and stablecoin-powered Global USD.  
- Focus: business checking, unlimited virtual and physical cards, stablecoin on/off-ramps and Global USD accounts held in USDSL, plus embedded working capital.  
- Primary users: internet entrepreneurs, Web3 teams, ecommerce brands, agencies, and other SMEs.  
- Difference vs attn.markets: Slash provides **regulated business banking, cards, and payment rails**; attn.markets provides **onchain revenue accounts and revenue-backed credit/yield** on Solana.  
- Relationship: complementary (Slash = where entities bank, pay, and spend; attn = where onchain revenues are pledged and financed, especially for Web3-native clients).

<details>
<summary>Deep dive</summary>

**Slash** is a business banking and expense-management platform:

- FDIC-insured business checking via partner banks.  
- Unlimited virtual and physical corporate cards with cashback and fine-grained controls (card groups, merchant limits, country restrictions, etc.).  
- Stablecoin payments and on/off-ramps for major stablecoins.  
- A **Global USD Account** where balances are represented by **USDSL**, Slash’s own USD-pegged stablecoin backed by high-quality liquid assets and issued on a modern L2 via a stablecoin infrastructure partner.

The card stack has two main components:

- A debit card tied directly to the business checking balance.  
- A premium charge-style card (e.g. “Slash Platinum”) issued by a partner bank, where the outstanding balance is due in full on a very short cycle (often daily).

In other words:

- For day-to-day card usage, credit exposure is very short-term (charge-card style), with the issuing bank acting as lender of record.  
- Limits and risk are managed through entity-level underwriting plus spend controls (card groups, merchant/country filters, real-time authorization hooks).

For **longer-tenor credit**, Slash offers **Working Capital**:

- Working-capital loans and lines are delivered in partnership with a specialist fintech lender and a chartered bank that originates the loans.  
- Users apply via a flow embedded in the Slash dashboard; the lending partner underwrites and sets a line.  
- Drawdowns are credited into a dedicated account inside Slash and can then be spent using the same cards and payment workflows as regular funds.  
- Terms are typically structured around 30/60/90-day horizons to match business cash-flow cycles.

Global USD + USDSL add a cross-border and onchain dimension:

- Non-U.S. entities can access a USD account without needing a U.S. LLC, hold a USDSL-denominated balance, and send/receive stablecoins and fiat rails (wires, ACH, local transfers) from one place.  
- USDSL is effectively a closed-loop stablecoin that underpins those balances; rewards on Global USD are structured as promotional rebates funded by Slash, not as onchain interest paid by the issuer.

Relative to attn.markets:

- Slash is **where the entity banks and spends**:
  - fiat and stablecoin accounts,  
  - corporate cards,  
  - wires/ACH/local transfers,  
  - stablecoin rails.  

- attn.markets is **where onchain revenues are treated as collateral**:
  - Solana-native revenue accounts,  
  - revenue-backed advances and credit lines,  
  - a pooled USD share token (attnUSD) backed by revenue PT/YT positions.

A Web3 protocol or creator can reasonably:

- funnel onchain revenues into an attn.markets revenue account for credit and yield,  
- then move funds (via bridge/off-ramp) into a Slash account or Global USD,  
- and use Slash cards and payments to cover fiat suppliers, ad spend, and operations.

In that stack, Slash is the **regulated business-banking and card front end**, while attn.markets is a **revenue-backed credit engine** for onchain-native clients.

</details>

---

## Krak (Kraken KRAK app + card)

- Layer: individual + global money-app layer.  
- Focus: a personal “everything account” with a multi-asset Mastercard debit card (Krak Card), global P2P and remittances, and yield on balances and vaults.  
- Primary users: individuals and freelancers who want a consumer bank replacement that speaks both fiat and crypto.  
- Difference vs attn.markets: Krak is **consumer-facing** (personal account + debit card + yields); attn.markets is **entity-facing** (apps, creators, DAOs) and treats their revenues as collateral.  
- Relationship: complementary (Krak = where people get paid, hold, and spend; attn.markets = where the projects behind those payments raise revenue-backed credit and structure yield).

<details>
<summary>Deep dive</summary>

**Krak** is a global money app from Kraken:

- A personal **Everyday account** that can hold and move 400+ fiat and crypto assets.  
- Global, low-friction transfers to 160+ countries, often framed as “send like a message” using handles (Kraktags) instead of IBANs.  
- Auto-earn on eligible balances (e.g. a base APY on holdings) plus **vaults** for higher, DeFi-like yields on selected assets.  
- A cashback/refunds and rewards layer tied to usage and balances.

The centrepiece for everyday spending is **Krak Card**:

- A **Mastercard debit card** (virtual + physical) linked to the Krak Everyday account.  
- Lets you spend from your balance of 400+ assets (fiat and crypto) at any Mastercard merchant worldwide, plus ATM withdrawals.  
- Multi-asset spend: you set a **spend order** in-app; Krak converts assets in that order into your primary currency (GBP for UK, EUR for EEA) at the time of authorization, combining multiple assets if needed.  
- **No FX / foreign transaction fees** on card spend, and no annual/monthly fee; a spread on conversion may apply but is built into the quoted rate.  
- **Cashback**:
  - Up to around **1% base cashback** on everyday spend, paid in either local fiat or Bitcoin.  
  - Boosted cashback (e.g. higher rewards on travel booked via Krak’s concierge/partners).  
  - Reward rate tiers that depend on the average assets you hold across Krak/Kraken/Kraken Pro.

Krak is explicitly positioned as a **bank alternative**:

- Salary deposits / direct deposit into the Krak Everyday account.  
- Global transfers and P2P, including to non-crypto-native users, with a UX similar to neobanks.  
- “Spend, send, grow” framing: card, transfers, and yields in a single consumer app.

Relative to attn.markets:

- Krak is where **people** hold and spend their money (fiat + crypto) and earn yield.  
- attn.markets is where **apps, creators, DAOs, and networks** centralise and collateralise their revenue streams.

You can imagine a full loop:

- A creator or protocol routes its fees into an attn.markets revenue account, borrows against them, and/or issues PT/YT and attnUSD.  
- That income pays out contributors or users who custody and spend via Krak.  
- Krak is the personal front-end; attn.markets is the project-level revenue and credit engine behind some of the flows that land in it.

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
  - offchain credit data (e.g. credit scores, income, bank balances) verified via secure attestations,  
  - combined into a proprietary score and limits model.  
- capital suppliers deposit USDC to mint **USD3**, a yield-bearing stablecoin that represents a share of the credit pool,  
- USD3 can be staked into **sUSD3** for levered exposure to the same credit book.  

This implies a different trust and privacy model:

- 3Jane.xyz’s lines depend on linking wallets to real-world financial accounts and credit data.  
- attn.markets does **not** require any of that. attn.markets underwrites strictly from **onchain revenue routing** into governed revenue accounts.

The core mechanics:

- **Borrower side**  
  - target segment today is high-balance users and entities with substantial verified assets and strong scores,  
  - credit lines are sized by aggregate verified assets and credit quality,  
  - minimum payments and utilisation rules are enforced offchain via legal agreements and, if needed, collections.  

- **LP side**  
  - suppliers face a diversified pool of unsecured lines,  
  - yield is driven by interest and fees on those lines,  
  - loss protection uses an insurance / first-loss structure plus diversification and conservative caps on pool utilisation.  

How this differs from attn.markets:

- **Collateral type**  
  - 3Jane.xyz: lines are economically unsecured at the onchain level; protection relies on verified asset snapshots, credit scores, and enforceable legal recourse.  
  - attn.markets: positions are explicitly secured by **live revenue routing** into governed revenue accounts (e.g. fee PDAs, creator rewards, machine income), with programmable waterfalls on those flows.

- **Who it primarily serves**  
  - 3Jane.xyz: credit accounts for individuals and entities with substantial, verifiable asset footprints and credit histories.  
  - attn.markets: revenue infrastructure for apps, DAOs, creators, and networks that want to fund work directly out of protocol or creator income, often natively pseudonymous and global.

- **What the yield token represents**  
  - 3Jane.xyz’s **USD3**: a yield-bearing USDC-like asset whose backing is a pool of unsecured credit lines.  
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
  income, payroll, spend cards, accounts, and unsecured credit built on a Trust Score and onchain investor pools  

- **Krak (KRAK app + card)** – individual + global money-app layer:  
  personal account, multi-asset debit card, P2P and remittances, and yields across fiat and crypto  

- **Slash** – business banking + cards + Global USD layer:  
  business checking, corporate cards, stablecoin on/off-ramps, Global USD accounts backed by USDSL, and embedded working capital  

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

- team members using Avici.money- or Krak-style tools for personal banking, payroll, and spending  
- the organisation running its treasury and payments on something like Altitude (Squads.xyz) or Slash  
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
