"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { highlightFirmNames } from "./highlightFirmNames";
import { PROJECTS, type ExecutionPlane, type ProjectInfo } from "./quadrantMapData";

type QuadrantPreset = "broad" | "revenue_receivables_zoom";

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
    // Equilateral triangle inscribed in the same outer-radius model used by markerOuterRadius.
    // This keeps ring overlays aligned with triangle tips even at large scaled sizes.
    const r = (s * Math.SQRT2) / 2;
    const halfBase = (Math.sqrt(3) / 2) * r;
    const points = [
      `${props.cx},${props.cy - r}`,
      `${props.cx - halfBase},${props.cy + r / 2}`,
      `${props.cx + halfBase},${props.cy + r / 2}`,
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
    const cx = 6;
    const cy = 6;
    const r = 5;
    const halfBase = (Math.sqrt(3) / 2) * r;
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <polygon
          points={`${cx},${cy - r} ${cx - halfBase},${cy + r / 2} ${cx + halfBase},${cy + r / 2}`}
          fill={c}
        />
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

function markerOuterRadius(plane: ExecutionPlane, size: number) {
  if (plane === "web3") return size / 2;
  // Square and triangle markers extend to corners beyond size/2.
  return (size * Math.SQRT2) / 2;
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
  oneLiner?: string;
  underwritingLine?: string;
  clientExamples?: string[];
};

type Rect = { x1: number; y1: number; x2: number; y2: number };
type Point = { x: number; y: number };
type LabelBox = {
  id: string;
  x: number;
  y: number;
  halfW: number;
  halfH: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  anchorX: number;
  anchorY: number;
  fixed?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rectsOverlap(a: Rect, b: Rect) {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

function rectFromCenter(x: number, y: number, halfW: number, halfH: number): Rect {
  return {
    x1: x - halfW,
    y1: y - halfH,
    x2: x + halfW,
    y2: y + halfH,
  };
}

function expandRect(r: Rect, gap: number): Rect {
  return {
    x1: r.x1 - gap,
    y1: r.y1 - gap,
    x2: r.x2 + gap,
    y2: r.y2 + gap,
  };
}

function rectCenter(r: Rect): Point {
  return {
    x: (r.x1 + r.x2) / 2,
    y: (r.y1 + r.y2) / 2,
  };
}

function overlapArea(a: Rect, b: Rect) {
  const ix = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1));
  const iy = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
  return ix * iy;
}

function labelEdgePointTowardAnchor(
  labelX: number,
  labelY: number,
  halfW: number,
  halfH: number,
  anchorX: number,
  anchorY: number,
) {
  const dx = labelX - anchorX;
  const dy = labelY - anchorY;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) {
    return { x: labelX, y: labelY };
  }

  const ux = dx / dist;
  const uy = dy / dist;
  const rayScaleX = ux !== 0 ? halfW / Math.abs(ux) : Number.POSITIVE_INFINITY;
  const rayScaleY = uy !== 0 ? halfH / Math.abs(uy) : Number.POSITIVE_INFINITY;
  const rayScale = Math.min(rayScaleX, rayScaleY);

  return {
    x: labelX - ux * rayScale,
    y: labelY - uy * rayScale,
  };
}

