export type ExecutionPlane = "web3" | "hybrid" | "web2" | "unknown";

export type StackPosition =
  | "Back-end infrastructure"
  | "User-facing distribution"
  | "Adjacent";

export type ControlPrimitive =
  | "Programmatic controls"
  | "Reputation / legal"
  | "Mixed / not primary";

export type Source = {
  label: string;
  url: string;
};

export type InfraDependencyStatus = "Yes" | "No public evidence" | "Unknown";

export type InfraDependency = {
  privy: InfraDependencyStatus;
  squads: InfraDependencyStatus;
  asOf?: string;
  note?: string;
};

export type ProjectInfo = {
  id: string;
  label: string;

  // Classification
  stack: StackPosition;
  controlPrimitive: ControlPrimitive;
  plane: ExecutionPlane;

  // Scatter coordinates (qualitative)
  // x: 0 = Reputation/legal, 1 = Programmatic controls
  x: number;
  // y: 0 = User-facing distribution, 1 = Back-end infrastructure
  y: number;

  narrative: string;
  creditModel?: string;
  potentialClient?: boolean;
  infra?: InfraDependency;

  // Optional scale signals (for quick "how big" callouts)
  scale?: string[];

  // Tooltip/details support
  why: string[];
  sources: Source[];

  // Optional click-through
  href?: string;
};

