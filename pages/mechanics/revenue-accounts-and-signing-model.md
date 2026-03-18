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

### 3.5 Who can move funds? (plain English)

During an active facility, think of permissions this way:

- **Borrower (governance + ops)**
  - can run normal business spending from the ops vault under borrower safe policy,
  - can propose config changes, but cannot instantly widen repayment rails when posture is valid.

- **Automated sweeper (restricted executor key)**
  - can move funds only on pre-installed allowlisted paths (for example collector -> pledged -> repayment/DSRA),
  - cannot send funds to arbitrary destinations,
  - cannot change multisig members, timelock, spending limits, or config posture.

- **attn / lender governance**
  - does not custody the borrower treasury and is not required to co-sign day-to-day ops spending,
  - controls facility state at the protocol layer (activate, throttle/freeze, unfreeze under policy),
  - monitors rail integrity and can freeze quickly if weakening is detected.

Config-authority nuance:

- If the borrower safe is **autonomous**, config changes must go through approvals + timelock.
- If the safe is **controlled**, the pinned config authority key can approve config changes.
- For enforceability, a live facility requires either autonomous config posture or a pinned/expected config authority posture.

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

### Current Pump/Swig borrower-first lifecycle

For the current Pump borrower lane, the practical control lifecycle is:

1. **Before onboarding**
   - `SharingConfig.admin = borrower wallet`
   - The borrower directly controls Pump fee-sharing admin mutations.

2. **During ACTIVE**
   - `SharingConfig.admin = pledged Swig wallet`
   - This pledged Swig wallet is the current Pump fee-admin pubkey while the loan is active.
   - This is **not** intended to mean "attn hot wallet custody."
   - The control surface is a **program-controlled Swig wallet path**.
   - In the current ACTIVE posture, practical control of that path sits with the ATTN-configured manage authority through Swig policy.
   - The borrower is intentionally stripped of direct manage actions on the pledged path while the facility is active.
   - Narrow executor roles can run allowlisted servicing moves but do not get broad reconfiguration power.

3. **After CLOSE**
   - A Swig-signed Pump admin transfer moves fee control back to:
     - the borrower wallet, or
     - a borrower-selected target wallet.

So the intended model is:

- the borrower controls fee admin before onboarding,
- the pledged Swig wallet is the onchain Pump admin during ACTIVE,
- practical control of that Swig path sits with the ATTN-configured authority through Swig policy,
- the borrower (or chosen target) regains fee admin after CLOSE.

This means the current Pump borrower lane is designed to be:

- **temporary**, not permanent,
- **policy-controlled**, not borrower-unilateral during ACTIVE,
- **reversible**, not a one-way surrender of creator-fee control.

### ClawPump: data compatibility is not control parity

ClawPump can be confusing because two different questions get mixed together:

1. **Can ATTN observe enough data to show a bounded underwriting / compatibility view?**
2. **Can ATTN control the fee-admin lifecycle the same way it can in the borrower-first Pump path?**

Those are not the same thing.

A ClawPump token may still be visible to ATTN's data plane because it can trade in the same Pump / PumpSwap ecosystem that ATTN watches for:

- market activity,
- fee-proxy inputs,
- revenue-like underwriting signals.

That explains why a ClawPump token may be **data-compatible**.

But that does **not** mean it has **control parity** with the core borrower-first Pump path.

Control parity would require proof of the same reversible lifecycle:

1. borrower initially controls fee admin,
2. fee admin moves into the Swig path for ACTIVE,
3. ACTIVE posture is enforceable and verifiable,
4. fee admin returns to borrower or target after CLOSE.

That full control lifecycle is not currently proven for ClawPump, so the correct product claim remains:

- **compatibility only**
- not **fee-admin / ACTIVE-lock / offboarding parity**

### Does backend uptime matter for fee routing?

Two different things matter here:

1. **Onchain routing state**
   - Once Pump fee admin and Swig permissions are configured onchain, fee routing posture does **not** require a web server to remain online.
   - A backend outage does not by itself give control back to the borrower or transfer control to an outsider.

2. **Guided product lifecycle**
   - The current attn product still relies on backend and keeper services for:
     - activation gating,
     - debt-state checks,
     - guided close/offboarding verification,
     - automatic fee collection / servicing automation.

So the current product should be understood as:

- **security posture during ACTIVE** does not depend on backend uptime,
- **automated servicing and guided CLOSE/offboarding** still depend on attn-operated services being online.

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

**Does attn permanently take creator-fee ownership?**

No. In the intended Pump borrower-first flow:

