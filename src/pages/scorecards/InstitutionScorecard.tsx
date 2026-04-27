import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChevronRight, Building2 } from "lucide-react";
import { institutionScorecard } from "@/data/scorecardData";
import { CompactKpiBar } from "@/components/scorecard/CompactKpiBar";
import { InitiativeCarousel } from "@/components/scorecard/InitiativeCarousel";
import { HighlightsRisksCard } from "@/components/scorecard/HighlightsRisksCard";
import { CompactDepartmentDelivery } from "@/components/scorecard/CompactDepartmentDelivery";
import { InitiativePerformancePanel } from "@/components/scorecard/InitiativePerformancePanel";
import { AnnualOkrExecutionPanel } from "@/components/scorecard/AnnualOkrExecutionPanel";
import { InitiativeContributionView } from "@/components/scorecard/InitiativeContributionView";
import { GapAnalysisPanel } from "@/components/scorecard/GapAnalysisPanel";
import { YearProvider } from "@/components/scorecard/YearContext";
import { YearSelector } from "@/components/scorecard/YearSelector";
import { DeckSlide } from "@/components/scorecard/DeckSlide";

const InstitutionScorecard = () => {
  return (
    <YearProvider>
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-6 py-5 max-w-7xl">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link to="/scorecards" className="hover:text-foreground">
            Scorecards
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Institution</span>
        </nav>

        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {institutionScorecard.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Long-term initiatives and this year's commitments at a glance.
              </p>
            </div>
          </div>
          <YearSelector />
        </div>

        {/* Slide stack — single page, deck-style framing per section */}
        <div className="space-y-6">
          <DeckSlide
            n={1}
            title="Performance Overview"
            subtitle="Health, initiatives on plan, OKR delivery and commitments"
          >
            <CompactKpiBar />
          </DeckSlide>

          <DeckSlide
            n={2}
            title="Strategic Initiatives"
            subtitle="Multi-year bets — swipe within the card for year-aware progress and KPIs"
          >
            <InitiativeCarousel />
          </DeckSlide>

          <DeckSlide
            n={3}
            title="Department Delivery & Highlights"
            subtitle="Annual OKR delivery alongside this period's wins and risks"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <CompactDepartmentDelivery />
              </div>
              <div>
                <HighlightsRisksCard />
              </div>
            </div>
          </DeckSlide>

          <DeckSlide n={4} title="Initiative Performance — Detail">
            <InitiativePerformancePanel />
          </DeckSlide>

          <DeckSlide n={5} title="Annual OKR Execution">
            <AnnualOkrExecutionPanel />
          </DeckSlide>

          <DeckSlide
            n={6}
            title="Strategy ↔ OKRs"
            subtitle="How this year's OKRs contribute to multi-year initiatives"
          >
            <InitiativeContributionView />
          </DeckSlide>

          <DeckSlide n={7} title="Gap Analysis">
            <GapAnalysisPanel />
          </DeckSlide>
        </div>
      </div>
    </div>
    </YearProvider>
  );
};

export default InstitutionScorecard;