import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
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

          {/* Goals */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                Goals {selectedGoals.length > 0 && `(${selectedGoals.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-background z-50" align="start">
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-2">Select Goals</h4>
                {availableGoals.map(goal => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`goal-${goal.id}`}
                      checked={selectedGoals.includes(String(goal.id))}
                      onCheckedChange={() => toggleGoal(String(goal.id))}
                    />
                    <label
                      htmlFor={`goal-${goal.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {goal.title}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Initiatives */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                Initiatives {selectedInitiatives.length > 0 && `(${selectedInitiatives.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-background z-50" align="start">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-sm mb-2">Select Initiatives</h4>
                {availableInitiatives.map(initiative => (
                  <div key={initiative.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`initiative-${initiative.id}`}
                      checked={selectedInitiatives.includes(String(initiative.id))}
                      onCheckedChange={() => toggleInitiative(String(initiative.id))}
                    />
                    <label
                      htmlFor={`initiative-${initiative.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {initiative.title}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Projects */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                Projects {selectedProjects.length > 0 && `(${selectedProjects.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-background z-50" align="start">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-sm mb-2">Select Projects</h4>
                {availableProjects.map(project => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.includes(String(project.id))}
                      onCheckedChange={() => toggleProject(String(project.id))}
                    />
                    <label
                      htmlFor={`project-${project.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {project.title}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Owners */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                Owners {selectedOwners.length > 0 && `(${selectedOwners.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-background z-50" align="start">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-sm mb-2">Select Owners</h4>
                {availableOwners.map(owner => (
                  <div key={owner} className="flex items-center space-x-2">
                    <Checkbox
                      id={`owner-${owner}`}
                      checked={selectedOwners.includes(owner)}
                      onCheckedChange={() => toggleOwner(owner)}
                    />
                    <label
                      htmlFor={`owner-${owner}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {owner}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedYear !== "all" && (
              <Badge variant="secondary">
                Year: {selectedYear}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedYear("all")}
                />
              </Badge>
            )}
            {selectedStatus !== "all" && (
              <Badge variant="secondary">
                Status: {selectedStatus}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedStatus("all")}
                />
              </Badge>
            )}
            {selectedOwners.map(owner => (
              <Badge key={owner} variant="secondary">
                Owner: {owner}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedOwners(selectedOwners.filter(o => o !== owner))}
                />
              </Badge>
            ))}
            {selectedGoals.map(goalId => {
              const goal = availableGoals.find(g => String(g.id) === goalId);
              return goal ? (
                <Badge key={goalId} variant="secondary">
                  Goal: {goal.title}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setSelectedGoals(selectedGoals.filter(g => g !== goalId))}
                  />
                </Badge>
              ) : null;
            })}
            {selectedInitiatives.map(initId => {
              const initiative = availableInitiatives.find(i => String(i.id) === initId);
              return initiative ? (
                <Badge key={initId} variant="secondary">
                  Initiative: {initiative.title}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setSelectedInitiatives(selectedInitiatives.filter(i => i !== initId))}
                  />
                </Badge>
              ) : null;
            })}
            {selectedProjects.map(projId => {
              const project = availableProjects.find(p => String(p.id) === projId);
              return project ? (
                <Badge key={projId} variant="secondary">
                  Project: {project.title}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
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
