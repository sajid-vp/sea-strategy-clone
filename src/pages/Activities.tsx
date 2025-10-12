import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatCard } from "@/components/StatCard";
import { Plus, Calendar, Users, Clock, MapPin, FolderKanban, List, BarChart3, Activity, TrendingUp } from "lucide-react";
import { activities } from "@/data/activitiesData";
import { toast } from "sonner";

const Activities = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    type: "meeting",
    frequency: "weekly",
    owner: "",
    participants: "",
    startDate: "",
    duration: "",
    location: "",
  });

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.owner || !newActivity.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Activity added successfully!");
    setIsAddActivityOpen(false);
    setNewActivity({
      title: "",
      description: "",
      type: "meeting",
      frequency: "weekly",
      owner: "",
      participants: "",
      startDate: "",
      duration: "",
      location: "",
    });
  };

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

  // Calculate statistics
  const totalActivities = activities.length;
  const activeActivities = activities.filter(a => a.status === "in-progress").length;
  const completedActivities = activities.filter(a => a.status === "done").length;
  const todoActivities = activities.filter(a => a.status === "todo").length;

  const meetingCount = activities.filter(a => a.type === "meeting").length;
  const operationalCount = activities.filter(a => a.type === "operational").length;
  const supportCount = activities.filter(a => a.type === "support").length;
  const reviewCount = activities.filter(a => a.type === "review").length;

  // Group activities by owner
  const activitiesByOwner = activities.reduce((acc, activity) => {
    if (!acc[activity.owner]) {
      acc[activity.owner] = [];
    }
    acc[activity.owner].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  // Group activities by type
  const activitiesByType = activities.reduce((acc, activity) => {
    if (!acc[activity.type]) {
      acc[activity.type] = [];
    }
    acc[activity.type].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  const renderActivityCard = (activity: typeof activities[0]) => (
    <Link key={activity.id} to={`/activities/${activity.id}`}>
      <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
        viewMode === "list" ? "" : "h-full"
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">
                {activity.title}
              </h3>
              <StatusBadge status={activity.status} />
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getTypeColor(activity.type)}`}>
                {activity.type}
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-muted text-muted-foreground">
                {getFrequencyLabel(activity.frequency)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {activity.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{activity.owner}</span>
              </div>
              {activity.project && (
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  <span>{activity.project}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Next: {activity.nextOccurrence}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{activity.duration} min</span>
              </div>
              {activity.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{activity.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Activities</h1>
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
            title="Total Activities"
            value={totalActivities}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Activity className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="Activity Status"
            value=""
            className="border-l-4 border-l-secondary-foreground"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Active:</span>
                </div>
                <span className="font-semibold">{activeActivities}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted" />
                  <span className="text-muted-foreground">To Do:</span>
                </div>
                <span className="font-semibold">{todoActivities}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-muted-foreground">Completed:</span>
                </div>
                <span className="font-semibold">{completedActivities}</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Activity Types"
            value=""
            className="border-l-4 border-l-secondary-foreground"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meetings:</span>
                <span className="font-semibold">{meetingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Operational:</span>
                <span className="font-semibold">{operationalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Support:</span>
                <span className="font-semibold">{supportCount}</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Active Owners"
            value={Object.keys(activitiesByOwner).length}
            subtitle="Contributors"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Activities */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
              <TabsTrigger value="type">By Type</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Activity</DialogTitle>
                    <DialogDescription>
                      Create a new recurring activity or one-time event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Activity Title *</Label>
                      <Input
                        id="title"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                        placeholder="Enter activity title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        placeholder="Enter activity description"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select value={newActivity.type} onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="operational">Operational</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="frequency">Frequency *</Label>
                        <Select value={newActivity.frequency} onValueChange={(value) => setNewActivity({ ...newActivity, frequency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="one-time">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="owner">Owner *</Label>
                        <Input
                          id="owner"
                          value={newActivity.owner}
                          onChange={(e) => setNewActivity({ ...newActivity, owner: e.target.value })}
                          placeholder="Activity owner"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="participants">Participants</Label>
                        <Input
                          id="participants"
                          value={newActivity.participants}
                          onChange={(e) => setNewActivity({ ...newActivity, participants: e.target.value })}
                          placeholder="Comma-separated names"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newActivity.startDate}
                          onChange={(e) => setNewActivity({ ...newActivity, startDate: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newActivity.duration}
                          onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                          placeholder="60"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                        placeholder="Conference room or virtual"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddActivity}>Add Activity</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
              {activities.map(renderActivityCard)}
            </div>
          </TabsContent>

          {/* By Owner Tab */}
          <TabsContent value="owner" className="space-y-6">
            {Object.entries(activitiesByOwner).map(([owner, ownerActivities]) => (
              <div key={owner}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {owner}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {ownerActivities.length} {ownerActivities.length === 1 ? "activity" : "activities"}
                  </span>
                </div>
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {ownerActivities.map(renderActivityCard)}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* By Type Tab */}
          <TabsContent value="type" className="space-y-6">
            {Object.entries(activitiesByType).map(([type, typeActivities]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground capitalize flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-primary" />
                    {type}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {typeActivities.length} {typeActivities.length === 1 ? "activity" : "activities"}
                  </span>
                </div>
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {typeActivities.map(renderActivityCard)}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Activities;
