"use client";

import { useId, useState } from "react";

const tabs = [
  { id: "solid", label: "Solid", copy: "Solid is the one action on a surface. Bone on night, ink on paper." },
  { id: "ghost", label: "Ghost", copy: "Ghost is a second action. The border is the button." },
  { id: "line", label: "Line", copy: "Line is a quiet exit: resume, a next page, a footnote action." },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CalibreWorkbench() {
  const nameId = useId();
  const messageId = useId();
  const [pressed, setPressed] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [checked, setChecked] = useState(false);
  const [signal, setSignal] = useState(true);
  const [tab, setTab] = useState<TabId>("solid");
  const [night, setNight] = useState(true);
  const [note, setNote] = useState("Press a control. The line under the stage repeats what happened.");

  const invalid = (touched || checked) && name.trim().length < 2;
  const active = tabs.find((item) => item.id === tab) ?? tabs[0];

  return (
    <div className="bench">
      <div className="bench-toolbar">
        <button type="button" className="bench-toggle" aria-pressed={night} onClick={() => {
          setNight((value) => !value);
          setNote(night ? "Surface is paper." : "Surface is night.");
        }}>
          {night ? "Night surface" : "Paper surface"}
        </button>
        <p className="bench-live" role="status" aria-live="polite">
          {note}
        </p>
      </div>

      <div className={night ? "bench-stage theme-ink" : "bench-stage theme-bone"}>
        <div className="bench-group">
          <p className="eyebrow">Buttons</p>
          <div className="specimen">
            {(["solid", "ghost", "line"] as const).map((variant) => (
              <button
                key={variant}
                type="button"
                className={`btn btn-${variant}`}
                aria-pressed={pressed === variant}
                onClick={() => {
                  setPressed(variant);
                  setNote(`${variant[0].toUpperCase()}${variant.slice(1)} pressed.`);
                  window.setTimeout(() => setPressed((current) => (current === variant ? null : current)), 900);
                }}
              >
                {variant[0].toUpperCase() + variant.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bench-group">
          <p className="eyebrow">Field</p>
          <label className="field" htmlFor={nameId}>
            <span>Name</span>
            <input
              id={nameId}
              name="bench-name"
              value={name}
              placeholder="Akhilendra Singh"
              autoComplete="off"
              aria-invalid={invalid}
              aria-describedby={messageId}
              onChange={(event) => {
                setName(event.target.value);
                setChecked(false);
              }}
              onBlur={() => setTouched(true)}
            />
          </label>
          <p id={messageId} className={invalid ? "bench-msg is-invalid" : "bench-msg"}>
            {invalid ? "Use at least two characters." : "Clears, and checks the length."}
          </p>
          <div className="specimen">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setName("");
                setTouched(false);
                setChecked(false);
                setNote("Field cleared.");
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-line"
              onClick={() => {
                setChecked(true);
                setTouched(true);
                setNote(name.trim().length < 2 ? "Name is too short." : `Checked “${name.trim()}”.`);
              }}
            >
              Check
            </button>
          </div>
        </div>

        <div className="bench-group">
          <p className="eyebrow">Switch</p>
          <button
            type="button"
            className={signal ? "switch is-on" : "switch"}
            role="switch"
            aria-checked={signal}
            onClick={() => {
              setSignal((value) => !value);
              setNote(signal ? "Signal off. Champagne rests." : "Signal on. Champagne marks the control.");
            }}
          >
            <span className="switch-knob" aria-hidden="true" />
            <span>{signal ? "Signal on" : "Signal off"}</span>
          </button>
        </div>

        <div className="bench-group">
          <p className="eyebrow">Tabs</p>
          <div className="bench-tabs" role="tablist" aria-label="Button roles">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`bench-tab-${item.id}`}
                aria-selected={tab === item.id}
                aria-controls={`bench-panel-${item.id}`}
                tabIndex={tab === item.id ? 0 : -1}
                onClick={() => {
                  setTab(item.id);
                  setNote(`${item.label} tab.`);
                }}
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
                  setNote(`${next.label} tab.`);
                  const button = document.getElementById(`bench-tab-${next.id}`);
                  if (button instanceof HTMLButtonElement) button.focus();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            className="bench-panel"
            role="tabpanel"
            id={`bench-panel-${active.id}`}
            aria-labelledby={`bench-tab-${active.id}`}
          >
            <p>{active.copy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
