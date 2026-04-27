import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChevronRight } from "lucide-react";
import { BoardCover } from "@/components/scorecard/BoardCover";
import { ExecutiveSummary } from "@/components/scorecard/ExecutiveSummary";
import { BoardKpiStrip } from "@/components/scorecard/BoardKpiStrip";
import { InitiativePortfolioMatrix } from "@/components/scorecard/InitiativePortfolioMatrix";
import { InitiativePerformancePanel } from "@/components/scorecard/InitiativePerformancePanel";
import { AnnualOkrExecutionPanel } from "@/components/scorecard/AnnualOkrExecutionPanel";
import { InitiativeContributionView } from "@/components/scorecard/InitiativeContributionView";
import { GapAnalysisPanel } from "@/components/scorecard/GapAnalysisPanel";
import { BoardAsks } from "@/components/scorecard/BoardAsks";

const SectionDivider = ({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-end gap-4 pt-2">
    <div className="text-5xl font-bold text-primary/20 leading-none tabular-nums">
      {index}
    </div>
    <div className="pb-1">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
    <div className="flex-1 h-px bg-border ml-2" />
  </div>
);

const InstitutionScorecard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/scorecards" className="hover:text-foreground">
            Scorecards
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Institution · Board Pack</span>
        </nav>

        <div className="space-y-10">
          {/* Cover */}
          <BoardCover />

          {/* 01 — Executive summary */}
          <section className="space-y-5">
            <SectionDivider
              index="01"
              title="Executive Summary"
              subtitle="The single page the board reads first."
            />
            <ExecutiveSummary />
            <BoardKpiStrip />
          </section>

          {/* 02 — Strategic portfolio */}
          <section className="space-y-5">
            <SectionDivider
              index="02"
              title="Strategic Portfolio"
              subtitle="Are our long-term initiatives progressing as planned?"
            />
            <InitiativePortfolioMatrix />
            <InitiativePerformancePanel />
          </section>

          {/* 03 — Annual delivery */}
          <section className="space-y-5">
            <SectionDivider
              index="03"
              title="Annual Delivery"
              subtitle="Are departments delivering this year's commitments?"
            />
            <AnnualOkrExecutionPanel />
          </section>

          {/* 04 — Strategy ↔ Execution bridge */}
          <section className="space-y-5">
            <SectionDivider
              index="04"
              title="Strategy ↔ Execution"
              subtitle="How this year's OKRs ladder up to long-term strategy."
            />
            <InitiativeContributionView />
            <GapAnalysisPanel />
          </section>

          {/* 05 — Board asks */}
          <section className="space-y-5">
            <SectionDivider
              index="05"
              title="Asks of the Board"
              subtitle="Decisions and endorsements requested today."
            />
            <BoardAsks />
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstitutionScorecard;