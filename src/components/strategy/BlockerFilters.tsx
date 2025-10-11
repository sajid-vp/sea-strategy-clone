import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, LayoutGrid, LayoutList } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface BlockerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedImpactLevels: string[];
  setSelectedImpactLevels: (levels: string[]) => void;
  selectedInitiatives: string[];
  setSelectedInitiatives: (initiatives: string[]) => void;
  groupBy: string;
  setGroupBy: (groupBy: string) => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
  initiatives: Array<{ id: number; title: string }>;
  onExport: () => void;
}

export const BlockerFilters = ({
  searchQuery,
  setSearchQuery,
  selectedImpactLevels,
  setSelectedImpactLevels,
  selectedInitiatives,
  setSelectedInitiatives,
  groupBy,
  setGroupBy,
  viewMode,
  setViewMode,
  initiatives,
  onExport,
}: BlockerFiltersProps) => {
  const handleImpactToggle = (level: string) => {
    setSelectedImpactLevels(
      selectedImpactLevels.includes(level)
        ? selectedImpactLevels.filter(l => l !== level)
        : [...selectedImpactLevels, level]
    );
  };

  const handleInitiativeToggle = (id: string) => {
    setSelectedInitiatives(
      selectedInitiatives.includes(id)
        ? selectedInitiatives.filter(i => i !== id)
        : [...selectedInitiatives, id]
    );
  };

  const activeFilters = selectedImpactLevels.length + selectedInitiatives.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blockers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Impact Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Impact
              {selectedImpactLevels.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedImpactLevels.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Impact Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedImpactLevels.includes("high")}
              onCheckedChange={() => handleImpactToggle("high")}
            >
              High
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedImpactLevels.includes("medium")}
              onCheckedChange={() => handleImpactToggle("medium")}
            >
              Medium
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedImpactLevels.includes("low")}
              onCheckedChange={() => handleImpactToggle("low")}
            >
              Low
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Initiative Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Initiative
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
            {initiatives.map((initiative) => (
              <DropdownMenuCheckboxItem
                key={initiative.id}
                checked={selectedInitiatives.includes(String(initiative.id))}
                onCheckedChange={() => handleInitiativeToggle(String(initiative.id))}
              >
                {initiative.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Group By */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Group by: {groupBy}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuCheckboxItem
              checked={groupBy === "None"}
              onCheckedChange={() => setGroupBy("None")}
            >
              None
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={groupBy === "Impact"}
              onCheckedChange={() => setGroupBy("Impact")}
            >
              Impact Level
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={groupBy === "Initiative"}
              onCheckedChange={() => setGroupBy("Initiative")}
            >
              Initiative
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={groupBy === "Project"}
              onCheckedChange={() => setGroupBy("Project")}
            >
              Project
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-8 w-8 p-0"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "cards" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        {/* Export */}
        <Button variant="outline" size="sm" onClick={onExport} className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{activeFilters} filter{activeFilters > 1 ? 's' : ''} active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedImpactLevels([]);
              setSelectedInitiatives([]);
            }}
            className="h-auto py-0 px-2"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
