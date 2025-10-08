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
import { CheckSquare, List, BarChart3, Clock, Users, Plus, LayoutGrid } from "lucide-react";

type Task = {
  id: number;
  name: string;
  status: "completed" | "on-track" | "at-risk" | "not-started" | "off-track";
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
        status: "completed" as const,
        assignee: "John Smith",
        dueDate: "2025-02-15",
        priority: "high" as const,
      },
      {
        id: 2,
        name: "Policy Documentation",
        status: "on-track" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-04-30",
        priority: "high" as const,
      },
      {
        id: 3,
        name: "Security Controls Implementation",
        status: "on-track" as const,
        assignee: "Mike Chen",
        dueDate: "2025-05-31",
        priority: "medium" as const,
      },
      {
        id: 4,
        name: "Internal Audit",
        status: "not-started" as const,
        assignee: "John Smith",
        dueDate: "2025-06-15",
        priority: "medium" as const,
      },
      {
        id: 5,
        name: "Certification Audit",
        status: "not-started" as const,
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
        status: "completed" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-03-01",
        priority: "high" as const,
      },
      {
        id: 7,
        name: "Vendor Selection",
        status: "completed" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-03-31",
        priority: "high" as const,
      },
      {
        id: 8,
        name: "Hardware Installation",
        status: "on-track" as const,
        assignee: "Emma Wilson",
        dueDate: "2025-06-30",
        priority: "medium" as const,
      },
      {
        id: 9,
        name: "Software Integration",
        status: "at-risk" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-07-31",
        priority: "high" as const,
      },
      {
        id: 10,
        name: "Testing & Deployment",
        status: "not-started" as const,
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
        status: "completed" as const,
        assignee: "Lisa Anderson",
        dueDate: "2025-02-28",
        priority: "high" as const,
      },
      {
        id: 12,
        name: "Backend API Development",
        status: "off-track" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-05-15",
        priority: "high" as const,
      },
      {
        id: 13,
        name: "Frontend Development",
        status: "at-risk" as const,
        assignee: "Lisa Anderson",
        dueDate: "2025-06-15",
        priority: "high" as const,
      },
      {
        id: 14,
        name: "Integration Testing",
        status: "not-started" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-06-30",
        priority: "medium" as const,
      },
      {
        id: 15,
        name: "Beta Testing",
        status: "not-started" as const,
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
  const completedTasks = allTasks.filter(t => t.status === "completed").length;
  const onTrackTasks = allTasks.filter(t => t.status === "on-track").length;
  const atRiskTasks = allTasks.filter(t => t.status === "at-risk").length;
  const notStartedTasks = allTasks.filter(t => t.status === "not-started").length;
  const highPriorityTasks = allTasks.filter(t => t.priority === "high").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
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
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {allTasks.map((task) => (
                <Link key={task.id} to={`/tasks/${task.id}`} className="block">
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground flex-1">{task.name}</h3>
                      <StatusBadge 
                        status={task.status === "completed" ? "on-track" : 
                                task.status === "not-started" ? "off-track" : 
                                task.status} 
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Assignee:</span>
                        <span className="font-medium">{task.assignee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <span className={`font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignee" className="space-y-6">
            {Array.from(new Set(allTasks.map(t => t.assignee))).map((assignee) => {
              const assigneeTasks = allTasks.filter(t => t.assignee === assignee);
              
              return (
                <div key={assignee} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{assignee}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({assigneeTasks.length} tasks)
                    </span>
                  </div>

                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }>
                    {assigneeTasks.map((task) => (
                      <Link key={task.id} to={`/tasks/${task.id}`} className="block">
                        <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-foreground flex-1">{task.name}</h3>
                            <StatusBadge 
                              status={task.status === "completed" ? "on-track" : 
                                      task.status === "not-started" ? "off-track" : 
                                      task.status} 
                            />
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Due Date:</span>
                              <span className="font-medium">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Priority:</span>
                              <span className={`font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
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

          <TabsContent value="project" className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{project.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    ({project.tasks.length} tasks)
                  </span>
                </div>

                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
                }>
                  {project.tasks.map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`} className="block">
                      <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-foreground flex-1">{task.name}</h3>
                          <StatusBadge 
                            status={task.status === "completed" ? "on-track" : 
                                    task.status === "not-started" ? "off-track" : 
                                    task.status} 
                          />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Assignee:</span>
                            <span className="font-medium">{task.assignee}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Priority:</span>
                            <span className={`font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="priority" className="space-y-6">
            {["high", "medium", "low"].map((priority) => {
              const priorityTasks = allTasks.filter(t => t.priority === priority);
              
              if (priorityTasks.length === 0) return null;
              
              return (
                <div key={priority} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-lg font-semibold capitalize ${getPriorityColor(priority)}`}>
                      {priority} Priority
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      ({priorityTasks.length} tasks)
                    </span>
                  </div>

                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }>
                    {priorityTasks.map((task) => (
                      <Link key={task.id} to={`/tasks/${task.id}`} className="block">
                        <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-foreground flex-1">{task.name}</h3>
                            <StatusBadge 
                              status={task.status === "completed" ? "on-track" : 
                                      task.status === "not-started" ? "off-track" : 
                                      task.status} 
                            />
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Assignee:</span>
                              <span className="font-medium">{task.assignee}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Due Date:</span>
                              <span className="font-medium">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Tasks;