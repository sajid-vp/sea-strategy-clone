import { Card } from "@/components/ui/card";
import { Building2, CalendarDays } from "lucide-react";
import { institutionScorecard } from "@/data/scorecardData";

/**
 * Cover banner for the Board of Trustees presentation.
 * Designed to read like the opening slide of an executive deck.
 */
export const BoardCover = () => {
  const today = new Date();
  const period = `Q${Math.floor(today.getMonth() / 3) + 1} ${today.getFullYear()}`;
  const formatted = today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scoreTone =
    institutionScorecard.healthScore >= 80
      ? "text-success"
      : institutionScorecard.healthScore >= 65
      ? "text-warning"
      : "text-destructive";

  return (
    <Card className="relative overflow-hidden border-0 p-0">
      <div
        className="relative px-8 py-10 md:px-12 md:py-14 text-primary-foreground"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(262 83% 38%) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px, 48px 48px",
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/80 mb-3">
              <Building2 className="h-3.5 w-3.5" />
              Board of Trustees · Quarterly Review
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {institutionScorecard.name}
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/90 mt-2 max-w-2xl">
              Strategic progress, annual delivery and the gap between intent and execution.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatted}
              </span>
              <span className="opacity-50">·</span>
              <span>Reporting period: {period}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-primary-foreground/80">
                Institutional Health
              </div>
              <div className={`text-5xl md:text-6xl font-bold ${scoreTone === "text-success" ? "" : ""} text-primary-foreground`}>
                {institutionScorecard.healthScore}
                <span className="text-2xl text-primary-foreground/70">/100</span>
              </div>
              <div className="text-xs text-primary-foreground/80">
                {institutionScorecard.onTrackPercentage}% of commitments on track
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};