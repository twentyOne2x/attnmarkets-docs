# Vision: Payrolls & Streams, Cards & Commerce, and Revenue-Native Credit

This page sketches a later “v3” phase for attn.

It builds on the current design (Solana-native revenue accounts and credit) and extends it across:

* onchain streaming infra (Sablier and similar),
* card and commerce rails (Kast, Avici, merchant and BNPL partners) as spend endpoints, and
* offchain payroll platforms (Deel and similar) as optional spend endpoints,

while keeping the core invariant:

> attn underwrites and banks **revenue streams** of creators, apps, DAOs, and companies.  
> Risk is taken on those cashflows and entities, not on banks, card programs, payroll providers, or individual credit scores.

Facilities always go to **entities** (projects, DAOs, companies, platforms), never directly to individual employees or shoppers.

This page is aspirational and assumes no privileged access to large incumbents (like Deel).

---

## 1. From v0 to v3 at a high level

**Today (v0–v1)**

* **Object of focus** – onchain revenues:
  * Pump.fun creator rewards
  * protocol fee switches
  * DePIN / machine income

* **Core primitives**
  * attn revenue accounts (jointly governed vaults)
  * revenue advances and credit lines
  * attnUSD backed by stablecoins + PT/YT on those revenues

**Next (v2) – streams**

* treat onchain streaming infra (e.g. Sablier Lockup / Flow and similar) as first-class “revenue accounts”,
* extend credit to entities whose income is streamed, not just lump-sum fee PDAs.

**Later (v3) – full revenue → credit → spend loop**

* attn stays a **revenue bank** onchain,
* the *spend side* of its credit (cards, commerce, BNPL, payroll, payouts) connects into card programs, merchant rails, and payroll providers,
* collateral and risk remain on underlying onchain revenues/streams, **not** on those rails,
* none of those rails is a core dependency or collateral source.

---

## 2. What v3 feels like for different users

### Creators and devs

You run a token or app with recurring onchain income:

* trading fees, creator rewards, subscription flows, streamed grants.

You see:

* a single **revenue account** aggregating:
  * Pump.fun creator rewards on Solana,
  * Sablier-style streams on EVM / Solana (vesting, grants, subscriptions).

On top of that you get a **revolving credit line** sized by aggregated revenue, with options to:

* withdraw directly in stables,
* plug a card into the facility (Kast, Avici, etc.) and pay for travel, SaaS, events, day-to-day spend,
* route a portion of credit into payroll rails (onchain streams or offchain providers),
* fund BNPL-style instalments or staged payments you offer to your own users, where **you** are the BNPL provider of record and attn just funds your facility.

From your perspective, the line is “just there”: you keep shipping, contributors and vendors get paid, and attn handles top-ups and repayment.

### Apps, DAOs, and companies

You have:

* protocol revenues landing on Solana,
* token or stable streams going out via Sablier,
* a mix of card spend and fiat/USDC payroll.

You use attn as the **revenue-native financing layer**:

* a governed vault where fees route,
* credit lines and advances backed by those fees + streamed income,
* card and wallet limits that grow with revenues via funding addresses,
* BNPL and net-terms capacity for your own customers, funded from the same facility,
* automatic repayment from future inflows.

You do **not** need to move your whole treasury or payroll stack on-chain. You route the relevant revenues into attn and, if useful, show where attn-funded credit is going (payroll, cards, commerce, growth).

### Individual contributors (end-state)

In a strict v3 end state (with the right integrations and wrappers):

* some contributors could see:
  * streaming income onchain (Sablier),
  * plus a **small, stream-backed line** (e.g. “up to X% of your next N weeks of stream”),
  * optionally connected to a card or wallet they already use.

This only makes sense when:

* the stream is enforceable onchain and cannot be silently rerouted, or
* a partner (payroll or card program) enforces routing on their ledger.

Until then, attn is focused on **entity-level credit**, not unsecured personal lending.

### Liquidity providers

LPs hold attnUSD (and later, more granular PT/YT exposure) backed by:

* Solana fee revenues,
* onchain token streams (Sablier and similar),
* revenue-backed credit to entities funding:
  * development, growth, liquidity,
  * payroll (onchain and offchain),
  * card spend, commerce, and operations.

LPs care about portfolio composition (PT/YT, revenues, haircuts), not which specific payroll, card, or merchant rail was used.

---

## 3. Streams as first-class collateral (Sablier and beyond)

In v3, “revenue” includes **onchain streams** beyond discrete transfers into a Squads vault.

Streaming protocols like Sablier encode:

* **Lockup** – fully prefunded streams that release over time.
* **Flow** – debt-like streams where “amount owed = rate per second × elapsed time”.

For attn, they are natural collateral:

* programmable, onchain cashflows,
* observable and monitorable by programs,
* pledgeable or partially re-routable with consent.

