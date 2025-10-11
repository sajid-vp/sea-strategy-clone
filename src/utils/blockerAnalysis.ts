export interface BlockerChain {
  taskId: number;
  taskTitle: string;
  projectId?: number;
  projectTitle?: string;
  initiativeId?: number;
  initiativeTitle?: string;
  objectiveId?: number;
  objectiveTitle?: string;
  impactLevel: "high" | "medium" | "low";
  affectedCount: number;
  blockingReason?: string;
}

export interface BlockerChainEnhanced extends BlockerChain {
  owner?: string;
  estimatedDelay?: number;
  isOnCriticalPath?: boolean;
  dependencyChain?: Array<{
    id: number;
    title: string;
    status: string;
  }>;
  recommendedActions?: string[];
}

export interface CriticalPath {
  items: Array<{
    id: string;
    type: "goal" | "objective" | "initiative" | "project" | "task";
    title: string;
    status: string;
  }>;
  totalDuration: number;
  isBlocked: boolean;
}

export const findBlockerChains = (
  tasks: any[],
  projects: any[],
  initiatives: any[]
): BlockerChain[] => {
  const chains: BlockerChain[] = [];
  
  // Find all blocked tasks
  const blockedTasks = tasks.filter(t => t.status === "blocked");
  
  blockedTasks.forEach(task => {
    const project = projects.find(p => p.id === task.projectId);
    const initiative = project ? initiatives.find(i => i.id === project.initiativeId) : null;
    
    // Count how many other tasks depend on this blocked task
    const affectedTasks = tasks.filter(t => 
      t.dependencies && t.dependencies.includes(task.id)
    );
    
    chains.push({
      taskId: task.id,
      taskTitle: task.title,
      projectId: project?.id,
      projectTitle: project?.title,
      initiativeId: initiative?.id,
      initiativeTitle: initiative?.title,
      impactLevel: affectedTasks.length > 3 ? "high" : affectedTasks.length > 1 ? "medium" : "low",
      affectedCount: affectedTasks.length,
      blockingReason: task.blockingReason,
    });
  });
  
  // Sort by impact level and affected count
  return chains.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    const impactDiff = impactOrder[b.impactLevel] - impactOrder[a.impactLevel];
    return impactDiff !== 0 ? impactDiff : b.affectedCount - a.affectedCount;
  });
};

export const findBlockerChainsEnhanced = (
  tasks: any[],
  projects: any[],
  initiatives: any[],
  criticalPath: CriticalPath | null
): BlockerChainEnhanced[] => {
  const chains = findBlockerChains(tasks, projects, initiatives);
  
  // Add overdue items as blockers/risks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const overdueItems: BlockerChain[] = [];
  
  // Find overdue tasks that aren't already blocked
  tasks.forEach(task => {
    if (task.status !== "blocked" && task.status !== "done" && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        const project = projects.find(p => p.id === task.projectId);
        const initiative = project ? initiatives.find(i => i.id === project.initiativeId) : null;
        
        const affectedTasks = tasks.filter(t => 
          t.dependencies && t.dependencies.includes(task.id)
        );
        
        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        overdueItems.push({
          taskId: task.id,
          taskTitle: task.title,
          projectId: project?.id,
          projectTitle: project?.title,
          initiativeId: initiative?.id,
          initiativeTitle: initiative?.title,
          impactLevel: daysOverdue > 7 ? "high" : daysOverdue > 3 ? "medium" : "low",
          affectedCount: affectedTasks.length,
          blockingReason: `Task is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
        });
      }
    }
  });
  
  // Find overdue projects
  projects.forEach(project => {
    if (project.status !== "blocked" && project.status !== "done" && project.dueDate) {
      const dueDate = new Date(project.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        const initiative = initiatives.find(i => i.id === project.initiativeId);
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only add if not already in chains
        const exists = chains.some(c => c.projectId === project.id);
        if (!exists) {
          overdueItems.push({
            taskId: project.id * 1000, // Use large ID to avoid conflicts
            taskTitle: project.title,
            projectId: project.id,
            projectTitle: project.title,
            initiativeId: initiative?.id,
            initiativeTitle: initiative?.title,
            impactLevel: daysOverdue > 7 ? "high" : daysOverdue > 3 ? "medium" : "low",
            affectedCount: projectTasks.length,
            blockingReason: `Project is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
          });
        }
      }
    }
  });
  
  // Combine blocked and overdue items
  const allChains = [...chains, ...overdueItems];
  
  return allChains.map(chain => {
    const task = tasks.find(t => t.id === chain.taskId);
    const project = projects.find(p => p.id === chain.projectId);
    
    // Build dependency chain
    const dependencyChain: Array<{ id: number; title: string; status: string }> = [];
    if (task?.dependencies) {
      task.dependencies.forEach((depId: number) => {
        const depTask = tasks.find(t => t.id === depId);
        if (depTask) {
          dependencyChain.push({
            id: depTask.id,
            title: depTask.title,
            status: depTask.status,
          });
        }
      });
    }
    
    // Check if on critical path
    const isOnCriticalPath = criticalPath?.items.some(
      item => item.id === `project-${chain.projectId}` || item.id === `initiative-${chain.initiativeId}`
    ) || false;
    
    // Generate recommended actions
    const recommendedActions: string[] = [];
    if (chain.impactLevel === "high") {
      recommendedActions.push("Escalate to senior management immediately");
      recommendedActions.push("Allocate additional resources to unblock");
    }
    if (chain.affectedCount > 3) {
      recommendedActions.push("Review and prioritize dependent tasks");
      recommendedActions.push("Consider parallel work streams if possible");
    }
    if (chain.blockingReason?.toLowerCase().includes("approval")) {
      recommendedActions.push("Fast-track approval process");
      recommendedActions.push("Set up daily check-ins with approvers");
    }
    if (chain.blockingReason?.toLowerCase().includes("budget")) {
      recommendedActions.push("Explore alternative funding sources");
      recommendedActions.push("Review scope for cost optimization");
    }
    
    // Estimate delay (simplified calculation)
    const estimatedDelay = chain.affectedCount * 3 + (isOnCriticalPath ? 5 : 0);
    
    return {
      ...chain,
      owner: task?.assignee || project?.owner,
      estimatedDelay,
      isOnCriticalPath,
      dependencyChain,
      recommendedActions: recommendedActions.length > 0 ? recommendedActions : undefined,
    };
  });
};

