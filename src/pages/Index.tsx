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
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Target,
  Flag,
  Bell,
  Search,
  User,
  LayoutGrid,
  List,
  Edit,
  Save,
} from "lucide-react";

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
        kpis: [
          { name: "IT Services Employee Satisfaction", status: "on-track" as const },
          { name: "Digital Learning Experience", status: "on-track" as const },
          { name: "SIS Stakeholder Satisfaction", status: "on-track" as const },
        ],
      },
    ],
  },
];

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [vision, setVision] = useState("To become the industry leader in strategic management solutions");
  const [mission, setMission] = useState("We empower organizations to align their strategic priorities and drive measurable results through innovative technology");
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [tempVision, setTempVision] = useState(vision);
  const [tempMission, setTempMission] = useState(mission);

  const handleSaveVision = () => {
    setVision(tempVision);
    setIsEditingVision(false);
  };

  const handleSaveMission = () => {
    setMission(tempMission);
    setIsEditingMission(false);
  };

  const totalInitiatives = goals.reduce((acc, goal) => acc + goal.initiatives.length, 0);

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
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-secondary to-card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Vision</h3>
                    <Dialog open={isEditingVision} onOpenChange={setIsEditingVision}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setTempVision(vision)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Vision</DialogTitle>
                          <DialogDescription>
                            Update your organization's vision statement
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          value={tempVision}
                          onChange={(e) => setTempVision(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditingVision(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveVision} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-muted-foreground">{vision}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary to-card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Flag className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Mission</h3>
                    <Dialog open={isEditingMission} onOpenChange={setIsEditingMission}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setTempMission(mission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Mission</DialogTitle>
                          <DialogDescription>
                            Update your organization's mission statement
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          value={tempMission}
                          onChange={(e) => setTempMission(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditingMission(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveMission} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-muted-foreground">{mission}</p>
                </div>
              </div>
            </Card>
          </div>

        {/* Goals Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Strategic Goals</h2>
          
          {/* Initiatives Filters */}
          <Card className="p-4 border-l-4 border-l-secondary-foreground mb-6">
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

          <Accordion type="multiple" className="space-y-4">
            {goals.map((goal) => {
              const totalKPIs = goal.initiatives.reduce((acc, init) => acc + init.kpis.length, 0);
              const onTrackCount = goal.initiatives.filter(i => i.status === "on-track").length;
              const offTrackCount = goal.initiatives.filter(i => i.status === "off-track").length;
              
              return (
                <AccordionItem key={goal.id} value={`goal-${goal.id}`} className="border-none">
                  <Card className="bg-gradient-to-r from-secondary/30 to-transparent hover:shadow-lg transition-shadow overflow-hidden">
                    <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                      <div className="flex-1 text-left pr-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {goal.title}
                              </h3>
                              <span className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                                {goal.startYear} - {goal.endYear}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="font-bold text-lg text-foreground">{goal.initiatives.length}</span>
                              <span className="text-muted-foreground">initiatives</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="font-bold text-lg text-foreground">{totalKPIs}</span>
                              <span className="text-muted-foreground">KPIs</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {onTrackCount > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10">
                                <div className="h-2 w-2 rounded-full bg-success" />
                                <span className="text-xs font-semibold text-success">{onTrackCount}</span>
                              </div>
                            )}
                            {offTrackCount > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10">
                                <div className="h-2 w-2 rounded-full bg-destructive" />
                                <span className="text-xs font-semibold text-destructive">{offTrackCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                          Initiatives
                        </h4>
                        <div className="space-y-4">
                          {goal.initiatives.map((initiative) => (
                            <div
                              key={initiative.id}
                              className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-base font-semibold text-foreground">
                                      {initiative.title}
                                    </h4>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded">
                                      {initiative.year}
                                    </span>
                                  </div>
                                </div>
                                <StatusBadge status={initiative.status} />
                              </div>
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground mb-2">
                                  KPIs ({initiative.kpis.length})
                                </div>
                                {initiative.kpis.map((kpi, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                                  >
                                    <span className="text-foreground">{kpi.name}</span>
                                    <StatusBadge status={kpi.status} className="text-xs px-2 py-0.5" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Strategic Initiatives"
            value={totalInitiatives}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
          />
          
          <StatCard
            title="Key Initiatives"
            value="0"
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
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
            <div className="space-y-8">
              {goals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.initiatives.length} initiatives</p>
                  </div>

                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
                    {goal.initiatives.map((initiative) => (
                      <Card key={initiative.id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-secondary-foreground">
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
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goal">
            <Card className="p-8 text-center border-l-4 border-l-secondary-foreground">
              <p className="text-muted-foreground">View by goal coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="department">
            <Card className="p-8 text-center border-l-4 border-l-secondary-foreground">
              <p className="text-muted-foreground">View by department coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
