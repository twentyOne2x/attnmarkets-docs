# Where attn Sits Next to Avici, Pye, Wildcat, Altitude, and 3Jane

attn is easier to understand when seen next to other projects that work on credit, yield, and onchain underwriting.

Especially relevant points of comparison:

- **Avici** – internet banking for people  
- **Pye** – structured markets for staking yield  
- **Wildcat** – undercollateralised credit markets for vetted borrowers  
- **Altitude (Squads)** – stablecoin business accounts and treasury  
- **3Jane** – unsecured credit lines and a yield-bearing stablecoin backed by future cashflows

attn focuses on a different object:

> the revenues of apps, creators, DAOs, and networks.

Instead of banking deposits, stake, or pure reputation, attn banks the **revenue stream itself** and turns it into collateral, while also providing ways for those revenues to earn yield when idle.

---

## At a glance
| Project   | Layer / object                                | What it focuses on                                                         | Primary users                                      | How it intersects with attn                                                                      |
|----------|-----------------------------------------------|----------------------------------------------------------------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **Avici**   | Individual banking + personal trust layer      | Accounts, cards, and spending limits based on an individual Trust Score   | Individuals, freelancers, small businesses         | Avici handles **personal** cashflow and card credit; attn handles **app / creator onchain revenue** and credit at the project layer |
| **Pye**     | Stake / validator-yield layer                 | Splitting staked SOL into principal and yield, structuring yield          | Stakers, infra protocols, yield traders            | Similar PT/YT mental model, but on validator rewards vs attn’s protocol / creator revenues       |
| **Wildcat** | Market / reputation credit layer              | Under-collateralised loan “markets” based on borrower reputation & terms  | Whitelisted borrowers, stablecoin lenders          | attn uses wired revenues as collateral; Wildcat relies more on market design and borrower reputation |
| **Altitude**| Treasury and payments layer                   | Stablecoin business accounts, fiat/stable rails, treasury tooling         | DAOs, protocols, companies running ops/treasury    | Altitude holds operating cash; attn structures credit and yield on revenue flows                 |
| **3Jane**   | Credit-account / future-yield layer           | Unsecured USDC credit lines and USD3 yield-bearing stablecoin             | Asset-rich users with verifiable credit footprint  | 3Jane sizes lines via multi-source credit; attn sizes lines on live revenue routed onchain       |
| **attn**    | Revenue layer                                 | Revenue accounts, revenue-backed credit, pooled revenue yield             | Apps, DAOs, creators, networks, LPs                | Provides the revenue accounts and PT/YT positions that other layers could plug into             |

The rest of this page goes into more detail for each.

---

## Avici: internet banking for individuals

**Avici** is building an internet-native neobank:

- accounts and cards  
- on-/off-ramps  
- an onchain “Trust Score” to unlock credit  
- income and spending tools anchored in self-custody

The primary customer is:

- a person or small business that wants:
  - to get paid  
  - to spend globally  
  - to access familiar banking primitives without a legacy retail bank

attn looks one layer up:

- the projects and businesses themselves:
  - apps and protocols  
  - creator economies  
  - DAOs  
  - DePIN networks

and asks:

- Where do your revenues go?  
- How do you fund yourself from them?  
- How can outside capital own a slice of that income onchain?

If Avici is about banking individuals and their income,  
attn is about banking the revenue streams of onchain businesses.

In practice, they can be complementary:

- an individual might receive income via Avici-style tools,  
- while the underlying app or token routes its revenues into an attn revenue account for credit and yield.

---

## Pye: staking yield vs protocol and creator revenue

**Pye** focuses on Solana staking yield:

- staked positions are decomposed into:
  - a principal component  
  - a yield component  
- and those pieces can be traded or structured separately

The underlying risk is:

- validator and protocol performance  
- staking rewards and MEV  
- stake mechanics

attn uses a similar “principal / yield” mental model but with a different underlying:

- protocol and creator revenues, not validator rewards

Where Pye enables positions around future staking income,  
attn enables positions around future protocol and creator income:

- revenue advances  
- revenue-backed credit lines  
- pooled revenue yield via a USD share token  
- plus base-layer yield on idle balances in revenue accounts, where appropriate

In short:

- Pye = slicing up stake yield  
- attn = slicing up business revenue

---

## Wildcat: reputation and terms vs revenue-locked collateral

**Wildcat** builds undercollateralised credit markets:

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

attn is more prescriptive about what backs the loan:

- credit is explicitly backed by tokenised revenue streams:
  - revenues are routed into a dual-controlled vault (e.g. Squads 2/2)  
  - those revenues mint PT (principal) and YT (future revenue) claims  
  - advances and credit lines are written directly against those PT/YT/SY positions

At a high level:

- Wildcat = structured undercollateralised credit where “collateral” is mostly reputation + market parameters  
- attn = undercollateralised credit anchored in concrete, wired revenue flows and their PT/YT tokens

---

## Altitude: stablecoin business accounts vs revenue-backed credit

**Altitude** (by Squads) is a stablecoin-powered financial product for businesses:

- USD and EUR “accounts” backed by stablecoins, with local details for ACH, wire and SEPA transfers  
- tools for sending and receiving bank transfers and stablecoin payments through the same interface  
- yield on balances via short-term U.S. Treasuries, presented as an APY on idle cash  
- multi-user controls, approvals, and workflows aimed at ops and finance teams  
- roadmap features like corporate cards and a CFO tool suite (invoicing, bill pay, accounting)

