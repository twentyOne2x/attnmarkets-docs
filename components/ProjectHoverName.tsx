"use client";

import React from "react";
import { highlightFirmNames } from "./highlightFirmNames";
import { PROJECTS } from "./quadrantMapData";

type ProjectId = keyof typeof PROJECTS;

type ProjectHoverNameProps = {
  id: ProjectId;
  label?: string;
};

export default function ProjectHoverName({ id, label }: ProjectHoverNameProps) {
  const info = PROJECTS[id];
  if (!info) return <span>{label ?? id}</span>;

  const title = label ?? info.label;
  const volumeText = info.creditVolume
    ? `${info.creditVolume.display} — ${info.creditVolume.basis ?? "Best-public signal"}`
    : null;
  const examples = info.exampleClients?.slice(0, 3) ?? [];
  const b2b2smbText = info.b2b2smbReliance?.length ? info.b2b2smbReliance[0] : null;

  return (
    <span className="token">
      <span className="trigger" tabIndex={0} aria-label={`${info.label} details`}>
        {title}
      </span>

      <span className="tooltip" role="note" aria-label={`${info.label} hover data`}>
        <span className="tooltipTitle">{info.label}</span>
        {info.borrowerType ? (
          <span className="tooltipRow">
            <strong>Who they service:</strong> {info.borrowerType}
          </span>
        ) : null}
        {info.distributionModel ? (
          <span className="tooltipRow">
            <strong>Distribution:</strong> {info.distributionModel}
          </span>
        ) : null}
        {volumeText ? (
          <span className="tooltipRow">
            <strong>Volume:</strong> {volumeText}
          </span>
        ) : null}
        {b2b2smbText ? (
          <span className="tooltipRow">
            <strong>Who they use/rely on:</strong> {highlightFirmNames(b2b2smbText)}
          </span>
        ) : null}
        {examples.length ? (
          <span className="tooltipRow">
            <strong>Who they service (examples):</strong>{" "}
            {examples.map((example, i) => (
              <React.Fragment key={`example-${i}`}>
                {i > 0 ? " | " : null}
                {highlightFirmNames(example)}
              </React.Fragment>
            ))}
          </span>
        ) : null}
      </span>

      <style jsx>{`
        .token {
          position: relative;
          display: inline-block;
          vertical-align: baseline;
        }
        .trigger {
          display: inline-block;
          cursor: help;
          border-bottom: 1px dotted rgba(93, 143, 214, 0.7);
          font-weight: 650;
          color: #d7ecff;
          line-height: 1.25;
          outline: none;
        }
        .trigger:focus {
          border-bottom-color: #9cc8ff;
          box-shadow: 0 0 0 2px rgba(118, 176, 255, 0.35);
          border-radius: 2px;
        }
        .tooltip {
          position: absolute;
          z-index: 40;
          left: 0;
          top: calc(100% + 8px);
          width: min(420px, 88vw);
          background: #f7fbff;
          color: #132a49;
          border: 1px solid rgba(53, 82, 127, 0.34);
          border-radius: 10px;
          box-shadow: 0 14px 28px rgba(4, 18, 38, 0.28);
          padding: 9px 10px;
          font-size: 13px;
          line-height: 1.35;
          opacity: 0;
          transform: translateY(4px);
          pointer-events: none;
          transition: opacity 120ms ease, transform 120ms ease;
        }
        .token:hover .tooltip,
        .token:focus-within .tooltip {
          opacity: 1;
          transform: translateY(0);
        }
        .tooltipTitle {
          display: block;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 5px;
          color: #112b4c;
        }
        .tooltipRow {
          display: block;
          margin-top: 3px;
        }
        .tooltipRow strong {
          font-weight: 700;
          margin-right: 4px;
        }
      `}</style>
    </span>
  );
}
