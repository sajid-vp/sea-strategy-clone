import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import {
  ChevronRight,
  Building2,
  Gauge,
  Rocket,
  Users,
  LineChart,
  Activity,
  GitBranch,
} from "lucide-react";
import { institutionScorecard } from "@/data/scorecardData";
import { CompactKpiBar } from "@/components/scorecard/CompactKpiBar";
import { InitiativeCarousel } from "@/components/scorecard/InitiativeCarousel";
import { ProgressionRow } from "@/components/scorecard/ProgressionRow";
import { CompactDepartmentDelivery } from "@/components/scorecard/CompactDepartmentDelivery";
import { InitiativePerformancePanel } from "@/components/scorecard/InitiativePerformancePanel";
import { AnnualOkrExecutionPanel } from "@/components/scorecard/AnnualOkrExecutionPanel";
import { InitiativeContributionView } from "@/components/scorecard/InitiativeContributionView";
import { YearProvider } from "@/components/scorecard/YearContext";
import { YearSelector } from "@/components/scorecard/YearSelector";
import { SectionHeader } from "@/components/scorecard/SectionHeader";

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

        {/* Page header */}
        <section className="relative rounded-2xl overflow-hidden border bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.5)] mb-6">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_40%)]" />
          <div className="relative px-6 md:px-8 py-6 md:py-7 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5 min-w-0">
              <div className="p-3 rounded-xl bg-primary-foreground/15 backdrop-blur-sm shrink-0">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.24em] text-primary-foreground/70 mb-1">
                  Institution Scorecard
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                  {institutionScorecard.name}
                </h1>
                <p className="text-sm text-primary-foreground/80 mt-1 max-w-2xl">
                  Long-term initiatives and this year's commitments at a glance.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <YearSelector />
            </div>
          </div>
        </section>

        {/* Dashboard sections */}
        <div className="space-y-8">
          <section>
            <SectionHeader
              icon={Gauge}
              eyebrow="Overview"
              title="Performance Overview"
              subtitle="Health, initiatives on plan, OKR delivery and commitments"
            />
            <CompactKpiBar />
          </section>

          <section>
            <SectionHeader
              icon={Rocket}
              eyebrow="Strategy"
              title="Strategic Initiatives"
              subtitle="Multi-year bets — swipe through year-aware progress and KPIs"
            />
            <div className="mb-4">
              <ProgressionRow />
            </div>
            <InitiativeCarousel />
          </section>

          <section>
            <SectionHeader
              icon={Users}
              eyebrow="Delivery"
              title="Department Delivery"
              subtitle="Annual OKR delivery by department"
            />
            <CompactDepartmentDelivery />
          </section>

          <section>
            <SectionHeader
              icon={LineChart}
              eyebrow="Detail"
              title="Initiative Performance"
            />
            <InitiativePerformancePanel />
          </section>

          <section>
            <SectionHeader
              icon={Activity}
              eyebrow="Execution"
              title="Annual OKR Execution"
            />
            <AnnualOkrExecutionPanel />
          </section>

          <section>
            <SectionHeader
              icon={GitBranch}
              eyebrow="Linkage"
              title="Strategy ↔ OKRs"
              subtitle="How this year's OKRs contribute to multi-year initiatives"
            />
            <InitiativeContributionView />
          </section>
        </div>
      </div>
    </div>
    </YearProvider>
  );
};

export default InstitutionScorecard;