function relaxLabelBoxes(args: {
  labels: LabelBox[];
  obstacles?: Rect[];
  iterations?: number;
  pairGap?: number;
  obstacleGap?: number;
  anchorPull?: number;
  damping?: number;
  maxStep?: number;
}) {
  const {
    labels,
    obstacles = [],
    iterations = 110,
    pairGap = 7,
    obstacleGap = 6,
    anchorPull = 0.12,
    damping = 0.88,
    maxStep = 14,
  } = args;

  const states = labels.map((l) => ({
    ...l,
    vx: 0,
    vy: 0,
  }));

  if (!states.length) return [] as Array<{ id: string; x: number; y: number; rect: Rect }>;

  for (let iter = 0; iter < iterations; iter += 1) {
    const fx = new Array(states.length).fill(0);
    const fy = new Array(states.length).fill(0);

    for (let i = 0; i < states.length; i += 1) {
      if (states[i].fixed) continue;
      fx[i] += (states[i].anchorX - states[i].x) * anchorPull;
      fy[i] += (states[i].anchorY - states[i].y) * anchorPull;
    }

    for (let i = 0; i < states.length; i += 1) {
      for (let j = i + 1; j < states.length; j += 1) {
        const a = states[i];
        const b = states[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const overlapX = a.halfW + b.halfW + pairGap - Math.abs(dx);
        const overlapY = a.halfH + b.halfH + pairGap - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;

        const axisX = overlapX < overlapY;
        if (axisX) {
          const sign = dx === 0 ? (a.id > b.id ? 1 : -1) : Math.sign(dx);
          const push = overlapX * 0.52;
          if (!a.fixed) fx[i] += sign * push;
          if (!b.fixed) fx[j] -= sign * push;
        } else {
          const sign = dy === 0 ? (a.id > b.id ? 1 : -1) : Math.sign(dy);
          const push = overlapY * 0.52;
          if (!a.fixed) fy[i] += sign * push;
          if (!b.fixed) fy[j] -= sign * push;
        }
      }
    }

    for (let i = 0; i < states.length; i += 1) {
      if (states[i].fixed) continue;
      const s = states[i];
      const sr = rectFromCenter(s.x, s.y, s.halfW, s.halfH);
      for (const obstacle of obstacles) {
        const expanded = expandRect(obstacle, obstacleGap);
        if (!rectsOverlap(sr, expanded)) continue;
        const oc = rectCenter(expanded);
        const dx = s.x - oc.x;
        const dy = s.y - oc.y;
        const obstacleHalfW = (expanded.x2 - expanded.x1) / 2;
        const obstacleHalfH = (expanded.y2 - expanded.y1) / 2;
        const overlapX = s.halfW + obstacleHalfW - Math.abs(dx);
        const overlapY = s.halfH + obstacleHalfH - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;

        if (overlapX < overlapY) {
          const sign = dx === 0 ? Math.sign(s.x - s.anchorX) || 1 : Math.sign(dx);
          fx[i] += sign * overlapX * 0.62;
        } else {
          const sign = dy === 0 ? Math.sign(s.y - s.anchorY) || 1 : Math.sign(dy);
          fy[i] += sign * overlapY * 0.62;
        }
      }
    }

    for (let i = 0; i < states.length; i += 1) {
      const s = states[i];
      if (s.fixed) {
        s.vx = 0;
        s.vy = 0;
        s.x = clamp(s.x, s.minX, s.maxX);
        s.y = clamp(s.y, s.minY, s.maxY);
        continue;
      }

      s.vx = (s.vx + fx[i]) * damping;
      s.vy = (s.vy + fy[i]) * damping;
      s.vx = clamp(s.vx, -maxStep, maxStep);
      s.vy = clamp(s.vy, -maxStep, maxStep);
      s.x = clamp(s.x + s.vx, s.minX, s.maxX);
      s.y = clamp(s.y + s.vy, s.minY, s.maxY);
    }
  }

  return states.map((s) => ({
    id: s.id,
    x: s.x,
    y: s.y,
    rect: rectFromCenter(s.x, s.y, s.halfW, s.halfH),
  }));
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

function formatUsdBn(bn: number) {
  if (bn >= 100) return `$${bn.toFixed(0)}b`;
  if (bn >= 10) return `$${bn.toFixed(1)}b`;
  return `$${bn.toFixed(2)}b`;
}

function isGenericClientPlaceholder(text: string) {
  const v = text.toLowerCase();
  return (
    v.includes("no public named") ||
    v.includes("not disclosed") ||
    v.includes("not listed") ||
    v.includes("eligible markets") ||
    v.includes("additional dtc/ecommerce brands")
  );
}

type LabelMetrics = {
  fontSize: number;
  padX: number;
  padY: number;
  textWidth: number;
  pillW: number;
  pillH: number;
  textLength?: number;
};

function adaptiveLabelMetrics(args: {
  text: string;
  baseFont: number;
  minFont: number;
  maxPillWidth: number;
  basePadX: number;
  minPadX: number;
  padY: number;
}): LabelMetrics {
  const len = Math.max(1, args.text.length);
  const lengthFactor = clamp((len - 10) / 20, 0, 1);
  const padX = clamp(
    args.basePadX - lengthFactor * (args.basePadX - args.minPadX),
    args.minPadX,
    args.basePadX,
  );
  const capFont = (args.maxPillWidth - padX * 2) / (len * 0.62);
  const fontSize = clamp(Math.min(args.baseFont, capFont), args.minFont, args.baseFont);
  const textWidth = estimateTextWidth(args.text, fontSize);
  const rawPillW = textWidth + padX * 2;
  const pillW = Math.min(args.maxPillWidth, rawPillW);
  const pillH = fontSize * 1.25 + args.padY * 2;

  return {
    fontSize,
    padX,
    padY: args.padY,
    textWidth,
    pillW,
    pillH,
    textLength: rawPillW > args.maxPillWidth ? Math.max(24, pillW - padX * 2) : undefined,
  };
}

function projectLabelMetrics(text: string, baseFont: number) {
  return adaptiveLabelMetrics({
    text,
    baseFont,
    minFont: 21,
    maxPillWidth: 320,
    basePadX: 6,
    minPadX: 2,
    padY: 3,
  });
}

function projectLabelMetricsForProject(project: ProjectInfo, baseFont: number, labelText?: string) {
  const text = labelText ?? project.label;
  if (project.id === "attn") {
    return {
      fontSize: 20,
      padX: 8,
      padY: 4,
      textWidth: 78,
      pillW: 112,
      pillH: 38,
    };
  }

  if (project.id === "creditcoop") {
    return adaptiveLabelMetrics({
      text,
      baseFont: Math.min(baseFont, 35),
      minFont: 21,
      maxPillWidth: 250,
      basePadX: 5,
      minPadX: 2,
      padY: 3,
    });
  }

  if (project.id === "stripe_capital") {
    return adaptiveLabelMetrics({
      text,
      baseFont: Math.min(baseFont, 32),
      minFont: 21,
      maxPillWidth: 228,
      basePadX: 4,
      minPadX: 2,
      padY: 3,
    });
  }

  return projectLabelMetrics(text, baseFont);
}

function clusterLabelMetrics(text: string, baseFont: number) {
  const len = Math.max(1, text.length);
  const shrink = clamp((len - 18) / 18, 0, 1);
  const fontSize = clamp(baseFont - shrink * 8, 20, baseFont);
  const padX = clamp(8 - shrink * 5, 3, 8);
  const padY = 4;
  const textWidth = estimateTextWidth(text, fontSize);
  const pillW = textWidth + padX * 2;
  const pillH = fontSize * 1.25 + padY * 2;

  return {
    fontSize,
    padX,
    padY,
    textWidth,
    pillW,
    pillH,
  };
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
  minForeignClearance?: number;
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
  const foreignClearance = Math.max(sigmaMember * 0.4, args.minForeignClearance ?? 0);

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

function hasBoundaryGapConflict(boundary: Point[], obstacles: Point[], minGap: number) {
  if (!boundary.length || !obstacles.length || minGap <= 0) return false;
  const minGapSq = minGap * minGap;

  for (const p of boundary) {
    for (const o of obstacles) {
      const dx = p.x - o.x;
      const dy = p.y - o.y;
      if (dx * dx + dy * dy < minGapSq) return true;
    }
  }

  return false;
}

function contractBoundaryTowardCenter(
  boundary: Point[],
  center: Point,
  factor: number,
  bounds: { left: number; right: number; top: number; bottom: number },
) {
  return boundary.map((p) => ({
    x: clamp(center.x + (p.x - center.x) * factor, bounds.left, bounds.right),
    y: clamp(center.y + (p.y - center.y) * factor, bounds.top, bounds.bottom),
  }));
}

function connectedPointComponents<T extends Point>(points: T[], threshold: number) {
  const components: T[][] = [];
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
  markerSizeForProject?: (projectId: string) => number;
  labelTextForProject?: (project: ProjectInfo) => string;
  applyHardLabelLocks?: boolean;
}) {
  const {
    projects,
    xToSvg,
    yToSvg,
    pad,
    plotW,
    plotH,
    fontSize,
    markerSize,
    markerSizeForProject,
    labelTextForProject,
    applyHardLabelLocks = true,
  } = args;

  const placed: Record<string, { x: number; y: number; rect: Rect }> = {};
  const markerObstacles = new Map(
    projects.map((p) => {
      const cx = xToSvg(p.x);
      const cy = yToSvg(p.y);
      const size = markerSizeForProject?.(p.id) ?? markerSize;
      const radius = markerOuterRadius(p.plane, size) + 7;
      return [
        p.id,
        {
          x1: cx - radius,
          y1: cy - radius,
          x2: cx + radius,
          y2: cy + radius,
        } satisfies Rect,
      ];
    }),
  );
  const markerObstacleEntries = Array.from(markerObstacles.entries());
  const allMarkerObstacles = Array.from(markerObstacles.values());
  const takenRects: Rect[] = [];
  const initialLabelBoxes: LabelBox[] = [];

  const ordered = [...projects].sort((a, b) => {
    // Place higher and denser points first to improve candidate quality in greedy seeding.
    if (Math.abs(b.y - a.y) > 0.02) return b.y - a.y;
    return a.x - b.x;
  });

  const plotCenterX = pad + plotW / 2;
  const plotCenterY = pad + plotH / 2;

  for (const p of ordered) {
    const cx = xToSvg(p.x);
    const cy = yToSvg(p.y);
    const markerForProject = markerSizeForProject?.(p.id) ?? markerSize;
    const labelText = labelTextForProject?.(p) ?? p.label;
    const metrics = projectLabelMetricsForProject(p, fontSize, labelText);
    const halfW = metrics.pillW / 2;
    const halfH = metrics.pillH / 2;
    const minX = pad + halfW + 6;
    const maxX = pad + plotW - halfW - 6;
    const minY = pad + halfH + 6;
    const maxY = pad + plotH - halfH - 6;
    const inBounds = (x: number, y: number) => ({
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY),
    });

    const neighbors = projects
      .filter((q) => q.id !== p.id)
      .map((q) => ({ q, x: xToSvg(q.x), y: yToSvg(q.y) }))
      .map((q) => ({ ...q, d: Math.hypot(q.x - cx, q.y - cy) }))
      .filter((q) => q.d <= 320);

    let vx = 0;
    let vy = 0;
    for (const n of neighbors) {
      const w = 1 / (n.d + 24);
      vx += (n.x - cx) * w;
      vy += (n.y - cy) * w;
    }

    const fallbackAngle = Math.atan2(cy - plotCenterY, cx - plotCenterX);
    const preferredAngle =
      Math.hypot(vx, vy) > 0.001 ? normalizeAngle(Math.atan2(-vy, -vx)) : fallbackAngle;

    const crowdBoost = clamp((neighbors.length - 2) * 4, 0, 30);
    const broadSpacingBoost = applyHardLabelLocks ? 16 : 0;
    const baseGap = markerForProject / 2 + halfH + 10 + broadSpacingBoost + crowdBoost * 0.45;
    const radialOffsets = applyHardLabelLocks
      ? [baseGap, baseGap + 40, baseGap + 84, baseGap + 130, baseGap + 178]
      : [baseGap, baseGap + 24, baseGap + 52, baseGap + 84, baseGap + 118];
    const angleOffsetsDeg = [0, -18, 18, -36, 36, -54, 54, -78, 78, 180, 120, -120, 90, -90];
    const candidatesRaw: Array<{ x: number; y: number; angle: number }> = [];

    for (const r of radialOffsets) {
      for (const deg of angleOffsetsDeg) {
        const a = preferredAngle + (deg * Math.PI) / 180;
        candidatesRaw.push({
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          angle: a,
        });
      }
    }

    const sideGap = markerForProject / 2 + halfW + 18 + (applyHardLabelLocks ? 12 : 0);
    const sideJitter = [0, -16, 16, -34, 34, -54, 54];
    for (const j of sideJitter) {
      candidatesRaw.push({ x: cx + sideGap, y: cy + j, angle: 0 });
      candidatesRaw.push({ x: cx - sideGap, y: cy + j, angle: Math.PI });
    }

    let chosen: { x: number; y: number; rect: Rect } | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let i = 0; i < candidatesRaw.length; i += 1) {
      const c = candidatesRaw[i];
      const bounded = inBounds(c.x, c.y);
      const rect = rectFromCenter(bounded.x, bounded.y, halfW, halfH);

      let overlapCount = 0;
      let overlapPx = 0;
      for (const t of takenRects) {
        if (!rectsOverlap(rect, t)) continue;
        overlapCount += 1;
        overlapPx += overlapArea(rect, t);
      }

      for (const [otherId, obstacle] of markerObstacleEntries) {
        if (otherId === p.id) continue;
        const expanded = expandRect(obstacle, 4);
        if (!rectsOverlap(rect, expanded)) continue;
        overlapCount += 1;
        overlapPx += overlapArea(rect, expanded) * 0.85;
      }

      const dist = Math.hypot(bounded.x - cx, bounded.y - cy);
      const clampPenalty = Math.abs(c.x - bounded.x) + Math.abs(c.y - bounded.y);
      const anglePenalty = angleDistance(Math.atan2(bounded.y - cy, bounded.x - cx), preferredAngle) * 58;
      const preferencePenalty = i * 3.8;
      const score =
        overlapCount * 900000 +
        overlapPx * 64 +
        dist * 1.15 +
        clampPenalty * 2.8 +
        anglePenalty +
        preferencePenalty;

      if (score < bestScore) {
        bestScore = score;
        chosen = {
          x: bounded.x,
          y: bounded.y,
          rect,
        };
      }
    }

    if (!chosen) continue;

    takenRects.push(expandRect(chosen.rect, 5));
    initialLabelBoxes.push({
      id: p.id,
      x: chosen.x,
      y: chosen.y,
      halfW,
      halfH,
      minX,
      maxX,
      minY,
      maxY,
      // Anchor to the chosen candidate to preserve label intent while still permitting repulsion.
      anchorX: chosen.x,
      anchorY: chosen.y,
    });
  }

  const relaxed = relaxLabelBoxes({
    labels: initialLabelBoxes,
    obstacles: allMarkerObstacles,
    iterations: applyHardLabelLocks ? 180 : 120,
    pairGap: applyHardLabelLocks ? 15 : 7,
    obstacleGap: applyHardLabelLocks ? 12 : 7,
    anchorPull: applyHardLabelLocks ? 0.1 : 0.11,
    damping: 0.87,
    maxStep: applyHardLabelLocks ? 16 : 15,
  });

  for (const p of relaxed) {
    placed[p.id] = { x: p.x, y: p.y, rect: p.rect };
  }

  return placed;
}

