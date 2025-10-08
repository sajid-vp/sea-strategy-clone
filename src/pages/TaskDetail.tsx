import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { ArrowLeft, User, Calendar, AlertCircle, CheckCircle2, Clock, Network, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllProjects } from "@/data/projectsData";

const TaskDetail = () => {
  const { id } = useParams();
  const allProjects = getAllProjects();
  const [projects, setProjects] = useState(allProjects);
  
  let task = null;
  let parentProject = null;

  for (const project of projects) {
    const foundTask = project.tasks.find(t => t.id === Number(id));
    if (foundTask) {
      task = foundTask;
      parentProject = project;
      break;
    }
  }

  // Get all tasks for dependencies
  const allTasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, projectId: p.id, projectTitle: p.title })));
  
  const [newSubtask, setNewSubtask] = useState("");
  const [newDependency, setNewDependency] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !task) return;
    
    const newTask = {
      id: Math.max(...allTasks.map(t => t.id)) + 1,
      name: newSubtask,
      status: "todo" as const,
      priority: task.priority,
      assignee: task.assignee,
      dependencies: [],
      subtasks: [],
      dueDate: task.dueDate || "",
      description: `Subtask of ${task.name}`
    };

    setProjects(prev => prev.map(p => 
      p.id === parentProject?.id 
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    ));

    // Add subtask reference
    setProjects(prev => prev.map(p =>
      p.id === parentProject?.id 
        ? { 
            ...p, 
            tasks: p.tasks.map(t => 
              t.id === task.id 
                ? { ...t, subtasks: [...(t.subtasks || []), newTask.id] }
                : t
            )
          }
        : p
    ));

    setNewSubtask("");
  };

  const handleAddDependency = () => {
    if (!newDependency || !task) return;
    
    setProjects(prev => prev.map(p =>
      p.id === parentProject?.id 
        ? { 
            ...p, 
            tasks: p.tasks.map(t => 
              t.id === task.id 
                ? { ...t, dependencies: [...(t.dependencies || []), Number(newDependency)] }
                : t
            )
          }
        : p
    ));

    setNewDependency("");
  };

  const handleRemoveDependency = (depId: number) => {
    if (!task) return;
    
    setProjects(prev => prev.map(p =>
      p.id === parentProject?.id 
        ? { 
            ...p, 
            tasks: p.tasks.map(t => 
              t.id === task.id 
                ? { ...t, dependencies: (t.dependencies || []).filter(d => d !== depId) }
                : t
            )
          }
        : p
    ));
  };

  const handleRemoveSubtask = (subtaskId: number) => {
    if (!task) return;
    
    setProjects(prev => prev.map(p => 
      p.id === parentProject?.id 
        ? { 
            ...p, 
            tasks: p.tasks.map(t => 
              t.id === task.id 
                ? { ...t, subtasks: (t.subtasks || []).filter(s => s !== subtaskId) }
                : t
            )
          }
        : p
    ));
  };

  if (!task || !parentProject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Task not found</h1>
            <Link to="/tasks">
              <Button>Back to Tasks</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-success" />;
      case "in-review":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/tasks">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {task.name}
            </h1>
            <p className="text-muted-foreground mb-4">{task.description}</p>
            <div className="flex items-center gap-3">
              <StatusBadge status={task.status} />
              <Badge variant={getPriorityColor(task.priority)} className="capitalize">
                {task.priority} Priority
              </Badge>
            </div>
          </div>
          {getStatusIcon()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Parent Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={`/projects/${parentProject.id}`}>
                <p className="font-semibold text-foreground hover:text-primary transition-colors">
                  {parentProject.title}
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assigned To
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground">{task.assignee}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </CardContent>
          </Card>

          {task.status === "done" && task.completedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Completed Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {new Date(task.completedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Priority Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={getPriorityColor(task.priority)} className="capitalize text-base px-3 py-1">
                {task.priority}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Dependencies */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Dependencies
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">Add</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Dependency</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Task must wait for:</Label>
                        <Select value={newDependency} onValueChange={setNewDependency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a task" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTasks.filter(t => t.id !== task?.id).map(t => (
                              <SelectItem key={t.id} value={String(t.id)}>
                                {t.name} ({t.projectTitle})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddDependency} className="w-full">
                        Add Dependency
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {task.dependencies && task.dependencies.length > 0 ? (
                <div className="space-y-2">
                  {task.dependencies.map(depId => {
                    const depTask = allTasks.find(t => t.id === depId);
                    return depTask ? (
                      <div key={depId} className="flex items-center justify-between p-2 border rounded-lg">
                        <Link to={`/tasks/${depTask.id}`} className="flex-1 hover:text-primary">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={depTask.status} />
                            <span className="font-medium">{depTask.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{depTask.projectTitle}</p>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveDependency(depId)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No dependencies</p>
              )}
            </CardContent>
          </Card>

          {/* Subtasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Subtasks
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">Add</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Subtask</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Subtask Name</Label>
                        <Input 
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          placeholder="Enter subtask name"
                        />
                      </div>
                      <Button onClick={handleAddSubtask} className="w-full">
                        Create Subtask
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {task.subtasks && task.subtasks.length > 0 ? (
                <div className="space-y-2">
                  {task.subtasks.map(subtaskId => {
                    const subtask = allTasks.find(t => t.id === subtaskId);
                    return subtask ? (
                      <div key={subtaskId} className="flex items-center justify-between p-2 border rounded-lg">
                        <Link to={`/tasks/${subtask.id}`} className="flex-1 hover:text-primary">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={subtask.status} />
                            <span className="font-medium">{subtask.name}</span>
                          </div>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveSubtask(subtaskId)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subtasks</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;