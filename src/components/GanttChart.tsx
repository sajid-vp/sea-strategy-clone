import { useMemo, useState } from "react";
import { differenceInDays, parseISO, format, addDays, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Milestone {
  id: number;
  name: string;
  dueDate: string;
  progress: number;
  status: "done" | "in-progress" | "todo" | "delayed";
  deliverables?: { id: number; name: string; status: string }[];
}

interface GanttChartProps {
  milestones: Milestone[];
  projectStartDate: string;
  projectEndDate: string;
}

const statusConfig = {
  done: { color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  "in-progress": { color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: Clock },
  todo: { color: "bg-muted-foreground/40", text: "text-muted-foreground", bg: "bg-muted/50", border: "border-muted", icon: Clock },
  delayed: { color: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", icon: AlertCircle },
};

export const GanttChart = ({ milestones, projectStartDate, projectEndDate }: GanttChartProps) => {
  const projStart = parseISO(projectStartDate);
  const projEnd = parseISO(projectEndDate);
  const totalDays = differenceInDays(projEnd, projStart) || 1;

  const months = useMemo(() => {
    return eachMonthOfInterval({ start: projStart, end: projEnd });
  }, [projectStartDate, projectEndDate]);

  // Calculate milestone bars - assume each milestone starts after the previous one ends
  const bars = useMemo(() => {
    const sorted = [...milestones].sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
    let prevEnd = projStart;

    return sorted.map((m, idx) => {
      const end = parseISO(m.dueDate);
      const start = idx === 0 ? projStart : prevEnd;
      const leftPct = (differenceInDays(start, projStart) / totalDays) * 100;
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

  return (
    <div className="space-y-0">
      {/* Month headers */}
      <div className="relative h-8 border-b bg-muted/30 rounded-t-lg overflow-hidden">
        {months.map((month, idx) => {
          const monthStart = idx === 0 ? projStart : month;
          const monthEnd = idx === months.length - 1 ? projEnd : endOfMonth(month);
          const leftPct = (differenceInDays(monthStart, projStart) / totalDays) * 100;
          const widthPct = (differenceInDays(monthEnd, monthStart) / totalDays) * 100;
          return (
            <div
              key={idx}
              className="absolute top-0 h-full flex items-center border-r border-border/50"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 truncate">
                {format(month, "MMM yyyy")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gantt rows */}
      <div className="relative">
        {/* Grid lines for months */}
        <div className="absolute inset-0 pointer-events-none">
          {months.map((month, idx) => {
            if (idx === 0) return null;
            const leftPct = (differenceInDays(month, projStart) / totalDays) * 100;
            return (
              <div
                key={idx}
                className="absolute top-0 bottom-0 w-px bg-border/30"
                style={{ left: `${leftPct}%` }}
              />
            );
          })}
        </div>

        {/* Today marker */}
        {todayPct !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20"
            style={{ left: `${todayPct}%` }}
          >
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-b">
              Today
            </div>
          </div>
        )}

        {bars.map((bar, idx) => {
          const config = statusConfig[bar.status] || statusConfig.todo;
          const StatusIcon = config.icon;

          return (
            <TooltipProvider key={bar.id} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center h-14 border-b border-border/30 hover:bg-muted/20 transition-colors ${idx === bars.length - 1 ? 'border-b-0' : ''}`}>
                    {/* Left label */}
                    <div className="w-48 flex-shrink-0 px-3 flex items-center gap-2 border-r border-border/30">
                      <StatusIcon className={`h-3.5 w-3.5 ${config.text} flex-shrink-0`} />
                      <span className="text-xs font-medium truncate">{bar.name}</span>
                    </div>

                    {/* Bar area */}
                    <div className="flex-1 relative h-full flex items-center px-1">
                      <div
                        className="absolute h-7 rounded-md overflow-hidden border shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-y-110"
                        style={{ left: `${bar.leftPct}%`, width: `${bar.widthPct}%` }}
                      >
                        {/* Background */}
                        <div className={`absolute inset-0 ${config.bg} ${config.border}`} />
                        {/* Progress fill */}
                        <div
                          className={`absolute inset-y-0 left-0 ${config.color} opacity-80 rounded-l-md transition-all`}
                          style={{ width: `${bar.progress}%` }}
                        />
                        {/* Label */}
                        <div className="relative h-full flex items-center px-2 z-10">
                          <span className={`text-[10px] font-semibold ${bar.progress > 50 ? 'text-white' : config.text} truncate`}>
                            {bar.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">{bar.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Due: {format(bar.end, "MMM d, yyyy")}</span>
                      <Badge variant="outline" className="text-[10px] h-4">
                        {bar.status}
                      </Badge>
                    </div>
                    <div className="text-xs">Progress: {bar.progress}%</div>
                    {bar.deliverables && bar.deliverables.length > 0 && (
                      <div className="border-t pt-1.5 mt-1.5">
                        <p className="text-[10px] font-medium text-muted-foreground mb-1">Deliverables:</p>
                        {bar.deliverables.map(d => (
                          <div key={d.id} className="flex items-center gap-1.5 text-[10px]">
                            <span className={`h-1.5 w-1.5 rounded-full ${d.status === 'done' ? 'bg-emerald-500' : d.status === 'in-progress' ? 'bg-blue-500' : 'bg-muted-foreground/40'}`} />
                            {d.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-3 border-t mt-1">
        {[
          { label: "Completed", color: "bg-emerald-500" },
          { label: "In Progress", color: "bg-blue-500" },
          { label: "To Do", color: "bg-muted-foreground/40" },
          { label: "Today", color: "bg-rose-500" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
