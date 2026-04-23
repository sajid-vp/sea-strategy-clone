import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChevronRight, Building2 } from "lucide-react";
import { institutionScorecard } from "@/data/scorecardData";
import { ScorecardDetail } from "@/components/scorecard/ScorecardDetail";

const InstitutionScorecard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/scorecards" className="hover:text-foreground">Scorecards</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Institution</span>
        </nav>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{institutionScorecard.name}</h1>
            <p className="text-muted-foreground">Institution-wide performance scorecard</p>
          </div>
        </div>
        <ScorecardDetail entity={institutionScorecard} />
      </div>
    </div>
  );
};

export default InstitutionScorecard;