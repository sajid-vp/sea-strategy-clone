import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, User, Users, Calendar, Target, Plus, MessageSquare, Send } from "lucide-react";
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
  
  // Find the initiative, its parent objective, and parent goal
  let initiative;
  let parentObjective;
  let parentGoal;
  
  for (const goal of goals) {
    for (const objective of goal.objectives) {
      const found = objective.initiatives.find(i => i.id.toString() === id);
      if (found) {
        initiative = found;
        parentObjective = objective;
        parentGoal = goal;
        break;
      }
    }
    if (initiative) break;
  }

  if (!initiative || !parentObjective || !parentGoal) {
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

  // Calculate progress (example: based on KPI status)
  const totalKpis = initiative.kpis.length;
  const onTrackKpis = initiative.kpis.filter(k => k.status === "in-progress").length;
  const progress = totalKpis > 0 ? (onTrackKpis / totalKpis) * 100 : 0;

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
                <StatusBadge status={initiative.status} />
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {initiative.year}
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 w-full lg:w-auto">
                    <Plus className="h-4 w-4" />
                    Add KPI
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create KPI</DialogTitle>
                  <DialogDescription>
                    Add a new Key Performance Indicator to track progress
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleKpiSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-title">Title *</Label>
                    <Input
                      id="kpi-title"
                      placeholder="Title"
                      value={kpiFormData.title}
                      onChange={(e) => setKpiFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpi-description">Description</Label>
                    <Textarea
                      id="kpi-description"
                      placeholder="Description"
                      value={kpiFormData.description}
                      onChange={(e) => setKpiFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tracking-method">Tracking Method</Label>
                      <Select 
                        value={kpiFormData.trackingMethod} 
                        onValueChange={(value) => setKpiFormData(prev => ({ ...prev, trackingMethod: value }))}
                      >
                        <SelectTrigger id="tracking-method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reporting-frequency">Reporting Frequency</Label>
                      <Select 
                        value={kpiFormData.reportingFrequency} 
                        onValueChange={(value) => setKpiFormData(prev => ({ ...prev, reportingFrequency: value }))}
                      >
                        <SelectTrigger id="reporting-frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reporting-type">Reporting Type</Label>
                      <Select 
                        value={kpiFormData.reportingType} 
                        onValueChange={(value) => setKpiFormData(prev => ({ ...prev, reportingType: value }))}
                      >
                        <SelectTrigger id="reporting-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Number">Number</SelectItem>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                          <SelectItem value="Currency">Currency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reporting-unit">Reporting Unit</Label>
                      <Input
                        id="reporting-unit"
                        placeholder="%"
                        value={kpiFormData.reportingUnit}
                        onChange={(e) => setKpiFormData(prev => ({ ...prev, reportingUnit: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target">Target</Label>
                      <Input
                        id="target"
                        placeholder="100"
                        value={kpiFormData.target}
                        onChange={(e) => setKpiFormData(prev => ({ ...prev, target: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create KPI
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Parent Goal */}
          <Card className="p-6 bg-muted/50 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Strategic Goal
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">{parentGoal.title}</div>
                <div className="text-sm text-muted-foreground">
                  {parentGoal.description}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Initiative Owner */}
        <Card className="p-6 mb-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Initiative Owner</div>
                <div className="text-2xl font-bold text-foreground">{initiative.owner}</div>
                <div className="text-sm text-muted-foreground">Project Lead</div>
              </div>
            </div>
            <StatusBadge status={initiative.status} />
          </div>
        </Card>

        {/* Contributors */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-2.5">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Contributors ({initiative.team.length})</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {initiative.team.map((member, idx) => (
              <div
                key={idx}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="font-medium text-foreground">{member}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Supporting Goals */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-muted-foreground mb-1">Supporting Goal</div>
              <div className="text-xl font-bold text-foreground mb-2">{parentGoal.title}</div>
              <div className="text-sm text-muted-foreground mb-3">{parentGoal.description}</div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Goal Period:</span>
                  <span className="font-semibold text-foreground">{parentGoal.startYear}-{parentGoal.endYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Target Year:</span>
                  <span className="font-semibold text-foreground">{initiative.year}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* KPIs for the Initiative */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              KPIs for the Initiative ({initiative.kpis.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              {onTrackKpis}/{totalKpis} on track
            </div>
          </div>
          <div className="space-y-3">
            {initiative.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground">{kpi.name}</div>
                </div>
                <StatusBadge status={kpi.status} />
              </div>
            ))}
          </div>
        </Card>

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
