import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { CheckSquare, List, BarChart3, Clock, Users, Plus, LayoutGrid, AlertCircle, CheckCircle2, Circle, Clock3, User, Calendar as CalendarIcon, X, ChevronDown, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Task = {
  id: number;
  name: string;
  status: "done" | "in-progress" | "in-review" | "todo" | "blocked";
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  type: "procurement" | "finance" | "hr" | "it" | "operations" | "marketing" | "other";
};

type Project = {
  id: number;
  title: string;
  tasks: Task[];
};

const projects: Project[] = [
  {
    id: 1,
    title: "ISO 27001 Implementation",
    tasks: [
      {
        id: 1,
        name: "Gap Analysis",
        status: "done" as const,
        assignee: "John Smith",
        dueDate: "2025-02-15",
        priority: "high" as const,
        type: "operations" as const,
      },
      {
        id: 2,
        name: "Policy Documentation",
        status: "in-progress" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-04-30",
        priority: "high" as const,
        type: "operations" as const,
      },
      {
        id: 3,
        name: "Security Controls Implementation",
        status: "in-progress" as const,
        assignee: "Mike Chen",
        dueDate: "2025-05-31",
        priority: "medium" as const,
        type: "it" as const,
      },
      {
        id: 4,
        name: "Internal Audit",
        status: "todo" as const,
        assignee: "John Smith",
        dueDate: "2025-06-15",
        priority: "medium" as const,
        type: "finance" as const,
      },
      {
        id: 5,
        name: "Certification Audit",
        status: "todo" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-06-30",
        priority: "high" as const,
        type: "operations" as const,
      },
    ],
  },
  {
    id: 2,
    title: "Smart Campus Infrastructure",
    tasks: [
      {
        id: 6,
        name: "Requirements Analysis",
        status: "done" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-03-01",
        priority: "high" as const,
        type: "it" as const,
      },
      {
        id: 7,
        name: "Vendor Selection",
        status: "done" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-03-31",
        priority: "high" as const,
        type: "procurement" as const,
      },
      {
        id: 8,
        name: "Hardware Installation",
        status: "in-progress" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-06-30",
        priority: "medium" as const,
        type: "it" as const,
      },
      {
        id: 9,
        name: "Software Integration",
        status: "in-review" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-07-31",
        priority: "high" as const,
        type: "it" as const,
      },
      {
        id: 10,
        name: "Testing & Deployment",
        status: "todo" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-08-31",
        priority: "medium" as const,
        type: "it" as const,
      },
    ],
  },
  {
    id: 3,
    title: "Unified Mobile App Development",
    tasks: [
      {
        id: 11,
        name: "UI/UX Design",
        status: "done" as const,
        assignee: "Lisa Anderson",
        dueDate: "2025-02-28",
        priority: "high" as const,
        type: "it" as const,
      },
      {
        id: 12,
        name: "Backend API Development",
        status: "blocked" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-05-15",
        priority: "high" as const,
        type: "it" as const,
      },
      {
        id: 13,
        name: "Frontend Development",
        status: "in-review" as const,
        assignee: "Lisa Anderson",
        dueDate: "2025-06-15",
        priority: "high" as const,
        type: "it" as const,
      },
      {
        id: 14,
        name: "Integration Testing",
        status: "todo" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-06-30",
        priority: "medium" as const,
        type: "it" as const,
      },
      {
        id: 15,
        name: "Beta Testing",
        status: "todo" as const,
        assignee: "David Brown",
        dueDate: "2025-07-15",
        priority: "low" as const,
        type: "marketing" as const,
      },
    ],
  },
];

const Tasks = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedTask, setSelectedTask] = useState<{ task: Task; project: Project } | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(false);
  const [tasksList, setTasksList] = useState(projects);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  
  // Form state for new task
  const [newTaskData, setNewTaskData] = useState({
    name: "",
    status: "todo" as Task['status'],
    assignee: "",
    dueDate: "",
    priority: "medium" as Task['priority'],
    type: "other" as Task['type'],
    projectId: projects[0]?.id || 1
  });

  const handleTaskClick = (task: Task, project: Project) => {
    setSelectedTask({ task, project });
    setTempName(task.name);
    setIsNewTask(false);
    setIsSheetOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setNewTaskData({
      name: "",
      status: "todo",
      assignee: "",
      dueDate: "",
      priority: "medium",
      type: "other",
      projectId: projects[0]?.id || 1
    });
    setIsNewTask(true);
    setIsSheetOpen(true);
  };

  const updateTaskField = (field: keyof Task, value: any) => {
    if (!selectedTask) return;
    
    setTasksList(prev => prev.map(proj => {
      if (proj.id === selectedTask.project.id) {
        return {
          ...proj,
          tasks: proj.tasks.map(t => 
            t.id === selectedTask.task.id 
              ? { ...t, [field]: value }
              : t
          )
        };
      }
      return proj;
    }));

    // Update local state
    setSelectedTask({
      ...selectedTask,
      task: { ...selectedTask.task, [field]: value }
    });

    toast({
      title: "Updated",
      description: `Task ${field} updated`,
    });
  };

  const handleCreateTask = () => {
    if (!newTaskData.name.trim()) {
      toast({
        title: "Task name required",
        description: "Please enter a task name",
        variant: "destructive"
      });
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      name: newTaskData.name,
      status: newTaskData.status,
      assignee: newTaskData.assignee || "Unassigned",
      dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
      priority: newTaskData.priority,
      type: newTaskData.type,
    };

    setTasksList(prev => prev.map(proj => 
      proj.id === newTaskData.projectId
        ? { ...proj, tasks: [...proj.tasks, newTask] }
        : proj
    ));
    
    toast({
      title: "Task created",
      description: "Your task has been created"
    });
    
    setIsSheetOpen(false);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateTaskField('name', tempName);
      setEditingName(false);
    }
  };

  const getPriorityVariant = (priority: string): "destructive" | "secondary" | "outline" => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getTaskTypeColor = (type: Task['type']) => {
    switch (type) {
      case "procurement": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "finance": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "hr": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "it": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "operations": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "marketing": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "other": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTaskTypeLabel = (type: Task['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const allTasks: Task[] = tasksList.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => t.status === "done").length;
  const onTrackTasks = allTasks.filter(t => t.status === "in-progress").length;
  const atRiskTasks = allTasks.filter(t => t.status === "in-review").length;
  const notStartedTasks = allTasks.filter(t => t.status === "todo").length;
  const highPriorityTasks = allTasks.filter(t => t.priority === "high").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case "done": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "in-progress": return <Circle className="h-4 w-4 text-primary" />;
      case "in-review": return <AlertCircle className="h-4 w-4 text-warning" />;
      case "blocked": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "todo": return <Clock3 className="h-4 w-4 text-muted-foreground" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProjectForTask = (taskId: number) => {
    return tasksList.find(p => p.tasks.some(t => t.id === taskId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
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
            title="Total Tasks"
            value={allTasks.length}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<CheckSquare className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="Completed"
            value={completedTasks}
            subtitle={`${Math.round((completedTasks / allTasks.length) * 100)}% complete`}
            className="border-l-4 border-l-secondary-foreground"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="High Priority"
            value={highPriorityTasks}
            subtitle="Needs attention"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Clock className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="Task Status"
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
                <span className="font-semibold">{onTrackTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">At Risk:</span>
                </div>
                <span className="font-semibold">{atRiskTasks}</span>
              </div>
            </div>
          </StatCard>
        </div>

        {/* Tasks */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignee">By Assignee</TabsTrigger>
              <TabsTrigger value="project">By Project</TabsTrigger>
              <TabsTrigger value="priority">By Priority</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
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
              <Button className="gap-2" onClick={handleNewTask}>
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          <TabsContent value="overview">
            {viewMode === "list" ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 border-b">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
                    <div className="col-span-4">Task</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-2">Assignee</div>
                    <div className="col-span-2">Due Date</div>
                  </div>
                </div>
                <div className="divide-y">
                  {allTasks.map((task) => {
                    const project = getProjectForTask(task.id);
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => project && handleTaskClick(task, project)}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group cursor-pointer"
                      >
                        <div className="col-span-4 flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {task.name}
                            </h3>
                            {project && (
                              <p className="text-xs text-muted-foreground truncate">{project.title}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          <StatusBadge status={task.status} />
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                        
                        <div className="col-span-2 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm truncate">{task.assignee}</span>
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          <span className="text-sm text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTasks.map((task) => {
                  const project = getProjectForTask(task.id);
                  return (
                    <div key={task.id} onClick={() => project && handleTaskClick(task, project)} className="block group">
                      <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                        <div className="flex items-start gap-3 mb-3">
                          {getStatusIcon(task.status)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                              {task.name}
                            </h3>
                            {project && (
                              <p className="text-xs text-muted-foreground">{project.title}</p>
                            )}
                          </div>
                        </div>
                        
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={task.status} />
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </div>
                            
                            <div className="pt-3 border-t space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <User className="h-3 w-3 text-primary" />
                                </div>
                                <span className="truncate">{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })}</span>
                              </div>
                            </div>
                          </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignee" className="space-y-6">
            {Array.from(new Set(allTasks.map(t => t.assignee))).map((assignee) => {
              const assigneeTasks = allTasks.filter(t => t.assignee === assignee);
              
              return (
                <div key={assignee} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{assignee}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({assigneeTasks.length} tasks)
                    </span>
                  </div>

                  {viewMode === "list" ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="divide-y">
                        {assigneeTasks.map((task) => {
                          const project = getProjectForTask(task.id);
                          return (
                            <Link 
                              key={task.id} 
                              to={`/tasks/${task.id}`}
                              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group"
                            >
                              <div className="col-span-5 flex items-center gap-3">
                                {getStatusIcon(task.status)}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {task.name}
                                  </h3>
                                  {project && (
                                    <p className="text-xs text-muted-foreground truncate">{project.title}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="col-span-3 flex items-center">
                                <StatusBadge status={task.status} />
                              </div>
                              
                              <div className="col-span-2 flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              
                              <div className="col-span-2 flex items-center">
                                <span className="text-sm text-muted-foreground">
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assigneeTasks.map((task) => {
                        const project = getProjectForTask(task.id);
                        return (
                          <div key={task.id} onClick={() => project && handleTaskClick(task, project)} className="block group">
                            <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                              <div className="flex items-start gap-3 mb-3">
                                {getStatusIcon(task.status)}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {task.name}
                                  </h3>
                                  {project && (
                                    <p className="text-xs text-muted-foreground">{project.title}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={task.status} />
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                
                                <div className="pt-3 border-t">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold text-foreground">{project.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    ({project.tasks.length} tasks)
                  </span>
                </div>

                {viewMode === "list" ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="divide-y">
                      {project.tasks.map((task) => (
                        <Link 
                          key={task.id} 
                          to={`/tasks/${task.id}`}
                          className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="col-span-5 flex items-center gap-3">
                            {getStatusIcon(task.status)}
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {task.name}
                            </h3>
                          </div>
                          
                          <div className="col-span-3 flex items-center">
                            <StatusBadge status={task.status} />
                          </div>
                          
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm truncate">{task.assignee}</span>
                          </div>
                          
                          <div className="col-span-2 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.tasks.map((task) => (
                      <div key={task.id} onClick={() => handleTaskClick(task, project)} className="block group">
                        <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                          <div className="flex items-start gap-3 mb-3">
                            {getStatusIcon(task.status)}
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {task.name}
                            </h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={task.status} />
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <div className="pt-3 border-t space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <User className="h-3 w-3 text-primary" />
                                </div>
                                <span className="truncate">{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="priority" className="space-y-6">
            {["high", "medium", "low"].map((priority) => {
              const priorityTasks = allTasks.filter(t => t.priority === priority);
              
              if (priorityTasks.length === 0) return null;
              
              return (
                <div key={priority} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold border-2 ${getPriorityBadgeColor(priority)}`}>
                      {priority} Priority
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({priorityTasks.length} tasks)
                    </span>
                  </div>

                  {viewMode === "list" ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="divide-y">
                        {priorityTasks.map((task) => {
                          const project = getProjectForTask(task.id);
                          return (
                            <div 
                              key={task.id} 
                              onClick={() => project && handleTaskClick(task, project)}
                              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group cursor-pointer"
                            >
                              <div className="col-span-4 flex items-center gap-3">
                                {getStatusIcon(task.status)}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {task.name}
                                  </h3>
                                  {project && (
                                    <p className="text-xs text-muted-foreground truncate">{project.title}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="col-span-3 flex items-center">
                                <StatusBadge status={task.status} />
                              </div>
                              
                              <div className="col-span-3 flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm truncate">{task.assignee}</span>
                              </div>
                              
                              <div className="col-span-2 flex items-center">
                                <span className="text-sm text-muted-foreground">
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {priorityTasks.map((task) => {
                        const project = getProjectForTask(task.id);
                        return (
                          <div key={task.id} onClick={() => project && handleTaskClick(task, project)} className="block group">
                            <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                              <div className="flex items-start gap-3 mb-3">
                                {getStatusIcon(task.status)}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {task.name}
                                  </h3>
                                  {project && (
                                    <p className="text-xs text-muted-foreground">{project.title}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={task.status} />
                                </div>
                                
                                <div className="pt-3 border-t space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <User className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="truncate">{task.assignee}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric'
                                    })}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Task Sheet - Modern Inline Editing */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {isNewTask ? (
              <>
                {/* New Task Form */}
                <SheetHeader>
                  <SheetTitle>Create Task</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div>
                    <Input
                      placeholder="Task name"
                      value={newTaskData.name}
                      onChange={(e) => setNewTaskData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-lg font-medium"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={newTaskData.status}
                      onValueChange={(value: Task['status']) => setNewTaskData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="w-[140px]">
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

                    <Select
                      value={newTaskData.priority}
                      onValueChange={(value: Task['priority']) => setNewTaskData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={newTaskData.type}
                      onValueChange={(value: Task['type']) => setNewTaskData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Project</Label>
                      <Select
                        value={newTaskData.projectId.toString()}
                        onValueChange={(value) => setNewTaskData(prev => ({ ...prev, projectId: parseInt(value) }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tasksList.map(proj => (
                            <SelectItem key={proj.id} value={proj.id.toString()}>
                              {proj.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Assignee</Label>
                      <Input
                        placeholder="Unassigned"
                        value={newTaskData.assignee}
                        onChange={(e) => setNewTaskData(prev => ({ ...prev, assignee: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Due Date</Label>
                      <Input
                        type="date"
                        value={newTaskData.dueDate}
                        onChange={(e) => setNewTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateTask} className="flex-1">
                      Create Task
                    </Button>
                    <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : selectedTask && (
              <>
                {/* View/Edit Task - Inline Editing */}
                <SheetHeader className="space-y-4">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => updateTaskField('status', selectedTask.task.status === 'done' ? 'todo' : 'done')}
                      className="mt-1 transition-colors"
                    >
                      {selectedTask.task.status === 'done' ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    
                    {editingName ? (
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="text-xl font-semibold -ml-1"
                        autoFocus
                      />
                    ) : (
                      <SheetTitle 
                        className="text-xl cursor-pointer hover:text-primary transition-colors flex-1"
                        onClick={() => setEditingName(true)}
                      >
                        {selectedTask.task.name}
                      </SheetTitle>
                    )}
                  </div>

                  <Link 
                    to={`/projects/${selectedTask.project.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 w-fit"
                  >
                    {selectedTask.project.title}
                  </Link>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Status Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select
                      value={selectedTask.task.status}
                      onValueChange={(value: Task['status']) => updateTaskField('status', value)}
                    >
                      <SelectTrigger className="w-full animate-fade-in">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            <span>To Do</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-primary" />
                            <span>In Progress</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in-review">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-warning" />
                            <span>In Review</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="blocked">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span>Blocked</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="done">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span>Done</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <Select
                      value={selectedTask.task.priority}
                      onValueChange={(value: Task['priority']) => updateTaskField('priority', value)}
                    >
                      <SelectTrigger className="w-full animate-fade-in">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-success" />
                            <span>Low</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-warning" />
                            <span>Medium</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-destructive" />
                            <span>High</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Task Type Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Select
                      value={selectedTask.task.type}
                      onValueChange={(value: Task['type']) => updateTaskField('type', value)}
                    >
                      <SelectTrigger className="w-full animate-fade-in">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Assignee */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Assignee</Label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 transition-colors group cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {selectedTask.task.assignee.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <Input
                        value={selectedTask.task.assignee}
                        onChange={(e) => updateTaskField('assignee', e.target.value)}
                        className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 font-medium"
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal hover:border-primary/50 transition-colors",
                            !selectedTask.task.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedTask.task.dueDate ? (
                            format(new Date(selectedTask.task.dueDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(selectedTask.task.dueDate)}
                          onSelect={(date) => date && updateTaskField('dueDate', date.toISOString().split('T')[0])}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Tasks;