# Revenue Accounts and Signing Model

This page describes the assumptions around custody, signatures, and vault design for revenue accounts.

---

## 1. Revenue Account (v1) design

A "revenue account" is not a special protocol-owned account type. In v1 it is implemented as a
Squads v4 multisig control plane plus a small set of vault token accounts (SPL token accounts)
that receive routed fees.

Typical layout:

- V0 collector (optional): receives upstream fees when the source can only pay a single address.
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

There are four distinct authority surfaces:

- Borrower governance (borrower safe / Squads multisig)
  - executes configuration changes under the multisig policy (timelocked where applicable).

- Borrower operational authority (ops vault)
  - draws land into the ops vault,
  - ops spending remains a borrower decision under its own governance policy.

- Executor / sweeper (restricted)
  - is not a multisig member,
  - can only move funds under pre-installed spending limits,
  - cannot add/remove members, modify timelocks, or change spending limits.

- Lender / pool governance (separate safe)
  - controls facility state at the protocol layer (activate, freeze/unfreeze),
  - can tighten parameters within policy when control integrity weakens.

### 3.1 Two safes (two control planes)

In v1 we treat these as separate objects:

- Borrower safe: holds the borrower's treasury plus the revenue account vault template (collector/pledged/ops/DSRA).
- Pool governance safe: holds the governance signing authority for facility control actions.

Key point: being a signer on pool governance does not make you a signer on the borrower safe, and vice versa.

### 3.2 Baseline borrower safe requirements (v1)

At onboarding (and continuously), a conservative baseline posture includes:

- timelock at least 7 days,
- non-trivial multisig (>=2 members, threshold >=2),
- pledged vault token accounts are owned by the expected vault authorities and have no delegates,
- the draw/ops authority is pinned to the ops vault authority,
- the executor/sweeper key is not a multisig member and cannot act as the ops/draw authority,
- spending limits exist and implement a strict allowlist of paths (see below),
- residual route to ops is disabled by default (no pledged -> ops spending limit).

Note: Squads v4 has a distinct `config_authority` concept for certain safe configuration operations. If a borrower safe uses a separate config authority key,
it should be treated as a privileged risk surface and pinned/monitored by policy.

### 3.3 Config authority (why timelocks can be bypassed)

Squads v4 has two ways a safe's configuration can be governed:

- **Autonomous safe**: there is no privileged config-admin key. Config changes go through member approvals and the timelock.
- **Controlled safe**: a specific **config authority** key can sign certain config changes directly.

For attnCredit, the timelock story only works if config cannot be changed instantly.

So while a credit position is active, we require one of these to be true:

- the safe is autonomous (config authority is the default "no one" value), or
- the config authority is pinned to the expected key (so config changes can't happen without that key).

In both cases, config changes are auditable onchain and treated as a monitored control surface.

### 3.4 Position lifecycle (what changes at open/close)

High level:

- **Before activation**: the borrower configures the revenue account rails (vaults + spending limits + timelock) and we verify the posture.
- **While active**: the borrower can operate normally from the ops vault, but the rails that protect debt service cannot be widened instantly.
- **At close**: returning or changing config authority is possible, but it is an explicit action (not an automatic protocol behavior).

If these controls weaken (lower timelock/threshold, new delegates, broader destinations, residual routes enabled),
it is treated as a control-integrity failure and can trigger rapid throttle/freeze actions at the protocol layer.

Typical allowlisted paths:

- collector -> pledged revenue
- pledged revenue -> repayment destination authority
- pledged revenue -> DSRA (optional)
- DSRA -> repayment destination authority

Important nuance:

- Spending limits allowlist destination authority pubkeys, not token-account addresses.
  - For attnCreditline repayment, the destination authority is the facility's vault authority PDA (not the repayment vault token account).

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
- fees accrue into a Pump creator-fee vault keyed by that config, and are distributed to `shareholders[]`,
- “transfer coin ownership” means transferring who can edit that config (`admin`),
- “remove creator share permissions” is a permanent lock bit (`admin_revoked`).

So the check that matters for credit is not “`creator == pledged vault`”, but:

- the fee sharing config exists and is active,
- pledged Squads vault(s) appear in the recipients list for the agreed share (often 100% in v1),
- and either the config is locked (`admin_revoked = true`) or the admin is behind a timelock + continuously monitored.

Operational note: permanently locking the fee sharing config is an onchain admin action. If the `admin` is a program-controlled address (for example a Squads vault PDA),
the lock must be executed through that controlling program so the PDA can sign.

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

---

## 6. FAQ

**Do I need to co-sign everything with attn?**

No. In v1, attn does not need to be a member on the borrower safe. The borrower controls day-to-day ops spending. Enforceability comes from verified rails and protocol-level control actions.

**What does attn control, then?**

Two things:

- the protocol facility state (activate, freeze/unfreeze) via lender/pool governance, and
- the integrity of the revenue account rails (timelock, spending-limit allowlists, and config posture) via verification + monitoring.

**Can the borrower change the rules instantly?**

Not if the posture is valid. A borrower safe must be configured so that config changes are timelocked (autonomous) or require a pinned config authority key (controlled). Any weakening attempts are detectable and can trigger freeze.

**What does “transfer coin ownership” mean for Pump?**

It refers to Pump's fee sharing configuration: who can edit the fee recipients and whether that config is locked. It is not a statement about transferring the token mint itself.

**Does attn custody funds?**

No. Funds live in onchain accounts controlled by the borrower's safe and its vault authorities. attnCredit is designed to be non-custodial while still making repayment controls enforceable.
