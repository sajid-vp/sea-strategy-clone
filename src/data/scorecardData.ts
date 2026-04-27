import { AggregatedStatus } from "@/types/status";

export type Perspective = "Strategy" | "Delivery" | "People" | "Finance";

export interface PerspectiveScore {
  name: Perspective;
  score: number; // 0-100
  target: number;
  trend: "up" | "down" | "flat";
}

export interface ScorecardKPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: AggregatedStatus;
}

export interface ScorecardEntity {
  id: string;
  name: string;
  type: "institution" | "department" | "individual";
  parentId?: string;
  role?: string;
  department?: string;
  healthScore: number;
  onTrackPercentage: number;
  totals: {
    onTrack: number;
    atRisk: number;
    blocked: number;
    done: number;
    total: number;
  };
  perspectives: PerspectiveScore[];
  kpis: ScorecardKPI[];
}

export const institutionScorecard: ScorecardEntity = {
  id: "inst-1",
  name: "Acme Corporation",
  type: "institution",
  healthScore: 78,
  onTrackPercentage: 72,
  totals: { onTrack: 42, atRisk: 8, blocked: 4, done: 18, total: 72 },
  perspectives: [
    { name: "Strategy", score: 82, target: 85, trend: "up" },
    { name: "Delivery", score: 74, target: 80, trend: "up" },
    { name: "People", score: 88, target: 90, trend: "flat" },
    { name: "Finance", score: 69, target: 75, trend: "down" },
  ],
  kpis: [
    { name: "Goal Attainment", value: 78, target: 85, unit: "%", status: "at-risk" },
    { name: "Revenue Growth", value: 12.4, target: 15, unit: "%", status: "at-risk" },
    { name: "Employee Engagement", value: 4.3, target: 4.5, unit: "/5", status: "on-track" },
    { name: "Budget Utilization", value: 91, target: 95, unit: "%", status: "on-track" },
  ],
};

export const departmentScorecards: ScorecardEntity[] = [
  {
    id: "dept-it",
    name: "Information Technology",
    type: "department",
    parentId: "inst-1",
    healthScore: 84,
    onTrackPercentage: 80,
    totals: { onTrack: 12, atRisk: 2, blocked: 1, done: 5, total: 20 },
    perspectives: [
      { name: "Strategy", score: 86, target: 85, trend: "up" },
      { name: "Delivery", score: 82, target: 80, trend: "up" },
      { name: "People", score: 90, target: 90, trend: "flat" },
      { name: "Finance", score: 78, target: 75, trend: "up" },
    ],
    kpis: [
      { name: "System Uptime", value: 99.7, target: 99.9, unit: "%", status: "at-risk" },
      { name: "Incident Response", value: 18, target: 15, unit: "min", status: "at-risk" },
      { name: "Project On-Time Delivery", value: 88, target: 90, unit: "%", status: "on-track" },
      { name: "Security Score", value: 92, target: 95, unit: "%", status: "on-track" },
    ],
  },
  {
    id: "dept-ops",
    name: "Operations",
    type: "department",
    parentId: "inst-1",
    healthScore: 71,
    onTrackPercentage: 65,
    totals: { onTrack: 9, atRisk: 3, blocked: 2, done: 4, total: 18 },
    perspectives: [
      { name: "Strategy", score: 74, target: 85, trend: "flat" },
      { name: "Delivery", score: 68, target: 80, trend: "down" },
      { name: "People", score: 82, target: 90, trend: "flat" },
      { name: "Finance", score: 60, target: 75, trend: "down" },
    ],
    kpis: [
      { name: "Process Efficiency", value: 76, target: 85, unit: "%", status: "at-risk" },
      { name: "Cost per Unit", value: 1.32, target: 1.2, unit: "AED", status: "off-track" },
      { name: "Quality Score", value: 94, target: 95, unit: "%", status: "on-track" },
      { name: "Throughput", value: 820, target: 1000, unit: "u/d", status: "at-risk" },
    ],
  },
  {
    id: "dept-hr",
    name: "Human Resources",
    type: "department",
    parentId: "inst-1",
    healthScore: 89,
    onTrackPercentage: 86,
    totals: { onTrack: 11, atRisk: 1, blocked: 0, done: 6, total: 18 },
    perspectives: [
      { name: "Strategy", score: 88, target: 85, trend: "up" },
      { name: "Delivery", score: 85, target: 80, trend: "up" },
      { name: "People", score: 95, target: 90, trend: "up" },
      { name: "Finance", score: 82, target: 75, trend: "up" },
    ],
    kpis: [
      { name: "Retention Rate", value: 93, target: 90, unit: "%", status: "on-track" },
      { name: "Time to Hire", value: 28, target: 30, unit: "days", status: "on-track" },
      { name: "Training Hours", value: 42, target: 40, unit: "h", status: "on-track" },
      { name: "Engagement Score", value: 4.5, target: 4.5, unit: "/5", status: "on-track" },
    ],
  },
  {
    id: "dept-fin",
    name: "Finance",
    type: "department",
    parentId: "inst-1",
    healthScore: 76,
    onTrackPercentage: 70,
    totals: { onTrack: 10, atRisk: 2, blocked: 1, done: 3, total: 16 },
    perspectives: [
      { name: "Strategy", score: 80, target: 85, trend: "up" },
      { name: "Delivery", score: 72, target: 80, trend: "flat" },
      { name: "People", score: 84, target: 90, trend: "flat" },
      { name: "Finance", score: 70, target: 75, trend: "up" },
    ],
    kpis: [
      { name: "Budget Variance", value: 4.2, target: 5, unit: "%", status: "on-track" },
      { name: "Forecast Accuracy", value: 88, target: 90, unit: "%", status: "at-risk" },
      { name: "Days Sales Outstanding", value: 42, target: 35, unit: "days", status: "at-risk" },
      { name: "Cost Savings", value: 1.8, target: 2.0, unit: "M", status: "at-risk" },
    ],
  },
];

