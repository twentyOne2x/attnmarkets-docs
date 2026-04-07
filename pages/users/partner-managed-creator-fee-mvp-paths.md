# Partner-Managed Creator-Fee MVP Paths

This page is the lighter companion to the full [Partner-Managed Creator-Fee Integration Guide](./partner-managed-creator-fee-integration.md).

Use this page when the partner is not yet ready to satisfy the full standards document, but both sides still want to understand what acceptable intermediary steps could be shipped honestly.

The goal here is not to lower standards by hiding risk.
The goal is to show what can be proven in stages.

## 1. How to use this page

Start here if you need a faster answer to:

- what can be piloted first,
- what can be proven before full payout-policy parity exists,
- what attn can honestly claim at each step,
- and what evidence is minimally required to move up one level.

If the partner is already ready to answer the full policy and evidence questionnaire, go straight to the stricter guide:

- [Partner-Managed Creator-Fee Integration Guide](./partner-managed-creator-fee-integration.md)

## 2. What stays true across every MVP

Even the lightest acceptable MVP still needs a few things to be true.

### 2.1 Named revenue scope

The partner must be able to say:

- what revenues count,
- which share is repayment-relevant,
- and provide sample records or exports for that scope.

### 2.2 Named counterparties and operators

attn must know:

- which entity is operating the platform,
- who can answer for payout behavior,
- and who can approve, pause, or unwind the pilot.

### 2.3 Honest claim boundaries

No MVP stage on this page should be described as:

- public-live borrower readiness,
- public lender readiness,
- Swig-equivalent control parity,
- or fully automated debt-open enforcement

unless the partner has actually reached the stricter full-standard stage.

### 2.4 Manual stop/go rights

Every MVP stage needs a manual stop condition:

- if payout behavior drifts,
- if evidence stops arriving,
- if the platform changes routing without notice,
- or if incident posture becomes unclear,

the lane must be able to pause, refuse new funding, or downgrade claims.

## 3. The staged ladder

Think of these as acceptable intermediary proofs, not as marketing tiers.

### Stage 0: Compatibility-only

This is the lightest stage.

At this stage, attn can:

- understand the partner's revenue model,
- inspect example flows,
- and decide whether the lane is interesting enough to continue.

What must be true:

- one named revenue scope,
- one named platform or entity,
- one visible payout topology explanation,
- sample records proving the revenue is real.

What attn can honestly claim:

- compatibility and underwriting interest,
- not credit readiness.

What is still false:

- no fundable lane,
- no debt-open routing claim,
- no platform-control or borrower-control parity claim.

Minimum evidence:

- sample payout exports,
- named wallets or payout routers,
- one explanation of who controls what today.

### Stage 1: Platform-as-counterparty MVP

This is the first meaningful pilot stage if the platform is willing to stand behind the lane before stronger payout policy controls are in place.

At this stage, attn is effectively evaluating the platform as the primary counterparty rather than treating the end creator or end borrower as fully policy-enforced onchain collateral.

What must be true:

- the platform entity is named and accepts counterparty responsibility,
- the revenue scope is explicit,
- attn can review recent revenue behavior,
- reconciliation can happen on a defined cadence,
- a manual pause or unwind process exists.

What attn can honestly claim:

- bounded platform-counterparty pilot,
- early proof that the business flow is real,
- not full payout-policy enforcement.

What is still false:

- no strong borrower-level control claim,
- no debt-open payout lock claim,
- no lender-ready external proof.

Minimum evidence:

- recent revenue records,
- manual settlement or reconciliation process,
- named operator owners,
- documented pause / dispute / unwind path.

This is often the fastest acceptable path when both sides want to prove that financing demand exists before deeper control work is done.

### Stage 2: Observable payout-path MVP

This stage is stronger than pure platform-counterparty trust.

At this stage, the partner can expose enough readback that attn can see where the repayment-relevant revenue is supposed to go and can detect drift, even if the enforcement is still partly manual or operator-mediated.

What must be true:

- the debt-open destination or waterfall is explicitly named,
- current recipients can be read back,
- payout edits are attributable,
- attn can detect drift inside a defined window.

What attn can honestly claim:

- repayment-relevant payout path is observable,
- the lane is monitorable,
- and deviations should be detectable.

What is still false:

- no strong claim that payout policy is fully locked or fully automated,
- no Swig-equivalent control parity claim,
- no public borrower readiness.

Minimum evidence:

- current payout configuration,
- change receipts or logs,
- readback method or export,
- drift-detection rule,
- manual escalation path.

This is a good stage when the partner can expose control truth but cannot yet guarantee strict policy-bounded routing on every path.

### Stage 3: Policy-bounded first pilot

This is the strongest acceptable intermediary stage before the full standard.

At this stage, the partner still keeps its own wallet stack, but attn can point to:

- an explicit debt-open payout posture,
- bounded payout-change authority,
- durable readback,
- and incident / freeze behavior.

What must be true:

- debt-open destination or waterfall is explicit,
- payout-edit authority is named,
- changes leave attributable receipts,
- attn can read back current posture,
- incident freeze and recovery steps exist,
- one bounded first pilot can be monitored end to end.

What attn can honestly claim:

- one bounded first real pilot is supportable,
- repayment path is legible and operationally bounded,
- policy and evidence are strong enough for a narrow controlled lane.

What is still false:

- no broad public borrower product,
- no public lender / LP readiness,
- no automatic equivalence to the borrower-first Swig path unless the full standard is reached.

Minimum evidence:

- payout topology,
- debt-open destination rule,
- edit-authority map,
- change receipts,
- readback or dashboard exports,
- incident / freeze posture,
- one bounded pilot pack.

### Stage 4: Full-standard partner-managed lane

This is the target described in the stricter guide.

Use this only when the partner can satisfy the full requirement and evidence set in:

- [Partner-Managed Creator-Fee Integration Guide](./partner-managed-creator-fee-integration.md)

At this stage, attn should be able to reason about the partner-managed lane as producing the same practical control outcomes that matter in the stricter borrower-first baseline:

- explicit debt-open payout posture,
- bounded change control,
- durable readback,
- incident response,
- release and offboard clarity.

## 4. Fastest acceptable paths in practice

If the partner wants the fastest honest route, these are the usual choices:

### Path A: prove demand first

Use:

- Stage 1

Choose this when:

- the platform is willing to be the counterparty,
- the revenue is real,
- but payout-policy readback is still immature.

### Path B: prove payout observability next

Use:

- Stage 2

Choose this when:

- the platform can already expose current payout state and change receipts,
- but enforcement is not yet strong enough to claim full policy parity.

### Path C: prove one real bounded pilot

Use:

- Stage 3

Choose this when:

- the partner can show real debt-open payout posture,
- readback,
- incident behavior,
- and bounded operational control for one first lane.

## 5. What each stage proves

| Stage | What it proves | What it does not prove |
| --- | --- | --- |
| `Stage 0` | the revenue model is real enough to evaluate | no financeability, no payout control, no pilot readiness |
| `Stage 1` | the platform can support a manual or operator-run financing pilot as the primary counterparty | no borrower-level control parity, no debt-open payout lock |
| `Stage 2` | repayment-relevant routing is observable and drift can be detected | no strong claim that payout policy is fully bounded |
| `Stage 3` | one bounded first pilot can be run with real control, readback, and incident posture | no public-live or broad lender-ready claim |
| `Stage 4` | the partner-managed lane meets the full stricter requirements | still not the same thing as permissionless or open-lender readiness by default |

## 6. Minimum evidence checklist by stage

### Stage 1

- named platform counterparty
- named revenue scope
- recent revenue records
- manual reconciliation path
- pause / unwind owner

### Stage 2

- current payout topology
- current recipients
- who can edit payout routing
- change receipts or logs
- drift-detection timing

### Stage 3

- debt-open destination or waterfall
- edit-authority map
- readback method
- incident freeze / recovery posture
- one bounded pilot pack

## 7. When not to move forward

Do not move past discovery if:

- the revenue scope cannot be named,
- payout recipients cannot be described,
- the partner cannot identify who can change routing,
- no readback or receipt path exists,
- or there is no clear operator owner for pause and incident handling.

At that point the right answer is not “ship anyway.”
The right answer is “stay at compatibility-only.”

## 8. How this page relates to the stricter guide

Use this page first if the conversation is:

- “what can we prove earliest?”
- “what can be piloted before full standards?”
- “what is the least constrained acceptable path?”

Use the stricter guide when the conversation becomes:

- “what exactly must be true for the full lane?”
- “what policies and evidence are required?”
- “what would stronger control parity actually mean?”

The two pages are intentionally different:

- this page is the staged MVP ladder,
- the other page is the full target state.
