type Status = "planned" | "active" | "on-hold" | "closed";

export interface Program {
  id: number;
  title: string;
  code: string;
  description: string;
  status: Status;
  initiativeId: number;
  initiativeTitle?: string;
  owner: string;
  manager: string;
  startDate: string;
  endDate?: string;
  budget: string;
  actualBudget?: string;
  objectives: string[];
  scope: string;
  kpis: Array<{
    name: string;
    target: string;
    current: string;
    unit: string;
  }>;
  team: string[];
  stakeholders: string[];
  risks: Array<{
    id: number;
    description: string;
    impact: "high" | "medium" | "low";
    likelihood: "high" | "medium" | "low";
    mitigation: string;
  }>;
  documents: Array<{
    id: number;
    name: string;
    type: string;
    url: string;
  }>;
  progress: number;
}

export const programs: Program[] = [
  {
    id: 1,
    title: "Digital Infrastructure Modernization",
    code: "PRG-001",
    description: "Comprehensive program to modernize IT infrastructure and enhance security across the organization",
    status: "active",
    initiativeId: 1,
    owner: "John Smith",
    manager: "Sarah Johnson",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    budget: "$5,000,000",
    actualBudget: "$2,100,000",
    objectives: [
      "Migrate all critical systems to cloud infrastructure",
      "Enhance security posture and compliance",
      "Improve system reliability and performance",
      "Reduce operational costs by 30%"
    ],
    scope: "This program encompasses cloud migration, security enhancement, and infrastructure optimization across all IT systems. It includes multiple projects focused on different aspects of digital transformation.",
    kpis: [
      { name: "Cloud Migration", target: "100%", current: "45%", unit: "%" },
      { name: "Security Compliance", target: "100%", current: "75%", unit: "%" },
      { name: "Cost Reduction", target: "30%", current: "12%", unit: "%" },
      { name: "System Uptime", target: "99.9%", current: "98.5%", unit: "%" }
    ],
    team: ["Sarah Johnson", "Michael Chen", "David Kim", "Emily Rodriguez"],
    stakeholders: ["CTO", "IT Department", "Security Team", "Finance"],
    risks: [
      {
        id: 1,
        description: "Cloud migration may cause temporary service disruptions",
        impact: "high",
        likelihood: "medium",
        mitigation: "Implement phased migration with comprehensive testing"
      },
      {
        id: 2,
        description: "Budget overruns due to unforeseen technical complexity",
        impact: "medium",
        likelihood: "medium",
        mitigation: "Maintain 20% contingency reserve and regular budget reviews"
      }
    ],
    documents: [
      { id: 1, name: "Program Charter", type: "PDF", url: "#" },
      { id: 2, name: "Strategic Roadmap", type: "PDF", url: "#" },
      { id: 3, name: "Governance Framework", type: "DOCX", url: "#" }
    ],
    progress: 42
  },
  {
    id: 2,
    title: "Digital Learning Platform",
    code: "PRG-002",
    description: "Program to develop and implement a comprehensive digital learning ecosystem",
    status: "active",
    initiativeId: 2,
    owner: "Dr. Lisa Wang",
    manager: "Robert Martinez",
    startDate: "2025-02-01",
    endDate: "2026-06-30",
    budget: "$3,500,000",
    actualBudget: "$1,200,000",
    objectives: [
      "Deploy modern learning management system",
      "Integrate AI-powered personalized learning",
      "Enhance student engagement by 40%",
      "Support hybrid learning models"
    ],
    scope: "Comprehensive digital learning platform including LMS deployment, content creation tools, student portal enhancement, and integration with existing academic systems.",
    kpis: [
      { name: "Platform Adoption", target: "90%", current: "35%", unit: "%" },
      { name: "Student Satisfaction", target: "85%", current: "72%", unit: "%" },
      { name: "Content Availability", target: "100%", current: "58%", unit: "%" },
      { name: "System Performance", target: "99%", current: "96%", unit: "%" }
    ],
    team: ["Robert Martinez", "Jennifer Lee", "Alex Thompson", "Maria Garcia"],
    stakeholders: ["Dean of Students", "Faculty", "IT Department", "Academic Affairs"],
    risks: [
      {
        id: 1,
        description: "Faculty resistance to new platform adoption",
        impact: "high",
        likelihood: "medium",
        mitigation: "Comprehensive training program and change management"
      },
      {
        id: 2,
        description: "Integration challenges with legacy systems",
        impact: "medium",
        likelihood: "high",
        mitigation: "Early integration testing and fallback options"
      }
    ],
    documents: [
      { id: 1, name: "Program Plan", type: "PDF", url: "#" },
      { id: 2, name: "Requirements Document", type: "DOCX", url: "#" },
      { id: 3, name: "Training Materials", type: "PDF", url: "#" }
    ],
    progress: 38
  },
  {
    id: 3,
    title: "Student Success Initiative",
    code: "PRG-003",
    description: "Multi-faceted program to improve student retention, engagement, and success outcomes",
    status: "planned",
    initiativeId: 2,
    owner: "Dr. Michael Stevens",
    manager: "Amanda Wilson",
    startDate: "2025-06-01",
    endDate: "2027-05-31",
    budget: "$2,800,000",
    objectives: [
      "Increase student retention rate by 15%",
      "Improve graduation rates",
      "Enhance student support services",
      "Implement early intervention systems"
    ],
    scope: "Holistic program addressing academic support, mental health services, career counseling, and student portal enhancements to create a comprehensive student success ecosystem.",
    kpis: [
      { name: "Retention Rate", target: "85%", current: "70%", unit: "%" },
      { name: "Student Engagement", target: "80%", current: "65%", unit: "%" },
      { name: "Support Utilization", target: "60%", current: "40%", unit: "%" },
      { name: "Graduation Rate", target: "75%", current: "68%", unit: "%" }
    ],
    team: ["Amanda Wilson", "Patricia Brown", "Kevin Zhang", "Sophia Anderson"],
    stakeholders: ["Student Affairs", "Academic Advisors", "Counseling Services", "Alumni Relations"],
    risks: [
      {
        id: 1,
        description: "Low student participation in support programs",
        impact: "high",
        likelihood: "medium",
        mitigation: "Peer ambassador program and incentive structures"
      }
    ],
    documents: [
      { id: 1, name: "Program Proposal", type: "PDF", url: "#" },
      { id: 2, name: "Research Summary", type: "PDF", url: "#" }
    ],
    progress: 5
  }
];

export const getProgramById = (id: number) => programs.find(p => p.id === id);

export const getProgramsByInitiative = (initiativeId: number) => 
  programs.filter(p => p.initiativeId === initiativeId);

export const getProgramsByStatus = (status: Status) => 
  programs.filter(p => p.status === status);
