# Revenue Accounts and Signing Model

This page describes the assumptions around custody, signatures, and vault design for revenue accounts.

---

## 1. Revenue Account (v1) design

A "revenue account" is not a special protocol-owned account type. In v1 it is implemented as a
Squads v4 multisig control plane plus a small set of vault token accounts (SPL token accounts)
that receive routed fees.

Typical layout:

- V0 collector (optional): landing/inbox vault for constrained upstream sources (swept into V1).
- V1 pledged revenue: the primary "income hub" that is pledged for servicing.
- V2 ops: borrower operating vault (where draws land; ops spend happens from here).
- V3 DSRA (optional): debt service reserve vault for conservative lanes.

What makes it "controlled":

- Timelocked governance on the Squads multisig for config changes (members/threshold/spending limits).
- Spending limits installed on pledged vaults that allow only a narrow set of money-moves.
- A constrained executor/sweeper key that can use those spending limits to run servicing, but cannot weaken config.

In v1, attn does not need to be a co-signer on the borrower multisig. Enforceability comes from
verifiable onchain invariants (timelock + allowlists) and continuous monitoring. Later versions
can add additional guardians/risk signers if desired.

---

## 2. Why Squads (or similar multisig) is required

Squads (and similar primitives) provide:

- **battle-tested multisig and role management**,  
- **timelocked configuration changes**,  
- **spending-limit primitives** to constrain automated execution,  
- **SOC 2-style operational discipline** around access and changes (for Squads Labs-run infra).

For attn, this matters because:

- credit is extended against the assumption that:
  - eligible revenues will continue to flow into the pledged vault path,  
  - automated servicing routes cannot be broadened without an onchain config change,  
  - weakening changes are transparent and (where needed) delayed or gated.

By anchoring revenue accounts in Squads:

- projects keep self-custody over funds and upgrades,  
- attn can rely on a well-understood security and governance surface,  
- third parties (LPs, launchpads) can audit account configuration onchain.

---

## 3. Signing and authority model (v1)

There are three distinct authority surfaces:

- Borrower governance (Squads multisig)
  - proposes/votes/executes configuration changes (timelocked).

- Borrower operational authority (ops vault)
  - draws land into the ops vault,
  - ops spending remains a borrower decision under its own governance policy.

- Executor / sweeper (restricted)
  - is not a multisig member,
  - can only move funds under pre-installed spending limits,
  - cannot add/remove members, modify timelocks, or change spending limits.

Typical allowlisted paths:

- collector -> pledged revenue
- pledged revenue -> repayment destination authority
- pledged revenue -> DSRA (optional)
- DSRA -> repayment destination authority

Important nuance:

- Spending limits allowlist destination authority pubkeys, not token-account addresses.
  - For attnCreditline repayment, the destination authority is the facility's vault authority PDA (not the repayment vault token account).

If the borrower weakens these controls (e.g. lowers timelock/threshold, adds delegates, broadens destinations, enables residual routes),
it is treated as a control-integrity failure and will affect facility status/limits.

---

## 4. Upstream routing vs lockboxes (fee routers)

Best case:

- upstream programs can route fees directly into the borrower's collector/pledged vault token accounts.

When a revenue source cannot pay an arbitrary destination (hardcoded collectors, PDA-only flows), an intermediate lockbox / receiver router
can be inserted upstream to forward funds into the pledged vault. The key requirement is that once funds enter the revenue account control
plane, servicing routes are still governed by timelocks + allowlisted spending limits.

### Pump.fun creator rewards (fee sharing)

Pump creator rewards have their own, Pump-specific control surface.

If fee sharing is enabled for a Pump mint:

- the Pump bonding curve `creator` becomes a **fee sharing config PDA** (not your wallet, not a Squads vault),
- the **actual recipients and split** are stored in that config (`shareholders[]`), and
- “transfer coin ownership” means transferring who can edit that config (`admin`),
- “remove creator share permissions” is a permanent lock bit (`admin_revoked`).

So the check that matters for credit is not “`creator == pledged vault`”, but:

- the fee sharing config exists and is active,
- pledged Squads vault(s) appear in the recipients list for the agreed share (often 100% in v1),
- and either the config is locked (`admin_revoked = true`) or the admin is behind a timelock + continuously monitored.

---

## 5. Assumptions and limitations

The model assumes:

- projects are willing to route a meaningful share of revenues through the pledged vault path,  
- participants accept that:
  - credit terms depend heavily on the integrity of this setup,  
  - bypassing or weakening it will immediately affect access to future credit.

It does **not** assume:

- that attn controls the entire protocol or treasury,  
- that all project spending is gated through the pledged path.

Revenue accounts are a narrow, opinionated piece of infra designed to make onchain revenues **bankable** without taking over governance of the entire project.
