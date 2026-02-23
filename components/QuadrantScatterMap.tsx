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
};

type Rect = { x1: number; y1: number; x2: number; y2: number };
type Point = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rectsOverlap(a: Rect, b: Rect) {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
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
}) {
  const c = centroid(args.members);
  const b = boundsForPoints(args.members);
  const diag = Math.hypot(b.maxX - b.minX, b.maxY - b.minY);

  // Deterministic, tighter envelope around member points (no random wobble).
  const sigmaMember = clamp(diag * 0.42 + 26, 34, 82);
  const sigmaForeign = sigmaMember * 0.72;
  const minR = clamp(sigmaMember * 0.42, 20, 46);
  const maxR = clamp(diag * 0.78 + sigmaMember * 0.72, 72, 220);
  const baseThreshold = clamp(0.52 - args.members.length * 0.028, 0.36, 0.5);
  const foreignClearance = sigmaMember * 0.62;

  const samples = 120;
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
      const lobe = proj + clamp(32 - perp * 0.96, 0, 32);
      memberRay = Math.max(memberRay, lobe);
    }

    let bestR = Math.max(minR, memberRay + 6);
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
      bestR = Math.max(bestR, memberRay + 3);
    }

    raw.push({
      x: clamp(c.x + Math.cos(t) * bestR * wobble, args.bounds.left, args.bounds.right),
      y: clamp(c.y + Math.sin(t) * bestR * wobble * ySkew, args.bounds.top, args.bounds.bottom),
    });
  }

  // Smoothing pass for cleaner fluid edges.
  let smooth = raw;
  for (let pass = 0; pass < 4; pass += 1) {
    smooth = smooth.map((p, i) => {
      const prev = smooth[(i - 1 + smooth.length) % smooth.length];
      const next = smooth[(i + 1) % smooth.length];
      return {
        x: prev.x * 0.22 + p.x * 0.56 + next.x * 0.22,
        y: prev.y * 0.22 + p.y * 0.56 + next.y * 0.22,
      };
    });
  }

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
  const gap = 10;

  const placed: Record<string, { x: number; y: number; rect: Rect }> = {};
  const taken: Rect[] = [];

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

    const yAbove = cy - markerSize / 2 - gap - labelH / 2;
    const yBelow = cy + markerSize / 2 + gap + labelH / 2;

    // Prefer top/bottom. Add small x jitters only if needed.
    const preferBelowFirst = p.y > 0.55; // top-half labels below reduces top-edge clipping
    const yFirst = preferBelowFirst ? yBelow : yAbove;
    const ySecond = preferBelowFirst ? yAbove : yBelow;

    const candidatesRaw: Array<{ x: number; y: number }> = [
      { x: cx, y: yFirst },
      { x: cx, y: ySecond },
      { x: cx - 18, y: yFirst },
      { x: cx + 18, y: yFirst },
      { x: cx - 18, y: ySecond },
      { x: cx + 18, y: ySecond },
    ];

    let chosen: { x: number; y: number; rect: Rect } | null = null;

    for (const c of candidatesRaw) {
      const { x, y } = inBounds(c.x, c.y);

      const rect: Rect = {
        x1: x - halfW - padX,
        y1: y - labelH / 2 - padY,
        x2: x + halfW + padX,
        y2: y + labelH / 2 + padY,
      };

      const overlaps = taken.some((t) => rectsOverlap(rect, t));
      if (!overlaps) {
        chosen = { x, y, rect };
        break;
      }

      if (!chosen) {
        // keep best-effort fallback as the first candidate (still clamped)
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
};

const CLUSTER_DEFS: ClusterDef[] = [
  {
    id: "entity_credit",
    label: "Revenue Credit",
    stroke: "#2f6fdf",
    fill: "#d6e5ff",
    dash: "0",
    connectivity: 0.45,
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
    label: "Issuer Infra",
    stroke: "#4668b8",
    fill: "#dde4ff",
    dash: "6 6",
    projectIds: ["rain"],
  },
  {
    id: "embedded_credit_rails",
    label: "Embedded Credit",
    stroke: "#6d57c4",
    fill: "#e5dcff",
    dash: "8 5",
    projectIds: ["yumi"],
  },
  {
    id: "agent_credit_spend",
    label: "Agent Finance",
    stroke: "#c55d93",
    fill: "#ffe0ef",
    dash: "10 6",
    connectivity: 0.46,
    projectIds: ["claw", "frames", "sponge"],
  },
  {
    id: "market_credit_debt",
    label: "Credit Markets",
    stroke: "#5f66a8",
    fill: "#dde2ff",
    dash: "4 5",
    connectivity: 0.68,
    projectIds: ["wildcat", "threejane", "xitadel"],
  },
  {
    id: "consumer_spend",
    label: "Consumer Spend",
    stroke: "#cd7d2f",
    fill: "#ffe6cf",
    dash: "12 6",
    connectivity: 0.42,
    projectIds: ["krak", "avici", "pyra", "kast", "offgrid"],
  },
  {
    id: "business_money",
    label: "Business Money",
    stroke: "#2f9471",
    fill: "#d6f4e7",
    dash: "2 4",
    connectivity: 0.55,
    projectIds: ["slash", "altitude"],
  },
  {
    id: "payments_rails",
    label: "Payments Rails",
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
    const card = containerRef.current;
    const svg = svgRef.current;
    if (!card || !svg) return { x: svgX, y: svgY };

    const cardRect = card.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const x = svgRect.left - cardRect.left + (svgX / width) * svgRect.width;
    const y = svgRect.top - cardRect.top + (svgY / height) * svgRect.height;
    return { x, y };
  };

  const getLocalFromClientPoint = (clientX: number, clientY: number) => {
    const card = containerRef.current;
    if (!card) return { x: clientX, y: clientY };
    const cardRect = card.getBoundingClientRect();
    return {
      x: clientX - cardRect.left,
      y: clientY - cardRect.top,
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

  const showClusterHover = (label: string, clientX: number, clientY: number) => {
    if (tooltip?.pinned) return;
    const { x, y } = getLocalFromClientPoint(clientX, clientY);
    setClusterHover({ label, x, y });
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

    const el = containerRef.current;
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

  const clusterHoverStyle: React.CSSProperties = useMemo(() => {
    if (!clusterHover || tooltip) return { display: "none" };

    const el = containerRef.current;
    const w = el?.clientWidth ?? 900;
    const h = el?.clientHeight ?? 600;

    const boxW = clamp(estimateTextWidth(clusterHover.label, 15) + 24, 130, 320);
    const boxH = 34;
    const gap = 12;
    const edge = 10;

    const x = clamp(clusterHover.x + gap, edge, w - boxW - edge);
    const y = clamp(clusterHover.y + gap, edge, h - boxH - edge);

    return {
      left: x,
      top: y,
      width: boxW,
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
    const edgeInset = 12;
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

        zones.push({
          id: `${def.id}-${groupIdx}`,
          stroke: def.stroke,
          fill: def.fill,
          dash: def.dash,
          path,
          label: groupIdx === 0 ? def.label : undefined,
          labelX:
            groupIdx === 0
              ? clamp((spread.minX + spread.maxX) / 2, plotLeft + 36, plotRight - 36)
              : undefined,
          labelY:
            groupIdx === 0
              ? clamp(spread.minY - 18, plotTop + 14, plotBottom - 14)
              : undefined,
        });
      }
    }

    return zones;
  }, [pad, plotW, plotH, projects, xToSvg, yToSvg]);

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

        <div className="chartWrap">
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
                      onMouseEnter={(e) => showClusterHover(hoverLabel, e.clientX, e.clientY)}
                      onMouseMove={(e) => moveClusterHover(e.clientX, e.clientY)}
                      onMouseLeave={hideClusterHover}
                      onFocus={(e) => {
                        const r = (e.currentTarget as SVGPathElement).getBoundingClientRect();
                        showClusterHover(hoverLabel, r.left + r.width / 2, r.top + r.height / 2);
                      }}
                      onBlur={hideClusterHover}
                      tabIndex={0}
                      aria-label={hoverLabel}
                    />
                    {zone.label && zone.labelX && zone.labelY ? (
                      <>
                        <rect
                          x={zone.labelX - estimateTextWidth(zone.label, 20) / 2 - 12}
                          y={zone.labelY - 16}
                          width={estimateTextWidth(zone.label, 20) + 24}
                          height={32}
                          rx={16}
                          fill="#ffffff"
                          opacity={0.99}
                          stroke={zone.stroke}
                          strokeOpacity={0.95}
                          strokeWidth={2.2}
                        />
                        <text
                          x={zone.labelX}
                          y={zone.labelY + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={20}
                          fontWeight={900}
                          fill="#1a2f52"
                        >
                          {zone.label}
                        </text>
                      </>
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
                    style={{ fontWeight: 780 }}
                    stroke="#ffffff"
                    strokeWidth={3.4}
                    paintOrder="stroke fill"
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}

          </svg>

          <div className="clusterHover" style={clusterHoverStyle}>
            {clusterHover?.label}
          </div>

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
