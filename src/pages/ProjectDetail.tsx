import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { ArrowLeft, Users, User, Calendar, CheckCircle2, Plus, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { initiatives } from "@/data/projectsData";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { id } = useParams();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    assignee: "",
    priority: "medium",
    status: "todo",
  });
  
  let project = null;
  let parentInitiative = null;

  for (const initiative of initiatives) {
    const foundProject = initiative.projects.find(p => p.id === Number(id));
    if (foundProject) {
      project = foundProject;
      parentInitiative = initiative;
      break;
    }
  }

  const handleAddTask = () => {
    if (!newTask.name || !newTask.assignee) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Task added successfully!");
    setIsAddTaskOpen(false);
    setNewTask({
      name: "",
      description: "",
      assignee: "",
      priority: "medium",
      status: "todo",
    });
  };

  if (!project || !parentInitiative) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Link to="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const completedMilestones = project.milestones.filter(m => m.status === "done").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "low":
        return "bg-muted text-muted-foreground hover:bg-muted/80";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/projects">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {project.title}
          </h1>
          <p className="text-muted-foreground mb-4">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Key information and team members</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                    <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">End Date</p>
                    <p className="font-semibold">{new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                    <p className="font-semibold">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Progress</p>
                    <div className="space-y-2">
                      <Progress value={project.progress} className="h-2" />
                      <p className="text-sm font-semibold">{project.progress}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">KPIs</p>
                    <div className="flex flex-wrap gap-1">
                      {project.kpis.map((kpi, idx) => (
                        <span key={idx} className="text-xs bg-accent px-2 py-1 rounded">{kpi}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-semibold">{project.department}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Parent Initiative</p>
                  <Link to={`/initiatives/${parentInitiative.id}`}>
                    <p className="font-semibold text-primary hover:underline">
                      {parentInitiative.title}
                    </p>
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={project.status} />
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Milestones</CardTitle>
                    <p className="text-sm text-muted-foreground">Track project milestones and progress</p>
                  </div>
                  <Button variant="outline" size="sm">+ Add Milestone</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{milestone.name}</h4>
                            <StatusBadge status={milestone.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        View Tasks
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasks Section - New Design */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tasks</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage project tasks and assignments</p>
                  </div>
                  <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                          Create a new task with details and assignments
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="taskName">Task Name *</Label>
                          <Input
                            id="taskName"
                            value={newTask.name}
                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                            placeholder="Enter task name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="taskDescription">Description</Label>
                          <Textarea
                            id="taskDescription"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Enter task description"
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="assignee">Assignee *</Label>
                          <Input
                            id="assignee"
                            value={newTask.assignee}
                            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                            placeholder="Enter assignee name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="in-review">In Review</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask}>Add Task</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.tasks.map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`}>
                      <div className="group border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-card">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {task.name}
                              </h4>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                <span>{task.assignee}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={task.status} />
                            {task.status === "in-review" || task.status === "blocked" ? (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Project Owner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Project Owner
                </CardTitle>
                <p className="text-sm text-muted-foreground">Primary person responsible for this project</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {project.owner.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <p className="font-semibold">{project.owner}</p>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Members
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Project team members</p>
                  </div>
                  <Button variant="ghost" size="sm">+ Add Member</Button>
                </div>
              </CardHeader>
              <CardContent>
                {project.team.length > 0 ? (
                  <div className="space-y-2">
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {member.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{member}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No Members assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Stakeholders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Stakeholders
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Project stakeholders and interested parties</p>
                  </div>
                  <Button variant="ghost" size="sm">+ Add</Button>
                </div>
              </CardHeader>
              <CardContent>
                {project.stakeholders.length > 0 ? (
                  <div className="space-y-2">
                    {project.stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {stakeholder.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{stakeholder}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No Stakeholders assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Activity
                </CardTitle>
                <p className="text-sm text-muted-foreground">Recent project activity</p>
              </CardHeader>
              <CardContent>
                {project.activities.length > 0 ? (
                  <div className="space-y-4">
                    {project.activities.map((activity) => (
                      <div key={activity.id} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">{activity.user}</span>{" "}
                              <span className="text-muted-foreground">{activity.action}</span>
                            </p>
                            <p className="text-sm font-medium">{activity.detail}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">There are no more activities</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
