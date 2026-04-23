import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Building2, Users, User, ChevronRight } from "lucide-react";
import { institutionScorecard, departmentScorecards, individualScorecards } from "@/data/scorecardData";

const tiles = [
  {
    to: "/scorecards/institution",
    title: "Institution",
    description: "Organization-wide balanced scorecard",
    icon: Building2,
    count: 1,
    score: institutionScorecard.healthScore,
  },
  {
    to: "/scorecards/department",
    title: "Department",
    description: "Scorecards for each business unit",
    icon: Users,
    count: departmentScorecards.length,
    score: Math.round(departmentScorecards.reduce((s, d) => s + d.healthScore, 0) / departmentScorecards.length),
  },
  {
    to: "/scorecards/individual",
    title: "Individual",
    description: "Personal performance scorecards",
    icon: User,
    count: individualScorecards.length,
    score: Math.round(individualScorecards.reduce((s, d) => s + d.healthScore, 0) / individualScorecards.length),
  },
];

const ScorecardsIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scorecards</h1>
          <p className="text-muted-foreground">
            Balanced scorecard performance across institution, departments, and individuals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to}>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">{t.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">{t.score}</div>
                      <div className="text-xs text-muted-foreground">Avg Health Score</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-foreground">{t.count}</div>
                      <div className="text-xs text-muted-foreground">{t.count === 1 ? "scorecard" : "scorecards"}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScorecardsIndex;