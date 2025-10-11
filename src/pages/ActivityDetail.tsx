import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, Clock, MapPin, FolderKanban, Edit } from "lucide-react";
import { getActivityById } from "@/data/activitiesData";

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activity = getActivityById(Number(id));

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Activity Not Found</h2>
            <p className="text-muted-foreground mb-4">The activity you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/activities")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Activities
            </Button>
          </div>
        </main>
      </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/activities")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activities
        </Button>

        {/* Header */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{activity.title}</h1>
                <StatusBadge status={activity.status} />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getTypeColor(activity.type)}`}>
                  {activity.type}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-muted text-muted-foreground">
                  {getFrequencyLabel(activity.frequency)}
                </span>
              </div>
              <p className="text-muted-foreground">{activity.description}</p>
            </div>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Activity
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Owner</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {activity.owner}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Next Occurrence</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {activity.nextOccurrence}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Duration</div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {activity.duration} min
              </div>
            </div>
            {activity.location && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Location</div>
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {activity.location}
                </div>
              </div>
            )}
            {activity.project && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Project</div>
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  {activity.project}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Type</div>
                    <div className="text-foreground capitalize">{activity.type}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Frequency</div>
                    <div className="text-foreground">{getFrequencyLabel(activity.frequency)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Start Date</div>
                    <div className="text-foreground">{activity.startDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                    <div className="text-foreground">
                      <StatusBadge status={activity.status} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                  <div className="text-foreground">{activity.description}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{activity.owner}</div>
                        <div className="text-sm text-muted-foreground">Owner</div>
                      </div>
                    </div>
                  </div>
                  {activity.participants.filter(p => p !== activity.owner).map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{participant}</div>
                          <div className="text-sm text-muted-foreground">Participant</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Frequency</div>
                    <div className="text-foreground">{getFrequencyLabel(activity.frequency)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Duration</div>
                    <div className="text-foreground">{activity.duration} minutes</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Start Date</div>
                    <div className="text-foreground">{activity.startDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Next Occurrence</div>
                    <div className="text-foreground">{activity.nextOccurrence}</div>
                  </div>
                  {activity.location && (
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
                      <div className="text-foreground">{activity.location}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default ActivityDetail;
