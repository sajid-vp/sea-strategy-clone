type Status = "todo" | "in-progress" | "in-review" | "blocked" | "done";

export interface Activity {
  id: number;
  title: string;
  description: string;
  type: "meeting" | "operational" | "support" | "review" | "planning";
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "one-time";
  status: Status;
  owner: string;
  participants: string[];
  project?: string;
  projectId?: number;
  program?: string;
  programId?: number;
  startDate: string;
  nextOccurrence: string;
  duration: number; // in minutes
  location?: string;
  notes?: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: "Sprint Planning",
    description: "Plan the upcoming sprint and assign tasks to team members",
    type: "planning",
    frequency: "bi-weekly",
    status: "in-progress",
    owner: "Sarah Johnson",
    participants: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez"],
    project: "Cloud Migration",
    projectId: 1,
    startDate: "2025-01-05",
    nextOccurrence: "2025-01-19",
    duration: 120,
    location: "Conference Room A",
    notes: "Review backlog and prioritize items for next sprint",
  },
  {
    id: 2,
    title: "Daily Stand-up",
    description: "Quick sync on progress, blockers, and plans for the day",
    type: "meeting",
    frequency: "daily",
    status: "in-progress",
    owner: "Michael Chen",
    participants: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim"],
    project: "Cloud Migration",
    projectId: 1,
    startDate: "2025-01-02",
    nextOccurrence: "2025-01-15",
    duration: 15,
    location: "Virtual - Teams",
    notes: "Keep it brief and focused",
  },
  {
    id: 3,
    title: "Security Review",
    description: "Review security measures and compliance requirements",
    type: "review",
    frequency: "weekly",
    status: "in-progress",
    owner: "David Kim",
    participants: ["David Kim", "Sarah Johnson", "Security Team"],
    project: "Security Enhancement",
    projectId: 2,
    startDate: "2025-01-03",
    nextOccurrence: "2025-01-17",
    duration: 60,
    location: "Conference Room B",
    notes: "Review recent vulnerability scans and penetration test results",
  },
  {
    id: 4,
    title: "Infrastructure Monitoring",
    description: "Monitor system performance and address any issues",
    type: "operational",
    frequency: "daily",
    status: "in-progress",
    owner: "IT Operations",
    participants: ["IT Operations Team"],
    startDate: "2025-01-01",
    nextOccurrence: "2025-01-15",
    duration: 30,
    notes: "Check dashboards, logs, and alert systems",
  },
  {
    id: 5,
    title: "Stakeholder Update",
    description: "Provide project updates to key stakeholders",
    type: "meeting",
    frequency: "monthly",
    status: "in-progress",
    owner: "Sarah Johnson",
    participants: ["Sarah Johnson", "Executive Team", "Department Heads"],
    project: "Cloud Migration",
    projectId: 1,
    startDate: "2025-01-10",
    nextOccurrence: "2025-02-10",
    duration: 90,
    location: "Executive Boardroom",
    notes: "Prepare slides with project metrics and milestone updates",
  },
  {
    id: 6,
    title: "Help Desk Support",
    description: "Provide technical support to end users",
    type: "support",
    frequency: "daily",
    status: "in-progress",
    owner: "Support Team",
    participants: ["Support Team"],
    startDate: "2025-01-01",
    nextOccurrence: "2025-01-15",
    duration: 480,
    notes: "Monitor ticket queue and respond to user requests",
  },
  {
    id: 7,
    title: "Sprint Retrospective",
    description: "Reflect on the past sprint and identify improvements",
    type: "review",
    frequency: "bi-weekly",
    status: "done",
    owner: "Emily Rodriguez",
    participants: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim"],
    project: "Cloud Migration",
    projectId: 1,
    startDate: "2025-01-04",
    nextOccurrence: "2025-01-18",
    duration: 90,
    location: "Conference Room A",
    notes: "Discuss what went well and what could be improved",
  },
  {
    id: 8,
    title: "Budget Review",
    description: "Review project expenses and budget allocation",
    type: "review",
    frequency: "quarterly",
    status: "todo",
    owner: "Finance Team",
    participants: ["Finance Team", "Project Managers"],
    startDate: "2025-01-15",
    nextOccurrence: "2025-04-15",
    duration: 120,
    location: "Finance Department",
    notes: "Compare actual vs planned expenses across all projects",
  },
  {
    id: 9,
    title: "Program Governance Meeting",
    description: "Review program progress, decisions, and escalations",
    type: "meeting",
    frequency: "monthly",
    status: "in-progress",
    owner: "Sarah Johnson",
    participants: ["Sarah Johnson", "John Smith", "Executive Sponsors"],
    program: "Digital Infrastructure Modernization",
    programId: 1,
    startDate: "2025-01-10",
    nextOccurrence: "2025-02-10",
    duration: 90,
    location: "Executive Boardroom",
    notes: "Review program KPIs, budget, risks, and dependencies",
  },
  {
    id: 10,
    title: "Infrastructure Health Check",
    description: "Regular operational review of infrastructure performance",
    type: "operational",
    frequency: "weekly",
    status: "in-progress",
    owner: "IT Operations",
    participants: ["IT Operations Team", "Sarah Johnson"],
    program: "Digital Infrastructure Modernization",
    programId: 1,
    startDate: "2025-01-02",
    nextOccurrence: "2025-01-16",
    duration: 45,
    notes: "Review system metrics, capacity planning, and incident reports",
  },
  {
    id: 11,
    title: "Learning Platform Operations",
    description: "Daily operational activities for the learning platform",
    type: "operational",
    frequency: "daily",
    status: "in-progress",
    owner: "Platform Team",
    participants: ["Platform Team", "Support Staff"],
    program: "Digital Learning Platform",
    programId: 2,
    startDate: "2025-02-01",
    nextOccurrence: "2025-01-15",
    duration: 60,
    notes: "Monitor platform performance, user support, content updates",
  },
  {
    id: 12,
    title: "Faculty Training Sessions",
    description: "Training faculty on new digital learning tools",
    type: "support",
    frequency: "weekly",
    status: "in-progress",
    owner: "Robert Martinez",
    participants: ["Robert Martinez", "Training Team", "Faculty"],
    program: "Digital Learning Platform",
    programId: 2,
    startDate: "2025-02-05",
    nextOccurrence: "2025-01-18",
    duration: 120,
    location: "Training Room",
    notes: "Hands-on training with Q&A session",
  },
];

export const getActivityById = (id: number) => activities.find(a => a.id === id);

export const getActivitiesByProject = (projectId: number) => 
  activities.filter(a => a.projectId === projectId);

export const getActivitiesByProgram = (programId: number) => 
  activities.filter(a => a.programId === programId);

export const getActivitiesByStatus = (status: Status) => 
  activities.filter(a => a.status === status);

export const getActivitiesByFrequency = (frequency: string) => 
  activities.filter(a => a.frequency === frequency);