type ClusterDef = {
  id: string;
  label: string;
  oneLiner?: string;
  stroke: string;
  fill: string;
  dash: string;
  projectIds: string[];
  connectivity?: number;
  labelPlacement?: "top" | "top-left" | "bottom-right" | "mid-right" | "mid-left" | "auto";
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
  labelFontSize?: number;
  labelPillWidth?: number;
  labelPillHeight?: number;
  labelTextLength?: number;
  labelAnchorX?: number;
  labelAnchorY?: number;
  bounds?: { minX: number; maxX: number; minY: number; maxY: number };
  labelPlacement?: "top" | "top-left" | "bottom-right" | "mid-right" | "mid-left" | "auto";
  labelDistanceMultiplier?: number;
  boundaryPoints?: Point[];
};

const BROAD_CLUSTER_DEFS: ClusterDef[] = [
  {
    id: "entity_credit",
    label: "Revenue & Receivables Credit",
    oneLiner: "Revenue-linked business financing repaid from routed sales or receivables.",
    stroke: "#2f6fdf",
    fill: "#d6e5ff",
    dash: "10 8",
    connectivity: 0.45,
    labelPlacement: "bottom-right",
    projectIds: [
      "attn",
      "creditcoop",
      "youlend",
      "parafin",
      "liberis",
      "pipe",
      "clearco",
      "wayflyer",
      "uncapped",
      "paypal_working_capital",
      "shopify_capital",
      "stripe_capital",
      "square_loans",
    ],
  },
  {
    id: "provider_of_providers",
    label: "Provider-of-Providers Infra",
    oneLiner: "Issuer/settlement infrastructure powering downstream credit and spend products.",
    stroke: "#4668b8",
    fill: "#dde4ff",
    dash: "6 6",
    projectIds: ["rain"],
  },
  {
    id: "embedded_credit_rails",
    label: "Embedded Credit Rails",
    oneLiner: "Credit-enablement rails embedded into third-party operating flows.",
    stroke: "#6d57c4",
    fill: "#e5dcff",
    dash: "8 5",
    projectIds: [],
  },
  {
    id: "agent_credit_spend",
    label: "Agent Credit + Spend",
    oneLiner: "Agent-focused spend/control surfaces that can consume a credit back end.",
    stroke: "#c55d93",
    fill: "#ffe0ef",
    dash: "10 6",
    connectivity: 0.46,
    labelDistanceMultiplier: 1.9,
    projectIds: ["frames", "sponge"],
  },
  {
    id: "market_credit_debt",
    label: "Reputation-based credit",
    oneLiner: "Credit models leaning on market/reputation signals over hard cashflow capture.",
    stroke: "#5f66a8",
    fill: "#dde2ff",
    dash: "4 5",
    connectivity: 0.68,
    projectIds: ["wildcat", "threejane", "claw", "yumi"],
  },
  {
    id: "consumer_spend",
    label: "Consumer Spend Apps",
    oneLiner: "Consumer-facing spend/distribution apps with card-like UX and rails.",
    stroke: "#cd7d2f",
    fill: "#ffe6cf",
    dash: "12 6",
    connectivity: 0.42,
    labelPlacement: "mid-right",
    labelDistanceMultiplier: 1.08,
    projectIds: ["krak", "avici", "pyra", "kast", "offgrid"],
  },
  {
    id: "business_money",
    label: "Business Treasury Stack",
    oneLiner: "Business treasury/spend stacks for operator cash management and payouts.",
    stroke: "#2f9471",
    fill: "#d6f4e7",
    dash: "2 4",
    connectivity: 0.55,
    labelPlacement: "mid-left",
    labelDistanceMultiplier: 1.2,
    projectIds: ["slash", "altitude"],
  },
  {
    id: "solana_merchant_payments",
    label: "Solana Merchant Payments",
    oneLiner: "Merchant stablecoin processing stacks bridging web2 operators to onchain settlement.",
    stroke: "#249188",
    fill: "#d7f4f2",
    dash: "9 6",
    connectivity: 0.58,
    projectIds: ["decal", "moonpay_commerce", "depay", "loop_crypto", "spherepay"],
  },
  {
    id: "payments_rails",
    label: "B2B2C BNPL + Payments Rails",
    oneLiner: "Merchant-integrated consumer financing and payments-rails narratives.",
    stroke: "#a150ac",
    fill: "#f1ddf4",
    dash: "14 7",
    projectIds: ["klarna_tempo", "affirm", "colossus"],
  },
  {
    id: "adjacent",
    label: "Adjacent",
    oneLiner: "Related infrastructure not primarily operating as credit originators.",
    stroke: "#6f7f99",
    fill: "#e4e9f1",
    dash: "5 7",
    projectIds: ["pye"],
  },
];

const REVENUE_RECEIVABLES_PROJECT_IDS = [
  "attn",
  "creditcoop",
  "youlend",
  "parafin",
  "liberis",
  "pipe",
  "clearco",
  "wayflyer",
  "uncapped",
  "paypal_working_capital",
  "shopify_capital",
  "stripe_capital",
  "square_loans",
  "decal",
  "moonpay_commerce",
  "depay",
  "loop_crypto",
  "spherepay",
] as const;

const REVENUE_RECEIVABLES_ZOOM_COORDS: Record<
  (typeof REVENUE_RECEIVABLES_PROJECT_IDS)[number],
  { x: number; y: number }
> = {
  attn: { x: 0.94, y: 0.9 },
  creditcoop: { x: 0.86, y: 0.9 },
  youlend: { x: 0.57, y: 0.78 },
  parafin: { x: 0.66, y: 0.84 },
  liberis: { x: 0.62, y: 0.75 },
  stripe_capital: { x: 0.57, y: 0.59 },
  square_loans: { x: 0.63, y: 0.58 },
  shopify_capital: { x: 0.5, y: 0.64 },
  paypal_working_capital: { x: 0.54, y: 0.5 },
  wayflyer: { x: 0.31, y: 0.37 },
  pipe: { x: 0.28, y: 0.32 },
  clearco: { x: 0.2, y: 0.24 },
  uncapped: { x: 0.14, y: 0.16 },
  decal: { x: 0.9, y: 0.69 },
  moonpay_commerce: { x: 0.84, y: 0.7 },
  depay: { x: 0.8, y: 0.62 },
  loop_crypto: { x: 0.86, y: 0.77 },
  spherepay: { x: 0.93, y: 0.77 },
};

const REVENUE_RECEIVABLES_CLUSTER_DEFS: ClusterDef[] = [
  {
    id: "platform_captive_capital",
    label: "Platform-Native B2SMB",
    oneLiner: "Merchant financing distributed natively inside one platform ecosystem.",
    stroke: "#2f9471",
    fill: "#d6f4e7",
    dash: "8 5",
    connectivity: 0.58,
    labelPlacement: "top-left",
    projectIds: ["paypal_working_capital", "shopify_capital", "stripe_capital", "square_loans"],
  },
  {
    id: "partner_embedded_b2b2smb",
    label: "Partner-Embedded B2B2SMB",
    oneLiner: "Financing infrastructure distributed through partner platforms to SMBs.",
    stroke: "#c55d93",
    fill: "#ffe0ef",
    dash: "8 6",
    connectivity: 0.82,
    projectIds: ["youlend", "parafin", "liberis"],
  },
  {
    id: "direct_b2smb_originators",
    label: "Direct B2SMB Originators",
    oneLiner: "Direct SMB originators underwriting without a captive distribution platform.",
    stroke: "#9f67d5",
    fill: "#f0e4ff",
    dash: "8 6",
    connectivity: 0.72,
    projectIds: ["pipe", "clearco", "wayflyer", "uncapped"],
  },
  {
    id: "solana_merchant_processing",
    label: "Solana Merchant Processing",
    oneLiner: "Onchain merchant payment processors for web2/web3 checkout and settlement.",
    stroke: "#249188",
    fill: "#d7f4f2",
    dash: "8 6",
    connectivity: 0.7,
    projectIds: ["decal", "moonpay_commerce", "depay", "loop_crypto", "spherepay"],
  },
];

type PresetConfig = {
  title: string;
  hint: string;
  taxonomyHint?: string;
  ariaLabel: string;
  axisTopTitle: string;
  axisBottomTitle: string;
  leftAxisText: string;
  rightAxisText: string;
  axisSideLabelFontSize: number;
  axisSideLabelYOffset: number;
  labelFontSize: number;
  markerSize: number;
  applyHardLabelLocks: boolean;
  allowSingletonClusterZones: boolean;
  splitDisconnectedClusterZones: boolean;
  clusterZonePadding: number;
  clusterFillOpacity: number;
  clusterStrokeOpacity: number;
  clusterStrokeWidth: number;
  projects: ProjectInfo[];
  clusterDefs: ClusterDef[];
  defaultShowClusters: boolean;
};

function getPresetConfig(preset: QuadrantPreset, asOf: string): PresetConfig {
  if (preset === "revenue_receivables_zoom") {
    const projects = REVENUE_RECEIVABLES_PROJECT_IDS.map((id) => {
      const base = PROJECTS[id];
      const remap = REVENUE_RECEIVABLES_ZOOM_COORDS[id];
      return {
        ...base,
        x: remap.x,
        y: remap.y,
      };
    });

    return {
      title: `Revenue & Receivables Credit Map — as of ${asOf}`,
      hint: `Focused lane view: repayment enforceability vs servicing intelligence, including Solana merchant-processing comparators. Showing ${projects.length} projects.`,
      taxonomyHint:
        "Lens: Borrower type (business vs consumer) + distribution model (platform-native vs partner-embedded). Dot size is normalized to best-public credit-volume signals; n/a means undisclosed.",
      ariaLabel: `Revenue and receivables credit map (as of ${asOf})`,
      axisTopTitle: "Continuous servicing intelligence",
      axisBottomTitle: "Static/periodic servicing",
      leftAxisText: "← Contractual/manual enforcement",
      rightAxisText: "Flow-captured + programmable enforcement →",
      axisSideLabelFontSize: 30,
      axisSideLabelYOffset: -18,
      labelFontSize: 24,
      markerSize: 28,
      applyHardLabelLocks: false,
      allowSingletonClusterZones: true,
      splitDisconnectedClusterZones: false,
      clusterZonePadding: 22,
      clusterFillOpacity: 0.28,
      clusterStrokeOpacity: 0.98,
      clusterStrokeWidth: 3.4,
      projects,
      clusterDefs: REVENUE_RECEIVABLES_CLUSTER_DEFS,
      defaultShowClusters: true,
    };
  }

  return {
    title: `Strategic Credit, Spend & Settlement Map — as of ${asOf}`,
    hint: `Hover for details. Click a dot to pin. Esc clears. Showing ${
      Object.values(PROJECTS).filter((p) => p.id !== "xitadel").length
    } projects.`,
    ariaLabel: `Embedded credit control landscape (as of ${asOf})`,
    axisTopTitle: "Back-end infrastructure",
    axisBottomTitle: "User-facing distribution",
    leftAxisText: "← Reputation / legal",
    rightAxisText: "Programmatic controls →",
    axisSideLabelFontSize: 46,
    axisSideLabelYOffset: -26,
    labelFontSize: 24,
    markerSize: 34,
    applyHardLabelLocks: true,
    allowSingletonClusterZones: false,
    splitDisconnectedClusterZones: true,
    clusterZonePadding: 10,
    clusterFillOpacity: 0.18,
    clusterStrokeOpacity: 0.92,
    clusterStrokeWidth: 2.6,
    projects: Object.values(PROJECTS).filter((p) => p.id !== "xitadel"),
    clusterDefs: BROAD_CLUSTER_DEFS,
    defaultShowClusters: true,
  };
}

