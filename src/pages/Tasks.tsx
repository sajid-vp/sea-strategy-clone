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
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { CheckSquare, List, BarChart3, Clock, Users, Plus, LayoutGrid, AlertCircle, CheckCircle2, Circle, Clock3, User } from "lucide-react";

type Task = {
  id: number;
  name: string;
  status: "done" | "in-progress" | "in-review" | "todo" | "blocked";
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
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
      },
      {
        id: 2,
        name: "Policy Documentation",
        status: "in-progress" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-04-30",
        priority: "high" as const,
      },
      {
        id: 3,
        name: "Security Controls Implementation",
        status: "in-progress" as const,
        assignee: "Mike Chen",
        dueDate: "2025-05-31",
        priority: "medium" as const,
      },
      {
        id: 4,
        name: "Internal Audit",
        status: "todo" as const,
        assignee: "John Smith",
        dueDate: "2025-06-15",
        priority: "medium" as const,
      },
      {
        id: 5,
        name: "Certification Audit",
        status: "todo" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-06-30",
        priority: "high" as const,
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
      },
      {
        id: 7,
        name: "Vendor Selection",
        status: "done" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-03-31",
        priority: "high" as const,
      },
      {
        id: 8,
        name: "Hardware Installation",
        status: "in-progress" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-06-30",
        priority: "medium" as const,
      },
      {
        id: 9,
        name: "Software Integration",
        status: "in-review" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-07-31",
        priority: "high" as const,
      },
      {
        id: 10,
        name: "Testing & Deployment",
        status: "todo" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-08-31",
        priority: "medium" as const,
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
      },
      {
        id: 12,
        name: "Backend API Development",
        status: "blocked" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-05-15",
        priority: "high" as const,
      },
      {
        id: 13,
        name: "Frontend Development",
        status: "in-review" as const,
        assignee: "Lisa Anderson",
        dueDate: "2025-06-15",
        priority: "high" as const,
      },
      {
        id: 14,
        name: "Integration Testing",
        status: "todo" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-06-30",
        priority: "medium" as const,
      },
      {
        id: 15,
        name: "Beta Testing",
        status: "todo" as const,
        assignee: "David Brown",
        dueDate: "2025-07-15",
        priority: "low" as const,
      },
    ],
  },
];

const Tasks = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedYear, setSelectedYear] = useState("2025");

  const allTasks: Task[] = projects.flatMap(p => p.tasks);
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
    return projects.find(p => p.tasks.some(t => t.id === taskId));
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
              <Button className="gap-2">
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
                      <Link 
                        key={task.id} 
                        to={`/tasks/${task.id}`}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group"
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
                            {task.priority}
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
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTasks.map((task) => {
                  const project = getProjectForTask(task.id);
                  return (
                    <Link key={task.id} to={`/tasks/${task.id}`} className="block group">
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
                    </Link>
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
                          <Link key={task.id} to={`/tasks/${task.id}`} className="block group">
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
                          </Link>
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
                      <Link key={task.id} to={`/tasks/${task.id}`} className="block group">
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
                      </Link>
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
                            <Link 
                              key={task.id} 
                              to={`/tasks/${task.id}`}
                              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors group"
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
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {priorityTasks.map((task) => {
                        const project = getProjectForTask(task.id);
                        return (
                          <Link key={task.id} to={`/tasks/${task.id}`} className="block group">
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
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Tasks;