export const individualScorecards: ScorecardEntity[] = [
  {
    id: "ind-1",
    name: "John Smith",
    type: "individual",
    parentId: "dept-it",
    role: "IT Security Lead",
    department: "Information Technology",
    healthScore: 86,
    onTrackPercentage: 82,
    totals: { onTrack: 5, atRisk: 1, blocked: 0, done: 3, total: 9 },
    perspectives: [
      { name: "Strategy", score: 88, target: 85, trend: "up" },
      { name: "Delivery", score: 84, target: 80, trend: "up" },
      { name: "People", score: 90, target: 90, trend: "flat" },
      { name: "Finance", score: 82, target: 75, trend: "up" },
    ],
    kpis: [
      { name: "Project Delivery", value: 92, target: 90, unit: "%", status: "on-track" },
      { name: "KR Attainment", value: 78, target: 80, unit: "%", status: "at-risk" },
      { name: "Peer Rating", value: 4.4, target: 4.0, unit: "/5", status: "on-track" },
      { name: "Certifications", value: 3, target: 3, unit: "", status: "on-track" },
    ],
  },
  {
    id: "ind-2",
    name: "Sarah Johnson",
    type: "individual",
    parentId: "dept-it",
    role: "Senior Engineer",
    department: "Information Technology",
    healthScore: 79,
    onTrackPercentage: 75,
    totals: { onTrack: 4, atRisk: 1, blocked: 1, done: 2, total: 8 },
    perspectives: [
      { name: "Strategy", score: 78, target: 85, trend: "flat" },
      { name: "Delivery", score: 80, target: 80, trend: "up" },
      { name: "People", score: 86, target: 90, trend: "flat" },
      { name: "Finance", score: 72, target: 75, trend: "flat" },
    ],
    kpis: [
      { name: "Velocity", value: 38, target: 40, unit: "pts", status: "on-track" },
      { name: "Code Quality", value: 92, target: 95, unit: "%", status: "at-risk" },
      { name: "KR Attainment", value: 74, target: 80, unit: "%", status: "at-risk" },
      { name: "Mentoring Hours", value: 12, target: 10, unit: "h", status: "on-track" },
    ],
  },
  {
    id: "ind-3",
    name: "Mike Chen",
    type: "individual",
    parentId: "dept-ops",
    role: "Operations Manager",
    department: "Operations",
    healthScore: 68,
    onTrackPercentage: 60,
    totals: { onTrack: 3, atRisk: 2, blocked: 1, done: 2, total: 8 },
    perspectives: [
      { name: "Strategy", score: 70, target: 85, trend: "flat" },
      { name: "Delivery", score: 64, target: 80, trend: "down" },
      { name: "People", score: 80, target: 90, trend: "flat" },
      { name: "Finance", score: 58, target: 75, trend: "down" },
    ],
    kpis: [
      { name: "Throughput", value: 760, target: 1000, unit: "u/d", status: "off-track" },
      { name: "Quality Score", value: 91, target: 95, unit: "%", status: "at-risk" },
      { name: "KR Attainment", value: 66, target: 80, unit: "%", status: "off-track" },
      { name: "Team Engagement", value: 4.0, target: 4.3, unit: "/5", status: "at-risk" },
    ],
  },
  {
    id: "ind-4",
    name: "Emma Davis",
    type: "individual",
    parentId: "dept-hr",
    role: "HR Business Partner",
    department: "Human Resources",
    healthScore: 91,
    onTrackPercentage: 90,
    totals: { onTrack: 6, atRisk: 0, blocked: 0, done: 3, total: 9 },
    perspectives: [
      { name: "Strategy", score: 90, target: 85, trend: "up" },
      { name: "Delivery", score: 88, target: 80, trend: "up" },
      { name: "People", score: 96, target: 90, trend: "up" },
      { name: "Finance", score: 84, target: 75, trend: "up" },
    ],
    kpis: [
      { name: "Hires Closed", value: 18, target: 15, unit: "", status: "on-track" },
      { name: "Retention Rate", value: 95, target: 90, unit: "%", status: "on-track" },
      { name: "KR Attainment", value: 88, target: 80, unit: "%", status: "on-track" },
      { name: "Engagement Survey", value: 4.6, target: 4.5, unit: "/5", status: "on-track" },
    ],
  },
  {
    id: "ind-5",
    name: "David Lee",
    type: "individual",
    parentId: "dept-fin",
    role: "Finance Controller",
    department: "Finance",
    healthScore: 74,
    onTrackPercentage: 70,
    totals: { onTrack: 4, atRisk: 1, blocked: 0, done: 2, total: 7 },
    perspectives: [
      { name: "Strategy", score: 78, target: 85, trend: "up" },
      { name: "Delivery", score: 72, target: 80, trend: "flat" },
      { name: "People", score: 82, target: 90, trend: "flat" },
      { name: "Finance", score: 70, target: 75, trend: "up" },
    ],
    kpis: [
      { name: "Forecast Accuracy", value: 87, target: 90, unit: "%", status: "at-risk" },
      { name: "Budget Variance", value: 4.5, target: 5, unit: "%", status: "on-track" },
      { name: "KR Attainment", value: 72, target: 80, unit: "%", status: "at-risk" },
      { name: "Reports On-Time", value: 96, target: 100, unit: "%", status: "on-track" },
    ],
  },
];

