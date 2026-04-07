# Partner-Managed Creator-Fee Integration Guide

This page is the single document a creator-fee platform should use when evaluating an attn integration while keeping its own wallet and payout infrastructure.

It is intentionally written as a requirements and response document, not a product explainer.

If you are the partner team, the goal is simple:

- read this page once,
- read sections `1` through `7` first,
- answer the response sections `9`, `10`, and `13` at the level of detail you have today,
- attach the evidence listed in section `14`,
- and use sections `6` through `18` to scope the earliest honest pilot and the strongest honest claim level.

## 1. What this page is for

This page answers one question:

**What must be true for attn to support a creator-fee lane when the partner keeps its own wallet and payout stack?**

The page is not asking you to migrate to Swig, Privy, or Squads.
It is asking whether your existing payout and wallet stack can make the repayment path:

- clear,
- bounded,
- auditable,
- and monitorable enough for a real lane.

## 2. What the partner needs to do

The partner should use this page as a direct response template.

The initial response should define:

1. what revenues count,
2. where those revenues flow today,
3. what changes while debt is open,
4. who can edit that routing,
5. what attn can read back,
6. what happens if the routing degrades,
7. and what happens after the lane closes.

If those answers are strong, the lane may qualify for a bounded first pilot.
If they are incomplete or weak, the lane remains at a lower claim level.

## 3. Integration target

The current target is narrow.

attn is evaluating whether it can support:

- a partner-managed wallet stack,
- creator-fee or service-fee revenues as the repayment-relevant source,
- a bounded first lane,
- and an operator-visible evidence chain.

This page is not about:

- a public self-serve borrower product,
- public lender readiness,
- or automatic parity with attn's borrower-first managed-revenue baseline.

## 4. The baseline attn is comparing against

The strongest borrower-side control baseline in attn today is a borrower-first managed-revenue path.

At a high level, that baseline gives attn:

- a pledged revenue path during the debt window,
- bounded change control while debt is open,
- readback and auditability,
- and a defined release or offboard path after close.

In attn today, that baseline is implemented through the borrower-first Pump/Swig path.

The partner-managed lane does not need to look the same at the account or wallet level.
It does need to produce the same practical outcomes where policy matters.

That means attn is not looking for "same implementation."
It is looking for "same control result."

## 5. Requirements at a glance

Before the partner answers anything in detail, the integration standard should be clear.

For a partner-managed creator-fee lane to be supportable, attn needs these outcomes to be true:

### 5.1 Revenue scope must be explicit

attn must be able to tell:

- which revenues are in scope,
- which subset is repayment-relevant,
- and which visible revenues are out of scope.

If the revenue scope is ambiguous, the lane is not yet credit-ready.

### 5.2 Wallet topology must be legible

attn must be able to tell:

- where revenues land first,
- which wallets, routers, or policies affect the path,
- and which actors control those surfaces.

If the payout topology cannot be explained plainly, the lane cannot be relied on.

### 5.3 Debt-open payout behavior must be explicit

attn must be able to tell:

- what changes while debt is open,
- where the repayment-relevant share goes,
- and whether the path is a single destination, a split, a waterfall, or an operating process.

The important thing is not matching attn's internal implementation.
The important thing is making the debt-open repayment behavior explicit and monitorable.

### 5.4 Change authority must be bounded

attn must be able to tell:

- who can change payout routing or payout policy,
- whether one person can do it or whether approvals are required,
- and what log, receipt, or event exists when that happens.

If payout authority exists but is not attributable, that is still a control gap.

### 5.5 Readback must exist

attn must be able to inspect enough live or near-live state to answer:

- what the current payout path is,
- what the current recipients are,
- who can edit them,
- and whether anything changed recently.

Without readback, the lane can still be discussed, but only at a lower claim level.

### 5.6 Degrade, release, and offboard behavior must be defined

attn must be able to tell:

- what happens if payout routing degrades or drifts,
- what the incident posture is while a lane is open,
- and what release or offboard looks like after close.

If the lane has no defined degraded-state or release behavior, that should be treated as a real limitation rather than left undefined.

## 6. Acceptable staged paths before the full standard

The full requirements above describe the target state.

But not every partner will be ready for that immediately.
So this page also defines the acceptable intermediary steps below the full standard.

These are not marketing tiers.
They are claim-bounded proof stages.

### 6.1 What stays true across every stage

Even the lightest acceptable stage still needs:

- one named revenue scope,
- one named operating entity,
- one visible payout topology explanation,
- one clear operator owner,
- and one manual stop or downgrade path if payout behavior drifts.

No stage below the full standard should be described as:

