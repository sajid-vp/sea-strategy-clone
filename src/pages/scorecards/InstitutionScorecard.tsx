import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChevronRight, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { institutionScorecard } from "@/data/scorecardData";
import { CompactKpiBar } from "@/components/scorecard/CompactKpiBar";
import { ProgressionRow } from "@/components/scorecard/ProgressionRow";
import { CompactInitiativeList } from "@/components/scorecard/CompactInitiativeList";
import { HighlightsRisksCard } from "@/components/scorecard/HighlightsRisksCard";
import { CompactDepartmentDelivery } from "@/components/scorecard/CompactDepartmentDelivery";
import { InitiativePerformancePanel } from "@/components/scorecard/InitiativePerformancePanel";
import { AnnualOkrExecutionPanel } from "@/components/scorecard/AnnualOkrExecutionPanel";
import { InitiativeContributionView } from "@/components/scorecard/InitiativeContributionView";
import { GapAnalysisPanel } from "@/components/scorecard/GapAnalysisPanel";
import { YearProvider } from "@/components/scorecard/YearContext";
import { YearSelector } from "@/components/scorecard/YearSelector";

const InstitutionScorecard = () => {
  return (
    <YearProvider>
    <div className="min-h-screen bg-background">
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

        {/* KPI strip */}
        <div className="mb-4">
          <CompactKpiBar />
        </div>

        {/* Progression row */}
        <div className="mb-4">
          <ProgressionRow />
        </div>

        {/* Cockpit grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <CompactInitiativeList />
          </div>
          <div>
            <HighlightsRisksCard />
          </div>
        </div>

        {/* Department delivery */}
        <div className="mb-4">
          <CompactDepartmentDelivery />
        </div>

        {/* Drill-downs in tabs */}
        <Tabs defaultValue="initiatives" className="w-full">
          <TabsList>
            <TabsTrigger value="initiatives">Initiative detail</TabsTrigger>
            <TabsTrigger value="okrs">OKR execution</TabsTrigger>
            <TabsTrigger value="bridge">Strategy ↔ OKRs</TabsTrigger>
            <TabsTrigger value="gap">Gap analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="initiatives" className="mt-4">
            <InitiativePerformancePanel />
          </TabsContent>
          <TabsContent value="okrs" className="mt-4">
            <AnnualOkrExecutionPanel />
          </TabsContent>
          <TabsContent value="bridge" className="mt-4">
            <InitiativeContributionView />
          </TabsContent>
          <TabsContent value="gap" className="mt-4">
            <GapAnalysisPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </YearProvider>
  );
};

export default InstitutionScorecard;