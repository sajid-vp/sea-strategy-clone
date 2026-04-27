import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import {
  ChevronRight,
  GraduationCap,
  Gauge,
  Rocket,
  Users,
  Activity,
  GitBranch,
} from "lucide-react";
import { institutionScorecard } from "@/data/scorecardData";
import { CompactKpiBar } from "@/components/scorecard/CompactKpiBar";
import { InitiativeCarousel } from "@/components/scorecard/InitiativeCarousel";
import { ProgressionRow } from "@/components/scorecard/ProgressionRow";
import { CompactDepartmentDelivery } from "@/components/scorecard/CompactDepartmentDelivery";
import { AnnualOkrExecutionPanel } from "@/components/scorecard/AnnualOkrExecutionPanel";
import { InitiativeContributionView } from "@/components/scorecard/InitiativeContributionView";
import { YearProvider } from "@/components/scorecard/YearContext";
import { YearSelector } from "@/components/scorecard/YearSelector";
import { SectionHeader } from "@/components/scorecard/SectionHeader";

const InstitutionScorecard = () => {
  return (
    <YearProvider>
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%),linear-gradient(to_bottom,hsl(var(--muted)/0.4),hsl(var(--background)),hsl(var(--muted)/0.2))]">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/scorecards" className="hover:text-foreground">
            Scorecards
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Institution</span>
        </nav>

        {/* Page header */}
        <section className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.55)] mb-8">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_15%_20%,white_0,transparent_45%),radial-gradient(circle_at_85%_70%,white_0,transparent_45%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent" />
          <div className="relative px-6 md:px-10 py-7 md:py-9 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5 min-w-0">
              <div className="p-3.5 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm shrink-0 ring-1 ring-primary-foreground/20 shadow-lg">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground/75 mb-1.5 font-medium">
                  Academy Strategy Scorecard
                </div>
                <h1 className="text-2xl md:text-[28px] font-bold leading-tight tracking-tight">
                  {institutionScorecard.name}
                </h1>
                <p className="text-sm text-primary-foreground/85 mt-1.5 max-w-2xl">
                  Multi-year academic strategy and this year's commitments — at a glance.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <YearSelector variant="onPrimary" />
            </div>
          </div>
        </section>

        {/* Dashboard sections */}
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-5 md:p-6">
            <SectionHeader
              icon={Gauge}
              eyebrow="Overview"
              title="Performance Overview"
              subtitle="Health, initiatives on plan, OKR delivery and commitments"
            />
            <CompactKpiBar />
          </section>

          <section className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-5 md:p-6">
            <ProgressionRow />
          </section>

          <section className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-5 md:p-6">
            <SectionHeader
              icon={Rocket}
              eyebrow="Strategy"
              title="Strategic Initiatives"
              subtitle="Multi-year bets — click any card to expand and explore KPIs and contributing OKRs"
            />
            <InitiativeCarousel />
          </section>

          <section className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-5 md:p-6">
            <SectionHeader
              icon={Users}
              eyebrow="Delivery"
              title="Department Delivery"
              subtitle="Annual OKR delivery by department"
            />
            <CompactDepartmentDelivery />
          </section>

          <section className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-5 md:p-6">
            <SectionHeader
              icon={Activity}
              eyebrow="Execution"
              title="Annual OKR Execution"
            />
            <AnnualOkrExecutionPanel />
          </section>

          <section className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-5 md:p-6">
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