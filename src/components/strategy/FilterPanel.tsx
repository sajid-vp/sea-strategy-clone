import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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

  const activeFilters = selectedOwners.length + selectedInitiatives.length + 
    selectedProjects.length + selectedGoals.length +
    (selectedYear !== "all" ? 1 : 0) + (selectedStatus !== "all" ? 1 : 0);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Year Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Year
              {selectedYear !== "all" && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Year</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedYear === "all"}
              onCheckedChange={() => setSelectedYear("all")}
            >
              All Years
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedYear === "2025"}
              onCheckedChange={() => setSelectedYear("2025")}
            >
              2025
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedYear === "2026"}
              onCheckedChange={() => setSelectedYear("2026")}
            >
              2026
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedYear === "2027"}
              onCheckedChange={() => setSelectedYear("2027")}
            >
              2027
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedYear === "2028"}
              onCheckedChange={() => setSelectedYear("2028")}
            >
              2028
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Status
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedStatus === "all"}
              onCheckedChange={() => setSelectedStatus("all")}
            >
              All Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatus === "blocked"}
              onCheckedChange={() => setSelectedStatus("blocked")}
            >
              Blocked
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatus === "in-review"}
              onCheckedChange={() => setSelectedStatus("in-review")}
            >
              At Risk
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatus === "in-progress"}
              onCheckedChange={() => setSelectedStatus("in-progress")}
            >
              On Track
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatus === "done"}
              onCheckedChange={() => setSelectedStatus("done")}
            >
              Done
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Goals Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Goals
              {selectedGoals.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedGoals.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Goals</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableGoals.map((goal) => (
              <DropdownMenuCheckboxItem
                key={goal.id}
                checked={selectedGoals.includes(String(goal.id))}
                onCheckedChange={() => toggleGoal(String(goal.id))}
              >
                {goal.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Initiatives Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Initiatives
              {selectedInitiatives.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedInitiatives.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Initiatives</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableInitiatives.map((initiative) => (
              <DropdownMenuCheckboxItem
                key={initiative.id}
                checked={selectedInitiatives.includes(String(initiative.id))}
                onCheckedChange={() => toggleInitiative(String(initiative.id))}
              >
                {initiative.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Projects Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Projects
              {selectedProjects.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedProjects.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableProjects.map((project) => (
              <DropdownMenuCheckboxItem
                key={project.id}
                checked={selectedProjects.includes(String(project.id))}
                onCheckedChange={() => toggleProject(String(project.id))}
              >
                {project.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Owners Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Owners
              {selectedOwners.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedOwners.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Owners</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableOwners.map((owner) => (
              <DropdownMenuCheckboxItem
                key={owner}
                checked={selectedOwners.includes(owner)}
                onCheckedChange={() => toggleOwner(owner)}
              >
                {owner}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {activeFilters > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{activeFilters} filter{activeFilters > 1 ? 's' : ''} active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto py-0 px-2"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};