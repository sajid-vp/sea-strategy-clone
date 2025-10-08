import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { ArrowLeft, User, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projects = [
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
        description: "Conduct comprehensive gap analysis to identify current state vs. ISO 27001 requirements",
        completedDate: "2025-02-10",
      },
      {
        id: 2,
        name: "Policy Documentation",
        status: "on-track" as const,
        assignee: "Sarah Johnson",
        dueDate: "2025-04-30",
        priority: "high" as const,
        description: "Create and document all required information security policies and procedures",
      },
      {
        id: 3,
        name: "Security Controls Implementation",
        status: "on-track" as const,
        assignee: "Mike Chen",
        dueDate: "2025-05-31",
        priority: "medium" as const,
        description: "Implement technical and organizational security controls as per ISO 27001 requirements",
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
        description: "Analyze and document all requirements for smart campus infrastructure",
        completedDate: "2025-02-28",
      },
      {
        id: 9,
        name: "Software Integration",
        status: "at-risk" as const,
        assignee: "Tom Martinez",
        dueDate: "2025-07-31",
        priority: "high" as const,
        description: "Integrate all software systems with the smart campus platform",
      },
    ],
  },
  {
    id: 3,
    title: "Unified Mobile App Development",
    tasks: [
      {
        id: 12,
        name: "Backend API Development",
        status: "off-track" as const,
        assignee: "Chris Taylor",
        dueDate: "2025-05-15",
        priority: "high" as const,
        description: "Develop RESTful APIs for mobile app backend services",
      },
      {
        id: 13,
        name: "Frontend Development",
        status: "at-risk" as const,
        assignee: "Lisa Anderson",
        dueDate: "2025-06-15",
        priority: "high" as const,
        description: "Build mobile app frontend using React Native",
      },
    ],
  },
];

const TaskDetail = () => {
  const { id } = useParams();
  
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
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "on-track":
        return <Clock className="h-5 w-5 text-success" />;
      case "at-risk":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "off-track":
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
              <StatusBadge 
                status={task.status === "completed" ? "on-track" : 
                        task.status === "not-started" ? "off-track" : 
                        task.status} 
              />
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

          {task.status === "completed" && task.completedDate && (
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
      </main>
    </div>
  );
};

export default TaskDetail;