// =====================================================================
// Strategy ↔ OKR ↔ Execution model
// Initiatives are multi-year strategic bets; OKRs are this year's
// commitments by departments that contribute to those initiatives.
// Individuals contribute via Tasks → Projects → KRs → Initiatives.
// =====================================================================

export interface InitiativeKpiPoint {
  year: number;
  value: number;
}

export interface InitiativeKpi {
  name: string;
  unit: string;
  baseline: number;
  target: number;
  trend: InitiativeKpiPoint[]; // multi-year actuals
  status: AggregatedStatus;
}

export interface StrategicInitiative {
  id: string;
  name: string;
  description: string;
  importance: "critical" | "high" | "medium";
  startYear: number;
  endYear: number;
  expectedProgress: number; // 0-100, where we should be by now
  actualProgress: number;   // 0-100
  kpis: InitiativeKpi[];
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  actual: number;
  unit: string;
  progress: number; // 0-100
  confidence: "high" | "medium" | "low";
  status: AggregatedStatus;
}

export interface Objective {
  id: string;
  title: string;
  departmentId: string;
  year: number;
  progress: number; // 0-100
  status: AggregatedStatus;
  keyResults: KeyResult[];
  // OKR → Initiative mapping
  contributions: Array<{
    initiativeId: string;
    weight: number; // % of this objective's effort dedicated to the initiative
    impact: "direct" | "supporting";
  }>;
}

