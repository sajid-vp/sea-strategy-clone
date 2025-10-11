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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Users, Clock, MapPin, FolderKanban } from "lucide-react";
import { activities } from "@/data/activitiesData";
import { toast } from "sonner";

const Activities = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredActivities = activities.filter((activity) => {
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    const matchesFrequency = frequencyFilter === "all" || activity.frequency === frequencyFilter;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesFrequency && matchesSearch;
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Activities</h1>
            <p className="text-muted-foreground">
              Manage recurring meetings, operations, and support activities
            </p>
          </div>
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
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>
          <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-4">
          {filteredActivities.map((activity) => (
            <Link key={activity.id} to={`/activities/${activity.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
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
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No activities found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Activities;
