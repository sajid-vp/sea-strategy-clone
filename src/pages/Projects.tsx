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
import { FolderKanban, List, BarChart3, TrendingUp, Users, Plus } from "lucide-react";
import { initiatives, getAllProjects } from "@/data/projectsData";
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
import { toast } from "sonner";

const Projects = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    code: "",
    description: "",
    owner: "",
    department: "",
    priority: "medium",
    startDate: "",
    endDate: "",
    budget: "",
    initiativeId: "",
    status: "planned",
    projectType: "Strategic",
  });
  
  const allProjects = getAllProjects();

  const handleAddProject = () => {
    if (!newProject.title || !newProject.owner || !newProject.initiativeId) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would save to a database
    toast.success("Project added successfully!");
    setIsAddProjectOpen(false);
    setNewProject({
      title: "",
      code: "",
      description: "",
      owner: "",
      department: "",
      priority: "medium",
      startDate: "",
      endDate: "",
      budget: "",
      initiativeId: "",
      status: "planned",
      projectType: "Strategic",
    });
  };

  const totalProjects = initiatives.reduce((acc, init) => acc + init.projects.length, 0);
  const onTrackProjects = initiatives.reduce((acc, init) => 
    acc + init.projects.filter(p => p.status === "in-progress").length, 0
  );
  const atRiskProjects = initiatives.reduce((acc, init) => 
    acc + init.projects.filter(p => p.status === "in-review").length, 0
  );
  const offTrackProjects = initiatives.reduce((acc, init) => 
    acc + init.projects.filter(p => p.status === "blocked").length, 0
  );
  
  const avgProgress = Math.round(
    initiatives.reduce((acc, init) => 
      acc + init.projects.reduce((sum, p) => sum + p.progress, 0), 0
    ) / totalProjects
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
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
            title="Total Projects"
            value={totalProjects}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<FolderKanban className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="Project Status"
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
                <span className="font-semibold">{onTrackProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">At Risk:</span>
                </div>
                <span className="font-semibold">{atRiskProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Off Track:</span>
                </div>
                <span className="font-semibold">{offTrackProjects}</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Overall Progress"
            value={`${avgProgress}%`}
            className="border-l-4 border-l-secondary-foreground"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Average</div>
              <Progress value={avgProgress} className="h-2" />
            </div>
          </StatCard>

          <StatCard
            title="Active Teams"
            value={new Set(initiatives.flatMap(i => i.projects.flatMap(p => p.team))).size}
            subtitle="Contributors"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Projects */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
              <TabsTrigger value="initiative">By Initiative</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project by filling in the details below
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                          id="title"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="Enter project title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Project Code</Label>
                        <Input
                          id="code"
                          value={newProject.code}
                          onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                          placeholder="PRJ-2025-XXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Project description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="initiative">Initiative *</Label>
                        <Select 
                          value={newProject.initiativeId} 
                          onValueChange={(value) => setNewProject({ ...newProject, initiativeId: value })}
                        >
                          <SelectTrigger id="initiative">
                            <SelectValue placeholder="Select initiative" />
                          </SelectTrigger>
                          <SelectContent>
                            {initiatives.map((init) => (
                              <SelectItem key={init.id} value={init.id.toString()}>
                                {init.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="owner">Project Owner *</Label>
                        <Input
                          id="owner"
                          value={newProject.owner}
                          onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })}
                          placeholder="Owner name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={newProject.department}
                          onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                          placeholder="Department name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select 
                          value={newProject.projectType} 
                          onValueChange={(value) => setNewProject({ ...newProject, projectType: value })}
                        >
                          <SelectTrigger id="projectType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strategic">Strategic</SelectItem>
                            <SelectItem value="Operational">Operational</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={newProject.status} 
                          onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                        >
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="in-review">In Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={newProject.priority} 
                          onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget</Label>
                        <Input
                          id="budget"
                          value={newProject.budget}
                          onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                          placeholder="AED 0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newProject.startDate}
                          onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newProject.endDate}
                          onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProject}>
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <FolderKanban className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="overview">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {allProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block"
                >
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {project.title}
                        </h3>
                        <StatusBadge status={project.status} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="font-medium">{project.owner}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Team:</span>
                          <span className="font-medium">{project.team.length} members</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="owner" className="space-y-4">
            {Array.from(
              new Set(initiatives.flatMap(i => i.projects.map(p => p.owner)))
            ).map((owner) => {
              const ownerProjects = initiatives.flatMap(i => 
                i.projects.filter(p => p.owner === owner)
              );
              
              return (
                <div key={owner} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{owner}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({ownerProjects.length} projects)
                    </span>
                  </div>

                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }>
                    {ownerProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block"
                      >
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-2">
                                {project.title}
                              </h3>
                              <StatusBadge status={project.status} />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>

                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Team:</span>
                                <span className="font-medium">{project.team.length} members</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="initiative" className="space-y-6">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {initiative.title}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({initiative.projects.length} projects)
                  </span>
                </div>

                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
                }>
                  {initiative.projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="block"
                    >
                      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">
                              {project.title}
                            </h3>
                            <StatusBadge status={project.status} />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div className="pt-3 border-t space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="font-medium">{project.owner}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Team:</span>
                              <span className="font-medium">{project.team.length} members</span>
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

export default Projects;