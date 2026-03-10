import { useMemo, useState, useRef } from "react";
import { differenceInDays, parseISO, format, eachMonthOfInterval, eachWeekOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronRight, ChevronLeft, CalendarDays, Layers, GripVertical, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    color: "hsl(var(--success))",
    bgClass: "bg-success/10",
    textClass: "text-success",
    borderClass: "border-success/20",
    barClass: "bg-success",
    icon: CheckCircle2,
    label: "Completed",
  },
  "in-progress": {
    color: "hsl(var(--primary))",
    bgClass: "bg-primary/10",
    textClass: "text-primary",
    borderClass: "border-primary/20",
    barClass: "bg-primary",
    icon: Clock,
    label: "In Progress",
  },
  todo: {
    color: "hsl(var(--muted-foreground))",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
    borderClass: "border-border",
    barClass: "bg-muted-foreground/40",
    icon: Clock,
    label: "To Do",
  },
  delayed: {
    color: "hsl(var(--destructive))",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
    borderClass: "border-destructive/20",
    barClass: "bg-destructive",
    icon: AlertCircle,
    label: "Delayed",
  },
};

const deliverableStatusColor: Record<string, string> = {
  done: "bg-success",
  "in-progress": "bg-primary",
  todo: "bg-muted-foreground/40",
};

