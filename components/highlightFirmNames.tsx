"use client";

import React from "react";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FIRM_NAME_TOKENS = [
  "PayPal Working Capital",
  "Stripe Capital",
  "Shopify Capital",
  "Square Loans",
  "Housecall Pro",
  "creditcoop.xyz",
  "youlend.com",
  "Celtic Bank",
  "GoCardless",
  "Uber Eats",
  "DoorDash",
  "Wayflyer",
  "orderbird",
  "Aroma360",
  "Powerlete",
  "Spongelle",
  "Kekoa Foods",
  "YouLend",
  "Shopify",
  "PayPal",
  "Stripe",
  "Square",
  "Parafin",
  "Liberis",
  "pipe.com",
  "clear.co",
  "Clearco",
  "Uncapped",
  "Amazon UK",
  "Amazon",
  "Walmart",
  "Boulevard",
  "Paysafe",
  "Glovo",
  "eBay UK",
  "eBay",
  "Monos",
  "Andie Swim",
  "True Classic",
  "JOI",
  "Pipe",
  "Vagaro Capital",
  "Vagaro",
  "Clover UK",
  "Clover",
  "Teya",
  "MORI",
  "Hedoine",
  "attn",
].sort((a, b) => b.length - a.length);

const FIRM_NAME_REGEX = new RegExp(
  `(^|[^A-Za-z0-9])(${FIRM_NAME_TOKENS.map((name) => escapeRegExp(name)).join("|")})(?=$|[^A-Za-z0-9])`,
  "gi",
);

export function highlightFirmNames(text: string): React.ReactNode {
  if (!text) return text;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = 0;

  FIRM_NAME_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = FIRM_NAME_REGEX.exec(text))) {
    const prefix = match[1] ?? "";
    const firmName = match[2] ?? "";
    const matchStart = match.index;
    const firmStart = matchStart + prefix.length;

    if (matchStart > lastIndex) {
      nodes.push(<React.Fragment key={`text-${keyIndex++}`}>{text.slice(lastIndex, matchStart)}</React.Fragment>);
    }
    if (prefix) {
      nodes.push(<React.Fragment key={`prefix-${keyIndex++}`}>{prefix}</React.Fragment>);
    }

    nodes.push(<strong key={`firm-${keyIndex++}`}>{firmName}</strong>);
    lastIndex = firmStart + firmName.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<React.Fragment key={`tail-${keyIndex++}`}>{text.slice(lastIndex)}</React.Fragment>);
  }

  return nodes.length ? nodes : text;
}
