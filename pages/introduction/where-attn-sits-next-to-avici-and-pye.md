# Where attn Sits Next to Avici, Pye, and Wildcat

attn doesn’t live in a vacuum. It makes more sense when seen next to other projects that are trying to make credit and yield less abstract.

Three especially relevant ones:

- **Avici** – internet banking for people.
- **Pye** – structured markets for staking yield.
- **Wildcat** – undercollateralised credit markets for vetted borrowers.

attn focuses on a different object:  
**the revenue of apps, creators, DAOs, and networks.**

Instead of banking deposits, stake, or reputation, attn **banks the revenue stream itself** and turns it into collateral.

---

## Avici: internet banking for people

**Avici** is building an internet-native neobank:

- accounts and cards,
- on-/off-ramps,
- an onchain “Trust Score” to unlock credit,
- income and spending tools anchored in self-custody.

Their primary customer is:

- a person or small business that wants:
  - to get paid,
  - to spend globally,
  - and to access familiar banking primitives without a legacy retail bank.

attn looks one layer up:

- the **projects and businesses themselves**:
  - apps and protocols,
  - creator economies,
  - DAOs,
  - DePIN networks,

and asks:

- “Where do your revenues go?”
- “How do you fund yourself from them?”
- “How can outside capital own a slice of that income onchain?”

If Avici is about **banking individuals and their income**,  
attn is about **banking the revenue streams of onchain businesses**.

---

## Pye: deals on staking yield vs deals on revenue

**Pye** focuses on Solana staking yield:

- staked positions are decomposed into:
  - a “principal” component,
  - a “yield” component,
- and those pieces can be traded or structured separately.

The underlying risk is:

- validator and protocol performance,
- staking rewards and MEV,
- stake mechanics.

attn uses a similar “principal / yield” mental model, but with a different underlying:

- **protocol and creator revenues**, not validator rewards.

Where Pye lets you do deals around **future staking income**,  
attn lets you do deals around **future protocol and creator income**:

- revenue advances,
- revenue-backed credit lines,
- pooled revenue yield via a USD share token.

You can think of it as:

- Pye = slicing up **stake yield**.  
- attn = slicing up **business revenue**.

---

## Wildcat: undercollateralised credit vs revenue-locked collateral

**Wildcat** builds undercollateralised credit markets:

- vetted borrowers spin up their own loan “markets” with:
  - fixed terms,
  - reserve requirements,
  - withdrawal rules,
- lenders deposit stablecoins into those markets and earn interest.

Protection there comes from:

- market design (reserves, penalties, lockups),
- whitelists and screening,
- optional off-chain legal agreements,
- and the borrower’s reputation.

attn is stricter about **what backs the loan**:

- credit is explicitly backed by **tokenised revenue streams**:
  - revenues are routed into a dual-controlled vault (e.g. Squads 2/2),
  - those revenues mint PT (principal) and YT (future revenue) claims,
  - advances and credit lines are written directly against those PT/YT/SY positions.

So:

- Wildcat = structured, undercollateralised credit where “collateral” is mostly reputation + pool parameters.  
- attn = undercollateralised credit where collateral is **concrete, hard-wired cashflows** and their PT/YT tokens, not just trust or a signature.

---

## Why this distinction matters

All four projects care about:

- credit,
- yield,
- onchain underwriting.

They just operate at different layers of the stack:

- **Avici** – you as a person:
  - income, spending, cards, accounts, and retail credit.
- **Pye** – your stake:
  - validator yield and structured deals on staked assets.
- **Wildcat** – your reputation and terms:
  - bespoke loan markets, reserves, and off-chain agreements.
- **attn** – your project’s revenues:
  - advances, credit lines, and pooled yield on app/creator income, with revenues themselves wired as collateral.

If you are:

- trying to live onchain as an individual → Avici.  
- trying to optimise how staking yield is sliced and traded → Pye.  
- trying to issue undercollateralised credit based on reputation and market design → Wildcat.  
- trying to fund an app/DAO/creator business from its own revenues, or allocate capital into those revenues → attn is the relevant layer.

For deeper mechanics, you can jump to:

- _How attn works (non-technical)_ (overview of the flows)  
- _PT, YT, and attnUSD – Technical Design_ (the detailed model)
