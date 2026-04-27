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
    <div className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-muted/20">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link to="/scorecards" className="hover:text-foreground">
            Scorecards
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Institution</span>
        </nav>

        {/* Deck cover */}
        <section className="relative rounded-3xl overflow-hidden border bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.5)] mb-6">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_40%)]" />
          <div className="relative px-8 md:px-10 py-8 md:py-10 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5 min-w-0">
              <div className="p-3.5 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm shrink-0">
                <Building2 className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground/70 mb-1">
                  Institution Scorecard
                </div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  {institutionScorecard.name}
                </h1>
                <p className="text-sm md:text-base text-primary-foreground/80 mt-1.5 max-w-2xl">
                  Long-term initiatives and this year's commitments at a glance.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <YearSelector />
            </div>
          </div>
        </section>

        {/* Slide stack — single page, deck-style framing per section */}
        <div className="space-y-6">
          <DeckSlide
            n={1}
            eyebrow="Overview"
            title="Performance Overview"
            subtitle="Health, initiatives on plan, OKR delivery and commitments"
          >
            <CompactKpiBar />
          </DeckSlide>

          <DeckSlide
            n={2}
            eyebrow="Strategy"
            title="Strategic Initiatives"
            subtitle="Multi-year bets — swipe within the card for year-aware progress and KPIs"
          >
            <InitiativeCarousel />
          </DeckSlide>

          <DeckSlide
            n={3}
            eyebrow="Delivery"
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

          <DeckSlide n={4} eyebrow="Detail" title="Initiative Performance — Detail">
            <InitiativePerformancePanel />
          </DeckSlide>

          <DeckSlide n={5} eyebrow="Execution" title="Annual OKR Execution">
            <AnnualOkrExecutionPanel />
          </DeckSlide>

          <DeckSlide
            n={6}
            eyebrow="Linkage"
            title="Strategy ↔ OKRs"
            subtitle="How this year's OKRs contribute to multi-year initiatives"
          >
            <InitiativeContributionView />
          </DeckSlide>

          <DeckSlide n={7} eyebrow="Risk" title="Gap Analysis">
            <GapAnalysisPanel />
          </DeckSlide>
        </div>
      </div>
    </div>
    </YearProvider>
  );
};

export default InstitutionScorecard;