# Risk, Limits, and Concentration Framework

This page describes how attn thinks about **risk** and **limits** on revenue-backed positions. It is an operator-led framework in early versions of the protocol.

It covers:

- what risks are relevant,
- how facility sizes and limits are set,
- how concentration and portfolio caps are managed,
- and how losses are handled.

## 1. Risk types

attn focuses on a small set of core risks:

- **Revenue risk** – volatility or decline of the underlying revenues.
- **Counterparty / execution risk** – teams disappearing, misusing funds, or breaching covenants.
- **Concentration risk** – too much exposure to one project, sector, or launchpad.
- **Tenor / liquidity risk** – advances or lines that are too long relative to how quickly losses can be realised.
- **Stablecoin / infra risk** – issues with the stablecoins or infra used by the vault.

Other risks (program, chain-level, legal) are acknowledged but treated separately.

## 2. Facility-level limits

For each project / facility, attn sets:

- a **maximum limit** (notional) per project,
- a **maximum advance size** per position,
- **maximum revenue share** and **maximum tenor** per position.

Initial limits are constrained by:

- observed revenue history (level and volatility),
- quality and redundancy of the revenue account wiring,
- team and launchpad track record,
- and overall portfolio utilisation.

These limits are operator-set in early versions and adjusted based on performance and stress tests.

## 3. Portfolio-level limits

At the portfolio level, attn maintains caps on:

- **name concentration** – max % of NAV in any single project,
- **launchpad / ecosystem concentration** – max % per launchpad or vertical,
- **tenor buckets** – how much of the book can sit in >3m, >6m, etc.,
- **seniority** – mix of senior vs more subordinated positions.

New positions are only approved if they fit within these caps. Otherwise they are resized, re-priced, or declined.

## 4. Losses, recoveries, and any buffers

Losses primarily hit **YT holders** (i.e. attnUSD LPs), via lower NAV:

- if a position falls short of `R_target`, the shortfall is recognised as a loss,
- recoveries (late revenue, collateral realisation) are credited back to NAV when and if they materialise.

In later phases, the protocol may add explicit **buffers / insurance funds** funded from fees.

Those are out of scope for the initial version and will be documented separately if/when live.

## 5. Who sets and updates parameters

In early versions, risk and limits are set by the **core operator / risk team**:

- parameter changes are reflected in code and in public docs,
- material changes (e.g. new max tenors, facility size bands) are announced.

If and when the protocol moves to a more decentralised governance model, this page will be updated to reflect that process. Until then, assume a conservative, operator-led risk framework focused on short maturities and diversified exposure.
