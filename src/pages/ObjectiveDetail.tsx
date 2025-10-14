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
import { AddInitiativeForm } from "@/components/forms/AddInitiativeForm";

const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    objectives: [
        {
          id: 1,
          title: "Infrastructure Modernization",
          description: "Upgrade and modernize IT infrastructure",
          year: 2025,
          status: "in-progress" as const,
          initiatives: [
            {
              id: 1,
              title: "Develop and Implement IT infrastructure",
              year: 2025,
              status: "in-progress" as const,
              owner: "John Smith",
            },
            {
              id: 2,
              title: "ISO 27001 Certification",
              year: 2025,
              status: "in-progress" as const,
              owner: "Sarah Johnson",
            },
          ],
        },
        {
          id: 2,
          title: "Digital Transformation",
          description: "Transform business processes through digital solutions",
          year: 2025,
          status: "blocked" as const,
          initiatives: [
            {
              id: 3,
              title: "Digital Transformation initiatives",
              year: 2025,
              status: "blocked" as const,
              owner: "David Brown",
            },
          ],
        },
    ],
  },
  {
    id: 2,
    title: "Educational Innovation",
    objectives: [
        {
          id: 3,
          title: "Teaching Enhancement",
          description: "Improve teaching methods and tools",
          year: 2025,
          status: "blocked" as const,
          initiatives: [
            {
              id: 4,
              title: "Support Teaching & Learning",
              year: 2025,
              status: "blocked" as const,
              owner: "Rachel Green",
            },
          ],
        },
        {
          id: 4,
          title: "Service Excellence",
          description: "Enhance IT services satisfaction",
          year: 2026,
          status: "in-progress" as const,
          initiatives: [
            {
              id: 5,
              title: "Increase satisfaction with IT services",
              year: 2026,
              status: "in-progress" as const,
              owner: "Michael Scott",
            },
          ],
        },
    ],
  },
];

const ObjectiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Find the objective and its parent goal
  let objective;
  let parentGoal;
  
  for (const goal of goals) {
    const found = goal.objectives.find(o => o.id.toString() === id);
    if (found) {
      objective = found;
      parentGoal = goal;
      break;
    }
  }

  if (!objective || !parentGoal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Objective not found</h1>
            <Link to="/objectives">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Objectives
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalInitiatives = objective.initiatives.length;
  const onTrackInitiatives = objective.initiatives.filter(i => i.status === "in-progress").length;
  const offTrackInitiatives = objective.initiatives.filter(i => i.status === "blocked").length;
  const progress = totalInitiatives > 0 ? (onTrackInitiatives / totalInitiatives) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Back button */}
        <Link to="/objectives">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Objectives
          </Button>
        </Link>

        {/* Objective Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">
                  {objective.title}
                </h1>
                <StatusBadge status={objective.status} />
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {objective.description}
              </p>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {objective.year}
                </Badge>
                <Link to={`/goals/${parentGoal.id}`}>
                  <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80">
                    <Target className="h-3 w-3" />
                    {parentGoal.title}
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Initiatives</p>
                <p className="text-3xl font-bold text-foreground">{totalInitiatives}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">On Track</p>
                <p className="text-3xl font-bold text-success">{onTrackInitiatives}</p>
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
                <p className="text-3xl font-bold text-destructive">{offTrackInitiatives}</p>
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
              {onTrackInitiatives} of {totalInitiatives} initiatives on track
            </div>
          </div>
        </Card>

        {/* Initiatives List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Initiatives ({totalInitiatives})
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Initiative
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Initiative</DialogTitle>
                  <DialogDescription>
                    Create a new initiative for {objective.title}
                  </DialogDescription>
                </DialogHeader>
                <AddInitiativeForm 
                  onSuccess={() => setIsDialogOpen(false)}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {objective.initiatives.map((initiative) => (
              <Link key={initiative.id} to={`/initiatives/${initiative.id}`} className="group">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>

                  <div className="pr-8">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {initiative.title}
                      </h3>
                      <StatusBadge status={initiative.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Owner: {initiative.owner}</span>
                      <span>•</span>
                      <span>{initiative.year}</span>
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

export default ObjectiveDetail;