A v3 implementation can treat each stream (or bundle of streams) as a **Revenue-Bearing Position (RBP)** with:

* a clear source (`sender`),
* an instrument (Lockup / Flow),
* an expected “rate × time” profile.

attn then:

* reads parameters and history,
* sets limits (e.g. “only X% of this stream can be pledged”),
* mints PT/YT-style positions against the pledged portion,
* routes that pledged share into repayment buckets.

Streams become another **standardised revenue input**, alongside Squads-based revenue accounts on Solana.

---

## 4. Card, commerce, and payroll rails as spend endpoints

v3 keeps a strict separation between where risk is taken and where credit is spent:

* **Collateral side** – onchain revenues and streams (fees, creator rewards, Sablier, etc.).
* **Spend side** – where credit-funded cash goes (cards, commerce, BNPL, payroll, vendors).

On the spend side:

* card programs (Kast, Avici, others) expose **funding addresses** on Solana or stablecoin accounts,
* commerce and BNPL stacks expose merchant/settlement wallets or internal ledgers,
* payroll providers (including Deel and crypto-native stacks) accept **USDC or fiat**.

attn’s job:

* size, underwrite, and manage the **credit facility**,
* automate **draws** to these endpoints (auto top-ups of card funding addresses, prepaid payroll wallets, merchant/platform wallets, etc.),
* enforce **repayment** via revenue routing and PT/YT accounting.

The protocol does not:

* handle card KYC,
* operate as a consumer-facing payroll or BNPL brand (it lends to entities, not to employees or shoppers),
* originate or hold direct consumer receivables,
* reimplement HR, consumer lending, or commerce stack logic.

It funds those systems.

For detailed integration patterns with card, commerce, and BNPL partners, see **“For Cards, Commerce & BNPL Partners.”**

---
## 5. Caveat on large payroll incumbents (Deel and similar)

In a fully realised v3, you can imagine:

* companies with onchain revenues using attn credit to fund Deel-based payroll in USDC or fiat,
* possibly even a product surface inside a payroll platform where “attn-backed” credit is visible.

This is upside, not something the design relies on.

In practice, large payroll incumbents have strong incentives to build or control financial products around salaries themselves, including any credit or advance features. If they ever open a marketplace around employee salaries, they will likely:

* prioritise large, well-known lenders and banks, or
* ship something house-branded.

So, in the core design:

* attn should **not** assume any privileged integration with Deel or similar,
* Deel-style platforms are treated as:
  * important **spend endpoints** for borrowers,
  * not as collateral sources or protocol-level dependencies.

In other words:

> Payroll platforms are places where attn-funded money is often spent.  
> attn takes risk on the revenue streams and the borrowing entity, not on the payroll provider or its employees.

If, later, Deel or other payroll stacks expose hooks or marketplaces for external credit, attn can plug in as a **revenue-native credit engine** for crypto-native teams, but that is an optimisation path, not a requirement for v3 to make sense.


---

## 6. Roadmap implications

The v3 direction implies a simple ordering:

1. **v0 – Solana revenue accounts and credit**
   * Pump.fun creator rewards, protocol fee PDAs, DePIN income.
   * Revenue accounts, advances, credit lines, attnUSD.

2. **v1 – Credit lines with cards and simple spend rails**
   * Entity-level facilities powering card funding addresses and basic payout wallets.
   * Auto top-ups, routing, and repayment from revenues.

3. **v2 – Streams as revenue**
   * Treat onchain streaming infra (Sablier and others) as revenue accounts.
   * Extend credit to DAOs and entities whose income is streamed.
   * Carefully explore stream-backed credit to individuals when the stream is enforceable.

4. **v3 – Broad payroll / commerce / spend integration**
   * Fully general “revenue → credit → spend” loop where:
     * revenue sources can be PDAs, streams, and other onchain routes,
     * spend endpoints can be cards, payroll providers, merchant and BNPL rails, and vendor wallets.
   * Integration with large incumbents (like Deel) is strictly additive:
     * useful for distribution,
     * not assumed in risk or product design.

---

## 7. What does not change in v3

Even in this expanded vision, a few principles stay fixed:

* **Onchain-first underwriting**
  * attn takes risk on structured, onchain revenue and streams.
  * No reliance on credit scores or opaque offchain balance-sheet snapshots.

* **Clear separation of concerns**
  * attn provides revenue accounts, credit facilities, and PT/YT representation.
  * Card, commerce, BNPL, and payroll stacks remain separate, opinionated products.

* **Transparent risk to LPs**
  * attnUSD and other LP exposures are always backed by tokenised revenue positions and stablecoins.
  * No hidden leverage via third-party payroll, card, or BNPL providers.

The v3 direction is not “attn becomes a payroll, card, or BNPL company”.  
It is “attn becomes the **revenue-native credit engine** underneath whatever card, commerce, payroll, and spend stack a project already uses.”
