"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, type ExecutionPlane, type ProjectInfo } from "./quadrantMapData";

function planeLabel(p: ExecutionPlane) {
  if (p === "web3") return "Web3-native";
  if (p === "hybrid") return "Hybrid";
  if (p === "web2") return "Web2-native";
  return "Unknown";
}

function planeColor(p: ExecutionPlane) {
  // Muted palette for dim-blue UI background
  if (p === "web3") return "#5b7fbf"; // muted blue
  if (p === "hybrid") return "#7f68a3"; // muted purple
  if (p === "web2") return "#b1834f"; // muted amber
  return "#7a828f"; // muted gray
}

/**
 * Shape fallback:
 * - web3: circle
 * - hybrid: square
 * - web2: triangle
 */
function Marker(props: { plane: ExecutionPlane; cx: number; cy: number; size: number }) {
  const c = planeColor(props.plane);
  const s = props.size;

  if (props.plane === "web2") {
    const h = s;
    const w = s;
    const points = [
      `${props.cx},${props.cy - h / 2}`,
      `${props.cx - w / 2},${props.cy + h / 2}`,
      `${props.cx + w / 2},${props.cy + h / 2}`,
    ].join(" ");
    return <polygon points={points} fill={c} />;
  }

  if (props.plane === "hybrid") {
    return (
      <rect
        x={props.cx - s / 2}
        y={props.cy - s / 2}
        width={s}
        height={s}
        rx={2}
        fill={c}
      />
    );
  }

  return <circle cx={props.cx} cy={props.cy} r={s / 2} fill={c} />;
}

function MiniMarker(props: { plane: ExecutionPlane }) {
  const c = planeColor(props.plane);
  if (props.plane === "web2") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <polygon points="6,1 1,11 11,11" fill={c} />
      </svg>
    );
  }
  if (props.plane === "hybrid") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <rect x="2" y="2" width="8" height="8" rx="2" fill={c} />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4" fill={c} />
    </svg>
  );
}

type TooltipState = {
  id: string;
  x: number;
  y: number;
  pinned: boolean;
};

type ClusterHoverState = {
  label: string;
  x: number;
  y: number;
  stroke: string;
  targetX?: number;
  targetY?: number;
};

type Rect = { x1: number; y1: number; x2: number; y2: number };
type Point = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rectsOverlap(a: Rect, b: Rect) {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

function normalizeAngle(a: number) {
  let v = a;
  while (v <= -Math.PI) v += Math.PI * 2;
  while (v > Math.PI) v -= Math.PI * 2;
  return v;
}

function angleDistance(a: number, b: number) {
  return Math.abs(normalizeAngle(a - b));
}

function estimateTextWidth(text: string, fontSize: number) {
  // Simple monospace-ish estimate; good enough for collision avoidance.
  return Math.max(42, text.length * fontSize * 0.62);
}

function boundsForPoints(points: Point[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  return { minX, maxX, minY, maxY };
}

function pointDistance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function centroid(points: Point[]) {
  if (!points.length) return { x: 0, y: 0 };
  let sx = 0;
  let sy = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / points.length, y: sy / points.length };
}

function fieldScore(
  sample: Point,
  members: Point[],
  foreign: Point[],
  sigmaMember: number,
  sigmaForeign: number,
) {
  const sm2 = sigmaMember * sigmaMember * 2;
  const sf2 = sigmaForeign * sigmaForeign * 2;

  let positive = 0;
  let negative = 0;
  let nearestForeign = Number.POSITIVE_INFINITY;

  for (const m of members) {
    const dx = sample.x - m.x;
    const dy = sample.y - m.y;
    positive += Math.exp(-(dx * dx + dy * dy) / sm2);
  }
  for (const f of foreign) {
    const dx = sample.x - f.x;
    const dy = sample.y - f.y;
    const d2 = dx * dx + dy * dy;
    negative += Math.exp(-d2 / sf2);
    nearestForeign = Math.min(nearestForeign, Math.sqrt(d2));
  }

  return { value: positive - negative * 0.92, nearestForeign };
}

function smoothClosedPath(points: Point[]) {
  if (points.length < 3) return "";

  const toFixed = (n: number) => Number(n.toFixed(1));
  const last = points[points.length - 1];
  const first = points[0];
  const startX = toFixed((last.x + first.x) / 2);
  const startY = toFixed((last.y + first.y) / 2);
  let d = `M ${startX} ${startY}`;

  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    const next = points[(i + 1) % points.length];
    const mx = toFixed((p.x + next.x) / 2);
    const my = toFixed((p.y + next.y) / 2);
    d += ` Q ${toFixed(p.x)} ${toFixed(p.y)} ${mx} ${my}`;
  }

  d += " Z";
  return d;
}

function buildOrganicBoundary(args: {
  members: Point[];
  foreign: Point[];
  bounds: { left: number; right: number; top: number; bottom: number };
  includeRadius?: number;
}) {
  const c = centroid(args.members);
  const b = boundsForPoints(args.members);
  const diag = Math.hypot(b.maxX - b.minX, b.maxY - b.minY);
  const includeRadius = args.includeRadius ?? 30;
  const includeRadiusSq = includeRadius * includeRadius;

  // Deterministic, tighter envelope around member points (no random wobble).
  const sigmaMember = clamp(diag * 0.33 + 16, 24, 60);
  const sigmaForeign = sigmaMember * 0.7;
  const minR = clamp(sigmaMember * 0.28, 12, 30);
  const maxR = clamp(diag * 0.56 + sigmaMember * 0.42, 46, 150);
  const baseThreshold = clamp(0.67 - args.members.length * 0.018, 0.5, 0.64);
  const foreignClearance = sigmaMember * 0.4;

  const samples = 96;
  const radialStep = 2.5;
  const raw: Point[] = [];

  for (let i = 0; i < samples; i += 1) {
    const t = (i / samples) * Math.PI * 2;
    const wobble = 1;
    const ySkew = 1;

    let memberRay = minR;
    for (const m of args.members) {
      const dx = m.x - c.x;
      const dy = m.y - c.y;
      const proj = dx * Math.cos(t) + dy * Math.sin(t);
      const perp = Math.abs(-dx * Math.sin(t) + dy * Math.cos(t));
      // Ensure the boundary covers the full rendered dot/ring, not just center points.
      if (perp <= includeRadius) {
        const circleReach = proj + Math.sqrt(Math.max(0, includeRadiusSq - perp * perp));
        memberRay = Math.max(memberRay, circleReach + 2);
      }
      const lobe = proj + clamp(18 - Math.max(0, perp - includeRadius) * 0.9, 0, 18);
      memberRay = Math.max(memberRay, lobe);
    }

    let bestR = Math.max(minR, memberRay + 2);
    let found = false;
    for (let r = Math.max(minR, memberRay); r <= maxR; r += radialStep) {
      const p = {
        x: clamp(c.x + Math.cos(t) * r * wobble, args.bounds.left, args.bounds.right),
        y: clamp(c.y + Math.sin(t) * r * wobble * ySkew, args.bounds.top, args.bounds.bottom),
      };
      const score = fieldScore(p, args.members, args.foreign, sigmaMember, sigmaForeign);
      const acceptable = score.value >= baseThreshold && score.nearestForeign >= foreignClearance;

      if (acceptable) {
        found = true;
        bestR = r;
      } else if (found) {
        break;
      }
    }

    if (!found) {
      bestR = Math.max(bestR, memberRay + 1);
    }

    raw.push({
      x: clamp(c.x + Math.cos(t) * bestR * wobble, args.bounds.left, args.bounds.right),
      y: clamp(c.y + Math.sin(t) * bestR * wobble * ySkew, args.bounds.top, args.bounds.bottom),
    });
  }

  // Smoothing pass for cleaner fluid edges.
  let smooth = raw;
  for (let pass = 0; pass < 5; pass += 1) {
    smooth = smooth.map((p, i) => {
      const prev = smooth[(i - 1 + smooth.length) % smooth.length];
      const next = smooth[(i + 1) % smooth.length];
      return {
        x: prev.x * 0.24 + p.x * 0.52 + next.x * 0.24,
        y: prev.y * 0.24 + p.y * 0.52 + next.y * 0.24,
      };
    });
  }

  const tighten = clamp(0.91 + Math.min(args.members.length, 8) * 0.005, 0.915, 0.95);
  smooth = smooth.map((p) => ({
    x: clamp(c.x + (p.x - c.x) * tighten, args.bounds.left, args.bounds.right),
    y: clamp(c.y + (p.y - c.y) * tighten, args.bounds.top, args.bounds.bottom),
  }));

  // Final guard: never let smoothing/tightening cut through member dots.
  smooth = smooth.map((p) => {
    const dx0 = p.x - c.x;
    const dy0 = p.y - c.y;
    const angle = Math.atan2(dy0, dx0);
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const currentR = Math.hypot(dx0, dy0);

    let requiredR = minR;
    for (const m of args.members) {
      const dx = m.x - c.x;
      const dy = m.y - c.y;
      const proj = dx * ux + dy * uy;
      const perp = Math.abs(-dx * uy + dy * ux);
      if (perp <= includeRadius) {
        const circleReach = proj + Math.sqrt(Math.max(0, includeRadiusSq - perp * perp));
        requiredR = Math.max(requiredR, circleReach + 2);
      }
    }

    const finalR = Math.max(currentR, requiredR);
    return {
      x: clamp(c.x + ux * finalR, args.bounds.left, args.bounds.right),
      y: clamp(c.y + uy * finalR, args.bounds.top, args.bounds.bottom),
    };
  });

  return smooth;
}

function connectedPointComponents(points: Point[], threshold: number) {
  const components: Point[][] = [];
  const visited = new Array(points.length).fill(false);

  for (let i = 0; i < points.length; i += 1) {
    if (visited[i]) continue;
    const stack = [i];
    visited[i] = true;
    const indices: number[] = [];

    while (stack.length) {
      const idx = stack.pop();
      if (idx === undefined) continue;
      indices.push(idx);

      for (let j = 0; j < points.length; j += 1) {
        if (visited[j]) continue;
        if (pointDistance(points[idx], points[j]) <= threshold) {
          visited[j] = true;
          stack.push(j);
        }
      }
    }

    components.push(indices.map((k) => points[k]));
  }

  return components;
}

function computeLabelPlacements(args: {
  projects: ProjectInfo[];
  xToSvg: (x: number) => number;
  yToSvg: (y: number) => number;
  pad: number;
  plotW: number;
  plotH: number;
  fontSize: number;
  markerSize: number;
}) {
  const { projects, xToSvg, yToSvg, pad, plotW, plotH, fontSize, markerSize } = args;

  const labelH = fontSize * 1.25;
  const padX = 6;
  const padY = 4;

  const placed: Record<string, { x: number; y: number; rect: Rect }> = {};
  const taken: Rect[] = [];
  const centers = new Map(
    projects.map((p) => [p.id, { x: xToSvg(p.x), y: yToSvg(p.y), project: p }]),
  );

  // Deterministic order helps: place top-heavy first.
  const ordered = [...projects].sort((a, b) => b.y - a.y);

  for (const p of ordered) {
    const cx = xToSvg(p.x);
    const cy = yToSvg(p.y);

    const w = estimateTextWidth(p.label, fontSize);
    const halfW = w / 2;

    const inBounds = (x: number, y: number) => {
      const minX = pad + halfW + padX + 4;
      const maxX = pad + plotW - halfW - padX - 4;
      const minY = pad + labelH / 2 + padY + 4;
      const maxY = pad + plotH - labelH / 2 - padY - 4;

      return {
        x: clamp(x, minX, maxX),
        y: clamp(y, minY, maxY),
      };
    };

    const preferBelowFirst = p.y > 0.55;
    const neighborCandidates = projects
      .filter((q) => q.id !== p.id)
      .map((q) => centers.get(q.id))
      .filter((pt): pt is { x: number; y: number; project: ProjectInfo } => Boolean(pt))
      .map((pt) => ({ x: pt.x, y: pt.y, d: Math.hypot(pt.x - cx, pt.y - cy) }))
      .filter((pt) => pt.d <= 260);
    let preferredAngle = preferBelowFirst ? Math.PI / 2 : -Math.PI / 2;
    if (neighborCandidates.length) {
      const nC = centroid(neighborCandidates.map((pt) => ({ x: pt.x, y: pt.y })));
      preferredAngle = normalizeAngle(Math.atan2(nC.y - cy, nC.x - cx) + Math.PI);
    }

    const crowdBoost = clamp((neighborCandidates.length - 2) * 4, 0, 26);
    const baseGap = markerSize / 2 + 10 + labelH / 2 + crowdBoost;
    const verticalOffsets = preferBelowFirst ? [baseGap, -baseGap] : [-baseGap, baseGap];
    const horizontalJitter = [0, -18, 18, -36, 36, -54, 54, -78, 78];
    const sideGap = halfW + markerSize / 2 + 18 + crowdBoost * 0.6;
    const sideJitterY = [0, -16, 16, -30, 30, -44, 44];

    const candidatesRaw: Array<{ x: number; y: number }> = [];
    const radialOffsets = [baseGap, baseGap + 24, baseGap + 52, baseGap + 80];
    const angleOffsetsDeg = [0, -22, 22, -44, 44, -66, 66, -95, 95, 180];
    for (const r of radialOffsets) {
      for (const deg of angleOffsetsDeg) {
        const a = preferredAngle + (deg * Math.PI) / 180;
        candidatesRaw.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
    }
    for (const v of verticalOffsets) {
      for (const j of horizontalJitter) {
        candidatesRaw.push({ x: cx + j, y: cy + v });
      }
    }
    for (const jy of sideJitterY) {
      candidatesRaw.push({ x: cx - sideGap, y: cy + jy });
      candidatesRaw.push({ x: cx + sideGap, y: cy + jy });
    }

    let chosen: { x: number; y: number; rect: Rect } | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const c of candidatesRaw) {
      const bounded = inBounds(c.x, c.y);
      const x = bounded.x;
      const y = bounded.y;

      const rect: Rect = {
        x1: x - halfW - padX,
        y1: y - labelH / 2 - padY,
        x2: x + halfW + padX,
        y2: y + labelH / 2 + padY,
      };

      let overlapCount = 0;
      let overlapArea = 0;
      for (const t of taken) {
        if (!rectsOverlap(rect, t)) continue;
        overlapCount += 1;
        const ix = Math.max(0, Math.min(rect.x2, t.x2) - Math.max(rect.x1, t.x1));
        const iy = Math.max(0, Math.min(rect.y2, t.y2) - Math.max(rect.y1, t.y1));
        overlapArea += ix * iy;
      }

      const dist = Math.hypot(x - cx, y - cy);
      const clampPenalty = Math.abs(c.x - x) + Math.abs(c.y - y);
      const candidateAngle = Math.atan2(y - cy, x - cx);
      const anglePenalty = angleDistance(candidateAngle, preferredAngle) * 70;
      const score =
        overlapCount * 1000000 +
        overlapArea * 75 +
        dist * 1.05 +
        clampPenalty * 2.5 +
        anglePenalty;

      if (score < bestScore) {
        bestScore = score;
        chosen = { x, y, rect };
      }
    }

    if (chosen) {
      placed[p.id] = chosen;
      taken.push(chosen.rect);
    }
  }

  return placed;
}

