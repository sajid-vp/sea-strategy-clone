import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  differenceInDays,
  parseISO,
  format,
  addDays,
  eachMonthOfInterval,
  isSameMonth,
  isWeekend,
  eachDayOfInterval,
} from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Ban,
  Search,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  GanttChartSquare,
  List,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Task {
  id: number;
  name: string;
  status: "done" | "in-progress" | "todo" | "blocked" | "in-review";
  priority: "high" | "medium" | "low";
  assignee: string;
  dependencies: number[];
  subtasks: any[];
  milestoneId?: number;
}

interface Milestone {
  id: number;
  name: string;
  dueDate: string;
  progress: number;
  status: string;
  deliverables?: any[];
}

interface GanttChartProps {
  milestones: Milestone[];
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

const MILESTONE_ROW_HEIGHT = 40;
const TASK_ROW_HEIGHT = 44;
const SIDEBAR_WIDTH = 320;
const HEADER_HEIGHT = 44;

type RowItem =
  | { type: "milestone"; milestone: Milestone; startDay: number; endDay: number }
  | { type: "task"; task: Task; milestoneId: number; startDay: number; endDay: number; progress: number };

type ViewMode = "gantt" | "list";

export const GanttChart = ({ milestones, projectStartDate, projectEndDate, tasks }: GanttChartProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [collapsedMilestones, setCollapsedMilestones] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewMode>("gantt");
  
  // Drag state
  const [dragState, setDragState] = useState<{
    taskId: number;
    mode: "move" | "resize-left" | "resize-right";
    initialMouseX: number;
    initialStartDay: number;
    initialEndDay: number;
  } | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<number, { startDelta: number; endDelta: number }>>({});

  const projStart = parseISO(projectStartDate);
  const projEnd = parseISO(projectEndDate);
  const totalDays = differenceInDays(projEnd, projStart) || 1;

  const toggleMilestone = (id: number) =>
    setCollapsedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));

  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()),
    [milestones]
  );

  const tasksByMilestone = useMemo(() => {
    const map = new Map<number, Task[]>();
    if (!tasks || tasks.length === 0) return map;

    const hasIds = tasks.some((t) => t.milestoneId != null);
    if (hasIds) {
      tasks.forEach((t) => {
        const mId = t.milestoneId;
        if (mId != null) {
          const arr = map.get(mId) || [];
          arr.push(t);
          map.set(mId, arr);
        }
      });
      const unmatched = tasks.filter((t) => t.milestoneId == null);
      if (unmatched.length > 0 && sortedMilestones.length > 0) {
        const lastM = sortedMilestones[sortedMilestones.length - 1];
        const existing = map.get(lastM.id) || [];
        map.set(lastM.id, [...existing, ...unmatched]);
      }
    } else {
      const perMilestone = Math.ceil(tasks.length / sortedMilestones.length);
      sortedMilestones.forEach((m, idx) => {
        const slice = tasks.slice(idx * perMilestone, (idx + 1) * perMilestone);
        if (slice.length > 0) map.set(m.id, slice);
      });
    }

    return map;
  }, [tasks, sortedMilestones]);

  const rows = useMemo(() => {
    const result: RowItem[] = [];
    let prevEndDay = 0;

    sortedMilestones.forEach((m) => {
      const mEndDay = Math.round((differenceInDays(parseISO(m.dueDate), projStart) / totalDays) * totalDays);
      const mStartDay = prevEndDay;

      result.push({ type: "milestone", milestone: m, startDay: mStartDay, endDay: mEndDay });

      if (!collapsedMilestones[m.id]) {
        const mTasks = tasksByMilestone.get(m.id) || [];
        const taskCount = mTasks.length || 1;
        const sliceDays = Math.max(Math.floor((mEndDay - mStartDay) / taskCount), 1);

        mTasks.forEach((task, tIdx) => {
          const tStart = mStartDay + tIdx * sliceDays;
          const tEnd = tIdx === mTasks.length - 1 ? mEndDay : tStart + sliceDays;
          const progress =
            task.status === "done" ? 100 :
            task.status === "in-progress" ? 55 :
            task.status === "in-review" ? 80 :
            task.status === "blocked" ? 20 : 0;

          result.push({ type: "task", task, milestoneId: m.id, startDay: tStart, endDay: tEnd, progress });
        });
      }

      prevEndDay = mEndDay;
    });

    return result;
  }, [sortedMilestones, collapsedMilestones, tasksByMilestone, projStart, totalDays]);

  const months = useMemo(
    () => eachMonthOfInterval({ start: projStart, end: projEnd }),
    [projectStartDate, projectEndDate]
  );

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

  const todayPct = (() => {
    const pct = (differenceInDays(new Date(), projStart) / totalDays) * 100;
    return pct >= 0 && pct <= 100 ? pct : null;
  })();




  useEffect(() => {
    if (scrollRef.current && todayPct !== null) {
      const el = scrollRef.current;
      const target = (todayPct / 100) * el.scrollWidth - el.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, []);

  // Drag handlers
  const handleDragStart = useCallback((
    e: React.MouseEvent,
    taskId: number,
    mode: "move" | "resize-left" | "resize-right",
    startDay: number,
    endDay: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ taskId, mode, initialMouseX: e.clientX, initialStartDay: startDay, initialEndDay: endDay });
  }, []);

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const totalWidth = rect.width;
      const deltaX = e.clientX - dragState.initialMouseX;
      const deltaDays = Math.round((deltaX / totalWidth) * totalDays);

      let startDelta = 0;
      let endDelta = 0;

      if (dragState.mode === "move") {
        startDelta = deltaDays;
        endDelta = deltaDays;
      } else if (dragState.mode === "resize-left") {
        startDelta = deltaDays;
      } else {
        endDelta = deltaDays;
      }

      // Ensure minimum bar width of 1 day
      const newStart = dragState.initialStartDay + startDelta;
      const newEnd = dragState.initialEndDay + endDelta;
      if (newEnd - newStart < 1) return;

      setDragOffsets((prev) => ({ ...prev, [dragState.taskId]: { startDelta, endDelta } }));
    };

    const handleMouseUp = () => {
      if (dragState) {
        const offset = dragOffsets[dragState.taskId];
        if (offset && (offset.startDelta !== 0 || offset.endDelta !== 0)) {
          const newStart = addDays(projStart, dragState.initialStartDay + offset.startDelta);
          const newEnd = addDays(projStart, dragState.initialEndDay + offset.endDelta);
          toast.success(`Task rescheduled: ${format(newStart, "MMM d")} → ${format(newEnd, "MMM d")}`);
        }
      }
      setDragState(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, dragOffsets, totalDays, projStart]);

  const totalBodyHeight = rows.reduce(
    (h, r) => h + (r.type === "milestone" ? MILESTONE_ROW_HEIGHT : TASK_ROW_HEIGHT),
    0
  );

  const overallProgress =
    milestones.length > 0
      ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / milestones.length)
      : 0;

  const getAdjustedDays = (taskId: number, startDay: number, endDay: number) => {
    const offset = dragOffsets[taskId];
    if (!offset) return { s: startDay, e: endDay };
    return { s: startDay + offset.startDelta, e: endDay + offset.endDelta };
  };

  // ─── List View ───
  const renderListView = () => (
    <div className="divide-y divide-border">
      {/* Column Headers */}
      <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
        <span className="w-6" />
        <span className="w-3" />
        <span className="flex-1 min-w-0">Name</span>
        <span className="w-28 text-left">Owner</span>
        <span className="w-16 text-left">Priority</span>
        <span className="w-20 text-center">Status</span>
        <span className="w-20 text-right">Progress</span>
      </div>
      {sortedMilestones.map((m) => {
        const config = statusConfig[m.status] || statusConfig.todo;
        const isCollapsed = collapsedMilestones[m.id];
        const mTasks = tasksByMilestone.get(m.id) || [];

        return (
          <div key={m.id}>
            <div
              className="flex items-center gap-3 px-4 py-3 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => toggleMilestone(m.id)}
            >
              <span className="text-muted-foreground w-6 flex-shrink-0 flex items-center justify-center">
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
              <div className={cn("h-2.5 w-2.5 rounded-sm flex-shrink-0", config.dot)} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold">{m.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {mTasks.length} task{mTasks.length !== 1 ? "s" : ""} · Due {format(parseISO(m.dueDate), "MMM d, yyyy")}
                </span>
              </div>
              <span className="w-28" />
              <span className="w-16" />
              <div className="w-20 flex justify-center">
                <Badge variant="outline" className={cn("text-[10px] capitalize", config.bg, config.text, config.border)}>
                  {config.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 w-20 justify-end">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", config.fill)} style={{ width: `${m.progress}%` }} />
                </div>
                <span className="text-xs font-bold tabular-nums">{m.progress}%</span>
              </div>
            </div>
            {!isCollapsed && mTasks.length > 0 && (
              <div className="bg-card">
                {mTasks.map((t) => {
                  const tc = statusConfig[t.status] || statusConfig.todo;
                  const pc = priorityConfig[t.priority];
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 border-t border-border/20 hover:bg-accent/30 transition-colors">
                      <span className="w-6 flex-shrink-0" />
                      <div className={cn("h-2 w-2 rounded-full flex-shrink-0", tc.dot)} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-medium">{t.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground w-28 truncate text-left">{t.assignee}</span>
                      <span className={cn("text-[11px] font-medium w-16 text-left", pc?.color)}>{pc?.label}</span>
                      <div className="w-20 flex justify-center">
                        <Badge variant="outline" className={cn("text-[10px] capitalize h-5", tc.bg, tc.text, tc.border)}>
                          {tc.label}
                        </Badge>
                      </div>
                      <span className="w-20" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const BAR_MIN_TEXT_WIDTH = 6; // minimum % width to show text

  // ─── Gantt View ───
  const renderGanttView = () => (
    <div className="flex flex-col" style={{ maxHeight: 600 }}>
      {/* Fixed Header Row */}
      <div className="flex border-b border-border flex-shrink-0">
        <div className="flex-shrink-0 border-r border-border bg-muted/20" style={{ width: SIDEBAR_WIDTH }}>
          <div className="flex items-center px-3" style={{ height: HEADER_HEIGHT }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground flex-1">Milestone / Task</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground w-16 text-right">Progress</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="relative bg-muted/30" style={{ height: HEADER_HEIGHT, minWidth: 700 }}>
            {months.map((month, idx) => {
              const mStart = idx === 0 ? projStart : month;
              const mEnd = idx === months.length - 1 ? projEnd : new Date(month.getFullYear(), month.getMonth() + 1, 0);
              const leftPct = (differenceInDays(mStart, projStart) / totalDays) * 100;
              const widthPct = (differenceInDays(mEnd, mStart) / totalDays) * 100;
              const isCurrent = isSameMonth(month, new Date());
              return (
                <div
                  key={idx}
                  className={cn("absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/20", isCurrent && "bg-primary/[0.03]")}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                >
                  <div className="px-2.5 flex items-baseline gap-1">
                    <span className={cn("text-[11px] font-bold uppercase tracking-wide", isCurrent ? "text-primary" : "text-muted-foreground/60")}>{format(month, "MMM")}</span>
                    <span className={cn("text-[9px]", isCurrent ? "text-primary/50" : "text-muted-foreground/25")}>{format(month, "yyyy")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Body - single scroll container */}
      <div className="flex-1 overflow-auto" ref={scrollRef} style={{ maxHeight: 600 - HEADER_HEIGHT }}>
        <div className="flex" style={{ minHeight: totalBodyHeight }}>
          {/* Sidebar Body */}
          <div className="flex-shrink-0 border-r border-border bg-card" style={{ width: SIDEBAR_WIDTH }}>
            {rows.map((row) => {
              if (row.type === "milestone") {
                const m = row.milestone;
                const config = statusConfig[m.status] || statusConfig.todo;
                const isCollapsed = collapsedMilestones[m.id];
                const taskCount = tasksByMilestone.get(m.id)?.length || 0;

                return (
                  <div
                    key={`m-${m.id}`}
                    className="flex items-center gap-2 px-3 border-b border-border/40 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                    style={{ height: MILESTONE_ROW_HEIGHT }}
                    onClick={() => toggleMilestone(m.id)}
                  >
                    <span className="text-muted-foreground flex-shrink-0">
                      {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </span>
                    <div className={cn("h-2 w-2 rounded-sm flex-shrink-0", config.dot)} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-foreground truncate block">{m.name}</span>
                      <span className="text-[8px] text-muted-foreground">
                        {taskCount} task{taskCount !== 1 ? "s" : ""} · Due {format(parseISO(m.dueDate), "MMM d")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 w-16 justify-end">
                      <div className="w-8 h-1 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full", config.fill)} style={{ width: `${m.progress}%` }} />
                      </div>
                      <span className={cn("text-[9px] font-bold tabular-nums", m.progress === 100 ? "text-emerald-500" : "text-foreground")}>
                        {m.progress}%
                      </span>
                    </div>
                  </div>
                );
              }

              const t = row.task;
              const config = statusConfig[t.status] || statusConfig.todo;
              const isHovered = hoveredRow === t.id;

              return (
                <div
                  key={`t-${t.id}`}
                  className={cn("flex items-center gap-2 px-3 pl-8 border-b border-border/15 transition-colors", isHovered && "bg-accent/50")}
                  style={{ height: TASK_ROW_HEIGHT }}
                  onMouseEnter={() => setHoveredRow(t.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", config.dot)} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-medium text-foreground truncate block">{t.name}</span>
                    <span className="text-[8px] text-muted-foreground/60">{t.assignee}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[7px] h-3.5 px-1 capitalize shrink-0", config.bg, config.text, config.border)}>
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>

          {/* Timeline Body */}
          <div className="flex-1 relative" ref={timelineRef} style={{ minWidth: 700 }}>
            {/* Weekend shading */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {weekendDays.map((wd, idx) => (
                <div key={idx} className="absolute top-0 bottom-0 bg-muted/15" style={{ left: `${wd.leftPct}%`, width: `${wd.widthPct}%` }} />
              ))}
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {months.map((month, idx) => {
                if (idx === 0) return null;
                const leftPct = (differenceInDays(month, projStart) / totalDays) * 100;
                return <div key={idx} className="absolute top-0 bottom-0 w-px bg-border/10" style={{ left: `${leftPct}%` }} />;
              })}
            </div>

            {/* Today line */}
            {todayPct !== null && (
              <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${todayPct}%` }}>
                <div className="absolute -top-0 -translate-x-1/2">
                  <div className="bg-destructive text-destructive-foreground text-[7px] font-black px-1.5 py-0.5 rounded-b shadow tracking-wider">TODAY</div>
                </div>
                <div className="w-0 h-full mx-auto" style={{ borderLeft: "1.5px dashed hsl(var(--destructive) / 0.35)" }} />
              </div>
            )}

            {/* Dependency arrows */}
            <svg className="absolute inset-0 w-full pointer-events-none z-10" style={{ height: totalBodyHeight }}>
              <defs>
                <marker id="gantt-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0, 6 2.5, 0 5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
                </marker>
              </defs>
              {(() => {
                const taskRowMap = new Map<number, { rowIdx: number; leftPct: number; rightPct: number }>();
                let yOff = 0;
                rows.forEach((row, rIdx) => {
                  const h = row.type === "milestone" ? MILESTONE_ROW_HEIGHT : TASK_ROW_HEIGHT;
                  if (row.type === "task") {
                    const { s, e } = getAdjustedDays(row.task.id, row.startDay, row.endDay);
                    taskRowMap.set(row.task.id, { rowIdx: rIdx, leftPct: (s / totalDays) * 100, rightPct: (e / totalDays) * 100 });
                  }
                  yOff += h;
                });

                const getRowYCenter = (rowIdx: number) => {
                  let y = 0;
                  for (let i = 0; i < rowIdx; i++) {
                    y += rows[i].type === "milestone" ? MILESTONE_ROW_HEIGHT : TASK_ROW_HEIGHT;
                  }
                  return y + (rows[rowIdx].type === "milestone" ? MILESTONE_ROW_HEIGHT : TASK_ROW_HEIGHT) / 2;
                };

                return rows.flatMap((row) => {
                  if (row.type !== "task") return [];
                  return row.task.dependencies.map((depId) => {
                    const dep = taskRowMap.get(depId);
                    const curr = taskRowMap.get(row.task.id);
                    if (!dep || !curr) return null;

                    const prevY = getRowYCenter(dep.rowIdx);
                    const currY = getRowYCenter(curr.rowIdx);
                    const x1 = dep.rightPct;
                    const x2 = curr.leftPct;
                    const midX = (x1 + x2) / 2;

                    return (
                      <path
                        key={`${depId}-${row.task.id}`}
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
                });
              })()}
            </svg>

            {/* Rows */}
            {(() => {
              let yOffset = 0;
              return rows.map((row, rIdx) => {
                const h = row.type === "milestone" ? MILESTONE_ROW_HEIGHT : TASK_ROW_HEIGHT;
                const top = yOffset;
                yOffset += h;

                if (row.type === "milestone") {
                  const m = row.milestone;
                  const config = statusConfig[m.status] || statusConfig.todo;
                  const leftPct = (row.startDay / totalDays) * 100;
                  const widthPct = Math.max(((row.endDay - row.startDay) / totalDays) * 100, 3);

                  return (
                    <div key={`m-${m.id}`} className="absolute border-b border-border/30 bg-muted/10" style={{ top, height: h, left: 0, right: 0 }}>
                      <div className="absolute inset-0 flex items-center">
                        <div className="absolute h-5 rounded" style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                          <div className={cn("absolute inset-0 rounded opacity-20 bg-gradient-to-r", config.gradient)} />
                          <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l", config.fill, "opacity-60")} />
                          <div className={cn("absolute right-0 top-0 bottom-0 w-1 rounded-r", config.fill, "opacity-60")} />
                          <div className="relative h-full flex items-center px-2 overflow-hidden">
                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider truncate">{m.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Task bar with drag
                const t = row.task;
                const config = statusConfig[t.status] || statusConfig.todo;
                const isHovered = hoveredRow === t.id;
                const isDragging = dragState?.taskId === t.id;
                const { s: adjStart, e: adjEnd } = getAdjustedDays(t.id, row.startDay, row.endDay);
                const leftPct = (adjStart / totalDays) * 100;
                const widthPct = Math.max(((adjEnd - adjStart) / totalDays) * 100, 2);
                const showText = widthPct >= BAR_MIN_TEXT_WIDTH;
                const startDate = addDays(projStart, adjStart);
                const endDate = addDays(projStart, adjEnd);

                return (
                  <TooltipProvider key={`t-${t.id}`} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn("absolute border-b border-border/10 transition-colors", isHovered && "bg-accent/30")}
                          style={{ top, height: h, left: 0, right: 0 }}
                          onMouseEnter={() => setHoveredRow(t.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <div className="absolute inset-0 flex items-center">
                            <div
                              className={cn(
                                "absolute h-7 rounded-md overflow-hidden transition-shadow group",
                                isHovered && "shadow-lg ring-1 ring-foreground/5",
                                isDragging && "shadow-xl ring-2 ring-primary/30 z-40 opacity-90"
                              )}
                              style={{ left: `${leftPct}%`, width: `${widthPct}%`, cursor: isDragging ? "grabbing" : "grab" }}
                              onMouseDown={(e) => handleDragStart(e, t.id, "move", row.startDay, row.endDay)}
                            >
                              <div className={cn("absolute inset-0 rounded-md border", config.border, config.bg)} />
                              <div
                                className={cn("absolute inset-y-0 left-0 bg-gradient-to-r transition-all", config.gradient)}
                                style={{ width: `${row.progress}%`, borderRadius: row.progress === 100 ? "0.375rem" : "0.375rem 0 0 0.375rem" }}
                              />
                              {t.status === "in-progress" && (
                                <div className="absolute inset-y-0 left-0 overflow-hidden rounded-l-md" style={{ width: `${row.progress}%` }}>
                                  <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, white 3px, white 4px)" }} />
                                </div>
                              )}
                              {showText && (
                                <div className="relative h-full flex items-center justify-between px-2 z-10">
                                  <span className={cn("text-[9px] font-semibold truncate", row.progress > 40 ? "text-white drop-shadow-sm" : config.text)}>{t.name}</span>
                                  <span className={cn("text-[8px] font-bold ml-1 flex-shrink-0 tabular-nums", row.progress > 60 ? "text-white/80" : config.text)}>{row.progress}%</span>
                                </div>
                              )}

                              {/* Resize handles */}
                              <div
                                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-20 group-hover:bg-foreground/10 rounded-l-md transition-colors"
                                onMouseDown={(e) => { e.stopPropagation(); handleDragStart(e, t.id, "resize-left", row.startDay, row.endDay); }}
                              >
                                <div className="absolute inset-y-0 left-0.5 w-px bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div
                                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize z-20 group-hover:bg-foreground/10 rounded-r-md transition-colors"
                                onMouseDown={(e) => { e.stopPropagation(); handleDragStart(e, t.id, "resize-right", row.startDay, row.endDay); }}
                              >
                                <div className="absolute inset-y-0 right-0.5 w-px bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                            <p className="font-semibold text-xs">{t.name}</p>
                            <p className={cn("text-[10px]", config.text)}>{config.label}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                          <div><span className="text-muted-foreground">Start</span><p className="font-medium">{format(startDate, "MMM d")}</p></div>
                          <div><span className="text-muted-foreground">End</span><p className="font-medium">{format(endDate, "MMM d")}</p></div>
                          <div><span className="text-muted-foreground">Assignee</span><p className="font-medium">{t.assignee || "—"}</p></div>
                          <div><span className="text-muted-foreground">Priority</span><p className={cn("font-medium", priorityConfig[t.priority]?.color)}>{priorityConfig[t.priority]?.label}</p></div>
                        </div>
                        {t.dependencies.length > 0 && (
                          <p className="text-[9px] text-muted-foreground">Depends on: #{t.dependencies.join(", #")}</p>
                        )}
                        <p className="text-[9px] text-muted-foreground italic">Drag to move · Drag edges to resize</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 text-xs">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-semibold">{milestones.length}</span>
          <span className="text-muted-foreground">milestones</span>
          <div className="h-4 w-px bg-border" />
          <span className="font-semibold">{tasks?.length || 0}</span>
          <span className="text-muted-foreground">tasks</span>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="font-bold tabular-nums">{overallProgress}%</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <Button
            variant={viewMode === "gantt" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setViewMode("gantt")}
          >
            <GanttChartSquare className="h-3.5 w-3.5" />
            Gantt
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setViewMode("list")}
          >
            <List className="h-3.5 w-3.5" />
            List
          </Button>
        </div>
      </div>

      {viewMode === "gantt" ? renderGanttView() : renderListView()}

      {/* Footer */}
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