- borrower controls fee admin before onboarding,
- pledged Swig path controls fee admin during ACTIVE,
- borrower or borrower-selected target regains fee admin after CLOSE.

**Can a random outsider steal creator-fee control during ACTIVE?**

Not in the intended path just by "showing up." The realistic risks are:

- compromise of the current control authority path,
- wrong or inaccessible offboarding target,
- unsupported assumptions on external platforms,
- or an operator/product fault that leaves the position temporarily stuck until recovery/offboarding completes.

**Does ATTN technically hold the control key during ACTIVE?**

In the current default `swig` borrower path: yes, ATTN controls a real authority signer.

The precise model is:

1. `Pump` sees the pledged Swig wallet as the current fee admin,
2. `Swig` governs which roles can act through that wallet,
3. the role with `manageAuthority` during ACTIVE is the `ATTNConfig` authority.

So the practical controller during ACTIVE is:

- **the ATTN-configured authority behind `ATTNConfig`**

That is not the same thing as:

- borrower control,
- random outsider control,
- or "the backend server itself is the signer."

It does mean the current default path relies on an ATTN-controlled signer for ACTIVE custody and post-close transfer-back.

**So should this be Squads / multisig / MPC?**

Yes, if you want stronger custody guarantees.

The codebase already distinguishes:

1. `swig`
   - policy-wallet control plane
   - current default
2. `squads`
   - multisig/vault control plane
   - safer target if you want stronger authority hardening

So the practical statement is:

- current default Swig path = ATTN-controlled authority through Swig policy
- stronger target posture = Squads or MPC/HSM-backed signer custody

Concrete reading of that statement:

1. in proof/dev environments, ATTN control is literally represented by a local signer keypair
2. in the web app, the onboarding screen may show a placeholder authority pubkey before real configuration is provided
3. in production, the real ACTIVE control authority is the ATTN-operated pubkey configured into the `ATTNConfig` Swig role

So when someone asks "who owns it during ACTIVE?", the accurate answer is:

- `Pump` sees the pledged Swig wallet as admin,
- `Swig` enforces the role model,
- and the practical controller is the ATTN-configured authority signer behind `ATTNConfig`.

**What is actually test-covered**

The product currently has meaningful test coverage for:

1. borrower misconfiguration during ACTIVE
   - borrower cannot retain `manageAuthority`
2. missing expected ATTN authority
   - the configured `ATTNConfig` authority must hold `manageAuthority`
3. wrong authority present
   - if a different authority has `manageAuthority` while the expected ATTN authority does not, verifier/stage/activation fail closed
4. unauthorized ACTIVE fee-admin mutation attempts
   - borrower and other non-authority actors are expected to fail closed when attempting to reroute creator fees

What is **not** honestly solved by those tests:

1. compromise of the real active ATTN authority signer
   - if the signer behind `ATTNConfig` is compromised, the chain still sees that signer as legitimate
   - this is a custody-hardening problem, not something verifier logic can detect away

So the accurate security statement is:

## Recommended custody hardening path

The clean answer is:

1. **today**
   - the default Swig borrower path still depends on a real ATTN-controlled authority signer behind `ATTNConfig`
2. **fastest safer improvement**
   - keep the same Swig role model,
   - move that signer to **HSM-backed** or **MPC-backed** custody
3. **stronger long-term governance posture**
   - move ACTIVE control to a **Squads / multisig-backed** authority posture

Why:

1. HSM/MPC reduces single-key compromise risk without forcing a borrower-facing UX redesign.
2. Squads/multisig is the stronger governance answer if you want “no single ATTN operator can reassign creator-fee admin during ACTIVE.”
3. Squads/multisig is also a bigger migration, so it should be treated as a second-stage target, not casually implied as already true.

What this means in plain language:

1. **Current default**
   - secure enough to block borrower misuse and random outsiders in the intended path,
   - but still dependent on the custody quality of one ATTN authority path.

2. **Target posture**
   - the ACTIVE control authority should be backed by:
     - HSM, or
     - MPC, or
     - Squads/multisig
   - depending on how much governance hardness ATTN wants relative to implementation friction.

Canonical internal spec:
- `/Users/user/PycharmProjects/attn-credit/docs/plans/active/2026-03-11-active-control-authority-hardening-spec.md`

- unauthorized outsiders and misconfiguration are tested against
- compromise of the actual active authority requires stronger custody, such as Squads, MPC, HSM, or a similar signer-control model

**Does attn custody funds?**

No. Funds live in onchain accounts controlled by the borrower's safe and its vault authorities. attnCredit is designed to be non-custodial while still making repayment controls enforceable.
