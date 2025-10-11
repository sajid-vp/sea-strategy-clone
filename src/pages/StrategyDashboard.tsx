import { useState } from "react";
import { Header } from "@/components/Header";
import { FlowCanvas } from "@/components/strategy/FlowCanvas";
import { FilterPanel } from "@/components/strategy/FilterPanel";
import { BlockerPanel } from "@/components/strategy/BlockerPanel";
import { BlockerFilters } from "@/components/strategy/BlockerFilters";
import { BlockerAnalysisReport } from "@/components/strategy/BlockerAnalysisReport";
import { DetailSheet } from "@/components/strategy/DetailSheet";
import { useStrategyFlow } from "@/hooks/useStrategyFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findBlockerChainsEnhanced } from "@/utils/blockerAnalysis";
import { toast } from "@/hooks/use-toast";

// Mock data - in real app, these would come from your data sources
const mockGoals = [
  {
    id: 1,
    title: "Digital Transformation Excellence",
    description: "Lead the digital transformation across all university operations",
    timeframe: "2025-2028",
  },
  {
    id: 2,
    title: "Research & Innovation Leadership",
    description: "Establish world-class research infrastructure",
    timeframe: "2025-2027",
  },
];

const mockObjectives = [
  {
    id: 1,
    goalId: 1,
    title: "Modernize IT Infrastructure",
    description: "Upgrade all core systems",
    year: 2025,
    status: "in-progress",
  },
  {
    id: 2,
    goalId: 1,
    title: "Enhance Digital Learning",
    description: "Deploy modern learning platforms",
    year: 2025,
    status: "in-progress",
  },
  {
    id: 3,
    goalId: 2,
    title: "Build Research Computing",
    description: "Create high-performance computing facilities",
    year: 2026,
    status: "todo",
  },
];

const mockInitiatives = [
  {
    id: 1,
    objectiveId: 1,
    title: "Cloud Migration Initiative",
    description: "Migrate all systems to cloud",
    status: "in-progress",
    owner: "Sarah Johnson",
    startYear: 2025,
    endYear: 2025,
  },
  {
    id: 2,
    objectiveId: 1,
    title: "Security Enhancement",
    description: "Implement ISO 27001",
    status: "in-progress",
    owner: "John Smith",
    startYear: 2025,
    endYear: 2026,
  },
  {
    id: 3,
    objectiveId: 2,
    title: "Learning Platform Deployment",
    description: "Roll out new LMS",
    status: "blocked",
    owner: "Emily Davis",
    startYear: 2025,
    endYear: 2025,
  },
];

const mockProjects = [
  {
    id: 1,
    initiativeId: 1,
    title: "AWS Infrastructure Setup",
    status: "in-progress",
    progress: 65,
    owner: "Michael Chen",
    dueDate: "2025-11-15",
  },
  {
    id: 2,
    initiativeId: 2,
    title: "Security Audit & Compliance",
    status: "in-progress",
    progress: 40,
    owner: "David Kim",
    dueDate: "2025-12-01",
  },
  {
    id: 3,
    initiativeId: 3,
    title: "LMS Vendor Selection",
    status: "blocked",
    progress: 20,
    owner: "Robert Martinez",
    dueDate: "2025-10-01", // Overdue
  },
];