export interface IndividualTask {
  id: string;
  title: string;
  individualId: string;
  keyResultId: string; // every task ideally maps to a KR
  share: number;       // % of this KR the individual is accountable for
  progress: number;    // 0-100
  status: AggregatedStatus;
}

// ---------------------- Initiatives (multi-year) ----------------------

export const strategicInitiatives: StrategicInitiative[] = [
  {
    id: "init-1",
    name: "Develop & Implement IT Infrastructure",
    description: "Modernize core IT platforms, security and data foundations.",
    importance: "critical",
    startYear: 2024,
    endYear: 2026,
    expectedProgress: 65,
    actualProgress: 58,
    kpis: [
      {
        name: "Security Compliance",
        unit: "%",
        baseline: 60,
        target: 95,
        status: "on-track",
        trend: [
          { year: 2024, value: 72 },
          { year: 2025, value: 84 },
          { year: 2026, value: 90 },
        ],
      },
      {
        name: "System Uptime",
        unit: "%",
        baseline: 98.5,
        target: 99.9,
        status: "at-risk",
        trend: [
          { year: 2024, value: 99.1 },
          { year: 2025, value: 99.5 },
          { year: 2026, value: 99.7 },
        ],
      },
    ],
  },
  {
    id: "init-2",
    name: "Operational Excellence Program",
    description: "Lift throughput, quality and unit economics across operations.",
    importance: "high",
    startYear: 2024,
    endYear: 2026,
    expectedProgress: 60,
    actualProgress: 44,
    kpis: [
      {
        name: "Throughput",
        unit: "u/d",
        baseline: 600,
        target: 1000,
        status: "at-risk",
        trend: [
          { year: 2024, value: 700 },
          { year: 2025, value: 820 },
          { year: 2026, value: 870 },
        ],
      },
      {
        name: "Cost per Unit",
        unit: "AED",
        baseline: 1.6,
        target: 1.2,
        status: "off-track",
        trend: [
          { year: 2024, value: 1.45 },
          { year: 2025, value: 1.32 },
          { year: 2026, value: 1.3 },
        ],
      },
    ],
  },
  {
    id: "init-3",
    name: "People & Culture Transformation",
    description: "Build a high-engagement, high-retention workforce.",
    importance: "high",
    startYear: 2023,
    endYear: 2026,
    expectedProgress: 70,
    actualProgress: 74,
    kpis: [
      {
        name: "Engagement Score",
        unit: "/5",
        baseline: 3.8,
        target: 4.5,
        status: "on-track",
        trend: [
          { year: 2024, value: 4.1 },
          { year: 2025, value: 4.3 },
          { year: 2026, value: 4.4 },
        ],
      },
      {
        name: "Retention Rate",
        unit: "%",
        baseline: 82,
        target: 92,
        status: "on-track",
        trend: [
          { year: 2024, value: 88 },
          { year: 2025, value: 91 },
          { year: 2026, value: 93 },
        ],
      },
    ],
  },
  {
    id: "init-4",
    name: "Financial Resilience & Growth",
    description: "Strengthen forecasting, working capital and growth funding.",
    importance: "critical",
    startYear: 2024,
    endYear: 2026,
    expectedProgress: 55,
    actualProgress: 48,
    kpis: [
      {
        name: "Forecast Accuracy",
        unit: "%",
        baseline: 78,
        target: 95,
        status: "at-risk",
        trend: [
          { year: 2024, value: 84 },
          { year: 2025, value: 88 },
          { year: 2026, value: 89 },
        ],
      },
      {
        name: "Cost Savings",
        unit: "M",
        baseline: 0.5,
        target: 2.5,
        status: "at-risk",
        trend: [
          { year: 2024, value: 1.1 },
          { year: 2025, value: 1.8 },
          { year: 2026, value: 2.0 },
        ],
      },
    ],
  },
];