export default function QuadrantScatterMap(props: {
  asOf?: string;
  maxWidth?: number; // embedded sizing control
  preset?: QuadrantPreset;
}) {
  const asOf = props.asOf ?? "2026-02-21";
  const maxWidth = props.maxWidth ?? 2200;
  const preset = props.preset ?? "broad";
  const config = useMemo(() => getPresetConfig(preset, asOf), [preset, asOf]);

  const projects = useMemo(() => config.projects, [config.projects]);
  const clusterDefs = useMemo(() => config.clusterDefs, [config.clusterDefs]);
  const projectsById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastTooltipIdRef = useRef<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const tooltipHoverRef = useRef(false);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [clusterHover, setClusterHover] = useState<ClusterHoverState | null>(null);
  const [showClusters, setShowClusters] = useState(config.defaultShowClusters);
  const [view, setView] = useState({ zoom: 1, panX: 0, panY: 0 });

  useEffect(() => {
    setShowClusters(config.defaultShowClusters);
  }, [config.defaultShowClusters]);

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
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 2.6;

  const clampPan = (zoom: number, panX: number, panY: number) => {
    const minPanX = width - width * zoom;
    const minPanY = height - height * zoom;
    return {
      panX: clamp(panX, minPanX, 0),
      panY: clamp(panY, minPanY, 0),
    };
  };

  const clientToSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: width / 2, y: height / 2 };
    const svgRect = svg.getBoundingClientRect();
    return {
      x: ((clientX - svgRect.left) / svgRect.width) * width,
      y: ((clientY - svgRect.top) / svgRect.height) * height,
    };
  };

  const zoomAt = (clientX: number, clientY: number, factor: number) => {
    setView((prev) => {
      const focus = clientToSvgPoint(clientX, clientY);
      const nextZoom = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const worldX = (focus.x - prev.panX) / prev.zoom;
      const worldY = (focus.y - prev.panY) / prev.zoom;
      const nextPanX = focus.x - worldX * nextZoom;
      const nextPanY = focus.y - worldY * nextZoom;
      const clamped = clampPan(nextZoom, nextPanX, nextPanY);
      return { zoom: nextZoom, panX: clamped.panX, panY: clamped.panY };
    });
  };

  const zoomAtCenter = (factor: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  };

  const resetZoom = () => {
    setView({ zoom: 1, panX: 0, panY: 0 });
  };

  const onChartWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Use ctrl/cmd + wheel (or pinch) for diagram zoom; regular wheel keeps page scroll.
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    zoomAt(e.clientX, e.clientY, factor);
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

  const showHover = (id: string, clientX: number, clientY: number) => {
    clearHideTimer();
    setClusterHover(null);
    setTooltip((prev) => {
      if (prev?.pinned) return prev;
      const { x, y } = getLocalFromClientPoint(clientX, clientY);
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

  const togglePin = (id: string, clientX: number, clientY: number) => {
    clearHideTimer();
    setClusterHover(null);
    const { x, y } = getLocalFromClientPoint(clientX, clientY);
    setTooltip((prev) => {
      if (prev?.pinned && prev.id === id) return null;
      return { id, x, y, pinned: true };
    });
  };

  const showClusterHover = (
    meta: {
      label: string;
      stroke: string;
      oneLiner?: string;
      underwritingLine?: string;
      clientExamples?: string[];
    },
    clientX: number,
    clientY: number,
  ) => {
    if (tooltip?.pinned) return;
    const { x, y } = getLocalFromClientPoint(clientX, clientY);
    setClusterHover({
      label: meta.label,
      x,
      y,
      stroke: meta.stroke,
      oneLiner: meta.oneLiner,
      underwritingLine: meta.underwritingLine,
      clientExamples: meta.clientExamples,
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

  const active = tooltip ? (projectsById.get(tooltip.id) ?? null) : null;

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

    const clientExamples = clusterHover.clientExamples?.slice(0, 4) ?? [];
    const widthSignals = [
      estimateTextWidth(clusterHover.label, 16),
      clusterHover.oneLiner ? estimateTextWidth(clusterHover.oneLiner, 13) : 0,
      clusterHover.underwritingLine
        ? estimateTextWidth(`Cumulative underwriting: ${clusterHover.underwritingLine}`, 12)
        : 0,
      ...clientExamples.map((c) => estimateTextWidth(c, 12)),
    ];
    const boxW = clamp(Math.max(...widthSignals) + 36, 280, 640);
    const rowCount =
      1 +
      (clusterHover.oneLiner ? 1 : 0) +
      (clusterHover.underwritingLine ? 1 : 0) +
      (clientExamples.length ? 1 + clientExamples.length : 0);
    const boxH = clamp(20 + rowCount * 22, 56, 290);
    const gap = 30;
    const edge = 10;

    let x = clusterHover.x + gap;
    let y = clusterHover.y + gap;

    if (x + boxW > w - edge) x = clusterHover.x - boxW - gap;
    if (y + boxH > h - edge) y = clusterHover.y - boxH - gap;

    x = clamp(x, edge, w - boxW - edge);
    y = clamp(y, edge, h - boxH - edge);

    return {
      bubbleStyle: {
        left: x,
        top: y,
        width: boxW,
      } satisfies React.CSSProperties,
      stroke: clusterHover.stroke,
      clientExamples,
    };
  }, [clusterHover, tooltip]);

  const fontSize = config.labelFontSize;
  const markerSize = config.markerSize;
  const axisSideLabelFontSize = config.axisSideLabelFontSize;
  const axisSideLabelYOffset = config.axisSideLabelYOffset;
  const isRevenueReceivablesZoom = preset === "revenue_receivables_zoom";

  const volumeSizing = useMemo(() => {
    if (!isRevenueReceivablesZoom) return null;

    const values = projects
      .map((p) => p.creditVolume?.normalizedUsdBn)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);

    if (!values.length) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    return {
      min,
      max,
      sqrtMin: Math.sqrt(min),
      sqrtMax: Math.sqrt(max),
    };
  }, [isRevenueReceivablesZoom, projects]);

  const markerSizeByProject = useMemo(() => {
    const map = new Map<string, number>();
    const minDot = markerSize * 1.1;
    const maxDot = markerSize * 2.45;
    const unknownDot = markerSize * 1.0;
    // Triangles/squares visually extend further than circles at equal `size`.
    // In zoom view, normalize web3 circles so visual footprint is comparable across shapes.
    const zoomCircleShapeScale = Math.SQRT2;

    for (const p of projects) {
      if (!isRevenueReceivablesZoom) {
        map.set(p.id, markerSize);
        continue;
      }

      const shapeScale = p.plane === "web3" ? zoomCircleShapeScale : 1;
      const raw = p.creditVolume?.normalizedUsdBn;
      if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0 || !volumeSizing) {
        map.set(p.id, unknownDot * shapeScale);
        continue;
      }

      const denom = Math.max(0.0001, volumeSizing.sqrtMax - volumeSizing.sqrtMin);
      const normalized = clamp((Math.sqrt(raw) - volumeSizing.sqrtMin) / denom, 0, 1);
      map.set(p.id, (minDot + (maxDot - minDot) * normalized) * shapeScale);
    }

    return map;
  }, [projects, markerSize, isRevenueReceivablesZoom, volumeSizing]);

  const labelTextByProject = useMemo(() => {
    const map = new Map<string, string>();
    const omitVolumeLabelIds = new Set(["attn"]);

    for (const p of projects) {
      if (!isRevenueReceivablesZoom) {
        map.set(p.id, p.label);
        continue;
      }

      if (omitVolumeLabelIds.has(p.id)) {
        map.set(p.id, p.label);
        continue;
      }

      const volume = (p.creditVolume?.display ?? "").trim();
      if (!volume || volume.toLowerCase() === "n/a") {
        map.set(p.id, p.label);
        continue;
      }
      map.set(p.id, p.label + " · " + volume);
    }

    return map;
  }, [projects, isRevenueReceivablesZoom]);

  const maxProjectMarkerSize = useMemo(() => {
    let max = markerSize;
    for (const p of projects) {
      max = Math.max(max, markerSizeByProject.get(p.id) ?? markerSize);
    }
    return max;
  }, [projects, markerSize, markerSizeByProject]);

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
      markerSizeForProject: (projectId) => markerSizeByProject.get(projectId) ?? markerSize,
      labelTextForProject: (project) => labelTextByProject.get(project.id) ?? project.label,
      applyHardLabelLocks: config.applyHardLabelLocks,
    });
  }, [
    projects,
    pad,
    plotW,
    plotH,
    fontSize,
    markerSize,
    markerSizeByProject,
    labelTextByProject,
    config.applyHardLabelLocks,
  ]);

  const clusterZones = useMemo(() => {
    // Keep cluster envelopes allowed up to the plot border so edge dots remain enclosed.
    const edgeInset = 0;
    const plotLeft = pad + edgeInset;
    const plotRight = pad + plotW - edgeInset;
    const plotTop = pad + edgeInset;
    const plotBottom = pad + plotH - edgeInset;

    const allCenters = new Map(
      projects.map((p) => {
        const size = markerSizeByProject.get(p.id) ?? markerSize;
        return [
          p.id,
          {
            id: p.id,
            x: xToSvg(p.x),
            y: yToSvg(p.y),
            markerOuterRadius: markerOuterRadius(p.plane, size),
          },
        ];
      }),
    );

    const zones: ClusterZone[] = [];
    const minMembersForZone = config.allowSingletonClusterZones ? 1 : 2;
    const singletonIncludeRadius = maxProjectMarkerSize * 2.1;
    const occupiedBoundaryPoints: Point[] = [];

    for (const def of clusterDefs) {
      const members = def.projectIds
        .map((id) => projectsById.get(id))
        .filter((p): p is ProjectInfo => Boolean(p));

      if (members.length < minMembersForZone) continue;

      const centers = members
        .map((p) => allCenters.get(p.id))
        .filter(
          (pt): pt is { id: string; x: number; y: number; markerOuterRadius: number } => Boolean(pt),
        );
      if (centers.length < minMembersForZone) continue;

      const foreignCenters = projects
        .filter((p) => !def.projectIds.includes(p.id))
        .map((p) => allCenters.get(p.id))
        .filter((pt): pt is { id: string; x: number; y: number; markerOuterRadius: number } => Boolean(pt));

      const spread = boundsForPoints(centers);
      const spreadDiag = Math.hypot(spread.maxX - spread.minX, spread.maxY - spread.minY);
      const proximityThreshold = clamp(spreadDiag * (def.connectivity ?? 0.34), 90, 210);

      const connectedGroups = config.splitDisconnectedClusterZones
        ? connectedPointComponents(centers, proximityThreshold)
        : [centers];
      const drawableGroups = connectedGroups.filter((g) => g.length >= minMembersForZone);
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
        const zoneObstacles: Point[] = occupiedBoundaryPoints.length
          ? [...foreignCenters, ...occupiedBoundaryPoints]
          : foreignCenters;
        const baseGap = config.clusterZonePadding;
        const clearanceAttempts = [baseGap, baseGap + 6, baseGap + 12];
        let boundary: Point[] = [];

        for (const clearance of clearanceAttempts) {
          boundary = buildOrganicBoundary({
            members: group,
            foreign: zoneObstacles,
            bounds: {
              left: plotLeft,
              right: plotRight,
              top: plotTop,
              bottom: plotBottom,
            },
            // Keep zone boundaries outside scaled dots and their outline rings.
            includeRadius:
              group.length === 1
                ? Math.max(
                    singletonIncludeRadius,
                    Math.max(...group.map((pt) => pt.markerOuterRadius + 10), 0) + 2,
                  )
                : Math.max(...group.map((pt) => pt.markerOuterRadius + 10), 30) + 2,
            minForeignClearance: clearance,
          });
          if (!hasBoundaryGapConflict(boundary, occupiedBoundaryPoints, baseGap)) break;
        }

        if (hasBoundaryGapConflict(boundary, occupiedBoundaryPoints, baseGap)) {
          const c = centroid(group);
          const contractionFactors = [0.96, 0.92, 0.88, 0.84];
          for (const factor of contractionFactors) {
            const contracted = contractBoundaryTowardCenter(
              boundary,
              c,
              factor,
              {
                left: plotLeft,
                right: plotRight,
                top: plotTop,
                bottom: plotBottom,
              },
            );
            if (!hasBoundaryGapConflict(contracted, occupiedBoundaryPoints, baseGap)) {
              boundary = contracted;
              break;
            }
            boundary = contracted;
          }
        }

        if (boundary.length >= 3) {
          for (let i = 0; i < boundary.length; i += 1) {
            occupiedBoundaryPoints.push(boundary[i]);
          }
        }

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

    // Place cluster titles with collision avoidance against project labels + axis labels,
    // then run a shared repulsion pass so cluster titles also push each other.
    const staticObstacles: Rect[] = Object.values(labelPlacements).map((lp) => expandRect(lp.rect, 7));
    const provisionalRects: Rect[] = [];
    const clusterLabelBoxes: LabelBox[] = [];
    const anchorByZoneId = new Map<string, Point>();

    const plotCenterX = (plotLeft + plotRight) / 2;
    const plotCenterY = (plotTop + plotBottom) / 2;
    const yMidLocal = yToSvg(0.5);

    // Keep cluster labels away from large horizontal axis labels.
    const leftAxisW = estimateTextWidth(config.leftAxisText, axisSideLabelFontSize);
    const leftAxisY = yMidLocal + axisSideLabelYOffset;
    staticObstacles.push({
      x1: xToSvg(0) + 28 - 10,
      y1: leftAxisY - axisSideLabelFontSize * 0.95,
      x2: xToSvg(0) + 28 + leftAxisW + 10,
      y2: leftAxisY + axisSideLabelFontSize * 0.44,
    });

    const rightAxisW = estimateTextWidth(config.rightAxisText, axisSideLabelFontSize);
    const rightAxisY = yMidLocal + axisSideLabelYOffset;
    staticObstacles.push({
      x1: xToSvg(1) - 28 - rightAxisW - 10,
      y1: rightAxisY - axisSideLabelFontSize * 0.95,
      x2: xToSvg(1) - 28 + 10,
      y2: rightAxisY + axisSideLabelFontSize * 0.44,
    });

    for (const zone of zones) {
      if (!zone.label || !zone.bounds) continue;

      const labelMetrics = clusterLabelMetrics(zone.label, 30);
      const halfW = labelMetrics.pillW / 2;
      const halfH = labelMetrics.pillH / 2;
      const b = zone.bounds;
      const centerX = (b.minX + b.maxX) / 2;
      const centerY = (b.minY + b.maxY) / 2;

      const autoAngle = Math.atan2(centerY - plotCenterY, centerX - plotCenterX);
      const preferredAngle =
        zone.labelPlacement === "bottom-right"
          ? (58 * Math.PI) / 180
          : zone.labelPlacement === "mid-right"
            ? (-18 * Math.PI) / 180
            : zone.labelPlacement === "mid-left"
              ? Math.PI
              : zone.labelPlacement === "top-left"
                ? (-135 * Math.PI) / 180
                : zone.labelPlacement === "top"
                  ? -Math.PI / 2
                  : autoAngle;

      const minX = plotLeft + halfW + 6;
      const maxX = plotRight - halfW - 6;
      const minY = plotTop + halfH + 6;
      const maxY = plotBottom - halfH - 6;
      const inBounds = (x: number, y: number) => ({
        x: clamp(x, minX, maxX),
        y: clamp(y, minY, maxY),
      });

      const angleOffsetsDeg =
        zone.labelPlacement === "bottom-right"
          ? [0, -22, 22, -44, 44, -66, 66, 180]
          : zone.labelPlacement === "mid-right" || zone.labelPlacement === "mid-left"
            ? [0, -14, 14, -30, 30, -48, 48, 180]
            : zone.labelPlacement === "top-left"
              ? [0, -14, 14, -28, 28, -44, 44, 180]
              : [0, -24, 24, -48, 48, -72, 72, 180];
      const distanceMultiplier = zone.labelDistanceMultiplier ?? 1;
      const radialOffsets = [34, 56, 84, 110].map((v) => v * distanceMultiplier);
      const candidates: Array<{ x: number; y: number; ax: number; ay: number; angle: number }> = [];

      for (const deg of angleOffsetsDeg) {
        const ang = preferredAngle + (deg * Math.PI) / 180;
        const dx = Math.cos(ang);
        const dy = Math.sin(ang);
        const tx = dx > 0 ? (b.maxX - centerX) / dx : dx < 0 ? (b.minX - centerX) / dx : Infinity;
        const ty = dy > 0 ? (b.maxY - centerY) / dy : dy < 0 ? (b.minY - centerY) / dy : Infinity;
        const tRect = Math.min(tx > 0 ? tx : Infinity, ty > 0 ? ty : Infinity);
        const t = Number.isFinite(tRect) ? tRect : 0;
        const anchorX = clamp(centerX + dx * t, plotLeft + 8, plotRight - 8);
        const anchorY = clamp(centerY + dy * t, plotTop + 8, plotBottom - 8);

        for (const ro of radialOffsets) {
          candidates.push({
            x: anchorX + dx * (ro + Math.max(halfW, halfH) * 0.2),
            y: anchorY + dy * (ro + Math.max(halfW, halfH) * 0.2),
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
        const rect = rectFromCenter(bounded.x, bounded.y, halfW, halfH);
        let overlapCount = 0;
        let overlapPx = 0;

        for (const t of staticObstacles) {
          if (!rectsOverlap(rect, t)) continue;
          overlapCount += 1;
          overlapPx += overlapArea(rect, t);
        }
        for (const t of provisionalRects) {
          if (!rectsOverlap(rect, t)) continue;
          overlapCount += 1;
          overlapPx += overlapArea(rect, t);
        }

        const clampPenalty = Math.abs(c.x - bounded.x) + Math.abs(c.y - bounded.y);
        const anchorDist = Math.hypot(c.ax - bounded.x, c.ay - bounded.y);
        const anglePenalty = angleDistance(c.angle, preferredAngle) * 128;
        const preferencePenalty = i * 6.8;
        const score =
          overlapCount * 250000 +
          overlapPx * 45 +
          anchorDist * 0.54 +
          clampPenalty * 2.5 +
          anglePenalty +
          preferencePenalty;

        if (score < bestScore) {
          bestScore = score;
          best = { x: bounded.x, y: bounded.y, ax: c.ax, ay: c.ay, rect };
        }
      }

      if (!best) continue;

      provisionalRects.push(expandRect(best.rect, 5));
      clusterLabelBoxes.push({
        id: zone.id,
        x: best.x,
        y: best.y,
        halfW,
        halfH,
        minX,
        maxX,
        minY,
        maxY,
        anchorX: best.ax,
        anchorY: best.ay,
      });
      anchorByZoneId.set(zone.id, { x: best.ax, y: best.ay });
      zone.labelFontSize = labelMetrics.fontSize;
      zone.labelPillWidth = labelMetrics.pillW;
      zone.labelPillHeight = labelMetrics.pillH;
    }

    const relaxed = relaxLabelBoxes({
      labels: clusterLabelBoxes,
      obstacles: staticObstacles,
      iterations: 150,
      pairGap: 10,
      obstacleGap: 8,
      anchorPull: 0.13,
      damping: 0.86,
      maxStep: 13,
    });

    const relaxedById = new Map(relaxed.map((l) => [l.id, l]));

    for (const zone of zones) {
      if (!zone.label || !zone.bounds) continue;
      const placed = relaxedById.get(zone.id);
      if (!placed) continue;

      zone.labelX = placed.x;
      zone.labelY = placed.y;

      let anchor = anchorByZoneId.get(zone.id) ?? {
        x: (zone.bounds.minX + zone.bounds.maxX) / 2,
        y: (zone.bounds.minY + zone.bounds.maxY) / 2,
      };
      if (zone.boundaryPoints?.length) {
        let nearest = zone.boundaryPoints[0];
        let nearestD2 = (nearest.x - placed.x) ** 2 + (nearest.y - placed.y) ** 2;
        for (let i = 1; i < zone.boundaryPoints.length; i += 1) {
          const bp = zone.boundaryPoints[i];
          const d2 = (bp.x - placed.x) ** 2 + (bp.y - placed.y) ** 2;
          if (d2 < nearestD2) {
            nearest = bp;
            nearestD2 = d2;
          }
        }
        anchor = nearest;
      }

      zone.labelAnchorX = clamp(anchor.x, plotLeft + 8, plotRight - 8);
      zone.labelAnchorY = clamp(anchor.y, plotTop + 8, plotBottom - 8);
    }

    return zones;
  }, [
    pad,
    plotW,
    plotH,
    projects,
    xToSvg,
    yToSvg,
    labelPlacements,
    axisSideLabelFontSize,
    axisSideLabelYOffset,
    maxProjectMarkerSize,
    clusterDefs,
    projectsById,
    config.allowSingletonClusterZones,
    config.splitDisconnectedClusterZones,
    config.clusterZonePadding,
    config.leftAxisText,
    config.rightAxisText,
  ]);

  const visibleClusterIds = useMemo(() => {
    return new Set(clusterZones.map((z) => z.id.replace(/-\d+$/, "")));
  }, [clusterZones]);

  const clusterInsightsById = useMemo(() => {
    const out = new Map<
      string,
      {
        oneLiner: string;
        underwritingLine: string;
        clientExamples: string[];
        memberNames: string[];
      }
    >();

    for (const def of clusterDefs) {
      const members = def.projectIds
        .map((id) => projectsById.get(id))
        .filter((p): p is ProjectInfo => Boolean(p));

      const knownVolumes = members
        .map((p) => p.creditVolume?.normalizedUsdBn)
        .filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
      const knownTotal = knownVolumes.reduce((sum, v) => sum + v, 0);
      const unknownCount = members.length - knownVolumes.length;

      const underwritingLine =
        knownVolumes.length === 0
          ? "n/a (no summable public totals disclosed)"
          : unknownCount > 0
            ? `${formatUsdBn(knownTotal)} (sum of known public figures; excludes ${unknownCount} undisclosed)`
            : `${formatUsdBn(knownTotal)} (sum of known public figures)`;

      const seen = new Set<string>();
      const preferredClients: string[] = [];
      const fallbackClients: string[] = [];
      for (const m of members) {
        for (const raw of m.exampleClients ?? []) {
          const candidate = raw.trim();
          if (!candidate) continue;
          const key = candidate.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          if (isGenericClientPlaceholder(candidate)) {
            fallbackClients.push(candidate);
          } else {
            preferredClients.push(candidate);
          }
        }
      }
      const clientExamples =
        preferredClients.length > 0
          ? preferredClients.slice(0, 4)
          : fallbackClients.length > 0
            ? fallbackClients.slice(0, 3)
            : ["Public named clients not disclosed in cited sources."];

      out.set(def.id, {
        oneLiner: def.oneLiner ?? "Cluster of related operating models in this map.",
        underwritingLine,
        clientExamples,
        memberNames: members.map((m) => m.label),
      });
    }

    return out;
  }, [clusterDefs, projectsById]);

  const clusterLegend = useMemo(() => {
    return clusterDefs.filter((def) => visibleClusterIds.has(def.id)).map((def) => ({
      id: def.id,
      label: def.label,
      stroke: def.stroke,
      fill: def.fill,
      oneLiner: clusterInsightsById.get(def.id)?.oneLiner ?? def.oneLiner ?? "",
      underwritingLine:
        clusterInsightsById.get(def.id)?.underwritingLine ??
        "n/a (public cumulative totals not disclosed)",
      clientExamples: clusterInsightsById.get(def.id)?.clientExamples ?? [],
      memberNames: clusterInsightsById.get(def.id)?.memberNames ?? [],
    }));
  }, [visibleClusterIds, clusterDefs, clusterInsightsById]);

  const clusterByProject = useMemo(() => {
    const m = new Map<string, ClusterDef>();
    for (const def of clusterDefs) {
      for (const id of def.projectIds) {
        if (projectsById.has(id)) m.set(id, def);
      }
    }
    return m;
  }, [clusterDefs, projectsById]);
  const zoomTransform = `matrix(${view.zoom} 0 0 ${view.zoom} ${view.panX} ${view.panY})`;

  return (
    <div
      className="wrap"
      aria-label={config.ariaLabel}
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
      }}
    >
      <div className="card" ref={containerRef}>
        <div className="topBar">
          <div className="topLeft">
            <div className="title">{config.title}</div>
            <div className="hint">{config.hint}</div>
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
            <div className="zoomControls" aria-label="Map zoom controls">
              <button type="button" className="zoomBtn" onClick={() => zoomAtCenter(1 / 1.16)}>
                -
              </button>
              <div className="zoomValue">{Math.round(view.zoom * 100)}%</div>
              <button type="button" className="zoomBtn" onClick={() => zoomAtCenter(1.16)}>
                +
              </button>
              <button type="button" className="zoomReset" onClick={resetZoom}>
                Reset
              </button>
            </div>
            <div className="zoomHint">Pinch or Ctrl/Cmd+wheel on map to zoom</div>
            {config.taxonomyHint ? <div className="taxonomyHint">{config.taxonomyHint}</div> : null}
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

        <div className="chartWrap" ref={chartWrapRef} onWheel={onChartWheel}>
          <div className="axisTitleOutside axisTitleTop">{config.axisTopTitle}</div>
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

            <g transform={zoomTransform}>
              {/* Subtle quadrant shading */}
              <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.065} />
              <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.035} />
              <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.035} />
              <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#33588a" opacity={0.065} />

            {/* Optional commercial cluster zones */}
            {showClusters
              ? clusterZones.map((zone) => {
                const baseClusterId = zone.id.replace(/-\d+$/, "");
                const clusterDef = clusterDefs.find((def) => def.id === baseClusterId);
                const hoverLabel = clusterDef?.label ?? zone.label ?? "Cluster";
                const clusterInsight = clusterInsightsById.get(baseClusterId);
                const hoverMeta = {
                  label: hoverLabel,
                  stroke: zone.stroke,
                  oneLiner: clusterInsight?.oneLiner ?? clusterDef?.oneLiner,
                  underwritingLine: clusterInsight?.underwritingLine,
                  clientExamples: clusterInsight?.clientExamples,
                };

                return (
                  <g key={zone.id}>
                    <path
                      d={zone.path}
                      fill={zone.fill}
                      fillOpacity={config.clusterFillOpacity}
                      stroke={zone.stroke}
                      strokeOpacity={config.clusterStrokeOpacity}
                      strokeWidth={config.clusterStrokeWidth}
                      strokeDasharray={zone.dash}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      onMouseEnter={(e) =>
                        showClusterHover(hoverMeta, e.clientX, e.clientY)}
                      onMouseMove={(e) => moveClusterHover(e.clientX, e.clientY)}
                      onMouseLeave={hideClusterHover}
                      onFocus={(e) => {
                        const r = (e.currentTarget as SVGPathElement).getBoundingClientRect();
                        showClusterHover(hoverMeta, r.left + r.width / 2, r.top + r.height / 2);
                      }}
                      onBlur={hideClusterHover}
                      tabIndex={0}
                      aria-label={hoverLabel}
                    />
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
              y={yMid + axisSideLabelYOffset}
              fontSize={axisSideLabelFontSize}
              fontWeight={800}
              textAnchor="start"
              fill="#1f3253"
              opacity={0.92}
            >
              {config.leftAxisText}
            </text>
            <text
              x={xToSvg(1) - 28}
              y={yMid + axisSideLabelYOffset}
              fontSize={axisSideLabelFontSize}
              fontWeight={800}
              textAnchor="end"
              fill="#1f3253"
              opacity={0.92}
            >
              {config.rightAxisText}
            </text>
            {/* Points + labels */}
            {projects.map((p) => {
              const cx = xToSvg(p.x);
              const cy = yToSvg(p.y);
              const isActive = tooltip?.id === p.id;
              const baseSize = markerSizeByProject.get(p.id) ?? markerSize;
              const size = isActive ? Math.max(36, baseSize + 8) : baseSize;
              const markerEdgeR = markerOuterRadius(p.plane, size);
              const comparableVolume = p.creditVolume?.normalizedUsdBn;
              const hasComparableVolume =
                typeof comparableVolume === "number" &&
                Number.isFinite(comparableVolume) &&
                comparableVolume > 0;
              const hideUnknownVolumeCue =
                isRevenueReceivablesZoom && (p.id === "attn" || p.id === "creditcoop");
              const cluster = showClusters ? clusterByProject.get(p.id) : undefined;

              const lp = labelPlacements[p.id];
              const labelX = lp?.x ?? cx;
              const labelY = lp?.y ?? cy - 26;

              const labelText = labelTextByProject.get(p.id) ?? p.label;
              const labelMetrics = projectLabelMetricsForProject(p, fontSize, labelText);
              const labelW = labelMetrics.pillW;
              const labelH = labelMetrics.pillH;
              const labelHalfW = labelW / 2;
              const labelHalfH = labelH / 2;
              const isAttnLogoLabel = p.id === "attn";

              const dx = labelX - cx;
              const dy = labelY - cy;
              const dist = Math.hypot(dx, dy);
              const leaderNeeded = dist > Math.max(size * 0.95, labelHalfH + 8);
              const ux = dist > 0 ? dx / dist : 0;
              const uy = dist > 0 ? dy / dist : 0;
              const rayScaleX = ux !== 0 ? labelHalfW / Math.abs(ux) : Number.POSITIVE_INFINITY;
              const rayScaleY = uy !== 0 ? labelHalfH / Math.abs(uy) : Number.POSITIVE_INFINITY;
              const rayScale = Math.min(rayScaleX, rayScaleY);
              const leaderStartX = cx + ux * (markerEdgeR + 3);
              const leaderStartY = cy + uy * (markerEdgeR + 3);
              const leaderEndX = labelX - ux * rayScale;
              const leaderEndY = labelY - uy * rayScale;
              const hitTargetRadius = Math.max(34, markerEdgeR + 14);

              return (
                <g
                  key={p.id}
                  tabIndex={0}
                  role="button"
                  aria-label={p.label}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => showHover(p.id, e.clientX, e.clientY)}
                  onMouseLeave={() => hideHover()}
                  onFocus={(e) => {
                    const r = (e.currentTarget as SVGGElement).getBoundingClientRect();
                    showHover(p.id, r.left + r.width / 2, r.top + r.height / 2);
                  }}
                  onBlur={() => hideHover()}
                  onClick={(e) => togglePin(p.id, e.clientX, e.clientY)}
                >
                  {/* Big invisible hit target */}
                  <circle cx={cx} cy={cy} r={hitTargetRadius} fill="transparent" />

                  {/* Highlight ring */}
                  {isActive ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={markerEdgeR + 10}
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
                      r={markerEdgeR + 5}
                      fill="none"
                      stroke={cluster.stroke}
                      strokeWidth={2.2}
                      strokeOpacity={0.9}
                    />
                  ) : null}

                  {isRevenueReceivablesZoom && !hasComparableVolume && !hideUnknownVolumeCue ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={markerEdgeR + 7}
                      fill="none"
                      stroke="#6f7f99"
                      strokeWidth={1.8}
                      strokeOpacity={0.78}
                      strokeDasharray="3 4"
                    />
                  ) : null}

                  {p.potentialClient ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={markerEdgeR + 9}
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
                    x={labelX - labelHalfW}
                    y={labelY - labelHalfH}
                    width={labelW}
                    height={labelH}
                    rx={Math.max(8, labelHalfH)}
                    fill={isAttnLogoLabel ? "#05070c" : "#f7fbff"}
                    opacity={isAttnLogoLabel ? 1 : 0.98}
                    stroke={cluster?.stroke ?? "#35527f"}
                    strokeWidth={cluster ? 1.8 : 1}
                    strokeOpacity={cluster ? 0.62 : 0.34}
                  />

                  {/* Label text / logo */}
                  {isAttnLogoLabel ? (
                    <image
                      href="/brand/kit/attn-logo-primary-dark.png"
                      x={labelX - labelHalfW + 6}
                      y={labelY - labelHalfH + 4}
                      width={labelW - 12}
                      height={labelH - 8}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  ) : (
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={labelMetrics.fontSize}
                      fill="#102d55"
                      opacity={1}
                      style={{ fontWeight: 740, letterSpacing: "0.005em" }}
                      stroke="#ffffff"
                      strokeWidth={2.6}
                      paintOrder="stroke fill"
                      textLength={labelMetrics.textLength}
                      lengthAdjust={labelMetrics.textLength ? "spacingAndGlyphs" : undefined}
                    >
                      {labelText}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Cluster labels drawn last so they always stay above firm labels */}
            {showClusters
              ? clusterZones.map((zone) => {
                if (!zone.label || !zone.labelX || !zone.labelY) return null;

                const baseClusterId = zone.id.replace(/-\d+$/, "");
                const clusterDef = clusterDefs.find((def) => def.id === baseClusterId);
                const hoverLabel = clusterDef?.label ?? zone.label ?? "Cluster";
                const clusterInsight = clusterInsightsById.get(baseClusterId);
                const hoverMeta = {
                  label: hoverLabel,
                  stroke: zone.stroke,
                  oneLiner: clusterInsight?.oneLiner ?? clusterDef?.oneLiner,
                  underwritingLine: clusterInsight?.underwritingLine,
                  clientExamples: clusterInsight?.clientExamples,
                };

                const zonePillW = zone.labelPillWidth ?? clusterLabelMetrics(zone.label ?? "", 30).pillW;
                const zonePillH = zone.labelPillHeight ?? clusterLabelMetrics(zone.label ?? "", 30).pillH;
                const zoneHalfW = zonePillW / 2;
                const zoneHalfH = zonePillH / 2;
                const zoneFontSize = zone.labelFontSize ?? clusterLabelMetrics(zone.label ?? "", 30).fontSize;

                return (
                  <g
                    key={`${zone.id}-label`}
                    onMouseEnter={(e) => showClusterHover(hoverMeta, e.clientX, e.clientY)}
                    onMouseMove={(e) => moveClusterHover(e.clientX, e.clientY)}
                    onMouseLeave={hideClusterHover}
                  >
                    {zone.labelAnchorX && zone.labelAnchorY
                      ? (() => {
                          const edgePoint = labelEdgePointTowardAnchor(
                            zone.labelX!,
                            zone.labelY!,
                            zoneHalfW,
                            zoneHalfH,
                            zone.labelAnchorX!,
                            zone.labelAnchorY!,
                          );
                          return (
                            <line
                              x1={zone.labelAnchorX}
                              y1={zone.labelAnchorY}
                              x2={edgePoint.x}
                              y2={edgePoint.y}
                              stroke={zone.stroke}
                              strokeOpacity={1}
                              strokeWidth={3.1}
                              strokeDasharray="2 6"
                              strokeLinecap="round"
                            />
                          );
                        })()
                      : null}
                    <rect
                      x={zone.labelX - zoneHalfW}
                      y={zone.labelY - zoneHalfH}
                      width={zonePillW}
                      height={zonePillH}
                      rx={Math.max(10, zoneHalfH)}
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
                      fontSize={zoneFontSize}
                      fontWeight={900}
                      fill="#1a2f52"
                    >
                      {zone.label}
                    </text>
                  </g>
                );
              })
              : null}
            </g>

          </svg>
          <div className="axisTitleOutside axisTitleBottom">{config.axisBottomTitle}</div>

          {clusterHoverRender ? (
            <div
              className="clusterHover"
              style={{
                ...clusterHoverRender.bubbleStyle,
                borderColor: clusterHoverRender.stroke,
              }}
            >
              <div className="clusterHoverTitle">{clusterHover?.label}</div>
              {clusterHover?.oneLiner ? (
                <div className="clusterHoverRow">{clusterHover.oneLiner}</div>
              ) : null}
              {clusterHover?.underwritingLine ? (
                <div className="clusterHoverRow">
                  <strong>Cumulative underwriting (sum):</strong> {clusterHover.underwritingLine}
                </div>
              ) : null}
              {clusterHoverRender.clientExamples.length ? (
                <div className="clusterHoverRow">
                  <strong>Client examples:</strong>
                  <ul className="clusterHoverList">
                    {clusterHoverRender.clientExamples.map((example, i) => (
                      <li key={i}>{highlightFirmNames(example)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
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
                  {active.borrowerType ? <span className="chip">Borrower: {active.borrowerType}</span> : null}
                  {active.distributionModel ? (
                    <span className="chip">Distribution: {active.distributionModel}</span>
                  ) : null}
                  {active.infra?.privy === "Yes" ? <span className="chip">Uses Privy</span> : null}
                  {active.infra?.squads === "Yes" && active.id !== "altitude" ? (
                    <span className="chip">Uses Squads</span>
                  ) : null}
                  {active.potentialClient ? <span className="chip">Potential client</span> : null}
                </div>

                {active.b2b2smbReliance?.length ? (
                  <div className="block">
                    <div className="label">Who they use / rely on</div>
                    <div className="text">{highlightFirmNames(active.b2b2smbReliance[0])}</div>
                  </div>
                ) : null}

                {active.exampleClients?.length ? (
                  <div className="block">
                    <div className="label">Who they service (examples)</div>
                    <ul className="list">
                      {active.exampleClients.slice(0, 3).map((x, i) => (
                        <li key={i}>{highlightFirmNames(x)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {active.creditVolume ? (
                  <div className="block">
                    <div className="label">Credit volume (dot size)</div>
                    <ul className="list">
                      <li>
                        {active.creditVolume.display} — {active.creditVolume.basis ?? "Best-public signal"}
                      </li>
                      {active.creditVolume.note ? <li>{active.creditVolume.note}</li> : null}
                    </ul>
                  </div>
                ) : null}

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
              {isRevenueReceivablesZoom ? (
                <div className="clusterInsightGrid">
                  {clusterLegend.map((item) => (
                    <div key={item.id} className="clusterInsightCard" style={{ borderColor: item.stroke }}>
                      <div className="clusterInsightTitle">{item.label}</div>
                      {item.memberNames.length ? (
                        <div className="clusterFirmPills">
                          {item.memberNames.map((name) => (
                            <span key={name} className="clusterFirmPill">
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {item.oneLiner ? <div className="clusterInsightText">{item.oneLiner}</div> : null}
                      <div className="clusterInsightText">
                        <strong>Cumulative underwriting (sum):</strong> {item.underwritingLine}
                      </div>
                      <div className="clusterInsightText">
                        <strong>Client examples:</strong>{" "}
                        {item.clientExamples.slice(0, 4).map((example, i) => (
                          <React.Fragment key={`${item.id}-example-${i}`}>
                            {i > 0 ? " | " : null}
                            {highlightFirmNames(example)}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="clusterKeyHint">
                {config.allowSingletonClusterZones
                  ? "Zones can represent single firms or grouped firms in this zoom view. Dot/label outlines use cluster colors for exact inclusion."
                  : "Zones are drawn only when 2+ projects are close enough on the map. Dot/label outlines use cluster colors for exact inclusion."}
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
          font-size: 24px;
          line-height: 1.1;
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
        .zoomControls {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(53, 82, 127, 0.24);
          border-radius: 10px;
          background: rgba(245, 250, 255, 0.95);
          padding: 5px 8px;
          box-shadow: 0 6px 14px rgba(31, 50, 83, 0.08);
        }
        .zoomBtn {
          min-width: 24px;
          height: 24px;
          border: 1px solid rgba(53, 82, 127, 0.3);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.95);
          color: #1f3253;
          font-weight: 800;
          line-height: 1;
          cursor: pointer;
        }
        .zoomReset {
          border: 1px solid rgba(53, 82, 127, 0.3);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.95);
          color: #1f3253;
          font-weight: 700;
          font-size: 12px;
          padding: 3px 8px;
          cursor: pointer;
        }
        .zoomValue {
          min-width: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          color: rgba(31, 50, 83, 0.84);
        }
        .zoomHint {
          font-size: 11px;
          color: rgba(31, 50, 83, 0.66);
        }
        .taxonomyHint {
          max-width: 420px;
          font-size: 11px;
          line-height: 1.3;
          color: rgba(31, 50, 83, 0.76);
          border: 1px solid rgba(53, 82, 127, 0.2);
          border-radius: 10px;
          background: rgba(245, 250, 255, 0.95);
          padding: 6px 9px;
        }
        .hint {
          font-size: 12px;
          color: rgba(31, 50, 83, 0.72);
          white-space: nowrap;
        }

        .chartWrap {
          position: relative;
          padding-top: 34px;
          padding-bottom: 40px;
          touch-action: pan-y;
        }

        .axisTitleOutside {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 6;
          font-size: 38px;
          font-weight: 850;
          color: rgba(31, 50, 83, 0.96);
          letter-spacing: 0.005em;
          white-space: nowrap;
          pointer-events: none;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.65);
        }

        .axisTitleTop {
          top: 2px;
        }

        .axisTitleBottom {
          bottom: 4px;
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
          border-radius: 12px;
          padding: 9px 11px;
          font-size: 13px;
          color: #1f3253;
          line-height: 1.35;
          white-space: normal;
          box-shadow: 0 8px 20px rgba(31, 50, 83, 0.14);
        }
        .clusterHoverTitle {
          font-size: 14px;
          font-weight: 900;
          margin-bottom: 3px;
        }
        .clusterHoverRow {
          margin-top: 3px;
          color: rgba(31, 50, 83, 0.92);
        }
        .clusterHoverRow strong {
          font-weight: 800;
          margin-right: 4px;
        }
        .clusterHoverList {
          margin: 4px 0 0 16px;
          padding: 0;
        }
        .clusterHoverList li {
          margin: 2px 0;
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
        .clusterInsightGrid {
          margin-top: 8px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 8px;
        }
        .clusterInsightCard {
          border: 1px solid rgba(53, 82, 127, 0.28);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.74);
          padding: 8px 9px;
        }
        .clusterInsightTitle {
          font-size: 14px;
          font-weight: 900;
          color: #173b67;
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .clusterFirmPills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 6px;
        }
        .clusterFirmPill {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid rgba(53, 82, 127, 0.22);
          background: rgba(226, 238, 255, 0.8);
          color: rgba(19, 59, 103, 0.95);
          font-size: 11px;
          font-weight: 760;
          line-height: 1.2;
        }
        .clusterInsightText {
          margin-top: 3px;
          font-size: 12px;
          line-height: 1.34;
          color: rgba(31, 50, 83, 0.92);
        }
        .clusterInsightText strong {
          font-weight: 800;
          margin-right: 4px;
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
