# Pump.fun (Feb 2026): Fee Sharing + "Transfer Coin Ownership" (Internal)

Status: internal notes. This is meant to settle the “can we move future creator rewards?” question with onchain interfaces.

As of: 2026-02-14.

Source of truth used here:
- Official Pump public IDLs: `pump-fun/pump-public-docs`
  - `idl/pump.json`
  - `idl/pump_amm.json`
  - `idl/pump_fees.json`

Program IDs (from the IDLs):
- Pump program: `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`
- Pump AMM program: `pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`
- Pump Fees program: `pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ`

---

## 1) Answer: can you move future creator rewards?

Yes.

Pump now has an onchain **fee sharing configuration** per coin mint, plus explicit instructions to:
- **update fee allocation** (“share creator rewards with other accounts”), and
- **transfer the admin/owner** of that configuration (“transfer coin ownership”),
and there is an onchain “reset/revoke” path as well.

Practically:
- “allocation” = `SharingConfig.shareholders[]` (addresses + share bps)
- “ownership” = `SharingConfig.admin` (who can change allocation), plus a permanent lock bit (`admin_revoked`)

---

## 2) The onchain object model (what exists on Solana)

### 2.1 `SharingConfig` account (Pump Fees program)

There is a per-mint PDA:
- `SharingConfig(mint) = PDA(["sharing-config", mint], program = pump_fees)`

IDL fields (abridged):
- `mint: Pubkey`
- `admin: Pubkey` (the “coin owner” for reward configuration)
- `admin_revoked: bool` (permanent lock; UI calls this “remove creator share permissions”)
- `shareholders: Vec<{ address: Pubkey, share_bps: u16 }>`
- `status: enum { Paused, Active }`

This matches the UI vocabulary in your screenshots:
- “Share creator rewards with other accounts” = edit `shareholders`
- “Transfer coin ownership” = change `admin`
- “Remove creator share permissions” = make `admin_revoked = true` (cannot be undone)

### 2.2 Creator fee vault + distribution (Pump program)

Pump exposes:
- `collect_creator_fee` (moves SOL from a creator-vault PDA to the `creator` pubkey)
- `distribute_creator_fees` (reads `SharingConfig(mint)` and distributes fees to shareholders)

Both are onchain instructions in the Pump IDL.

---

## 3) The instructions that implement the UX

### 3.1 Create sharing config (one-time)

Pump Fees: `create_fee_sharing_config`

Key facts from the IDL:
- creates `SharingConfig(mint)` PDA (seeded by mint)
- touches the Pump bonding curve and, optionally, the Pump AMM pool (accounts are passed as writable)

Interpretation:
- this is the “enable fee sharing for this coin” step

### 3.2 Update allocation (add recipients / change percentages)

Pump Fees: `update_fee_shares(shareholders: Vec<Shareholder>)`

Key facts from the IDL:
- requires `authority` signer
- writes `SharingConfig(mint)`
- references:
  - Pump bonding curve
  - a Pump creator-vault PDA
  - SOL + token plumbing accounts (wSOL mint, token program, associated token program)

Interpretation:
- this is the onchain primitive behind “Share creator rewards with other accounts”
- it is coin-specific (mint-scoped), not global

### 3.3 Transfer “coin ownership” (who can edit allocation later)

Pump Fees: `transfer_fee_sharing_authority`

Key facts from the IDL:
- requires `authority` signer
- writes `SharingConfig(mint)`
- takes a `new_admin` pubkey

Interpretation:
- this maps directly to the UI string “Transfer coin ownership”
- it transfers control over future updates to the sharing config

### 3.4 Remove share permissions / redeem / reset

Pump Fees: `reset_fee_sharing_config`

IDL docs note:
- “make sure to distribute all the fees before calling this”

Interpretation:
- this is the “reset / remove / redeem” path
- exact semantics (what it resets to, how `admin_revoked` is handled) should be treated as “defined by program code”, but the onchain entrypoint definitely exists and is coin-scoped.

---

## 4) Implications for an “attn-style” revenue capture protocol

If your protocol premise is “we must be able to re-route future fees”, Pump now gives you an onchain mechanism:

1. Ensure the coin has a `SharingConfig(mint)` and fee sharing is active.
2. Set `shareholders` so that some recipient address you control receives 100% (or an agreed split).
   - If you want self-custody + enforceability, the recipient should be a **programmatic vault authority**:
     - e.g., a Squads vault PDA (V0) so later flows are controlled by spending limits / timelocks.
3. (Optional) transfer `SharingConfig.admin` to a timelocked multisig (or revoke admin) to make the split hard to weaken.

Important:
- creator rewards are **SOL-denominated**; any USDC repayment model still needs a SOL->USDC step.

---

## 5) What I have NOT “proven” yet (if you need 100% behavioral certainty)

The IDLs prove the onchain interfaces exist. What they don’t fully prove without executing or reading program code:
- max number of shareholders
- whether shareholder shares must sum to exactly 10_000 bps
- whether `transfer_fee_sharing_authority` also changes anything besides `SharingConfig.admin`
- what exactly `reset_fee_sharing_config` does (and whether it permanently locks config)

If you want, the next hard-confirm step is:
- pick a known mint,
- grab the actual tx signature produced by Pump’s UI for “transfer coin ownership” and “add recipient”,
- decode the invoked instruction discriminators against these IDLs.

That gives you ground truth for the deployed programs (not just published IDLs).

