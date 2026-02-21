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

type Rect = { x1: number; y1: number; x2: number; y2: number };

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

export default function QuadrantScatterMap(props: {
  asOf?: string;
  maxWidth?: number; // embedded sizing control
}) {
  const asOf = props.asOf ?? "2026-02-21";
  const maxWidth = props.maxWidth ?? 2200;

  const projects = useMemo(() => Object.values(PROJECTS), []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const tooltipHoverRef = useRef(false);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

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
    const onPointerDown = (e: PointerEvent) => {
      if (!tooltip?.pinned) return;
      const target = e.target as Node | null;
      if (target && tooltipRef.current?.contains(target)) return;
      setTooltip(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [tooltip?.pinned]);

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

  const showHover = (id: string, svgX: number, svgY: number) => {
    clearHideTimer();
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
    const { x, y } = getLocalFromSvgPoint(svgX, svgY);
    setTooltip((prev) => {
      if (prev?.pinned && prev.id === id) return null;
      return { id, x, y, pinned: true };
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

  const fontSize = 24;
  const markerSize = 28;

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
            <div className="title">Credit Control Landscape — as of {asOf}</div>
            <div className="hint">hover for details click a dot to pin. esc clears</div>
          </div>
          <div className="topRight">
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
            {/* Dim-blue background */}
            <rect x="0" y="0" width={width} height={height} fill="#e8f0ff" />

            {/* Subtle quadrant shading */}
            <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="#35527f" opacity={0.07} />
            <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="#35527f" opacity={0.04} />
            <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#35527f" opacity={0.04} />
            <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#35527f" opacity={0.07} />

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

                  {p.potentialClient ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2 + 6}
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
                    fill="#edf4ff"
                    opacity={0.95}
                    stroke="#35527f"
                    strokeOpacity={0.2}
                  />

                  {/* Label text */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fill="#1f3253"
                    opacity={0.96}
                    style={{ fontWeight: 650 }}
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}
          </svg>

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
          background: #edf3ff;
          color: #1f3253;
          border: 1px solid rgba(53, 82, 127, 0.34);
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
          background: rgba(232, 241, 255, 0.95);
          padding: 8px 10px;
          font-size: 12px;
          box-shadow: 0 8px 20px rgba(31, 50, 83, 0.1);
        }

        .tooltip {
          position: absolute;
          z-index: 12;
          border: 1px solid rgba(53, 82, 127, 0.26);
          background: rgba(232, 241, 255, 0.98);
          border-radius: 14px;
          padding: 12px;
          box-shadow: 0 18px 50px rgba(31, 50, 83, 0.2);
          overflow: auto;
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
