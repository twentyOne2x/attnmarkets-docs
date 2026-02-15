# attn-credit v1: Revenue Vaults (V0-V3) + Invariants

Status: internal notes (not external-facing).

Scope: this is the *control-plane* model implemented by `attn-credit` (Squads v4 + invariants), and how it connects to `attn-protocol` repayment endpoints.

As of: 2026-02-14.

Key code references (source of truth):
- Vault indices + ATAs + default spending limits: `attn-credit/scripts/devnet/fixtures.ts`
- Borrower invariants (P1-P9): `attn-credit/services/borrower-verifier/src/verifier.ts`
- Config weakening detection (baseline vs current): `attn-credit/services/risk-engine/src/weakening.ts`
- SpendingLimit execution tx builder: `attn-credit/services/executor-sweeper/src/spendingLimit.ts`

---

## 0) Terms (be precise about “vault”, “token account”, “authority”)

Squads v4 has two important primitives:

- **Multisig**: the governance object (members, threshold, timelock, config authority).
- **Vault PDAs (indexed)**: deterministic PDAs derived from the multisig and a `vault_index` (0..255). These are “authorities” that can:
  - own SPL token accounts (typically ATAs) and
  - act as signers *via Squads execution* (CPI + `invoke_signed` inside the Squads program).

For SPL tokens, we generally use:

- `Vault<i>` = Squads vault PDA at index `i` (a pubkey)
- `V<i>_ATA` = SPL Associated Token Account for `Vault<i>` for the facility asset mint (USDC in v1)

In v1 onboarding/config, we standardize on **four vault indices**:

---

## 1) What each vault index does (V0 / V1 / V2 / V3)

| Vault | Name (v1) | What it holds | What it’s for | Who can move funds out |
|---|---|---|---|---|
| **V0** | **collector** | USDC `V0_ATA` | Primary inbound collection point for revenue. Upstream sources route into this account. | **Sweeper hotkey**, via Squads spending limits (no multisig membership required). |
| **V1** | **pledged revenue** | USDC `V1_ATA` | “Pledged” cashflow bucket. This is the source vault for repayments to the protocol. | **Sweeper hotkey**, via spending limits (strict destination allowlist). |
| **V2** | **ops vault** | USDC `V2_ATA` | Borrower’s operations wallet *and* the protocol’s “borrower authority” anchor. `attn-protocol` draws land here. | Borrower governance (Squads members) via normal multisig execution. **Not** via the sweeper spending limits (by default). |
| **V3** | **DSRA (optional)** | USDC `V3_ATA` | Debt service reserve account. Optional buffer bucket that can be topped up from V1 and used to repay the facility. | **Sweeper hotkey**, via spending limits (if enabled). |

Two v1 design choices matter a lot:

1. **`borrower_authority` == `Vault2`** (not a member hotkey)
   - Onchain `attn_creditline::draw` requires a signer called `borrower_authority`.
   - In v1, that signer is the Squads vault PDA **V2**, which can sign only when Squads executes the transaction.

2. **“Residual route” is disabled by default**
   - There is **no** default V1 -> V2 spending limit.
   - This is intentionally “deny-by-default”: pledged revenue should not leak to ops unless a facility explicitly enables residuals.

### 1.1 Diagram: vault roles + repayment routing

```mermaid
flowchart LR
  Up["Upstream revenue sources"] --> V0["V0_ATA (USDC)\nowner=Vault0 PDA"]

  Sweeper["Sweeper hotkey\n(non-member delegate)"] -->|spendingLimitUse| V0
  V0 -->|dest=Vault1 PDA| V1["V1_ATA (USDC)\nowner=Vault1 PDA"]

  Sweeper -->|spendingLimitUse| V1
  V1 -->|dest=FacilityVaultAuthority\n(to repayment_vault)| Repay["Creditline RepaymentVault (USDC)\nowner=FacilityVaultAuthority PDA"]

  V1 -->|optional dest=Vault3 PDA| V3["V3_ATA (USDC)\nowner=Vault3 PDA"]
  Sweeper -->|optional spendingLimitUse| V3
  V3 -->|dest=FacilityVaultAuthority\n(to repayment_vault)| Repay
```

---

## 2) The default waterfall (how funds move)

### 2.1 Canonical USDC waterfall routes (v1)

- Upstream revenue sources deposit USDC into **V0_ATA**.
- Sweeper consolidates **V0_ATA -> V1_ATA** under an allowlisted spending limit.
- Sweeper routes **V1_ATA -> protocol repayment endpoint** under an allowlisted spending limit.
- Optional: Sweeper can also route **V1_ATA -> V3_ATA** (DSRA top-up) and then **V3_ATA -> repayment**.

