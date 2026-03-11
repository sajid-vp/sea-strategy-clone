import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  differenceInDays,
  parseISO,
  format,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachDayOfInterval,
  endOfWeek,
  isSameMonth,
  addDays,
  isWeekend,
  startOfDay,
  isSameDay,
} from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Layers,
  LayoutList,
  GripHorizontal,
  Zap,
  Eye,
  EyeOff,
  Filter,
  Maximize2,
  Minimize2,
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
    gradient: "from-emerald-500 to-emerald-400",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    track: "bg-emerald-500/8",
    fill: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Completed",
    barColor: "hsl(152, 69%, 41%)",
  },
  "in-progress": {
    gradient: "from-blue-500 to-blue-400",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    track: "bg-blue-500/8",
    fill: "bg-blue-500",
    icon: Clock,
    label: "In Progress",
    barColor: "hsl(217, 91%, 60%)",
  },
  todo: {
    gradient: "from-slate-400 to-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-500 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
    track: "bg-slate-100 dark:bg-slate-800",
    fill: "bg-slate-400",
    icon: Clock,
    label: "To Do",
    barColor: "hsl(215, 14%, 65%)",
  },
  delayed: {
    gradient: "from-red-500 to-red-400",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
    track: "bg-red-500/8",
    fill: "bg-red-500",
    icon: AlertCircle,
    label: "Delayed",
    barColor: "hsl(0, 84%, 60%)",
  },
};

const deliverableStatusConfig: Record<string, { dot: string; text: string }> = {
  done: { dot: "bg-emerald-500", text: "text-emerald-600" },
  "in-progress": { dot: "bg-blue-500", text: "text-blue-600" },
  todo: { dot: "bg-slate-400", text: "text-slate-500" },
};

export const GanttChart = ({ milestones, projectStartDate, projectEndDate }: GanttChartProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [zoomLevel, setZoomLevel] = useState<"month" | "week" | "day">("month");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showBaseline, setShowBaseline] = useState(false);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drag state
  const [dragState, setDragState] = useState<{
    milestoneId: number;
    edge: "left" | "right" | "move";
    startX: number;
    originalLeft: number;
    originalWidth: number;
  } | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<number, { leftDelta: number; widthDelta: number }>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const projStart = parseISO(projectStartDate);
  const projEnd = parseISO(projectEndDate);
  const totalDays = differenceInDays(projEnd, projStart) || 1;

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

  const months = useMemo(
    () => eachMonthOfInterval({ start: projStart, end: projEnd }),
    [projectStartDate, projectEndDate]
  );

  const weeks = useMemo(() => {
    try {
      return eachWeekOfInterval({ start: projStart, end: projEnd }, { weekStartsOn: 1 });
    } catch {
      return [];
    }
  }, [projectStartDate, projectEndDate]);

  const days = useMemo(() => {
    try {
      return eachDayOfInterval({ start: projStart, end: projEnd });
    } catch {
      return [];
    }
  }, [projectStartDate, projectEndDate]);

  // Weekend columns for shading
  const weekendDays = useMemo(() => {
    return days.filter((d) => isWeekend(d)).map((d) => ({
      date: d,
      leftPct: (differenceInDays(d, projStart) / totalDays) * 100,
      widthPct: (1 / totalDays) * 100,
    }));
  }, [days, projStart, totalDays]);

  const bars = useMemo(() => {
    const sorted = [...milestones].sort(
      (a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()
    );
    let prevEnd = projStart;

    return sorted.map((m, idx) => {
      const end = parseISO(m.dueDate);
      const start = idx === 0 ? projStart : prevEnd;
      const leftPct = Math.max((differenceInDays(start, projStart) / totalDays) * 100, 0);
      const widthPct = Math.max((differenceInDays(end, start) / totalDays) * 100, 2);
      prevEnd = end;

      // Baseline calculation
      const baselineEnd = m.baselineDueDate ? parseISO(m.baselineDueDate) : end;
      const baselineWidthPct = Math.max((differenceInDays(baselineEnd, start) / totalDays) * 100, 2);

      return { ...m, start, end, leftPct, widthPct, baselineWidthPct };
    });
  }, [milestones, projectStartDate, projectEndDate, totalDays]);

  // Critical path: longest chain of sequential milestones
  const criticalPathIds = useMemo(() => {
    if (!showCriticalPath) return new Set<number>();
    // Simple heuristic: milestones that are delayed or in-progress with high impact
    const critical = bars
      .filter((b) => b.status === "delayed" || (b.status === "in-progress" && b.progress < 50))
      .map((b) => b.id);
    // If none delayed, mark the longest duration ones
    if (critical.length === 0) {
      const sorted = [...bars].sort((a, b) => b.widthPct - a.widthPct);
      return new Set(sorted.slice(0, Math.ceil(sorted.length / 2)).map((b) => b.id));
    }
    return new Set(critical);
  }, [bars, showCriticalPath]);

  const todayPct = (() => {
    const today = new Date();
    const pct = (differenceInDays(today, projStart) / totalDays) * 100;
    return pct >= 0 && pct <= 100 ? pct : null;
  })();

  const SIDEBAR_WIDTH = 320;
  const ROW_HEIGHT = 52;
  const SUB_ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 56;

  const overallProgress =
    milestones.length > 0
      ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length)
      : 0;

  const completedCount = milestones.filter((m) => m.status === "done").length;
  const anyExpanded = Object.values(expandedRows).some(Boolean);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.MouseEvent, milestoneId: number, edge: "left" | "right" | "move", leftPct: number, widthPct: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragState({
        milestoneId,
        edge,
        startX: e.clientX,
        originalLeft: leftPct,
        originalWidth: widthPct,
      });
    },
    []
  );

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragState.startX;
      const deltaPct = (deltaX / rect.width) * 100;

      setDragOffsets((prev) => {
        const current = prev[dragState.milestoneId] || { leftDelta: 0, widthDelta: 0 };
        if (dragState.edge === "right") {
          return { ...prev, [dragState.milestoneId]: { ...current, widthDelta: deltaPct } };
        } else if (dragState.edge === "left") {
          return { ...prev, [dragState.milestoneId]: { leftDelta: deltaPct, widthDelta: -deltaPct } };
        } else {
          return { ...prev, [dragState.milestoneId]: { ...current, leftDelta: deltaPct } };
        }
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  // Sync sidebar + timeline scroll
  const handleTimelineScroll = useCallback(() => {
    if (scrollRef.current && sidebarRef.current) {
      sidebarRef.current.scrollTop = scrollRef.current.scrollTop;
    }
  }, []);

  // Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current && todayPct !== null) {
      const container = scrollRef.current;
      const scrollTarget = (todayPct / 100) * container.scrollWidth - container.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
    }
  }, []);

  // Minimap
  const minimapWidth = 200;
  const minimapHeight = 40;

  // Calculate total body height for SVG
  const totalBodyHeight = bars.reduce((h, bar) => {
    const expanded = expandedRows[bar.id];
    return h + ROW_HEIGHT + (expanded ? (bar.deliverables?.length || 0) * SUB_ROW_HEIGHT : 0);
  }, 0);

  // Get row Y position for a bar index
  const getRowY = (barIndex: number) => {
    let y = 0;
    for (let i = 0; i < barIndex; i++) {
      const b = bars[i];
      y += ROW_HEIGHT + (expandedRows[b.id] ? (b.deliverables?.length || 0) * SUB_ROW_HEIGHT : 0);
    }
    return y;
  };

  const zoomOptions = [
    { key: "month" as const, label: "Month" },
    { key: "week" as const, label: "Week" },
    { key: "day" as const, label: "Day" },
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden shadow-sm",
        isFullscreen && "fixed inset-0 z-50 rounded-none"
      )}
    >
      {/* ─── Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="flex items-center gap-1.5 text-xs">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold">{milestones.length}</span>
            <span className="text-muted-foreground">milestones</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-semibold">{completedCount}/{milestones.length}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          {/* Overall progress */}
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

        <div className="flex items-center gap-1.5">
          {/* Toggles */}
          <Button
            variant={showBaseline ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-[11px] px-2 gap-1"
            onClick={() => setShowBaseline(!showBaseline)}
          >
            {showBaseline ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Baseline
          </Button>
          <Button
            variant={showCriticalPath ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-[11px] px-2 gap-1"
            onClick={() => setShowCriticalPath(!showCriticalPath)}
          >
            <Zap className="h-3 w-3" />
            Critical
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Expand/Collapse */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] px-2 gap-1"
            onClick={anyExpanded ? collapseAll : expandAll}
          >
            <LayoutList className="h-3 w-3" />
            {anyExpanded ? "Collapse" : "Expand"}
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center bg-background rounded-md border border-border overflow-hidden">
            {zoomOptions.map((opt) => (
              <button
                key={opt.key}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium transition-all",
                  zoomLevel === opt.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setZoomLevel(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      <div className="flex overflow-hidden" style={{ height: isFullscreen ? "calc(100vh - 100px)" : "auto" }}>
        {/* ─── Sidebar ─── */}
        <div
          ref={sidebarRef}
          className="flex-shrink-0 border-r border-border bg-card overflow-hidden"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Header */}
          <div
            className="flex items-center px-4 border-b border-border bg-muted/20 sticky top-0 z-10"
            style={{ height: HEADER_HEIGHT }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex-1">
              Milestone
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground w-16 text-right">
              Progress
            </span>
          </div>

          {/* Rows */}
          {bars.map((bar, barIdx) => {
            const config = statusConfig[bar.status] || statusConfig.todo;
            const hasDeliverables = bar.deliverables && bar.deliverables.length > 0;
            const isExpanded = expandedRows[bar.id];
            const isHovered = hoveredRow === bar.id;
            const isCritical = criticalPathIds.has(bar.id);
            const isSelected = selectedBar === bar.id;

            return (
              <div key={bar.id}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 border-b border-border/30 transition-all duration-100 cursor-pointer group",
                    isHovered && "bg-accent/50",
                    isSelected && "bg-accent",
                    isCritical && showCriticalPath && "border-l-2 border-l-red-500"
                  )}
                  style={{ height: ROW_HEIGHT }}
                  onMouseEnter={() => setHoveredRow(bar.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => {
                    if (hasDeliverables) toggleRow(bar.id);
                    setSelectedBar(bar.id === selectedBar ? null : bar.id);
                  }}
                >
                  {/* Row number */}
                  <span className="text-[10px] text-muted-foreground/50 w-5 text-right tabular-nums flex-shrink-0">
                    {barIdx + 1}
                  </span>

                  {/* Expand */}
                  <div className="w-4 flex-shrink-0 flex items-center justify-center">
                    {hasDeliverables ? (
                      <span className="text-muted-foreground">
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </span>
                    ) : (
                      <div className="w-3" />
                    )}
                  </div>

                  {/* Status dot */}
                  <div className="relative flex-shrink-0">
                    <div className={cn("h-2.5 w-2.5 rounded-full", config.dot)} />
                    {bar.status === "in-progress" && (
                      <div className={cn("absolute inset-0 h-2.5 w-2.5 rounded-full animate-ping opacity-20", config.dot)} />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-medium text-foreground truncate block leading-tight">
                      {bar.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {hasDeliverables && (
                        <span className="text-[9px] text-muted-foreground">
                          {bar.deliverables!.length} items
                        </span>
                      )}
                      {bar.assignee && (
                        <span className="text-[9px] text-muted-foreground/60">
                          • {bar.assignee}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 w-16 justify-end">
                    <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", config.fill)}
                        style={{ width: `${bar.progress}%` }}
                      />
                    </div>
                    <span className={cn("text-[10px] font-bold tabular-nums w-7 text-right", bar.progress === 100 ? "text-emerald-500" : "text-foreground")}>
                      {bar.progress}%
                    </span>
                  </div>
                </div>

                {/* Sub-rows */}
                {isExpanded &&
                  bar.deliverables?.map((d, dIdx) => {
                    const dCfg = deliverableStatusConfig[d.status] || deliverableStatusConfig.todo;
                    return (
                      <div
                        key={d.id}
                        className="flex items-center gap-2 px-3 pl-14 border-b border-border/15 bg-muted/[0.04] hover:bg-muted/20 transition-colors"
                        style={{ height: SUB_ROW_HEIGHT }}
                      >
                        {/* Tree line */}
                        <div className="absolute left-8 w-px bg-border/30" style={{ height: SUB_ROW_HEIGHT, marginTop: dIdx === 0 ? -SUB_ROW_HEIGHT / 2 : 0 }} />
                        <div className={cn("h-2 w-2 rounded-full flex-shrink-0", dCfg.dot)} />
                        <span className="text-[11px] text-muted-foreground truncate flex-1">{d.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] h-4 px-1.5 capitalize",
                            d.status === "done" && "border-emerald-500/20 text-emerald-600 bg-emerald-500/5",
                            d.status === "in-progress" && "border-blue-500/20 text-blue-600 bg-blue-500/5",
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

        {/* ─── Timeline ─── */}
        <div
          className="flex-1 overflow-auto"
          ref={scrollRef}
          onScroll={handleTimelineScroll}
        >
          <div
            className={cn("relative", zoomLevel === "day" && "min-w-[2000px]", zoomLevel === "week" && "min-w-[1200px]", zoomLevel === "month" && "min-w-[700px]")}
            ref={timelineRef}
          >
            {/* Timeline Header */}
            <div className="sticky top-0 z-20 border-b border-border bg-muted/30 backdrop-blur-sm" style={{ height: HEADER_HEIGHT }}>
              <div className="relative h-full">
                {zoomLevel === "month" &&
                  months.map((month, idx) => {
                    const monthStart = idx === 0 ? projStart : month;
                    const monthEnd = idx === months.length - 1 ? projEnd : new Date(month.getFullYear(), month.getMonth() + 1, 0);
                    const leftPct = (differenceInDays(monthStart, projStart) / totalDays) * 100;
                    const widthPct = (differenceInDays(monthEnd, monthStart) / totalDays) * 100;
                    const isCurrentMonth = isSameMonth(month, new Date());
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/20",
                          isCurrentMonth && "bg-blue-500/[0.03]"
                        )}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      >
                        <div className="px-3 flex items-baseline gap-1">
                          <span className={cn("text-[11px] font-bold uppercase tracking-wide", isCurrentMonth ? "text-blue-500" : "text-muted-foreground/70")}>
                            {format(month, "MMM")}
                          </span>
                          <span className={cn("text-[10px]", isCurrentMonth ? "text-blue-500/50" : "text-muted-foreground/30")}>
                            {format(month, "yyyy")}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                {zoomLevel === "week" &&
                  weeks.map((week, idx) => {
                    const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
                    const leftPct = Math.max((differenceInDays(week, projStart) / totalDays) * 100, 0);
                    const widthPct = Math.max((differenceInDays(weekEnd, week) / totalDays) * 100, 1);
                    const isCurrentWeek = differenceInDays(new Date(), week) >= 0 && differenceInDays(new Date(), weekEnd) <= 0;
                    return (
                      <div
                        key={idx}
                        className={cn("absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/15", isCurrentWeek && "bg-blue-500/[0.03]")}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      >
                        <span className={cn("text-[9px] font-medium px-1.5 truncate", isCurrentWeek ? "text-blue-500" : "text-muted-foreground/50")}>
                          {format(week, "d MMM")}
                        </span>
                      </div>
                    );
                  })}

                {zoomLevel === "day" &&
                  days.map((day, idx) => {
                    const leftPct = (differenceInDays(day, projStart) / totalDays) * 100;
                    const widthPct = (1 / totalDays) * 100;
                    const isToday = isSameDay(day, new Date());
                    const isWkend = isWeekend(day);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/10",
                          isToday && "bg-blue-500/[0.05]",
                          isWkend && "bg-muted/30"
                        )}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      >
                        <span className={cn("text-[7px] font-medium text-center block", isToday ? "text-blue-500 font-bold" : isWkend ? "text-muted-foreground/30" : "text-muted-foreground/40")}>
                          {format(day, "d")}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Timeline Body */}
            <div className="relative">
              {/* Weekend shading */}
              {(zoomLevel === "week" || zoomLevel === "day") && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  {weekendDays.map((wd, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 bg-muted/20"
                      style={{ left: `${wd.leftPct}%`, width: `${wd.widthPct}%` }}
                    />
                  ))}
                </div>
              )}

              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {(zoomLevel === "month" ? months : zoomLevel === "week" ? weeks : days.filter((_, i) => i % 7 === 0)).map((unit, idx) => {
                  if (idx === 0) return null;
                  const leftPct = (differenceInDays(unit, projStart) / totalDays) * 100;
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
                <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${todayPct}%` }}>
                  <div className="absolute -top-0 -translate-x-1/2">
                    <div className="bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-b shadow tracking-wider">
                      TODAY
                    </div>
                  </div>
                  <div className="w-0 h-full mx-auto" style={{ borderLeft: "1.5px dashed hsla(0, 84%, 60%, 0.35)" }} />
                </div>
              )}

              {/* Dependency arrows (right-angle connectors) */}
              <svg
                className="absolute inset-0 w-full pointer-events-none z-10"
                style={{ height: totalBodyHeight || "100%" }}
              >
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 6 2.5, 0 5" fill="hsl(var(--muted-foreground))" opacity="0.35" />
                  </marker>
                  <marker id="arrowhead-critical" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 6 2.5, 0 5" fill="hsl(0, 84%, 60%)" opacity="0.6" />
                  </marker>
                </defs>
                {bars.map((bar, idx) => {
                  if (idx === 0) return null;
                  const prevBar = bars[idx - 1];
                  const prevY = getRowY(idx - 1) + ROW_HEIGHT / 2;
                  const currY = getRowY(idx) + ROW_HEIGHT / 2;

                  const offset = dragOffsets[prevBar.id] || { leftDelta: 0, widthDelta: 0 };
                  const x1Pct = prevBar.leftPct + offset.leftDelta + prevBar.widthPct + offset.widthDelta;
                  const x2Pct = bar.leftPct + (dragOffsets[bar.id]?.leftDelta || 0);

                  const isCriticalEdge = showCriticalPath && criticalPathIds.has(prevBar.id) && criticalPathIds.has(bar.id);

                  // Right-angle path: go right from end of prev, then down, then right to start of current
                  const midX = (x1Pct + x2Pct) / 2;

                  return (
                    <g key={bar.id}>
                      <path
                        d={`M ${x1Pct}% ${prevY} L ${midX}% ${prevY} L ${midX}% ${currY} L ${x2Pct}% ${currY}`}
                        fill="none"
                        stroke={isCriticalEdge ? "hsl(0, 84%, 60%)" : "hsl(var(--muted-foreground))"}
                        strokeWidth={isCriticalEdge ? "2" : "1"}
                        strokeDasharray={isCriticalEdge ? "none" : "4 3"}
                        opacity={isCriticalEdge ? "0.5" : "0.2"}
                        markerEnd={isCriticalEdge ? "url(#arrowhead-critical)" : "url(#arrowhead)"}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Milestone bar rows */}
              {bars.map((bar) => {
                const config = statusConfig[bar.status] || statusConfig.todo;
                const isHovered = hoveredRow === bar.id;
                const isExpanded = expandedRows[bar.id];
                const isCritical = showCriticalPath && criticalPathIds.has(bar.id);
                const offset = dragOffsets[bar.id] || { leftDelta: 0, widthDelta: 0 };
                const finalLeft = Math.max(0, bar.leftPct + offset.leftDelta);
                const finalWidth = Math.max(2, bar.widthPct + offset.widthDelta);

                return (
                  <div key={bar.id}>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "relative border-b border-border/20 transition-all duration-100",
                              isHovered && "bg-accent/30",
                              isCritical && "bg-red-500/[0.02]"
                            )}
                            style={{ height: ROW_HEIGHT }}
                            onMouseEnter={() => setHoveredRow(bar.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <div className="absolute inset-0 flex items-center">
                              {/* Baseline ghost bar */}
                              {showBaseline && bar.baselineDueDate && (
                                <div
                                  className="absolute h-10 rounded-md border border-dashed border-muted-foreground/20 pointer-events-none"
                                  style={{
                                    left: `${bar.leftPct}%`,
                                    width: `${bar.baselineWidthPct}%`,
                                    opacity: 0.4,
                                  }}
                                >
                                  <div className="absolute inset-0 bg-muted-foreground/5 rounded-md" />
                                  <div className="absolute right-1 top-0.5 text-[7px] text-muted-foreground/50 font-medium">
                                    Baseline
                                  </div>
                                </div>
                              )}

                              {/* Main bar */}
                              <div
                                className={cn(
                                  "absolute h-9 rounded-md overflow-visible cursor-pointer transition-shadow duration-150 group/bar",
                                  isHovered && "shadow-lg",
                                  isCritical && "ring-1 ring-red-500/30",
                                  dragState?.milestoneId === bar.id && "shadow-xl z-20"
                                )}
                                style={{
                                  left: `${finalLeft}%`,
                                  width: `${finalWidth}%`,
                                }}
                                onClick={() => setSelectedBar(bar.id === selectedBar ? null : bar.id)}
                              >
                                {/* Track */}
                                <div className={cn("absolute inset-0 rounded-md", config.track, "border", config.border)} />

                                {/* Progress fill */}
                                <div
                                  className={cn("absolute inset-y-0 left-0 rounded-l-md bg-gradient-to-r transition-all duration-500", config.gradient)}
                                  style={{
                                    width: `${bar.progress}%`,
                                    borderRadius: bar.progress === 100 ? "0.375rem" : "0.375rem 0 0 0.375rem",
                                  }}
                                />

                                {/* Stripe pattern for in-progress */}
                                {bar.status === "in-progress" && (
                                  <div className="absolute inset-y-0 left-0 overflow-hidden rounded-l-md" style={{ width: `${bar.progress}%` }}>
                                    <div className="absolute inset-0 opacity-[0.06]" style={{
                                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, white 4px, white 5px)",
                                    }} />
                                  </div>
                                )}

                                {/* Label inside bar */}
                                <div className="relative h-full flex items-center justify-between px-2.5 z-10">
                                  <span className={cn("text-[10px] font-semibold truncate", bar.progress > 35 ? "text-white drop-shadow-sm" : config.text)}>
                                    {bar.name}
                                  </span>
                                  <span className={cn("text-[9px] font-bold ml-1.5 flex-shrink-0 tabular-nums", bar.progress > 65 ? "text-white/80" : config.text)}>
                                    {bar.progress}%
                                  </span>
                                </div>

                                {/* ─── Drag handles ─── */}
                                {/* Left handle */}
                                <div
                                  className="absolute -left-1 top-0 bottom-0 w-3 cursor-col-resize z-20 flex items-center justify-center opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                  onMouseDown={(e) => handleDragStart(e, bar.id, "left", bar.leftPct, bar.widthPct)}
                                >
                                  <div className="w-1 h-5 rounded-full bg-foreground/30 hover:bg-foreground/60 transition-colors" />
                                </div>
                                {/* Right handle */}
                                <div
                                  className="absolute -right-1 top-0 bottom-0 w-3 cursor-col-resize z-20 flex items-center justify-center opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                  onMouseDown={(e) => handleDragStart(e, bar.id, "right", bar.leftPct, bar.widthPct)}
                                >
                                  <div className="w-1 h-5 rounded-full bg-foreground/30 hover:bg-foreground/60 transition-colors" />
                                </div>
                                {/* Move handle (center grip) */}
                                <div
                                  className="absolute left-1/2 -translate-x-1/2 -bottom-3 cursor-grab z-20 opacity-0 group-hover/bar:opacity-100 transition-opacity active:cursor-grabbing"
                                  onMouseDown={(e) => handleDragStart(e, bar.id, "move", bar.leftPct, bar.widthPct)}
                                >
                                  <GripHorizontal className="h-3 w-3 text-muted-foreground/50 hover:text-muted-foreground" />
                                </div>
                              </div>

                              {/* Due date diamond marker */}
                              <div
                                className="absolute z-10 pointer-events-none"
                                style={{ left: `calc(${finalLeft + finalWidth}% - 4px)` }}
                              >
                                <div className={cn("w-2 h-2 rotate-45 shadow-sm", config.fill, "border border-white/40")} />
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs p-0 overflow-hidden rounded-lg shadow-xl border-border/40">
                          <div className="p-3.5 space-y-2.5">
                            <div className="flex items-start gap-2">
                              <div className={cn("p-1 rounded-md mt-0.5", config.bg)}>
                                <config.icon className={cn("h-3.5 w-3.5", config.text)} />
                              </div>
                              <div>
                                <p className="font-semibold text-[13px] text-foreground leading-tight">{bar.name}</p>
                                <p className={cn("text-[10px] font-medium mt-0.5", config.text)}>{config.label}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-xs">
                              <div>
                                <p className="text-muted-foreground/70 text-[9px] uppercase tracking-wider">Start</p>
                                <p className="font-medium">{format(bar.start, "MMM d, yyyy")}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground/70 text-[9px] uppercase tracking-wider">Due</p>
                                <p className="font-medium">{format(bar.end, "MMM d, yyyy")}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground/70 text-[9px] uppercase tracking-wider">Duration</p>
                                <p className="font-medium">{differenceInDays(bar.end, bar.start)}d</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground/70 text-[9px] uppercase tracking-wider">Items</p>
                                <p className="font-medium">{bar.deliverables?.length || 0}</p>
                              </div>
                            </div>
                            {/* Progress */}
                            <div>
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-bold">{bar.progress}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)} style={{ width: `${bar.progress}%` }} />
                              </div>
                            </div>
                            {bar.deliverables && bar.deliverables.length > 0 && (
                              <div className="border-t border-border/30 pt-2">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Deliverables</p>
                                <div className="space-y-1">
                                  {bar.deliverables.slice(0, 4).map((d) => {
                                    const dCfg = deliverableStatusConfig[d.status] || deliverableStatusConfig.todo;
                                    return (
                                      <div key={d.id} className="flex items-center gap-1.5 text-[10px]">
                                        <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dCfg.dot)} />
                                        <span className="truncate text-foreground/70">{d.name}</span>
                                        {d.status === "done" && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 ml-auto flex-shrink-0" />}
                                      </div>
                                    );
                                  })}
                                  {bar.deliverables.length > 4 && (
                                    <p className="text-[9px] text-muted-foreground">+{bar.deliverables.length - 4} more</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Expanded deliverable rows */}
                    {isExpanded &&
                      bar.deliverables?.map((d) => {
                        const dStatus = d.status as keyof typeof statusConfig;
                        const dConfig = statusConfig[dStatus] || statusConfig.todo;
                        const dLeftPct = finalLeft;
                        const dWidthPct = finalWidth * (d.status === "done" ? 1 : d.status === "in-progress" ? 0.6 : 0.3);
                        return (
                          <div
                            key={d.id}
                            className="relative border-b border-border/10 bg-muted/[0.03] hover:bg-muted/15 transition-colors"
                            style={{ height: SUB_ROW_HEIGHT }}
                          >
                            <div className="absolute inset-0 flex items-center">
                              <div
                                className={cn("absolute h-5 rounded overflow-hidden border", dConfig.border)}
                                style={{ left: `${dLeftPct}%`, width: `${dWidthPct}%` }}
                              >
                                <div className={cn("absolute inset-0", dConfig.track)} />
                                <div
                                  className={cn("absolute inset-y-0 left-0 bg-gradient-to-r", dConfig.gradient)}
                                  style={{ width: d.status === "done" ? "100%" : d.status === "in-progress" ? "60%" : "0%", opacity: 0.6 }}
                                />
                                <div className="relative h-full flex items-center px-2 z-10">
                                  <span className="text-[9px] font-medium text-foreground/60 truncate">{d.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer with minimap ─── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/10">
        <div className="flex items-center gap-4">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("h-1.5 w-4 rounded-sm bg-gradient-to-r", cfg.gradient)} />
              <span className="text-[9px] text-muted-foreground font-medium">{cfg.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 border-t border-dashed border-red-500/40" />
            <span className="text-[9px] text-muted-foreground">Today</span>
          </div>
          {showBaseline && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2 rounded-sm border border-dashed border-muted-foreground/30" />
              <span className="text-[9px] text-muted-foreground">Baseline</span>
            </div>
          )}
        </div>

        {/* Minimap */}
        <div className="flex items-center gap-3">
          <div
            className="border border-border rounded bg-background overflow-hidden"
            style={{ width: minimapWidth, height: minimapHeight }}
          >
            <svg width={minimapWidth} height={minimapHeight} className="block">
              {bars.map((bar, idx) => {
                const config = statusConfig[bar.status] || statusConfig.todo;
                const y = (idx / bars.length) * (minimapHeight - 4) + 2;
                const h = Math.max((minimapHeight - 4) / bars.length - 1, 2);
                return (
                  <rect
                    key={bar.id}
                    x={`${bar.leftPct}%`}
                    y={y}
                    width={`${bar.widthPct}%`}
                    height={h}
                    rx="1"
                    fill={config.barColor}
                    opacity={0.7}
                  />
                );
              })}
              {todayPct !== null && (
                <line x1={`${todayPct}%`} y1="0" x2={`${todayPct}%`} y2={minimapHeight} stroke="hsl(0, 84%, 60%)" strokeWidth="1" opacity="0.5" />
              )}
            </svg>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {format(projStart, "MMM d")} — {format(projEnd, "MMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};
