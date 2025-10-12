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

    // Filter by projects (show complete pathway)
    if (selectedProjects.length > 0) {
      const projIds = selectedProjects.map(id => parseInt(id));
      filteredProjs = filteredProjs.filter(p => projIds.includes(p.id));
      
      // Include parent initiatives for selected projects
      const relatedInitIds = new Set(filteredProjs.map(p => p.initiativeId));
      filteredInits = filteredInits.filter(i => relatedInitIds.has(i.id));
      
      // Include parent objectives for related initiatives
      const relatedObjIds = new Set(filteredInits.map(i => i.objectiveId));
      filteredObjs = filteredObjs.filter(o => relatedObjIds.has(o.id));
      
      // Include parent goals for related objectives
      const relatedGoalIds = new Set(filteredObjs.map(o => o.goalId));
      filteredGoals = filteredGoals.filter(g => relatedGoalIds.has(g.id));
      
      // Include tasks for selected projects
      filteredTasks = filteredTasks.filter(t => projIds.includes(t.projectId));
    }
    // Filter by initiatives (show complete pathway)
    else if (selectedInitiatives.length > 0) {
      const initIds = selectedInitiatives.map(id => parseInt(id));
      filteredInits = filteredInits.filter(i => initIds.includes(i.id));
      
      // Include parent objectives for selected initiatives
      const relatedObjIds = new Set(filteredInits.map(i => i.objectiveId));
      filteredObjs = filteredObjs.filter(o => relatedObjIds.has(o.id));
      
      // Include parent goals for related objectives
      const relatedGoalIds = new Set(filteredObjs.map(o => o.goalId));
      filteredGoals = filteredGoals.filter(g => relatedGoalIds.has(g.id));
      
      // Include child projects and tasks
      filteredProjs = filteredProjs.filter(p => initIds.includes(p.initiativeId));
      const projIds = new Set(filteredProjs.map(p => p.id));
      filteredTasks = filteredTasks.filter(t => projIds.has(t.projectId));
    }
    // Filter by goals (show complete pathway)
    else if (selectedGoals.length > 0) {
      const goalIds = selectedGoals.map(id => parseInt(id));
      filteredGoals = goals.filter(g => goalIds.includes(g.id));
      
      // Include child objectives
      filteredObjs = filteredObjs.filter(o => goalIds.includes(o.goalId));
      
      // Include child initiatives
      const objIds = new Set(filteredObjs.map(o => o.id));
      filteredInits = filteredInits.filter(i => objIds.has(i.objectiveId));
      
      // Include child projects
      const initIds = new Set(filteredInits.map(i => i.id));
      filteredProjs = filteredProjs.filter(p => initIds.has(p.initiativeId));
      
      // Include child tasks
      const projIds = new Set(filteredProjs.map(p => p.id));
      filteredTasks = filteredTasks.filter(t => projIds.has(t.projectId));
    }

    // Apply owner filter (if any other filters are active, filter within them)
    if (selectedOwners.length > 0) {
      filteredInits = filteredInits.filter(i => i.owner && selectedOwners.includes(i.owner));
      filteredProjs = filteredProjs.filter(p => p.owner && selectedOwners.includes(p.owner));
      filteredTasks = filteredTasks.filter(t => t.assignee && selectedOwners.includes(t.assignee));
      
      // If we filtered by owners, ensure we keep the parent chain for remaining items
      if (selectedGoals.length === 0 && selectedInitiatives.length === 0 && selectedProjects.length === 0) {
        const initIds = new Set(filteredInits.map(i => i.id));
        const objIds = new Set(filteredInits.map(i => i.objectiveId));
        filteredObjs = filteredObjs.filter(o => objIds.has(o.id));
        
        const goalIds = new Set(filteredObjs.map(o => o.goalId));
        filteredGoals = filteredGoals.filter(g => goalIds.has(g.id));
        
        const projIds = new Set(filteredProjs.map(p => p.id));
        filteredProjs = filteredProjs.filter(p => initIds.has(p.initiativeId) || projIds.has(p.id));
      }
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
