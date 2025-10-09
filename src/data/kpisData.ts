export interface KPI {
  id: number;
  initiativeId: number;
  name: string;
  description: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  status: "on-track" | "at-risk" | "off-track";
  trackedBy: {
    type: "project" | "program" | "activity";
    id: number;
    name: string;
  }[];
  owner: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  lastUpdated: string;
  startDate: string;
  endDate: string;
}

export const kpis: KPI[] = [
  {
    id: 1,
    initiativeId: 1,
    name: "Security Compliance Rate",
    description: "Overall security compliance across all IT infrastructure projects",
    targetValue: "95",
    currentValue: "78",
    unit: "%",
    status: "on-track",
    trackedBy: [
      { type: "project", id: 1, name: "ISO 27001 Implementation" },
    ],
    owner: "John Smith",
    frequency: "monthly",
    lastUpdated: "2025-01-08",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
  },
  {
    id: 2,
    initiativeId: 1,
    name: "System Uptime",
    description: "Average uptime across all smart campus systems",
    targetValue: "99.5",
    currentValue: "97.8",
    unit: "%",
    status: "at-risk",
    trackedBy: [
      { type: "project", id: 2, name: "Smart Campus Infrastructure" },
      { type: "program", id: 1, name: "Campus Digitalization Program" },
    ],
    owner: "Sarah Johnson",
    frequency: "daily",
    lastUpdated: "2025-01-09",
    startDate: "2025-02-01",
    endDate: "2025-08-31",
  },
  {
    id: 3,
    initiativeId: 2,
    name: "User Adoption Rate",
    description: "Percentage of users actively using digital platforms",
    targetValue: "85",
    currentValue: "45",
    unit: "%",
    status: "off-track",
    trackedBy: [
      { type: "project", id: 3, name: "Unified Mobile App Development" },
      { type: "activity", id: 1, name: "User Training Sessions" },
    ],
    owner: "David Brown",
    frequency: "weekly",
    lastUpdated: "2025-01-08",
    startDate: "2025-01-10",
    endDate: "2025-07-15",
  },
];

export const getKPIsByInitiative = (initiativeId: number): KPI[] => {
  return kpis.filter(kpi => kpi.initiativeId === initiativeId);
};

export const getKPIProgress = (kpi: KPI): number => {
  const current = parseFloat(kpi.currentValue);
  const target = parseFloat(kpi.targetValue);
  return target > 0 ? Math.round((current / target) * 100) : 0;
};
