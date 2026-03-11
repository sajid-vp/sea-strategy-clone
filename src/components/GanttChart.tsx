import { useMemo, useState, useRef, useEffect } from "react";
import {
  differenceInDays,
  parseISO,
  format,
  addDays,
  eachMonthOfInterval,
  isSameMonth,
  isWeekend,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Search,
  CalendarDays,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  name: string;
  status: "done" | "in-progress" | "todo" | "blocked" | "in-review";
  priority: "high" | "medium" | "low";
  assignee: string;
  dependencies: number[];
  subtasks: any[];
}

interface GanttChartProps {
  milestones: any[];
  projectStartDate: string;
  projectEndDate: string;
  tasks?: Task[];
}

const statusConfig: Record<string, {
  gradient: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  fill: string;
  barColor: string;
  icon: any;
  label: string;
}> = {
  done: {
    gradient: "from-emerald-500 to-emerald-400",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
    fill: "bg-emerald-500",
    barColor: "hsl(152, 69%, 41%)",
    icon: CheckCircle2,
    label: "Done",
  },
  "in-progress": {
    gradient: "from-blue-500 to-blue-400",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
    fill: "bg-blue-500",
    barColor: "hsl(217, 91%, 60%)",
    icon: Clock,
    label: "In Progress",
  },
  "in-review": {
    gradient: "from-violet-500 to-violet-400",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/30",
    dot: "bg-violet-500",
    fill: "bg-violet-500",
    barColor: "hsl(263, 70%, 58%)",
    icon: Search,
    label: "In Review",
  },
  blocked: {
    gradient: "from-red-500 to-red-400",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-500",
    fill: "bg-red-500",
    barColor: "hsl(0, 84%, 60%)",
    icon: Ban,
    label: "Blocked",
  },
  todo: {
    gradient: "from-slate-400 to-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-500 dark:text-slate-400",
    border: "border-slate-300 dark:border-slate-600",
    dot: "bg-slate-400",
    fill: "bg-slate-400",
    barColor: "hsl(215, 14%, 65%)",
    icon: Clock,
    label: "To Do",
  },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  high: { color: "text-red-500", label: "High" },
  medium: { color: "text-amber-500", label: "Medium" },
  low: { color: "text-muted-foreground", label: "Low" },
};

const ROW_HEIGHT = 48;
const SIDEBAR_WIDTH = 300;
const HEADER_HEIGHT = 48;

export const GanttChart = ({ milestones, projectStartDate, projectEndDate, tasks }: GanttChartProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const projStart = parseISO(projectStartDate);
  const projEnd = parseISO(projectEndDate);
  const totalDays = differenceInDays(projEnd, projStart) || 1;

  // Derive task list from milestones if no tasks prop
  const taskList: Task[] = useMemo(() => {
    if (tasks && tasks.length > 0) return tasks;
    // Fallback: convert milestones to tasks
    return milestones.map((m) => ({
      id: m.id,
      name: m.name,
      status: m.status as Task["status"],
      priority: "medium" as const,
      assignee: "",
      dependencies: [],
      subtasks: [],
    }));
  }, [tasks, milestones]);

  // Compute bars: distribute tasks across the project timeline proportionally
  const bars = useMemo(() => {
    const count = taskList.length;
    if (count === 0) return [];

    // Each task gets an equal slice of the timeline, shifted by dependencies
    const sliceDays = Math.floor(totalDays / count);
    const taskMap = new Map<number, number>();
    taskList.forEach((t, i) => taskMap.set(t.id, i));

    return taskList.map((task, idx) => {
      // Start after latest dependency ends, or at proportional position
      let startDay = idx * sliceDays;
      if (task.dependencies.length > 0) {
        const depEnds = task.dependencies
          .map((depId) => {
            const depIdx = taskMap.get(depId);
            return depIdx !== undefined ? (depIdx + 1) * sliceDays : 0;
          })
          .filter(Boolean);
        if (depEnds.length > 0) startDay = Math.max(startDay, Math.max(...depEnds));
      }

      const endDay = Math.min(startDay + sliceDays, totalDays);
      const leftPct = (startDay / totalDays) * 100;
      const widthPct = Math.max(((endDay - startDay) / totalDays) * 100, 3);

      const startDate = addDays(projStart, startDay);
      const endDate = addDays(projStart, endDay);

      // Progress based on status
      const progress =
        task.status === "done" ? 100 :
        task.status === "in-progress" ? 55 :
        task.status === "in-review" ? 80 :
        task.status === "blocked" ? 20 : 0;

      return { ...task, leftPct, widthPct, startDate, endDate, progress, startDay, endDay };
    });
  }, [taskList, totalDays, projStart]);

  // Month headers
  const months = useMemo(
    () => eachMonthOfInterval({ start: projStart, end: projEnd }),
    [projectStartDate, projectEndDate]
  );

  // Weekend shading
  const weekendDays = useMemo(() => {
    try {
      return eachDayOfInterval({ start: projStart, end: projEnd })
        .filter(isWeekend)
        .map((d) => ({
          leftPct: (differenceInDays(d, projStart) / totalDays) * 100,
          widthPct: (1 / totalDays) * 100,
        }));
    } catch { return []; }
  }, [projStart, projEnd, totalDays]);

  // Today marker
  const todayPct = (() => {
    const pct = (differenceInDays(new Date(), projStart) / totalDays) * 100;
    return pct >= 0 && pct <= 100 ? pct : null;
  })();

  // Sync scroll
  const handleScroll = () => {
    if (scrollRef.current && sidebarRef.current) {
      sidebarRef.current.scrollTop = scrollRef.current.scrollTop;
    }
  };

  // Auto-scroll to today
  useEffect(() => {
    if (scrollRef.current && todayPct !== null) {
      const el = scrollRef.current;
      const target = (todayPct / 100) * el.scrollWidth - el.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, []);

  const totalBodyHeight = bars.length * ROW_HEIGHT;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex overflow-hidden" style={{ maxHeight: 600 }}>
        {/* ─── Sidebar ─── */}
        <div
          ref={sidebarRef}
          className="flex-shrink-0 border-r border-border bg-card overflow-hidden"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Header */}
          <div
            className="flex items-center px-3 gap-2 border-b border-border bg-muted/30 sticky top-0 z-10"
            style={{ height: HEADER_HEIGHT }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground flex-1">
              Task
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground w-16 text-center">
              Status
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground w-14 text-right">
              Assignee
            </span>
          </div>

          {/* Rows */}
          {bars.map((bar, idx) => {
            const config = statusConfig[bar.status] || statusConfig.todo;
            const isHovered = hoveredRow === bar.id;

            return (
              <div
                key={bar.id}
                className={cn(
                  "flex items-center gap-2 px-3 border-b border-border/20 transition-colors",
                  isHovered && "bg-accent/50"
                )}
                style={{ height: ROW_HEIGHT }}
                onMouseEnter={() => setHoveredRow(bar.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <span className="text-[9px] text-muted-foreground/40 w-4 text-right tabular-nums flex-shrink-0">
                  {idx + 1}
                </span>
                <div className={cn("h-2 w-2 rounded-full flex-shrink-0", config.dot)} />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-foreground truncate block">{bar.name}</span>
                  {bar.dependencies.length > 0 && (
                    <span className="text-[8px] text-muted-foreground/50">
                      depends on #{bar.dependencies.join(", #")}
                    </span>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-[8px] h-4 px-1 capitalize shrink-0", config.bg, config.text, config.border)}
                >
                  {config.label}
                </Badge>
                <span className="text-[9px] text-muted-foreground truncate w-14 text-right flex-shrink-0">
                  {bar.assignee ? bar.assignee.split(" ")[0] : "—"}
                </span>
              </div>
            );
          })}
        </div>

        {/* ─── Timeline ─── */}
        <div className="flex-1 overflow-auto" ref={scrollRef} onScroll={handleScroll}>
          <div className="relative min-w-[700px]">
            {/* Month headers */}
            <div
              className="sticky top-0 z-20 border-b border-border bg-muted/30 backdrop-blur-sm relative"
              style={{ height: HEADER_HEIGHT }}
            >
              {months.map((month, idx) => {
                const mStart = idx === 0 ? projStart : month;
                const mEnd =
                  idx === months.length - 1
                    ? projEnd
                    : new Date(month.getFullYear(), month.getMonth() + 1, 0);
                const leftPct = (differenceInDays(mStart, projStart) / totalDays) * 100;
                const widthPct = (differenceInDays(mEnd, mStart) / totalDays) * 100;
                const isCurrent = isSameMonth(month, new Date());

                return (
                  <div
                    key={idx}
                    className={cn(
                      "absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/20",
                      isCurrent && "bg-primary/[0.03]"
                    )}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    <div className="px-2.5 flex items-baseline gap-1">
                      <span
                        className={cn(
                          "text-[11px] font-bold uppercase tracking-wide",
                          isCurrent ? "text-primary" : "text-muted-foreground/60"
                        )}
                      >
                        {format(month, "MMM")}
                      </span>
                      <span
                        className={cn(
                          "text-[9px]",
                          isCurrent ? "text-primary/50" : "text-muted-foreground/25"
                        )}
                      >
                        {format(month, "yyyy")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Timeline body */}
            <div className="relative" style={{ height: totalBodyHeight }}>
              {/* Weekend shading */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {weekendDays.map((wd, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 bg-muted/15"
                    style={{ left: `${wd.leftPct}%`, width: `${wd.widthPct}%` }}
                  />
                ))}
              </div>

              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {months.map((month, idx) => {
                  if (idx === 0) return null;
                  const leftPct = (differenceInDays(month, projStart) / totalDays) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 w-px bg-border/10"
                      style={{ left: `${leftPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Today line */}
              {todayPct !== null && (
                <div
                  className="absolute top-0 bottom-0 z-30 pointer-events-none"
                  style={{ left: `${todayPct}%` }}
                >
                  <div className="absolute -top-0 -translate-x-1/2">
                    <div className="bg-destructive text-destructive-foreground text-[7px] font-black px-1.5 py-0.5 rounded-b shadow tracking-wider">
                      TODAY
                    </div>
                  </div>
                  <div
                    className="w-0 h-full mx-auto"
                    style={{ borderLeft: "1.5px dashed hsl(var(--destructive) / 0.35)" }}
                  />
                </div>
              )}

              {/* Dependency arrows */}
              <svg
                className="absolute inset-0 w-full pointer-events-none z-10"
                style={{ height: totalBodyHeight }}
              >
                <defs>
                  <marker id="gantt-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 6 2.5, 0 5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
                  </marker>
                </defs>
                {bars.map((bar) => {
                  if (bar.dependencies.length === 0) return null;
                  const currIdx = bars.findIndex((b) => b.id === bar.id);
                  const currY = currIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
                  const x2 = bar.leftPct;

                  return bar.dependencies.map((depId) => {
                    const depIdx = bars.findIndex((b) => b.id === depId);
                    if (depIdx === -1) return null;
                    const dep = bars[depIdx];
                    const prevY = depIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
                    const x1 = dep.leftPct + dep.widthPct;
                    const midX = (x1 + x2) / 2;

                    return (
                      <path
                        key={`${depId}-${bar.id}`}
                        d={`M ${x1}% ${prevY} L ${midX}% ${prevY} L ${midX}% ${currY} L ${x2}% ${currY}`}
                        fill="none"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        opacity="0.25"
                        markerEnd="url(#gantt-arrow)"
                      />
                    );
                  });
                })}
              </svg>

              {/* Task bars */}
              {bars.map((bar, idx) => {
                const config = statusConfig[bar.status] || statusConfig.todo;
                const isHovered = hoveredRow === bar.id;
                const y = idx * ROW_HEIGHT;

                return (
                  <TooltipProvider key={bar.id} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute border-b border-border/15 transition-colors",
                            isHovered && "bg-accent/30"
                          )}
                          style={{ top: y, height: ROW_HEIGHT, left: 0, right: 0 }}
                          onMouseEnter={() => setHoveredRow(bar.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <div className="absolute inset-0 flex items-center">
                            {/* Bar */}
                            <div
                              className={cn(
                                "absolute h-8 rounded-md overflow-hidden transition-shadow",
                                isHovered && "shadow-lg ring-1 ring-foreground/5"
                              )}
                              style={{
                                left: `${bar.leftPct}%`,
                                width: `${bar.widthPct}%`,
                              }}
                            >
                              {/* Track */}
                              <div className={cn("absolute inset-0 rounded-md border", config.border, config.bg)} />

                              {/* Progress fill */}
                              <div
                                className={cn(
                                  "absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-500",
                                  config.gradient
                                )}
                                style={{
                                  width: `${bar.progress}%`,
                                  borderRadius:
                                    bar.progress === 100 ? "0.375rem" : "0.375rem 0 0 0.375rem",
                                }}
                              />

                              {/* Stripe for in-progress */}
                              {bar.status === "in-progress" && (
                                <div
                                  className="absolute inset-y-0 left-0 overflow-hidden rounded-l-md"
                                  style={{ width: `${bar.progress}%` }}
                                >
                                  <div
                                    className="absolute inset-0 opacity-[0.08]"
                                    style={{
                                      backgroundImage:
                                        "repeating-linear-gradient(45deg, transparent, transparent 3px, white 3px, white 4px)",
                                    }}
                                  />
                                </div>
                              )}

                              {/* Label */}
                              <div className="relative h-full flex items-center justify-between px-2 z-10">
                                <span
                                  className={cn(
                                    "text-[9px] font-semibold truncate",
                                    bar.progress > 40 ? "text-white drop-shadow-sm" : config.text
                                  )}
                                >
                                  {bar.name}
                                </span>
                                <span
                                  className={cn(
                                    "text-[8px] font-bold ml-1 flex-shrink-0 tabular-nums",
                                    bar.progress > 60 ? "text-white/80" : config.text
                                  )}
                                >
                                  {bar.progress}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-1 rounded", config.bg)}>
                            <config.icon className={cn("h-3 w-3", config.text)} />
                          </div>
                          <div>
                            <p className="font-semibold text-xs">{bar.name}</p>
                            <p className={cn("text-[10px]", config.text)}>{config.label}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                          <div>
                            <span className="text-muted-foreground">Start</span>
                            <p className="font-medium">{format(bar.startDate, "MMM d")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">End</span>
                            <p className="font-medium">{format(bar.endDate, "MMM d")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Assignee</span>
                            <p className="font-medium">{bar.assignee || "—"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Priority</span>
                            <p className={cn("font-medium", priorityConfig[bar.priority]?.color)}>
                              {priorityConfig[bar.priority]?.label}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-bold">{bar.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)}
                              style={{ width: `${bar.progress}%` }}
                            />
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        </div>
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
