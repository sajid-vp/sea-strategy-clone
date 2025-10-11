import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Users, Calendar, Target, Plus, MessageSquare, Send, FolderKanban, Activity, Pencil, TrendingUp } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { initiatives } from "@/data/projectsData";
import { programs, getProgramsByInitiative } from "@/data/programsData";
import { getActivitiesByProgram } from "@/data/activitiesData";
import { getKPIsByInitiative, getKPIProgress, KPI } from "@/data/kpisData";

// Data structure with objectives
const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    objectives: [
      {
        id: 1,
        title: "Infrastructure Modernization",
        initiatives: [
            {
              id: 1,
              title: "Develop and Implement IT infrastructure",
              year: 2025,
              status: "in-progress" as const,
              owner: "John Smith",
              team: ["Sarah Johnson", "Mike Chen", "Emma Wilson"],
              kpis: [
                { name: "ISO 27001 Implementation", status: "in-progress" as const },
                { name: "Smart Campus Infrastructure", status: "in-progress" as const },
                { name: "Child Safety Geo-tagging", status: "in-progress" as const },
              ],
            },
        ],
      },
      {
        id: 2,
        title: "Digital Transformation",
        initiatives: [
            {
              id: 2,
              title: "Digital Transformation initiatives",
              year: 2025,
              status: "blocked" as const,
              owner: "David Brown",
              team: ["Lisa Anderson", "Tom Martinez"],
              kpis: [
                { name: "Student Information System Adoption", status: "in-progress" as const },
                { name: "AI-Driven Business Intelligence Dashboards", status: "in-progress" as const },
                { name: "Unified Mobile App Development", status: "blocked" as const },
              ],
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
        initiatives: [
            {
              id: 3,
              title: "Support Teaching & Learning",
              year: 2025,
              status: "blocked" as const,
              owner: "Rachel Green",
              team: ["Chris Taylor", "Jennifer Lee"],
              kpis: [
                { name: "Education Platform Enhancement", status: "blocked" as const },
                { name: "Nursery Management System", status: "in-progress" as const },
              ],
            },
        ],
      },
      {
        id: 4,
        title: "Service Excellence",
        initiatives: [
            {
              id: 4,
              title: "Increase satisfaction with IT services",
              year: 2026,
              status: "in-progress" as const,
              owner: "Michael Scott",
              team: ["Pam Beesly", "Jim Halpert", "Dwight Schrute"],
              kpis: [
                { name: "IT Services Employee Satisfaction", status: "in-progress" as const },
                { name: "Digital Learning Experience", status: "in-progress" as const },
                { name: "SIS Stakeholder Satisfaction", status: "in-progress" as const },
              ],
            },
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
    title: "",
    description: "",
    trackingMethod: "Manual",
    reportingFrequency: "Quarterly",
    reportingType: "Number",
    reportingUnit: "%",
    target: "",
    status: "in-progress" as "in-progress" | "blocked",
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Array<{id: number; user: string; text: string; timestamp: string}>>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isAddKPIDialogOpen, setIsAddKPIDialogOpen] = useState(false);
  const [isEditKPIDialogOpen, setIsEditKPIDialogOpen] = useState(false);
  const [isUpdateProgressDialogOpen, setIsUpdateProgressDialogOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const [updatingKPI, setUpdatingKPI] = useState<KPI | null>(null);
  const [progressUpdateValue, setProgressUpdateValue] = useState("");
  const [newKPIData, setNewKPIData] = useState({
    name: "",
    description: "",
    targetValue: "",
    currentValue: "",
    unit: "",
    owner: "",
    frequency: "monthly" as const,
    trackedByType: "project" as "project" | "program" | "activity",
    trackedById: "",
  });
  
  // Find the initiative from the data
  const initiative = initiatives.find(i => i.id.toString() === id);
  
  if (!initiative) {
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

  // Get related data
  const initiativePrograms = getProgramsByInitiative(initiative.id);
  const initiativeProjects = initiative.projects || [];
  
  // Get all activities from all programs
  const initiativeActivities = initiativePrograms.flatMap(program => 
    getActivitiesByProgram(program.id)
  );

  // Get KPIs for this initiative
  const initiativeKPIs = getKPIsByInitiative(initiative.id);

  // Calculate progress based on projects
  const totalProjects = initiativeProjects.length;
  const avgProgress = totalProjects > 0 
    ? initiativeProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects 
    : 0;

  const handleKpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kpiFormData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a KPI title",
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
      title: "",
      description: "",
      trackingMethod: "Manual",
      reportingFrequency: "Quarterly",
      reportingType: "Number",
      reportingUnit: "%",
      target: "",
      status: "in-progress",
    });
    setIsDialogOpen(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: "Current User",
      text: newComment,
      timestamp: new Date().toISOString()
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been posted"
    });
  };

  const handleAddKPI = () => {
    if (!newKPIData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a KPI name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "KPI created successfully",
    });

    setNewKPIData({
      name: "",
      description: "",
      targetValue: "",
      currentValue: "",
      unit: "",
      owner: "",
      frequency: "monthly",
      trackedByType: "project",
      trackedById: "",
    });
    setIsAddKPIDialogOpen(false);
  };

  const handleEditKPI = (kpi: KPI) => {
    setEditingKPI(kpi);
    setIsEditKPIDialogOpen(true);
  };

  const handleUpdateKPI = () => {
    if (!editingKPI) return;

    toast({
      title: "Success",
      description: "KPI details updated successfully",
    });

    setEditingKPI(null);
    setIsEditKPIDialogOpen(false);
  };

  const handleOpenProgressUpdate = (kpi: KPI) => {
    setUpdatingKPI(kpi);
    setProgressUpdateValue(kpi.currentValue);
    setIsUpdateProgressDialogOpen(true);
  };

  const handleUpdateProgress = () => {
    if (!updatingKPI || !progressUpdateValue.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid progress value",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Progress Updated",
      description: `${updatingKPI.name} updated to ${progressUpdateValue}${updatingKPI.unit}`,
    });

    setUpdatingKPI(null);
    setProgressUpdateValue("");
    setIsUpdateProgressDialogOpen(false);
  };

  const getStatusColor = (status: KPI["status"]) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "at-risk":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "off-track":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {initiative.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <Target className="h-3 w-3" />
                  Initiative #{initiative.id}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="gap-2 w-full lg:w-auto"
                onClick={() => setIsCommentsOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Programs</div>
              <div className="text-2xl font-bold text-foreground">{initiativePrograms.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Projects</div>
              <div className="text-2xl font-bold text-foreground">{initiativeProjects.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Activities</div>
              <div className="text-2xl font-bold text-foreground">{initiativeActivities.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg Progress</div>
              <div className="text-2xl font-bold text-foreground">{Math.round(avgProgress)}%</div>
            </Card>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-8">
            {initiativePrograms.length > 0 ? (
              initiativePrograms.map((program) => (
                <Link key={program.id} to={`/programs/${program.id}`} className="block">
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{program.title}</h3>
                          <Badge variant="outline" className="text-xs">{program.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                      </div>
                      <StatusBadge status={program.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Manager</p>
                        <p className="text-sm font-medium">{program.manager}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium">{program.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm font-medium">{new Date(program.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{program.progress}%</p>
                      </div>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No programs linked to this initiative yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            {initiativeProjects.length > 0 ? (
              initiativeProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block">
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                          {project.code && <Badge variant="outline" className="text-xs">{project.code}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="text-sm font-medium">{project.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{project.progress}%</p>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No projects linked to this initiative yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-8">
            {initiativeActivities.length > 0 ? (
              initiativeActivities.map((activity) => (
                <Link key={activity.id} to={`/activities/${activity.id}`} className="block">
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{activity.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                      </div>
                      <StatusBadge status={activity.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline" className="ml-2 text-xs">{activity.type}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="ml-2 font-medium capitalize">{activity.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="ml-2 font-medium">{activity.owner}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{activity.duration} min</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No activities linked to this initiative yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
              <Dialog open={isAddKPIDialogOpen} onOpenChange={setIsAddKPIDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add KPI
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New KPI</DialogTitle>
                    <DialogDescription>
                      Create a new key performance indicator to track initiative progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="kpi-name">KPI Name *</Label>
                      <Input
                        id="kpi-name"
                        placeholder="e.g., Security Compliance Rate"
                        value={newKPIData.name}
                        onChange={(e) => setNewKPIData({ ...newKPIData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="kpi-description">Description</Label>
                      <Textarea
                        id="kpi-description"
                        placeholder="Describe what this KPI measures..."
                        value={newKPIData.description}
                        onChange={(e) => setNewKPIData({ ...newKPIData, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="target-value">Target Value *</Label>
                        <Input
                          id="target-value"
                          type="number"
                          placeholder="95"
                          value={newKPIData.targetValue}
                          onChange={(e) => setNewKPIData({ ...newKPIData, targetValue: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="current-value">Current Value</Label>
                        <Input
                          id="current-value"
                          type="number"
                          placeholder="78"
                          value={newKPIData.currentValue}
                          onChange={(e) => setNewKPIData({ ...newKPIData, currentValue: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="unit">Unit *</Label>
                        <Input
                          id="unit"
                          placeholder="%"
                          value={newKPIData.unit}
                          onChange={(e) => setNewKPIData({ ...newKPIData, unit: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="owner">Owner *</Label>
                        <Input
                          id="owner"
                          placeholder="John Smith"
                          value={newKPIData.owner}
                          onChange={(e) => setNewKPIData({ ...newKPIData, owner: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="frequency">Update Frequency *</Label>
                        <Select
                          value={newKPIData.frequency}
                          onValueChange={(value: any) => setNewKPIData({ ...newKPIData, frequency: value })}
                        >
                          <SelectTrigger id="frequency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tracked By</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          value={newKPIData.trackedByType}
                          onValueChange={(value: any) => setNewKPIData({ ...newKPIData, trackedByType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="project">Project</SelectItem>
                            <SelectItem value="program">Program</SelectItem>
                            <SelectItem value="activity">Activity</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder={`${newKPIData.trackedByType} ID`}
                          value={newKPIData.trackedById}
                          onChange={(e) => setNewKPIData({ ...newKPIData, trackedById: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddKPIDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddKPI}>Add KPI</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {initiativeKPIs.length === 0 ? (
              <Card className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No KPIs defined for this initiative yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {initiativeKPIs.map((kpi) => (
                  <Card key={kpi.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{kpi.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{kpi.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenProgressUpdate(kpi)}
                          className="gap-1"
                        >
                          <TrendingUp className="h-4 w-4" />
                          Update
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditKPI(kpi)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Badge className={getStatusColor(kpi.status)}>
                          {kpi.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Value</p>
                        <p className="text-sm font-semibold">{kpi.currentValue} {kpi.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target Value</p>
                        <p className="text-sm font-semibold">{kpi.targetValue} {kpi.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="text-sm font-semibold">{kpi.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="text-sm font-semibold capitalize">{kpi.frequency}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress to Target</span>
                        <span className="font-semibold">{getKPIProgress(kpi)}%</span>
                      </div>
                      <Progress value={getKPIProgress(kpi)} className="h-2" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Tracked By:</p>
                      <div className="flex flex-wrap gap-2">
                        {kpi.trackedBy.map((tracker, index) => (
                          <Badge key={index} variant="outline">
                            {tracker.type}: {tracker.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-4">
                      Last Updated: {new Date(kpi.lastUpdated).toLocaleDateString()}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit KPI Dialog - For editing KPI structure/details */}
        <Dialog open={isEditKPIDialogOpen} onOpenChange={setIsEditKPIDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit KPI Details</DialogTitle>
              <DialogDescription>
                Update KPI structure, target values, owner, and tracking settings
              </DialogDescription>
            </DialogHeader>
            {editingKPI && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-kpi-name">KPI Name *</Label>
                  <Input
                    id="edit-kpi-name"
                    value={editingKPI.name}
                    onChange={(e) => setEditingKPI({ ...editingKPI, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-kpi-description">Description</Label>
                  <Textarea
                    id="edit-kpi-description"
                    value={editingKPI.description}
                    onChange={(e) => setEditingKPI({ ...editingKPI, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-target-value">Target Value *</Label>
                    <Input
                      id="edit-target-value"
                      type="number"
                      value={editingKPI.targetValue}
                      onChange={(e) => setEditingKPI({ ...editingKPI, targetValue: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-unit">Unit *</Label>
                    <Input
                      id="edit-unit"
                      value={editingKPI.unit}
                      onChange={(e) => setEditingKPI({ ...editingKPI, unit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-owner">Owner *</Label>
                    <Input
                      id="edit-owner"
                      value={editingKPI.owner}
                      onChange={(e) => setEditingKPI({ ...editingKPI, owner: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-frequency">Update Frequency *</Label>
                    <Select
                      value={editingKPI.frequency}
                      onValueChange={(value: any) => setEditingKPI({ ...editingKPI, frequency: value })}
                    >
                      <SelectTrigger id="edit-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Tracked By</Label>
                  <p className="text-sm text-muted-foreground">
                    {editingKPI.trackedBy.map((tracker, idx) => (
                      <span key={idx}>
                        {tracker.type.charAt(0).toUpperCase() + tracker.type.slice(1)}: {tracker.name}
                        {idx < editingKPI.trackedBy.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditKPIDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateKPI}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Progress Dialog - For updating current value */}
        <Dialog open={isUpdateProgressDialogOpen} onOpenChange={setIsUpdateProgressDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update KPI Progress</DialogTitle>
              <DialogDescription>
                Update the current value for {updatingKPI?.name}
              </DialogDescription>
            </DialogHeader>
            {updatingKPI && (
              <div className="grid gap-4 py-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Value:</span>
                    <span className="font-semibold">{updatingKPI.currentValue} {updatingKPI.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Value:</span>
                    <span className="font-semibold">{updatingKPI.targetValue} {updatingKPI.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Update Frequency:</span>
                    <span className="font-semibold capitalize">{updatingKPI.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{new Date(updatingKPI.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tracked By:</span>
                    <span className="font-medium text-xs">
                      {updatingKPI.trackedBy.length > 0 
                        ? updatingKPI.trackedBy.map(t => t.type.charAt(0).toUpperCase() + t.type.slice(1)).join(", ")
                        : "Manual"}
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="progress-value">New Current Value *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="progress-value"
                      type="number"
                      placeholder={updatingKPI.currentValue}
                      value={progressUpdateValue}
                      onChange={(e) => setProgressUpdateValue(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 border rounded-md bg-muted text-sm">
                      {updatingKPI.unit}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {updatingKPI.trackedBy.length > 0 
                      ? `Based on ${updatingKPI.trackedBy.map(t => t.name).join(", ")}`
                      : "Manual entry"}
                    {" · "}Updated {updatingKPI.frequency}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Frequency: {updatingKPI.frequency.charAt(0).toUpperCase() + updatingKPI.frequency.slice(1)}</strong>
                    <br />
                    This KPI should be updated on a {updatingKPI.frequency} basis.
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUpdateProgressDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProgress}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Update Progress
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Comments Dialog */}
        <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Initiative Comments</DialogTitle>
              <DialogDescription>
                Discussion and updates for {initiative.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Comment Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{comment.user}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground pl-10">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default InitiativeDetail;
