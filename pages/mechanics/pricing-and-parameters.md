# Pricing, Spreads, and Core Parameters

This page explains how attn thinks about **pricing** revenue-backed positions and setting core parameters like tenors, revenue shares, and rates.

It is descriptive of the intended framework and may change as more data and feedback arrive.

## 1. Objectives

Pricing aims to:

- offer projects **useful, non-punitive funding**,
- offer LPs **risk-appropriate yield**,
- keep the book **short-dated and granular** enough to react to new information.

Practically, this means:

- shorter tenors and higher payback speeds for more volatile revenues,
- lower spreads and longer tenors only for the most stable, diversified revenues.

## 2. Core knobs per product

Every advance / tranche from a credit line is defined by:

- **Advance amount** `A`
- **Target repayment** `R_target` (principal + fees)
- **Revenue share** `α` (share of defined revenues routed)
- **Maximum tenor** `T` (hard maturity date)

From these, an **implied APR / IRR band** can be computed under a base revenue scenario. Pricing is set so that:

- under “base case” revenues, LPs earn a target spread,
- under mild underperformance, returns are still acceptable,
- under severe underperformance, the protocol can recognise and contain losses quickly.

## 3. Rate bands and segmentation

Initial pricing is likely to use **bands** rather than continuous curves, e.g.:

- Tier A: very stable, diversified protocol revenues → lower spreads, longer tenors.
- Tier B: solid but more volatile apps / tokens → mid spreads, shorter tenors.
- Tier C: highly volatile or early-stage revenues → high spreads, very short tenors.

Where a project sits is driven by:

- historical revenue volatility,
- concentration (single venue vs many),
- strength of the revenue account wiring and enforcement,
- launchpad / partner support.

## 4. attnUSD target profile

The attnUSD vault targets:

- a **net yield range** (after losses and costs) rather than a fixed rate,
- a mix of:
  - safer, shorter-dated positions to keep liquidity and optionality,
  - a controlled allocation to higher-spread, higher-volatility positions.

Base yield from yield-bearing stables or staked assets, where used, is treated as a **bonus**, not the main source of return.

## 5. Dynamic adjustments

Over time, pricing and parameters can be adjusted based on:

- realised default and recovery rates,
- LP demand and target attnUSD size,
- competitive conditions in the broader market.

Changes are applied only to **new positions**; existing positions keep their agreed terms.

A more quantitative spec (curves, scorecards, target bands) will be added as the protocol matures and moves from “hand-tuned conservative” to “data-driven” parameter setting.
