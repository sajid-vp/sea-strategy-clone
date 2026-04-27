import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChevronRight, User, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { individualScorecards } from "@/data/scorecardData";
import { ScorecardCard } from "@/components/scorecard/ScorecardCard";
import { ScorecardDetail } from "@/components/scorecard/ScorecardDetail";
import { MyOkrContribution } from "@/components/scorecard/MyOkrContribution";

const IndividualScorecards = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const selected = individualScorecards.find((d) => d.id === selectedId);

  const filtered = individualScorecards.filter((p) =>
    `${p.name} ${p.role ?? ""} ${p.department ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/scorecards" className="hover:text-foreground">Scorecards</Link>
          <ChevronRight className="h-4 w-4" />
          <span className={selected ? "hover:text-foreground cursor-pointer" : "text-foreground"} onClick={() => setSelectedId(null)}>Individual</span>
          {selected && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{selected.name}</span>
            </>
          )}
        </nav>

        {!selected ? (
          <>
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Individual Scorecards</h1>
                  <p className="text-muted-foreground">Personal performance scorecards.</p>
                </div>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search people..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((d) => (
                <div key={d.id} onClick={() => setSelectedId(d.id)}>
                  <ScorecardCard entity={d} to="#" />
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No people match your search.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="mb-4" onClick={() => setSelectedId(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to people
            </Button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{selected.name}</h1>
                <p className="text-muted-foreground">
                  {selected.role}{selected.department ? ` · ${selected.department}` : ""}
                </p>
              </div>
            </div>
          <div className="space-y-6">
            <ScorecardDetail entity={selected} />
            <MyOkrContribution individualId={selected.id} />
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IndividualScorecards;