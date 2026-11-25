"use client";

import { useState } from "react";
import { easings, motions } from "@/lib/tokens";

export function MotionDemo() {
  const [easing, setEasing] = useState(0);
  const [duration, setDuration] = useState(2);
  const [play, setPlay] = useState(0);
  const [reduced, setReduced] = useState(false);

  const easingChoice = easings[easing];
  const durationChoice = motions[duration];

  return (
    <div className="motion-demo">
      <div className="motion-controls">
        <fieldset>
          <legend>Easing</legend>
          {easings.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={index === easing} onClick={() => setEasing(index)}>
              {item.name}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>Duration</legend>
          {motions.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={index === duration} onClick={() => setDuration(index)}>
              {item.name} · {item.ms}ms
            </button>
          ))}
        </fieldset>
        <button
          type="button"
          className="btn btn-solid"
          onClick={() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            setReduced(reduce);
            setPlay((value) => value + 1);
          }}
        >
          Play
        </button>
      </div>
      <div className="motion-track" key={play}>
        <span
          className="motion-pip"
          style={{
            transitionProperty: "transform",
            transitionDuration: reduced ? "0ms" : `${durationChoice.ms}ms`,
            transitionTimingFunction: easingChoice.css,
            transform: play > 0 && !reduced ? "translateX(calc(100cqi - 100%))" : undefined,
          }}
        />
      </div>
      <p className="motion-readout">
        <code>{easingChoice.variable}</code>
        <span>{easingChoice.css}</span>
        <code>{durationChoice.variable}</code>
        <span>{durationChoice.note}</span>
      </p>
      {reduced ? <p className="motion-note">Reduced motion is on. The pip stays put. The tokens are unchanged.</p> : null}
    </div>
  );
}