- public-live borrower readiness,
- public lender readiness,
- equivalence to attn's borrower-first managed-revenue baseline,
- or fully automated debt-open enforcement.

### 6.2 Stage 0: Compatibility-only

This is the lightest stage.

At this stage, attn can:

- understand the partner revenue model,
- inspect example flows,
- and decide whether the lane is worth deeper work.

What must be true:

- the revenue scope is named,
- the platform or entity is named,
- the current payout topology can be explained,
- sample records show the revenue is real.

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

### 6.3 Stage 1: Platform-as-counterparty MVP

This is the first meaningful pilot stage if the platform is willing to stand behind the lane before stronger payout controls are in place.

At this stage, attn is evaluating the platform as the primary counterparty rather than treating the end creator or borrower as fully policy-enforced onchain collateral.
The platform is the operating counterparty for the pilot, and the lane should be described that way rather than as already having stronger payout-policy enforcement than the facts support.

What must be true:

- the platform entity is named and accepts counterparty responsibility,
- the revenue scope is explicit,
- attn can review recent revenue behavior,
- reconciliation happens on a defined cadence,
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
- documented pause, dispute, or unwind path.

### 6.4 Stage 2: Observable payout-path MVP

This stage is stronger than pure platform-counterparty trust.

At this stage, the partner exposes enough readback that attn can see where repayment-relevant revenue is supposed to go and can detect drift, even if enforcement is still partly manual or operator-mediated.

What must be true:

- the debt-open destination or waterfall is explicitly named,
- current recipients can be read back,
- payout edits are attributable,
- attn can detect drift inside a defined window.

What attn can honestly claim:

- the repayment-relevant payout path is observable,
- the lane is monitorable,
- and deviations should be detectable.

What is still false:

- no strong claim that payout policy is fully locked or fully automated,
- no equivalence claim to attn's borrower-first managed-revenue baseline,
- no public borrower readiness.

Minimum evidence:

- current payout configuration,
- change receipts or logs,
- readback method or export,
- drift-detection rule,
- manual escalation path.

### 6.5 Stage 3: Policy-bounded first pilot

This is the strongest acceptable intermediary stage before the full standard.

At this stage, the partner still keeps its own wallet stack, but attn can point to:

- an explicit debt-open payout posture,
- bounded payout-change authority,
- durable readback,
- and incident or freeze behavior.

What must be true:

- the debt-open destination or waterfall is explicit,
- payout-edit authority is named,
- changes leave attributable receipts,
- attn can read back current posture,
- incident freeze and recovery steps exist,
- one bounded first pilot can be monitored end to end.

What attn can honestly claim:

- one bounded first real pilot is supportable,
- the repayment path is legible and operationally bounded,
- policy and evidence are strong enough for a narrow controlled lane.

What is still false:

- no broad public borrower product,
- no public lender or LP readiness,
- no automatic equivalence to attn's borrower-first managed-revenue baseline unless the full standard is reached.

Minimum evidence:

- payout topology,
- debt-open destination rule,
- edit-authority map,
- change receipts,
- readback or dashboard exports,
- incident or freeze posture,
- one bounded pilot pack.

### 6.6 Stage 4: Full-standard partner-managed lane

This is the target state for the rest of this document.

At this stage, attn should be able to reason about the partner-managed lane as producing the same practical control outcomes that matter in the stricter borrower-first baseline:

- explicit debt-open payout posture,
- bounded change control,
- durable readback,
- incident response,
- and release or offboard clarity.

### 6.7 Fastest acceptable paths in practice

If the partner wants the fastest honest route, the usual choices are:

- `Stage 1` when the main goal is proving real financing demand with the platform standing behind the lane,
- `Stage 2` when payout observability already exists but stronger policy bounding is not yet ready,
- `Stage 3` when one real bounded pilot is within reach.

### 6.8 What each stage proves

| Stage | What it proves | What it does not prove |
| --- | --- | --- |
| `Stage 0` | the revenue model is real enough to evaluate | no financeability, no payout control, no pilot readiness |
| `Stage 1` | the platform can support a manual or operator-run financing pilot as the primary counterparty | no borrower-level control parity, no debt-open payout lock |
| `Stage 2` | repayment-relevant routing is observable and drift can be detected | no strong claim that payout policy is fully bounded |
| `Stage 3` | one bounded first pilot can run with real control, readback, and incident posture | no public-live or broad lender-ready claim |
| `Stage 4` | the partner-managed lane meets the full stricter requirements | still not the same thing as permissionless or open-lender readiness by default |

### 6.9 When not to move forward

Do not move past discovery if:

