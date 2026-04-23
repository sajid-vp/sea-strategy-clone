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