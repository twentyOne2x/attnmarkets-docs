# Roadmap (Indicative)

This roadmap is about **sequencing and phases**, not hard promises.  
Timelines, scope, and ordering can change as the market and data evolve.

For a narrative view of the long-term direction (streams, payroll rails, cards), see:

- _Vision: Streams, Payroll Rails, and Revenue-Native Credit_.

---

## Phase 0 – Infra and internal pilots

Focus:

- Prove the core design with a very small set of projects.  
- Keep scope narrow and heavily manual.

Milestones:

- CreatorVault / revenue account implementation on devnet.  
- Integration with Squads (2-of-2 or similar) for governed revenue accounts.  
- Exponent-style Standardised Yield (PT/YT) representation for revenue positions.  
- attnUSD vault skeleton with manual risk controls and no public access.  
- First internal pilots with tightly controlled limits.

---

## Phase 1 – Guarded mainnet and a curated book

Focus:

- Move to mainnet with conservative risk and a small, curated set of entities.

Milestones:

- Guarded mainnet launch of revenue accounts on Solana.  
- First cohort of apps / creators routing revenues into attn accounts.  
- One-off revenue advances with short tenors and tight caps.  
- attnUSD live with limited external access (whitelisted LPs, capped TVL).  
- Basic risk and limits framework enforced off-chain plus on-chain guards.  

---

## Phase 2 – Credit lines, base yield, and launchpad flows

Focus:

- Broader product surface and better onboarding for serious projects.

Milestones:

- Revenue-backed **credit lines** for projects with stable earnings.  
- Base yield on idle balances in revenue accounts (e.g. SOL staking, yield-bearing stables) with conservative risk limits.  
- Launchpad integrations:
  - “Connect to attn” at launch,
  - standard templates for fee routing,
  - vesting + revenue hybrid positions.  
- Expanded LP base with clear risk disclosures and portfolio reporting.  

---

## Phase 3 – Cards, commerce and BNPL partners

Focus:

- Turn attn facilities into funding rails behind cards, wallets, and merchant flows.

Milestones:

- First integrations with card and wallet programs using:
  - revenue-backed entity facilities,
  - automated top-ups to card funding addresses.  
- Initial commerce / BNPL use cases where:
  - instalments and net terms for merchants and B2B vendors
  - are funded by their own attn facilities (not by unsecured consumer credit).  
- Shared-economics and rewards pilots with partners (joint campaigns, revenue-backed limits).  
- Clear separation of responsibilities:
  - attn underwrites revenue and runs facilities,
  - partners own KYC, auth, and consumer/B2B UX.  

See: _For Cards, Commerce & BNPL Partners_ for the conceptual integration model.

---

## Phase 4 – Streams and cross-chain income

Focus:

- Generalise “revenue” to include onchain streams and cross-chain income.

Milestones:

- Treat onchain streaming infra (Sablier-style Lockup / Flow and similar) as first-class revenue inputs.  
- Entity-level facilities that combine:
  - Solana fee PDAs,
  - cross-chain streams,
  - other onchain income.  
- Careful pilots for stream-backed credit where the stream itself is enforceable onchain.  
- Integrations with other Solana and cross-chain protocols that understand PT/YT and attnUSD.  

---

This roadmap is **indicative**, not a binding commitment.  
The invariant across phases is that attn remains a **revenue-native credit and yield layer**:  
credit is underwritten on onchain revenues and streams, and LPs always hold tokenised claims on those cashflows plus stablecoins, not opaque external risk.
