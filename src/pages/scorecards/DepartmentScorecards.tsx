import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChevronRight, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { departmentScorecards, objectivesByDepartment } from "@/data/scorecardData";
import { ScorecardCard } from "@/components/scorecard/ScorecardCard";
import { ScorecardDetail } from "@/components/scorecard/ScorecardDetail";
import { OkrBoard } from "@/components/scorecard/OkrBoard";
import { OkrInitiativeMapping } from "@/components/scorecard/OkrInitiativeMapping";
import { DepartmentInitiativeContribution } from "@/components/scorecard/DepartmentInitiativeContribution";

const DepartmentScorecards = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = departmentScorecards.find((d) => d.id === selectedId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/scorecards" className="hover:text-foreground">Scorecards</Link>
          <ChevronRight className="h-4 w-4" />
          <span className={selected ? "hover:text-foreground cursor-pointer" : "text-foreground"} onClick={() => setSelectedId(null)}>Department</span>
          {selected && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{selected.name}</span>
            </>
          )}
        </nav>

        {!selected ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Department Scorecards</h1>
                <p className="text-muted-foreground">
                  Are we delivering our committed OKRs, and how do they support strategic initiatives?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentScorecards.map((d) => (
                <div key={d.id} onClick={() => setSelectedId(d.id)}>
                  <ScorecardCard entity={d} to="#" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="mb-4" onClick={() => setSelectedId(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to departments
            </Button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{selected.name}</h1>
                <p className="text-muted-foreground">OKR-anchored department scorecard</p>
              </div>
            </div>
            <div className="space-y-6">
              <ScorecardDetail entity={selected} />
              <OkrBoard objectives={objectivesByDepartment(selected.id)} />
              <OkrInitiativeMapping objectives={objectivesByDepartment(selected.id)} />
              <DepartmentInitiativeContribution deptId={selected.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentScorecards;