import { BaseStatus, AggregatedStatus } from "./status";

export interface InitiativeObjective {
  id: number;
  title: string;
  description: string;
  year: number;
  status: AggregatedStatus;
  progress: number;
  owner: string;
  keyResultIds: number[];
}

export interface KeyResult {
  id: number;
  objectiveId: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: AggregatedStatus;
  progress: number;
  owner: string;
  startDate: string;
  endDate: string;
  linkedProjectIds: number[];
  linkedProjectKPIs: Array<{
    projectId: number;
    projectName: string;
    kpiName: string;
    kpiValue: number;
  }>;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  lastUpdated: string;
}

export interface Initiative {
  id: number;
  title: string;
  year: number;
  status: BaseStatus;
  owner: string;
  team: string[];
  objectives: InitiativeObjective[];
  keyResults: KeyResult[];
  startDate?: string;
  endDate?: string;
  description?: string;
}
