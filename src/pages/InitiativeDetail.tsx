import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, User, Users, Calendar, Target, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Same data structure as Initiatives page
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

const InitiativeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kpiFormData, setKpiFormData] = useState({
    name: "",
    status: "on-track" as "on-track" | "off-track",
  });
  
  // Find the initiative and its parent goal
  let initiative;
  let parentGoal;
  
  for (const goal of goals) {
    const found = goal.initiatives.find(i => i.id.toString() === id);
    if (found) {
      initiative = found;
      parentGoal = goal;
      break;
    }
  }

  if (!initiative || !parentGoal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Initiative not found</h1>
            <Link to="/initiatives">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Initiatives
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Calculate progress (example: based on KPI status)
  const totalKpis = initiative.kpis.length;
  const onTrackKpis = initiative.kpis.filter(k => k.status === "on-track").length;
  const progress = totalKpis > 0 ? (onTrackKpis / totalKpis) * 100 : 0;

  const handleKpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kpiFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a KPI name",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally save to a database
    toast({
      title: "Success",
      description: "KPI created successfully",
    });

    // Reset form and close dialog
    setKpiFormData({
      name: "",
      status: "on-track",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Back button */}
        <Link to="/initiatives">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Initiatives
          </Button>
        </Link>

        {/* Initiative Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {initiative.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={initiative.status} />
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {initiative.year}
                </Badge>
              </div>
            </div>
          </div>

          {/* Parent Goal */}
          <Card className="p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Strategic Goal
                </div>
                <div className="font-semibold text-foreground">{parentGoal.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {parentGoal.description}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {onTrackKpis} of {totalKpis} KPIs on track
                </div>
              </div>
            </Card>

            {/* KPIs */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Key Performance Indicators ({initiative.kpis.length})
                </h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add KPI
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New KPI</DialogTitle>
                      <DialogDescription>
                        Create a new Key Performance Indicator for this initiative
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleKpiSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="kpi-name">KPI Name *</Label>
                        <Input
                          id="kpi-name"
                          placeholder="Enter KPI name"
                          value={kpiFormData.name}
                          onChange={(e) => setKpiFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kpi-status">Status *</Label>
                        <Select 
                          value={kpiFormData.status} 
                          onValueChange={(value: "on-track" | "off-track") => 
                            setKpiFormData(prev => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger id="kpi-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on-track">On Track</SelectItem>
                            <SelectItem value="off-track">Off Track</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          Add KPI
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-3">
                {initiative.kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{kpi.name}</div>
                    </div>
                    <StatusBadge status={kpi.status} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Target Year</div>
                    <div className="text-lg font-semibold text-foreground">{initiative.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Goal Period</div>
                    <div className="text-lg font-semibold text-foreground">
                      {parentGoal.startYear} - {parentGoal.endYear}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Team */}
          <div className="space-y-6">
            {/* Owner */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Initiative Owner</h2>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-foreground">{initiative.owner}</div>
                <div className="text-sm text-muted-foreground mt-1">Project Lead</div>
              </div>
            </Card>

            {/* Team Members */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Team Members</h2>
              </div>
              <div className="space-y-2">
                {initiative.team.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-foreground">{member}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Team Member</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InitiativeDetail;
