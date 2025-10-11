import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FolderKanban, Target, TrendingUp, DollarSign, Users, Check, ChevronsUpDown, X } from "lucide-react";
import { programs } from "@/data/programsData";
import { initiatives } from "@/data/projectsData";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const Programs = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [initiativeFilter, setInitiativeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
    status: "planned",
  });

  const filteredPrograms = programs.filter((program) => {
    const matchesStatus = statusFilter === "all" || program.status === statusFilter;
    const matchesInitiative = initiativeFilter === "all" || program.initiativeId === Number(initiativeFilter);
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesInitiative && matchesSearch;
  });

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
      status: "planned",
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

  const getStatusVariant = (status: string) => {
    const map: Record<string, "todo" | "in-progress" | "done" | "blocked"> = {
      "planned": "todo",
      "active": "in-progress",
      "on-hold": "blocked",
      "closed": "done"
    };
    return map[status] || "todo";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Programs</h1>
            <p className="text-muted-foreground">
              Strategic programs coordinating multiple projects and initiatives
            </p>
          </div>
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
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
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
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={initiativeFilter} onValueChange={setInitiativeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by initiative" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Initiatives</SelectItem>
              {initiatives.map((initiative) => (
                <SelectItem key={initiative.id} value={String(initiative.id)}>
                  {initiative.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-4">
          {filteredPrograms.map((program) => {
            const initiative = initiatives.find(i => i.id === program.initiativeId);
            const projectCount = initiative?.projects.filter(p => (p as any).programId === program.id).length || 0;
            
            return (
              <Link key={program.id} to={`/programs/${program.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FolderKanban className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">{program.title}</h3>
                        <span className="text-sm font-mono text-muted-foreground">{program.code}</span>
                        <StatusBadge status={getStatusVariant(program.status)} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Initiative</div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            <Target className="h-3.5 w-3.5" />
                            {initiative?.title || "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Projects</div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            <FolderKanban className="h-3.5 w-3.5" />
                            {projectCount} projects
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Owner</div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {program.owner}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Budget</div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {program.budget}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Progress</div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {program.progress}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No programs found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Programs;
