import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Users, Calendar, Target, Plus, MessageSquare, Send, FolderKanban, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { initiatives } from "@/data/projectsData";
import { programs, getProgramsByInitiative } from "@/data/programsData";
import { getActivitiesByProgram } from "@/data/activitiesData";

// Data structure with objectives
const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    objectives: [
      {
        id: 1,
        title: "Infrastructure Modernization",
        initiatives: [
            {
              id: 1,
              title: "Develop and Implement IT infrastructure",
              year: 2025,
              status: "in-progress" as const,
              owner: "John Smith",
              team: ["Sarah Johnson", "Mike Chen", "Emma Wilson"],
              kpis: [
                { name: "ISO 27001 Implementation", status: "in-progress" as const },
                { name: "Smart Campus Infrastructure", status: "in-progress" as const },
                { name: "Child Safety Geo-tagging", status: "in-progress" as const },
              ],
            },
        ],
      },
      {
        id: 2,
        title: "Digital Transformation",
        initiatives: [
            {
              id: 2,
              title: "Digital Transformation initiatives",
              year: 2025,
              status: "blocked" as const,
              owner: "David Brown",
              team: ["Lisa Anderson", "Tom Martinez"],
              kpis: [
                { name: "Student Information System Adoption", status: "in-progress" as const },
                { name: "AI-Driven Business Intelligence Dashboards", status: "in-progress" as const },
                { name: "Unified Mobile App Development", status: "blocked" as const },
              ],
            },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Educational Innovation",
    objectives: [
      {
        id: 3,
        title: "Teaching Enhancement",
        initiatives: [
            {
              id: 3,
              title: "Support Teaching & Learning",
              year: 2025,
              status: "blocked" as const,
              owner: "Rachel Green",
              team: ["Chris Taylor", "Jennifer Lee"],
              kpis: [
                { name: "Education Platform Enhancement", status: "blocked" as const },
                { name: "Nursery Management System", status: "in-progress" as const },
              ],
            },
        ],
      },
      {
        id: 4,
        title: "Service Excellence",
        initiatives: [
            {
              id: 4,
              title: "Increase satisfaction with IT services",
              year: 2026,
              status: "in-progress" as const,
              owner: "Michael Scott",
              team: ["Pam Beesly", "Jim Halpert", "Dwight Schrute"],
              kpis: [
                { name: "IT Services Employee Satisfaction", status: "in-progress" as const },
                { name: "Digital Learning Experience", status: "in-progress" as const },
                { name: "SIS Stakeholder Satisfaction", status: "in-progress" as const },
              ],
            },
        ],
      },
    ],
  },
];

const InitiativeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kpiFormData, setKpiFormData] = useState({
    title: "",
    description: "",
    trackingMethod: "Manual",
    reportingFrequency: "Quarterly",
    reportingType: "Number",
    reportingUnit: "%",
    target: "",
    status: "in-progress" as "in-progress" | "blocked",
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Array<{id: number; user: string; text: string; timestamp: string}>>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  
  // Find the initiative from the data
  const initiative = initiatives.find(i => i.id.toString() === id);
  
  if (!initiative) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Initiative not found</h1>
            <Link to="/initiatives">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Initiatives
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Get related data
  const initiativePrograms = getProgramsByInitiative(initiative.id);
  const initiativeProjects = initiative.projects || [];
  
  // Get all activities from all programs
  const initiativeActivities = initiativePrograms.flatMap(program => 
    getActivitiesByProgram(program.id)
  );

  // Calculate progress based on projects
  const totalProjects = initiativeProjects.length;
  const avgProgress = totalProjects > 0 
    ? initiativeProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects 
    : 0;

  const handleKpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kpiFormData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a KPI title",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally save to a database
    toast({
      title: "Success",
      description: "KPI created successfully",
    });

    // Reset form and close dialog
    setKpiFormData({
      title: "",
      description: "",
      trackingMethod: "Manual",
      reportingFrequency: "Quarterly",
      reportingType: "Number",
      reportingUnit: "%",
      target: "",
      status: "in-progress",
    });
    setIsDialogOpen(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: "Current User",
      text: newComment,
      timestamp: new Date().toISOString()
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been posted"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Back button */}
        <Link to="/initiatives">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Initiatives
          </Button>
        </Link>

        {/* Initiative Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {initiative.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <Target className="h-3 w-3" />
                  Initiative #{initiative.id}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="gap-2 w-full lg:w-auto"
                onClick={() => setIsCommentsOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Programs</div>
              <div className="text-2xl font-bold text-foreground">{initiativePrograms.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Projects</div>
              <div className="text-2xl font-bold text-foreground">{initiativeProjects.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Activities</div>
              <div className="text-2xl font-bold text-foreground">{initiativeActivities.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg Progress</div>
              <div className="text-2xl font-bold text-foreground">{Math.round(avgProgress)}%</div>
            </Card>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            {initiativePrograms.length > 0 ? (
              initiativePrograms.map((program) => (
                <Link key={program.id} to={`/programs/${program.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{program.title}</h3>
                          <Badge variant="outline" className="text-xs">{program.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                      </div>
                      <StatusBadge status={program.status === "planned" ? "todo" : program.status === "active" ? "in-progress" : program.status === "on-hold" ? "blocked" : "done"} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Manager</p>
                        <p className="text-sm font-medium">{program.manager}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium">{program.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm font-medium">{new Date(program.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{program.progress}%</p>
                      </div>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No programs linked to this initiative yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {initiativeProjects.length > 0 ? (
              initiativeProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                          {project.code && <Badge variant="outline" className="text-xs">{project.code}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="text-sm font-medium">{project.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-sm font-medium">{project.progress}%</p>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No projects linked to this initiative yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            {initiativeActivities.length > 0 ? (
              initiativeActivities.map((activity) => (
                <Link key={activity.id} to={`/activities/${activity.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">{activity.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                      </div>
                      <StatusBadge status={activity.status} />
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
            ) : (
              <Card className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No activities linked to this initiative yet.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Comments Dialog */}
        <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Initiative Comments</DialogTitle>
              <DialogDescription>
                Discussion and updates for {initiative.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
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
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{comment.user}</span>
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
                      <p className="text-sm text-foreground pl-10">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default InitiativeDetail;
