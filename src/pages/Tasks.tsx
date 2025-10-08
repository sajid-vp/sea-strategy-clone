import { useState, useMemo } from "react";
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
import { CheckSquare, List, BarChart3, Clock, Users, Plus, LayoutGrid, AlertCircle, CheckCircle2, Circle, Clock3, User, Calendar as CalendarIcon, X, ChevronDown, Flag, Search, Filter, ArrowUpDown, Network, ListChecks, MessageSquare, Send } from "lucide-react";
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
  dependencies?: number[];
  subtasks?: number[];
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
        dependencies: [],
        subtasks: [],
      },
      {
        id: 2,
        name: "Policy Documentation",
        status: "in-progress" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-04-30",
        priority: "high" as const,
        type: "operations" as const,
        dependencies: [1],
        subtasks: [],
      },
      {
        id: 3,
        name: "Security Controls Implementation",
        status: "in-progress" as const,
        assignee: "Mike Chen",
        dueDate: "2025-05-31",
        priority: "medium" as const,
        type: "it" as const,
        dependencies: [2],
        subtasks: [],
      },
      {
        id: 4,
        name: "Internal Audit",
        status: "todo" as const,
        assignee: "John Smith",
        dueDate: "2025-06-15",
        priority: "medium" as const,
        type: "finance" as const,
        dependencies: [3],
        subtasks: [],
      },
      {
        id: 5,
        name: "Certification Audit",
        status: "todo" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-06-30",
        priority: "high" as const,
        type: "operations" as const,
        dependencies: [4],
        subtasks: [],
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
  const [newDependency, setNewDependency] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Record<number, Array<{id: number; user: string; text: string; timestamp: string}>>>({});
  
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Task['status'] | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | "all">("all");
  const [filterType, setFilterType] = useState<Task['type'] | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  
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

  const handleToggleComplete = (taskId: number, projectId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setTasksList(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          tasks: proj.tasks.map(t => 
            t.id === taskId 
              ? { ...t, status: t.status === "done" ? "todo" : "done" }
              : t
          )
        };
      }
      return proj;
    }));

    toast({
      title: "Task updated",
      description: "Task status changed",
    });
  };

  const handleAddDependency = () => {
    if (!newDependency || !selectedTask) return;
    
    setTasksList(prev => prev.map(proj => {
      if (proj.id === selectedTask.project.id) {
        return {
          ...proj,
          tasks: proj.tasks.map(t => 
            t.id === selectedTask.task.id 
              ? { ...t, dependencies: [...(t.dependencies || []), Number(newDependency)] }
              : t
          )
        };
      }
      return proj;
    }));

    setSelectedTask({
      ...selectedTask,
      task: { ...selectedTask.task, dependencies: [...(selectedTask.task.dependencies || []), Number(newDependency)] }
    });

    setNewDependency("");
    toast({ title: "Dependency added" });
  };

  const handleRemoveDependency = (depId: number) => {
    if (!selectedTask) return;
    
    setTasksList(prev => prev.map(proj => {
      if (proj.id === selectedTask.project.id) {
        return {
          ...proj,
          tasks: proj.tasks.map(t => 
            t.id === selectedTask.task.id 
              ? { ...t, dependencies: (t.dependencies || []).filter(d => d !== depId) }
              : t
          )
        };
      }
      return proj;
    }));

    setSelectedTask({
      ...selectedTask,
      task: { ...selectedTask.task, dependencies: (selectedTask.task.dependencies || []).filter(d => d !== depId) }
    });

    toast({ title: "Dependency removed" });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !selectedTask) return;
    
    const allTasks = tasksList.flatMap(p => p.tasks);
    const newTask: Task = {
      id: Math.max(...allTasks.map(t => t.id)) + 1,
      name: newSubtask,
      status: "todo",
      priority: selectedTask.task.priority,
      assignee: selectedTask.task.assignee,
      dueDate: selectedTask.task.dueDate,
      type: selectedTask.task.type,
      dependencies: [],
      subtasks: []
    };

    setTasksList(prev => prev.map(proj => {
      if (proj.id === selectedTask.project.id) {
        return {
          ...proj,
          tasks: [
            ...proj.tasks.map(t => 
              t.id === selectedTask.task.id 
                ? { ...t, subtasks: [...(t.subtasks || []), newTask.id] }
                : t
            ),
            newTask
          ]
        };
      }
      return proj;
    }));

    setSelectedTask({
      ...selectedTask,
      task: { ...selectedTask.task, subtasks: [...(selectedTask.task.subtasks || []), newTask.id] }
    });

    setNewSubtask("");
    toast({ title: "Subtask created" });
  };

  const handleRemoveSubtask = (subtaskId: number) => {
    if (!selectedTask) return;
    
    setTasksList(prev => prev.map(proj => {
      if (proj.id === selectedTask.project.id) {
        return {
          ...proj,
          tasks: proj.tasks.map(t => 
            t.id === selectedTask.task.id 
              ? { ...t, subtasks: (t.subtasks || []).filter(s => s !== subtaskId) }
              : t
          )
        };
      }
      return proj;
    }));

    setSelectedTask({
      ...selectedTask,
      task: { ...selectedTask.task, subtasks: (selectedTask.task.subtasks || []).filter(s => s !== subtaskId) }
    });

    toast({ title: "Subtask removed" });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    
    const comment = {
      id: Date.now(),
      user: "Current User",
      text: newComment,
      timestamp: new Date().toISOString()
    };

    setComments(prev => ({
      ...prev,
      [selectedTask.task.id]: [comment, ...(prev[selectedTask.task.id] || [])]
    }));

    setNewComment("");
    toast({ title: "Comment added" });
  };

  // Get unique assignees for filter
  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>();
    tasksList.forEach(proj => {
      proj.tasks.forEach(task => assignees.add(task.assignee));
    });
    return Array.from(assignees).sort();
  }, [tasksList]);

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    const allTasks = tasksList.flatMap(proj => 
      proj.tasks.map(task => ({ task, project: proj }))
    );

    return allTasks.filter(({ task }) => {
      // Search filter
      if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterStatus !== "all" && task.status !== filterStatus) {
        return false;
      }
      
      // Priority filter
      if (filterPriority !== "all" && task.priority !== filterPriority) {
        return false;
      }
      
      // Type filter
      if (filterType !== "all" && task.type !== filterType) {
        return false;
      }
      
      // Assignee filter
      if (filterAssignee !== "all" && task.assignee !== filterAssignee) {
        return false;
      }
      
      return true;
    });
  }, [tasksList, searchQuery, filterStatus, filterPriority, filterType, filterAssignee]);

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

  const allTasks = tasksList.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => t.status === "done").length;
  const onTrackTasks = allTasks.filter(t => t.status === "in-progress").length;
  const atRiskTasks = allTasks.filter(t => t.status === "in-review").length;
  const notStartedTasks = allTasks.filter(t => t.status === "todo").length;
  const highPriorityTasks = allTasks.filter(t => t.priority === "high").length;
  const activeFiltersCount = [filterStatus, filterPriority, filterType, filterAssignee].filter(f => f !== "all").length;

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

      <main className="container mx-auto px-6 py-8 max-w-[1400px]">
        {/* Header with Search and Filters */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Tasks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track all your tasks across projects
              </p>
            </div>
            <Button onClick={handleNewTask} size="lg" className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex items-center gap-3 flex-wrap bg-card border rounded-lg p-3 shadow-sm">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-0 bg-muted/30 focus-visible:ring-1"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 shadow-sm">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 px-1.5 min-w-[20px] h-5 bg-primary text-primary-foreground">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Status</Label>
                    <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Priority</Label>
                    <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Type</Label>
                    <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
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

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Assignee</Label>
                    <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assignees</SelectItem>
                        {uniqueAssignees.map(assignee => (
                          <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setFilterStatus("all");
                        setFilterPriority("all");
                        setFilterType("all");
                        setFilterAssignee("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary bg-gradient-to-br from-card to-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-3xl font-bold text-foreground">{allTasks.length}</p>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-success bg-gradient-to-br from-card to-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-foreground">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">{Math.round((completedTasks / allTasks.length) * 100)}% complete</p>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-destructive bg-gradient-to-br from-card to-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">High Priority</p>
              <p className="text-3xl font-bold text-foreground">{highPriorityTasks}</p>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-warning bg-gradient-to-br from-card to-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-foreground">{onTrackTasks}</p>
              <p className="text-xs text-muted-foreground">Active tasks</p>
            </div>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="overflow-hidden shadow-sm">
          <div className="p-6 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">All Tasks</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Showing {filteredTasks.length} of {allTasks.length} tasks
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y">
            {viewMode === "list" ? (
              <>
                <div className="bg-muted/30 px-6 py-3 border-b">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <div className="col-span-4">Task</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-2">Assignee</div>
                    <div className="col-span-2">Due Date</div>
                  </div>
                </div>
                {filteredTasks.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-muted">
                        <CheckSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">No tasks found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activeFiltersCount > 0 ? "Try adjusting your filters" : "Create your first task to get started"}
                        </p>
                      </div>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setFilterStatus("all");
                            setFilterPriority("all");
                            setFilterType("all");
                            setFilterAssignee("all");
                            setSearchQuery("");
                          }}
                        >
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {filteredTasks.map(({ task, project }) => (
                      <div 
                        key={task.id} 
                        onClick={() => handleTaskClick(task, project)}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-accent/50 transition-all duration-200 group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
                      >
                        <div className="col-span-4 flex items-center gap-3">
                          <button
                            onClick={(e) => handleToggleComplete(task.id, project.id, e)}
                            className="flex-shrink-0 hover:scale-110 transition-transform"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              "font-medium text-foreground group-hover:text-primary transition-colors truncate",
                              task.status === "done" && "line-through opacity-60"
                            )}>
                              {task.name}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{project.title}</p>
                          </div>
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          <StatusBadge status={task.status} />
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                            <Flag className="h-3 w-3" />
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                        
                        <div className="col-span-2 flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                            <span className="text-xs font-medium text-primary">
                              {task.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-sm text-foreground truncate">{task.assignee}</span>
                        </div>
                        
                        <div className="col-span-2 flex items-center gap-2">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTasks.length === 0 ? (
                    <div className="col-span-full px-4 py-16 text-center">
                    <p>No tasks found</p>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => {
                          setFilterStatus("all");
                          setFilterPriority("all");
                          setFilterType("all");
                          setFilterAssignee("all");
                          setSearchQuery("");
                        }}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredTasks.map(({ task, project }) => (
                    <div key={task.id} onClick={() => handleTaskClick(task, project)} className="block group">
                      <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <button
                            onClick={(e) => handleToggleComplete(task.id, project.id, e)}
                            className="flex-shrink-0 hover:scale-110 transition-transform mt-0.5"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1",
                              task.status === "done" && "line-through opacity-60"
                            )}>
                              {task.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{project.title}</p>
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
                   ))
                )}
                </div>
              </div>
            )}
          </div>
        </Card>

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

                  <Separator />

                  {/* Dependencies */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Dependencies
                      </Label>
                    </div>
                    
                    {selectedTask.task.dependencies && selectedTask.task.dependencies.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {selectedTask.task.dependencies.map(depId => {
                          const allTasks = tasksList.flatMap(p => p.tasks.map(t => ({ ...t, projectTitle: p.title })));
                          const depTask = allTasks.find(t => t.id === depId);
                          return depTask ? (
                            <div key={depId} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={depTask.status} />
                                  <span className="font-medium">{depTask.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{depTask.projectTitle}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoveDependency(depId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Select value={newDependency} onValueChange={setNewDependency}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add dependency..." />
                        </SelectTrigger>
                        <SelectContent>
                          {tasksList.flatMap(p => 
                            p.tasks
                              .filter(t => t.id !== selectedTask.task.id)
                              .map(t => (
                                <SelectItem key={t.id} value={String(t.id)}>
                                  {t.name} ({p.title})
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        onClick={handleAddDependency}
                        disabled={!newDependency}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground flex items-center gap-2">
                        <ListChecks className="h-4 w-4" />
                        Subtasks
                      </Label>
                    </div>
                    
                    {selectedTask.task.subtasks && selectedTask.task.subtasks.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {selectedTask.task.subtasks.map(subtaskId => {
                          const allTasks = tasksList.flatMap(p => p.tasks);
                          const subtask = allTasks.find(t => t.id === subtaskId);
                          return subtask ? (
                            <div key={subtaskId} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                              <div className="flex items-center gap-2 flex-1">
                                <StatusBadge status={subtask.status} />
                                <span className="font-medium">{subtask.name}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoveSubtask(subtaskId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add subtask..."
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={handleAddSubtask}
                        disabled={!newSubtask.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Comments */}
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comments
                    </Label>
                    
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
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {comments[selectedTask.task.id]?.length > 0 ? (
                        comments[selectedTask.task.id].map(comment => (
                          <div key={comment.id} className="p-3 border rounded-lg space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{comment.user}</span>
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
                            <p className="text-sm text-foreground pl-8">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                      )}
                    </div>
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