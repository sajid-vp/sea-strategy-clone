import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Calendar, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Same data structure as Index page
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

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the goal
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
  const totalInitiatives = goal.initiatives.length;
  const totalKPIs = goal.initiatives.reduce((acc, init) => acc + init.kpis.length, 0);
  const onTrackInitiatives = goal.initiatives.filter(i => i.status === "on-track").length;
  const offTrackInitiatives = goal.initiatives.filter(i => i.status === "off-track").length;
  const progress = totalInitiatives > 0 ? (onTrackInitiatives / totalInitiatives) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Back button */}
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
          <Card className="p-6 border-t-4 border-l-4 border-t-primary border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Initiatives</p>
                <p className="text-3xl font-bold text-foreground">{totalInitiatives}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-t-4 border-l-4 border-t-primary border-l-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total KPIs</p>
                <p className="text-3xl font-bold text-foreground">{totalKPIs}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-t-4 border-l-4 border-t-success border-l-success">
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

          <Card className="p-6 border-t-4 border-l-4 border-t-destructive border-l-destructive">
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
            <Button>
              Add Initiative
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-4 gap-4">
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
                    <SelectItem value="owner1">Owner 1</SelectItem>
                    <SelectItem value="owner2">Owner 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Department</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">KPI Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All KPI types</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {goal.initiatives.map((initiative) => (
              <Link key={initiative.id} to={`/initiatives/${initiative.id}`}>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-t-4 border-t-secondary-foreground">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {initiative.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {initiative.year}
                      </Badge>
                    </div>
                    <StatusBadge status={initiative.status} />
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Owner: </span>
                      <span className="font-medium text-foreground">{initiative.owner}</span>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-muted-foreground">
                          {initiative.kpis.length} KPIs
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-success" />
                            <span>{initiative.kpis.filter(k => k.status === "on-track").length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-destructive" />
                            <span>{initiative.kpis.filter(k => k.status !== "on-track").length}</span>
                          </div>
                        </div>
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