export const GanttChart = ({ milestones, projectStartDate, projectEndDate }: GanttChartProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [zoomLevel, setZoomLevel] = useState<"month" | "week">("month");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const projStart = parseISO(projectStartDate);
  const projEnd = parseISO(projectEndDate);
  const totalDays = differenceInDays(projEnd, projStart) || 1;

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const months = useMemo(() => eachMonthOfInterval({ start: projStart, end: projEnd }), [projectStartDate, projectEndDate]);

  const weeks = useMemo(() => {
    try {
      return eachWeekOfInterval({ start: projStart, end: projEnd }, { weekStartsOn: 1 });
    } catch { return []; }
  }, [projectStartDate, projectEndDate]);

  const timeUnits = zoomLevel === "month" ? months : weeks;

  const bars = useMemo(() => {
    const sorted = [...milestones].sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
    let prevEnd = projStart;

    return sorted.map((m, idx) => {
      const end = parseISO(m.dueDate);
      const start = idx === 0 ? projStart : prevEnd;
      const leftPct = Math.max((differenceInDays(start, projStart) / totalDays) * 100, 0);
      const widthPct = Math.max((differenceInDays(end, start) / totalDays) * 100, 1.5);
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

  const SIDEBAR_WIDTH = 280;
  const ROW_HEIGHT = 44;
  const SUB_ROW_HEIGHT = 36;

  const overallProgress = milestones.length > 0
    ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length)
    : 0;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">{milestones.length} Milestones</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Overall</span>
            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="text-xs font-medium text-foreground">{overallProgress}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={zoomLevel === "month" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs px-2.5"
            onClick={() => setZoomLevel("month")}
          >
            <CalendarDays className="h-3 w-3 mr-1" />
            Months
          </Button>
          <Button
            variant={zoomLevel === "week" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs px-2.5"
            onClick={() => setZoomLevel("week")}
          >
            <CalendarDays className="h-3 w-3 mr-1" />
            Weeks
          </Button>
        </div>
      </div>

      <div className="flex overflow-hidden">
        {/* Sidebar - Fixed */}
        <div className="flex-shrink-0 border-r border-border bg-card" style={{ width: SIDEBAR_WIDTH }}>
          {/* Sidebar Header */}
          <div className="h-10 flex items-center px-4 border-b border-border bg-muted/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Milestone</span>
          </div>

          {/* Sidebar Rows */}
          {bars.map((bar, idx) => {
            const config = statusConfig[bar.status] || statusConfig.todo;
            const StatusIcon = config.icon;
            const hasDeliverables = bar.deliverables && bar.deliverables.length > 0;
            const isExpanded = expandedRows[bar.id];
            const isHovered = hoveredRow === bar.id;

            return (
              <div key={bar.id}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 border-b border-border/50 transition-colors cursor-pointer group",
                    isHovered && "bg-accent/50"
                  )}
                  style={{ height: ROW_HEIGHT }}
                  onMouseEnter={() => setHoveredRow(bar.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => hasDeliverables && toggleRow(bar.id)}
                >
                  {/* Expand toggle */}
                  <div className="w-4 flex-shrink-0">
                    {hasDeliverables && (
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        {isExpanded
                          ? <ChevronDown className="h-3.5 w-3.5" />
                          : <ChevronRight className="h-3.5 w-3.5" />
                        }
                      </button>
                    )}
                  </div>

                  {/* Status dot */}
                  <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", config.barClass)} />

                  {/* Name */}
                  <span className="text-xs font-medium text-foreground truncate flex-1">{bar.name}</span>

                  {/* Progress pill */}
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0",
                    config.bgClass, config.textClass
                  )}>
                    {bar.progress}%
                  </span>
                </div>

                {/* Deliverable sub-rows */}
                {isExpanded && bar.deliverables?.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 px-3 pl-9 border-b border-border/30 bg-muted/20"
                    style={{ height: SUB_ROW_HEIGHT }}
                  >
                    <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", deliverableStatusColor[d.status] || "bg-muted-foreground/40")} />
                    <span className="text-[11px] text-muted-foreground truncate">{d.name}</span>
                    <Badge variant="outline" className="text-[9px] h-4 ml-auto capitalize flex-shrink-0">
                      {d.status.replace("-", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Timeline Area - Scrollable */}
        <div className="flex-1 overflow-x-auto" ref={scrollRef}>
          <div className="min-w-[600px]">
            {/* Timeline Header */}
            <div className="relative h-10 border-b border-border bg-muted/20">
              {zoomLevel === "month" ? (
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
                        "absolute top-0 h-full flex items-end pb-2 border-r border-border/40",
                        isCurrentMonth && "bg-primary/5"
                      )}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider px-3",
                        isCurrentMonth ? "text-primary" : "text-muted-foreground"
                      )}>
                        {format(month, "MMM yyyy")}
                      </span>
                    </div>
                  );
                })
              ) : (
                weeks.map((week, idx) => {
                  const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
                  const leftPct = Math.max((differenceInDays(week, projStart) / totalDays) * 100, 0);
                  const widthPct = Math.max((differenceInDays(weekEnd, week) / totalDays) * 100, 1);
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 h-full flex items-end pb-2 border-r border-border/30"
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      <span className="text-[9px] font-medium text-muted-foreground px-1 truncate">
                        {format(week, "d MMM")}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Timeline Rows */}
            <div className="relative">
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                {(zoomLevel === "month" ? months : weeks).map((unit, idx) => {
                  if (idx === 0) return null;
                  const leftPct = (differenceInDays(unit, projStart) / totalDays) * 100;
                  return (
                    <div key={idx} className="absolute top-0 bottom-0 w-px bg-border/20" style={{ left: `${leftPct}%` }} />
                  );
                })}
              </div>

              {/* Today marker */}
              {todayPct !== null && (
                <div className="absolute top-0 bottom-0 z-30" style={{ left: `${todayPct}%` }}>
                  <div className="absolute top-0 w-5 -ml-2.5 flex flex-col items-center">
                    <div className="bg-destructive text-destructive-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-b-md shadow-sm">
                      TODAY
                    </div>
                  </div>
                  <div className="w-px h-full bg-destructive/60 mx-auto" style={{ borderLeft: '1px dashed hsl(var(--destructive) / 0.6)' }} />
                </div>
              )}

              {/* Milestone bars */}
              {bars.map((bar, idx) => {
                const config = statusConfig[bar.status] || statusConfig.todo;
                const isHovered = hoveredRow === bar.id;
                const isExpanded = expandedRows[bar.id];

                return (
                  <div key={bar.id}>
                    {/* Main milestone bar row */}
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "relative border-b border-border/50 transition-colors",
                              isHovered && "bg-accent/30"
                            )}
                            style={{ height: ROW_HEIGHT }}
                            onMouseEnter={() => setHoveredRow(bar.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <div className="absolute inset-0 flex items-center px-1">
                              {/* Bar */}
                              <div
                                className={cn(
                                  "absolute h-7 rounded-md overflow-hidden cursor-pointer transition-all duration-200",
                                  "shadow-sm hover:shadow-md",
                                  isHovered && "scale-y-[1.12]",
                                  config.borderClass, "border"
                                )}
                                style={{ left: `${bar.leftPct}%`, width: `${bar.widthPct}%` }}
                              >
                                {/* Track */}
                                <div className={cn("absolute inset-0", config.bgClass)} />
                                {/* Progress fill */}
                                <div
                                  className={cn("absolute inset-y-0 left-0 transition-all duration-500 rounded-l-md", config.barClass)}
                                  style={{ width: `${bar.progress}%`, opacity: 0.85 }}
                                />
                                {/* Shimmer for in-progress */}
                                {bar.status === "in-progress" && (
                                  <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                                    style={{ width: `${bar.progress}%` }}
                                  />
                                )}
                                {/* Inner label */}
                                <div className="relative h-full flex items-center justify-between px-2.5 z-10">
                                  <span className={cn(
                                    "text-[10px] font-bold truncate",
                                    bar.progress > 45 ? "text-white drop-shadow-sm" : config.textClass
                                  )}>
                                    {bar.name}
                                  </span>
                                  <span className={cn(
                                    "text-[10px] font-bold ml-2 flex-shrink-0",
                                    bar.progress > 80 ? "text-white/90" : config.textClass
                                  )}>
                                    {bar.progress}%
                                  </span>
                                </div>
                              </div>

                              {/* Diamond milestone marker at end */}
                              <div
                                className="absolute z-10 pointer-events-none"
                                style={{ left: `calc(${bar.leftPct + bar.widthPct}% - 4px)` }}
                              >
                                <div className={cn(
                                  "w-2 h-2 rotate-45 border",
                                  config.barClass, config.borderClass
                                )} />
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs p-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <config.icon className={cn("h-3.5 w-3.5", config.textClass)} />
                              <span className="font-semibold text-sm">{bar.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span>Start</span>
                              <span className="font-medium text-foreground">{format(bar.start, "MMM d, yyyy")}</span>
                              <span>Due</span>
                              <span className="font-medium text-foreground">{format(bar.end, "MMM d, yyyy")}</span>
                              <span>Duration</span>
                              <span className="font-medium text-foreground">{differenceInDays(bar.end, bar.start)} days</span>
                              <span>Status</span>
                              <Badge variant="outline" className={cn("text-[10px] h-4 w-fit capitalize", config.textClass)}>
                                {config.label}
                              </Badge>
                            </div>
                            <div className="pt-1">
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{bar.progress}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", config.barClass)} style={{ width: `${bar.progress}%` }} />
                              </div>
                            </div>
                            {bar.deliverables && bar.deliverables.length > 0 && (
                              <div className="border-t border-border pt-2 mt-1">
                                <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
                                  {bar.deliverables.length} Deliverables
                                </p>
                                <div className="space-y-1">
                                  {bar.deliverables.map(d => (
                                    <div key={d.id} className="flex items-center gap-2 text-[11px]">
                                      <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", deliverableStatusColor[d.status] || "bg-muted-foreground/40")} />
                                      <span className="truncate">{d.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Expanded deliverable sub-rows */}
                    {isExpanded && bar.deliverables?.map((d) => {
                      const dStatus = d.status as keyof typeof statusConfig;
                      const dConfig = statusConfig[dStatus] || statusConfig.todo;
                      // Deliverable bars span a portion of the milestone
                      const dLeftPct = bar.leftPct;
                      const dWidthPct = bar.widthPct * (d.status === "done" ? 1 : d.status === "in-progress" ? 0.6 : 0.3);
                      return (
                        <div
                          key={d.id}
                          className="relative border-b border-border/30 bg-muted/10"
                          style={{ height: SUB_ROW_HEIGHT }}
                        >
                          <div className="absolute inset-0 flex items-center px-1">
                            <div
                              className={cn(
                                "absolute h-4 rounded overflow-hidden border",
                                dConfig.borderClass
                              )}
                              style={{ left: `${dLeftPct}%`, width: `${dWidthPct}%` }}
                            >
                              <div className={cn("absolute inset-0", dConfig.bgClass)} />
                              <div className={cn("absolute inset-y-0 left-0 rounded-l", dConfig.barClass)} style={{ width: "100%", opacity: 0.7 }} />
                              <div className="relative h-full flex items-center px-2 z-10">
                                <span className="text-[9px] font-medium text-foreground/80 truncate">{d.name}</span>
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

      {/* Footer Legend */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
        <div className="flex items-center gap-5">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("h-2.5 w-6 rounded-sm", cfg.barClass)} />
              <span className="text-[10px] text-muted-foreground font-medium">{cfg.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-px bg-destructive border-l border-dashed border-destructive" />
            <span className="text-[10px] text-muted-foreground font-medium">Today</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {format(projStart, "MMM d, yyyy")} — {format(projEnd, "MMM d, yyyy")}
        </div>
      </div>
    </div>
  );
};
