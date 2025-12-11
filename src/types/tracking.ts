import { AggregatedStatus } from "./status";

export type TrackingSourceType = 
  | "program-kpi"
  | "project-kpi"
  | "project-progress"
  | "milestone-rate"
  | "task-rate"
  | "manual";

export type AggregationMethod = "sum" | "average" | "weighted" | "max" | "min";

export interface TrackingSource {
  id: string;
  type: TrackingSourceType;
  entityId: number;
  entityName: string;
  kpiId?: string;
  kpiName?: string;
  weight?: number; // For weighted aggregation
  currentValue: number;
  unit?: string;
}

export interface StructuredKPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
}

export interface TrackingConfig {
  sources: TrackingSource[];
  aggregationMethod: AggregationMethod;
  manualOverride?: number;
  isAutoTracked: boolean;
}
