

## Critical Path in the Gantt Chart — What's Needed

### What is a Critical Path?
The critical path is the **longest chain of dependent tasks** that determines the minimum project duration. Any delay on a critical-path task delays the entire project. Tasks NOT on the critical path have "slack" (can be delayed without affecting the end date).

### What You Already Have
Your task data already includes `dependencies: number[]` — this is the foundation. The dependency chains are well-defined (e.g., Task 1 → 2 → 3 → 4 → 5 → 6, and Task 4 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15).

### What's Missing (to implement)

**1. Task-level start/end dates**
Currently tasks don't have `startDate` / `endDate` or `duration` fields. The Gantt chart estimates positions proportionally from milestone dates. For a real critical path, each task needs explicit or calculated dates.

**2. Critical Path Algorithm**
A forward/backward pass algorithm to:
- **Forward pass**: Calculate earliest start/finish for each task based on dependencies
- **Backward pass**: Calculate latest start/finish without delaying the project
- **Float/Slack**: `Latest Start - Earliest Start`. Tasks with **zero slack** are on the critical path.

**3. Visual highlighting**
Render critical-path task bars with a distinct style (red border or highlight) and optionally connect them with a bold dependency line.

### Implementation Plan

**Data layer** (`projectsData.ts`):
- Add `startDate` and `endDate` (or `duration` in days) to each task in the sample data.

**Algorithm** (new utility or inside `GanttChart.tsx`):
- Build a dependency graph from tasks.
- Forward pass: compute `earlyStart` and `earlyFinish` for each task.
- Backward pass: compute `lateStart` and `lateFinish`.
- Mark tasks where `lateStart === earlyStart` as critical.

**Gantt view** (`GanttChart.tsx`):
- Add a "Show Critical Path" toggle in the toolbar.
- When active, highlight critical-path bars (red/orange border, bolder color) and dim non-critical tasks slightly.
- Render critical-path dependency arrows in red with a thicker stroke.

**List view** (`GanttChart.tsx`):
- Add a "Critical" badge/indicator column for tasks on the critical path.

### Scope
- 3 files changed: `projectsData.ts` (add dates to tasks), `GanttChart.tsx` (algorithm + toggle + visuals), possibly a small `criticalPath.ts` utility.
- No new dependencies needed.

