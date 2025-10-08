import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { ArrowLeft, Users, User, Calendar, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const initiatives = [
  {
    id: 1,
    title: "Develop and Implement IT infrastructure",
    projects: [
      {
        id: 1,
        title: "ISO 27001 Implementation",
        status: "on-track" as const,
        owner: "John Smith",
        team: ["Sarah Johnson", "Mike Chen"],
        progress: 75,
        startDate: "2025-01-15",
        endDate: "2025-06-30",
        description: "Implement ISO 27001 information security management system across the organization to ensure data protection and compliance.",
        tasks: [
          { id: 1, name: "Gap Analysis", status: "completed" as const },
          { id: 2, name: "Policy Documentation", status: "on-track" as const },
          { id: 3, name: "Security Controls Implementation", status: "on-track" as const },
          { id: 4, name: "Internal Audit", status: "not-started" as const },
          { id: 5, name: "Certification Audit", status: "not-started" as const },
        ],
      },
      {
        id: 2,
        title: "Smart Campus Infrastructure",
        status: "on-track" as const,
        owner: "Sarah Johnson",
        team: ["Emma Wilson", "Tom Martinez"],
        progress: 60,
        startDate: "2025-02-01",
        endDate: "2025-08-31",
        description: "Deploy smart campus infrastructure including IoT sensors, automated systems, and integrated management platform.",
        tasks: [
          { id: 6, name: "Requirements Analysis", status: "completed" as const },
          { id: 7, name: "Vendor Selection", status: "completed" as const },
          { id: 8, name: "Hardware Installation", status: "on-track" as const },
          { id: 9, name: "Software Integration", status: "at-risk" as const },
          { id: 10, name: "Testing & Deployment", status: "not-started" as const },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Digital Transformation initiatives",
    projects: [
      {
        id: 3,
        title: "Unified Mobile App Development",
        status: "off-track" as const,
        owner: "David Brown",
        team: ["Lisa Anderson", "Chris Taylor"],
        progress: 30,
        startDate: "2025-01-10",
        endDate: "2025-07-15",
        description: "Develop a unified mobile application that integrates all campus services and information for students, staff, and parents.",
        tasks: [
          { id: 11, name: "UI/UX Design", status: "completed" as const },
          { id: 12, name: "Backend API Development", status: "off-track" as const },
          { id: 13, name: "Frontend Development", status: "at-risk" as const },
          { id: 14, name: "Integration Testing", status: "not-started" as const },
          { id: 15, name: "Beta Testing", status: "not-started" as const },
        ],
      },
      {
        id: 4,
        title: "AI-Driven Business Intelligence",
        status: "at-risk" as const,
        owner: "Rachel Green",
        team: ["Jennifer Lee", "Michael Scott"],
        progress: 45,
        startDate: "2025-03-01",
        endDate: "2025-09-30",
        description: "Implement AI-powered business intelligence dashboards to provide real-time insights and predictive analytics for decision-making.",
        tasks: [
          { id: 16, name: "Data Source Integration", status: "on-track" as const },
          { id: 17, name: "Dashboard Development", status: "at-risk" as const },
          { id: 18, name: "AI Model Training", status: "at-risk" as const },
          { id: 19, name: "User Training", status: "not-started" as const },
        ],
      },
    ],
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  
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

  const completedTasks = project.tasks.filter(t => t.status === "completed").length;
  const taskProgress = Math.round((completedTasks / project.tasks.length) * 100);

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

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {project.title}
            </h1>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <StatusBadge status={project.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Parent Initiative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={`/initiatives/${parentInitiative.id}`}>
                <p className="font-semibold text-foreground hover:text-primary transition-colors">
                  {parentInitiative.title}
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Project Owner
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground">{project.owner}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Team Members
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {project.team.map((member, index) => (
                  <p key={index} className="text-sm text-foreground">{member}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Start Date:</span>
                <span className="font-medium">
                  {new Date(project.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">End Date:</span>
                <span className="font-medium">
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="text-2xl font-bold">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Project Tasks ({completedTasks}/{project.tasks.length} completed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Task Progress</span>
                <span className="font-semibold">{taskProgress}%</span>
              </div>
              <Progress value={taskProgress} className="h-2" />
            </div>
            
            <div className="space-y-2">
              {project.tasks.map((task) => (
                <Link key={task.id} to={`/tasks/${task.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <span className="font-medium text-foreground">{task.name}</span>
                    <StatusBadge 
                      status={task.status === "completed" ? "on-track" : 
                              task.status === "not-started" ? "off-track" : 
                              task.status} 
                    />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProjectDetail;