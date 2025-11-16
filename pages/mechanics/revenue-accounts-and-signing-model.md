# Revenue Accounts and Signing Model

This page describes the assumptions around custody, signatures, and vault design for revenue accounts.

---

## 1. CreatorVault / Revenue Account design

Revenue accounts are intended to be:

- **programmable vaults** (e.g. Squads Safe) living on Solana,  
- jointly controlled by:
  - the project (team / DAO multisig),  
  - and attn (or another designated risk agent in later versions).

Key properties:

- **Deterministic routing**
  - when no positions are open, withdrawals are single-signer (project only),  
  - when positions are open, revenue splits and repayment flows are enforced by program logic.

- **Separation of concerns**
  - operating wallets remain under the project’s control,  
  - the Revenue Account sits as a dedicated “income hub” with clear rules,  
  - attn does not co-sign day-to-day ops spending, only configuration of the revenue module.

---

## 2. Why Squads (or similar multisig) is required

Squads (and similar primitives) provide:

- **battle-tested multisig and role management**,  
- **upgrade and authority controls** for program-owned accounts,  
- **SOC 2-style operational discipline** around access and changes (for Squads Labs-run infra).

For attn, this matters because:

- credit is extended against the assumption that:
  - revenues will continue to flow into a given vault,  
  - routing rules cannot be unilaterally bypassed,  
  - configuration changes are transparent and (where needed) delayed or gated.

By anchoring revenue accounts in Squads:

- projects keep self-custody over funds and upgrades,  
- attn can rely on a well-understood security and governance surface,  
- third parties (LPs, launchpads) can audit account configuration onchain.

---

## 3. Signing model

A typical pattern:

- **Configuration changes**
  - adding / removing signers,  
  - changing revenue routing rules,  
  - enabling new facilities or changing caps,  
  require:
  - multisig approval (project signers), plus  
  - attn (or a designated risk signer).

- **Operational withdrawals**
  - when no debt is outstanding:
    - project-only signatures can move unencumbered funds out.  
  - when debt is outstanding:
    - routing logic first allocates the agreed share of new revenues to positions,  
    - remaining, unencumbered amounts are withdrawable by the project.

- **Emergency controls**
  - in severe cases (bugs, exploits, governance attacks),  
  - a pre-agreed emergency playbook can:
    - pause new positions,  
    - freeze revenue routing changes,  
    - redirect inflows to a temporary safe until governance decides.

Exact thresholds (e.g. M-of-N signers, presence of independent guardians, timelocks) are configuration choices and should be set conservatively.

---

## 4. Assumptions and limitations

The model assumes:

- projects are willing to route a meaningful share of revenues through a governed vault,  
- participants accept that:
  - credit terms depend heavily on the integrity of this setup,  
  - bypassing it will immediately affect access to future credit.

It does **not** assume:

- that attn controls the entire protocol or treasury,  
- that all project spending is gated through the Revenue Account.

Revenue accounts are a narrow, opinionated piece of infra designed to make onchain revenues **bankable** without taking over governance of the entire project.
