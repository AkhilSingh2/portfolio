"use client";

import { useState, useSyncExternalStore } from "react";
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

function TokenPreview({
  name,
  variable,
  kind,
}: {
  name: string;
  variable: string;
  kind: TabId;
}) {
  const value = useSyncExternalStore(
    () => () => undefined,
    () => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
    () => "",
  );
  const sample =
    kind === "color"
      ? { background: `var(${variable})` }
      : kind === "type"
        ? { fontSize: `var(${variable})` }
        : kind === "space"
          ? { padding: `var(${variable})` }
          : kind === "radius"
            ? { borderRadius: `var(${variable})` }
            : { boxShadow: `var(${variable})` };
  return (
    <aside className="token-preview" aria-live="polite">
      <p className="eyebrow">Applied</p>
      <strong>{name}</strong>
      <code>{variable}</code>
      <p className="token-computed">{value || "From the stylesheet"}</p>
      <div className="token-sample" style={sample}>
        <p>Calibre</p>
        <span className="btn btn-solid">Sample</span>
      </div>
    </aside>
  );
}

export function CalibreReference() {
  const [tab, setTab] = useState<TabId>("color");
  const [picked, setPicked] = useState<{ name: string; variable: string }>({
    name: colors[0].name,
    variable: colors[0].variable,
  });

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
        <div className="token-studio" role="tabpanel" id="token-panel-color" aria-labelledby="token-tab-color">
          <div className="token-panel">
            <p>Click a swatch. It copies the variable and shows it in the preview.</p>
            <div className="swatch-grid">
              {colors.map((color) => (
                <Swatch
                  key={color.variable}
                  name={color.name}
                  variable={color.variable}
                  role={color.role}
                  onSelect={() => setPicked({ name: color.name, variable: color.variable })}
                />
              ))}
            </div>
          </div>
          <TokenPreview name={picked.name} variable={picked.variable} kind="color" />
        </div>
      ) : null}

      {tab === "type" ? (
        <div className="token-studio" role="tabpanel" id="token-panel-type" aria-labelledby="token-tab-type">
          <div className="token-panel">
          <p>Fraunces for display, including italic. Outfit for interface and body. A system mono stack for tokens.</p>
          <div className="type-stack">
            {typeSteps.map((step) => (
              <button key={step.variable} type="button" className="type-row" onClick={() => setPicked({ name: step.name, variable: step.variable })}>
                <div className="type-meta">
                  <span>{step.name}</span>
                  <code>{step.variable}</code>
                </div>
                <span className={`type-sample type-${step.specimen}`} style={{ fontSize: `var(${step.variable})` }}>
                  {step.sample}
                </span>
              </button>
            ))}
          </div>
          </div>
          <TokenPreview name={picked.name} variable={picked.variable} kind="type" />
        </div>
      ) : null}

      {tab === "space" ? (
        <div className="token-studio" role="tabpanel" id="token-panel-space" aria-labelledby="token-tab-space">
          <div className="token-panel">
          <p>A 4-based scale. Components use the variables.</p>
          <ul className="space-list">
            {spaces.map((space) => (
              <li key={space.variable}>
                <button type="button" onClick={() => setPicked({ name: space.name, variable: space.variable })}>
                <span className="space-bar" style={{ width: `var(${space.variable})` }} />
                <code>
                  {space.name} · {space.variable}
                </code>
                </button>
              </li>
            ))}
          </ul>
          </div>
          <TokenPreview name={picked.name} variable={picked.variable} kind="space" />
        </div>
      ) : null}

      {tab === "radius" ? (
        <div className="token-studio" role="tabpanel" id="token-panel-radius" aria-labelledby="token-tab-radius">
          <div className="token-panel">
            <div className="radius-row">
              {radii.map((radius) => (
                <button key={radius.variable} type="button" className="radius-pick" onClick={() => setPicked({ name: radius.name, variable: radius.variable })}>
                  <span className="radius-box" style={{ borderRadius: `var(${radius.variable})` }} />
                  <strong>{radius.name}</strong>
                  <code>{radius.variable}</code>
                  <span>{radius.note}</span>
                </button>
              ))}
            </div>
          </div>
          <TokenPreview name={picked.name} variable={picked.variable} kind="radius" />
        </div>
      ) : null}

      {tab === "elevation" ? (
        <div className="token-studio" role="tabpanel" id="token-panel-elevation" aria-labelledby="token-tab-elevation">
          <div className="token-panel">
            <p>Most depth is a change of tone. Shadows are rare and named.</p>
            <div className="elev-row">
              {elevations.map((item) => (
                <button key={item.variable} type="button" className="radius-pick" onClick={() => setPicked({ name: item.name, variable: item.variable })}>
                  <span className="elev-box" style={{ boxShadow: `var(${item.variable})` }} />
                  <strong>{item.name}</strong>
                  <code>{item.variable}</code>
                  <span>{item.note}</span>
                </button>
              ))}
            </div>
          </div>
          <TokenPreview name={picked.name} variable={picked.variable} kind="elevation" />
        </div>
      ) : null}
    </div>
  );
}
