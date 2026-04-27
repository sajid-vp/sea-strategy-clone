import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";
import { strategicInitiatives } from "@/data/scorecardData";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import {
  initiativeActualAtYear,
  initiativeExpectedAtYear,
  yoy,
} from "./yearMetrics";

const tone = (pct: number) =>
  pct >= 75 ? "text-success" : pct >= 50 ? "text-warning" : "text-destructive";

const accent = (pct: number) =>
  pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive";

const kpiPctAtYear = (
  kpi: (typeof strategicInitiatives)[number]["kpis"][number],
  year: number,
) => {
  const point = kpi.trend.find((p) => p.year === year);
  if (!point) return null;
  const span = kpi.target - kpi.baseline;
  if (span === 0) return 100;
  const pct = ((point.value - kpi.baseline) / span) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

/**
 * Swipeable, full-width strip of initiative cards. One initiative per slide
 * on mobile, two-up on desktop. Each card shows year-aware actual vs expected
 * progress, YoY delta and the KPI breakdown for the selected year.
 */
export const InitiativeCarousel = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Initiatives — Swipe to explore
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {year}
          {prev !== null ? ` · YoY vs ${prev}` : ""}
        </span>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {strategicInitiatives.map((init) => {
            const actual = initiativeActualAtYear(init, year);
            const expected = initiativeExpectedAtYear(init, year);
            const prevActual =
              prev !== null ? initiativeActualAtYear(init, prev) : null;
            const delta = yoy(actual, prevActual);
            const gap = expected - actual;
            const onPlan = gap <= 0;

            return (
              <CarouselItem
                key={init.id}
                className="pl-4 basis-full md:basis-1/2"
              >
                <div className="rounded-lg border bg-card p-4 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">
                        {init.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-2">
                        {init.description}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {init.importance === "critical" && (
                        <Badge
                          variant="outline"
                          className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] py-0"
                        >
                          critical
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {init.startYear}–{init.endYear}
                      </span>
                    </div>
                  </div>

                  {/* Big number */}
                  <div className="flex items-end justify-between gap-3 mb-2">
                    <div>
                      <div
                        className={`text-3xl font-bold tabular-nums ${tone(actual)}`}
                      >
                        {actual}%
                        <span className="text-sm text-muted-foreground font-normal">
                          {" "}/ {expected}%
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        actual vs expected
                      </div>
                    </div>
                    <div className="text-right">
                      <YoyChip delta={delta} />
                      <div
                        className={`text-[11px] mt-1 font-medium ${
                          onPlan ? "text-success" : "text-destructive"
                        }`}
                      >
                        {onPlan
                          ? `+${Math.abs(gap)} pts ahead`
                          : `−${gap} pts behind`}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 mb-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${accent(actual)}`}
                      style={{ width: `${actual}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-px bg-foreground/60"
                      style={{ left: `${expected}%` }}
                    />
                  </div>

                  {/* KPI list */}
                  <div className="space-y-1.5 mt-auto">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      KPIs ({year})
                    </div>
                    {init.kpis.map((kpi) => {
                      const point = kpi.trend.find((p) => p.year === year);
                      const pct = kpiPctAtYear(kpi, year);
                      return (
                        <div
                          key={kpi.name}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="text-foreground truncate flex-1 min-w-0">
                            {kpi.name}
                          </span>
                          <span className="text-muted-foreground tabular-nums shrink-0">
                            {point ? point.value : "—"} / {kpi.target}{" "}
                            {kpi.unit}
                          </span>
                          <span
                            className={`tabular-nums font-semibold w-10 text-right shrink-0 ${
                              pct === null ? "text-muted-foreground" : tone(pct)
                            }`}
                          >
                            {pct === null ? "—" : `${pct}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-3" />
        <CarouselNext className="hidden md:flex -right-3" />
      </Carousel>
    </Card>
  );
};