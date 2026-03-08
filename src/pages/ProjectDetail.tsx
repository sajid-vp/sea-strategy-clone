import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { ArrowLeft, Users, User, Calendar, CheckCircle2, Plus, AlertCircle, MessageSquare, Send, ListChecks, Clock, TrendingUp, DollarSign, AlertTriangle, FileText, Link2, BarChart3, Flag, Network, Download, ChevronDown, ChevronRight, Package, Target, Paperclip, ShieldCheck, Lock, Pencil, X, Trash2 } from "lucide-react";
import { AddRiskForm } from "@/components/forms/AddRiskForm";
import { AddIssueForm } from "@/components/forms/AddIssueForm";
import { AddDependencyForm } from "@/components/forms/AddDependencyForm";
import { AddMilestoneForm } from "@/components/forms/AddMilestoneForm";
import { AddDeliverableForm } from "@/components/forms/AddDeliverableForm";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { initiatives } from "@/data/projectsData";
import { getActivitiesByProject } from "@/data/activitiesData";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { id } = useParams();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false);
  const [isAddDependencyOpen, setIsAddDependencyOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddDeliverableOpen, setIsAddDeliverableOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<{ id: number; name: string } | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({});
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    assignee: "",
    priority: "medium",
    status: "todo",
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Array<{id: number; user: string; text: string; timestamp: string}>>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editSection, setEditSection] = useState<string | null>(null);
  const [editPurpose, setEditPurpose] = useState("");
  const [editObjectives, setEditObjectives] = useState<string[]>([]);
  const [editDeliverables, setEditDeliverables] = useState<string[]>([]);
  const [editScopeDesc, setEditScopeDesc] = useState("");
  const [editAssumptions, setEditAssumptions] = useState<string[]>([]);
  const [editConstraints, setEditConstraints] = useState<string[]>([]);
  

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

  const handleAddTask = () => {
    if (!newTask.name || !newTask.assignee) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Task added successfully!");
    setIsAddTaskOpen(false);
    setNewTask({
      name: "",
      description: "",
      assignee: "",
      priority: "medium",
      status: "todo",
    });
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
    toast.success("Comment added");
  };

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

  const completedMilestones = project.milestones.filter(m => m.status === "done").length;
  const completedTasks = project.tasks.filter(t => t.status === "done").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/30";
      case "medium":
        return "bg-warning/10 text-warning hover:bg-warning/20 border-warning/30";
      case "low":
        return "bg-muted text-muted-foreground hover:bg-muted/80";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
        <div className="mb-6">
          <Link to="/projects">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {project.title}
                </h1>
                <Badge variant="outline" className="text-xs">{(project as any).code || 'PRJ-001'}</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{project.description}</p>
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsCommentsOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <StatusBadge status={project.status} />
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Priority</span>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </div>
              <Badge variant="outline" className={getPriorityColor((project as any).priority || 'medium')}>
                {(project as any).priority || 'Medium'}
              </Badge>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{project.progress}%</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Budget</span>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold">{project.budget}</p>
            </Card>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-11 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>

          {/* 1️⃣ Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Project Information - compact */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle>Project Information</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditSection('projectInfo')}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Project Name</p>
                    <p className="text-sm font-medium">{project.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Project Code</p>
                    <p className="text-sm font-medium">{(project as any).code || 'PRJ-001'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Project Type</p>
                    <p className="text-sm font-medium">{(project as any).projectType || 'Strategic'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{project.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="text-sm font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Owner</p>
                    <p className="text-sm font-medium">{project.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Manager</p>
                    <p className="text-sm font-medium">{(project as any).manager || project.owner}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground">Parent Initiative</p>
                    <Link to={`/initiatives/${parentInitiative.id}`}>
                      <p className="text-sm font-medium text-primary hover:underline">{parentInitiative.title}</p>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purpose / Business Justification */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Purpose / Business Justification
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditPurpose((project as any).purpose || ''); setEditSection('purpose'); }}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{(project as any).purpose || 'No purpose defined yet.'}</p>
              </CardContent>
            </Card>

            {/* Objectives & Key Deliverables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Project Objectives
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditObjectives([...((project as any).projectObjectives || [])]); setEditSection('objectives'); }}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {(project as any).projectObjectives?.length > 0 ? (
                    <ul className="space-y-2">
                      {(project as any).projectObjectives.map((obj: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No objectives defined yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Key Deliverables
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditDeliverables([...((project as any).keyDeliverables || [])]); setEditSection('deliverables'); }}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {(project as any).keyDeliverables?.length > 0 ? (
                    <ul className="space-y-2">
                      {(project as any).keyDeliverables.map((del: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {del}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No deliverables defined yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Project Scope */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Project Scope
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditScopeDesc((project as any).scope?.description || ''); setEditSection('scope'); }}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{(project as any).scope?.description || 'No scope defined yet.'}</p>
                {(project as any).scope?.attachments?.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Attachments</p>
                    <div className="space-y-1">
                      {(project as any).scope.attachments.map((att: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{att.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{att.uploadedDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assumptions & Constraints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Assumptions
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditAssumptions([...((project as any).assumptions || [])]); setEditSection('assumptions'); }}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {(project as any).assumptions?.length > 0 ? (
                    <ul className="space-y-2">
                      {(project as any).assumptions.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No assumptions documented.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Constraints
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditConstraints([...((project as any).constraints || [])]); setEditSection('constraints'); }}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {(project as any).constraints?.length > 0 ? (
                    <ul className="space-y-2">
                      {(project as any).constraints.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive/60 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No constraints documented.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Team & Stakeholders summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Team
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveTab('team')}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-accent/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Owner</p>
                      <p className="font-semibold text-sm">{project.owner}</p>
                    </div>
                    {project.team.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {member.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-sm">{member}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-primary" />
                    Stakeholders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.stakeholders.map((stakeholder, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {stakeholder.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-sm">{stakeholder}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestones Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary" />
                  Milestones
                </CardTitle>
                <CardDescription>{completedMilestones} of {project.milestones.length} completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={milestone.status} />
                        <div>
                          <p className="font-medium text-sm">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={milestone.progress} className="h-2 w-20" />
                        <span className="text-xs font-medium w-8 text-right">{milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Planned</p>
                    <p className="text-lg font-bold">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Actual</p>
                    <p className="text-lg font-bold">{(project as any).actualBudget || 'AED 0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-lg font-bold text-primary">
                      {(project as any).actualBudget ? 
                        `AED ${(parseFloat(project.budget.replace(/[^0-9.]/g, '')) - parseFloat((project as any).actualBudget.replace(/[^0-9.]/g, ''))).toFixed(2)}` : 
                        project.budget}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risks Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Risks
                </CardTitle>
                <CardDescription>{(project as any).risks?.length || 0} identified risks</CardDescription>
              </CardHeader>
              <CardContent>
                {(project as any).risks?.length > 0 ? (
                  <div className="space-y-2">
                    {(project as any).risks.map((risk: any) => (
                      <div key={risk.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{risk.description}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>Likelihood: <span className={`font-medium ${getRiskColor(risk.likelihood)}`}>{risk.likelihood}</span></span>
                            <span>Impact: <span className={`font-medium ${getRiskColor(risk.impact)}`}>{risk.impact}</span></span>
                          </div>
                        </div>
                        <Badge variant={risk.status === 'open' ? 'destructive' : 'secondary'} className="ml-2">
                          {risk.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No risks identified</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Dialogs */}
          {/* Purpose Edit Dialog */}
          <Dialog open={editSection === 'purpose'} onOpenChange={(open) => !open && setEditSection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Purpose / Business Justification</DialogTitle>
                <DialogDescription>Update the project's purpose and business justification.</DialogDescription>
              </DialogHeader>
              <Textarea value={editPurpose} onChange={(e) => setEditPurpose(e.target.value)} rows={5} placeholder="Enter purpose..." />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Purpose updated successfully"); setEditSection(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Objectives Edit Dialog */}
          <Dialog open={editSection === 'objectives'} onOpenChange={(open) => !open && setEditSection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Project Objectives</DialogTitle>
                <DialogDescription>Add, edit, or remove project objectives.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {editObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={obj} onChange={(e) => { const updated = [...editObjectives]; updated[idx] = e.target.value; setEditObjectives(updated); }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setEditObjectives(editObjectives.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditObjectives([...editObjectives, ''])}>
                <Plus className="h-3.5 w-3.5" /> Add Objective
              </Button>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Objectives updated successfully"); setEditSection(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Deliverables Edit Dialog */}
          <Dialog open={editSection === 'deliverables'} onOpenChange={(open) => !open && setEditSection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Key Deliverables</DialogTitle>
                <DialogDescription>Add, edit, or remove key deliverables.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {editDeliverables.map((del, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={del} onChange={(e) => { const updated = [...editDeliverables]; updated[idx] = e.target.value; setEditDeliverables(updated); }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setEditDeliverables(editDeliverables.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditDeliverables([...editDeliverables, ''])}>
                <Plus className="h-3.5 w-3.5" /> Add Deliverable
              </Button>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Deliverables updated successfully"); setEditSection(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Scope Edit Dialog */}
          <Dialog open={editSection === 'scope'} onOpenChange={(open) => !open && setEditSection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Project Scope</DialogTitle>
                <DialogDescription>Update the project scope description.</DialogDescription>
              </DialogHeader>
              <Textarea value={editScopeDesc} onChange={(e) => setEditScopeDesc(e.target.value)} rows={5} placeholder="Enter scope description..." />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Scope updated successfully"); setEditSection(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Assumptions Edit Dialog */}
          <Dialog open={editSection === 'assumptions'} onOpenChange={(open) => !open && setEditSection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Assumptions</DialogTitle>
                <DialogDescription>Add, edit, or remove project assumptions.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {editAssumptions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={item} onChange={(e) => { const updated = [...editAssumptions]; updated[idx] = e.target.value; setEditAssumptions(updated); }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setEditAssumptions(editAssumptions.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditAssumptions([...editAssumptions, ''])}>
                <Plus className="h-3.5 w-3.5" /> Add Assumption
              </Button>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Assumptions updated successfully"); setEditSection(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Constraints Edit Dialog */}
          <Dialog open={editSection === 'constraints'} onOpenChange={(open) => !open && setEditSection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Constraints</DialogTitle>
                <DialogDescription>Add, edit, or remove project constraints.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {editConstraints.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={item} onChange={(e) => { const updated = [...editConstraints]; updated[idx] = e.target.value; setEditConstraints(updated); }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setEditConstraints(editConstraints.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditConstraints([...editConstraints, ''])}>
                <Plus className="h-3.5 w-3.5" /> Add Constraint
              </Button>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditSection(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Constraints updated successfully"); setEditSection(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Objectives Tab */}
          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Project Objectives
                </CardTitle>
                <CardDescription>Specific project-level objectives</CardDescription>
              </CardHeader>
              <CardContent>
                {(project as any).projectObjectives?.length > 0 ? (
                  <div className="space-y-3">
                    {(project as any).projectObjectives.map((obj: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <p className="text-sm">{obj}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No project objectives defined yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2️⃣ Tasks & Activities Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-primary" />
                      Tasks
                    </CardTitle>
                    <CardDescription>Project tasks and assignments</CardDescription>
                  </div>
                  <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                          Create a new task with details and assignments
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="taskName">Task Name *</Label>
                          <Input
                            id="taskName"
                            value={newTask.name}
                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                            placeholder="Enter task name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="taskDescription">Description</Label>
                          <Textarea
                            id="taskDescription"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Enter task description"
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="assignee">Assignee *</Label>
                          <Input
                            id="assignee"
                            value={newTask.assignee}
                            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                            placeholder="Enter assignee name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                              <SelectTrigger>
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
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask}>Add Task</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.tasks.map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`}>
                      <div className="group border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-card">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {task.name}
                              </h4>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                <span>{task.assignee}</span>
                              </div>
                              {task.dependencies.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Link2 className="h-3.5 w-3.5" />
                                  <span>{task.dependencies.length} dependencies</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4️⃣ Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-primary" />
                      Milestones & Deliverables
                    </CardTitle>
                    <CardDescription>Key project milestones with trackable deliverables</CardDescription>
                  </div>
                  <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Milestone
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Milestone</DialogTitle>
                        <DialogDescription>
                          Create a new milestone with target dates and progress tracking
                        </DialogDescription>
                      </DialogHeader>
                      <AddMilestoneForm
                        onSuccess={() => setIsAddMilestoneOpen(false)}
                        onCancel={() => setIsAddMilestoneOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone) => {
                    const completedDeliverables = milestone.deliverables?.filter(d => d.status === "done").length || 0;
                    const totalDeliverables = milestone.deliverables?.length || 0;
                    const isExpanded = expandedMilestones[milestone.id] ?? true;
                    
                    return (
                      <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{milestone.name}</h4>
                              <StatusBadge status={milestone.status} />
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
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

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Collapsible
                              open={isExpanded}
                              onOpenChange={(open) => 
                                setExpandedMilestones(prev => ({ ...prev, [milestone.id]: open }))
                              }
                              className="flex-1"
                            >
                              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <Package className="h-4 w-4" />
                                Deliverables ({completedDeliverables}/{totalDeliverables} completed)
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent className="mt-3 space-y-2">
                                {milestone.deliverables && milestone.deliverables.length > 0 ? (
                                  milestone.deliverables.map((deliverable) => (
                                    <div
                                      key={deliverable.id}
                                      className="flex items-start gap-3 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm">{deliverable.name}</span>
                                          <StatusBadge status={deliverable.status} className="text-xs px-2 py-0.5" />
                                        </div>
                                        {deliverable.description && (
                                          <p className="text-xs text-muted-foreground">{deliverable.description}</p>
                                        )}
                                        {deliverable.completedDate && (
                                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Completed: {new Date(deliverable.completedDate).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground italic p-3 text-center bg-muted/30 rounded-md">
                                    No deliverables yet
                                  </p>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() => {
                              setSelectedMilestone({ id: milestone.id, name: milestone.name });
                              setIsAddDeliverableOpen(true);
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Deliverable
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Add Deliverable Dialog */}
            <Dialog open={isAddDeliverableOpen} onOpenChange={setIsAddDeliverableOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Deliverable</DialogTitle>
                  <DialogDescription>
                    Add a trackable deliverable to this milestone
                  </DialogDescription>
                </DialogHeader>
                {selectedMilestone && (
                  <AddDeliverableForm
                    milestoneId={selectedMilestone.id}
                    milestoneName={selectedMilestone.name}
                    onSuccess={() => {
                      setIsAddDeliverableOpen(false);
                      setSelectedMilestone(null);
                    }}
                    onCancel={() => {
                      setIsAddDeliverableOpen(false);
                      setSelectedMilestone(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>


          {/* 5️⃣ Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Project Activities</h3>
                <p className="text-sm text-muted-foreground">Recurring meetings, operations, and support activities</p>
              </div>
              <Link to="/activities">
                <Button variant="outline" size="sm">View All Activities</Button>
              </Link>
            </div>

            {(() => {
              const projectActivities = getActivitiesByProject(project.id);
              
              if (projectActivities.length === 0) {
                return (
                  <Card className="p-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No activities linked to this project yet</p>
                  </Card>
                );
              }

              const getTypeColor = (type: string) => {
                const colors = {
                  meeting: "bg-primary/10 text-primary border border-primary/20",
                  operational: "bg-secondary/10 text-secondary-foreground border border-secondary/20",
                  support: "bg-warning/10 text-warning border border-warning/20",
                  review: "bg-success/10 text-success border border-success/20",
                  planning: "bg-accent/10 text-accent-foreground border border-accent/20",
                };
                return colors[type as keyof typeof colors] || colors.meeting;
              };

              const getFrequencyLabel = (frequency: string) => {
                const labels = {
                  daily: "Daily",
                  weekly: "Weekly",
                  "bi-weekly": "Bi-weekly",
                  monthly: "Monthly",
                  quarterly: "Quarterly",
                  "one-time": "One-time",
                };
                return labels[frequency as keyof typeof labels] || frequency;
              };

              return projectActivities.map((activity) => (
                <Link key={activity.id} to={`/activities/${activity.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <StatusBadge status={activity.status} />
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                            {getFrequencyLabel(activity.frequency)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>{activity.owner}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{activity.participants.length} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Next: {activity.nextOccurrence}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{activity.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ));
            })()}
          </TabsContent>


          {/* 6️⃣ Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Team Members
                    </CardTitle>
                    <CardDescription>Project team and roles</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">+ Add</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-accent/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{project.owner}</p>
                        <p className="text-xs text-muted-foreground">Project Owner</p>
                      </div>
                    </div>
                  </div>
                  {project.team.map((member, idx) => (
                    <div key={idx} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member}</p>
                          <p className="text-xs text-muted-foreground">Team Member</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-primary" />
                      Stakeholders
                    </CardTitle>
                    <CardDescription>Key stakeholders and departments</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">+ Add</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.stakeholders.map((stakeholder, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {stakeholder.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <p className="font-medium">{stakeholder}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 7️⃣ Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Planned Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{project.budget}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary/60">
                <CardHeader>
                  <CardTitle className="text-lg">Actual Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{(project as any).actualBudget || 'AED 0.00'}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {(project as any).actualBudget ? 
                      `AED ${(parseFloat(project.budget.replace(/[^0-9.]/g, '')) - parseFloat((project as any).actualBudget.replace(/[^0-9.]/g, ''))).toFixed(2)}` : 
                      project.budget}
                  </p>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* 8️⃣ Risks & Issues Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Risks
                    </CardTitle>
                    <CardDescription>Potential risks and mitigation strategies</CardDescription>
                  </div>
                  <Dialog open={isAddRiskOpen} onOpenChange={setIsAddRiskOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">+ Add Risk</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Risk</DialogTitle>
                        <DialogDescription>
                          Identify and document potential risks for this project
                        </DialogDescription>
                      </DialogHeader>
                      <AddRiskForm 
                        onSuccess={() => setIsAddRiskOpen(false)}
                        onCancel={() => setIsAddRiskOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(project as any).risks?.length > 0 ? (
                    (project as any).risks.map((risk: any) => (
                      <div key={risk.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{risk.description}</h4>
                          <Badge variant={risk.status === 'open' ? 'destructive' : 'secondary'}>
                            {risk.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Likelihood: </span>
                            <span className={`font-medium ${getRiskColor(risk.likelihood)}`}>
                              {risk.likelihood}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impact: </span>
                            <span className={`font-medium ${getRiskColor(risk.impact)}`}>
                              {risk.impact}
                            </span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">Mitigation Strategy</p>
                          <p className="text-sm">{risk.mitigation}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Owner: {risk.owner}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No risks identified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Issues
                    </CardTitle>
                    <CardDescription>Current challenges and resolutions</CardDescription>
                  </div>
                  <Dialog open={isAddIssueOpen} onOpenChange={setIsAddIssueOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">+ Add Issue</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Issue</DialogTitle>
                        <DialogDescription>
                          Document issues and challenges affecting this project
                        </DialogDescription>
                      </DialogHeader>
                      <AddIssueForm 
                        onSuccess={() => setIsAddIssueOpen(false)}
                        onCancel={() => setIsAddIssueOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(project as any).issues?.length > 0 ? (
                    (project as any).issues.map((issue: any) => (
                      <div key={issue.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{issue.description}</h4>
                          <Badge variant={issue.status === 'open' ? 'destructive' : 'secondary'}>
                            {issue.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Resolution Plan</p>
                          <p className="text-sm">{issue.resolution}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Owner: {issue.owner}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No open issues</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 9️⃣ Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Documents & Attachments
                    </CardTitle>
                    <CardDescription>Project documentation and files</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">+ Upload</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(project as any).documents?.length > 0 ? (
                    (project as any).documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} • Uploaded by {doc.uploadedBy} on {doc.uploadedDate}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No documents uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* 1️⃣1️⃣ KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Key Performance Indicators
                    </CardTitle>
                    <CardDescription>Project success metrics and tracking</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">+ Add KPI</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.kpis.map((kpi, idx) => (
                    <Card key={idx} className="p-4">
                      <h4 className="font-semibold mb-2">{kpi}</h4>
                      <div className="space-y-2">
                        <Progress value={Math.random() * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">Target: 100% • Current: {Math.floor(Math.random() * 100)}%</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Task Completion</span>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{Math.floor((completedTasks / project.tasks.length) * 100)}%</p>
                <p className="text-xs text-muted-foreground mt-1">{completedTasks} of {project.tasks.length} tasks</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Milestone Progress</span>
                  <Flag className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{Math.floor((completedMilestones / project.milestones.length) * 100)}%</p>
                <p className="text-xs text-muted-foreground mt-1">{completedMilestones} of {project.milestones.length} milestones</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{project.progress}%</p>
                <p className="text-xs text-muted-foreground mt-1">On track</p>
              </Card>
            </div>
          </TabsContent>

          {/* 1️⃣2️⃣ Dependencies Tab */}
          <TabsContent value="dependencies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-primary" />
                      Dependencies & Links
                    </CardTitle>
                    <CardDescription>Related projects and cross-functional dependencies</CardDescription>
                  </div>
                  <Dialog open={isAddDependencyOpen} onOpenChange={setIsAddDependencyOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">+ Add Link</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Dependency / Link</DialogTitle>
                        <DialogDescription>
                          Link this project to other initiatives, projects, or tasks
                        </DialogDescription>
                      </DialogHeader>
                      <AddDependencyForm 
                        onSuccess={() => setIsAddDependencyOpen(false)}
                        onCancel={() => setIsAddDependencyOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(project as any).dependencies?.length > 0 ? (
                    (project as any).dependencies.map((dep: any) => (
                      <div key={dep.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{dep.type}</p>
                            <p className="font-semibold">{dep.project}</p>
                          </div>
                          <StatusBadge status={dep.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No dependencies defined</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Links</CardTitle>
                <CardDescription>Parent programs and initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-accent/30">
                  <div className="flex items-center gap-3">
                    <Network className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Parent Initiative</p>
                      <Link to={`/initiatives/${parentInitiative.id}`}>
                        <p className="font-semibold text-primary hover:underline">{parentInitiative.title}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Comments Dialog */}
        <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Project Comments</DialogTitle>
              <DialogDescription>
                Discussion and updates for {project.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
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

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map(comment => (
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
                  <p className="text-sm text-muted-foreground text-center py-8">No comments yet</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ProjectDetail;
