import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, TrendingUp, DollarSign, Users, Calendar, FolderKanban, AlertTriangle, FileText, BarChart3, Edit, Flag, Activity } from "lucide-react";
import { getProgramById } from "@/data/programsData";
import { initiatives } from "@/data/projectsData";
import { getActivitiesByProgram } from "@/data/activitiesData";

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = getProgramById(Number(id));
  
  if (!program) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Program Not Found</h2>
            <p className="text-muted-foreground mb-4">The program you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/programs")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const initiative = initiatives.find(i => i.id === program.initiativeId);
  const programProjects = initiative?.projects.filter(p => (p as any).programId === program.id) || [];
  const programActivities = getActivitiesByProgram(program.id);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/programs")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programs
        </Button>

        {/* Header Section */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FolderKanban className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">{program.title}</h1>
                <Badge variant="outline" className="text-xs">{program.code}</Badge>
                <StatusBadge status={program.status} />
              </div>
              <p className="text-muted-foreground mb-4">{program.description}</p>
            </div>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Program
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Initiative</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                <Link to={`/initiatives/${initiative?.id}`} className="hover:text-primary">
                  {initiative?.title}
                </Link>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Projects</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                {programProjects.length} projects
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {program.progress}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Budget</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {program.budget}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(program.startDate).toLocaleDateString()} - {program.endDate ? new Date(program.endDate).toLocaleDateString() : "Ongoing"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Information</CardTitle>
                    <CardDescription>Key details and metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Program Code</p>
                      <p className="font-semibold">{program.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <StatusBadge status={program.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                      <p className="font-semibold">{new Date(program.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">End Date</p>
                      <p className="font-semibold">{program.endDate ? new Date(program.endDate).toLocaleDateString() : "Ongoing"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Program Owner</p>
                      <p className="font-semibold">{program.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Program Manager</p>
                      <p className="font-semibold">{program.manager}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Scope</p>
                      <p className="text-sm">{program.scope}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Progress Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Overall Progress</span>
                          <span className="font-semibold">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {program.documents.map((doc) => (
                        <a key={doc.id} href={doc.url} className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Objectives Tab */}
          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Program Objectives
                </CardTitle>
                <CardDescription>Strategic objectives and expected outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {program.objectives.map((objective, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <Flag className="h-4 w-4 text-primary" />
                      </div>
                      <p className="flex-1">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Program Projects</h3>
                <p className="text-sm text-muted-foreground">{programProjects.length} projects under this program</p>
              </div>
              <Button variant="outline" size="sm">+ Add Project</Button>
            </div>

            {programProjects.length === 0 ? (
              <Card className="p-12 text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No projects linked to this program yet</p>
              </Card>
            ) : (
              programProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{project.title}</h4>
                          <StatusBadge status={project.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Program Activities</h3>
                <p className="text-sm text-muted-foreground">{programActivities.length} activities under this program</p>
              </div>
              <Button variant="outline" size="sm">+ Add Activity</Button>
            </div>

            {programActivities.length === 0 ? (
              <Card className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No activities linked to this program yet</p>
              </Card>
            ) : (
              programActivities.map((activity) => (
                <Link key={activity.id} to={`/activities/${activity.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <StatusBadge status={activity.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline" className="ml-2 text-xs">{activity.type}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="ml-2 font-medium capitalize">{activity.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="ml-2 font-medium">{activity.owner}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{activity.duration} min</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Program Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-accent/30">
                      <div className="font-semibold">{program.owner}</div>
                      <div className="text-xs text-muted-foreground">Program Owner</div>
                    </div>
                    <div className="p-3 border rounded-lg bg-accent/30">
                      <div className="font-semibold">{program.manager}</div>
                      <div className="text-xs text-muted-foreground">Program Manager</div>
                    </div>
                    {program.team.map((member, idx) => (
                      <div key={idx} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="font-medium">{member}</div>
                        <div className="text-xs text-muted-foreground">Team Member</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stakeholders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {program.stakeholders.map((stakeholder, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="font-medium">{stakeholder}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total Budget</div>
                    <div className="text-2xl font-bold">{program.budget}</div>
                  </div>
                  {program.actualBudget && (
                    <>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Actual Spent</div>
                        <div className="text-2xl font-bold">{program.actualBudget}</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Remaining</div>
                        <div className="text-2xl font-bold text-success">
                          ${(parseFloat(program.budget.replace(/[$,]/g, '')) - parseFloat(program.actualBudget.replace(/[$,]/g, ''))).toLocaleString()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      Program Risks
                    </CardTitle>
                    <CardDescription>Identified risks and mitigation strategies</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">+ Add Risk</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {program.risks.map((risk) => (
                    <div key={risk.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold flex-1">{risk.description}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getRiskColor(risk.impact)}>
                            Impact: {risk.impact}
                          </Badge>
                          <Badge variant="outline" className={getRiskColor(risk.likelihood)}>
                            Likelihood: {risk.likelihood}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-1">Mitigation Strategy:</p>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Key Performance Indicators
                </CardTitle>
                <CardDescription>Track program success metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.kpis.map((kpi, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{kpi.name}</h4>
                        <Badge variant="outline">
                          {kpi.current} / {kpi.target}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            {Math.round((parseFloat(kpi.current) / parseFloat(kpi.target)) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(parseFloat(kpi.current) / parseFloat(kpi.target)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProgramDetail;