// ----------------------- Department OKRs (2026) -----------------------

export const departmentObjectives: Objective[] = [
  // IT
  {
    id: "obj-it-1",
    title: "Achieve enterprise-grade security posture",
    departmentId: "dept-it",
    year: 2026,
    progress: 78,
    status: "on-track",
    contributions: [{ initiativeId: "init-1", weight: 60, impact: "direct" }],
    keyResults: [
      { id: "kr-it-1a", title: "Reach 95% ISO 27001 control coverage", target: 95, actual: 88, unit: "%", progress: 88, confidence: "high", status: "on-track" },
      { id: "kr-it-1b", title: "Reduce critical incidents to <5/quarter", target: 5, actual: 6, unit: "", progress: 80, confidence: "medium", status: "at-risk" },
    ],
  },
  {
    id: "obj-it-2",
    title: "Modernize core platform reliability",
    departmentId: "dept-it",
    year: 2026,
    progress: 65,
    status: "at-risk",
    contributions: [
      { initiativeId: "init-1", weight: 35, impact: "direct" },
      { initiativeId: "init-4", weight: 10, impact: "supporting" },
    ],
    keyResults: [
      { id: "kr-it-2a", title: "Achieve 99.9% uptime", target: 99.9, actual: 99.7, unit: "%", progress: 70, confidence: "medium", status: "at-risk" },
      { id: "kr-it-2b", title: "Reduce mean response time to <15 min", target: 15, actual: 18, unit: "min", progress: 60, confidence: "medium", status: "at-risk" },
    ],
  },
  // Operations
  {
    id: "obj-ops-1",
    title: "Lift throughput and quality",
    departmentId: "dept-ops",
    year: 2026,
    progress: 58,
    status: "at-risk",
    contributions: [{ initiativeId: "init-2", weight: 70, impact: "direct" }],
    keyResults: [
      { id: "kr-ops-1a", title: "Hit 1000 u/d throughput", target: 1000, actual: 820, unit: "u/d", progress: 65, confidence: "low", status: "at-risk" },
      { id: "kr-ops-1b", title: "Quality score ≥ 95%", target: 95, actual: 94, unit: "%", progress: 90, confidence: "high", status: "on-track" },
    ],
  },
  {
    id: "obj-ops-2",
    title: "Reduce unit cost",
    departmentId: "dept-ops",
    year: 2026,
    progress: 42,
    status: "off-track",
    contributions: [
      { initiativeId: "init-2", weight: 25, impact: "direct" },
      { initiativeId: "init-4", weight: 15, impact: "supporting" },
    ],
    keyResults: [
      { id: "kr-ops-2a", title: "Cost per unit ≤ 1.20 AED", target: 1.2, actual: 1.32, unit: "AED", progress: 45, confidence: "low", status: "off-track" },
    ],
  },
  // HR
  {
    id: "obj-hr-1",
    title: "Build a high-engagement workforce",
    departmentId: "dept-hr",
    year: 2026,
    progress: 88,
    status: "on-track",
    contributions: [{ initiativeId: "init-3", weight: 70, impact: "direct" }],
    keyResults: [
      { id: "kr-hr-1a", title: "Engagement ≥ 4.5/5", target: 4.5, actual: 4.5, unit: "/5", progress: 100, confidence: "high", status: "done" },
      { id: "kr-hr-1b", title: "Retention ≥ 92%", target: 92, actual: 93, unit: "%", progress: 100, confidence: "high", status: "done" },
    ],
  },
  {
    id: "obj-hr-2",
    title: "Accelerate hiring & capability",
    departmentId: "dept-hr",
    year: 2026,
    progress: 76,
    status: "on-track",
    contributions: [{ initiativeId: "init-3", weight: 25, impact: "supporting" }],
    keyResults: [
      { id: "kr-hr-2a", title: "Time to hire ≤ 30 days", target: 30, actual: 28, unit: "days", progress: 100, confidence: "high", status: "done" },
      { id: "kr-hr-2b", title: "Training hours ≥ 40 / employee", target: 40, actual: 42, unit: "h", progress: 100, confidence: "high", status: "done" },
    ],
  },
  // Finance
  {
    id: "obj-fin-1",
    title: "Improve forecasting & control",
    departmentId: "dept-fin",
    year: 2026,
    progress: 70,
    status: "at-risk",
    contributions: [{ initiativeId: "init-4", weight: 60, impact: "direct" }],
    keyResults: [
      { id: "kr-fin-1a", title: "Forecast accuracy ≥ 90%", target: 90, actual: 88, unit: "%", progress: 85, confidence: "medium", status: "at-risk" },
      { id: "kr-fin-1b", title: "Budget variance ≤ 5%", target: 5, actual: 4.2, unit: "%", progress: 100, confidence: "high", status: "done" },
    ],
  },
  {
    id: "obj-fin-2",
    title: "Drive cost savings",
    departmentId: "dept-fin",
    year: 2026,
    progress: 60,
    status: "at-risk",
    contributions: [
      { initiativeId: "init-4", weight: 30, impact: "direct" },
      { initiativeId: "init-2", weight: 10, impact: "supporting" },
    ],
    keyResults: [
      { id: "kr-fin-2a", title: "Achieve AED 2.0M cost savings", target: 2.0, actual: 1.8, unit: "M", progress: 90, confidence: "medium", status: "on-track" },
    ],
  },
];

