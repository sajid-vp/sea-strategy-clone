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
import { LayoutGrid, List, Target, Flag, TrendingUp, BarChart3, Users, User, Plus, Check, ChevronsUpDown, X } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const goals = [
  {
    id: 1,
    title: "Technology Excellence",
    description: "Build and maintain world-class technology infrastructure",
    startYear: 2025,
    endYear: 2028,
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
  {
    id: 2,
    title: "Educational Innovation",
    description: "Transform teaching and learning through technology",
    startYear: 2025,
    endYear: 2028,
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
];

const Initiatives = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openObjectivePopover, setOpenObjectivePopover] = useState(false);
  const { toast } = useToast();
  const totalInitiatives = goals.reduce((acc, goal) => acc + goal.initiatives.length, 0);

  // Extract all objectives from goals for the form
  const allObjectives = goals.flatMap(g => 
    (g as any).objectives?.map((obj: any) => ({
      ...obj,
      goalTitle: g.title
    })) || []
  );

  // Extract unique owners from existing data
  const uniqueOwners = Array.from(
    new Set(goals.flatMap(g => g.initiatives.map(i => i.owner)))
  ).sort();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    objectives: [] as string[],
    startYear: "2025",
    endYear: "2025",
    owner: "",
    description: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectivesChange = (objectiveId: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objectiveId)
        ? prev.objectives.filter(id => id !== objectiveId)
        : [...prev.objectives, objectiveId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || formData.objectives.length === 0 || !formData.owner.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate date range
    if (parseInt(formData.startYear) > parseInt(formData.endYear)) {
      toast({
        title: "Validation Error",
        description: "Start year must be before or equal to end year",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally save to a database
    toast({
      title: "Success",
      description: "Initiative created successfully",
    });

    // Reset form and close dialog
    setFormData({
      title: "",
      objectives: [],
      startYear: "2025",
      endYear: "2025",
      owner: "",
      description: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Initiatives</h1>
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
            title="Initiatives"
            value={totalInitiatives}
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Target className="h-5 w-5 text-primary" />}
          />
          
          <StatCard
            title="Key Initiatives"
            value="0"
            subtitle="2025"
            className="border-l-4 border-l-secondary-foreground"
            icon={<Flag className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <Progress value={0} className="h-2 bg-destructive" />
            </div>
          </StatCard>

          <StatCard
            title="Initiative Status"
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
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">At Risk:</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Off Track:</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Overall Progress"
            value="50%"
            className="border-l-4 border-l-secondary-foreground"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          >
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <Progress value={50} className="h-2" />
            </div>
          </StatCard>
        </div>

        {/* Strategic Initiatives */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
              <TabsTrigger value="objective">By Objective</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Initiative
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Initiative</DialogTitle>
                    <DialogDescription>
                      Add a new strategic initiative to track progress and KPIs
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startYear">Start Year *</Label>
                          <Select 
                            value={formData.startYear} 
                            onValueChange={(value) => handleInputChange("startYear", value)}
                          >
                            <SelectTrigger id="startYear">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2025">2025</SelectItem>
                              <SelectItem value="2026">2026</SelectItem>
                              <SelectItem value="2027">2027</SelectItem>
                              <SelectItem value="2028">2028</SelectItem>
                              <SelectItem value="2029">2029</SelectItem>
                              <SelectItem value="2030">2030</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endYear">End Year *</Label>
                          <Select 
                            value={formData.endYear} 
                            onValueChange={(value) => handleInputChange("endYear", value)}
                          >
                            <SelectTrigger id="endYear">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2025">2025</SelectItem>
                              <SelectItem value="2026">2026</SelectItem>
                              <SelectItem value="2027">2027</SelectItem>
                              <SelectItem value="2028">2028</SelectItem>
                              <SelectItem value="2029">2029</SelectItem>
                              <SelectItem value="2030">2030</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Initiative Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter initiative title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          required
                        />
                      </div>

                      {/* Owner - now a dropdown */}
                      <div className="space-y-2">
                        <Label htmlFor="owner">Initiative Owner *</Label>
                        <Select 
                          value={formData.owner} 
                          onValueChange={(value) => handleInputChange("owner", value)}
                        >
                          <SelectTrigger id="owner">
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueOwners.map((owner) => (
                              <SelectItem key={owner} value={owner}>
                                {owner}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Objectives - searchable multi-select */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Objectives * (Select one or more)</Label>
                        <Popover open={openObjectivePopover} onOpenChange={setOpenObjectivePopover}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openObjectivePopover}
                              className="w-full justify-between h-auto min-h-10"
                            >
                              <span className="text-muted-foreground">
                                {formData.objectives.length === 0 
                                  ? "Search and select objectives..." 
                                  : `${formData.objectives.length} objective${formData.objectives.length > 1 ? 's' : ''} selected`
                                }
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search objectives..." />
                              <CommandList>
                                <CommandEmpty>No objectives found.</CommandEmpty>
                                <CommandGroup>
                                  {allObjectives.map((objective: any) => (
                                    <CommandItem
                                      key={objective.id}
                                      value={objective.title}
                                      onSelect={() => handleObjectivesChange(objective.id.toString())}
                                      className="cursor-pointer"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          formData.objectives.includes(objective.id.toString())
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{objective.title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                          {objective.description} • {objective.goalTitle}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        
                        {/* Selected objectives as badges */}
                        {formData.objectives.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.objectives.map((objectiveId) => {
                              const objective = allObjectives.find((o: any) => o.id.toString() === objectiveId);
                              return objective ? (
                                <Badge 
                                  key={objectiveId} 
                                  variant="secondary"
                                  className="gap-1 pr-1"
                                >
                                  {objective.title}
                                  <button
                                    type="button"
                                    onClick={() => handleObjectivesChange(objectiveId)}
                                    className="ml-1 hover:bg-muted rounded-sm p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                        
                        {formData.objectives.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            Please select at least one objective for this initiative
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter initiative description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Create Initiative
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
              {goals.flatMap((goal) =>
                goal.initiatives.map((initiative) => (
                  <Link key={initiative.id} to={`/initiatives/${initiative.id}`}>
                    <Card className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-secondary-foreground cursor-pointer">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {initiative.title}
                        </h4>
                        <StatusBadge status={initiative.status} />
                      </div>
                      
                      {/* Owner & Team */}
                      <div className="mb-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-xs font-medium text-muted-foreground">Owner</div>
                            <div className="text-sm text-foreground">{initiative.owner}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-xs font-medium text-muted-foreground">Team Members</div>
                            <div className="text-sm text-foreground">{initiative.team.join(", ")}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            {initiative.kpis.length} KPIs
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-success" />
                              <span>{initiative.kpis.filter(k => k.status === "in-progress").length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-destructive" />
                              <span>{initiative.kpis.filter(k => k.status !== "in-progress").length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="objective" className="mt-0">
            <div className="space-y-8">
              {goals.map((goal) => (
                <div key={goal.id}>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.initiatives.length} initiatives</p>
                  </div>

                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
                    {goal.initiatives.map((initiative) => (
                      <Link key={initiative.id} to={`/initiatives/${initiative.id}`}>
                        <Card className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-secondary-foreground cursor-pointer">
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-foreground mb-2">
                              {initiative.title}
                            </h4>
                            <StatusBadge status={initiative.status} />
                          </div>
                          
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-muted-foreground">
                                {initiative.kpis.length} KPIs
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full bg-success" />
                                  <span>{initiative.kpis.filter(k => k.status === "in-progress").length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full bg-destructive" />
                                  <span>{initiative.kpis.filter(k => k.status !== "in-progress").length}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="owner" className="mt-0">
            <div className="space-y-8">
              {Array.from(new Set(goals.flatMap(g => g.initiatives.map(i => i.owner)))).map((owner) => {
                const ownerInitiatives = goals.flatMap(g => 
                  g.initiatives.filter(i => i.owner === owner).map(i => ({ ...i, goalTitle: g.title }))
                );
                
                return (
                  <div key={owner}>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">{owner}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">{ownerInitiatives.length} initiatives</p>
                    </div>

                    <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}>
                      {ownerInitiatives.map((initiative) => (
                        <Link key={initiative.id} to={`/initiatives/${initiative.id}`}>
                          <Card className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-secondary-foreground cursor-pointer">
                            <div className="mb-4">
                              <div className="text-xs text-muted-foreground mb-2">{initiative.goalTitle}</div>
                              <h4 className="text-lg font-semibold text-foreground mb-2">
                                {initiative.title}
                              </h4>
                              <StatusBadge status={initiative.status} />
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex items-start gap-2">
                                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground">Team Members</div>
                                  <div className="text-sm text-foreground">{initiative.team.join(", ")}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-border">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-muted-foreground">
                                  {initiative.kpis.length} KPIs
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-success" />
                                    <span>{initiative.kpis.filter(k => k.status === "in-progress").length}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-destructive" />
                                    <span>{initiative.kpis.filter(k => k.status !== "in-progress").length}</span>
                                  </div>
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
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Initiatives;
