import { differenceInDays, parseISO } from "date-fns";

interface TaskWithDates {
  id: number;
  startDate?: string;
  endDate?: string;
  dependencies: number[];
}

interface CriticalPathResult {
  criticalTaskIds: Set<number>;
  taskSlack: Map<number, number>; // taskId → slack in days
}

export function computeCriticalPath(tasks: TaskWithDates[]): CriticalPathResult {
  const empty: CriticalPathResult = { criticalTaskIds: new Set(), taskSlack: new Map() };
  if (!tasks || tasks.length === 0) return empty;

  // Filter tasks that have dates
  const dated = tasks.filter((t) => t.startDate && t.endDate);
  if (dated.length === 0) return empty;

  const taskMap = new Map(dated.map((t) => [t.id, t]));

  // Calculate duration in days for each task
  const duration = new Map<number, number>();
  dated.forEach((t) => {
    duration.set(t.id, Math.max(differenceInDays(parseISO(t.endDate!), parseISO(t.startDate!)), 1));
  });

  // Forward pass: earliest start (ES) and earliest finish (EF)
  const es = new Map<number, number>();
  const ef = new Map<number, number>();

  // Topological order via Kahn's algorithm
  const inDegree = new Map<number, number>();
  const adj = new Map<number, number[]>(); // from → to

  dated.forEach((t) => {
    inDegree.set(t.id, 0);
    adj.set(t.id, []);
  });

  dated.forEach((t) => {
    const validDeps = t.dependencies.filter((d) => taskMap.has(d));
    inDegree.set(t.id, validDeps.length);
    validDeps.forEach((d) => {
      adj.get(d)?.push(t.id);
    });
  });

  const queue: number[] = [];
  dated.forEach((t) => {
    if ((inDegree.get(t.id) || 0) === 0) queue.push(t.id);
  });

  const topoOrder: number[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    topoOrder.push(id);
    for (const next of adj.get(id) || []) {
      const deg = (inDegree.get(next) || 1) - 1;
      inDegree.set(next, deg);
      if (deg === 0) queue.push(next);
    }
  }

  // Forward pass
  topoOrder.forEach((id) => {
    const task = taskMap.get(id)!;
    const validDeps = task.dependencies.filter((d) => taskMap.has(d));
    const earliest = validDeps.length === 0 ? 0 : Math.max(...validDeps.map((d) => ef.get(d) || 0));
    es.set(id, earliest);
    ef.set(id, earliest + (duration.get(id) || 1));
  });

  // Project finish = max of all EF
  const projectFinish = Math.max(...Array.from(ef.values()), 0);

  // Backward pass: latest finish (LF) and latest start (LS)
  const ls = new Map<number, number>();
  const lf = new Map<number, number>();

  // Initialize all LF to projectFinish
  dated.forEach((t) => lf.set(t.id, projectFinish));

  // Reverse topological order
  for (let i = topoOrder.length - 1; i >= 0; i--) {
    const id = topoOrder[i];
    const successors = adj.get(id) || [];
    const latestFinish = successors.length === 0 ? projectFinish : Math.min(...successors.map((s) => ls.get(s) || projectFinish));
    lf.set(id, latestFinish);
    ls.set(id, latestFinish - (duration.get(id) || 1));
  }

  // Calculate slack and identify critical tasks
  const criticalTaskIds = new Set<number>();
  const taskSlack = new Map<number, number>();

  topoOrder.forEach((id) => {
    const slack = (ls.get(id) || 0) - (es.get(id) || 0);
    taskSlack.set(id, slack);
    if (slack === 0) {
      criticalTaskIds.add(id);
    }
  });

  return { criticalTaskIds, taskSlack };
}
