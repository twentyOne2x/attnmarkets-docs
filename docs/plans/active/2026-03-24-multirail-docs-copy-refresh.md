# Plan: Multirail Docs Copy Refresh

Last reviewed: 2026-03-24

## Goal
Refresh the public docs copy so the site explains the current `attn` product split clearly:

- attn as the credit layer for agent commerce
- onchain revenues as proof that an agent already does useful work
- the current narrow public product split:
  - agent credit for approved services and jobs
  - borrower credit backed by Pump.fun creator fees

The output should feel more current after the Tempo, Virtuals ACP, and XLayer progress, while still preserving truthful scope boundaries.

Success criteria:
- docs entrypoints explain the two public product surfaces clearly
- docs entrypoints explain that revenue is the proof layer while credit is the missing layer
- roadmap and audience pages reflect current narrow proof plus later expansion
- frozen context/deck pages stay untouched
- repo checks pass locally

## Scope
- In scope:
  - docs homepage and `llms.txt`
  - roadmap
  - introduction pages except `attn in context`
  - non-technical mechanics page
  - audience/user pages and sidebar labels
- Out of scope:
  - `pages/introduction/attn-in-context.mdx`
  - `pages/appendix/artemis-agentic-commerce-index.mdx`
  - `pages/1-pager.md`
  - layout, theme, route, or navigation redesign
  - deploy/push/merge

## Plan
1. Update the docs entry surfaces so they describe the current split between agent credit and borrower credit in plain language.
2. Refresh roadmap and intro pages so the current proof story is framed as agent-commerce credit, not just a generic Pump-only narrative.
3. Reframe revenue sources as proof that an agent already earns and spends onchain.
4. Tighten user-page labels and copy so the docs are easier to scan by audience.
4. Run local repo checks and leave the result available for review only.

## Risks
- Overstating XLayer or broader partner availability instead of keeping it bounded.
- Collapsing the distinction between current proof and future direction.
- Accidentally editing frozen pages.

## Validation
- `python3 scripts/knowledge_check.py`
- `git diff --check`
- `npm run build`