- the revenue scope cannot be named,
- payout recipients cannot be described,
- the partner cannot identify who can change routing,
- no readback or receipt path exists,
- or there is no clear operator owner for pause and incident handling.

At that point, the lane should remain at `compatibility-only`.

## 7. How to use this page

This page is not asking the partner to produce a perfect diligence packet on day one.

The right way to use it is:

1. read sections `1` through `6` first so the requirements and the acceptable stage ladder are clear,
2. review section `8` so the attn evaluation lens is clear,
3. answer sections `9` and `10` in plain English at the level of detail you already have,
4. if the lane still looks promising, answer section `13` for the first bounded pilot,
5. then attach whatever evidence from section `14` you can already provide.

An initial response can be concise.
It can include:

- one short explanation of the revenue path,
- one payout topology diagram or export,
- one explanation of who can change payout routing,
- and one explanation of what happens when debt is open versus closed.

That is enough to determine whether the lane is:

- only compatibility-level,
- usable for manual underwriting,
- or strong enough for a bounded first pilot.

The response sections are intended to determine quickly whether the lane is structurally viable before it is treated as meeting the full standard.

## 8. How attn evaluates the response

attn uses the partner response for five things:

1. confirm whether the lane is identifiable and bounded,
2. classify the lane against the stage model in this document,
3. identify which requirements are already evidenced versus still partial or missing,
4. decide whether a bounded first pilot is worth scoping,
5. and determine whether the lane should stop at compatibility, remain manual, or move toward a stronger claim level.

At a high level, attn is checking:

- whether the revenue scope is precise enough,
- whether the payout topology is legible enough,
- whether debt-open behavior is explicit enough,
- whether change authority and readback are strong enough,
- and whether incident and release behavior are defined enough.

If the response is strong, attn can map the lane to one of the acceptable stages and define the next evidence package or pilot shape.
If the response is incomplete, attn can ask for the specific missing evidence rather than continuing with vague integration language.
If the response shows unresolved ambiguity on core controls, attn should stop at a lower claim level instead of stretching the lane into a stronger posture than the facts support.

This section is intentionally high-level.
It explains how attn consumes the response without turning the public guide into a private underwriting or servicing manual.

## 9. Revenue-functioning response template

This is the first thing the partner should answer once the requirements above are understood.

### 9.1 What revenues count?

Please answer:

1. Which revenues are in scope for the lane?
   - creator fees
   - service fees
   - platform fees
   - other
2. Which revenues are repayment-relevant?
3. Which revenues are visible but not repayment-relevant?

What attn needs:

- one named revenue scope,
- a plain-language explanation,
- and sample evidence showing the scope is real.

Minimum pilot bar:

- repayment-relevant revenues are named,
- and the partner can show example records or exports for that scope.

### 9.2 Where do those revenues land first?

Please answer:

1. What wallet or router receives the revenues first?
2. Is that wallet:
   - creator-controlled,
   - partner-controlled,
   - shared,
   - or policy-routed?
3. Are there separate sponsor, treasury, or settlement wallets involved?

What attn needs:

- first landing point,
- current recipients,
- and the topology around that flow.

Minimum pilot bar:

- attn can see the first landing wallet or router,
- and the live recipients that matter for the lane.

### 9.3 What happens while debt is open?

Please answer:

1. What portion of the revenue path changes while debt is open?
2. Where does the repayment-relevant portion go?
3. Is it:
   - a single destination,
   - a waterfall,
   - a split,
   - or a manual operating process?
4. How is that kept true while the lane is active?

What attn needs:

- the debt-open destination or waterfall,
- and a concrete explanation of how it stays true.

Minimum pilot bar:

- the debt-open repayment path is explicit,
- and it cannot drift silently without attn being able to detect it.

### 9.4 What happens if that routing changes?

Please answer:

1. Who can change payout routing or payout policy?
2. Can one person do it, or is there a quorum, approval flow, or policy engine?
3. What receipt or log exists when that happens?
4. How quickly can attn detect the change?

What attn needs:

- known edit authority,
- bounded change surface,
- and retained change receipts.

Minimum pilot bar:

- payout-edit authority is named,
- change events are attributable,
- and the partner can show how attn would detect drift.

## 10. Policy response template

This section is the control contract.

### 10.1 Launch attribution policy

Please answer:

1. How does the platform determine which launch, mint, or creator belongs to which lane?
2. What is the source of truth for that mapping?
3. Can you provide:
   - launch identifier,
   - creator or entity identifier,
   - cluster,
   - and timestamp?

Minimum pilot bar:

- attribution is deterministic enough that attn can tell which revenue source belongs to which lane.

### 10.2 Revenue-scope policy

