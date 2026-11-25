"use client";

import { useState } from "react";
import { Swatch } from "@/components/swatch";
import { colors, elevations, radii, spaces, typeSteps } from "@/lib/tokens";

const tabs = [
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "space", label: "Space" },
  { id: "radius", label: "Radius" },
  { id: "elevation", label: "Elevation" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CalibreReference() {
  const [tab, setTab] = useState<TabId>("color");

  return (
    <div className="token-tabs">
      <div className="bench-tabs" role="tablist" aria-label="Token groups">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`token-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`token-panel-${item.id}`}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
            onKeyDown={(event) => {
              const index = tabs.findIndex((entry) => entry.id === tab);
              const next =
                event.key === "ArrowRight" || event.key === "ArrowDown"
                  ? tabs[(index + 1) % tabs.length]
                  : event.key === "ArrowLeft" || event.key === "ArrowUp"
                    ? tabs[(index - 1 + tabs.length) % tabs.length]
                    : event.key === "Home"
                      ? tabs[0]
                      : event.key === "End"
                        ? tabs[tabs.length - 1]
                        : null;
              if (!next) return;
              event.preventDefault();
              setTab(next.id);
              const button = document.getElementById(`token-tab-${next.id}`);
              if (button instanceof HTMLButtonElement) button.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "color" ? (
        <div className="token-panel" role="tabpanel" id="token-panel-color" aria-labelledby="token-tab-color">
          <p>Click a swatch. It copies the variable and the computed value from the live stylesheet.</p>
          <div className="swatch-grid">
            {colors.map((color) => (
              <Swatch key={color.variable} name={color.name} variable={color.variable} role={color.role} />
            ))}
          </div>
        </div>
      ) : null}

      {tab === "type" ? (
        <div className="token-panel" role="tabpanel" id="token-panel-type" aria-labelledby="token-tab-type">
          <p>Fraunces for display, including italic. Outfit for interface and body. A system mono stack for tokens.</p>
          <div className="type-stack">
            {typeSteps.map((step) => (
              <div key={step.variable} className="type-row">
                <div className="type-meta">
                  <span>{step.name}</span>
                  <code>{step.variable}</code>
                </div>
                <p className={`type-sample type-${step.specimen}`} style={{ fontSize: `var(${step.variable})` }}>
                  {step.sample}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "space" ? (
        <div className="token-panel" role="tabpanel" id="token-panel-space" aria-labelledby="token-tab-space">
          <p>A 4-based scale. Components use the variables.</p>
          <ul className="space-list">
            {spaces.map((space) => (
              <li key={space.variable}>
                <span className="space-bar" style={{ width: `var(${space.variable})` }} />
                <code>
                  {space.name} · {space.variable}
                </code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "radius" ? (
        <div className="token-panel" role="tabpanel" id="token-panel-radius" aria-labelledby="token-tab-radius">
          <div className="radius-row">
            {radii.map((radius) => (
              <figure key={radius.variable}>
                <div className="radius-box" style={{ borderRadius: `var(${radius.variable})` }} />
                <figcaption>
                  <strong>{radius.name}</strong>
                  <code>{radius.variable}</code>
                  <span>{radius.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "elevation" ? (
        <div className="token-panel" role="tabpanel" id="token-panel-elevation" aria-labelledby="token-tab-elevation">
          <p>Most depth is a change of tone. Shadows are rare and named.</p>
          <div className="elev-row">
            {elevations.map((item) => (
              <figure key={item.variable}>
                <div className="elev-box" style={{ boxShadow: `var(${item.variable})` }} />
                <figcaption>
                  <strong>{item.name}</strong>
                  <code>{item.variable}</code>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