type ClusterDef = {
  id: string;
  label: string;
  stroke: string;
  fill: string;
  dash: string;
  projectIds: string[];
  connectivity?: number;
  labelPlacement?: "top" | "bottom-right" | "auto";
  labelDistanceMultiplier?: number;
};

type ClusterZone = {
  id: string;
  stroke: string;
  fill: string;
  dash: string;
  path: string;
  label?: string;
  labelX?: number;
  labelY?: number;
  labelAnchorX?: number;
  labelAnchorY?: number;
  bounds?: { minX: number; maxX: number; minY: number; maxY: number };
  labelPlacement?: "top" | "bottom-right" | "auto";
  labelDistanceMultiplier?: number;
  boundaryPoints?: Point[];
};

const CLUSTER_DEFS: ClusterDef[] = [
  {
    id: "entity_credit",
    label: "Revenue & Receivables Credit",
    stroke: "#2f6fdf",
    fill: "#d6e5ff",
    dash: "10 8",
    connectivity: 0.45,
    labelPlacement: "bottom-right",
    projectIds: [
      "attn",
      "creditcoop",
      "youlend",
      "pipe",
      "clearco",
      "paypal_working_capital",
      "shopify_capital",
    ],
  },
  {
    id: "provider_of_providers",
    label: "Provider-of-Providers Infra",
    stroke: "#4668b8",
    fill: "#dde4ff",
    dash: "6 6",
    projectIds: ["rain"],
  },
  {
    id: "embedded_credit_rails",
    label: "Embedded Credit Rails",
    stroke: "#6d57c4",
    fill: "#e5dcff",
    dash: "8 5",
    projectIds: ["yumi"],
  },
  {
    id: "agent_credit_spend",
    label: "Agent Credit + Spend",
    stroke: "#c55d93",
    fill: "#ffe0ef",
    dash: "10 6",
    connectivity: 0.46,
    labelDistanceMultiplier: 1.9,
    projectIds: ["claw", "frames", "sponge"],
  },
  {
    id: "market_credit_debt",
    label: "Credit Markets + Debt Issuance",
    stroke: "#5f66a8",
    fill: "#dde2ff",
    dash: "4 5",
    connectivity: 0.68,
    projectIds: ["wildcat", "threejane", "xitadel"],
  },
  {
    id: "consumer_spend",
    label: "Consumer Spend Apps",
    stroke: "#cd7d2f",
    fill: "#ffe6cf",
    dash: "12 6",
    connectivity: 0.42,
    labelDistanceMultiplier: 1.95,
    projectIds: ["krak", "avici", "pyra", "kast", "offgrid"],
  },
  {
    id: "business_money",
    label: "Business Treasury Stack",
    stroke: "#2f9471",
    fill: "#d6f4e7",
    dash: "2 4",
    connectivity: 0.55,
    labelDistanceMultiplier: 1.85,
    projectIds: ["slash", "altitude"],
  },
  {
    id: "payments_rails",
    label: "Payments Rails / L1 Narratives",
    stroke: "#a150ac",
    fill: "#f1ddf4",
    dash: "14 7",
    projectIds: ["klarna_tempo", "colossus"],
  },
  {
    id: "adjacent",
    label: "Adjacent",
    stroke: "#6f7f99",
    fill: "#e4e9f1",
    dash: "5 7",
    projectIds: ["pye"],
  },
];

