import { useMemo, useState } from "react";
import { parseISO, format, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  LayoutList,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Deliverable {
  id: number;
  name: string;
  status: string;
}

interface Milestone {
  id: number;
  name: string;
  dueDate: string;
  progress: number;
  status: "done" | "in-progress" | "todo" | "delayed";
  deliverables?: Deliverable[];
  baselineDueDate?: string;
  assignee?: string;
}

interface GanttChartProps {
  milestones: Milestone[];
  projectStartDate: string;
  projectEndDate: string;
}

const statusConfig = {
  done: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    fill: "bg-emerald-500",
    gradient: "from-emerald-500 to-emerald-400",
    icon: CheckCircle2,
    label: "Completed",
  },
  "in-progress": {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    fill: "bg-blue-500",
    gradient: "from-blue-500 to-blue-400",
    icon: Clock,
    label: "In Progress",
  },
  todo: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-500 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
    fill: "bg-slate-400",
    gradient: "from-slate-400 to-slate-300",
    icon: Clock,
    label: "To Do",
  },
  delayed: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
    fill: "bg-red-500",
    gradient: "from-red-500 to-red-400",
    icon: AlertCircle,
    label: "Delayed",
  },
};

const deliverableStatusConfig: Record<string, { dot: string; text: string }> = {
  done: { dot: "bg-emerald-500", text: "text-emerald-600" },
  "in-progress": { dot: "bg-blue-500", text: "text-blue-600" },
  todo: { dot: "bg-slate-400", text: "text-slate-500" },
};

export const GanttChart = ({ milestones, projectStartDate, projectEndDate }: GanttChartProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const projStart = parseISO(projectStartDate);
  const projEnd = parseISO(projectEndDate);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    milestones.forEach((m) => {
      if (m.deliverables && m.deliverables.length > 0) all[m.id] = true;
    });
    setExpandedRows(all);
  };

  const collapseAll = () => setExpandedRows({});

  const sorted = useMemo(
    () =>
      [...milestones].sort(
        (a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()
      ),
    [milestones]
  );

  const overallProgress =
    milestones.length > 0
      ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length)
      : 0;

  const completedCount = milestones.filter((m) => m.status === "done").length;
  const anyExpanded = Object.values(expandedRows).some(Boolean);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold">{milestones.length}</span>
            <span className="text-muted-foreground">milestones</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-semibold">
              {completedCount}/{milestones.length}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums">{overallProgress}%</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] px-2 gap-1"
          onClick={anyExpanded ? collapseAll : expandAll}
        >
          <LayoutList className="h-3 w-3" />
          {anyExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      {/* ─── Header ─── */}
      <div className="flex items-center px-4 py-2.5 border-b border-border bg-muted/20">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex-1">
          Milestone
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground w-24 text-center">
          Due Date
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground w-20 text-center">
          Status
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground w-20 text-right">
          Progress
        </span>
      </div>

      {/* ─── Rows ─── */}
      <div className="divide-y divide-border/30">
        {sorted.map((milestone, idx) => {
          const config = statusConfig[milestone.status] || statusConfig.todo;
          const StatusIcon = config.icon;
          const hasDeliverables = milestone.deliverables && milestone.deliverables.length > 0;
          const isExpanded = expandedRows[milestone.id];
          const dueDate = parseISO(milestone.dueDate);
          const daysLeft = differenceInDays(dueDate, new Date());

          return (
            <div key={milestone.id}>
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-3 transition-all duration-100 cursor-pointer hover:bg-accent/50 group"
                )}
                onClick={() => {
                  if (hasDeliverables) toggleRow(milestone.id);
                }}
              >
                {/* Row number */}
                <span className="text-[10px] text-muted-foreground/50 w-5 text-right tabular-nums flex-shrink-0">
                  {idx + 1}
                </span>

                {/* Expand toggle */}
                <div className="w-4 flex-shrink-0 flex items-center justify-center">
                  {hasDeliverables ? (
                    <span className="text-muted-foreground">
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </span>
                  ) : (
                    <div className="w-3" />
                  )}
                </div>

                {/* Status dot */}
                <div className="relative flex-shrink-0">
                  <div className={cn("h-2.5 w-2.5 rounded-full", config.dot)} />
                  {milestone.status === "in-progress" && (
                    <div
                      className={cn(
                        "absolute inset-0 h-2.5 w-2.5 rounded-full animate-ping opacity-20",
                        config.dot
                      )}
                    />
                  )}
                </div>

                {/* Name + metadata */}
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium text-foreground truncate block leading-tight">
                    {milestone.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {hasDeliverables && (
                      <span className="text-[9px] text-muted-foreground">
                        {milestone.deliverables!.length} deliverables
                      </span>
                    )}
                    {milestone.assignee && (
                      <span className="text-[9px] text-muted-foreground/60">
                        • {milestone.assignee}
                      </span>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="w-24 text-center flex-shrink-0">
                  <span className="text-[11px] font-medium text-foreground">
                    {format(dueDate, "MMM d, yyyy")}
                  </span>
                  {milestone.status !== "done" && (
                    <span
                      className={cn(
                        "block text-[9px] mt-0.5",
                        daysLeft < 0
                          ? "text-red-500 font-semibold"
                          : daysLeft <= 7
                          ? "text-amber-500"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {daysLeft < 0
                        ? `${Math.abs(daysLeft)}d overdue`
                        : daysLeft === 0
                        ? "Due today"
                        : `${daysLeft}d left`}
                    </span>
                  )}
                </div>

                {/* Status badge */}
                <div className="w-20 flex justify-center flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] h-5 px-2 gap-1 capitalize font-medium",
                      config.bg,
                      config.text,
                      config.border
                    )}
                  >
                    <StatusIcon className="h-2.5 w-2.5" />
                    {config.label}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-1.5 flex-shrink-0 w-20 justify-end">
                  <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all", config.gradient)}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold tabular-nums w-7 text-right",
                      milestone.progress === 100 ? "text-emerald-500" : "text-foreground"
                    )}
                  >
                    {milestone.progress}%
                  </span>
                </div>
              </div>

              {/* Expanded deliverables */}
              {isExpanded &&
                milestone.deliverables?.map((d) => {
                  const dCfg = deliverableStatusConfig[d.status] || deliverableStatusConfig.todo;
                  return (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 px-4 pl-16 py-2 border-t border-border/15 bg-muted/[0.04] hover:bg-muted/20 transition-colors"
                    >
                      <div className={cn("h-2 w-2 rounded-full flex-shrink-0", dCfg.dot)} />
                      <span className="text-[11px] text-muted-foreground truncate flex-1">
                        {d.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5 capitalize",
                          d.status === "done" &&
                            "border-emerald-500/20 text-emerald-600 bg-emerald-500/5",
                          d.status === "in-progress" &&
                            "border-blue-500/20 text-blue-600 bg-blue-500/5",
                          d.status === "todo" && "border-border text-muted-foreground"
                        )}
                      >
                        {d.status.replace("-", " ")}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/10">
        <div className="flex items-center gap-4">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", cfg.dot)} />
              <span className="text-[9px] text-muted-foreground font-medium">{cfg.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {format(projStart, "MMM d")} — {format(projEnd, "MMM d, yyyy")}
        </div>
      </div>
    </div>
  );
};
