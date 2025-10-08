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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Flag,
  Edit,
  Save,
  ChevronRight,
  Plus,
  FolderKanban,
} from "lucide-react";
import { getAllProjects } from "@/data/projectsData";
import { toast } from "sonner";

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
        status: "on-track" as const,
        initiatives: [
          { id: 1, title: "Cloud Migration", status: "on-track" as const },
          { id: 2, title: "Security Enhancement", status: "on-track" as const },
        ],
      },
      {
        id: 2,
        title: "Digital Transformation",
        status: "at-risk" as const,
        initiatives: [
          { id: 3, title: "Process Automation", status: "off-track" as const },
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
    objectives: [
      {
        id: 3,
        title: "Teaching Enhancement",
        status: "off-track" as const,
        initiatives: [
          { id: 4, title: "Learning Platform", status: "at-risk" as const },
        ],
      },
      {
        id: 4,
        title: "Service Excellence",
        status: "on-track" as const,
        initiatives: [
          { id: 5, title: "Student Portal", status: "on-track" as const },
        ],
      },
    ],
  },
];

const Index = () => {
  const [vision, setVision] = useState("To become the industry leader in strategic management solutions");
  const [mission, setMission] = useState("We empower organizations to align their strategic priorities and drive measurable results through innovative technology");
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [tempVision, setTempVision] = useState(vision);
  const [tempMission, setTempMission] = useState(mission);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    owner: "",
    startDate: "",
    endDate: "",
    budget: "",
    department: "",
  });

  const allProjects = getAllProjects();

  const handleSaveVision = () => {
    setVision(tempVision);
    setIsEditingVision(false);
  };

  const handleSaveMission = () => {
    setMission(tempMission);
    setIsEditingMission(false);
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.owner || !newProject.startDate || !newProject.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Project added successfully!");
    setIsAddProjectOpen(false);
    setNewProject({
      title: "",
      description: "",
      owner: "",
      startDate: "",
      endDate: "",
      budget: "",
      department: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Goals</h2>
            <div className="w-64">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All periods</SelectItem>
                  <SelectItem value="2025-2028">2025-2028</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2027-2028">2027-2028</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const totalObjectives = goal.objectives.length;
              const totalInitiatives = goal.objectives.reduce((acc, obj) => acc + obj.initiatives.length, 0);
              
              // Calculate status for objectives
              const objOnTrack = goal.objectives.filter(o => o.status === "on-track").length;
              const objOffTrack = goal.objectives.filter(o => o.status === "off-track").length;
              const objAtRisk = goal.objectives.filter(o => o.status === "at-risk").length;
              
              // Calculate status for initiatives
              let initOnTrack = 0;
              let initOffTrack = 0;
              let initAtRisk = 0;
              
              goal.objectives.forEach(obj => {
                obj.initiatives.forEach(init => {
                  if (init.status === "on-track") initOnTrack++;
                  else if (init.status === "off-track") initOffTrack++;
                  else if (init.status === "at-risk") initAtRisk++;
                });
              });
              
              return (
                <Link key={goal.id} to={`/goals/${goal.id}`} className="group">
                  <Card className="p-6 border border-t-4 border-t-primary bg-gradient-to-br from-secondary/30 to-transparent hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center gap-0.5">
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 opacity-40" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 delay-75 group-hover:translate-x-1 opacity-60" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 delay-150 group-hover:translate-x-1" />
                    </div>

                    <div className="flex items-start justify-between mb-4 pr-12">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {goal.title}
                        </h3>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {goal.startYear} - {goal.endYear}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                      {goal.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-lg text-foreground">{totalObjectives}</span>
                        <span className="text-muted-foreground">objectives</span>
                        <div className="flex items-center gap-1">
                          {objOnTrack > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20">
                              <div className="h-2 w-2 rounded-full bg-success" />
                              <span className="text-xs font-semibold text-success">{objOnTrack}</span>
                            </div>
                          )}
                          {objAtRisk > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20">
                              <div className="h-2 w-2 rounded-full bg-warning" />
                              <span className="text-xs font-semibold text-warning">{objAtRisk}</span>
                            </div>
                          )}
                          {objOffTrack > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20">
                              <div className="h-2 w-2 rounded-full bg-destructive" />
                              <span className="text-xs font-semibold text-destructive">{objOffTrack}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-lg text-foreground">{totalInitiatives}</span>
                        <span className="text-muted-foreground">initiatives</span>
                        <div className="flex items-center gap-1">
                          {initOnTrack > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20">
                              <div className="h-2 w-2 rounded-full bg-success" />
                              <span className="text-xs font-semibold text-success">{initOnTrack}</span>
                            </div>
                          )}
                          {initAtRisk > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20">
                              <div className="h-2 w-2 rounded-full bg-warning" />
                              <span className="text-xs font-semibold text-warning">{initAtRisk}</span>
                            </div>
                          )}
                          {initOffTrack > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20">
                              <div className="h-2 w-2 rounded-full bg-destructive" />
                              <span className="text-xs font-semibold text-destructive">{initOffTrack}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Projects</h2>
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Create a new project with details and assignments
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Enter project description"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="owner">Project Owner *</Label>
                      <Input
                        id="owner"
                        value={newProject.owner}
                        onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })}
                        placeholder="Enter owner name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newProject.department}
                        onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                        placeholder="Enter department"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      placeholder="e.g., AED 10,000.00"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject}>Add Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-semibold">{project.owner}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Initiative:</span>
                      <span className="font-semibold text-primary truncate ml-2">{project.initiativeTitle}</span>
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

export default Index;