const mockTasks = [
  {
    id: 1,
    projectId: 1,
    title: "Setup VPC and Networking",
    status: "done",
    assignee: "Alice Wong",
    dependencies: [],
    dueDate: "2025-09-15",
  },
  {
    id: 2,
    projectId: 1,
    title: "Configure Security Groups",
    status: "in-progress",
    assignee: "Bob Smith",
    dependencies: [1],
    dueDate: "2025-10-20",
  },
  {
    id: 3,
    projectId: 1,
    title: "Deploy Application Servers",
    status: "blocked",
    assignee: "Charlie Brown",
    dependencies: [2],
    blockingReason: "Waiting for security approval",
    dueDate: "2025-10-05", // Overdue
  },
  {
    id: 4,
    projectId: 2,
    title: "Conduct Security Assessment",
    status: "in-progress",
    assignee: "Diana Prince",
    dependencies: [],
    dueDate: "2025-11-30",
  },
  {
    id: 5,
    projectId: 3,
    title: "Review LMS Requirements",
    status: "done",
    assignee: "Eva Green",
    dependencies: [],
    dueDate: "2025-09-01",
  },
  {
    id: 6,
    projectId: 3,
    title: "Shortlist Vendors",
    status: "blocked",
    assignee: "Frank Miller",
    dependencies: [5],
    blockingReason: "Budget approval pending",
    dueDate: "2025-09-30", // Overdue
  },
];

const StrategyDashboard = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Blocker analysis filters
  const [blockerSearchQuery, setBlockerSearchQuery] = useState("");
  const [selectedImpactLevels, setSelectedImpactLevels] = useState<string[]>([]);
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState("None");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const {
    nodes,
    edges,
    selectedYear,
    setSelectedYear,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    blockerChains,
    criticalPath,
    stats,
  } = useStrategyFlow(mockGoals, mockObjectives, mockInitiatives, mockProjects, mockTasks);

  // Enhanced blocker chains with additional data
  const enhancedBlockerChains = findBlockerChainsEnhanced(
    mockTasks,
    mockProjects,
    mockInitiatives,
    criticalPath
  );

  // Filter enhanced blockers
  const filteredBlockers = enhancedBlockerChains.filter(blocker => {
    // Search filter
    if (blockerSearchQuery && !blocker.taskTitle.toLowerCase().includes(blockerSearchQuery.toLowerCase())) {
      return false;
    }
    
    // Impact level filter
    if (selectedImpactLevels.length > 0 && !selectedImpactLevels.includes(blocker.impactLevel)) {
      return false;
    }
    
    // Initiative filter
    if (selectedInitiatives.length > 0 && !selectedInitiatives.includes(String(blocker.initiativeId))) {
      return false;
    }
    
    return true;
  });

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Export in progress",
      description: "Your blocker analysis report will download shortly.",
    });
    // In a real app, this would generate a PDF/CSV
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Strategy Director Dashboard</h1>
        </div>

        <FilterPanel
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <Tabs defaultValue="hierarchy" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
            <TabsTrigger value="blockers">Blocker Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="space-y-6">
            <FlowCanvas
              initialNodes={nodes}
              initialEdges={edges}
              onNodeClick={handleNodeClick}
            />
          </TabsContent>

          <TabsContent value="blockers" className="space-y-6">
            {/* Filters */}
            <BlockerFilters
              searchQuery={blockerSearchQuery}
              setSearchQuery={setBlockerSearchQuery}
              selectedImpactLevels={selectedImpactLevels}
              setSelectedImpactLevels={setSelectedImpactLevels}
              selectedInitiatives={selectedInitiatives}
              setSelectedInitiatives={setSelectedInitiatives}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              initiatives={mockInitiatives}
              onExport={handleExport}
            />

            {/* Main Content - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Report Table */}
              <div className="lg:col-span-2">
                <BlockerAnalysisReport
                  blockers={filteredBlockers}
                  groupBy={groupBy}
                />
              </div>

              {/* Right: Visual Map + Summary */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Visual Dependency Map
                  </h3>
                  <div className="h-[400px]">
                    <FlowCanvas
                      initialNodes={nodes.filter(n => 
                        n.data.status === "blocked" || 
                        n.type === "goalNode" ||
                        (n.data.dueDate && new Date(n.data.dueDate) < new Date())
                      )}
                      initialEdges={edges}
                      onNodeClick={handleNodeClick}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Active Blockers
                  </h3>
                  <BlockerPanel blockerChains={blockerChains} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <DetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        node={selectedNode}
      />
    </div>
  );
};

export default StrategyDashboard;
