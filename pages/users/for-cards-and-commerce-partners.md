# For Cards, Commerce & BNPL Partners

This page is for:

- card programs and wallets (cards funded in SOL or stablecoins, Kast, Avici, Solayer's Emerald, etc.),
- travel and rewards platforms,
- merchant networks and marketplaces,
- B2B SaaS and infra providers,
- BNPL / checkout providers who want credit funded by **onchain revenues**.

---

## What attn provides

attn provides a way to plug **revenue-backed credit** in behind an existing UX.  
End users see normal cards, checkouts, and instalments; attn only ever lends to the **merchant / platform / program**, never directly to the consumer.

1. **Entity-level credit facilities backed by onchain revenues**

   - Each creator, DAO, company, or platform has an **attn revenue account**.
   - attn sizes a revolving **credit facility** off that revenue:
     - limits based on level/volatility/diversification of income,
     - automatic repayment from future revenues,
     - optional base yield on idle balances.

   For a partner, this looks like:

   - “This entity has `$X` of credit headroom that can safely be allowed for spend.”

2. **Automatic card and wallet top-ups**

   - Card programs or wallets expose a **funding address** in SOL or stablecoins (USDC or similar) per card/wallet.
   - attn watches those addresses and the entity’s facility.
   - When balances fall below thresholds and there is headroom, attn:
     - draws from the facility,
     - tops up the funding address,
     - tags the draw to the relevant card / wallet.

   The end-user experience stays simple:

   - “Tap card; balance is there.”
   - attn handles the line, repayment, and revenue routing behind the scenes.

3. **Merchant, B2B and vertical BNPL financed from revenues**

   - For shops, platforms, and B2B vendors (including B2B SaaS and infra providers), attn facilities can fund:
     - instalment offers (“3 × monthly payments”),
     - pre-packaged travel or commerce bundles,
     - B2B payment terms on large API / infra invoices (30–90 day net terms),
     - supplier and vendor payments.

   In all of these, the **consumer or B2B buyer** owes instalments to the **partner (merchant/platform/BNPL brand)**.  
   The partner then owes attn under its facility.  
   The BNPL exposure on attn’s side is always a draw on the **partner’s revenue-backed facility**, not a direct consumer loan.

4. **Shared economics and layered rewards**

   - Partners can keep existing points / cash-back / discount structures.
   - attn can:
     - fund the underlying spend from revenue-backed lines,
     - optionally share a piece of the credit yield,
     - support joint campaigns (“extra rewards when paying from attn-backed credit”).

---

## 1. Target partners

### 1.1 Card programs

For card programs that issue cards funded in SOL or stablecoins:

- Visa/Mastercard rails,
- SOL or stablecoins (USDC, USDT, or other supported assets) as funding currency,
- integrated perks such as travel discounts, points, and partner offers,

attn enables:

- onboarding of **creators, DAOs, and protocols** whose income is onchain,
- card limits that grow with an entity’s attn-backed facility,
- full retention of KYC, compliance, and network integration within the card stack.

### 1.2 Travel, rewards, merchant and B2B platforms

For operators of:

- travel products with negotiated hotel/flight discounts,
- commerce marketplaces with points and partner offers,
- merchant networks with category-based rebates,
- B2B SaaS, infra, or tooling platforms offering usage-based billing and net terms,

attn enables:

- using protocol / creator / DAO / B2B **revenues** as the funding source for:
  - employee and contributor cards,
  - marketing and growth budgets,
  - BNPL and staged-payment offers,
  - large B2B invoices on 30–90 day terms,
- while the platform retains control of:
  - which merchants or customers are eligible,
  - how points, discounts, and perks are structured,
  - which B2B clients qualify for extended terms.

---

## 2. Integration patterns

### 2.1 Card-led: auto-topups from a revenue-backed line

Objects:

- **Revenue account**  
  - dual-governed vault where the entity’s protocol/creator/company revenues land.

- **attn credit facility**  
  - entity-wide limit (`entity_limit_outstanding`, `entity_limit_monthly`),
  - repaid automatically from a slice of future revenues.

- **Card funding address**  
  - a SOL or stablecoin funding address per card, provided by the card program,
  - KYC, card issuance, Visa/Mastercard, Apple/Google Pay are handled by the program.

Flow:

1. The entity signs an attn facility backed by its revenue account.
2. The entity links one or more card funding addresses.
3. For each address, attn stores:
   - `card_monthly_cap`,
   - `topup_chunk`,
   - `min_card_balance`,
   - optional `max_topups_per_day`.
4. A watcher:
   - monitors card funding balances onchain,
   - checks headroom on the entity facility and per-card caps,
   - when `balance < min_card_balance` and there is headroom:
     - draws `topup_chunk` from the facility,
     - sends funds to the funding address,
     - records a tagged credit position.

Card programs retain:

- all card-network logic,
- all consumer compliance and support.

attn:

- sizes and runs the credit facility,
- automates onchain top-ups,
- routes future revenues back to repay.

### 2.2 Commerce-led: revenue-backed BNPL and offers

For merchants and platforms, BNPL becomes a specific pattern of drawing on an attn facility.  
The credit chain is always:

> Consumer / buyer → partner (merchant / platform / BNPL brand) → attn

attn never holds a direct claim on the consumer or buyer; only on the partner.

#### Consumer BNPL on partner rails

Example:

- A travel platform offers “pay in 3 instalments” for hotels booked with its card or checkout.
- The platform has an attn facility sized off its take-rate from bookings and other onchain revenues.

Flow:

1. A customer checks out via the partner’s card / payment method and selects “pay in 3”.
2. The platform (or its BNPL brand) agrees to collect 3 × payments directly from the customer.
3. To fund the upfront cost, the platform:
   - draws the relevant amount from its attn facility into its treasury or settlement account.
4. The platform pays the merchant (or itself, if it is the merchant) in full.
5. Over the next 3 periods, the customer repays the platform according to schedule.
6. Those repayments, together with other platform revenues, flow through the revenue account and amortise the attn draw.

Who owes whom:

- The **customer owes the platform / BNPL brand**.
- The **platform / BNPL brand owes attn** under its facility.
- attn’s risk is on the **platform’s revenue stream**, not on individual consumers.

#### B2B invoice BNPL / revenue-backed net terms

Example:

- An infra or API provider issues a 50k equivalent monthly invoice to a customer on 60-day terms.
- The provider holds an attn facility sized off recurring protocol / network revenues (including similar invoices).

Flow:

1. An invoice is issued with net-60 terms.
2. The provider decides to smooth cashflow and:
   - draws (part of) the invoice amount from its attn facility to fund payroll, infra, or growth.
3. Over the next 60 days:
   - the B2B customer pays the invoice according to terms,
   - the provider’s overall revenues (including this invoice) flow through its revenue account.
4. Those revenues amortise the attn draw automatically.

Who owes whom:

- The **B2B customer owes the provider** under the invoice.
- The **provider owes attn** under its facility.
- attn holds risk on the **provider’s revenue stream and behaviour**, not directly on the end-customer.

Benefits:

- higher conversion and larger baskets for merchants,
- capacity for B2B vendors to offer generous net terms,
- credit limits that grow with actual recurring income.

### 2.3 Joint rewards and partner promos

Because both stacks are programmable, partners can define offers that trigger only when:

- spend comes from a card linked to an attn-backed entity, or
- a given merchant, category, or B2B invoice is funded via attn credit.

Examples:

- “Extra travel points when a DAO pays for flights from a revenue-backed line.”
- “Higher cash-back multipliers for creators using an attn-backed line at a specific partner store.”
- “Tier upgrades when a B2B client consistently pays API invoices on time, funded via an attn-backed vendor line.”

attn logs which draws and repayments belong to which partner surfaces, enabling:

- performance tracking of each programme,
- shared economics,
- iterative adjustment of caps and offers.

---

## 3. Depth of integration

Partners can start shallow and increase depth over time.

### 3.1 Level 0 – Simple funding rail

- The entity draws manually from its attn line into:
  - a card funding account,
  - a merchant wallet,
  - or a treasury account used to cover B2B invoices.
- attn may appear as “one of the sources” for top-ups, with no automation required.
- Suitable for pilots and early joint users.

### 3.2 Level 1 – Automated top-ups (no auth hook)

- The watcher pattern is added:
  - balances are monitored onchain,
  - auto-topups occur when below threshold, within limits.
- No changes are required to the card or checkout auth path.
- Operates fully from onchain data, as long as funding addresses are stable.

### 3.3 Level 2 – Real-time auth assist (optional)

For card programs or advanced checkouts:

- When a transaction would fail due to insufficient balance:
  - the processor / program calls an attn auth API,
  - attn checks facility headroom and policy,
  - attn responds with “approve + topup_amount” or “deny”.
- If approved:
  - the processor approves the card payment,
  - attn immediately draws from the facility and funds the card/merchant account.

This pattern:

- keeps the partner in control of final auth,
- allows existing fraud and risk rules to remain primary,
- positions attn as a second-layer credit engine, similar to how some bank cards tap separate credit lines.

---

## 4. BNPL: what fits cleanly

Within this pattern, partners can:

- Offer BNPL and instalment products where **the merchant, platform, or B2B vendor** is the borrower from attn.
- Wrap those into existing UX:
  - “Split this trip into 3 payments”,
  - “Pay this invoice in 60 days”,
  - “Get extended net terms on API usage”.

The key separation of roles is:

- Consumers and B2B buyers:
  - contract with and repay the partner (merchant/platform/BNPL brand).
- Partners:
  - contract with and repay attn under a revenue-backed facility.
- attn:
  - never holds direct consumer receivables,
  - underwrites only on **onchain revenues** and related project risk.

attn is **not** designed as a generic, unsecured consumer BNPL engine:

- facilities are underwritten on onchain revenues, not on consumer salary or credit history.
- Consumer lending regulations, disclosures, and recovery mechanics stay in the partner and merchant stacks.

---

## 5. Positioning to end users

For a card / commerce / B2B partner, the external message can be:

- “Card and spend limits grow with your project’s onchain revenues.”
- “Instalments and net terms funded by your own income, not token dumps.”
- “Travel, shop, and pay invoices against income streams that are verifiable onchain.”

attn remains primarily infra:

- the **revenue bank** that turns cashflows into credit,
- the onchain layer that LPs fund via attnUSD,
- a set of programs that keep routing and repayment rules enforceable.

Partners retain:

- the brand,
- the card, shop, or B2B UX,
- and the relationship with end users and customers.
