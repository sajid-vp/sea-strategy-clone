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
  
  // Create flow layout
  const { nodes, edges } = useMemo(() => {
    return createHierarchicalLayout(
      goals,
      filteredObjectives,
      filteredInitiatives,
      projects,
      tasks
    );
  }, [goals, filteredObjectives, filteredInitiatives, projects, tasks]);
  
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
  
  // Blocker analysis
  const blockerChains = useMemo(() => {
    return findBlockerChains(tasks, projects, filteredInitiatives);
  }, [tasks, projects, filteredInitiatives]);
  
  // Critical path
  const criticalPath = useMemo(() => {
    return calculateCriticalPath(goals, filteredObjectives, filteredInitiatives, projects, tasks);
  }, [goals, filteredObjectives, filteredInitiatives, projects, tasks]);
  
  // Statistics
  const stats = useMemo(() => {
    const allStatuses = [...filteredInitiatives, ...projects, ...tasks].map(item => item.status);
    return {
      totalBlocked: allStatuses.filter(s => s === "blocked").length,
      totalAtRisk: allStatuses.filter(s => s === "in-review").length,
      totalOnTrack: allStatuses.filter(s => s === "in-progress").length,
      totalDone: allStatuses.filter(s => s === "done").length,
      totalItems: allStatuses.length,
      onTrackPercentage: Math.round((allStatuses.filter(s => s === "in-progress" || s === "done").length / allStatuses.length) * 100),
    };
  }, [filteredInitiatives, projects, tasks]);
  
  return {
    nodes: searchedNodes,
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
  };
};
