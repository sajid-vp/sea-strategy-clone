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
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { FolderKanban, List, BarChart3, TrendingUp, Users, Plus } from "lucide-react";
import { initiatives, getAllProjects } from "@/data/projectsData";

const Projects = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedYear, setSelectedYear] = useState("2025");
  
  const allProjects = getAllProjects();

  const totalProjects = initiatives.reduce((acc, init) => acc + init.projects.length, 0);
  const onTrackProjects = initiatives.reduce((acc, init) => 
    acc + init.projects.filter(p => p.status === "on-track").length, 0
  );
  const atRiskProjects = initiatives.reduce((acc, init) => 
    acc + init.projects.filter(p => p.status === "at-risk").length, 0
  );
  const offTrackProjects = initiatives.reduce((acc, init) => 
    acc + init.projects.filter(p => p.status === "off-track").length, 0
  );
  
  const avgProgress = Math.round(
    initiatives.reduce((acc, init) => 
      acc + init.projects.reduce((sum, p) => sum + p.progress, 0), 0
    ) / totalProjects
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
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
            title="Total Projects"
            value={totalProjects}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<FolderKanban className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="Project Status"
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
                <span className="font-semibold">{onTrackProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">At Risk:</span>
                </div>
                <span className="font-semibold">{atRiskProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Off Track:</span>
                </div>
                <span className="font-semibold">{offTrackProjects}</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Overall Progress"
            value={`${avgProgress}%`}
            className="border-l-4 border-l-secondary-foreground"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Average</div>
              <Progress value={avgProgress} className="h-2" />
            </div>
          </StatCard>

          <StatCard
            title="Active Teams"
            value={new Set(initiatives.flatMap(i => i.projects.flatMap(p => p.team))).size}
            subtitle="Contributors"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Projects */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
              <TabsTrigger value="initiative">By Initiative</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <FolderKanban className="h-4 w-4" />
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
          </div>

          <TabsContent value="overview">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {allProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block"
                >
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {project.title}
                        </h3>
                        <StatusBadge status={project.status} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="font-medium">{project.owner}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Team:</span>
                          <span className="font-medium">{project.team.length} members</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="owner" className="space-y-4">
            {Array.from(
              new Set(initiatives.flatMap(i => i.projects.map(p => p.owner)))
            ).map((owner) => {
              const ownerProjects = initiatives.flatMap(i => 
                i.projects.filter(p => p.owner === owner)
              );
              
              return (
                <div key={owner} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{owner}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({ownerProjects.length} projects)
                    </span>
                  </div>

                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }>
                    {ownerProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block"
                      >
                        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-2">
                                {project.title}
                              </h3>
                              <StatusBadge status={project.status} />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>

                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Team:</span>
                                <span className="font-medium">{project.team.length} members</span>
                              </div>
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

          <TabsContent value="initiative" className="space-y-6">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {initiative.title}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({initiative.projects.length} projects)
                  </span>
                </div>

                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
                }>
                  {initiative.projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="block"
                    >
                      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">
                              {project.title}
                            </h3>
                            <StatusBadge status={project.status} />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div className="pt-3 border-t space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="font-medium">{project.owner}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Team:</span>
                              <span className="font-medium">{project.team.length} members</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Projects;