# Where attn Sits Next to Avici, Pye, Wildcat, and Altitude

attn is easier to understand when seen next to other projects that deal with credit, yield, and onchain underwriting.

Four especially relevant points of comparison:

- **Avici** – internet banking for people  
- **Pye** – structured markets for staking yield  
- **Wildcat** – undercollateralised credit markets for vetted borrowers  
- **Altitude (Squads)** – stablecoin business accounts and treasury

attn focuses on a different object:

> the revenues of apps, creators, DAOs, and networks.

Instead of banking deposits, stake, or pure reputation, attn banks the **revenue stream itself** and turns it into collateral, while also providing ways for those revenues to earn yield when idle.

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

- **attn** – revenue layer:  
  revenue accounts, base yield on idle revenues, advances, credit lines, and pooled yield on app and creator income, with revenues themselves wired as collateral

A mature project can realistically touch several of these at once:

- team members using Avici-style tools for personal banking  
- the organisation running its treasury and payments on something like Altitude  
- staking positions structured via Pye  
- occasional reputation-based credit via Wildcat  
- and revenue-backed financing and yield via attn

attn’s role in that stack is focused and narrow:  
turn onchain revenues into bankable collateral and build products directly on top of those flows.

For deeper mechanics, see:

- _How attn works (non-technical)_ – overview of the flows  
- _PT, YT, and attnUSD – Technical Design_ – the detailed model