It is positioned as:

- a replacement or complement to traditional business bank accounts  
- with global availability and onchain settlement under the hood

attn sits alongside this, rather than inside the same problem:

- Altitude focuses on **where your stablecoin cash lives, how it earns low-risk yield, and how you pay people**  
- attn focuses on **how your onchain revenues are routed, pledged, financed, and optionally put to work while idle**

A single protocol or DAO could reasonably:

- hold operating cash, payroll, and vendors in an Altitude-style account  
- route protocol / creator revenues into an attn revenue account for financing and base yield  
- treat attnUSD as a separate credit-yield sleeve on top of its core treasury

Altitude is treasury and payments; attn is revenue-backed structuring, credit, and revenue-native yield.

---

## 3Jane: unsecured, credit-scored lines vs revenue-account collateral

**3Jane** is a credit-based money market on Ethereum:

- borrowers receive **unsecured USDC credit lines** with no onchain collateral posted,  
- underwriting uses a **multi-source credit engine**:
  - onchain DeFi / CEX / RWA positions across many protocols and asset types,  
  - offchain credit data (e.g. U.S. credit scores, income, bank balances) verified via zkTLS and partners like Cred Protocol,  
  - combined into a proprietary score and limits model.   
- capital suppliers deposit USDC to mint **USD3**, a yield-bearing stablecoin that represents a share of the credit pool,  
- USD3 can be staked into **sUSD3** for levered exposure to the same credit book.   

The core mechanics:

- **Borrower side**  
  - target segment today is high-balance users (e.g. U.S. residents with substantial verified assets and strong scores),  
  - credit lines are sized by aggregate verified assets and credit quality,  
  - minimum monthly payments and utilisation rules are enforced offchain via legal agreements and, if needed, collections.   

- **LP side**  
  - suppliers face a diversified pool of unsecured lines,  
  - yield is driven by interest and fees on those lines,  
  - loss protection uses an insurance / first-loss structure plus diversification and conservative caps on pool utilisation.   

How this differs from attn:

- **Collateral type**  
  - 3Jane: lines are economically unsecured at the onchain level; protection relies on verified asset snapshots, credit scores, and enforceable legal recourse.  
  - attn: positions are explicitly secured by **live revenue routing** into governed revenue accounts (e.g. fee PDAs, creator rewards, machine income), with programmable waterfalls on those flows.

- **Who it primarily serves**  
  - 3Jane: credit accounts for individuals and entities with substantial, verifiable asset footprints and credit histories; borrowing against future yield and portfolios, mostly in a U.S.-centric regulatory frame.   
  - attn: revenue infrastructure for apps, DAOs, creators, and networks that want to fund work directly out of protocol or creator income, often natively pseudonymous and global.

- **What the yield token represents**  
  - 3Jane’s **USD3**: a yield-bearing USDC-like asset whose backing is a pool of unsecured credit lines, delta-hedged and managed via integrations such as Aave and other yield sources.   
  - **attnUSD**: a USD share in a portfolio of **revenue-backed PT/YT positions and stablecoins**, where each position is tied to a specified revenue account and routing schedule.

You can think of it this way:

- 3Jane is building a **future-yield credit account** for asset-rich users, with unsecured lines mapped to a yield-bearing stablecoin.  
- attn is building **revenue-native banking rails** for apps and creators, where specific fee and reward streams sit in revenue accounts, support advances and credit lines, and roll up into a pooled revenue-backed USD token.

They share:

- the belief that **future cashflows** (not just static collateral) can back credit,  
- the use of a **yield-bearing USD token** as an access point for LP capital.

They differ in:

- what they treat as primary collateral (multi-source balance sheets vs wired revenues),  
- which users they optimise for,  
- and how much they lean on offchain credit and legal enforcement versus onchain revenue routing.

---

## How the layers line up

All of these projects care about:

- credit  
- yield  
- onchain underwriting

They operate at different layers:

- **Avici** – individual layer:  
  income, spending, cards, accounts, and retail credit  

- **Pye** – stake layer:  
  validator yield and structured products on staked assets  

- **Wildcat** – market / reputation layer:  
  bespoke loan markets, reserves, and agreements  

- **Altitude** – treasury and payments layer:  
  stablecoin business accounts, yield on balances, and fiat/stablecoin rails  

- **3Jane** – credit account / future-yield layer:  
  unsecured USDC credit lines sized by verified assets and credit scores, plus a yield-bearing USD3/sUSD3 stack  

- **attn** – revenue layer:  
  revenue accounts, base yield on idle revenues, advances, credit lines, and pooled yield on app and creator income, with revenues themselves wired as collateral

A mature project can realistically touch several of these at once:

- team members using Avici-style tools for personal banking  
- the organisation running its treasury and payments on something like Altitude  
- staking positions structured via Pye  
- occasional reputation-based or multi-factor credit via Wildcat or 3Jane  
- and revenue-backed financing and yield via attn

attn’s role in that stack is focused and narrow:  
turn onchain revenues into bankable collateral and build products directly on top of those flows.

For deeper mechanics, see:

- _How attn works (non-technical)_ – overview of the flows  
- _PT, YT, and attnUSD – Technical Design_ – the detailed model
