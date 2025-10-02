import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { LayoutGrid, List, Target, Flag, TrendingUp, BarChart3, Users, User, Plus } from "lucide-react";

const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    description: "Build and maintain world-class technology infrastructure",
    startYear: 2025,
    endYear: 2028,
    initiatives: [
      {
        id: 1,
        title: "Develop and Implement IT infrastructure",
        year: 2025,
        status: "on-track" as const,
        owner: "John Smith",
        team: ["Sarah Johnson", "Mike Chen", "Emma Wilson"],
        kpis: [
          { name: "ISO 27001 Implementation", status: "on-track" as const },
          { name: "Smart Campus Infrastructure", status: "on-track" as const },
          { name: "Child Safety Geo-tagging", status: "on-track" as const },
        ],
      },
      {
        id: 2,
        title: "Digital Transformation initiatives",
        year: 2025,
        status: "off-track" as const,
        owner: "David Brown",
        team: ["Lisa Anderson", "Tom Martinez"],
        kpis: [
          { name: "Student Information System Adoption", status: "on-track" as const },
          { name: "AI-Driven Business Intelligence Dashboards", status: "on-track" as const },
          { name: "Unified Mobile App Development", status: "off-track" as const },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Educational Innovation",
    description: "Transform teaching and learning through technology",
    startYear: 2025,
    endYear: 2028,
    initiatives: [
      {
        id: 3,
        title: "Support Teaching & Learning",
        year: 2025,
        status: "off-track" as const,
        owner: "Rachel Green",
        team: ["Chris Taylor", "Jennifer Lee"],
        kpis: [
          { name: "Education Platform Enhancement", status: "off-track" as const },
          { name: "Nursery Management System", status: "on-track" as const },
        ],
      },
      {
        id: 4,
        title: "Increase satisfaction with IT services",
        year: 2026,
        status: "on-track" as const,
        owner: "Michael Scott",
        team: ["Pam Beesly", "Jim Halpert", "Dwight Schrute"],
        kpis: [
          { name: "IT Services Employee Satisfaction", status: "on-track" as const },
          { name: "Digital Learning Experience", status: "on-track" as const },
          { name: "SIS Stakeholder Satisfaction", status: "on-track" as const },
        ],
      },
    ],
  },
];

const Initiatives = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedYear, setSelectedYear] = useState("2025");
  const totalInitiatives = goals.reduce((acc, goal) => acc + goal.initiatives.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Initiatives</h1>
          <div className="w-40">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Initiatives"
            value={totalInitiatives}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Target className="h-5 w-5 text-primary" />}
          />
          
          <StatCard
            title="Key Initiatives"
            value="0"
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Flag className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <Progress value={0} className="h-2 bg-destructive" />
            </div>
          </StatCard>

          <StatCard
            title="Initiative Status"
            value=""
            className="border-l-4 border-l-secondary-foreground"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-muted-foreground">On Track:</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">At Risk:</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Off Track:</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Overall Progress"
            value="50%"
            className="border-l-4 border-l-secondary-foreground"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <Progress value={50} className="h-2" />
            </div>
          </StatCard>
        </div>

        {/* Strategic Initiatives */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
              <TabsTrigger value="goal">By Goal</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Initiative
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
              {goals.flatMap((goal) =>
                goal.initiatives.map((initiative) => (
                  <Card key={initiative.id} className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-secondary-foreground">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {initiative.title}
                      </h4>
                      <StatusBadge status={initiative.status} />
                    </div>
                    
                    {/* Owner & Team */}
                    <div className="mb-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Owner</div>
                          <div className="text-sm text-foreground">{initiative.owner}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Team Members</div>
                          <div className="text-sm text-foreground">{initiative.team.join(", ")}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-3 border-t border-border">
                      <div className="text-sm font-medium text-muted-foreground">
                        KPIs ({initiative.kpis.length})
                      </div>
                      {initiative.kpis.map((kpi, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="text-sm text-foreground">{kpi.name}</span>
                          <StatusBadge status={kpi.status} />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="goal" className="mt-0">
            <div className="space-y-8">
              {goals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.initiatives.length} initiatives</p>
                  </div>

                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
                    {goal.initiatives.map((initiative) => (
                      <Card key={initiative.id} className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-secondary-foreground">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            {initiative.title}
                          </h4>
                          <StatusBadge status={initiative.status} />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-muted-foreground">
                            KPIs ({initiative.kpis.length})
                          </div>
                          {initiative.kpis.map((kpi, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <span className="text-sm text-foreground">{kpi.name}</span>
                              <StatusBadge status={kpi.status} />
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="owner" className="mt-0">
            <div className="space-y-8">
              {Array.from(new Set(goals.flatMap(g => g.initiatives.map(i => i.owner)))).map((owner) => {
                const ownerInitiatives = goals.flatMap(g => 
                  g.initiatives.filter(i => i.owner === owner).map(i => ({ ...i, goalTitle: g.title }))
                );
                
                return (
                  <div key={owner}>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">{owner}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">{ownerInitiatives.length} initiatives</p>
                    </div>

                    <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
                      {ownerInitiatives.map((initiative) => (
                        <Card key={initiative.id} className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-secondary-foreground">
                          <div className="mb-4">
                            <div className="text-xs text-muted-foreground mb-2">{initiative.goalTitle}</div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">
                              {initiative.title}
                            </h4>
                            <StatusBadge status={initiative.status} />
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-start gap-2">
                              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="text-xs font-medium text-muted-foreground">Team Members</div>
                                <div className="text-sm text-foreground">{initiative.team.join(", ")}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 pt-3 border-t border-border">
                            <div className="text-sm font-medium text-muted-foreground">
                              KPIs ({initiative.kpis.length})
                            </div>
                            {initiative.kpis.map((kpi, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              >
                                <span className="text-sm text-foreground">{kpi.name}</span>
                                <StatusBadge status={kpi.status} />
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Initiatives;
