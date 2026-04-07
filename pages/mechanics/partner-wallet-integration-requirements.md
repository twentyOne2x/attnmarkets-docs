# Partner-Managed Wallet Integration Requirements

This page is for a partner that wants to use attn Credit without moving creator fees or service revenues into `Privy`, `Swig`, or `Squads`.

The short version is:

- attn can work with a partner-managed wallet and payout stack,
- the first acceptable shape is a **private-treasury-first** lane,
- but attn still needs a concrete control and readback contract before the lane can be treated as more than compatibility-only.

This is not the same thing as the current borrower-first Pump path, where fee admin moves into a Swig-controlled lifecycle during `ACTIVE`.
ClawPump is one example of this broader partner-managed category.

## 1. What attn is not asking the partner to do

attn is **not** asking the partner to:

- migrate creator fees into a borrower-owned Swig wallet,
- pretend the current partner stack already has the same reversible control lifecycle as the Swig borrower lane,
- or open a public/self-serve borrower lane immediately.

The practical near-term shape is narrower:

- the partner keeps its wallet infrastructure,
- attn can fund the first lane from private treasury,
- and both sides treat the lane as operator-driven until the control and repayment invariants are actually proven.

## 2. Current posture

The correct current product claim for a partner-managed wallet lane is:

- **partner-managed wallet path**
- **private-treasury first**
- **internal / operator-driven**
- **not public-live**
- **not automatically Swig-equivalent**

That means the lane can be worth qualifying now, but it should not be described as a public borrower flow or as full control parity with the borrower-first Pump lane.

## 3. What attn needs to be true

For a partner-managed wallet stack to qualify for a private-treasury borrower-fee lane, attn needs all of the following:

### 3.1 Authoritative launch attribution

attn needs to know:

- which mint or asset flow was launched through the partner,
- which creator and launch authority it belongs to,
- and which cluster and launch time define the facility.

If launch attribution is fuzzy, the lane should stay compatibility-only.

### 3.2 Authoritative revenue scope

attn needs to know exactly which revenues count toward the lane:

- creator fees,
- service fees,
- platform fees if relevant,
- and which of those are actually repayment-relevant.

If the revenue scope is ambiguous, underwriting can be informative but not credit-ready.

### 3.3 Authoritative wallet topology

attn needs a durable view of the current control path, including:

- dev wallet,
- treasury wallet,
- payout recipients,
- payout-edit authority,
- and any additional sponsor or rewards wallets that materially affect the lane.

This is the partner-managed equivalent of the Swig borrower lane making the control path explicit.

### 3.4 Debt-open repayment destination invariant

This is the most important requirement.

While debt is open, the repayment-relevant share of revenue must keep routing to the agreed repayment target or waterfall in a way that is economically enforced.

That means:

- the active target is known,
- the active split or waterfall is known,
- and it cannot silently drift away while debt is open.

If this is only a human promise, the lane is not credit-ready.

### 3.5 Payout edit authority separation

attn needs to know who can change payout policy during the life of the facility and how constrained that actor is.

Minimum acceptable posture for a private-treasury pilot:

- the payout-edit actor is explicitly known,
- the actor is not treated as an unbounded black box,
- and policy changes produce retained audit receipts.

### 3.6 Debt-open change control

The borrower or partner should not be able to unilaterally remove the repayment target during an active debt window without attn being able to detect it and react.

That does **not** mean attn must own the partner's wallet stack.
It means the active debt posture must be policy-bounded and observable.

### 3.7 Readback and audit receipts

attn needs enough readback to verify:

- current payout mode,
- current recipients,
- current edit authority,
- recent revenue events,
- and recent control changes.

Without readback, the lane stays manual or compatibility-only.

### 3.8 Release and offboard semantics

There must be a clean way to describe what happens after debt closes:

- what gets released,
- who regains control,
- and what receipt proves that the repayment mode has been relaxed or removed.

If release/offboard is impossible, that is a real product limitation and should be stated plainly.

### 3.9 Treasury-funding receipts

The first lane should remain clearly labeled as **private-treasury funded**.

That means funding receipts should retain:

- request id,
- operator actor,
- amount and asset,
- and transaction references.

It should not be described as outside-lender or public-pool proof.

### 3.10 Incident freeze and quarantine

The stack should support a bounded incident response posture:

- freeze or pause sensitive payout changes,
- quarantine compromised operator access,
- and retain receipts for the incident state and recovery actions.

## 4. What claims are justified at each stage

### Compatibility-only

Allowed:

- data compatibility,
- bounded underwriting visibility,
- early partner diligence.

Not allowed:

- credit-ready claim,
- Swig-equivalent control claim.

### Underwriting-compatible

Allowed:

- attn can reason about the revenues and the platform topology,
- the lane may be suitable for manual or operator-reviewed underwriting.

Not allowed:

- claim that debt-open repayment is already enforceable.

### Private-treasury pilot eligible

Allowed:

- operator-driven first lane,
- attn treasury-backed pilot,
- retained funding and policy receipts.

Required:

- debt-open repayment destination is verified,
- payout change control is bounded,
- readback is good enough for monitoring and audit.

### Swig-equivalent partner control

This is the strongest claim.
It should only be used if the partner-managed stack proves the same safety outcomes that the Swig borrower lane is designed to achieve:

- enforced debt-open routing,
- bounded change control,
- clear readback,
- and clean release/offboard behavior.

Even then, it is still not the same thing as public-live or broad lender-ready proof.

## 5. What a partner should expect from attn

If both sides want to qualify this lane, attn should be able to review:

- the payout topology,
- the repayment target or waterfall,
- the actor that can edit payout state,
- the readback interface or receipts,
- and the release/offboard contract after debt close.

In practice, that means the fastest next step is not a generic integration pitch.
It is one concrete pilot shape with one retained evidence chain.

## 6. Partner-specific page

If you want the concrete creator-fee-platform handoff guide, use:

- [Partner-managed creator-fee integration guide](../users/partner-managed-creator-fee-integration.md)

## 7. Related pages

- [Revenue accounts and signing model](./revenue-accounts-and-signing-model.md)
- [How attn Credit works](./how-it-works-nontechnical.md)
- [For Launchpads & Incubators](../users/for-launchpads-and-incubators.md)