export const PROJECTS: Record<string, ProjectInfo> = {
  attn: {
    id: "attn",
    label: "attn",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    x: 0.92,
    y: 0.93,
    narrative:
      "Revenue-underwritten, onchain-enforced revolving credit + servicing against routed onchain revenue accounts.",
    creditModel:
      "Entity credit enforced via routed revenue + automated servicing/sweeps (onchain).",
    why: [
      "Framed around enforceability via routed revenue + automated control modes.",
      "Designed to sit behind distribution surfaces (cards/commerce/treasury stacks).",
    ],
    sources: [
      {
        label: "attn in context (framing + comparisons)",
        url: "https://docs.attn.markets/introduction/attn-in-context",
      },
      {
        label: "How attnCredit works (non-technical)",
        url: "https://docs.attn.markets/mechanics/how-it-works-nontechnical",
      },
      {
        label: "For Cards, Commerce, and Settlement Partners",
        url: "https://docs.attn.markets/users/for-cards-and-commerce-partners",
      },
    ],
    href: "https://docs.attn.markets/introduction/attn-in-context",
  },

  creditcoop: {
    id: "creditcoop",
    label: "creditcoop.xyz",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    x: 0.85,
    y: 0.87,
    narrative:
      "Receivables + settlement liquidity financing with programmable cashflow routing (Spigot).",
    creditModel:
      "Secured revolving line of credit collateralized by cashflows/receivables (routing-based).",
    why: [
      "Core mechanic is cashflow routing / programmable repayment waterfall.",
      "Sits as an infra primitive behind settlement/commerce flows.",
    ],
    sources: [
      {
        label: "Spigot (docs)",
        url: "https://docs.creditcoop.xyz/about-our-products/the-spigot",
      },
      {
        label: "Secured Line of Credit (docs)",
        url: "https://docs.creditcoop.xyz/about-our-products/secured-line-of-credit",
      },
    ],
    href: "https://creditcoop.xyz/",
  },

  youlend: {
    id: "youlend",
    label: "youlend.com",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.78,
    y: 0.9,
    narrative:
      "Embedded financing provider (merchant cash advance / revenue-based funding) distributed via partners.",
    creditModel:
      "Revenue-based financing with settlement/payment account routing a specified % of incoming sales revenue (offchain).",
    scale: [
      "Public cumulative credit-advanced total is not explicitly disclosed in the 2026-01-08 update.",
      "370,000 businesses funded (as of 2026-01-08).",
      "Castlelake/YouLend release reported over $1.3bn of SMB financings across the UK and Europe (2024-10-21).",
      "$230m revenue (FY ended 2025-03-31).",
      "$12m profit (FY ended 2025-03-31).",
    ],
    why: [
      "Repayments described as proportional to sales.",
      "Payment account terms describe routing a specified proportion of sales revenue to the funder.",
    ],
    sources: [
      {
        label: "YouLend results post (370k funded; $230m rev; $12m profit) — 2026-01-08",
        url: "https://youlend.com/us/blog/youlend-reaches-370-000-businesses-funded-delivering-profitable-growth-built-to-last",
      },
      {
        label: "Cash Advance docs",
        url: "https://docs.youlend.com/docs/cash-advance",
      },
      {
        label: "YouLend x Castlelake (>$1.3bn SMB financings) — 2024-10-21",
        url: "https://www.prnewswire.com/news-releases/castlelake-and-youlend-partner-to-advance-growth-for-small-businesses-across-the-uk-and-europe-302282055.html",
      },
      {
        label: "Payment Account T&Cs",
        url: "https://youlend.com/us/paymentaccounttermsandconditions",
      },
    ],
    href: "https://youlend.com/us",
  },

  pipe: {
    id: "pipe",
    label: "pipe.com",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.72,
    y: 0.82,
    narrative:
      "Embedded working capital / merchant cash advance with revenue-aligned payments (offchain).",
    creditModel:
      "Merchant cash advance (MCA): customer sells a portion of future revenue; paid as a % of revenue.",
    scale: ["~15,000 advances originated in the last 18 months; >$250m total (Pipe recap post)."],
    why: [
      "Pipe’s Capital product describes MCA paid as a percentage of revenue.",
      "Pipe’s own 2025 recap quantifies originations and total dollars advanced.",
    ],
    sources: [
      {
        label: "Pipe recap (15k advances; >$250m) — 2025",
        url: "https://pipe.com/resources/articles/2025-at-pipe-growing-scale-growing-impact",
      },
      { label: "Pipe Capital product page (MCA)", url: "https://pipe.com/products/capital" },
    ],
    href: "https://pipe.com/products/capital",
  },

  rain: {
    id: "rain",
    label: "rain.xyz",
    stack: "Back-end infrastructure",
    controlPrimitive: "Mixed / not primary",
    plane: "hybrid",
    x: 0.62,
    y: 0.9,
    narrative:
      "Issuing + stablecoin settlement infrastructure powering downstream card programs (provider-of-providers).",
    creditModel:
      "Not a standalone credit protocol; provides issuing/settlement infrastructure (incl. tokenized receivables narrative).",
    infra: {
      privy: "No public evidence",
      squads: "No public evidence",
      asOf: "2026-02-21",
      note: "No explicit Privy/Squads dependency claims found on Rain public pages checked.",
    },
    why: [
      "Infrastructure layer under multiple card/commerce surfaces.",
      "Positions Visa stablecoin settlement + tokenized receivables narrative.",
    ],
    sources: [
      { label: "Rain site", url: "https://www.rain.xyz/" },
      { label: "Rain technology", url: "https://www.rain.xyz/technology" },
      {
        label: "Rain x Visa partnership — 2025-04-30",
        url: "https://www.rain.xyz/resources/rain-and-visa-partner-to-accelerate-onchain-credit-cards",
      },
      {
        label: "Avici docs (cards issued by Rain)",
        url: "https://docs.avici.money/getting-started/intro",
      },
    ],
    href: "https://www.rain.xyz/",
  },

  wildcat: {
    id: "wildcat",
    label: "wildcat.finance",
    stack: "Back-end infrastructure",
    controlPrimitive: "Reputation / legal",
    plane: "web3",
    x: 0.18,
    y: 0.86,
    narrative:
      "Undercollateralized credit markets with permissioning/policies (market-based credit).",
    creditModel: "Market-based lending with access controls; terms negotiated.",
    why: [
      "Primary control primitive is permissioning/policy + credit terms.",
      "Not framed around automated revenue sweeps/escrow as the core mechanism.",
    ],
    sources: [
      {
        label: "Wildcat docs: introduction",
        url: "https://docs.wildcat.finance/overview/introduction",
      },
      {
        label: "Market access via policies/hooks",
        url: "https://docs.wildcat.finance/using-wildcat/day-to-day-usage/market-access-via-policies-hooks",
      },
    ],
    href: "https://wildcat.finance/",
  },

  threejane: {
    id: "threejane",
    label: "3jane.xyz",
    stack: "Back-end infrastructure",
    controlPrimitive: "Reputation / legal",
    plane: "web3",
    x: 0.26,
    y: 0.79,
    narrative:
      "Unsecured credit lines underwritten via verified assets + offchain credit inputs.",
    creditModel:
      "Unsecured lines; default deterrence described via scoring + collections posture (not sweeps).",
    why: [
      "Positions around verified/offchain inputs and unsecured credit accounts.",
      "Default handling relies on policy/collections mechanisms rather than routed cashflows.",
    ],
    sources: [
      { label: "3Jane whitepaper", url: "https://www.3jane.xyz/pdf/whitepaper.pdf" },
      { label: "3Jane docs", url: "https://docs.3jane.xyz/" },
    ],
    href: "https://www.3jane.xyz/",
  },

  xitadel: {
    id: "xitadel",
    label: "xitadel.fi",
    stack: "Back-end infrastructure",
    controlPrimitive: "Reputation / legal",
    plane: "web3",
    x: 0.32,
    y: 0.73,
    narrative:
      "Fixed-term debt against project treasuries (native-token collateral) (details limited).",
    creditModel: "Fixed-term debt issuance (treasury/native-token collateral).",
    why: [
      "Debt issuance is typically contractual rather than sweep-enforced.",
      "Public mechanics are limited; treat details as diligence-dependent.",
    ],
    sources: [{ label: "Xitadel site", url: "https://xitadel.fi/" }],
    href: "https://xitadel.fi/",
  },

  yumi: {
    id: "yumi",
    label: "yumi.finance",
    stack: "Back-end infrastructure",
    controlPrimitive: "Reputation / legal",
    plane: "web3",
    potentialClient: true,
    x: 0.36,
    y: 0.81,
    narrative:
      "Onchain BNPL rails / credit-as-a-feature for platforms (embedded credit infrastructure).",
    creditModel:
      "BNPL/credit rails; secured vs unsecured depends on integration (Unknown from overview).",
    why: [
      "Positions as rails/feature layer for platforms rather than a consumer surface.",
      "Enforcement is not presented as routed revenue sweeps by default.",
    ],
    sources: [{ label: "Yumi docs", url: "https://docs.yumi.finance/" }],
    href: "https://www.yumi.finance/",
  },

  claw: {
    id: "claw",
    label: "claw.credit",
    stack: "Back-end infrastructure",
    controlPrimitive: "Reputation / legal",
    plane: "web3",
    x: 0.45,
    y: 0.7,
    narrative:
      "Autonomous credit for AI agents (agent lines + execution across x402 services).",
    creditModel: "Agent credit lines; underwriting via risk/score engine.",
    infra: {
      privy: "No public evidence",
      squads: "No public evidence",
      asOf: "2026-02-21",
      note: "No explicit Privy/Squads dependency claims found on Claw public pages checked.",
    },
    why: [
      "Underwriting/policy posture is primary; not framed as routed revenue sweeps.",
      "Complementary to agent spend surfaces (Frames/Sponge).",
    ],
    sources: [
      { label: "Claw docs", url: "https://www.claw.credit/docs/overview" },
      {
        label: "attn in context (agents + x402 surfaces)",
        url: "https://docs.attn.markets/introduction/attn-in-context",
      },
    ],
    href: "https://claw.credit/",
  },

  krak: {
    id: "krak",
    label: "kraken.com/krak",
    stack: "User-facing distribution",
    controlPrimitive: "Reputation / legal",
    plane: "hybrid",
    x: 0.24,
    y: 0.23,
    narrative: "Consumer money app + card distribution (Kraken).",
    creditModel:
      "Consumer account/card surface (credit model depends on product; not core primitive).",
    infra: {
      privy: "Unknown",
      squads: "Unknown",
      asOf: "2026-02-21",
      note: "Krak page returned anti-bot interstitial during CLI fetch; no direct Privy/Squads dependency claim confirmed in fetched sources.",
    },
    why: [
      "Primary value is distribution + rails.",
      "Control is conventional account/compliance rather than explicit clawback primitives.",
    ],
    sources: [{ label: "Kraken: Krak", url: "https://www.kraken.com/krak" }],
    href: "https://www.kraken.com/krak",
  },

  klarna_tempo: {
    id: "klarna_tempo",
    label: "klarna + tempo",
    stack: "User-facing distribution",
    controlPrimitive: "Reputation / legal",
    plane: "hybrid",
    x: 0.18,
    y: 0.18,
    narrative: "BNPL distribution + payments-L1 narrative (KlarnaUSD on Tempo).",
    creditModel:
      "Consumer BNPL underwriting/collections (details depend on product/market).",
    why: [
      "Distribution is Klarna’s consumer/merchant network; Tempo is the rails narrative.",
      "Control is underwriting + policy + collections rather than escrow/sweeps.",
    ],
    sources: [
      {
        label: "Klarna press (KlarnaUSD on Tempo) — 2025-11-25",
        url: "https://www.klarna.com/international/press/klarna-launches-klarnausd-as-stablecoin-transactions-hit-usd27-trillion/",
      },
    ],
    href: "https://www.klarna.com/international/press/klarna-launches-klarnausd-as-stablecoin-transactions-hit-usd27-trillion/",
  },

  avici: {
    id: "avici",
    label: "avici.money",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "hybrid",
    x: 0.82,
    y: 0.24,
    narrative:
      "User-facing spend/cards with escrow-backed settlement posture (secured spend).",
    creditModel: "Secured spend/collateralized posture (escrow mechanics).",
    why: [
      "Escrow/collateral mechanics make spend enforcement programmatic.",
      "Card surface can sit on infra providers (e.g., Rain).",
    ],
    sources: [
      {
        label: "Avici: secured credit cards",
        url: "https://docs.avici.money/getting-started/secured-credit-cards",
      },
      {
        label: "Avici: intro (Rain mention)",
        url: "https://docs.avici.money/getting-started/intro",
      },
    ],
    href: "https://avici.money/",
  },

  pyra: {
    id: "pyra",
    label: "pyra.fi",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    potentialClient: true,
    x: 0.74,
    y: 0.34,
    narrative: "Consumer spend surface funded by overcollateralized DeFi borrowing.",
    creditModel: "Overcollateralized borrowing/liquidation mechanics fund spend.",
    why: ["Spend capacity tied to collateral + liquidation risk."],
    sources: [{ label: "Pyra docs", url: "https://docs.pyra.fi/how-it-works" }],
    href: "https://www.pyra.fi/",
  },

  frames: {
    id: "frames",
    label: "frames.ag/tools",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    potentialClient: true,
    x: 0.66,
    y: 0.38,
    narrative:
      "Agent wallet + pay-per-use tool registry with policy controls (agent commerce spend surface).",
    creditModel:
      "Spend-control wallet + pay-per-use tooling surface (candidate consumer of credit backends).",
    infra: {
      privy: "Yes",
      squads: "No public evidence",
      asOf: "2026-02-21",
      note: "Frames public JS bundle exposes Privy SDK symbols (e.g., PrivyClientError/usePrivyModal) and privy.io references.",
    },
    why: [
      "Positions pay-per-use tooling and wallet controls suitable for programmatic spend.",
    ],
    sources: [
      { label: "Frames home", url: "https://frames.ag/" },
      { label: "Frames tools", url: "https://frames.ag/tools" },
      {
        label: "Frames web bundle (Privy SDK symbols; fetched 2026-02-21)",
        url: "https://frames.ag/_next/static/chunks/49d6c5edfd8f3a24.js",
      },
    ],
    href: "https://frames.ag/tools",
  },

  sponge: {
    id: "sponge",
    label: "paysponge.com",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    potentialClient: true,
    x: 0.62,
    y: 0.26,
    narrative:
      "Agent wallet + merchant gateway for selling directly to agents (agent payments + onboarding).",
    creditModel:
      "Spend-control wallet + gateway (candidate consumer of credit backends).",
    why: [
      "Positions agent-native purchasing and merchant onboarding for agents.",
    ],
    sources: [{ label: "Sponge site", url: "https://paysponge.com/" }],
    href: "https://paysponge.com/",
  },

  slash: {
    id: "slash",
    label: "slash.com",
    stack: "User-facing distribution",
    controlPrimitive: "Mixed / not primary",
    plane: "hybrid",
    x: 0.48,
    y: 0.37,
    narrative:
      "Business banking + corporate cards + global USD accounts (distribution surface).",
    creditModel: "Working capital details vary; depends on integrated backend.",
    infra: {
      privy: "Yes",
      squads: "No public evidence",
      asOf: "2026-02-21",
      note: "Privy is shown on Slash pages (customer/logo context); treated here as a usage signal per current mapping rule.",
    },
    why: ["Primarily a surface; can embed different credit backends."],
    sources: [
      { label: "Slash site", url: "https://www.slash.com/" },
      { label: "Slash business banking", url: "https://www.slash.com/products/business-banking" },
    ],
    href: "https://www.slash.com/",
  },

  altitude: {
    id: "altitude",
    label: "squads.xyz/altitude",
    stack: "User-facing distribution",
    controlPrimitive: "Mixed / not primary",
    plane: "hybrid",
    potentialClient: true,
    x: 0.52,
    y: 0.42,
    narrative: "Business accounts/treasury + ops tooling (Squads.xyz).",
    creditModel: "Account/treasury surface; credit depends on partners/backends.",
    infra: {
      privy: "No public evidence",
      squads: "Yes",
      asOf: "2026-02-21",
      note: "Altitude is explicitly a Squads.xyz product context.",
    },
    why: ["Treasury/ops surface; complementary to enforceable credit backends."],
    sources: [{ label: "Altitude", url: "https://squads.xyz/altitude" }],
    href: "https://squads.xyz/altitude",
  },

  kast: {
    id: "kast",
    label: "kast.xyz",
    stack: "User-facing distribution",
    controlPrimitive: "Mixed / not primary",
    plane: "hybrid",
    potentialClient: true,
    x: 0.6,
    y: 0.24,
    narrative:
      "Global money app powered by stablecoins with card/distribution UX and global spend rails.",
    creditModel: "Distribution surface; credit model is integration-dependent.",
    infra: {
      privy: "No public evidence",
      squads: "No public evidence",
      asOf: "2026-02-21",
      note: "No explicit Privy/Squads dependency claims found on fetched KAST public pages.",
    },
    why: [
      "Primarily a user-facing app and card-like spend surface.",
      "Can be complementary to credit backends that provide underwriting/servicing.",
    ],
    sources: [
      { label: "KAST site", url: "https://www.kast.xyz/" },
      {
        label: "Rain article (KAST as Solana neobank working with Rain) — 2025-05-29",
        url: "https://www.rain.xyz/resources/rain-expands-support-to-solana-tron-and-stellar-enabling-more-partners-to-launch-stablecoin-powered-card-programs",
      },
    ],
    href: "https://www.kast.xyz/",
  },

  offgrid: {
    id: "offgrid",
    label: "offgrid.cash",
    stack: "User-facing distribution",
    controlPrimitive: "Mixed / not primary",
    plane: "hybrid",
    potentialClient: true,
    x: 0.56,
    y: 0.2,
    narrative:
      "Privacy-first crypto card/payments app focused on quick card issuance and instant spend flows.",
    creditModel: "Primarily a payments/distribution surface; credit mechanics not explicit in fetched pages.",
    infra: {
      privy: "No public evidence",
      squads: "No public evidence",
      asOf: "2026-02-21",
      note: "No explicit Privy/Squads dependency claims found on fetched OffGrid public pages.",
    },
    why: [
      "Primary value appears to be user-facing payments and card UX.",
      "Closer to distribution rails than to a standalone underwriting/enforcement engine.",
    ],
    sources: [
      { label: "OffGrid site", url: "https://www.offgrid.cash/en" },
      {
        label: "OffGrid description (privacy-first cards/payments)",
        url: "https://www.offgrid.cash/en",
      },
    ],
    href: "https://www.offgrid.cash/en",
  },

  colossus: {
    id: "colossus",
    label: "colossus.credit",
    stack: "Adjacent",
    controlPrimitive: "Mixed / not primary",
    plane: "web3",
    x: 0.58,
    y: 0.84,
    narrative: "Payments network + card stack narrative (early).",
    why: ["Rails/network framing; not primarily a credit enforcement product."],
    sources: [{ label: "Colossus site", url: "https://colossus.credit/" }],
    href: "https://colossus.credit/",
  },

  pye: {
    id: "pye",
    label: "pye.fi",
    stack: "Adjacent",
    controlPrimitive: "Mixed / not primary",
    plane: "web3",
    x: 0.38,
    y: 0.92,
    narrative:
      "Staking-yield market infrastructure where validator reward streams are structured into tradable claims (principal + yield).",
    creditModel:
      "Not a lending primitive directly; resembles upfront monetization of future staking-reward claims (selling future yield streams).",
    why: [
      "Pye frames term-based staking agreements and tokenizes positions into principal and yield components.",
      "This supports a similar financing shape to selling future revenue/yield claims upfront, even though it is staking infrastructure rather than credit underwriting.",
    ],
    sources: [
      { label: "Pye site", url: "https://pye.fi/" },
      {
        label: "Variant: Investing in Pye (term staking + tokenized principal/yield) — 2025-12-09",
        url: "https://variant.fund/articles/investing-in-pye/",
      },
    ],
    href: "https://pye.fi/",
  },
};
