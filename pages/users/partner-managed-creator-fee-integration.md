# Partner-Managed Creator-Fee Integration Guide

This page is the single document a creator-fee platform should use when evaluating an attn integration while keeping its own wallet and payout infrastructure.

It is intentionally written as a requirements and response document, not a product explainer.

If you are the partner team, the goal is simple:

- read this page once,
- answer the questions in sections `3` through `10`,
- attach the evidence listed in section `11`,
- and use sections `12` through `14` to scope the first bounded pilot.

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

The most useful outcome is not a general statement like "we can integrate."
The most useful outcome is a concrete answer to:

1. what revenues count,
2. where those revenues flow today,
3. what changes while debt is open,
4. who can edit that routing,
5. what attn can read back,
6. what happens if the routing degrades,
7. and what happens after the lane closes.

If those answers are strong, the lane may qualify for a bounded first pilot.
If they are weak, the lane may still be interesting, but the claim level stays lower.

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
- or automatic parity with the current borrower-first Swig path.

## 4. The baseline attn is comparing against

The current strongest borrower-side control baseline is still the borrower-first Pump path.

At a high level, that baseline gives attn:

- a pledged revenue path during the debt window,
- bounded change control while debt is open,
- readback and auditability,
- and a defined release or offboard path after close.

The partner-managed lane does not need to look the same at the account or wallet level.
It does need to produce the same practical outcomes where policy matters.

That means attn is not looking for "same implementation."
It is looking for "same control result."

## 5. Revenue-functioning questionnaire

This is the first thing the partner should answer.

### 5.1 What revenues count?

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

### 5.2 Where do those revenues land first?

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

### 5.3 What happens while debt is open?

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

### 5.4 What happens if that routing changes?

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

## 6. Policy questionnaire

This section is the control contract.

### 6.1 Launch attribution policy

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

### 6.2 Revenue-scope policy

Please answer:

1. How is repayment-relevant revenue defined?
2. Is that scope contractual, configurable, or inferred?
3. Can the scope change over time?
4. If yes, who can change it and how is that change recorded?

Minimum pilot bar:

- the revenue scope is explicit and stable enough to underwrite conservatively.

### 6.3 Wallet-topology policy

Please answer:

1. What are the key wallets or payout routers involved?
2. Which of them can materially affect the repayment path?
3. Which actor controls each one?

Minimum pilot bar:

- attn can see the wallets and actors that matter to repayment integrity.

### 6.4 Debt-open destination policy

Please answer:

1. What is the required destination or waterfall while debt is open?
2. How is that destination enforced in practice?
3. What would count as a violation?

Minimum pilot bar:

- the debt-open destination is explicit,
- and a violation is detectable rather than arguable.

### 6.5 Change-control policy

Please answer:

1. Who can edit payout recipients, payout percentages, or payout logic?
2. What approvals are required?
3. What receipt exists after the change?

Minimum pilot bar:

- known actor,
- known process,
- retained receipts.

### 6.6 Readback policy

Please answer:

1. What can attn inspect directly?
2. What must be provided as exports or reports?
3. How current is the readback?

Minimum pilot bar:

- attn can inspect enough live or near-live state to detect drift.

### 6.7 Release and offboard policy

Please answer:

1. What changes after the debt closes?
2. Who regains control of what?
3. What receipt proves the release or offboard happened?

Minimum pilot bar:

- the release path is defined,
- and the post-close state is not ambiguous.

### 6.8 Incident policy

Please answer:

1. What happens if payout integrity is compromised?
2. What freeze, pause, or quarantine actions exist?
3. What receipts exist for incident and recovery actions?

Minimum pilot bar:

- there is a real degraded-state response,
- not only a normal-mode explanation.

## 7. Requirement status model

attn will generally classify each requirement as:

- `missing`
- `partial`
- `verified`

Interpretation:

- too many `missing` items means the lane stays `compatibility-only`,
- a mix of `partial` and `verified` items may still support manual underwriting review,
- a strong cluster of `verified` items is required for a bounded first pilot.

## 8. What attn can honestly claim at each stage

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

## 9. Interim platform-counterparty posture

If the partner is not ready for the stronger payout-control claim yet, attn can still evaluate a narrower interim posture where the platform itself is the direct counterparty for the first lane.

That means:

- attn does not pretend the payout path has stronger control integrity than it really has,
- the platform stands behind the lane operationally,
- reporting and readback still matter,
- and the lane stays bounded.

This is an acceptable interim shape only if the partner can still provide:

- named revenue scope,
- named payout topology,
- named operational owner,
- periodic reporting or readback,
- and a clear explanation of what happens if the intended repayment behavior changes.

This should be described honestly as:

- `platform counterparty risk`

and not as:

- `fully policy-controlled creator-fee repayment parity`

## 10. Bounded first-pilot questionnaire

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

## 11. Evidence package the partner should send

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

## 12. Minimum technical surfaces

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

## 13. First technical review agenda

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

## 14. Technical references

This page should be enough for the first partner conversation.
If the partner engineering team wants supporting references, use these next:

- [Partner-managed wallet integration requirements](../mechanics/partner-wallet-integration-requirements.md)
- [Revenue accounts and signing model](../mechanics/revenue-accounts-and-signing-model.md)
- [Architecture overview](../mechanics/architecture-overview.md)
- [Risk, limits, and concentration framework](../mechanics/risk-and-limits.md)
- [Pricing, spreads, and core parameters](../mechanics/pricing-and-parameters.md)
- [For Launchpads & Incubators](./for-launchpads-and-incubators.md)

## 15. Current concrete mapping

For the current live partner discussion, the platform in view is ClawPump.

Read the requirements above against these working assumptions:

- the partner keeps the wallet stack,
- the partner may control per-mint dev wallets,
- the partner may sponsor gas separately,
- and creator-fee or service-fee routing may happen inside the partner payout surfaces rather than a borrower-owned Swig path.

That means the immediate question is not whether the partner can mimic the borrower-first Swig implementation.
The immediate question is whether the partner can expose enough revenue, control, and readback truth for a bounded first pilot.

## 16. What this page is not claiming

This page does not claim:

- public-live borrower support,
- public lender readiness,
- automatic control parity,
- or a fully shipped runtime lane today.

It is a qualification and pilot-shaping document for a partner-managed creator-fee integration.

## 17. Related pages

- [Partner-managed wallet integration requirements](../mechanics/partner-wallet-integration-requirements.md)
- [Revenue accounts and signing model](../mechanics/revenue-accounts-and-signing-model.md)
- [For Launchpads & Incubators](./for-launchpads-and-incubators.md)