### 2.2 Important nuance: Squads spending limits allowlist **destination authorities**

Squads v4 spending limits allowlist the **destination authority pubkey** (not “a specific token account address”).

When a spending-limit transfer runs, it provides:

- `destination` (authority pubkey, checked against the allowlist), and
- `destination_token_account` (actual SPL token account to receive funds), which must be **owned by** `destination`.

For `attn-protocol` repayments:

- The allowlisted `destination` must be **`FacilityVaultAuthority(facility_state)`** (a PDA derived by the `attn_creditline` program).
- The actual `destination_token_account` is typically the protocol’s **`repayment_vault`** token account, which is owned by `FacilityVaultAuthority`.

This is why the verifier treats “repayment destination” as the **vault authority PDA**, not the repayment vault token account address.

### 2.3 Timelock vs spending limits (slow config, fast execution)

The v1 control-plane tries to separate:

- **Slow path (governance/config changes)**:
  - changing multisig members/threshold/timelock
  - adding/removing/updating spending limits (routes, delegates, mints)
  - executing arbitrary program calls from a vault PDA (e.g., protocol instructions)
  These actions are intended to be subject to the Squads multisig policy, including the **timelock**.

- **Fast path (pre-authorized transfers)**:
  - `spendingLimitUse` transfers, executed by a delegate key listed in the spending limit’s `members[]`
  Once the spending limits exist, the delegate can execute transfers immediately (no multi-sig proposal flow).

In the “pledged revenue” design, we leverage this by:

- configuring V0/V1/V3 spending limits so that `members == [sweeper_hotkey_pubkey]`
- verifying that the sweeper hotkey is **not** a multisig member (and not `borrower_authority`)

Result:
- borrower governance members cannot quickly drain pledged-source vaults using those spending limits
- any attempt to *change* those limits should be slow and visible (timelocked) and is monitored as “weakening”

Note: `borrower-verifier` currently checks `threshold`, `time_lock_sec`, and membership, but does **not** currently assert anything about Squads `config_authority`. Treat `config_authority` as an explicit risk surface to be pinned by policy if you need stronger guarantees.

---

## 3) What invariants do we require? (Borrower verifier P1–P9)

These are the *implemented* checks in `borrower-verifier` (not aspirational). They are intended to make the vault model “real” without needing onchain fee-router primitives.

### P1: Pump routing evidence exists

Inputs:
- `pump_program_ids[]` (allowlist of upstream program IDs)
- `evidence_signatures[]` (finalized signatures)

Pass condition (high level):
- At least one finalized signature shows:
  - `v0_collector` is present and **writable**
  - the borrower’s Squads address is present
  - the borrower authority pubkey is present
  - Squads v4 program is invoked
  - a Pump program ID is invoked (or, in devnet harness mode, merely present in message)

Intent:
- Prove there is onchain evidence of the upstream “revenue lane” interacting with the V0 collector under Squads execution.

Notes:
- The devnet harness intentionally supports a “presence” mode because the ≥7d timelock makes execution fail until it elapses.

### P2: V0/V1/V2/V3 token accounts are USDC and owned by the expected Squads vault PDAs

For each of `v0`, `v1`, `v2` (and `v3` if present):
- token account mint == `assetMint`
- token account owner == `getVaultPda(borrowerSquads, vault_index)`
- token account has **no delegate**
- delegated amount == 0

And:
- `borrower_authority` must equal `getVaultPda(borrowerSquads, 2)` (V2 vault authority).

### P3: Squads timelock >= 7 days

- `time_lock_sec >= 604800` (7d)

### P4: Squads threshold and membership are non-trivial

- `threshold >= 2`
- `members.len >= 2`

### P5: Sweeper hotkey has no governance/config role

- Sweeper pubkey is **not** a multisig member
- Sweeper pubkey != `borrower_authority`

### P6: Spending limits implement the allowlisted routes (deny-all-by-omission)

High level:
- Spending limits on pledged-source vaults (indices 0/1/3) must:
  - only be for the `assetMint`
  - have destinations that match the **exact allowlist**
  - include required “unlimited” caps for required routes
  - **not** include the residual route V1 -> V2 when residuals are disabled

Allowed destinations (v1 default):
- vault_index=0 (V0): destinations == { V1 vault authority }
- vault_index=1 (V1): destinations == { FacilityVaultAuthority } (+ {V3 vault authority} if DSRA enabled)
- vault_index=3 (V3): destinations == { FacilityVaultAuthority } (only if DSRA enabled)

