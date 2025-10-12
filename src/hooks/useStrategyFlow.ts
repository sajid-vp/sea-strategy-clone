import { useState, useMemo } from "react";
import { createHierarchicalLayout, filterNodesByStatus } from "@/utils/flowLayout";
import { findBlockerChains, calculateCriticalPath } from "@/utils/blockerAnalysis";

export const useStrategyFlow = (
  goals: any[],
  objectives: any[],
  initiatives: any[],
  projects: any[],
  tasks: any[]
) => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  // Filter data by year
  const filteredInitiatives = useMemo(() => {
    if (selectedYear === "all") return initiatives;
    return initiatives.filter(i => {
      const startYear = i.startYear || i.year;
      const endYear = i.endYear || i.year;
      const yearNum = parseInt(selectedYear);
      return yearNum >= startYear && yearNum <= endYear;
    });
  }, [initiatives, selectedYear]);
  
  const filteredObjectives = useMemo(() => {
    if (selectedYear === "all") return objectives;
    return objectives.filter(o => o.year === parseInt(selectedYear));
  }, [objectives, selectedYear]);
  
  // Filter by selected dimensions
  const dimensionFilteredData = useMemo(() => {
    let filteredGoals = goals;
    let filteredObjs = filteredObjectives;
    let filteredInits = filteredInitiatives;
    let filteredProjs = projects;
    let filteredTasks = tasks;

    // Filter by goals
    if (selectedGoals.length > 0) {
      const goalIds = selectedGoals.map(id => parseInt(id));
      filteredGoals = goals.filter(g => goalIds.includes(g.id));
      filteredObjs = filteredObjs.filter(o => goalIds.includes(o.goalId));
    }

    // Filter by initiatives
    if (selectedInitiatives.length > 0) {
      const initIds = selectedInitiatives.map(id => parseInt(id));
      filteredInits = filteredInits.filter(i => initIds.includes(i.id));
      filteredProjs = filteredProjs.filter(p => initIds.includes(p.initiativeId));
    }

    // Filter by projects
    if (selectedProjects.length > 0) {
      const projIds = selectedProjects.map(id => parseInt(id));
      filteredProjs = filteredProjs.filter(p => projIds.includes(p.id));
      filteredTasks = filteredTasks.filter(t => projIds.includes(t.projectId));
    }

    // Filter by owners
    if (selectedOwners.length > 0) {
      filteredInits = filteredInits.filter(i => i.owner && selectedOwners.includes(i.owner));
      filteredProjs = filteredProjs.filter(p => p.owner && selectedOwners.includes(p.owner));
      filteredTasks = filteredTasks.filter(t => t.assignee && selectedOwners.includes(t.assignee));
    }

    return {
      goals: filteredGoals,
      objectives: filteredObjs,
      initiatives: filteredInits,
      projects: filteredProjs,
      tasks: filteredTasks,
    };
  }, [goals, filteredObjectives, filteredInitiatives, projects, tasks, selectedGoals, selectedInitiatives, selectedProjects, selectedOwners]);
  
  // Create flow layout
  const { nodes, edges } = useMemo(() => {
    return createHierarchicalLayout(
      dimensionFilteredData.goals,
      dimensionFilteredData.objectives,
      dimensionFilteredData.initiatives,
      dimensionFilteredData.projects,
      dimensionFilteredData.tasks
    );
  }, [dimensionFilteredData]);
  
  // Filter by status
  const filteredNodes = useMemo(() => {
    return filterNodesByStatus(nodes, selectedStatus);
  }, [nodes, selectedStatus]);
  
  // Search functionality
  const searchedNodes = useMemo(() => {
    if (!searchQuery) return filteredNodes;
    
    return filteredNodes.filter(node => 
      node.data.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.data.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredNodes, searchQuery]);
  
  // Filter edges to only show connections between visible nodes
  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(searchedNodes.map(node => node.id));
    return edges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  }, [edges, searchedNodes]);
  
  // Blocker analysis
  const blockerChains = useMemo(() => {
    return findBlockerChains(dimensionFilteredData.tasks, dimensionFilteredData.projects, dimensionFilteredData.initiatives);
  }, [dimensionFilteredData]);
  
  // Critical path
  const criticalPath = useMemo(() => {
    return calculateCriticalPath(
      dimensionFilteredData.goals,
      dimensionFilteredData.objectives,
      dimensionFilteredData.initiatives,
      dimensionFilteredData.projects,
      dimensionFilteredData.tasks
    );
  }, [dimensionFilteredData]);
  
  // Statistics
  const stats = useMemo(() => {
    const allStatuses = [
      ...dimensionFilteredData.initiatives,
      ...dimensionFilteredData.projects,
      ...dimensionFilteredData.tasks
    ].map(item => item.status);
    return {
      totalBlocked: allStatuses.filter(s => s === "blocked").length,
      totalAtRisk: allStatuses.filter(s => s === "in-review").length,
      totalOnTrack: allStatuses.filter(s => s === "in-progress").length,
      totalDone: allStatuses.filter(s => s === "done").length,
      totalItems: allStatuses.length,
      onTrackPercentage: Math.round((allStatuses.filter(s => s === "in-progress" || s === "done").length / allStatuses.length) * 100),
    };
  }, [dimensionFilteredData]);
  
  return {
    nodes: searchedNodes,
    edges: filteredEdges,
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
    blockerChains,
    criticalPath,
    stats,
  };
};
