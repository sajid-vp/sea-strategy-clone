import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { ArrowLeft, Users, User, Calendar, CheckCircle2, DollarSign, Target, Building2, UserCheck, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
        budget: "AED 1,000.00",
        department: "IT Security",
        kpis: ["Security Compliance Rate", "Incident Response Time", "Policy Adherence"],
        stakeholders: ["CTO", "Legal Team", "Compliance Officer"],
        description: "Implement ISO 27001 information security management system across the organization to ensure data protection and compliance.",
        milestones: [
          { id: 1, name: "Gap Analysis", dueDate: "2025-02-15", progress: 100, status: "completed" as const },
          { id: 2, name: "Policy Documentation", dueDate: "2025-03-30", progress: 80, status: "on-track" as const },
          { id: 3, name: "Security Controls Implementation", dueDate: "2025-05-15", progress: 60, status: "on-track" as const },
          { id: 4, name: "Internal Audit", dueDate: "2025-06-15", progress: 0, status: "not-started" as const },
          { id: 5, name: "Certification Audit", dueDate: "2025-06-30", progress: 0, status: "not-started" as const },
        ],
        tasks: [
          { id: 1, name: "Gap Analysis", status: "completed" as const },
          { id: 2, name: "Policy Documentation", status: "on-track" as const },
          { id: 3, name: "Security Controls Implementation", status: "on-track" as const },
          { id: 4, name: "Internal Audit", status: "not-started" as const },
          { id: 5, name: "Certification Audit", status: "not-started" as const },
        ],
        activities: [
          { id: 1, user: "John Smith", action: "updated milestone", detail: "Policy Documentation", timestamp: "2025-01-08 10:30" },
          { id: 2, user: "Sarah Johnson", action: "completed task", detail: "Gap Analysis", timestamp: "2025-01-07 15:45" },
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
        budget: "AED 2,500.00",
        department: "IT Operations",
        kpis: ["System Uptime", "Energy Efficiency", "User Satisfaction"],
        stakeholders: ["Facilities Manager", "Campus Director", "Sustainability Team"],
        description: "Deploy smart campus infrastructure including IoT sensors, automated systems, and integrated management platform.",
        milestones: [
          { id: 6, name: "Requirements Analysis", dueDate: "2025-02-28", progress: 100, status: "completed" as const },
          { id: 7, name: "Vendor Selection", dueDate: "2025-03-15", progress: 100, status: "completed" as const },
          { id: 8, name: "Hardware Installation", dueDate: "2025-06-15", progress: 50, status: "on-track" as const },
          { id: 9, name: "Software Integration", dueDate: "2025-07-31", progress: 30, status: "at-risk" as const },
          { id: 10, name: "Testing & Deployment", dueDate: "2025-08-31", progress: 0, status: "not-started" as const },
        ],
        tasks: [
          { id: 6, name: "Requirements Analysis", status: "completed" as const },
          { id: 7, name: "Vendor Selection", status: "completed" as const },
          { id: 8, name: "Hardware Installation", status: "on-track" as const },
          { id: 9, name: "Software Integration", status: "at-risk" as const },
          { id: 10, name: "Testing & Deployment", status: "not-started" as const },
        ],
        activities: [
          { id: 3, user: "Emma Wilson", action: "flagged issue", detail: "Software Integration delays", timestamp: "2025-01-08 09:15" },
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
        budget: "AED 1,800.00",
        department: "Digital Services",
        kpis: ["User Adoption Rate", "App Performance", "Feature Completion"],
        stakeholders: ["Student Affairs", "IT Director", "Marketing Team"],
        description: "Develop a unified mobile application that integrates all campus services and information for students, staff, and parents.",
        milestones: [
          { id: 11, name: "UI/UX Design", dueDate: "2025-02-28", progress: 100, status: "completed" as const },
          { id: 12, name: "Backend API Development", dueDate: "2025-04-30", progress: 40, status: "off-track" as const },
          { id: 13, name: "Frontend Development", dueDate: "2025-06-15", progress: 25, status: "at-risk" as const },
          { id: 14, name: "Integration Testing", dueDate: "2025-07-01", progress: 0, status: "not-started" as const },
          { id: 15, name: "Beta Testing", dueDate: "2025-07-15", progress: 0, status: "not-started" as const },
        ],
        tasks: [
          { id: 11, name: "UI/UX Design", status: "completed" as const },
          { id: 12, name: "Backend API Development", status: "off-track" as const },
          { id: 13, name: "Frontend Development", status: "at-risk" as const },
          { id: 14, name: "Integration Testing", status: "not-started" as const },
          { id: 15, name: "Beta Testing", status: "not-started" as const },
        ],
        activities: [
          { id: 4, user: "David Brown", action: "requested additional resources", detail: "Backend development team", timestamp: "2025-01-07 14:20" },
          { id: 5, user: "Lisa Anderson", action: "completed milestone", detail: "UI/UX Design", timestamp: "2025-01-06 11:30" },
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
        budget: "AED 3,200.00",
        department: "Analytics",
        kpis: ["Data Accuracy", "Insight Generation Rate", "User Engagement"],
        stakeholders: ["Executive Team", "Data Analysts", "Department Heads"],
        description: "Implement AI-powered business intelligence dashboards to provide real-time insights and predictive analytics for decision-making.",
        milestones: [
          { id: 16, name: "Data Source Integration", dueDate: "2025-04-15", progress: 70, status: "on-track" as const },
          { id: 17, name: "Dashboard Development", dueDate: "2025-06-30", progress: 35, status: "at-risk" as const },
          { id: 18, name: "AI Model Training", dueDate: "2025-08-15", progress: 20, status: "at-risk" as const },
          { id: 19, name: "User Training", dueDate: "2025-09-30", progress: 0, status: "not-started" as const },
        ],
        tasks: [
          { id: 16, name: "Data Source Integration", status: "on-track" as const },
          { id: 17, name: "Dashboard Development", status: "at-risk" as const },
          { id: 18, name: "AI Model Training", status: "at-risk" as const },
          { id: 19, name: "User Training", status: "not-started" as const },
        ],
        activities: [
          { id: 6, user: "Rachel Green", action: "updated progress", detail: "Data Source Integration at 70%", timestamp: "2025-01-08 08:00" },
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

  const completedMilestones = project.milestones.filter(m => m.status === "completed").length;

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
                      <UserCheck className="h-4 w-4 text-primary" />
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
                  <Activity className="h-4 w-4 text-primary" />
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