Please answer:

1. How is repayment-relevant revenue defined?
2. Is that scope contractual, configurable, or inferred?
3. Can the scope change over time?
4. If yes, who can change it and how is that change recorded?

Minimum pilot bar:

- the revenue scope is explicit and stable enough to underwrite conservatively.

### 10.3 Wallet-topology policy

Please answer:

1. What are the key wallets or payout routers involved?
2. Which of them can materially affect the repayment path?
3. Which actor controls each one?

Minimum pilot bar:

- attn can see the wallets and actors that matter to repayment integrity.

### 10.4 Debt-open destination policy

Please answer:

1. What is the required destination or waterfall while debt is open?
2. How is that destination enforced in practice?
3. What would count as a violation?

Minimum pilot bar:

- the debt-open destination is explicit,
- and a violation is detectable rather than arguable.

### 10.5 Change-control policy

Please answer:

1. Who can edit payout recipients, payout percentages, or payout logic?
2. What approvals are required?
3. What receipt exists after the change?

Minimum pilot bar:

- known actor,
- known process,
- retained receipts.

### 10.6 Readback policy

Please answer:

1. What can attn inspect directly?
2. What must be provided as exports or reports?
3. How current is the readback?

Minimum pilot bar:

- attn can inspect enough live or near-live state to detect drift.

### 10.7 Release and offboard policy

Please answer:

1. What changes after the debt closes?
2. Who regains control of what?
3. What receipt proves the release or offboard happened?

Minimum pilot bar:

- the release path is defined,
- and the post-close state is not ambiguous.

### 10.8 Incident policy

Please answer:

1. What happens if payout integrity is compromised?
2. What freeze, pause, or quarantine actions exist?
3. What receipts exist for incident and recovery actions?

Minimum pilot bar:

- there is a real degraded-state response,
- not only a normal-mode explanation.

## 11. Requirement status model

attn will generally classify each requirement as:

- `missing`
- `partial`
- `verified`

Interpretation:

- too many `missing` items means the lane stays `compatibility-only`,
- a mix of `partial` and `verified` items may still support manual underwriting review,
- a strong cluster of `verified` items is required for a bounded first pilot.

## 12. What attn can honestly claim at each stage

### Compatibility-only

This means:

- attn can understand the revenue surface,
- but cannot claim strong repayment-path control.

### Underwriting-compatible

This means:

- attn can reason about revenues and topology,
- but debt-open repayment control is still weaker than the baseline.

### Bounded pilot eligible

This means:

- the lane can run in a narrow pilot shape,
- the repayment path is explicit,
- change control is bounded,
- and readback is strong enough to monitor the lane honestly.

### Stronger partner-control claim

This should only happen if the partner can prove the same practical outcomes that the borrower-first baseline is trying to preserve:

- debt-open repayment destination stays true,
- payout edits are bounded and attributable,
- readback is real,
- and release or offboard behavior is clear.

## 13. Bounded first-pilot response template

Please answer these before claiming the first pilot is ready:

1. What exact lane is in scope?
2. What exact revenues count?
3. What exact wallets or routers matter?
4. What exact debt-open destination or waterfall applies?
5. Who can edit that state?
6. What exact readback or export surfaces will attn receive?
7. What exact incident response exists if payout integrity degrades?
8. What exact release or offboard path applies after close?
9. What remains manual or partially verified?

The first pilot should fail closed:

- if revenue scope is unclear, downgrade the claim,
- if topology is unclear, stop before stronger readiness language,
- if debt-open routing is not stable, do not call the lane bounded,
- if readback is missing, keep the lane manual and narrow,
- if incident posture is undefined, treat the lane as operationally weaker,
- if release or offboard is undefined, disclose that explicitly.

## 14. Evidence package the partner should send

The best response from the partner is one package that includes:

1. current payout topology,
2. current payout recipients,
3. current payout-edit authority,
4. current debt-open destination or waterfall design,
5. example revenue exports or receipts for the repayment-relevant scope,
6. payout-change receipts or logs,
7. available readback or export surfaces,
8. incident or freeze posture,
9. release or offboard description,
10. written note on what is still manual or weaker than the baseline.

If the partner wants a direct response template, this is sufficient:

1. What exact revenue sources count toward the lane?
2. What is the current payout topology?
3. Who can edit payout state today?
4. What is the debt-open repayment destination or waterfall?
5. What readback or export surfaces can you expose?
6. What receipts exist for payout changes?
7. What happens after debt closes?
8. What incident or freeze posture already exists?
9. If stronger payout-path control is not ready yet, are you willing to stand behind the lane as the direct platform counterparty for a bounded pilot?

## 15. Minimum technical surfaces

attn does not need a large rewrite to start.
It does need enough technical surface to qualify and monitor the lane.

The minimum useful surfaces are usually:

- launch attribution lookup,
- payout topology lookup,
- current payout configuration,
- payout-configuration change history or receipts,
- revenue events or revenue summaries,
- current debt-open destination or repayment-mode state,
- release or offboard action or receipt,
- incident or freeze state or receipt.

If some of these are missing, the lane can still be discussed.
The claim level just stays lower.

## 16. First technical review agenda

If attn and the partner have a technical review call, the clean agenda is:

1. confirm the lane scope,
2. confirm the repayment-relevant revenue scope,
3. map the live payout topology,
4. identify the debt-open destination or waterfall,
5. identify payout-edit authority,
6. review readback and receipt surfaces,
7. review incident posture,
8. review release or offboard semantics,
9. decide whether the lane is:
   - compatibility-only,
   - underwriting-compatible,
   - bounded-pilot eligible,
   - or stronger than that.

That meeting should end with a concrete yes or no on whether a bounded first pilot is realistically closable.

## 17. When stronger signer and operator security requirements apply

This page is intentionally focused on integration requirements first.
So the stronger signer and operator security controls do **not** need to dominate the earliest partner conversation.

But they do need to become explicit once the lane crosses out of light integration review and into real signing or meaningful balances.

The trigger is not only raw TVL.
The stronger security posture becomes mandatory once one or more of these are true:

- real multisig or treasury approvals are happening,
- payout routing or repayment destinations can be changed through signer-controlled operations,
- attn or the partner is relying on protected operator endpoints to move funds or approve production changes,
- the lane is reaching a real bounded pilot with meaningful balances,
- or a compromised everyday laptop could materially alter the repayment path or treasury posture.

At that point, the minimum bar should include:

- dedicated signing computers for real multisig approvals,
- no everyday browsing, coding, messaging, or app installs on signer-capable machines,
- hardware-wallet use on clean signer endpoints only,
- protected-endpoint inventory and machine-class tracking,
- attributable change receipts and signer review,
- incident freeze, quarantine, and recovery procedures,
- and clear separation between routine operator laptops and production signer devices.

For early compatibility work, manual underwriting review, or light platform-counterparty discussion, this can stay as a forward-looking requirement.
For a real bounded pilot with treasury movement or mutable payout control, it should be treated as part of the lane standard, not an optional hardening extra.

If the partner engineering or security team wants the deeper external baseline, use:

- [How to Multisig](https://howtomultisig.com/)
- [Security Alliance frameworks](https://frameworks.securityalliance.org/)
- [Security Alliance: signing verification](https://frameworks.securityalliance.org/wallet-security/signing-and-verification/signing-verification)
- [Security Alliance: secure multisig best practices](https://frameworks.securityalliance.org/wallet-security/secure-multisig-best-practices/)

## 18. Technical references

This page should be enough for the first partner conversation.
If the partner engineering team wants supporting references, use these next:

- [Partner-managed wallet integration requirements](../mechanics/partner-wallet-integration-requirements.md)
- [Revenue accounts and signing model](../mechanics/revenue-accounts-and-signing-model.md)
- [Architecture overview](../mechanics/architecture-overview.md)
- [Risk, limits, and concentration framework](../mechanics/risk-and-limits.md)
- [Pricing, spreads, and core parameters](../mechanics/pricing-and-parameters.md)
- [For Launchpads & Incubators](./for-launchpads-and-incubators.md)

## 19. Current concrete mapping

For the current live partner discussion, the platform in view is ClawPump.

Read the requirements above against these working assumptions:

- the partner keeps the wallet stack,
- the partner may control per-mint dev wallets,
- the partner may sponsor gas separately,
- and creator-fee or service-fee routing may happen inside the partner payout surfaces rather than the borrower-owned path used in attn's standard borrower-first implementation.

That means the immediate question is not whether the partner can mimic attn's standard borrower-first implementation.
The immediate question is whether the partner can expose enough revenue, control, and readback truth for a bounded first pilot.

## 20. What this page is not claiming

This page does not claim:

- public-live borrower support,
- public lender readiness,
- automatic control parity,
- or a fully shipped runtime lane today.

It is a qualification and pilot-shaping document for a partner-managed creator-fee integration.

## 21. Related pages

- [Partner-managed wallet integration requirements](../mechanics/partner-wallet-integration-requirements.md)
- [Revenue accounts and signing model](../mechanics/revenue-accounts-and-signing-model.md)
- [For Launchpads & Incubators](./for-launchpads-and-incubators.md)
