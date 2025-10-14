import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Target, Flag, TrendingUp, BarChart3, Plus, ChevronRight, AlertTriangle } from "lucide-react";
import { mapToAggregatedStatus } from "@/types/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AddObjectiveForm } from "@/components/forms/AddObjectiveForm";

const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    description: "Build and maintain world-class technology infrastructure",
    startYear: 2025,
    endYear: 2028,
    objectives: [
      {
        id: 1,
        title: "Infrastructure Modernization",
        description: "Upgrade and modernize IT infrastructure",
        year: 2025,
        status: "in-progress" as const,
        goalId: 1,
        initiativeCount: 2,
      },
      {
        id: 2,
        title: "Digital Transformation",
        description: "Transform business processes through digital solutions",
        year: 2025,
        status: "blocked" as const,
        goalId: 1,
        initiativeCount: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Educational Innovation",
    description: "Transform teaching and learning through technology",
    startYear: 2025,
    endYear: 2028,
    objectives: [
      {
        id: 3,
        title: "Teaching Enhancement",
        description: "Improve teaching methods and tools",
        year: 2025,
        status: "blocked" as const,
        goalId: 2,
        initiativeCount: 1,
      },
      {
        id: 4,
        title: "Service Excellence",
        description: "Enhance IT services satisfaction",
        year: 2026,
        status: "in-progress" as const,
        goalId: 2,
        initiativeCount: 1,
      },
    ],
  },
];

const Objectives = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const allObjectives = goals.flatMap(g => g.objectives);
  const totalObjectives = allObjectives.length;
  const onTrackCount = allObjectives.filter(o => mapToAggregatedStatus(o.status) === "on-track").length;
  const atRiskCount = allObjectives.filter(o => mapToAggregatedStatus(o.status) === "at-risk").length;
  const offTrackCount = allObjectives.filter(o => mapToAggregatedStatus(o.status) === "off-track").length;
  const progress = totalObjectives > 0 ? (onTrackCount / totalObjectives) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Objectives</h1>
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
            title="Objectives"
            value={totalObjectives}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Target className="h-5 w-5 text-primary" />}
          />
          
          <StatCard
            title="On Track"
            value={onTrackCount}
            subtitle="2025"
            className="border-l-4 border-l-success"
            icon={<Flag className="h-5 w-5 text-success" />}
          />

          <StatCard
            title="Objective Status"
            value=""
            className="border-l-4 border-l-secondary-foreground"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">At Risk:</span>
                </div>
                <span className="font-semibold">{atRiskCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Off Track:</span>
                </div>
                <span className="font-semibold">{offTrackCount}</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Overall Progress"
            value={`${Math.round(progress)}%`}
            className="border-l-4 border-l-secondary-foreground"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
            </div>
          </StatCard>
        </div>

        {/* Objectives List */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="goal">By Goal</TabsTrigger>
            </TabsList>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Objective
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Objective</DialogTitle>
                  <DialogDescription>
                    Add a new objective to track strategic progress. Objectives can span multiple years.
                  </DialogDescription>
                </DialogHeader>
                
                <AddObjectiveForm 
                  onSuccess={() => setIsDialogOpen(false)}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {allObjectives.map((objective) => {
                const goal = goals.find(g => g.id === objective.goalId);
                return (
                  <Link key={objective.id} to={`/objectives/${objective.id}`} className="group">
                    <Card className="p-6 border border-l-4 border-l-primary hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </div>

                      <div className="pr-8">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {objective.title}
                          </h3>
                          <StatusBadge status={objective.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {objective.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-semibold text-primary">{goal?.title}</span>
                            <span className="mx-2">•</span>
                            <span>{objective.year}</span>
                          </div>
                          <div className="text-xs">
                            <span className="font-bold text-foreground">{objective.initiativeCount}</span>
                            <span className="text-muted-foreground ml-1">initiatives</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="goal" className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id}>
                <h3 className="text-lg font-semibold mb-4">{goal.title}</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {goal.objectives.map((objective) => (
                    <Link key={objective.id} to={`/objectives/${objective.id}`} className="group">
                      <Card className="p-6 border border-l-4 border-l-primary hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                        </div>

                        <div className="pr-8">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {objective.title}
                            </h4>
                            <StatusBadge status={objective.status} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {objective.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {objective.year}
                            </div>
                            <div className="text-xs">
                              <span className="font-bold text-foreground">{objective.initiativeCount}</span>
                              <span className="text-muted-foreground ml-1">initiatives</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Objectives;