Required caps (v1 default):
- For each required route, there must be both:
  - a `OneTime` cap with amount = `u64::MAX`, and
  - a `Day` cap with amount = `u64::MAX`

### P7: Spending limit delegates are “sweeper-only”

- For each relevant spending limit, `members == [sweeper_hotkey_pubkey]`.

### P8: FacilityState matches onboarding keys + v1 defaults (IDL decode)

Requires protocol wiring (pool pubkey, facility pubkey) and vendored IDLs.

Checks (subset):
- facility.pool matches pool_state pubkey
- facility.asset_mint matches `assetMint`
- facility.borrower_squads matches onboarding `borrower_squads`
- facility.borrower_authority matches onboarding `borrower_authority` (V2 vault authority)
- facility.v2_ops_vault matches onboarding `v2_ops_vault` (V2 USDC ATA)
- v1 defaults:
  - `pledge_share_bps_min == 10000` (100%)
  - `residual_cap_usdc_per_day == 0`

### P9: Protocol vault ownership checks (PDA derivation + token account snapshots)

Given program IDs + pubkeys, derive:
- `FacilityVaultAuthority(facility_state)` (creditline PDA)
- `funding_vault` / `repayment_vault` token accounts (creditline PDAs)
- `PoolVaultAuthority(pool_state)` (pool PDA)

Then validate the observed token accounts:
- correct mint
- owned by the expected authority PDA

---

## 4) “Weakening” monitoring (risk engine)

Even if onboarding passes at time T0, the borrower can later weaken config.

`risk-engine` flags “weakening changes” by comparing:
- a baseline Squads snapshot (captured at onboarding / activation), vs
- the current snapshot.

Weakening signals include:

- timelock decreased
- threshold decreased
- new member added
- existing member permissions broadened (bitmask becomes a superset)
- residuals enabled (residual cap > 0 is treated as weakening in v1)
- spending limits:
  - pledged-source limits for non-asset mints
  - additional delegates besides the sweeper
  - destinations outside the allowlist
  - residual destination V1 -> V2 while residual cap is 0

Operationally, “weakening” is meant to trigger monitoring escalation and (often) a protocol-side risk action (e.g., `freeze`).

---

## 5) How this interacts with “Pump infra” + authority transfers

There are multiple, different “authority surfaces” in the product. Don’t conflate them:

### 5.1 SPL mint authority / freeze authority transfer (onboarding wizard)

In the `attn-credit` onboarding wizard, for *non-Pump* SPL mints where the connected wallet is the **current mint authority**:

- the borrower can transfer:
  - **mint authority**, and (when present)
  - **freeze authority**
  to the **BorrowerSquads multisig pubkey**.

Intent:
- prevent single-signer minting/freezing after onboarding
- concentrate “token admin” powers behind the same timelocked multisig that governs the revenue vaults

This is separate from the revenue vault indices: it’s about *token admin* risk, not USDC routing.

### 5.2 Pump launches (mainnet): creator rewards are SOL, and fee sharing changes what “creator” means

Pump creator rewards are **SOL** and accrue to Pump program vaults, then can be collected/distributed.

There are two relevant “modes”:

**Legacy (no fee sharing)**:
- the Pump bonding curve `creator` is a regular pubkey
- `collect_creator_fee` ultimately pays SOL to that `creator`
- if `creator == SquadsVaultPDA`, SOL lands directly inside the Squads vault (good for “revenue vault” routing)

**Fee sharing enabled**:
- the Pump bonding curve `creator` becomes the Pump Fees `SharingConfig(mint)` PDA
- the actual recipients and split are `SharingConfig.shareholders[]`
- “transfer coin ownership” = transfer `SharingConfig.admin` (who can change recipients)
- “remove creator share permissions” = set `SharingConfig.admin_revoked = true` (permanent)

Practical v1 implication:
- if fee sharing is enabled, “`creator == vault`” is no longer the right invariant.
- the enforceable invariant becomes: `SharingConfig` exists + active, pledged Squads vault(s) are in `shareholders[]` for the agreed share (often 100%), and the config is locked (or admin is behind a timelock + continuously monitored).

### 5.3 Converting SOL revenue into USDC (offchain step)

Because protocol repayment is in USDC, Pump SOL fees require an offchain conversion step:

1) Collect SOL into a Squads vault PDA (typically V0 as system account balance)
2) Swap SOL -> USDC via an approved swap path (offchain executor)
3) Deposit USDC into `V0_ATA` (or directly into `V1_ATA`, depending on policy)
4) Continue the USDC waterfall V0 -> V1 -> protocol repayment

`attn-protocol` does not enforce any of this; it only observes what lands in its repayment vault.
