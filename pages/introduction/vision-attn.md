# Vision: Streams, Payroll Rails, and Revenue-Native Credit

This page is a forward-looking sketch of where attn could be in a later phase (“v3”).
It builds on the current design (Solana-native revenue accounts and credit) and extends it across:

* onchain streaming infra (Sablier and similar), and
* offchain payroll rails (Deel, cards) as spend endpoints,

while keeping the core invariant:

> attn underwrites and banks **revenue**, not banks, payroll providers, or personal credit scores.

It is deliberately aspirational and makes no assumption that large incumbents (like Deel) will partner early, if at all.

---

## 1. From v0 to v3 at a high level

Today’s design (v0–v1 in this language):

* **Object of focus** – onchain revenues

  * Pump.fun creator rewards
  * protocol fee switches
  * DePIN / machine income
* **Core primitives**

  * attn revenue accounts (jointly governed vaults)
  * revenue advances and credit lines
  * attnUSD backed by stablecoins + PT/YT on those revenues

The next steps (v2) generalise this to **streams**:

* treat onchain token streaming infra (e.g. Sablier Lockup / Flow and similar) as first-class “revenue accounts”,
* extend credit to entities whose income is streamed, not just lump-sum fee PDAs.

The “v3” vision extends one step further:

* attn remains a **revenue bank** onchain,
* but the *spend side* of its credit (payroll, cards, payouts) can connect into large payroll rails and card programs,
* without making those rails core dependencies or collateral sources.

---

## 2. What v3 feels like for different users

### Creators and devs

You run a token or app with recurring onchain income:

* trading fees, creator rewards, subscription flows, streamed grants.

You see:

* a single **revenue account** that aggregates all those sources, including:

  * Pump.fun creator rewards on Solana,
  * Sablier-style streams on EVM / Solana (e.g. vesting, grants, subscription income).

On top of that account you get:

* a **revolving credit line** sized by your aggregated revenue,
* the option to:

  * withdraw directly in stables,
  * plug a card into the facility (Kast, Avici, etc.),
  * route a portion of credit into payroll rails (onchain streams, or offchain providers).

From your perspective, the line is “just there”:

* you keep shipping and earning;
* contributors get paid (via streams or cards);
* attn handles top-ups and repayment rules in the background.

### Apps, DAOs, and companies

You have:

* protocol revenues landing on Solana,
* token or stable streams going out via Sablier to contributors,
* some mix of card spend and fiat/USDC payroll through providers.

You use attn as:

* the **revenue-native financing layer** beneath all of this:

  * a governed vault where fees route,
  * credit lines and advances backed by those fees + streamed income,
  * automatic repayment from future inflows.

You do not need to move your operations treasury or payroll stack on-chain.
You only need to:

* route the relevant revenue flows onchain into attn, and
* optionally expose how attn-funded credit is used (payroll, cards, growth).

### Individual contributors (end-state)

In a strict v3 end state (with the right integrations and wrappers):

* Some contributors could see:

  * streaming income onchain (Sablier)
  * plus a **small, stream-backed line** (e.g. “up to X% of your next N weeks of stream”)
  * optionally connected to a card or wallet they already use.

This only becomes realistic when:

* the stream itself is enforceable onchain and cannot be silently rerouted, or
* there is a partner (payroll or card program) enforcing routing on their ledger.

Until then, attn remains squarely focused on **entity-level credit** (projects, DAOs, companies), not unsecured personal lending.

### Liquidity providers

LPs hold attnUSD (and, later, more granular PT/YT exposure) backed by:

* Solana fee revenues,
* onchain token streams (Sablier and similar),
* revenue-backed credit to entities funding:

  * development, growth, liquidity,
  * payroll (onchain and offchain),
  * card spend and operations.

The LP side does not care which specific payroll or card rail was used.
LPs are exposed only to:

* revenue-backed PT/YT positions,
* conservative haircuts on streams,
* portfolio-level risk management.

---

## 3. Streams as first-class collateral (Sablier and beyond)

In v3, “revenue” is not just discrete transfers into a Squads vault; it includes **onchain streams**.

### Why streams matter

Streaming protocols such as Sablier already encode:

* **Lockup** – fully prefunded streams that release funds over time.
* **Flow** – debt-like streams where “amount owed = rate per second × elapsed time”.

For attn, these are natural objects:

* They are programmable, onchain cashflows.
* They can be referenced and monitored by programs.
* They can be pledged or partially re-routed, with the sender’s consent.

### How streams plug into attn

A v3-compatible implementation could treat each stream (or bundle of streams) as:

* a **Revenue-Bearing Position (RBP)**, similar to existing revenue accounts,
* with:

  * a clear source (`sender`),
  * an instrument (Lockup / Flow),
  * an expected horizon or “rate × time” profile.

attn can then:

* read stream parameters and history,
* set limits (e.g. “only X% of this stream can be pledged”),
* mint PT/YT-style positions against the pledged portion,
* route that pledged share into repayment buckets.

This works both for:

* DAOs paying themselves via streaming infra (easiest), and
* potentially for individuals when the stream itself is controlled by a DAO or company and cannot be silently revoked without onchain state changes.

Streams become another **standardised revenue input**, alongside Squads-based revenue accounts on Solana.

---

## 4. Payroll rails and card programs as spend endpoints

v3 assumes a clear separation:

* **Collateral side** – onchain revenues and streams (fees, creator rewards, Sablier, etc.)
* **Spend side** – where credit-funded cash goes (payroll, cards, vendors).

On the spend side:

* card programs (Kast, Avici, others) expose **funding addresses** on Solana or stablecoin accounts;
* payroll providers (including Deel and newer, crypto-native stacks) accept **USDC or fiat** to run their flows.

attn’s job remains:

* sizing, underwriting, and managing the **credit facility**,
* automating **draws** to these endpoints (auto top-ups of card funding addresses, prepaid payroll wallets, etc.),
* enforcing **repayment** via revenue routing and PT/YT accounting.

The protocol does not:

* handle card KYC,
* become a payroll provider,
* or attempt to reimplement HR / compliance.

It funds those systems.

---

## 5. The Deel question (and why it remains a dream, not a dependency)

Deel is a large, regulated HR/payroll platform with:

* EOR, contractor payments, global payroll, and fiat rails,
* support for USDC funding and crypto withdrawals at the edges.

In an ideal v3 world, one could imagine:

* companies with onchain revenues using attn credit to fund Deel-based payroll in USDC or fiat,
* possibly even a product surface in Deel where “attn-backed” credit is visible.

However, the likely reality:

* Deel has every incentive to build or control financial products around salaries itself, including any credit or advance features.
* If Deel ever opens a marketplace around employee salaries, it will likely:

  * prioritise large, well-known lenders and banks,
  * or ship something house-branded.

That means:

* attn should **not** assume any privileged integration with Deel in its core design;
* Deel and similar providers should be treated as:

  * important **spend endpoints** for borrowers,
  * not as collateral sources or protocol-level dependencies.

In other words:

> “Payroll platforms are where attn-funded money is often spent, not where attn takes risk.”

If, in the future, Deel or similar platforms expose hooks or marketplaces for external credit:

* attn could plug in as a **specialised, revenue-native credit engine** for crypto-native teams;
* but this is a stretch goal, not a required condition for success.

---

## 6. Roadmap implications

The v3 vision implies a simple but strict ordering:

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

4. **v3 – Broad payroll / spend integration**

   * Fully general “revenue → credit → spend” loop, where:

     * revenue sources can be PDAs, streams, and other onchain routes,
     * spend endpoints can be cards, payroll providers, and vendor rails.

   * Integration with large incumbents (like Deel) is strictly additive:

     * desirable as distribution,
     * not assumed in the protocol’s risk or product design.

---

## 7. What does not change in v3

Even in this expanded vision, a few principles remain constant:

* **Onchain-first underwriting**

  * attn takes risk on structured, onchain revenue and streams.
  * No reliance on credit scores or opaque offchain balance-sheet snapshots.

* **Clear separation of concerns**

  * attn provides revenue accounts, credit facilities, and PT/YT representation.
  * Card programs, payroll providers, and HR stacks remain separate, opinionated products.

* **Transparent risk to LPs**

  * attnUSD and other LP exposures are always backed by tokenised revenue positions and stablecoins.
  * No hidden leverage via third-party payroll or card providers.

The v3 direction is not “attn becomes a payroll or card company”.
It is “attn becomes the default **revenue-native credit engine** underneath whatever payroll and spend stack a project already uses.”

This page exists to keep that direction clear, while acknowledging that some parts of it (especially tight integrations with large incumbents) are unlikely to be available early and must not be assumed for the core protocol to make sense.
