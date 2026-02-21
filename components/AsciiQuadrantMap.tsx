"use client";

import React from "react";
import { PROJECTS, type ExecutionPlane, type ProjectInfo } from "./quadrantMapData";

function planeLabel(plane: ExecutionPlane) {
  if (plane === "web3") return "Web3-native";
  if (plane === "web2") return "Web2-native";
  if (plane === "hybrid") return "Hybrid";
  return "Unknown";
}

function TooltipToken(props: {
  id: keyof typeof PROJECTS;
  align?: "left" | "right";
  children?: React.ReactNode;
}) {
  const info: ProjectInfo = PROJECTS[props.id];
  const align = props.align ?? "left";

  return (
    <span
      className={`token token-${align} plane-${info.plane}`}
      tabIndex={0}
      aria-label={`${info.label} details`}
    >
      {props.children ?? info.label}

      <span className="tooltip" role="note">
        <div className="tooltipTitle">{info.label}</div>

        <div className="tooltipRow">
          <strong>Narrative:</strong> {info.narrative}
        </div>
        <div className="tooltipRow">
          <strong>Stack:</strong> {info.stack}
        </div>
        <div className="tooltipRow">
          <strong>Control primitive:</strong> {info.controlPrimitive}
        </div>
        <div className="tooltipRow">
          <strong>Execution plane:</strong>{" "}
          <span className={`pill pill-${info.plane}`}>{planeLabel(info.plane)}</span>
        </div>

        {info.creditModel ? (
          <div className="tooltipRow">
            <strong>Credit/rails:</strong> {info.creditModel}
          </div>
        ) : null}

        {info.why.length ? (
          <>
            <div className="tooltipSpacer" />
            <div className="tooltipRow">
              <strong>Why here:</strong>
            </div>
            <ul className="tooltipList">
              {info.why.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </>
        ) : null}

        {info.sources.length ? (
          <>
            <div className="tooltipSpacer" />
            <div className="tooltipRow">
              <strong>Sources:</strong>
            </div>
            <ul className="tooltipList">
              {info.sources.slice(0, 4).map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </span>

      <style jsx>{`
        .token {
          position: relative;
          display: inline;
          cursor: help;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 2px;
        }

        .plane-web3 {
          color: #3b82f6;
        }
        .plane-hybrid {
          color: #a855f7;
        }
        .plane-web2 {
          color: #f59e0b;
        }
        .plane-unknown {
          color: #9ca3af;
        }

        .tooltip {
          display: none;
          position: absolute;
          z-index: 50;
          top: 1.35em;
          min-width: 360px;
          max-width: 480px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(17, 17, 17, 0.98);
          color: #fff;
          font-size: 12px;
          line-height: 1.35;
          white-space: normal;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .token-left .tooltip {
          left: 0;
        }
        .token-right .tooltip {
          right: 0;
        }

        .token:hover .tooltip,
        .token:focus .tooltip,
        .token:focus-within .tooltip {
          display: block;
        }

        .tooltipTitle {
          font-weight: 700;
          margin-bottom: 6px;
        }

        .tooltipRow {
          margin: 2px 0;
        }

        .tooltipSpacer {
          height: 6px;
        }

        .tooltipList {
          margin: 6px 0 0 16px;
          padding: 0;
        }

        .tooltipList li {
          margin: 2px 0;
        }

        .tooltip a {
          color: inherit;
          text-decoration: underline;
          text-decoration-style: dotted;
        }

        .pill {
          display: inline-block;
          padding: 1px 6px;
          border-radius: 999px;
          font-size: 11px;
          line-height: 1.4;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .pill-web3 {
          background: rgba(59, 130, 246, 0.22);
        }
        .pill-hybrid {
          background: rgba(168, 85, 247, 0.22);
        }
        .pill-web2 {
          background: rgba(245, 158, 11, 0.22);
        }
        .pill-unknown {
          background: rgba(156, 163, 175, 0.22);
        }
      `}</style>
    </span>
  );
}

function Line(props: { children: React.ReactNode }) {
  return <div style={{ whiteSpace: "pre" }}>{props.children}</div>;
}

function LegendDot(props: { plane: ExecutionPlane; label: string }) {
  const color =
    props.plane === "web3"
      ? "#3b82f6"
      : props.plane === "hybrid"
      ? "#a855f7"
      : props.plane === "web2"
      ? "#f59e0b"
      : "#9ca3af";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", marginRight: 12 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          display: "inline-block",
          marginRight: 6,
        }}
      />
      <span>{props.label}</span>
    </span>
  );
}

export default function AsciiQuadrantMap(props: { asOf?: string }) {
  const asOf = props.asOf ?? "2026-02-21";
  const dot = " • ";

  return (
    <div
      aria-label={`Quadrant map with hover details (as of ${asOf})`}
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.25,
        marginTop: 12,
      }}
    >
      <Line>{"                         Back-end infrastructure"}</Line>
      <Line>{"          (protocols / markets / routing / servicing / issuing APIs)"}</Line>
      <Line>{"                                      ^"}</Line>
      <Line>{"                                      |"}</Line>
      <Line>{"     Reputation / legal               |     Programmatic controls"}</Line>
      <Line>{" (scores, whitelists, contracts,      |  (escrow, liquidation, revenue sweeps,"}</Line>
      <Line>{"  collections, courts)                |   policy limits, auto-pay)"}</Line>
      <Line>{"                                      |"}</Line>

      <Line>
        {" "}
        <TooltipToken id="wildcat">Wildcat</TooltipToken>
        {dot}
        <TooltipToken id="threejane">3Jane</TooltipToken>
        {dot}
        <TooltipToken id="xitadel">Xitadel</TooltipToken>
        {dot}
        <TooltipToken id="yumi">Yumi</TooltipToken>
        {dot}
        <TooltipToken id="claw">Claw</TooltipToken>
        {"     |  "}
        <TooltipToken id="attn" align="right">
          ATTN
        </TooltipToken>
        {dot}
        <TooltipToken id="creditcoop" align="right">
          Credit Coop
        </TooltipToken>
        {dot}
        <TooltipToken id="youlend" align="right">
          YouLend
        </TooltipToken>
        {dot}
        <TooltipToken id="pipe" align="right">
          Pipe
        </TooltipToken>
        {dot}
        <TooltipToken id="rain" align="right">
          Rain
        </TooltipToken>
      </Line>

      <Line>{"--------------------------------------+------------------------------------> Control primitive"}</Line>
      <Line>{"                                      |"}</Line>

      <Line>
        {"      "}
        <TooltipToken id="krak">Krak</TooltipToken>
        {dot}
        <TooltipToken id="klarna_tempo">Klarna(+Tempo)</TooltipToken>
        {"     |  "}
        <TooltipToken id="avici" align="right">
          Avici
        </TooltipToken>
        {dot}
        <TooltipToken id="pyra" align="right">
          Pyra
        </TooltipToken>
        {dot}
        <TooltipToken id="frames" align="right">
          Frames
        </TooltipToken>
        {dot}
        <TooltipToken id="sponge" align="right">
          Sponge
        </TooltipToken>
      </Line>

      <Line>{"                                      |"}</Line>
      <Line>{"                                      v"}</Line>
      <Line>{"                         User-facing distribution"}</Line>
      <Line>{"                    (apps / accounts / cards / checkout UX)"}</Line>

      <Line>{""}</Line>

      <Line>
        {"Distribution endpoints (plug-in surfaces): "}
        <TooltipToken id="slash">Slash</TooltipToken>
        {dot}
        <TooltipToken id="altitude">Altitude</TooltipToken>
      </Line>

      <Line>
        {"Adjacent: "}
        <TooltipToken id="pye">Pye</TooltipToken>
        {dot}
        <TooltipToken id="colossus">Colossus</TooltipToken>
      </Line>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
        <div style={{ marginBottom: 6 }}>
          <strong>Execution plane (color):</strong>
        </div>
        <LegendDot plane="web3" label="Web3-native (core logic/settlement onchain)" />
        <LegendDot plane="hybrid" label="Hybrid (mix of bank/card rails + onchain)" />
        <LegendDot plane="web2" label="Web2-native (core logic/rails offchain)" />
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
        Hover/focus a name to see classification rationale + primary links.
      </div>
    </div>
  );
}
