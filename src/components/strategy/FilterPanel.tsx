import { Search, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOwners: string[];
  setSelectedOwners: (owners: string[]) => void;
  selectedInitiatives: string[];
  setSelectedInitiatives: (initiatives: string[]) => void;
  selectedProjects: string[];
  setSelectedProjects: (projects: string[]) => void;
  selectedGoals: string[];
  setSelectedGoals: (goals: string[]) => void;
  availableOwners: string[];
  availableInitiatives: Array<{ id: number; title: string }>;
  availableProjects: Array<{ id: number; title: string }>;
  availableGoals: Array<{ id: number; title: string }>;
}

export const FilterPanel = ({
  selectedYear,
  setSelectedYear,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
  selectedOwners,
  setSelectedOwners,
  selectedInitiatives,
  setSelectedInitiatives,
  selectedProjects,
  setSelectedProjects,
  selectedGoals,
  setSelectedGoals,
  availableOwners,
  availableInitiatives,
  availableProjects,
  availableGoals,
}: FilterPanelProps) => {
  const toggleOwner = (owner: string) => {
    setSelectedOwners(
      selectedOwners.includes(owner)
        ? selectedOwners.filter(o => o !== owner)
        : [...selectedOwners, owner]
    );
  };

  const toggleInitiative = (initiativeId: string) => {
    setSelectedInitiatives(
      selectedInitiatives.includes(initiativeId)
        ? selectedInitiatives.filter(i => i !== initiativeId)
        : [...selectedInitiatives, initiativeId]
    );
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects(
      selectedProjects.includes(projectId)
        ? selectedProjects.filter(p => p !== projectId)
        : [...selectedProjects, projectId]
    );
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(
      selectedGoals.includes(goalId)
        ? selectedGoals.filter(g => g !== goalId)
        : [...selectedGoals, goalId]
    );
  };

  const clearAllFilters = () => {
    setSelectedYear("all");
    setSelectedStatus("all");
    setSearchQuery("");
    setSelectedOwners([]);
    setSelectedInitiatives([]);
    setSelectedProjects([]);
    setSelectedGoals([]);
  };

  const hasActiveFilters = selectedYear !== "all" || selectedStatus !== "all" || 
    searchQuery !== "" || selectedOwners.length > 0 || selectedInitiatives.length > 0 || 
    selectedProjects.length > 0 || selectedGoals.length > 0;

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Year */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Status */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="in-review">At Risk</SelectItem>
              <SelectItem value="in-progress">On Track</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          {/* Goals Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between font-normal",
                  selectedGoals.length === 0 && "text-muted-foreground"
                )}
              >
                {selectedGoals.length === 0
                  ? "Select goals..."
                  : `${selectedGoals.length} goal${selectedGoals.length > 1 ? 's' : ''} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-background z-50" align="start">
              <Command>
                <CommandInput placeholder="Search goals..." />
                <CommandList>
                  <CommandEmpty>No goals found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {availableGoals.map((goal) => (
                        <CommandItem
                          key={goal.id}
                          onSelect={() => toggleGoal(String(goal.id))}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              selectedGoals.includes(String(goal.id))
                                ? "bg-primary border-primary"
                                : "border-input"
                            )}>
                              {selectedGoals.includes(String(goal.id)) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="flex-1">{goal.title}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Initiatives Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between font-normal",
                  selectedInitiatives.length === 0 && "text-muted-foreground"
                )}
              >
                {selectedInitiatives.length === 0
                  ? "Select initiatives..."
                  : `${selectedInitiatives.length} initiative${selectedInitiatives.length > 1 ? 's' : ''} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-background z-50" align="start">
              <Command>
                <CommandInput placeholder="Search initiatives..." />
                <CommandList>
                  <CommandEmpty>No initiatives found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {availableInitiatives.map((initiative) => (
                        <CommandItem
                          key={initiative.id}
                          onSelect={() => toggleInitiative(String(initiative.id))}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              selectedInitiatives.includes(String(initiative.id))
                                ? "bg-primary border-primary"
                                : "border-input"
                            )}>
                              {selectedInitiatives.includes(String(initiative.id)) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="flex-1">{initiative.title}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Projects Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between font-normal",
                  selectedProjects.length === 0 && "text-muted-foreground"
                )}
              >
                {selectedProjects.length === 0
                  ? "Select projects..."
                  : `${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-background z-50" align="start">
              <Command>
                <CommandInput placeholder="Search projects..." />
                <CommandList>
                  <CommandEmpty>No projects found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {availableProjects.map((project) => (
                        <CommandItem
                          key={project.id}
                          onSelect={() => toggleProject(String(project.id))}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              selectedProjects.includes(String(project.id))
                                ? "bg-primary border-primary"
                                : "border-input"
                            )}>
                              {selectedProjects.includes(String(project.id)) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="flex-1">{project.title}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Owners Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between font-normal",
                  selectedOwners.length === 0 && "text-muted-foreground"
                )}
              >
                {selectedOwners.length === 0
                  ? "Select owners..."
                  : `${selectedOwners.length} owner${selectedOwners.length > 1 ? 's' : ''} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-background z-50" align="start">
              <Command>
                <CommandInput placeholder="Search owners..." />
                <CommandList>
                  <CommandEmpty>No owners found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {availableOwners.map((owner) => (
                        <CommandItem
                          key={owner}
                          onSelect={() => toggleOwner(owner)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className={cn(
                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                              selectedOwners.includes(owner)
                                ? "bg-primary border-primary"
                                : "border-input"
                            )}>
                              {selectedOwners.includes(owner) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="flex-1">{owner}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {selectedYear !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Year: {selectedYear}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => setSelectedYear("all")}
                />
              </Badge>
            )}
            {selectedStatus !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {selectedStatus}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => setSelectedStatus("all")}
                />
              </Badge>
            )}
            {selectedOwners.map(owner => (
              <Badge key={owner} variant="secondary" className="gap-1">
                {owner}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => setSelectedOwners(selectedOwners.filter(o => o !== owner))}
                />
              </Badge>
            ))}
            {selectedGoals.map(goalId => {
              const goal = availableGoals.find(g => String(g.id) === goalId);
              return goal ? (
                <Badge key={goalId} variant="secondary" className="gap-1">
                  {goal.title}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setSelectedGoals(selectedGoals.filter(g => g !== goalId))}
                  />
                </Badge>
              ) : null;
            })}
            {selectedInitiatives.map(initId => {
              const initiative = availableInitiatives.find(i => String(i.id) === initId);
              return initiative ? (
                <Badge key={initId} variant="secondary" className="gap-1">
                  {initiative.title}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setSelectedInitiatives(selectedInitiatives.filter(i => i !== initId))}
                  />
                </Badge>
              ) : null;
            })}
            {selectedProjects.map(projId => {
              const project = availableProjects.find(p => String(p.id) === projId);
              return project ? (
                <Badge key={projId} variant="secondary" className="gap-1">
                  {project.title}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setSelectedProjects(selectedProjects.filter(p => p !== projId))}
                  />
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </Card>
  );
};