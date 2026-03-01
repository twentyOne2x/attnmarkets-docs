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

export type CreditVolumeSignal = {
  // Short value shown on zoom-map labels.
  display: string;
  // Optional annualized extension/origination signal (label suffix in zoom map when known).
  extendedPerYearDisplay?: string;
  // Comparable sizing value for dot normalization (USD billions, best-effort proxy).
  normalizedUsdBn?: number;
  // What the volume number represents (for caveat context).
  basis?: string;
  extendedPerYearBasis?: string;
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
  borrowerType?: string;
  distributionModel?: string;
  exampleClients?: string[];
  b2b2smbReliance?: string[];
  potentialClient?: boolean;
  infra?: InfraDependency;

  // Optional scale signals (for quick "how big" callouts)
  scale?: string[];
  creditVolume?: CreditVolumeSignal;

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
      "Revolving credit for onchain businesses, repaid automatically from routed onchain revenue accounts.",
    creditModel:
      "Entity credit enforced via routed revenue + automated servicing/sweeps (onchain).",
    borrowerType: "Business entities",
    distributionModel: "Infrastructure-first (behind partner surfaces)",
    exampleClients: ["Public named design partners are not disclosed yet."],
    b2b2smbReliance: [
      "Can be consumed through partner-embedded channels, but public named channels are not yet disclosed.",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative underwriting volume not disclosed.",
    },
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
    x: 0.9,
    y: 0.83,
    narrative:
      "Receivables + settlement liquidity financing with programmable cashflow routing (Spigot).",
    creditModel:
      "Secured revolving line of credit collateralized by cashflows/receivables (routing-based).",
    borrowerType: "Business entities",
    distributionModel: "Infrastructure-first (integrator-facing)",
    exampleClients: ["Public named customers are not listed in the cited docs."],
    b2b2smbReliance: [
      "Integrator-facing infra can sit behind partner channels, but public named B2B2SMB channels are not listed.",
    ],
    creditVolume: {
      display: "$1.2b",
      normalizedUsdBn: 1.2,
      basis: "Working underwriting proxy used for map comparability.",
      note: "Displayed per requested map update.",
    },
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
    x: 0.82,
    y: 0.89,
    narrative:
      "Embedded financing provider (merchant cash advance / revenue-based funding) distributed via partners.",
    creditModel:
      "Revenue-based financing with settlement/payment account routing a specified % of incoming sales revenue (offchain).",
    borrowerType: "Business borrowers (SMB merchants)",
    distributionModel: "Partner-embedded network (B2B2SMB)",
    exampleClients: [
      "eBay UK sellers (via eBay Seller Capital powered by YouLend).",
      "Amazon UK sellers (Amazon partner quote on YouLend site).",
      "Glovo merchants.",
      "orderbird merchants.",
      "Paysafe merchant network.",
    ],
    b2b2smbReliance: ["Core model is B2B2SMB partner distribution."],
    creditVolume: {
      display: "$1.3b",
      normalizedUsdBn: 1.3,
      basis: "SMB financings reported in UK+EU release (2024-10-21).",
      note: "Used as best-public proxy; global cumulative total is undisclosed.",
    },
    scale: [
      "Castlelake/YouLend release reported over $1.3bn of SMB financings across the UK and Europe (2024-10-21).",
      "$230m revenue (FY ended 2025-03-31).",
      "370,000 businesses funded (as of 2026-01-08).",
      "Public cumulative credit-advanced total is not explicitly disclosed in the 2026-01-08 update.",
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
        label: "YouLend home (partner testimonials and examples)",
        url: "https://youlend.com/",
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
    x: 0.73,
    y: 0.78,
    narrative:
      "Embedded working capital / merchant cash advance with revenue-aligned payments (offchain).",
    creditModel:
      "Merchant cash advance (MCA): customer sells a portion of future revenue; paid as a % of revenue.",
    borrowerType: "Business borrowers (SMB merchants)",
    distributionModel: "Direct + partner channels",
    exampleClients: [
      "GoCardless merchants (embedded capital partnership example).",
      "Uber Eats merchants (via integrated access to Pipe capital).",
      "Boulevard merchants.",
      "Housecall Pro merchants.",
    ],
    b2b2smbReliance: [
      "Mixed: includes partner channels, but not primarily described as a pure B2B2SMB model in cited sources.",
    ],
    creditVolume: {
      display: "$0.25b",
      extendedPerYearDisplay: "$0.17b",
      normalizedUsdBn: 0.25,
      basis: "Advanced in the last 18 months (Pipe 2025 recap).",
      extendedPerYearBasis: "Annualized from >$250m advanced over the last 18 months.",
      note: "Not lifetime cumulative.",
    },
    scale: [
      ">$250m advanced in the last 18 months (Pipe 2025 recap).",
      "~15,000 advances originated in the last 18 months (Pipe 2025 recap).",
      "Public lifetime cumulative total is not explicitly disclosed in the 2025 recap.",
    ],
    why: [
      "Pipe’s Capital product describes MCA paid as a percentage of revenue.",
      "Pipe’s own 2025 recap quantifies originations and total dollars advanced.",
    ],
    sources: [
      {
        label: "Pipe recap (15k advances; >$250m) — 2025",
        url: "https://pipe.com/resources/articles/2025-at-pipe-growing-scale-growing-impact",
      },
      { label: "Pipe partners page", url: "https://pipe.com/partners" },
      {
        label: "Pipe x Uber integration press release",
        url: "https://pipe.com/resources/press-releases/pipe-announces-new-integration-with-uber-empowering-restaurants-with-access-to-working-capital",
      },
      { label: "Pipe Capital product page (MCA)", url: "https://pipe.com/products/capital" },
    ],
    href: "https://pipe.com/products/capital",
  },

  clearco: {
    id: "clearco",
    label: "clear.co",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.66,
    y: 0.83,
    narrative:
      "Ecommerce/SaaS growth funding with fixed or rolling capacity, structured around future receivables.",
    creditModel:
      "Non-dilutive funding (including cash advance variants) with predictable capped weekly payments and receivables-based security interest.",
    borrowerType: "Business borrowers (SMB brands)",
    distributionModel: "Direct originator",
    exampleClients: ["Andie Swim.", "Monos.", "Aroma360.", "JOI."],
    b2b2smbReliance: [
      "Primarily direct B2SMB; no material B2B2SMB dependency is shown in cited sources.",
    ],
    creditVolume: {
      display: "$3.0b",
      normalizedUsdBn: 3.0,
      basis: "Funding deployed (company-reported).",
    },
    scale: [
      "$3B+ funding deployed (as shown on clear.co pages, fetched 2026-02-22).",
      "10,000+ brands/businesses funded (as shown on clear.co pages, fetched 2026-02-22).",
      "Decisions/funding timing messaging includes as little as 24-48 hours (page copy).",
    ],
    why: [
      "Positioned as recurring working-capital infrastructure for scaling operators, not a consumer app.",
      "Funding structures are tied to receivables/cashflow outcomes with defined payment mechanics.",
    ],
    sources: [
      {
        label: "Clearco home (positioning + scale claims)",
        url: "https://www.clear.co/",
      },
      {
        label: "Ecommerce funding overview (fixed/rolling capacity + structures)",
        url: "https://www.clear.co/ecommerce-funding",
      },
      {
        label: "FAQ copy (security interest in purchased future receivables)",
        url: "https://www.clear.co/ecommerce-funding",
      },
      {
        label: "Clearco customer stories",
        url: "https://www.clear.co/customer-stories",
      },
    ],
    href: "https://www.clear.co/",
  },

  paypal_working_capital: {
    id: "paypal_working_capital",
    label: "PayPal Working Capital",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.84,
    y: 0.84,
    narrative:
      "Merchant working-capital financing tied to PayPal payment flows and repayment from processed sales.",
    creditModel:
      "Merchant financing where repayment is linked to future sales volume flowing through PayPal rails.",
    borrowerType: "Business borrowers (PayPal merchants)",
    distributionModel: "Platform-native (PayPal ecosystem)",
    exampleClients: [
      "PayPal merchants in eligible markets (platform-native distribution).",
      "No public named partner-network client list for this product in cited disclosures.",
    ],
    b2b2smbReliance: [
      "No external B2B2SMB dependency for core product distribution; lending is native to PayPal’s own merchant ecosystem.",
    ],
    creditVolume: {
      display: "$30.0b",
      extendedPerYearDisplay: "$2.2b",
      normalizedUsdBn: 30,
      basis: "Global small-business lending originations reported by PayPal (2025-03-26).",
      extendedPerYearBasis: "Merchant receivables purchased in FY2025.",
    },
    scale: [
      "PayPal announced surpassing $30bn in global small-business lending originations (as of 2025-03-26).",
      "$2.2bn merchant receivables purchased (FY2025).",
      "$1.806bn merchant loans/advances/interest/fees receivable outstanding (2025-12-31).",
      "PayPal FY2025: $33.172bn revenue, $5.233bn net income (15.8% net margin; 18.3% operating margin).",
      "PayPal Working Capital standalone revenue/profit is not separately disclosed in the FY2025 10-K.",
    ],
    why: [
      "Repayment is mechanically tied to merchant sales processed on PayPal rails.",
      "Maps to the same revenue/receivables-credit lane as other receipt-captured working-capital models.",
    ],
    sources: [
      {
        label: "PayPal newsroom: surpasses $30B in global small-business lending (2025-03-26)",
        url: "https://newsroom.paypal-corp.com/2025-03-26-PayPal-Surpasses-30B-in-Global-Small-Business-Lending",
      },
      {
        label: "PayPal FY2025 10-K (merchant receivables + consolidated statements)",
        url: "https://www.sec.gov/Archives/edgar/data/1633917/000163391726000024/pypl-20251231.htm",
      },
      {
        label: "PayPal FY2023 10-K (historical merchant receivables series)",
        url: "https://www.sec.gov/Archives/edgar/data/1633917/000163391724000024/pypl-20231231.htm",
      },
      {
        label: "PayPal Working Capital page",
        url: "https://www.paypal.com/us/business/financial-services/working-capital-loan",
      },
    ],
    href: "https://www.paypal.com/us/business/financial-services/working-capital-loan",
  },

  shopify_capital: {
    id: "shopify_capital",
    label: "Shopify Capital",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.76,
    y: 0.93,
    narrative:
      "Merchant loans and MCAs embedded in Shopify's commerce stack with repayment tied to merchant sales.",
    creditModel:
      "Merchant loans/MCAs inside Shopify Capital; repayments are linked to platform payment activity.",
    borrowerType: "Business borrowers (Shopify merchants)",
    distributionModel: "Platform-native (Shopify ecosystem)",
    exampleClients: [
      "Shopify merchants in eligible markets (platform-native distribution).",
      "No public named partner-network client list for this product in cited disclosures.",
    ],
    b2b2smbReliance: [
      "No external B2B2SMB dependency for core product distribution; lending is native to Shopify’s own merchant ecosystem.",
    ],
    creditVolume: {
      display: "$5.1b",
      extendedPerYearDisplay: "$4.0b",
      normalizedUsdBn: 5.1,
      basis: "Distributed through Shopify Capital since 2016.",
      extendedPerYearBasis: "FY2025 purchases and originations of loans.",
    },
    scale: [
      "Shopify reports >$5.1bn distributed through Shopify Capital since 2016 (company post, 2024-04-23).",
      "$4.014bn purchases and originations of loans (FY2025 cash-flow line).",
      "$1.784bn loans and merchant cash advances, net (2025-12-31).",
      "Shopify FY2025: $11.556bn revenue, $1.231bn net income (10.7% net margin; 12.7% operating margin).",
      "Shopify Capital standalone revenue/profit is not separately disclosed in the FY2025 10-K.",
    ],
    why: [
      "Financing is embedded in merchant operations and repaid through platform-linked commerce flows.",
      "Fits the same revenue/receivables credit lane as other working-capital engines.",
    ],
    sources: [
      {
        label: "Shopify FY2025 10-K (capital balances + consolidated statements)",
        url: "https://www.sec.gov/Archives/edgar/data/1594805/000159480526000007/shop-20251231.htm",
      },
      {
        label: "Shopify Capital product page",
        url: "https://www.shopify.com/capital",
      },
      {
        label: "Shopify news: >$5.1bn distributed through Capital since 2016 (2024-04-23)",
        url: "https://www.shopify.com/news/capital",
      },
      {
        label: "Shopify Q4/FY2025 release (cash-flow loan-originations line)",
        url: "https://s27.q4cdn.com/572064924/files/doc_financials/2025/q4/Shopify_Investor_Press_Release_Q4-25_FINAL.pdf",
      },
    ],
    href: "https://www.shopify.com/capital",
  },

  stripe_capital: {
    id: "stripe_capital",
    label: "Stripe Capital",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.79,
    y: 0.86,
    narrative:
      "Payments-native business financing via dashboard offers, with repayment withheld from Stripe sales.",
    creditModel:
      "Business loans and/or merchant cash advances (MCA), typically repaid as a fixed percentage of Stripe sales.",
    borrowerType: "Business borrowers (Stripe merchants)",
    distributionModel: "Platform-native (Stripe ecosystem)",
    exampleClients: [
      "Stripe merchants in eligible markets (platform-native distribution).",
      "Capital for platforms users in US/UK public preview (platform names not publicly listed in cited docs).",
    ],
    b2b2smbReliance: [
      "Provider clarity: per Stripe docs, loans are issued by Celtic Bank and MCAs are provided by YouLend or Stripe. Capital for platforms is a Stripe-distributed channel (US/UK preview); the platform is the distribution partner, not the lender.",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Stripe Capital cumulative underwriting volume is not publicly disclosed.",
    },
    scale: [
      "Stripe 2025 annual letter reports $1.9tn total payment volume across Stripe; Capital-specific cumulative underwriting totals are not disclosed.",
      "Stripe Capital standalone financing volume/revenue/profit is not separately disclosed in the cited public docs.",
      "Docs list Stripe Capital availability in AU, DE, FR, GB, US (availability varies by country).",
      "Capital for platforms is described as public preview and only available in US and UK (docs).",
    ],
    why: [
      "Repayment is collected from card/payment volume on Stripe rails, matching revenue-linked financing mechanics.",
      "Offer distribution is embedded in Stripe Dashboard (Capital tab), with eligibility based on account/payment history.",
    ],
    sources: [
      {
        label: "Stripe Capital (product page)",
        url: "https://stripe.com/capital",
      },
      {
        label: "Stripe 2025 annual letter landing page",
        url: "https://stripe.com/annual-updates/2025",
      },
      {
        label: "How Stripe Capital works (docs)",
        url: "https://docs.stripe.com/capital/how-stripe-capital-works",
      },
      {
        label: "How Capital for platforms works (docs)",
        url: "https://docs.stripe.com/capital/how-capital-for-platforms-works",
      },
    ],
    href: "https://stripe.com/capital",
  },

  parafin: {
    id: "parafin",
    label: "Parafin",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.72,
    y: 0.88,
    narrative:
      "Embedded financing infrastructure distributed through partner platforms serving SMB merchants.",
    creditModel:
      "Partner-embedded business financing (working-capital and related products) with platform-driven distribution.",
    borrowerType: "Business borrowers (SMB merchants)",
    distributionModel: "Partner-embedded network (B2B2SMB)",
    exampleClients: [
      "Amazon merchants.",
      "Walmart sellers.",
      "DoorDash merchants.",
    ],
    b2b2smbReliance: ["Core model is B2B2SMB partner distribution."],
    creditVolume: {
      display: "$25.0b*",
      normalizedUsdBn: 25,
      basis: "Cumulative financing offers extended (company-reported).",
      note: "* Offers extended, not accepted/funded cumulative total.",
    },
    scale: [
      "$25bn+ cumulative financing offers extended (company-reported).",
      "39,000+ businesses funded (company-reported).",
      ">$100m annualized revenue run rate (company blog, 2025-12-18).",
      "Public accepted/funded cumulative dollar total is not explicitly disclosed; published cumulative figure is offers extended.",
    ],
    why: [
      "Purpose-built for platform-embedded financing rather than direct consumer distribution.",
      "Closest comparison lane is partner-distributed SMB financing with programmatic servicing.",
    ],
    sources: [
      {
        label: "Parafin home (scale counters: offers extended + businesses funded)",
        url: "https://www.parafin.com/",
      },
      {
        label: "Parafin 2025 update (> $100m run rate; 39k businesses; $25bn offers)",
        url: "https://www.parafin.com/blog/2025-a-defining-year-for-embedded-financing-and-small-business-growth",
      },
    ],
    href: "https://www.parafin.com/",
  },

  liberis: {
    id: "liberis",
    label: "Liberis",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.64,
    y: 0.86,
    narrative:
      "Embedded SME financing platform distributed through global payment and software partners.",
    creditModel:
      "Partner-distributed SME financing (including revenue-based/merchant-cash-advance style products by market).",
    borrowerType: "Business borrowers (SMEs)",
    distributionModel: "Partner-embedded network (B2B2SMB)",
    exampleClients: [
      "Vagaro merchants (Vagaro Capital).",
      "Clover UK merchants.",
      "Teya merchants.",
    ],
    b2b2smbReliance: ["Core model is B2B2SMB partner distribution."],
    creditVolume: {
      display: "£3.0b",
      normalizedUsdBn: 3.8,
      basis: "Funding delivered (company-reported).",
      note: "Normalized using a GBP->USD proxy (~1.27) for relative dot sizing.",
    },
    scale: [
      "£3bn+ funding delivered (company-reported).",
      "1.5m SMEs reached through partner channels (company-reported).",
      "Standalone revenue/profit is not publicly disclosed on the cited pages.",
    ],
    why: [
      "Distribution is partner-embedded and merchant-focused, not consumer-credit-led.",
      "Sits in the same embedded SMB financing lane as other receivables/working-capital operators.",
    ],
    sources: [
      {
        label: "Liberis about page (company metrics and positioning)",
        url: "https://www.liberis.com/about-us",
      },
      {
        label: "Liberis case studies (Vagaro, Clover UK, Teya)",
        url: "https://www.liberis.com/partner/case-studies",
      },
    ],
    href: "https://www.liberis.com/",
  },

  wayflyer: {
    id: "wayflyer",
    label: "Wayflyer",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.5,
    y: 0.72,
    narrative:
      "Growth-capital provider for ecommerce and digital SMBs, with underwriting tied to business performance.",
    creditModel:
      "Working-capital advances/loans for SMB operators with non-dilutive repayment structures.",
    borrowerType: "Business borrowers (SMB merchants)",
    distributionModel: "Direct originator",
    exampleClients: ["True Classic.", "Powerlete.", "Spongelle.", "Kekoa Foods."],
    b2b2smbReliance: [
      "Primarily direct B2SMB; no material B2B2SMB dependency is shown in cited sources.",
    ],
    creditVolume: {
      display: "$6.0b",
      normalizedUsdBn: 6,
      basis: "Deployed to businesses globally (company release, 2026-02-18).",
    },
    scale: [
      "Over $6bn deployed to businesses globally (company release, 2026-02-18).",
      "Surpassed $100m annual revenues (company release, 2026-02-18).",
      "5,000+ businesses supported (company release, 2026-02-18).",
    ],
    why: [
      "SMB growth-capital operator with scale disclosures that are useful for comparator context.",
      "Mechanically closer to revenue/receivables financing than to consumer-credit distribution.",
    ],
    sources: [
      {
        label: "Wayflyer press release ($250m facility; >$6bn deployed; >$100m revenue)",
        url: "https://wayflyer.com/en/press-releases/wayflyer-secures-usd250m-credit-facility-with-atlas-sp-partners-to-expand-sme-funding-capacity",
      },
      {
        label: "Wayflyer site",
        url: "https://wayflyer.com/",
      },
      {
        label: "Wayflyer customer stories",
        url: "https://wayflyer.com/customers",
      },
    ],
    href: "https://wayflyer.com/",
  },

  uncapped: {
    id: "uncapped",
    label: "Uncapped",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.29,
    y: 0.36,
    narrative:
      "Working-capital and ecommerce funding for SMBs with fixed-fee structures and no equity dilution.",
    creditModel:
      "Revenue-linked or fixed-fee growth financing products for SMB operators.",
    borrowerType: "Business borrowers (SMB merchants)",
    distributionModel: "Direct originator",
    exampleClients: [
      "MORI.",
      "Hedoine.",
      "Additional DTC/ecommerce brands via the Uncapped success-stories hub.",
    ],
    b2b2smbReliance: [
      "Primarily direct B2SMB; no material B2B2SMB dependency is shown in cited sources.",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative underwriting/deployed total not clearly disclosed.",
    },
    scale: [
      "Current public pages emphasize product sizing (for example, offers from $100k to $2m).",
      "Public cumulative underwriting/deployed total is not clearly disclosed on the cited pages.",
      "Standalone revenue/profit is not publicly disclosed on the cited pages.",
    ],
    why: [
      "Business-borrower working-capital lane with structures that map to receivables financing patterns.",
      "Useful comparator even though public cumulative scale disclosures are limited.",
    ],
    sources: [
      {
        label: "Uncapped site",
        url: "https://www.weareuncapped.com/",
      },
      {
        label: "Uncapped FAQ hub",
        url: "https://www.weareuncapped.com/faq-categories/all",
      },
      {
        label: "Uncapped success stories",
        url: "https://www.weareuncapped.com/success-stories/",
      },
      {
        label: "Tech.eu: Uncapped customer examples (MORI, Hedoine)",
        url: "https://tech.eu/2023/10/19/uncapped-secures-200m-to-expand-its-services-to-us-and-european-entrepreneurs/",
      },
    ],
    href: "https://www.weareuncapped.com/",
  },

  square_loans: {
    id: "square_loans",
    label: "Square Loans",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web2",
    x: 0.82,
    y: 0.89,
    narrative:
      "Platform-native merchant financing inside Square, repaid from seller payment flows.",
    creditModel:
      "Merchant financing integrated into Square seller workflows and linked to sales performance.",
    borrowerType: "Business borrowers (Square sellers)",
    distributionModel: "Platform-native (Square ecosystem)",
    exampleClients: [
      "Square sellers in eligible markets (platform-native distribution).",
      "No public named partner-network client list for this product in cited disclosures.",
    ],
    b2b2smbReliance: [
      "No external B2B2SMB dependency for core product distribution; lending is native to Square’s seller ecosystem.",
    ],
    creditVolume: {
      display: "$22.0b",
      normalizedUsdBn: 22,
      basis: "Loans underwritten through Square Loans since launch.",
    },
    scale: [
      "Block reported over $22bn in loans underwritten through Square Loans since launch (2024-12-13).",
      "Square Loans standalone revenue/profit is not separately disclosed in the cited source.",
    ],
    why: [
      "Platform-native SMB financing model with repayment tied to merchant processing flows.",
      "Strong benchmark for ecosystem-captive SMB lending at scale.",
    ],
    sources: [
      {
        label: "Block Inside ($22bn loans underwritten through Square Loans since launch)",
        url: "https://block.xyz/inside/owen-jennings-at-2024-ubs-technology-and-ai-conference",
      },
      {
        label: "Square Loans product page",
        url: "https://squareup.com/us/en/banking/loans",
      },
    ],
    href: "https://squareup.com/us/en/banking/loans",
  },

  rain: {
    id: "rain",
    label: "rain.xyz",
    stack: "Back-end infrastructure",
    controlPrimitive: "Mixed / not primary",
    plane: "hybrid",
    x: 0.58,
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

  decal: {
    id: "decal",
    label: "usedecal.com",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    x: 0.8,
    y: 0.52,
    narrative:
      "Merchant stablecoin processing stack (checkout, payouts, loyalty) designed to bring web2 operators onto onchain payment rails.",
    creditModel:
      "Payments/settlement infrastructure rather than standalone underwriting; focuses on stablecoin checkout and processing flows.",
    infra: {
      privy: "Unknown",
      squads: "No public evidence",
      asOf: "2026-02-28",
      note:
        "Public dashboard payload exposes WalletProvider/ParaProvider/AuthProvider plus PRIVY/PARA enums; strongest WaaS signal is Para, while Privy appears as a referenced wallet/auth code path. No public Squads signal found in fetched assets.",
    },
    borrowerType: "Merchants / business operators",
    distributionModel: "Merchant-embedded checkout + platform integrations",
    exampleClients: [
      "Solana Pay-enabled merchants listed via Decal's Seeker Season directory.",
      "Web2 merchants adopting stablecoin processing and payouts (company positioning).",
    ],
    b2b2smbReliance: [
      "Likely relies on Para as third-party wallet-as-a-service (WaaS) in its public dashboard stack.",
      "Privy appears in public bundle enums as a referenced wallet/auth path; production usage split is not publicly documented.",
      "No public Squads dependency signal found in fetched Decal public assets (as of 2026-02-28).",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative processed volume/revenue not disclosed on cited pages.",
    },
    scale: [
      "Decal positions one merchant stack for stablecoin processing, payouts, and loyalty.",
      "Public cumulative processing volume and standalone revenue are not disclosed in cited sources.",
    ],
    why: [
      "Closest Solana-native comparator for web2-merchant stablecoin processing posture.",
      "Emphasizes onchain settlement rails with merchant-facing UX/compliance abstractions.",
    ],
    sources: [
      { label: "Decal site", url: "https://usedecal.com/" },
      { label: "Decal terms", url: "https://usedecal.com/legal/terms" },
      { label: "Decal privacy", url: "https://usedecal.com/legal/privacy" },
      { label: "Decal dashboard login", url: "https://dashboard.usedecal.com/login" },
      {
        label: "Decal blog: Smart Payments, Payouts & Loyalty",
        url: "https://decal.link/blogs/Smart-Payments%2C-Payouts-%26-Loyalty-with-DeCal%3A-All-Made-Easy",
      },
      {
        label: "Decal blog: Seeker Season (Solana Pay-enabled merchants)",
        url: "https://decal.link/blogs/Seeker-Season%3A-Find-Solana-Pay-Enabled-Merchants",
      },
    ],
    href: "https://usedecal.com/",
  },

  moonpay_commerce: {
    id: "moonpay_commerce",
    label: "MoonPay Commerce (Helio)",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "hybrid",
    x: 0.73,
    y: 0.55,
    narrative:
      "Merchant checkout stack for accepting crypto/stablecoins, including Solana Pay plugin distribution through Helio.",
    creditModel:
      "Payments infrastructure (checkout + settlement) rather than standalone credit underwriting.",
    borrowerType: "Merchants / business operators",
    distributionModel: "Merchant-embedded checkout + platform plugins",
    exampleClients: [
      "Shopify merchants using the Solana Pay app powered by Helio.",
      "Online stores integrating Helio checkout APIs for crypto/stablecoin acceptance.",
    ],
    b2b2smbReliance: [
      "Primarily partner/platform distributed (for example Shopify plugin and ecommerce integrations).",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative underwriting is not applicable; merchant-processing volume is reported at product level.",
      note: "MoonPay acquisition release cites Helio transaction throughput metrics.",
    },
    scale: [
      "MoonPay said Helio had supported over 6,000 merchants and facilitated over $1.5bn in transactions at acquisition announcement (2024-01-17).",
      "Solana case study reports 200+ Shopify stores and over $1m in savings from lower fees.",
    ],
    why: [
      "Directly maps to web2-merchant stablecoin checkout distribution on Solana rails.",
      "Useful comparator for partner-embedded merchant payments versus credit-enforcement engines.",
    ],
    sources: [
      {
        label: "MoonPay newsroom: introduces MoonPay Commerce / acquires Helio (2024-01-17)",
        url: "https://www.moonpay.com/newsroom/moonpay-introduces-moonpay-commerce-acquires-helio-to-expand-its-enterprise-solution",
      },
      {
        label: "Helio docs: Shopify (Solana Pay app powered by Helio)",
        url: "https://docs.hel.io/for-merchants-and-partners/resources/integrations/shopify",
      },
      {
        label: "Solana customer story: Helio",
        url: "https://solana.com/customers/helio",
      },
    ],
    href: "https://www.moonpay.com/commerce",
  },

  depay: {
    id: "depay",
    label: "depay.com",
    stack: "User-facing distribution",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    x: 0.75,
    y: 0.51,
    narrative:
      "Web3 checkout/payment API for merchant apps, with Solana Pay protocol support and multi-chain stablecoin acceptance.",
    creditModel:
      "Payments acceptance and settlement rails (not a standalone underwriting product).",
    borrowerType: "Merchants / app businesses",
    distributionModel: "API + plugin distribution (merchant-embedded)",
    exampleClients: [
      "Shopify and WooCommerce merchants using DePay payment plugins.",
      "World App Mini Apps integrating DePay checkout.",
    ],
    b2b2smbReliance: [
      "Relies on merchant platform/app integrations (Shopify, WooCommerce, World App) for distribution.",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative processing volume/revenue not disclosed in cited sources.",
    },
    scale: [
      "DePay positions support for 14+ blockchains, 60+ wallets, and 13+ languages on its product page.",
      "Public cumulative processed volume and standalone revenue are not disclosed in cited sources.",
    ],
    why: [
      "Explicit Solana Pay protocol support and stablecoin-acceptance framing for merchant checkout.",
      "Useful comparator for programmable onchain payment acceptance versus credit underwriters.",
    ],
    sources: [
      { label: "DePay site", url: "https://depay.com/" },
      { label: "DePay Solana MWA docs", url: "https://depay.com/solana-mwa" },
      { label: "World App x DePay integration", url: "https://depay.com/world-app" },
    ],
    href: "https://depay.com/",
  },

  loop_crypto: {
    id: "loop_crypto",
    label: "loopcrypto.xyz",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "web3",
    x: 0.77,
    y: 0.6,
    narrative:
      "Merchant billing stack for crypto/stablecoin invoicing and subscriptions, with native Solana support.",
    creditModel:
      "Payments collections/settlement infrastructure; not a standalone credit underwriting system.",
    borrowerType: "Merchants / business operators",
    distributionModel: "Merchant APIs + invoicing/subscription workflows",
    exampleClients: [
      "Merchants accepting recurring USDC/USDT payments on Solana.",
      "Businesses using Loop to settle accepted payments in fiat or crypto.",
    ],
    b2b2smbReliance: [
      "Relies on merchant workflow integrations rather than captive consumer distribution.",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative processing volume/revenue not disclosed in cited sources.",
    },
    scale: [
      "Loop states support for Solana network payments and settlement in either fiat or crypto.",
      "Public cumulative processed volume and standalone revenue are not disclosed in cited sources.",
    ],
    why: [
      "Solana-native merchant payment support makes it a close comparator to Decal-style processing rails.",
      "Useful to separate payments-processing stacks from underwriting/servicing credit engines.",
    ],
    sources: [
      { label: "Loop merchants", url: "https://www.loopcrypto.xyz/merchants" },
      { label: "Loop build for web3", url: "https://www.loopcrypto.xyz/build-for-web3" },
      { label: "Loop docs", url: "https://docs.loopcrypto.xyz/" },
    ],
    href: "https://www.loopcrypto.xyz/",
  },

  spherepay: {
    id: "spherepay",
    label: "spherepay.co",
    stack: "Back-end infrastructure",
    controlPrimitive: "Programmatic controls",
    plane: "hybrid",
    x: 0.69,
    y: 0.72,
    narrative:
      "Enterprise stablecoin payments and treasury infrastructure, with Solana-based settlement environment in core architecture.",
    creditModel:
      "Payments/settlement infrastructure (no standalone underwriting product).",
    borrowerType: "Businesses / enterprises",
    distributionModel: "B2B API/infra integrations",
    exampleClients: [
      "Enterprise payment operations using stablecoin rails (company positioning).",
      "Public named merchant client list is not disclosed in cited sources.",
    ],
    b2b2smbReliance: [
      "Primarily B2B infrastructure integrations; merchant-facing experiences are downstream of partners.",
    ],
    creditVolume: {
      display: "n/a",
      basis: "Public cumulative processing volume/revenue not disclosed in cited sources.",
    },
    scale: [
      "Sphere positions global stablecoin payment and treasury tooling for enterprises.",
      "Public cumulative processed volume and standalone revenue are not disclosed in cited sources.",
    ],
    why: [
      "Adds Solana-oriented enterprise stablecoin-settlement infrastructure context around merchant payment rails.",
      "Useful adjacent comparator to distinguish payment infra from credit servicing layers.",
    ],
    sources: [
      { label: "SpherePay site", url: "https://spherepay.co/" },
      {
        label: "Sphere Labs architecture note (built on Solana Permissioned Environment)",
        url: "https://www.spherelabs.co/",
      },
    ],
    href: "https://spherepay.co/",
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

  affirm: {
    id: "affirm",
    label: "Affirm",
    stack: "User-facing distribution",
    controlPrimitive: "Reputation / legal",
    plane: "web2",
    x: 0.24,
    y: 0.16,
    narrative:
      "B2B2C BNPL network: merchant-integrated checkout plus consumer pay-over-time surfaces (including card/app flows).",
    creditModel:
      "Consumer BNPL underwriting/collections delivered through merchant integrations and app/card surfaces.",
    why: [
      "Distribution depends on merchant/checkout integrations even when UX is shopper-facing.",
      "Control is policy, underwriting, and collections rather than escrow/sweep enforcement.",
    ],
    sources: [
      { label: "Affirm for business", url: "https://www.affirm.com/business" },
      { label: "Affirm Card", url: "https://www.affirm.com/card" },
      { label: "Affirm payment options", url: "https://www.affirm.com/how-it-works" },
    ],
    href: "https://www.affirm.com/business",
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
    label: "Squads Altitude",
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
    label: "KAST",
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
    narrative:
      "Closed-loop stablecoin card-network thesis: direct crypto settlement while using existing EMV terminals and acquirer distribution.",
    creditModel:
      "Network/settlement infrastructure rather than a standalone underwriting product; framed as replacing incumbent card-network economics.",
    why: [
      "Public pages claim EMV compatibility and settlement at existing terminals.",
      "Positioning emphasizes acquirer integration and reduced dependence on incumbent Visa/Mastercard network layers.",
      "Still best treated as rails/network adjacency rather than core credit enforcement.",
    ],
    sources: [
      { label: "Colossus site", url: "https://colossus.credit/" },
      {
        label: "Founders, Inc. portfolio note (acquirers + EMV + existing stack)",
        url: "https://f.inc/portfolio/colossus/",
      },
    ],
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
