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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import {
  Target,
  Flag,
  Edit,
  Save,
  ChevronRight,
} from "lucide-react";

const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    description: "Build and maintain world-class technology infrastructure",
    startYear: 2025,
    endYear: 2028,
    objectives: [
      {
        id: 1,
        title: "Infrastructure Modernization",
        status: "on-track" as const,
        initiativeCount: 2,
      },
      {
        id: 2,
        title: "Digital Transformation",
        status: "off-track" as const,
        initiativeCount: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Educational Innovation",
    description: "Transform teaching and learning through technology",
    startYear: 2025,
    endYear: 2028,
    objectives: [
      {
        id: 3,
        title: "Teaching Enhancement",
        status: "off-track" as const,
        initiativeCount: 1,
      },
      {
        id: 4,
        title: "Service Excellence",
        status: "on-track" as const,
        initiativeCount: 1,
      },
    ],
  },
];

const Index = () => {
  const [vision, setVision] = useState("To become the industry leader in strategic management solutions");
  const [mission, setMission] = useState("We empower organizations to align their strategic priorities and drive measurable results through innovative technology");
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [tempVision, setTempVision] = useState(vision);
  const [tempMission, setTempMission] = useState(mission);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const handleSaveVision = () => {
    setVision(tempVision);
    setIsEditingVision(false);
  };

  const handleSaveMission = () => {
    setMission(tempMission);
    setIsEditingMission(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Vision & Mission */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Vision & Mission</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-secondary to-card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Vision</h3>
                    <Dialog open={isEditingVision} onOpenChange={setIsEditingVision}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setTempVision(vision)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Vision</DialogTitle>
                          <DialogDescription>
                            Update your organization's vision statement
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          value={tempVision}
                          onChange={(e) => setTempVision(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditingVision(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveVision} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-muted-foreground">{vision}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary to-card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Flag className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Mission</h3>
                    <Dialog open={isEditingMission} onOpenChange={setIsEditingMission}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setTempMission(mission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Mission</DialogTitle>
                          <DialogDescription>
                            Update your organization's mission statement
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          value={tempMission}
                          onChange={(e) => setTempMission(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditingMission(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveMission} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-muted-foreground">{mission}</p>
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Goals</h2>
            <div className="w-64">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All periods</SelectItem>
                  <SelectItem value="2025-2028">2025-2028</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2027-2028">2027-2028</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const totalObjectives = goal.objectives.length;
              const totalInitiatives = goal.objectives.reduce((acc, obj) => acc + obj.initiativeCount, 0);
              const onTrackCount = goal.objectives.filter(o => o.status === "on-track").length;
              const offTrackCount = goal.objectives.filter(o => o.status === "off-track").length;
              
              return (
                <Link key={goal.id} to={`/goals/${goal.id}`} className="group">
                  <Card className="p-6 border border-t-4 border-t-primary bg-gradient-to-br from-secondary/30 to-transparent hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center gap-0.5">
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 opacity-40" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 delay-75 group-hover:translate-x-1 opacity-60" />
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 delay-150 group-hover:translate-x-1" />
                    </div>

                    <div className="flex items-start justify-between mb-4 pr-12">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {goal.title}
                        </h3>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {goal.startYear} - {goal.endYear}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                      {goal.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="font-bold text-lg text-foreground">{totalObjectives}</span>
                          <span className="text-muted-foreground">objectives</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="font-bold text-lg text-foreground">{totalInitiatives}</span>
                          <span className="text-muted-foreground">initiatives</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {onTrackCount > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10">
                            <div className="h-2 w-2 rounded-full bg-success" />
                            <span className="text-xs font-semibold text-success">{onTrackCount}</span>
                          </div>
                        )}
                        {offTrackCount > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10">
                            <div className="h-2 w-2 rounded-full bg-destructive" />
                            <span className="text-xs font-semibold text-destructive">{offTrackCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