export const calculateCriticalPath = (
  goals: any[],
  objectives: any[],
  initiatives: any[],
  projects: any[],
  tasks: any[]
): CriticalPath | null => {
  // Find the longest chain from goal to task
  let longestPath: CriticalPath = {
    items: [],
    totalDuration: 0,
    isBlocked: false,
  };
  
  goals.forEach(goal => {
    const goalObjectives = objectives.filter(o => o.goalId === goal.id);
    
    goalObjectives.forEach(objective => {
      const objInitiatives = initiatives.filter(i => i.objectiveId === objective.id);
      
      objInitiatives.forEach(initiative => {
        const initProjects = projects.filter(p => p.initiativeId === initiative.id);
        
        initProjects.forEach(project => {
          const projTasks = tasks.filter(t => t.projectId === project.id);
          
          if (projTasks.length > 0) {
            const path: CriticalPath = {
              items: [
                { id: `goal-${goal.id}`, type: "goal", title: goal.title, status: "on-track" },
                { id: `objective-${objective.id}`, type: "objective", title: objective.title, status: objective.status },
                { id: `initiative-${initiative.id}`, type: "initiative", title: initiative.title, status: initiative.status },
                { id: `project-${project.id}`, type: "project", title: project.title, status: project.status },
              ],
              totalDuration: projTasks.length,
              isBlocked: projTasks.some(t => t.status === "blocked"),
            };
            
            if (path.totalDuration > longestPath.totalDuration) {
              longestPath = path;
            }
          }
        });
      });
    });
  });
  
  return longestPath.items.length > 0 ? longestPath : null;
};

export const getImpactAnalysis = (itemId: string, itemType: string, allData: any) => {
  const { tasks, projects, initiatives, objectives } = allData;
  const affectedItems: string[] = [];
  
  if (itemType === "task") {
    // Find tasks that depend on this task
    const dependentTasks = tasks.filter((t: any) => 
      t.dependencies && t.dependencies.includes(parseInt(itemId))
    );
    affectedItems.push(...dependentTasks.map((t: any) => `Task: ${t.title}`));
    
    // Find the project
    const task = tasks.find((t: any) => t.id === parseInt(itemId));
    if (task?.projectId) {
      const project = projects.find((p: any) => p.id === task.projectId);
      if (project) {
        affectedItems.push(`Project: ${project.title}`);
      }
    }
  } else if (itemType === "project") {
    // Find tasks in this project
    const projectTasks = tasks.filter((t: any) => t.projectId === parseInt(itemId));
    affectedItems.push(`${projectTasks.length} tasks in this project`);
    
    // Find the initiative
    const project = projects.find((p: any) => p.id === parseInt(itemId));
    if (project?.initiativeId) {
      const initiative = initiatives.find((i: any) => i.id === project.initiativeId);
      if (initiative) {
        affectedItems.push(`Initiative: ${initiative.title}`);
      }
    }
  }
  
  return affectedItems;
};