// ----------------------- Individual tasks → KR mapping -----------------------

export const individualTasks: IndividualTask[] = [
  // John Smith — IT Security Lead
  { id: "tsk-1", title: "Roll out ISO 27001 control set v2", individualId: "ind-1", keyResultId: "kr-it-1a", share: 60, progress: 85, status: "on-track" },
  { id: "tsk-2", title: "Lead incident response retros", individualId: "ind-1", keyResultId: "kr-it-1b", share: 40, progress: 72, status: "at-risk" },
  { id: "tsk-3", title: "Harden production access policies", individualId: "ind-1", keyResultId: "kr-it-1a", share: 25, progress: 90, status: "on-track" },
  // Sarah Johnson — Senior Engineer
  { id: "tsk-4", title: "Implement HA failover for core services", individualId: "ind-2", keyResultId: "kr-it-2a", share: 50, progress: 68, status: "at-risk" },
  { id: "tsk-5", title: "Reduce on-call MTTR via runbooks", individualId: "ind-2", keyResultId: "kr-it-2b", share: 40, progress: 60, status: "at-risk" },
  { id: "tsk-6", title: "Patch automation pipeline", individualId: "ind-2", keyResultId: "kr-it-1a", share: 15, progress: 80, status: "on-track" },
  // Mike Chen — Operations Manager
  { id: "tsk-7", title: "Bottleneck removal on line B", individualId: "ind-3", keyResultId: "kr-ops-1a", share: 50, progress: 55, status: "at-risk" },
  { id: "tsk-8", title: "Quality SOP refresh", individualId: "ind-3", keyResultId: "kr-ops-1b", share: 40, progress: 88, status: "on-track" },
  { id: "tsk-9", title: "Supplier renegotiation for input cost", individualId: "ind-3", keyResultId: "kr-ops-2a", share: 35, progress: 40, status: "off-track" },
  // Emma Davis — HR BP
  { id: "tsk-10", title: "Roll out engagement pulse program", individualId: "ind-4", keyResultId: "kr-hr-1a", share: 50, progress: 100, status: "done" },
  { id: "tsk-11", title: "Manager coaching cohort", individualId: "ind-4", keyResultId: "kr-hr-1b", share: 35, progress: 95, status: "on-track" },
  { id: "tsk-12", title: "Hiring funnel acceleration", individualId: "ind-4", keyResultId: "kr-hr-2a", share: 40, progress: 100, status: "done" },
  // David Lee — Finance Controller
  { id: "tsk-13", title: "Rebuild rolling forecast model", individualId: "ind-5", keyResultId: "kr-fin-1a", share: 55, progress: 78, status: "at-risk" },
  { id: "tsk-14", title: "Monthly variance review cadence", individualId: "ind-5", keyResultId: "kr-fin-1b", share: 40, progress: 100, status: "done" },
  { id: "tsk-15", title: "Vendor cost rationalization", individualId: "ind-5", keyResultId: "kr-fin-2a", share: 30, progress: 82, status: "on-track" },
];

