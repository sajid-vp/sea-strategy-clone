import {
  strategicInitiatives,
  departmentObjectives,
  institutionScorecard,
  type StrategicInitiative,
} from "@/data/scorecardData";

/**
 * Year-aware metric helpers. Multi-year KPI trends on initiatives are the
 * source of truth; OKRs are anchored to their own `year` field.
 */

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

/** Linear interpolation from baseline (year-1) → target across the initiative window. */
const expectedAtYear = (init: StrategicInitiative, year: number) => {
  const span = Math.max(1, init.endYear - init.startYear);
  const pos = clamp(((year - init.startYear) / span) * 100);
  return Math.round(pos);
};

/** Map a KPI's year value into a 0–100 "progress vs target" score. */
const kpiProgressAtYear = (
  kpi: StrategicInitiative["kpis"][number],
  year: number,
) => {
  const point = kpi.trend.find((p) => p.year === year);
  if (!point) return null;
  const span = kpi.target - kpi.baseline;
  if (span === 0) return 100;
  // Works for both "increase" and "decrease" KPIs
  const pct = ((point.value - kpi.baseline) / span) * 100;
  return clamp(Math.round(pct));
};

/** Initiative actual progress for a year, averaged across its KPIs. */
export const initiativeActualAtYear = (init: StrategicInitiative, year: number) => {
  const scores = init.kpis
    .map((k) => kpiProgressAtYear(k, year))
    .filter((v): v is number => v !== null);
  if (scores.length === 0) {
    // fall back to the live actualProgress on the latest year
    return year >= init.endYear ? init.actualProgress : 0;
  }
  return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
};

export const initiativeExpectedAtYear = (init: StrategicInitiative, year: number) =>
  expectedAtYear(init, year);

/** Initiatives meeting plan in a given year. */
export const initiativesOnPlanAtYear = (year: number) => {
  const items = strategicInitiatives.filter(
    (i) => year >= i.startYear && year <= i.endYear,
  );
  const onPlan = items.filter(
    (i) => initiativeActualAtYear(i, year) >= initiativeExpectedAtYear(i, year),
  ).length;
  return { onPlan, total: items.length, items };
};

/** Aggregated institutional health for a year (average of initiative actuals). */
export const institutionHealthAtYear = (year: number) => {
  const items = strategicInitiatives.filter(
    (i) => year >= i.startYear && year <= i.endYear,
  );
  if (items.length === 0) return institutionScorecard.healthScore;
  const avg =
    items.reduce((s, i) => s + initiativeActualAtYear(i, year), 0) / items.length;
  return Math.round(avg);
};

/**
 * Annual OKR snapshot for a year. Currently OKRs only exist for 2026 in mock
 * data — for prior years we derive a proportional snapshot from the
 * institutional health YoY so the UI feels coherent.
 */
export const annualOkrSnapshotAtYear = (year: number) => {
  const allObjs = departmentObjectives.filter((o) => o.year === year);
  if (allObjs.length > 0) {
    const krs = allObjs.flatMap((o) => o.keyResults);
    const onTrack = krs.filter(
      (k) => k.status === "on-track" || k.status === "done",
    ).length;
    const atRisk = krs.filter((k) => k.status === "at-risk").length;
    const offTrack = krs.filter((k) => k.status === "off-track").length;
    return {
      totalObjectives: allObjs.length,
      totalKRs: krs.length,
      onTrack,
      atRisk,
      offTrack,
      onTrackPct: krs.length > 0 ? Math.round((onTrack / krs.length) * 100) : 0,
    };
  }
  // Derive a synthetic prior-year snapshot from health-at-year ratio
  const latestObjs = departmentObjectives;
  const latestKRs = latestObjs.flatMap((o) => o.keyResults);
  const latestOnTrack = latestKRs.filter(
    (k) => k.status === "on-track" || k.status === "done",
  ).length;
  const latestPct =
    latestKRs.length > 0 ? latestOnTrack / latestKRs.length : 0;
  const latestYear = Math.max(...departmentObjectives.map((o) => o.year));
  const ratio =
    institutionHealthAtYear(year) /
    Math.max(1, institutionHealthAtYear(latestYear));
  const projectedPct = clamp(latestPct * ratio);
  const onTrack = Math.round(latestKRs.length * projectedPct);
  return {
    totalObjectives: latestObjs.length,
    totalKRs: latestKRs.length,
    onTrack,
    atRisk: Math.round(latestKRs.length * 0.18 * (2 - ratio)),
    offTrack: Math.max(0, latestKRs.length - onTrack - 3),
    onTrackPct: Math.round(projectedPct * 100),
  };
};

/** Department OKR delivery % for a year (uses annual snapshot logic per dept). */
export const departmentOkrDeliveryAtYear = (deptId: string, year: number) => {
  const objs = departmentObjectives.filter(
    (o) => o.departmentId === deptId && o.year === year,
  );
  if (objs.length === 0) {
    // synthetic prior-year — scale from latest using institutional ratio
    const latestObjs = departmentObjectives.filter((o) => o.departmentId === deptId);
    const krs = latestObjs.flatMap((o) => o.keyResults);
    const onTrack = krs.filter(
      (k) => k.status === "on-track" || k.status === "done",
    ).length;
    const latestPct = krs.length > 0 ? onTrack / krs.length : 0;
    const latestYear = Math.max(
      ...departmentObjectives.map((o) => o.year),
      year,
    );
    const ratio =
      institutionHealthAtYear(year) /
      Math.max(1, institutionHealthAtYear(latestYear));
    return {
      pct: Math.round(clamp(latestPct * ratio) * 100),
      objectives: latestObjs.length,
      keyResults: krs.length,
    };
  }
  const krs = objs.flatMap((o) => o.keyResults);
  const onTrack = krs.filter(
    (k) => k.status === "on-track" || k.status === "done",
  ).length;
  return {
    pct: krs.length > 0 ? Math.round((onTrack / krs.length) * 100) : 0,
    objectives: objs.length,
    keyResults: krs.length,
  };
};

/** Year-over-year growth in pts (current − previous). */
export const yoy = (current: number, previous: number | null) => {
  if (previous === null || previous === undefined) return null;
  return Math.round((current - previous) * 10) / 10;
};