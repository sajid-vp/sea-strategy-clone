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
import {
  Target,
  Flag,
  Bell,
  Search,
  User,
  LayoutGrid,
  List,
  Edit,
} from "lucide-react";

const initiatives = [
  {
    id: 1,
    title: "Develop and Implement IT infrastructure",
    status: "on-track" as const,
    kpis: [
      { name: "ISO 27001 Implementation", status: "on-track" as const },
      { name: "Smart Campus Infrastructure", status: "on-track" as const },
      { name: "Child Safety Geo-tagging", status: "on-track" as const },
    ],
  },
  {
    id: 2,
    title: "Digital Transformation initiatives",
    status: "off-track" as const,
    kpis: [
      { name: "Student Information System Adoption", status: "on-track" as const },
      { name: "AI-Driven Business Intelligence Dashboards", status: "on-track" as const },
      { name: "Unified Mobile App Development", status: "off-track" as const },
    ],
  },
  {
    id: 3,
    title: "Support Teaching & Learning",
    status: "off-track" as const,
    kpis: [
      { name: "Education Platform Enhancement", status: "off-track" as const },
      { name: "Nursery Management System", status: "on-track" as const },
    ],
  },
  {
    id: 4,
    title: "Increase satisfaction with IT services",
    status: "on-track" as const,
    kpis: [
      { name: "IT Services Employee Satisfaction", status: "on-track" as const },
      { name: "Digital Learning Experience", status: "on-track" as const },
      { name: "SIS Stakeholder Satisfaction", status: "on-track" as const },
    ],
  },
];

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">FlowX</h1>
              <nav className="flex gap-6">
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </a>
                <a href="#" className="text-sm font-medium text-primary border-b-2 border-primary pb-4">
                  Strategy
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Initiatives
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Tasks
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Scorecard
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Vision & Mission */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Vision & Mission</h2>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-secondary to-card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Vision</h3>
                  <p className="text-muted-foreground">
                    To become the industry leader in strategic management solutions
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary to-card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Flag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mission</h3>
                  <p className="text-muted-foreground">
                    We empower organizations to align their strategic priorities and drive measurable results through innovative technology
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Year</label>
                <Select defaultValue="2025">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Strategic Initiatives"
            value="4"
            subtitle="2025"
          />
          
          <StatCard
            title="Key Initiatives"
            value="0"
            subtitle="2025"
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <Progress value={0} className="h-2 bg-destructive" />
            </div>
          </StatCard>

          <StatCard
            title="Initiative Status"
            value=""
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
              <TabsTrigger value="goal">By Goal</TabsTrigger>
              <TabsTrigger value="department">By Department</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
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
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Strategic Initiatives</h3>
                <span className="text-sm text-muted-foreground">4 initiatives</span>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
              {initiatives.map((initiative) => (
                <Card key={initiative.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground flex-1">
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
          </TabsContent>

          <TabsContent value="goal">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">View by goal coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="department">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">View by department coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
