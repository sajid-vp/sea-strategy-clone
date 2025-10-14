import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Calendar, Target, TrendingUp, Plus, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        owner: "John Smith",
        initiativeCount: 2,
      },
      {
        id: 2,
        title: "Digital Transformation",
        description: "Transform business processes through digital solutions",
        year: 2025,
        status: "blocked" as const,
        owner: "David Brown",
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
        status: "off-track" as const,
        owner: "Rachel Green",
        initiativeCount: 1,
      },
      {
        id: 4,
        title: "Service Excellence",
        description: "Enhance IT services satisfaction",
        year: 2026,
        status: "on-track" as const,
        owner: "Michael Scott",
        initiativeCount: 1,
      },
    ],
  },
];

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const goal = goals.find(g => g.id.toString() === id);

  if (!goal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Goal not found</h1>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Goals
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Calculate statistics
  const totalObjectives = goal.objectives.length;
  const totalInitiatives = goal.objectives.reduce((acc, obj) => acc + obj.initiativeCount, 0);
  const onTrackObjectives = goal.objectives.filter(o => o.status === "in-progress").length;
  const offTrackObjectives = goal.objectives.filter(o => o.status === "blocked").length;
  const progress = totalObjectives > 0 ? (onTrackObjectives / totalObjectives) * 100 : 0;


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
        </Link>

        {/* Goal Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">
                  {goal.title}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {goal.description}
              </p>
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {goal.startYear} - {goal.endYear}
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Objectives</p>
                <p className="text-3xl font-bold text-foreground">{totalObjectives}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Initiatives</p>
                <p className="text-3xl font-bold text-foreground">{totalInitiatives}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">On Track</p>
                <p className="text-3xl font-bold text-success">{onTrackObjectives}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-destructive">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Off Track</p>
                <p className="text-3xl font-bold text-destructive">{offTrackObjectives}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-xs text-muted-foreground">
              {onTrackObjectives} of {totalObjectives} objectives on track
            </div>
          </div>
        </Card>

        {/* Objectives List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Objectives ({totalObjectives})
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Objective
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Objective</DialogTitle>
                  <DialogDescription>
                    Create a new objective for {goal.title}
                  </DialogDescription>
                </DialogHeader>
                <AddObjectiveForm 
                  onSuccess={() => setIsDialogOpen(false)}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Year</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Owner</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All owners</SelectItem>
                    {Array.from(new Set(goal.objectives.map(o => o.owner))).map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Objectives Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {goal.objectives.map((objective) => (
              <Link key={objective.id} to={`/objectives/${objective.id}`} className="group">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
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
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">
                        <span className="font-semibold">{objective.owner}</span>
                        <span className="mx-2">•</span>
                        <span>{objective.year}</span>
                      </div>
                      <div>
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
      </main>
    </div>
  );
};

export default GoalDetail;