export default function QuadrantScatterMap(props: {
  asOf?: string;
  maxWidth?: number; // embedded sizing control
}) {
  const asOf = props.asOf ?? "2026-02-21";
  const maxWidth = props.maxWidth ?? 2200;

  const projects = useMemo(() => Object.values(PROJECTS), []);
  const totalProjects = projects.length;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastTooltipIdRef = useRef<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const tooltipHoverRef = useRef(false);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [clusterHover, setClusterHover] = useState<ClusterHoverState | null>(null);
  const [showClusters, setShowClusters] = useState(true);

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // Esc clears pin
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTooltip(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    if (!showClusters) setClusterHover(null);
  }, [showClusters]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!tooltip?.pinned) return;
      const target = e.target as Node | null;
      if (target && tooltipRef.current?.contains(target)) return;
      setTooltip(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [tooltip?.pinned]);

  useEffect(() => {
    if (!tooltip?.id) {
      lastTooltipIdRef.current = null;
      return;
    }

    if (lastTooltipIdRef.current !== tooltip.id && tooltipRef.current) {
      tooltipRef.current.scrollTop = 0;
    }

    lastTooltipIdRef.current = tooltip.id;
  }, [tooltip?.id]);

  // Larger embedded canvas with tighter gutters so the plot fills the card.
  const width = 1600;
  const height = 1220;
  const pad = 24;

  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  const xToSvg = (x: number) => pad + clamp(x, 0, 1) * plotW;
  const yToSvg = (y: number) => pad + (1 - clamp(y, 0, 1)) * plotH;
  const xMid = xToSvg(0.5);
  const yMid = yToSvg(0.5);

  const getLocalFromSvgPoint = (svgX: number, svgY: number) => {
    const wrap = chartWrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return { x: svgX, y: svgY };

    const wrapRect = wrap.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const x = svgRect.left - wrapRect.left + (svgX / width) * svgRect.width;
    const y = svgRect.top - wrapRect.top + (svgY / height) * svgRect.height;
    return { x, y };
  };

  const getLocalFromClientPoint = (clientX: number, clientY: number) => {
    const wrap = chartWrapRef.current;
    if (!wrap) return { x: clientX, y: clientY };
    const wrapRect = wrap.getBoundingClientRect();
    return {
      x: clientX - wrapRect.left,
      y: clientY - wrapRect.top,
    };
  };

  const showHover = (id: string, svgX: number, svgY: number) => {
    clearHideTimer();
    setClusterHover(null);
    setTooltip((prev) => {
      if (prev?.pinned) return prev;
      const { x, y } = getLocalFromSvgPoint(svgX, svgY);
      return { id, x, y, pinned: false };
    });
  };

  const hideHover = () => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setTooltip((prev) => {
        if (!prev || prev.pinned || tooltipHoverRef.current) return prev;
        return null;
      });
      hideTimerRef.current = null;
    }, 160);
  };

  const togglePin = (id: string, svgX: number, svgY: number) => {
    clearHideTimer();
    setClusterHover(null);
    const { x, y } = getLocalFromSvgPoint(svgX, svgY);
    setTooltip((prev) => {
      if (prev?.pinned && prev.id === id) return null;
      return { id, x, y, pinned: true };
    });
  };

  const showClusterHover = (
    label: string,
    stroke: string,
    clientX: number,
    clientY: number,
    targetSvgX?: number,
    targetSvgY?: number,
  ) => {
    if (tooltip?.pinned) return;
    const { x, y } = getLocalFromClientPoint(clientX, clientY);
    const target =
      targetSvgX !== undefined && targetSvgY !== undefined
        ? getLocalFromSvgPoint(targetSvgX, targetSvgY)
        : null;
    setClusterHover({
      label,
      x,
      y,
      stroke,
      targetX: target?.x,
      targetY: target?.y,
    });
  };

  const moveClusterHover = (clientX: number, clientY: number) => {
    setClusterHover((prev) => {
      if (!prev || tooltip?.pinned) return prev;
      const { x, y } = getLocalFromClientPoint(clientX, clientY);
      return { ...prev, x, y };
    });
  };

  const hideClusterHover = () => {
    setClusterHover((prev) => {
      if (!prev) return prev;
      return null;
    });
  };

  const active = tooltip ? PROJECTS[tooltip.id] : null;

  // Tooltip positioning inside container
  const tooltipStyle: React.CSSProperties = useMemo(() => {
    if (!tooltip) return { display: "none" };

    const el = chartWrapRef.current;
    const w = el?.clientWidth ?? 900;
    const h = el?.clientHeight ?? 600;

    const boxW = 420;
    const boxH = 320;
    const gap = 24;
    const edge = 10;

    // Keep tooltip visually near the hovered dot:
    // choose nearest horizontal side and vertically center around the point.
    let rawX = tooltip.x <= w / 2 ? tooltip.x + gap : tooltip.x - boxW - gap;
    if (rawX < edge) rawX = tooltip.x + gap;
    if (rawX + boxW > w - edge) rawX = tooltip.x - boxW - gap;
    const rawY = tooltip.y - boxH / 2;

    const x = clamp(rawX, edge, w - boxW - edge);
    const y = clamp(rawY, edge, h - boxH - edge);

    return {
      left: x,
      top: y,
      width: boxW,
      maxHeight: boxH,
      pointerEvents: "auto",
    };
  }, [tooltip]);

  const clusterHoverRender = useMemo(() => {
    if (!clusterHover || tooltip) return null;

    const el = chartWrapRef.current;
    const w = el?.clientWidth ?? 900;
    const h = el?.clientHeight ?? 600;

    const boxW = clamp(estimateTextWidth(clusterHover.label, 16) + 28, 140, 360);
    const boxH = 36;
    const gap = 44;
    const edge = 10;

    let x = clusterHover.x + gap;
    let y = clusterHover.y + gap;

    if (x + boxW > w - edge) x = clusterHover.x - boxW - gap;
    if (y + boxH > h - edge) y = clusterHover.y - boxH - gap;

    x = clamp(x, edge, w - boxW - edge);
    y = clamp(y, edge, h - boxH - edge);

    // Prefer pointing to cluster anchor when available, fallback to nearest bubble edge.
    const x2 =
      clusterHover.targetX !== undefined
        ? clamp(clusterHover.targetX, 6, w - 6)
        : clamp(clusterHover.x, x, x + boxW);
    const y2 =
      clusterHover.targetY !== undefined
        ? clamp(clusterHover.targetY, 6, h - 6)
        : clamp(clusterHover.y, y, y + boxH);

    return {
      width: w,
      height: h,
      bubbleStyle: {
        left: x,
        top: y,
        width: boxW,
      } satisfies React.CSSProperties,
      guide: {
        x1: clusterHover.x,
        y1: clusterHover.y,
        x2,
        y2,
      },
      stroke: clusterHover.stroke,
    };
  }, [clusterHover, tooltip]);

  const fontSize = 30;
  const markerSize = 34;

  const labelPlacements = useMemo(() => {
    return computeLabelPlacements({
      projects,
      xToSvg,
      yToSvg,
      pad,
      plotW,
      plotH,
      fontSize,
      markerSize,
    });
  }, [projects, pad, plotW, plotH, fontSize, markerSize]);

  const clusterZones = useMemo(() => {
    // Keep cluster envelopes allowed up to the plot border so edge dots remain enclosed.
    const edgeInset = 0;
    const plotLeft = pad + edgeInset;
    const plotRight = pad + plotW - edgeInset;
    const plotTop = pad + edgeInset;
    const plotBottom = pad + plotH - edgeInset;

    const allCenters = new Map(
      projects.map((p) => [p.id, { x: xToSvg(p.x), y: yToSvg(p.y) }]),
    );

    const zones: ClusterZone[] = [];

    for (const def of CLUSTER_DEFS) {
      const members = def.projectIds
        .map((id) => PROJECTS[id])
        .filter((p): p is ProjectInfo => Boolean(p));

      if (members.length < 2) continue;

      const centers = members
        .map((p) => allCenters.get(p.id))
        .filter((pt): pt is Point => Boolean(pt));
      if (centers.length < 2) continue;

      const foreignCenters = projects
        .filter((p) => !def.projectIds.includes(p.id))
        .map((p) => allCenters.get(p.id))
        .filter((pt): pt is Point => Boolean(pt));

      const spread = boundsForPoints(centers);
      const spreadDiag = Math.hypot(spread.maxX - spread.minX, spread.maxY - spread.minY);
      const proximityThreshold = clamp(spreadDiag * (def.connectivity ?? 0.34), 90, 210);

      const connectedGroups = connectedPointComponents(centers, proximityThreshold);
      const drawableGroups = connectedGroups.filter((g) => g.length >= 2);
      if (!drawableGroups.length) continue;

      const groupsSorted = [...drawableGroups].sort((a, b) => {
        if (b.length !== a.length) return b.length - a.length;
        const ba = boundsForPoints(a);
        const bb = boundsForPoints(b);
        const aa = (ba.maxX - ba.minX) * (ba.maxY - ba.minY);
        const ab = (bb.maxX - bb.minX) * (bb.maxY - bb.minY);
        return ab - aa;
      });

      for (let groupIdx = 0; groupIdx < groupsSorted.length; groupIdx += 1) {
        const group = groupsSorted[groupIdx];
        const boundary = buildOrganicBoundary({
          members: group,
          foreign: foreignCenters,
          bounds: {
            left: plotLeft,
            right: plotRight,
            top: plotTop,
            bottom: plotBottom,
          },
        });
        if (boundary.length < 3) continue;
        const path = smoothClosedPath(boundary);
        if (!path) continue;
        const boundaryBounds = boundsForPoints(boundary);

        zones.push({
          id: `${def.id}-${groupIdx}`,
          stroke: def.stroke,
          fill: def.fill,
          dash: def.dash,
          path,
          label: groupIdx === 0 ? def.label : undefined,
          bounds: groupIdx === 0 ? boundaryBounds : undefined,
          labelPlacement: groupIdx === 0 ? def.labelPlacement ?? "top" : undefined,
          labelDistanceMultiplier: groupIdx === 0 ? def.labelDistanceMultiplier ?? 1 : undefined,
          boundaryPoints: groupIdx === 0 ? boundary : undefined,
        });
      }
    }

    // Place cluster titles with collision avoidance (against project labels + other clusters).
    const takenRects: Rect[] = Object.values(labelPlacements).map((lp) => ({
      x1: lp.rect.x1 - 6,
      y1: lp.rect.y1 - 6,
      x2: lp.rect.x2 + 6,
      y2: lp.rect.y2 + 6,
    }));

    const plotCenterX = (plotLeft + plotRight) / 2;
    const plotCenterY = (plotTop + plotBottom) / 2;
    const xMidLocal = xToSvg(0.5);
    const yMidLocal = yToSvg(0.5);

    // Keep cluster labels away from large axis titles.
    const leftAxisText = "← Reputation / legal";
    const leftAxisW = estimateTextWidth(leftAxisText, 36);
    takenRects.push({
      x1: xToSvg(0) + 28 - 10,
      y1: yMidLocal - 20 - 28,
      x2: xToSvg(0) + 28 + leftAxisW + 10,
      y2: yMidLocal - 20 + 14,
    });

    const rightAxisText = "Programmatic controls →";
    const rightAxisW = estimateTextWidth(rightAxisText, 36);
    takenRects.push({
      x1: xToSvg(1) - 28 - rightAxisW - 10,
      y1: yMidLocal - 20 - 28,
      x2: xToSvg(1) - 28 + 10,
      y2: yMidLocal - 20 + 14,
    });

    const topAxisText = "Back-end infrastructure";
    const topAxisW = estimateTextWidth(topAxisText, 36);
    takenRects.push({
      x1: xMidLocal + 16 - 10,
      y1: yToSvg(1) + 44 - 28,
      x2: xMidLocal + 16 + topAxisW + 10,
      y2: yToSvg(1) + 44 + 12,
    });

    const bottomAxisText = "User-facing distribution";
    const bottomAxisW = estimateTextWidth(bottomAxisText, 36);
    takenRects.push({
      x1: xMidLocal + 16 - 10,
      y1: yToSvg(0) - 16 - 28,
      x2: xMidLocal + 16 + bottomAxisW + 10,
      y2: yToSvg(0) - 16 + 12,
    });

    const labelHeight = 52;
    const labelPadX = 22;

    for (const zone of zones) {
      if (!zone.label || !zone.bounds) continue;
      const labelW = estimateTextWidth(zone.label, 30) + labelPadX * 2;
      const halfW = labelW / 2;
      const halfH = labelHeight / 2;
      const b = zone.bounds;
      const centerX = (b.minX + b.maxX) / 2;
      const centerY = (b.minY + b.maxY) / 2;
      const autoAngle = Math.atan2(centerY - plotCenterY, centerX - plotCenterX);
      const preferredAngle =
        zone.labelPlacement === "bottom-right"
          ? (58 * Math.PI) / 180
          : zone.labelPlacement === "top"
            ? -Math.PI / 2
            : autoAngle;

      const inBounds = (x: number, y: number) => ({
        x: clamp(x, plotLeft + halfW + 6, plotRight - halfW - 6),
        y: clamp(y, plotTop + halfH + 6, plotBottom - halfH - 6),
      });

      const angleOffsetsDeg =
        zone.labelPlacement === "bottom-right"
          ? [0, -22, 22, -44, 44, -70, 70, 180]
          : [0, -25, 25, -50, 50, -75, 75, 180];
      const distanceMultiplier = zone.labelDistanceMultiplier ?? 1;
      const radialOffsets = [34, 56, 82].map((v) => v * distanceMultiplier);
      const candidates: Array<{ x: number; y: number; ax: number; ay: number; angle: number }> = [];

      for (const deg of angleOffsetsDeg) {
        const ang = preferredAngle + (deg * Math.PI) / 180;
        const dx = Math.cos(ang);
        const dy = Math.sin(ang);

        const tx = dx > 0 ? (b.maxX - centerX) / dx : dx < 0 ? (b.minX - centerX) / dx : Infinity;
        const ty = dy > 0 ? (b.maxY - centerY) / dy : dy < 0 ? (b.minY - centerY) / dy : Infinity;
        const tRect = Math.min(tx > 0 ? tx : Infinity, ty > 0 ? ty : Infinity);
        const t = Number.isFinite(tRect) ? tRect : 0;
        const anchorX = centerX + dx * t;
        const anchorY = centerY + dy * t;

        for (const ro of radialOffsets) {
          candidates.push({
            x: anchorX + dx * (ro + Math.max(halfW, halfH) * 0.18),
            y: anchorY + dy * (ro + Math.max(halfW, halfH) * 0.18),
            ax: anchorX,
            ay: anchorY,
            angle: ang,
          });
        }
      }

      let best: { x: number; y: number; ax: number; ay: number; rect: Rect } | null = null;
      let bestScore = Number.POSITIVE_INFINITY;

      for (let i = 0; i < candidates.length; i += 1) {
        const c = candidates[i];
        const bounded = inBounds(c.x, c.y);
        const x = bounded.x;
        const y = bounded.y;
        const rect: Rect = {
          x1: x - halfW,
          y1: y - halfH,
          x2: x + halfW,
          y2: y + halfH,
        };

        let overlapCount = 0;
        let overlapArea = 0;
        for (const t of takenRects) {
          if (!rectsOverlap(rect, t)) continue;
          overlapCount += 1;
          const ix = Math.max(0, Math.min(rect.x2, t.x2) - Math.max(rect.x1, t.x1));
          const iy = Math.max(0, Math.min(rect.y2, t.y2) - Math.max(rect.y1, t.y1));
          overlapArea += ix * iy;
        }

        const clampPenalty = Math.abs(c.x - x) + Math.abs(c.y - y);
        const anchorDist = Math.hypot(c.ax - x, c.ay - y);
        const anglePenalty = angleDistance(c.angle, preferredAngle) * 140;
        const preferencePenalty = i * 8;
        const midBandDownwardPenalty =
          zone.labelPlacement === "auto" &&
          centerY > yMidLocal - 40 &&
          centerY < yMidLocal + 160 &&
          y > centerY + 16
            ? (y - (centerY + 16)) * 3.5
            : 0;
        const score =
          overlapCount * 100000 +
          overlapArea * 50 +
          anchorDist * 0.42 +
          clampPenalty * 2.8 +
          anglePenalty +
          midBandDownwardPenalty +
          preferencePenalty;

        if (score < bestScore) {
          bestScore = score;
          best = { x, y, ax: c.ax, ay: c.ay, rect };
        }
      }

      if (best) {
        zone.labelX = best.x;
        zone.labelY = best.y;
        let anchorX = best.ax;
        let anchorY = best.ay;
        if (zone.boundaryPoints?.length) {
          let nearest = zone.boundaryPoints[0];
          let nearestD2 = (nearest.x - best.x) ** 2 + (nearest.y - best.y) ** 2;
          for (let i = 1; i < zone.boundaryPoints.length; i += 1) {
            const bp = zone.boundaryPoints[i];
            const d2 = (bp.x - best.x) ** 2 + (bp.y - best.y) ** 2;
            if (d2 < nearestD2) {
              nearest = bp;
              nearestD2 = d2;
            }
          }
          anchorX = nearest.x;
          anchorY = nearest.y;
        }
        zone.labelAnchorX = clamp(anchorX, plotLeft + 8, plotRight - 8);
        zone.labelAnchorY = clamp(anchorY, plotTop + 8, plotBottom - 8);
        takenRects.push({
          x1: best.rect.x1 - 4,
          y1: best.rect.y1 - 4,
          x2: best.rect.x2 + 4,
          y2: best.rect.y2 + 4,
        });
      }
    }

    return zones;
  }, [pad, plotW, plotH, projects, xToSvg, yToSvg, labelPlacements]);

  const visibleClusterIds = useMemo(() => {
    return new Set(clusterZones.map((z) => z.id.replace(/-\d+$/, "")));
  }, [clusterZones]);

  const clusterLegend = useMemo(() => {
    return CLUSTER_DEFS.filter((def) => visibleClusterIds.has(def.id)).map((def) => ({
      id: def.id,
      label: def.label,
      stroke: def.stroke,
      fill: def.fill,
    }));
  }, [visibleClusterIds]);

  const clusterByProject = useMemo(() => {
    const m = new Map<string, ClusterDef>();
    for (const def of CLUSTER_DEFS) {
      for (const id of def.projectIds) {
        if (PROJECTS[id]) m.set(id, def);
      }
    }
    return m;
  }, []);

  return (
    <div
      className="wrap"
      aria-label={`Embedded credit control landscape (as of ${asOf})`}
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
      }}
    >
      <div className="card" ref={containerRef}>
        <div className="topBar">
          <div className="topLeft">
            <div className="title">Strategic Credit, Spend & Settlement Map — as of {asOf}</div>
            <div className="hint">
              Hover for details. Click a dot to pin. Esc clears. Showing {totalProjects} projects.
            </div>
          </div>
          <div className="topRight">
            <label className="clusterToggle">
              <input
                type="checkbox"
                checked={showClusters}
                onChange={(e) => setShowClusters(e.target.checked)}
              />
              <span>Show strategy clusters</span>
            </label>
            <div className="legendInline" aria-label="Execution plane legend">
              <span className="legendItem">
                <MiniMarker plane="web3" /> Web3-native (circle)
              </span>
              <span className="legendItem">
                <MiniMarker plane="hybrid" /> Hybrid (square)
              </span>
              <span className="legendItem">
                <MiniMarker plane="web2" /> Web2-native (triangle)
              </span>
              <span className="legendItem">
                <span className="potentialRing" aria-hidden="true" /> Potential client (red ring)
              </span>
            </div>
          </div>
        </div>

        <div className="chartWrap" ref={chartWrapRef}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Quadrant scatter plot"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              <linearGradient id="quad-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5f9ff" />
                <stop offset="100%" stopColor="#e4efff" />
              </linearGradient>
            </defs>

            {/* Refreshed background for stronger zone contrast */}
            <rect x="0" y="0" width={width} height={height} fill="url(#quad-bg)" />

            {/* Subtle quadrant shading */}
            <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.065} />
            <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.035} />
            <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.035} />
            <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.065} />

            {/* Optional commercial cluster zones */}
            {showClusters
              ? clusterZones.map((zone) => {
                const baseClusterId = zone.id.replace(/-\d+$/, "");
                const clusterDef = CLUSTER_DEFS.find((def) => def.id === baseClusterId);
                const hoverLabel = clusterDef?.label ?? zone.label ?? "Cluster";

                return (
                  <g key={zone.id}>
                    <path
                      d={zone.path}
                      fill={zone.fill}
                      fillOpacity={0.18}
                      stroke={zone.stroke}
                      strokeOpacity={0.92}
                      strokeWidth={2.6}
                      strokeDasharray={zone.dash}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      onMouseEnter={(e) =>
                        showClusterHover(
                          hoverLabel,
                          zone.stroke,
                          e.clientX,
                          e.clientY,
                          zone.labelX,
                          zone.labelY,
                        )}
                      onMouseMove={(e) => moveClusterHover(e.clientX, e.clientY)}
                      onMouseLeave={hideClusterHover}
                      onFocus={(e) => {
                        const r = (e.currentTarget as SVGPathElement).getBoundingClientRect();
                        showClusterHover(
                          hoverLabel,
                          zone.stroke,
                          r.left + r.width / 2,
                          r.top + r.height / 2,
                          zone.labelX,
                          zone.labelY,
                        );
                      }}
                      onBlur={hideClusterHover}
                      tabIndex={0}
                      aria-label={hoverLabel}
                    />
                    {zone.label && zone.labelX && zone.labelY ? (
                      <g
                        onMouseEnter={(e) =>
                          showClusterHover(
                            hoverLabel,
                            zone.stroke,
                            e.clientX,
                            e.clientY,
                            zone.labelX,
                            zone.labelY,
                          )}
                        onMouseMove={(e) => moveClusterHover(e.clientX, e.clientY)}
                        onMouseLeave={hideClusterHover}
                      >
                        {zone.labelAnchorX && zone.labelAnchorY ? (
                          <line
                            x1={
                              zone.labelAnchorX > zone.labelX + estimateTextWidth(zone.label, 30) / 2
                                ? zone.labelX + estimateTextWidth(zone.label, 30) / 2 + 6
                                : zone.labelAnchorX < zone.labelX - estimateTextWidth(zone.label, 30) / 2
                                  ? zone.labelX - estimateTextWidth(zone.label, 30) / 2 - 6
                                  : zone.labelX
                            }
                            y1={
                              zone.labelAnchorY > zone.labelY + 2
                                ? zone.labelY + 31
                                : zone.labelAnchorY < zone.labelY - 2
                                  ? zone.labelY - 31
                                  : zone.labelY
                            }
                            x2={zone.labelAnchorX}
                            y2={zone.labelAnchorY}
                            stroke={zone.stroke}
                            strokeOpacity={1}
                            strokeWidth={3.1}
                            strokeDasharray="2 6"
                            strokeLinecap="round"
                          />
                        ) : null}
                        <rect
                          x={zone.labelX - estimateTextWidth(zone.label, 30) / 2 - 22}
                          y={zone.labelY - 26}
                          width={estimateTextWidth(zone.label, 30) + 44}
                          height={52}
                          rx={26}
                          fill="#ffffff"
                          opacity={1}
                          stroke={zone.stroke}
                          strokeOpacity={0.98}
                          strokeWidth={2.8}
                        />
                        <text
                          x={zone.labelX}
                          y={zone.labelY + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={30}
                          fontWeight={900}
                          fill="#1a2f52"
                        >
                          {zone.label}
                        </text>
                      </g>
                    ) : null}
                  </g>
                );
              })
            : null}

            {/* Plot border */}
            <rect
              x={pad}
              y={pad}
              width={plotW}
              height={plotH}
              fill="none"
              stroke="#35527f"
              opacity={0.5}
              strokeWidth={2}
            />

            {/* Midlines */}
            <line
              x1={xMid}
              y1={yToSvg(0)}
              x2={xMid}
              y2={yToSvg(1)}
              stroke="#35527f"
              opacity={0.3}
              strokeDasharray="10 10"
              strokeWidth={2}
            />
            <line
              x1={xToSvg(0)}
              y1={yMid}
              x2={xToSvg(1)}
              y2={yMid}
              stroke="#35527f"
              opacity={0.3}
              strokeDasharray="10 10"
              strokeWidth={2}
            />

            {/* Axis arrows */}
            <polygon
              points={`${xToSvg(0) + 8},${yMid} ${xToSvg(0) + 22},${yMid - 8} ${xToSvg(0) + 22},${yMid + 8}`}
              fill="#35527f"
              opacity={0.65}
            />
            <polygon
              points={`${xToSvg(1) - 8},${yMid} ${xToSvg(1) - 22},${yMid - 8} ${xToSvg(1) - 22},${yMid + 8}`}
              fill="#35527f"
              opacity={0.65}
            />
            <polygon
              points={`${xMid},${yToSvg(1) + 8} ${xMid - 8},${yToSvg(1) + 22} ${xMid + 8},${yToSvg(1) + 22}`}
              fill="#35527f"
              opacity={0.65}
            />
            <polygon
              points={`${xMid},${yToSvg(0) - 8} ${xMid - 8},${yToSvg(0) - 22} ${xMid + 8},${yToSvg(0) - 22}`}
              fill="#35527f"
              opacity={0.65}
            />

            {/* Axis labels (larger + bold, one per side) */}
            <text
              x={xToSvg(0) + 28}
              y={yMid - 20}
              fontSize={36}
              fontWeight={800}
              textAnchor="start"
              fill="#1f3253"
              opacity={0.92}
            >
              ← Reputation / legal
            </text>
            <text
              x={xToSvg(1) - 28}
              y={yMid - 20}
              fontSize={36}
              fontWeight={800}
              textAnchor="end"
              fill="#1f3253"
              opacity={0.92}
            >
              Programmatic controls →
            </text>
            <text
              x={xMid + 16}
              y={yToSvg(1) + 44}
              fontSize={36}
              fontWeight={800}
              textAnchor="start"
              fill="#1f3253"
              opacity={0.92}
            >
              Back-end infrastructure
            </text>
            <text
              x={xMid + 16}
              y={yToSvg(0) - 16}
              fontSize={36}
              fontWeight={800}
              textAnchor="start"
              fill="#1f3253"
              opacity={0.92}
            >
              User-facing distribution
            </text>

            {/* Points + labels */}
            {projects.map((p) => {
              const cx = xToSvg(p.x);
              const cy = yToSvg(p.y);
              const isActive = tooltip?.id === p.id;
              const size = isActive ? 36 : markerSize;
              const cluster = showClusters ? clusterByProject.get(p.id) : undefined;

              const lp = labelPlacements[p.id];
              const labelX = lp?.x ?? cx;
              const labelY = lp?.y ?? cy - 26;

              const labelText = p.label;
              const labelW = estimateTextWidth(labelText, fontSize);
              const labelH = fontSize * 1.25;
              const labelHalfW = labelW / 2 + 6;
              const labelHalfH = labelH / 2 + 4;

              const dx = labelX - cx;
              const dy = labelY - cy;
              const dist = Math.hypot(dx, dy);
              const leaderNeeded = dist > size * 1.05;
              const ux = dist > 0 ? dx / dist : 0;
              const uy = dist > 0 ? dy / dist : 0;
              const rayScaleX = ux !== 0 ? labelHalfW / Math.abs(ux) : Number.POSITIVE_INFINITY;
              const rayScaleY = uy !== 0 ? labelHalfH / Math.abs(uy) : Number.POSITIVE_INFINITY;
              const rayScale = Math.min(rayScaleX, rayScaleY);
              const leaderStartX = cx + ux * (size / 2 + 3);
              const leaderStartY = cy + uy * (size / 2 + 3);
              const leaderEndX = labelX - ux * rayScale;
              const leaderEndY = labelY - uy * rayScale;

              return (
                <g
                  key={p.id}
                  tabIndex={0}
                  role="button"
                  aria-label={p.label}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => showHover(p.id, cx, cy)}
                  onMouseLeave={() => hideHover()}
                  onFocus={() => showHover(p.id, cx, cy)}
                  onBlur={() => hideHover()}
                  onClick={() => togglePin(p.id, cx, cy)}
                >
                  {/* Big invisible hit target */}
                  <circle cx={cx} cy={cy} r={36} fill="transparent" />

                  {/* Highlight ring */}
                  {isActive ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2 + 10}
                      fill="none"
                      stroke="#35527f"
                      strokeOpacity={0.85}
                      strokeWidth={3}
                    />
                  ) : null}

                  {cluster ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2 + 5}
                      fill="none"
                      stroke={cluster.stroke}
                      strokeWidth={2.2}
                      strokeOpacity={0.9}
                    />
                  ) : null}

                  {p.potentialClient ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2 + 9}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth={2}
                    />
                  ) : null}

                  <Marker plane={p.plane} cx={cx} cy={cy} size={size} />

                  {leaderNeeded ? (
                    <line
                      x1={leaderStartX}
                      y1={leaderStartY}
                      x2={leaderEndX}
                      y2={leaderEndY}
                      stroke={cluster?.stroke ?? "#5576ab"}
                      strokeOpacity={0.9}
                      strokeWidth={2.3}
                      strokeDasharray="2 6"
                      strokeLinecap="round"
                    />
                  ) : null}

                  {/* Label background */}
                  <rect
                    x={labelX - labelW / 2 - 6}
                    y={labelY - labelH / 2 - 4}
                    width={labelW + 12}
                    height={labelH + 8}
                    rx={8}
                    fill="#f7fbff"
                    opacity={0.98}
                    stroke={cluster?.stroke ?? "#35527f"}
                    strokeWidth={cluster ? 1.8 : 1}
                    strokeOpacity={cluster ? 0.62 : 0.34}
                  />

                  {/* Label text */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fill="#102d55"
                    opacity={1}
                    style={{ fontWeight: 740, letterSpacing: "0.005em" }}
                    stroke="#ffffff"
                    strokeWidth={2.6}
                    paintOrder="stroke fill"
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}

          </svg>

          {clusterHoverRender ? (
            <>
              <svg
                className="clusterHoverGuide"
                viewBox={`0 0 ${clusterHoverRender.width} ${clusterHoverRender.height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="cluster-hover-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 0 0 L 8 4 L 0 8 z" fill={clusterHoverRender.stroke} />
                  </marker>
                </defs>
                <line
                  x1={clusterHoverRender.guide.x1}
                  y1={clusterHoverRender.guide.y1}
                  x2={clusterHoverRender.guide.x2}
                  y2={clusterHoverRender.guide.y2}
                  stroke={clusterHoverRender.stroke}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  strokeOpacity={0.95}
                  markerEnd="url(#cluster-hover-arrow)"
                />
              </svg>
              <div className="clusterHover" style={clusterHoverRender.bubbleStyle}>
                {clusterHover?.label}
              </div>
            </>
          ) : null}

          {/* Tooltip overlay */}
          <div
            ref={tooltipRef}
            className={`tooltip ${tooltip?.pinned ? "pinned" : ""}`}
            style={tooltipStyle}
            onMouseEnter={() => {
              tooltipHoverRef.current = true;
              clearHideTimer();
            }}
            onMouseLeave={() => {
              tooltipHoverRef.current = false;
              if (!tooltip?.pinned) hideHover();
            }}
          >
            {active ? (
              <>
                <div className="tooltipHeader">
                  <div className="tooltipTitle">
                    {active.href ? (
                      <a href={active.href} target="_blank" rel="noreferrer">
                        {active.label}
                      </a>
                    ) : (
                      active.label
                    )}
                  </div>

                  {tooltip?.pinned ? (
                    <button className="closeBtn" type="button" onClick={() => setTooltip(null)}>
                      Close
                    </button>
                  ) : (
                    <div className="pinHint">Click to pin</div>
                  )}
                </div>

                <div className="chips">
                  <span className="chip">
                    <MiniMarker plane={active.plane} /> {planeLabel(active.plane)}
                  </span>
                  <span className="chip">{active.stack}</span>
                  <span className="chip">{active.controlPrimitive}</span>
                  {active.infra?.privy === "Yes" ? <span className="chip">Uses Privy</span> : null}
                  {active.infra?.squads === "Yes" && active.id !== "altitude" ? (
                    <span className="chip">Uses Squads</span>
                  ) : null}
                  {active.potentialClient ? <span className="chip">Potential client</span> : null}
                </div>

                {active.scale?.length ? (
                  <div className="block">
                    <div className="label">Scale</div>
                    <ul className="list">
                      {active.scale.slice(0, 4).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="block">
                  <div className="label">Narrative</div>
                  <div className="text">{active.narrative}</div>
                </div>

                {active.creditModel ? (
                  <div className="block">
                    <div className="label">Credit / rails</div>
                    <div className="text">{active.creditModel}</div>
                  </div>
                ) : null}

                {active.why?.length ? (
                  <div className="block">
                    <div className="label">Why here</div>
                    <ul className="list">
                      {active.why.slice(0, 5).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {active.sources?.length ? (
                  <div className="block">
                    <div className="label">Primary links</div>
                    <ul className="list">
                      {active.sources.slice(0, 5).map((s, i) => (
                        <li key={i}>
                          <a href={s.url} target="_blank" rel="noreferrer">
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="legend">
          {showClusters ? (
            <div className="clusterKey">
              <div className="clusterKeyTitle">Visible cluster zones</div>
              <div className="clusterKeyRow">
                {clusterLegend.map((item) => (
                  <span
                    key={item.id}
                    className="clusterPill"
                    style={{
                      borderColor: item.stroke,
                      background: item.fill,
                    }}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="clusterKeyHint">
                Zones are drawn only when 2+ projects are close enough on the map. Dot/label outlines use cluster colors for exact inclusion.
              </div>
            </div>
          ) : null}
          <div className="legendHint">
            Hover a dot for details. Click a dot to pin tooltip (links clickable). Click outside or press Esc to close.
          </div>
        </div>
      </div>

      <style jsx>{`
        .wrap {
          width: 100%;
        }

        .card {
          background: #f7faff;
          color: #1f3253;
          border: 1px solid rgba(53, 82, 127, 0.28);
          border-radius: 16px;
          padding: 2px;
          box-shadow: 0 10px 30px rgba(31, 50, 83, 0.12);
        }

        .topBar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }
        .topLeft {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          min-width: 0;
        }
        .title {
          font-weight: 900;
          font-size: 16px;
        }
        .topRight {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        .clusterToggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(31, 50, 83, 0.85);
          border: 1px solid rgba(53, 82, 127, 0.24);
          border-radius: 10px;
          padding: 6px 10px;
          background: rgba(245, 250, 255, 0.95);
          box-shadow: 0 6px 14px rgba(31, 50, 83, 0.08);
          user-select: none;
        }
        .clusterToggle input {
          margin: 0;
        }
        .hint {
          font-size: 12px;
          color: rgba(31, 50, 83, 0.72);
          white-space: nowrap;
        }

        .chartWrap {
          position: relative;
        }

        .legendInline {
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid rgba(53, 82, 127, 0.24);
          border-radius: 10px;
          background: rgba(245, 250, 255, 0.95);
          padding: 8px 10px;
          font-size: 12px;
          box-shadow: 0 8px 20px rgba(31, 50, 83, 0.1);
        }

        .tooltip {
          position: absolute;
          z-index: 20;
          border: 1px solid rgba(53, 82, 127, 0.26);
          background: rgba(232, 241, 255, 0.98);
          border-radius: 14px;
          padding: 12px;
          box-shadow: 0 18px 50px rgba(31, 50, 83, 0.2);
          overflow: auto;
        }

        .clusterHover {
          position: absolute;
          z-index: 14;
          pointer-events: none;
          border: 1px solid rgba(53, 82, 127, 0.34);
          background: rgba(255, 255, 255, 0.98);
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 14px;
          font-weight: 800;
          color: #1f3253;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(31, 50, 83, 0.14);
        }

        .clusterHoverGuide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 13;
          pointer-events: none;
        }

        .tooltipHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }
        .tooltipTitle {
          font-weight: 900;
          font-size: 18px;
        }
        .tooltipTitle a {
          color: inherit;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 2px;
        }
        .pinHint {
          font-size: 13px;
          color: rgba(31, 50, 83, 0.72);
          white-space: nowrap;
        }
        .closeBtn {
          border: 1px solid rgba(53, 82, 127, 0.24);
          background: rgba(166, 189, 230, 0.28);
          border-radius: 10px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 13px;
          color: #1f3253;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(53, 82, 127, 0.24);
          background: rgba(166, 189, 230, 0.24);
          font-size: 14px;
          font-weight: 650;
        }

        .block {
          margin-top: 10px;
        }
        .label {
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(31, 50, 83, 0.66);
          margin-bottom: 4px;
        }
        .text {
          font-size: 16px;
          line-height: 1.35;
          color: rgba(31, 50, 83, 0.96);
        }
        .list {
          margin: 6px 0 0 18px;
          padding: 0;
          font-size: 15px;
          line-height: 1.35;
          color: rgba(31, 50, 83, 0.96);
        }
        .list li {
          margin: 4px 0;
        }
        .list a {
          color: inherit;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 2px;
        }

        .legend {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(53, 82, 127, 0.24);
        }
        .clusterKey {
          margin-bottom: 8px;
          padding: 8px 10px;
          border: 1px solid rgba(53, 82, 127, 0.24);
          border-radius: 10px;
          background: rgba(245, 250, 255, 0.88);
        }
        .clusterKeyTitle {
          font-size: 12px;
          font-weight: 800;
          color: rgba(31, 50, 83, 0.85);
          margin-bottom: 6px;
        }
        .clusterKeyRow {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .clusterKeyHint {
          margin-top: 6px;
          font-size: 11px;
          color: rgba(31, 50, 83, 0.7);
        }
        .clusterPill {
          display: inline-flex;
          align-items: center;
          padding: 4px 9px;
          border-radius: 999px;
          border: 2px solid transparent;
          font-size: 12px;
          font-weight: 800;
          color: #133b6e;
          line-height: 1.2;
        }
        .legendTitle {
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .legendItem {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .potentialRing {
          width: 12px;
          height: 12px;
          border: 2px solid #dc2626;
          border-radius: 999px;
          display: inline-block;
          box-sizing: border-box;
        }

        .legendHint {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(31, 50, 83, 0.72);
        }

        @media (max-width: 640px) {
          .topRight {
            align-items: flex-start;
          }
          .legendInline {
            align-self: stretch;
          }
          .hint {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