// ----------------------- Helpers -----------------------

export const getInitiative = (id: string) =>
  strategicInitiatives.find((i) => i.id === id);

export const getDepartment = (id: string) =>
  departmentScorecards.find((d) => d.id === id);

export const getIndividual = (id: string) =>
  individualScorecards.find((d) => d.id === id);

export const getKeyResult = (id: string): KeyResult | undefined => {
  for (const o of departmentObjectives) {
    const kr = o.keyResults.find((k) => k.id === id);
    if (kr) return kr;
  }
  return undefined;
};

export const getObjectiveOfKR = (krId: string): Objective | undefined =>
  departmentObjectives.find((o) => o.keyResults.some((k) => k.id === krId));

export const objectivesByDepartment = (deptId: string) =>
  departmentObjectives.filter((o) => o.departmentId === deptId);

export const tasksByIndividual = (indId: string) =>
  individualTasks.filter((t) => t.individualId === indId);

/**
 * For an initiative, compute aggregated OKR contribution:
 *  - For each contributing objective, weight = contribution.weight (0..100)
 *  - Delivered = weight * (objective.progress / 100)
 *  - Returns total weight booked and total delivered (both in "weight points")
 */
export function initiativeOkrContribution(initiativeId: string) {
  const items = departmentObjectives
    .map((o) => {
      const c = o.contributions.find((x) => x.initiativeId === initiativeId);
      if (!c) return null;
      const dept = getDepartment(o.departmentId);
      return {
        objective: o,
        department: dept,
        weight: c.weight,
        impact: c.impact,
        delivered: (c.weight * o.progress) / 100,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  const totalDelivered = items.reduce((s, i) => s + i.delivered, 0);
  const contributionPct = totalWeight > 0 ? Math.round((totalDelivered / totalWeight) * 100) : 0;

  return { items, totalWeight, totalDelivered, contributionPct };
}

/**
 * For a department, compute how much it contributes to each initiative
 * it touches via its objectives.
 */
export function departmentInitiativeContributions(deptId: string) {
  const objs = objectivesByDepartment(deptId);
  const map = new Map<string, { weight: number; delivered: number; impact: "direct" | "supporting" }>();
  for (const o of objs) {
    for (const c of o.contributions) {
      const cur = map.get(c.initiativeId) ?? { weight: 0, delivered: 0, impact: c.impact };
      cur.weight += c.weight;
      cur.delivered += (c.weight * o.progress) / 100;
      // "direct" wins over "supporting"
      if (c.impact === "direct") cur.impact = "direct";
      map.set(c.initiativeId, cur);
    }
  }
  return Array.from(map.entries())
    .map(([initiativeId, v]) => ({
      initiative: getInitiative(initiativeId)!,
      weight: v.weight,
      delivered: v.delivered,
      contributionPct: v.weight > 0 ? Math.round((v.delivered / v.weight) * 100) : 0,
      impact: v.impact,
    }))
    .filter((x) => x.initiative);
}

/**
 * Aggregated annual OKR execution snapshot across all departments.
 */
export function annualOkrSnapshot() {
  const all = departmentObjectives;
  const allKRs = all.flatMap((o) => o.keyResults);
  const onTrack = allKRs.filter((k) => k.status === "on-track" || k.status === "done").length;
  const atRisk = allKRs.filter((k) => k.status === "at-risk").length;
  const offTrack = allKRs.filter((k) => k.status === "off-track").length;
  const avgProgress = Math.round(allKRs.reduce((s, k) => s + k.progress, 0) / Math.max(1, allKRs.length));
  return {
    totalObjectives: all.length,
    totalKRs: allKRs.length,
    onTrack,
    atRisk,
    offTrack,
    avgProgress,
    onTrackPct: Math.round((onTrack / Math.max(1, allKRs.length)) * 100),
  };
}