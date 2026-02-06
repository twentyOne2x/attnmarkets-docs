# Where attn Sits Next to Adjacent Protocol and Fintech Layers

attn is the **revenue credit and servicing control plane**.
It is not a card issuer, not a payroll platform, and not a pure yield-tokenization layer.

## 1. At a glance

| Layer | Typical role | How attn relates |
| --- | --- | --- |
| Neobank / card program apps | End-user distribution, balances, spend UX | attn can supply settlement liquidity rails behind the scenes |
| Issuer / treasury infrastructure | Settlement timing, liquidity operations, compliance stack | Primary buyer profile for attn's conservative settlement lane |
| Yield/structuring protocols | Tokenized rate and yield products | attn's focus is enforceable receivables-style credit servicing |
| Revenue-native credit (attn) | Underwriting + control + servicing against routed fees | Core attnCredit scope |

## 2. Positioning relative to card and treasury ecosystems

attn is best positioned as:

- settlement liquidity infrastructure,
- repayment control and servicing layer,
- lender reporting/tape provider for revenue-backed facilities.

This allows consumer-facing partners to keep distribution while using attn rails for credit operations.

## 3. Positioning relative to yield-structuring ecosystems

attn may interoperate with fixed-income ecosystems over time, but the product center remains:

- facility underwriting,
- repayment enforcement,
- deterministic stress and default handling,
- sleeve-level capital segregation.

## 4. Positioning language to keep consistent

Use:

- revenue-swept borrowing base facility,
- self-amortizing revolver,
- settlement liquidity against routed receivables.

Avoid:

- leverage-first language,
- implied principal guarantees,
- commingled risk framing across lanes.

## 5. Related pages

- [For Cards, Commerce, and Settlement Partners](../users/for-cards-and-commerce-partners.md)
- [For Liquidity Providers](../users/for-liquidity-providers.md)
- [attnCredit Engine and attnUSD](../mechanics/pt-yt-attnusd.md)
