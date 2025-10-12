import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, FolderKanban, Target, TrendingUp, DollarSign, Users, Check, ChevronsUpDown, X, List, BarChart3 } from "lucide-react";
import { programs } from "@/data/programsData";
import { initiatives } from "@/data/projectsData";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const Programs = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [openInitiativePopover, setOpenInitiativePopover] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: "",
    code: "",
    description: "",
    initiativeIds: [] as string[],
    owner: "",
    manager: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "todo",
  });

  // Calculate stats
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === "in-progress").length;
  const completedPrograms = programs.filter(p => p.status === "done").length;
  const blockedPrograms = programs.filter(p => p.status === "blocked").length;
  const avgProgress = Math.round(
    programs.reduce((sum, p) => sum + p.progress, 0) / totalPrograms
  );
  const totalBudget = programs.reduce((sum, p) => {
    const budget = parseFloat(p.budget.replace(/[$,]/g, ''));
    return sum + (isNaN(budget) ? 0 : budget);
  }, 0);

  const handleAddProgram = () => {
    if (!newProgram.title || !newProgram.code || !newProgram.owner || !newProgram.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Program added successfully!");
    setIsAddProgramOpen(false);
    setNewProgram({
      title: "",
      code: "",
      description: "",
      initiativeIds: [],
      owner: "",
      manager: "",
      startDate: "",
      endDate: "",
      budget: "",
      status: "todo",
    });
  };

  const handleInitiativeChange = (initiativeId: string) => {
    setNewProgram(prev => ({
      ...prev,
      initiativeIds: prev.initiativeIds.includes(initiativeId)
        ? prev.initiativeIds.filter(id => id !== initiativeId)
        : [...prev.initiativeIds, initiativeId]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Year Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Programs</h1>
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
            title="Total Programs"
            value={totalPrograms}
            subtitle={selectedYear}
            className="border-l-4 border-l-secondary-foreground"
            icon={<FolderKanban className="h-5 w-5 text-primary" />}
          />

          <StatCard
            title="Program Status"
            value=""
            className="border-l-4 border-l-secondary-foreground"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-muted-foreground">Active:</span>
                </div>
                <span className="font-semibold">{activePrograms}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Completed:</span>
                </div>
                <span className="font-semibold">{completedPrograms}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Blocked:</span>
                </div>
                <span className="font-semibold">{blockedPrograms}</span>
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
            title="Total Budget"
            value={`$${(totalBudget / 1000000).toFixed(1)}M`}
            subtitle="Allocated"
            className="border-l-4 border-l-secondary-foreground"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Programs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="owner">By Owner</TabsTrigger>
              <TabsTrigger value="initiative">By Initiative</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
          <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Program</DialogTitle>
                <DialogDescription>
                  Create a new program to coordinate related projects
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Program Title *</Label>
                    <Input
                      id="title"
                      value={newProgram.title}
                      onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                      placeholder="Enter program title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Program Code *</Label>
                    <Input
                      id="code"
                      value={newProgram.code}
                      onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
                      placeholder="PRG-001"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                    placeholder="Enter program description"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Initiatives (Optional)</Label>
                  <Popover open={openInitiativePopover} onOpenChange={setOpenInitiativePopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openInitiativePopover}
                        className="w-full justify-between h-auto min-h-10"
                      >
                        <span className="text-muted-foreground">
                          {newProgram.initiativeIds.length === 0 
                            ? "Search and select initiatives..." 
                            : `${newProgram.initiativeIds.length} initiative${newProgram.initiativeIds.length > 1 ? 's' : ''} selected`
                          }
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search initiatives..." />
                        <CommandList>
                          <CommandEmpty>No initiatives found.</CommandEmpty>
                          <CommandGroup>
                            {initiatives.map((initiative) => (
                              <CommandItem
                                key={initiative.id}
                                value={initiative.title}
                                onSelect={() => handleInitiativeChange(initiative.id.toString())}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newProgram.initiativeIds.includes(initiative.id.toString())
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{initiative.title}</div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {newProgram.initiativeIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProgram.initiativeIds.map((id) => {
                        const initiative = initiatives.find(i => i.id.toString() === id);
                        return initiative ? (
                          <Badge key={id} variant="secondary" className="gap-1">
                            {initiative.title}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleInitiativeChange(id)}
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newProgram.status} onValueChange={(value) => setNewProgram({ ...newProgram, status: value })}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="owner">Program Owner *</Label>
                    <Input
                      id="owner"
                      value={newProgram.owner}
                      onChange={(e) => setNewProgram({ ...newProgram, owner: e.target.value })}
                      placeholder="Owner name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manager">Program Manager</Label>
                    <Input
                      id="manager"
                      value={newProgram.manager}
                      onChange={(e) => setNewProgram({ ...newProgram, manager: e.target.value })}
                      placeholder="Manager name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProgram.startDate}
                      onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newProgram.endDate}
                      onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    value={newProgram.budget}
                    onChange={(e) => setNewProgram({ ...newProgram, budget: e.target.value })}
                    placeholder="$1,000,000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddProgramOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProgram}>Add Program</Button>
              </div>
            </DialogContent>
          </Dialog>

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
          </div>

          <TabsContent value="overview">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {programs.map((program) => {
                const initiative = initiatives.find(i => i.id === program.initiativeId);
                const projectCount = initiative?.projects.filter(p => (p as any).programId === program.id).length || 0;
                
                return (
                  <Link key={program.id} to={`/programs/${program.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-4">
                          <FolderKanban className="h-5 w-5 text-primary mt-1" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-1 truncate">{program.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono text-muted-foreground">{program.code}</span>
                              <StatusBadge status={program.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-auto">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">{program.progress}%</span>
                            </div>
                            <Progress value={program.progress} className="h-2" />
                          </div>

                          <div className="pt-3 border-t space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="font-medium truncate ml-2">{program.owner}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-medium">{program.budget}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Projects:</span>
                              <span className="font-medium">{projectCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="owner" className="space-y-4">
            {Array.from(
              new Set(programs.map(p => p.owner))
            ).map((owner) => {
              const ownerPrograms = programs.filter(p => p.owner === owner);

              return (
                <div key={owner}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {owner}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {ownerPrograms.length} program{ownerPrograms.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }>
                    {ownerPrograms.map((program) => {
                      const initiative = initiatives.find(i => i.id === program.initiativeId);
                      const projectCount = initiative?.projects.filter(p => (p as any).programId === program.id).length || 0;

                      return (
                        <Link key={program.id} to={`/programs/${program.id}`}>
                          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                            <div className="flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-4">
                                <FolderKanban className="h-5 w-5 text-primary mt-1" />
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-foreground mb-1 truncate">{program.title}</h3>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono text-muted-foreground">{program.code}</span>
                                    <StatusBadge status={program.status} />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3 mt-auto">
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold">{program.progress}%</span>
                                  </div>
                                  <Progress value={program.progress} className="h-2" />
                                </div>

                                <div className="pt-3 border-t space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Budget:</span>
                                    <span className="font-medium">{program.budget}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Projects:</span>
                                    <span className="font-medium">{projectCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="initiative" className="space-y-4">
            {initiatives.map((initiative) => {
              const initiativePrograms = programs.filter(
                (p) => p.initiativeId === initiative.id
              );

              if (initiativePrograms.length === 0) return null;

              return (
                <div key={initiative.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {initiative.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {initiativePrograms.length} program{initiativePrograms.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }>
                    {initiativePrograms.map((program) => {
                      const projectCount = initiative.projects.filter(p => (p as any).programId === program.id).length || 0;

                      return (
                        <Link key={program.id} to={`/programs/${program.id}`}>
                          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                            <div className="flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-4">
                                <FolderKanban className="h-5 w-5 text-primary mt-1" />
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-foreground mb-1 truncate">{program.title}</h3>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono text-muted-foreground">{program.code}</span>
                                    <StatusBadge status={program.status} />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3 mt-auto">
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold">{program.progress}%</span>
                                  </div>
                                  <Progress value={program.progress} className="h-2" />
                                </div>

                                <div className="pt-3 border-t space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Owner:</span>
                                    <span className="font-medium truncate ml-2">{program.owner}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Budget:</span>
                                    <span className="font-medium">{program.budget}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Projects:</span>
                                    <span className="font-medium">{projectCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Programs;
