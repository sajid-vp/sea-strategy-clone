import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  differenceInDays,
  parseISO,
  format,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  isSameMonth,
  addDays,
  isWeekend,
  startOfMonth,
  endOfMonth,
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
  ZoomIn,
  ZoomOut,
  Milestone as MilestoneIcon,
  LayoutList,
  ArrowRight,
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
}

interface GanttChartProps {
  milestones: Milestone[];
  projectStartDate: string;
  projectEndDate: string;
}

const statusConfig = {
  done: {
    gradient: "from-success to-success/80",
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    dot: "bg-success",
    track: "bg-success/10",
    fill: "bg-success",
    icon: CheckCircle2,
    label: "Completed",
    badgeBg: "bg-success/10 text-success border-success/20",
  },
  "in-progress": {
    gradient: "from-primary to-primary/80",
    bg: "bg-primary/8",
    text: "text-primary",
    border: "border-primary/20",
    dot: "bg-primary",
    track: "bg-primary/10",
    fill: "bg-primary",
    icon: Clock,
    label: "In Progress",
    badgeBg: "bg-primary/10 text-primary border-primary/20",
  },
  todo: {
    gradient: "from-muted-foreground/40 to-muted-foreground/50",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    dot: "bg-muted-foreground/40",
    track: "bg-muted",
    fill: "bg-muted-foreground/40",
    icon: Clock,
    label: "To Do",
    badgeBg: "bg-muted text-muted-foreground border-border",
  },
  delayed: {
    gradient: "from-destructive to-destructive/80",
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/20",
    dot: "bg-destructive",
    track: "bg-destructive/10",
    fill: "bg-destructive",
    icon: AlertCircle,
    label: "Delayed",
    badgeBg: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const deliverableStatusConfig: Record<string, { dot: string; text: string }> = {
  done: { dot: "bg-success", text: "text-success" },
  "in-progress": { dot: "bg-primary", text: "text-primary" },
  todo: { dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

export const GanttChart = ({ milestones, projectStartDate, projectEndDate }: GanttChartProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [zoomLevel, setZoomLevel] = useState<"month" | "week">("month");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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
      return { ...m, start, end, leftPct, widthPct };
    });
  }, [milestones, projectStartDate, projectEndDate, totalDays]);

  const todayPct = (() => {
    const today = new Date();
    const days = differenceInDays(today, projStart);
    const pct = (days / totalDays) * 100;
    return pct >= 0 && pct <= 100 ? pct : null;
  })();

  const SIDEBAR_WIDTH = 300;
  const ROW_HEIGHT = 48;
  const SUB_ROW_HEIGHT = 38;
  const HEADER_HEIGHT = 52;

  const overallProgress =
    milestones.length > 0
      ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length)
      : 0;

  const completedCount = milestones.filter((m) => m.status === "done").length;
  const anyExpanded = Object.values(expandedRows).some(Boolean);

  // Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current && todayPct !== null) {
      const container = scrollRef.current;
      const scrollTarget = (todayPct / 100) * container.scrollWidth - container.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
    }
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-gradient-to-r from-muted/40 to-muted/20">
        <div className="flex items-center gap-4">
          {/* Stats chips */}
          <div className="flex items-center gap-1.5 bg-card rounded-lg border border-border px-3 py-1.5 shadow-sm">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">{milestones.length}</span>
            <span className="text-xs text-muted-foreground">milestones</span>
          </div>

          <div className="flex items-center gap-1.5 bg-card rounded-lg border border-border px-3 py-1.5 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-semibold text-foreground">
              {completedCount}/{milestones.length}
            </span>
            <span className="text-xs text-muted-foreground">done</span>
          </div>

          {/* Overall progress */}
          <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-1.5 shadow-sm">
            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-foreground">{overallProgress}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Expand/Collapse */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-2.5 text-muted-foreground"
            onClick={anyExpanded ? collapseAll : expandAll}
          >
            <LayoutList className="h-3 w-3 mr-1" />
            {anyExpanded ? "Collapse" : "Expand"}
          </Button>

          <div className="h-5 w-px bg-border" />

          {/* Zoom controls */}
          <div className="flex items-center bg-card rounded-lg border border-border overflow-hidden shadow-sm">
            <button
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-all",
                zoomLevel === "month"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setZoomLevel("month")}
            >
              Month
            </button>
            <div className="w-px h-5 bg-border" />
            <button
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-all",
                zoomLevel === "week"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setZoomLevel("week")}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className="flex overflow-hidden">
        {/* ─── Sidebar ─── */}
        <div
          className="flex-shrink-0 border-r border-border bg-card z-10"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Sidebar Header */}
          <div
            className="flex items-center px-5 border-b border-border bg-muted/30"
            style={{ height: HEADER_HEIGHT }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Milestone
            </span>
            <span className="ml-auto text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Progress
            </span>
          </div>

          {/* Sidebar Rows */}
          {bars.map((bar) => {
            const config = statusConfig[bar.status] || statusConfig.todo;
            const hasDeliverables = bar.deliverables && bar.deliverables.length > 0;
            const isExpanded = expandedRows[bar.id];
            const isHovered = hoveredRow === bar.id;

            return (
              <div key={bar.id}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 px-4 border-b border-border/40 transition-all duration-150 cursor-pointer group",
                    isHovered && "bg-accent/60"
                  )}
                  style={{ height: ROW_HEIGHT }}
                  onMouseEnter={() => setHoveredRow(bar.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => hasDeliverables && toggleRow(bar.id)}
                >
                  {/* Expand toggle */}
                  <div className="w-5 flex-shrink-0 flex items-center justify-center">
                    {hasDeliverables ? (
                      <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : (
                      <div className="w-3.5" />
                    )}
                  </div>

                  {/* Status indicator */}
                  <div className="relative flex-shrink-0">
                    <div className={cn("h-3 w-3 rounded-full", config.dot)} />
                    {bar.status === "in-progress" && (
                      <div className={cn("absolute inset-0 h-3 w-3 rounded-full animate-ping opacity-30", config.dot)} />
                    )}
                  </div>

                  {/* Name + deliverable count */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-foreground truncate block leading-tight">
                      {bar.name}
                    </span>
                    {hasDeliverables && (
                      <span className="text-[10px] text-muted-foreground">
                        {bar.deliverables!.length} deliverables
                      </span>
                    )}
                  </div>

                  {/* Mini progress bar */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", config.fill)}
                        style={{ width: `${bar.progress}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-bold w-8 text-right tabular-nums",
                        bar.progress === 100 ? "text-emerald-600" : "text-foreground"
                      )}
                    >
                      {bar.progress}%
                    </span>
                  </div>
                </div>

                {/* Deliverable sub-rows */}
                {isExpanded &&
                  bar.deliverables?.map((d) => {
                    const dCfg = deliverableStatusConfig[d.status] || deliverableStatusConfig.todo;
                    return (
                      <div
                        key={d.id}
                        className="flex items-center gap-2.5 px-4 pl-12 border-b border-border/20 bg-muted/15 hover:bg-muted/30 transition-colors"
                        style={{ height: SUB_ROW_HEIGHT }}
                      >
                        <div className={cn("h-2 w-2 rounded-full flex-shrink-0", dCfg.dot)} />
                        <span className="text-[12px] text-muted-foreground truncate flex-1">
                          {d.name}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-medium capitalize px-2 py-0.5 rounded-full border",
                            d.status === "done"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : d.status === "in-progress"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          )}
                        >
                          {d.status.replace("-", " ")}
                        </span>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* ─── Timeline ─── */}
        <div className="flex-1 overflow-x-auto scrollbar-thin" ref={scrollRef}>
          <div className="min-w-[700px]" ref={timelineRef}>
            {/* Timeline Header */}
            <div
              className="relative border-b border-border bg-muted/20"
              style={{ height: HEADER_HEIGHT }}
            >
              {zoomLevel === "month"
                ? months.map((month, idx) => {
                    const monthStart = idx === 0 ? projStart : month;
                    const monthEnd =
                      idx === months.length - 1
                        ? projEnd
                        : new Date(month.getFullYear(), month.getMonth() + 1, 0);
                    const leftPct = (differenceInDays(monthStart, projStart) / totalDays) * 100;
                    const widthPct = (differenceInDays(monthEnd, monthStart) / totalDays) * 100;
                    const isCurrentMonth = isSameMonth(month, new Date());
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/30",
                          isCurrentMonth && "bg-primary/[0.03]"
                        )}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      >
                        <div className="px-3">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider",
                              isCurrentMonth ? "text-primary" : "text-muted-foreground/70"
                            )}
                          >
                            {format(month, "MMM")}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] ml-1",
                              isCurrentMonth
                                ? "text-primary/60 font-medium"
                                : "text-muted-foreground/40"
                            )}
                          >
                            {format(month, "yyyy")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                : weeks.map((week, idx) => {
                    const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
                    const leftPct = Math.max(
                      (differenceInDays(week, projStart) / totalDays) * 100,
                      0
                    );
                    const widthPct = Math.max(
                      (differenceInDays(weekEnd, week) / totalDays) * 100,
                      1
                    );
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 h-full flex flex-col justify-end pb-2 border-r border-border/20"
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      >
                        <span className="text-[9px] font-medium text-muted-foreground/60 px-2 truncate">
                          {format(week, "d MMM")}
                        </span>
                      </div>
                    );
                  })}
            </div>

            {/* Timeline Body */}
            <div className="relative">
              {/* Vertical grid lines */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {(zoomLevel === "month" ? months : weeks).map((unit, idx) => {
                  if (idx === 0) return null;
                  const leftPct = (differenceInDays(unit, projStart) / totalDays) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 w-px bg-border/15"
                      style={{ left: `${leftPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Today line */}
              {todayPct !== null && (
                <div
                  className="absolute top-0 bottom-0 z-20 pointer-events-none"
                  style={{ left: `${todayPct}%` }}
                >
                  {/* Top badge */}
                  <div className="absolute -top-0 -translate-x-1/2 z-30">
                    <div className="bg-destructive text-destructive-foreground text-[8px] font-black px-2 py-1 rounded-b-md shadow-md tracking-wider">
                      TODAY
                    </div>
                  </div>
                  {/* Dashed line */}
                  <div
                    className="w-0 h-full mx-auto"
                    style={{
                      borderLeft: "2px dashed hsl(var(--destructive) / 0.4)",
                    }}
                  />
                </div>
              )}

              {/* Dependency connectors between milestones */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                style={{
                  height:
                    bars.reduce((h, bar) => {
                      const expanded = expandedRows[bar.id];
                      return (
                        h +
                        ROW_HEIGHT +
                        (expanded ? (bar.deliverables?.length || 0) * SUB_ROW_HEIGHT : 0)
                      );
                    }, 0) || "100%",
                }}
              >
                {bars.map((bar, idx) => {
                  if (idx === 0) return null;
                  const prevBar = bars[idx - 1];

                  // Calculate Y position accounting for expanded rows before this
                  let prevY = 0;
                  let currY = 0;
                  for (let i = 0; i < bars.length; i++) {
                    const b = bars[i];
                    const rowH =
                      ROW_HEIGHT +
                      (expandedRows[b.id] ? (b.deliverables?.length || 0) * SUB_ROW_HEIGHT : 0);
                    if (i < idx - 1) prevY += rowH;
                    if (i < idx) currY += rowH;
                    if (i === idx - 1) prevY += ROW_HEIGHT / 2;
                  }
                  currY += ROW_HEIGHT / 2;

                  const x1 = prevBar.leftPct + prevBar.widthPct;
                  const x2 = bar.leftPct;

                  return (
                    <g key={bar.id}>
                      <line
                        x1={`${x1}%`}
                        y1={prevY}
                        x2={`${x2}%`}
                        y2={currY}
                        stroke="hsl(var(--border))"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.5"
                      />
                      {/* Arrow head */}
                      <circle
                        cx={`${x2}%`}
                        cy={currY}
                        r="3"
                        fill="hsl(var(--muted-foreground))"
                        opacity="0.4"
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

                return (
                  <div key={bar.id}>
                    {/* Main row */}
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "relative border-b border-border/30 transition-all duration-150",
                              isHovered && "bg-accent/40"
                            )}
                            style={{ height: ROW_HEIGHT }}
                            onMouseEnter={() => setHoveredRow(bar.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <div className="absolute inset-0 flex items-center">
                              {/* The bar */}
                              <div
                                className={cn(
                                  "absolute h-8 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group/bar",
                                  "hover:shadow-lg hover:scale-y-110",
                                  isHovered && "shadow-md"
                                )}
                                style={{
                                  left: `${bar.leftPct}%`,
                                  width: `${bar.widthPct}%`,
                                }}
                              >
                                {/* Background track */}
                                <div className={cn("absolute inset-0 rounded-lg", config.track)} />

                                {/* Progress fill with gradient */}
                                <div
                                  className={cn(
                                    "absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r transition-all duration-700 ease-out",
                                    config.gradient
                                  )}
                                  style={{ width: `${bar.progress}%` }}
                                />

                                {/* Subtle pattern overlay */}
                                {bar.status === "in-progress" && (
                                  <div
                                    className="absolute inset-y-0 left-0 overflow-hidden rounded-lg"
                                    style={{ width: `${bar.progress}%` }}
                                  >
                                    <div
                                      className="absolute inset-0 opacity-[0.08]"
                                      style={{
                                        backgroundImage:
                                          "repeating-linear-gradient(45deg, transparent, transparent 4px, white 4px, white 5px)",
                                      }}
                                    />
                                  </div>
                                )}

                                {/* Inner content */}
                                <div className="relative h-full flex items-center justify-between px-3 z-10">
                                  <span
                                    className={cn(
                                      "text-[11px] font-semibold truncate",
                                      bar.progress > 40
                                        ? "text-white drop-shadow-sm"
                                        : config.text
                                    )}
                                  >
                                    {bar.name}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-[10px] font-bold ml-2 flex-shrink-0 tabular-nums",
                                      bar.progress > 70
                                        ? "text-white/90"
                                        : config.text
                                    )}
                                  >
                                    {bar.progress}%
                                  </span>
                                </div>
                              </div>

                              {/* End diamond marker */}
                              <div
                                className="absolute z-10 pointer-events-none"
                                style={{
                                  left: `calc(${bar.leftPct + bar.widthPct}% - 5px)`,
                                }}
                              >
                                <div
                                  className={cn(
                                    "w-2.5 h-2.5 rotate-45 shadow-sm",
                                    config.fill,
                                    "border border-white/50"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs p-0 overflow-hidden rounded-xl shadow-xl border-border/50"
                        >
                          <div className="p-4 space-y-3">
                            {/* Tooltip header */}
                            <div className="flex items-start gap-2.5">
                              <div
                                className={cn(
                                  "p-1.5 rounded-lg mt-0.5",
                                  config.bg
                                )}
                              >
                                <config.icon className={cn("h-4 w-4", config.text)} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-foreground leading-tight">
                                  {bar.name}
                                </p>
                                <p className={cn("text-[11px] font-medium mt-0.5", config.text)}>
                                  {config.label}
                                </p>
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                              <div>
                                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
                                  Start
                                </p>
                                <p className="font-medium text-foreground">
                                  {format(bar.start, "MMM d, yyyy")}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
                                  Due
                                </p>
                                <p className="font-medium text-foreground">
                                  {format(bar.end, "MMM d, yyyy")}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
                                  Duration
                                </p>
                                <p className="font-medium text-foreground">
                                  {differenceInDays(bar.end, bar.start)} days
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
                                  Deliverables
                                </p>
                                <p className="font-medium text-foreground">
                                  {bar.deliverables?.length || 0}
                                </p>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div>
                              <div className="flex justify-between text-[11px] mb-1.5">
                                <span className="text-muted-foreground font-medium">Progress</span>
                                <span className="font-bold text-foreground">{bar.progress}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full bg-gradient-to-r transition-all",
                                    config.gradient
                                  )}
                                  style={{ width: `${bar.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Deliverables list */}
                            {bar.deliverables && bar.deliverables.length > 0 && (
                              <div className="border-t border-border/50 pt-2.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                  Deliverables
                                </p>
                                <div className="space-y-1.5">
                                  {bar.deliverables.map((d) => {
                                    const dCfg =
                                      deliverableStatusConfig[d.status] ||
                                      deliverableStatusConfig.todo;
                                    return (
                                      <div
                                        key={d.id}
                                        className="flex items-center gap-2 text-[11px]"
                                      >
                                        <div
                                          className={cn(
                                            "h-1.5 w-1.5 rounded-full flex-shrink-0",
                                            dCfg.dot
                                          )}
                                        />
                                        <span className="truncate text-foreground/80">
                                          {d.name}
                                        </span>
                                        {d.status === "done" && (
                                          <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0 ml-auto" />
                                        )}
                                      </div>
                                    );
                                  })}
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
                        const dLeftPct = bar.leftPct;
                        const dWidthPct =
                          bar.widthPct *
                          (d.status === "done" ? 1 : d.status === "in-progress" ? 0.6 : 0.3);

                        return (
                          <div
                            key={d.id}
                            className="relative border-b border-border/15 bg-muted/[0.06] hover:bg-muted/20 transition-colors"
                            style={{ height: SUB_ROW_HEIGHT }}
                          >
                            <div className="absolute inset-0 flex items-center">
                              <div
                                className={cn(
                                  "absolute h-5 rounded-md overflow-hidden",
                                  dConfig.border,
                                  "border"
                                )}
                                style={{
                                  left: `${dLeftPct}%`,
                                  width: `${dWidthPct}%`,
                                }}
                              >
                                <div className={cn("absolute inset-0", dConfig.track)} />
                                <div
                                  className={cn(
                                    "absolute inset-y-0 left-0 rounded-l-md bg-gradient-to-r",
                                    dConfig.gradient
                                  )}
                                  style={{
                                    width: d.status === "done" ? "100%" : d.status === "in-progress" ? "60%" : "0%",
                                    opacity: 0.75,
                                  }}
                                />
                                <div className="relative h-full flex items-center px-2.5 z-10">
                                  <span className="text-[10px] font-medium text-foreground/70 truncate">
                                    {d.name}
                                  </span>
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

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/15">
        <div className="flex items-center gap-5">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={cn("h-2 w-5 rounded-sm bg-gradient-to-r", cfg.gradient)} />
              <span className="text-[10px] text-muted-foreground font-medium">{cfg.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-4 border-t-2 border-dashed border-destructive/50" />
            <span className="text-[10px] text-muted-foreground font-medium">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 border-t border-dashed border-border" />
            <span className="text-[10px] text-muted-foreground font-medium">Dependency</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
          <CalendarDays className="h-3 w-3" />
          {format(projStart, "MMM d, yyyy")} — {format(projEnd, "MMM d, yyyy")}
        </div>
      </div>
    </div>
  );
};
