"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calibreMetrics } from "@/lib/calibre-metrics";

const ink = "#16130f";
const gold = "#8a7352";
const grid = "rgba(22, 19, 15, 0.12)";

function Chart({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return (
    <figure className="calibre-chart">
      <figcaption>
        <strong>{title}</strong>
        <span>{source}</span>
      </figcaption>
      <div className="calibre-chart-frame">{children}</div>
    </figure>
  );
}

export function CalibreCharts() {
  const lighthouse = calibreMetrics.lighthouse.map((row) => ({
    name: row.route.replace("/portfolio", "") || "/",
    score: row.score,
    lcp: Math.round(row.lcpMs),
  }));
  const bundles = [
    { name: "JS", kb: Math.round(calibreMetrics.bundles.jsBytes / 1024) },
    { name: "CSS", kb: Math.round(calibreMetrics.bundles.cssBytes / 1024) },
  ];
  const counts = [
    { name: "Components", value: calibreMetrics.counts.components },
    { name: "Colours", value: calibreMetrics.counts.colors },
    { name: "Type steps", value: calibreMetrics.counts.typeSteps },
    { name: "Spaces", value: calibreMetrics.counts.spaces },
    { name: "CSS variables", value: calibreMetrics.counts.cssCustomProperties },
  ];

  return (
    <div className="calibre-charts">
      <Chart title="Lighthouse performance, by route" source={calibreMetrics.lighthouseSource}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={lighthouse} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" interval={0} angle={-55} textAnchor="end" height={80} tick={{ fill: ink, fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: ink, fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="score" fill={gold} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Largest contentful paint, milliseconds" source="Same Lighthouse run. Lower is faster. These are one run each, not a median.">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={lighthouse} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" interval={0} angle={-55} textAnchor="end" height={80} tick={{ fill: ink, fontSize: 11 }} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="lcp" fill={ink} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Static export, kilobytes" source={calibreMetrics.bundles.source}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bundles}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink }} />
            <YAxis tick={{ fill: ink }} />
            <Tooltip />
            <Bar dataKey="kb" fill={gold} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="What the system contains" source={calibreMetrics.counts.source}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={counts}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} />
            <YAxis tick={{ fill: ink }} />
            <Tooltip />
            <Bar dataKey="value" fill={ink} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Contrast of the text pairs in use" source="Computed from the hex values in app/globals.css with the WCAG relative-luminance formula. The line is AA for normal text, 4.5:1.">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={calibreMetrics.contrast} margin={{ bottom: 72 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" interval={0} angle={-40} textAnchor="end" height={90} tick={{ fill: ink, fontSize: 11 }} />
            <YAxis tick={{ fill: ink }} />
            <Tooltip />
            <ReferenceLine y={4.5} stroke="#5c4a32" strokeDasharray="4 4" />
            <Bar dataKey="ratio" fill={gold} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Type scale, pixels at a 16px root" source="The minimum and maximum of each step in app/globals.css. Clamped steps show both ends.">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={calibreMetrics.typeScale}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} />
            <YAxis tick={{ fill: ink }} />
            <Tooltip />
            <Bar dataKey="min" fill="#d9d0c2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="max" fill={ink} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Spacing rhythm, pixels" source="--space-1 through --space-10. A 4-based scale.">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={calibreMetrics.spacing}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink }} />
            <YAxis tick={{ fill: ink }} />
            <Tooltip />
            <Bar dataKey="px" fill={gold} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <Chart title="Motion durations, milliseconds" source="--dur-1 through --dur-4 in app/globals.css. Reduced motion sets these aside.">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={calibreMetrics.motion}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink }} />
            <YAxis tick={{ fill: ink }} />
            <Tooltip />
            <Bar dataKey="ms" fill={ink} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <p className="calibre-note">
        No earlier version was rebuilt for this page, so there is no before-and-after bar. Every number above is from
        this build or from the tokens in the source, and each chart names that source.
      </p>
    </div>
  );
}
