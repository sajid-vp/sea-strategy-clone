export const initiatives = [
  {
    id: 1,
    title: "Develop and Implement IT infrastructure",
    projects: [
      {
        id: 1,
        title: "ISO 27001 Implementation",
        code: "PRJ-2025-001",
        status: "in-progress" as const,
        owner: "John Smith",
        manager: "John Smith",
        team: ["Sarah Johnson", "Mike Chen"],
        progress: 75,
        startDate: "2025-01-15",
        endDate: "2025-06-30",
        budget: "AED 1,000.00",
        actualBudget: "AED 750.00",
        department: "IT Security",
        projectType: "Strategic",
        priority: "high" as const,
        kpis: ["Security Compliance Rate", "Incident Response Time", "Policy Adherence"],
        stakeholders: ["CTO", "Legal Team", "Compliance Officer"],
        description: "Implement ISO 27001 information security management system across the organization to ensure data protection and compliance.",
        purpose: "To establish a robust information security management system (ISMS) that protects organizational data assets, ensures regulatory compliance, and builds stakeholder confidence in our security posture.",
        projectObjectives: [
          "Achieve ISO 27001 certification by Q2 2025",
          "Reduce security incidents by 80% within 6 months of implementation",
          "Establish a continuous improvement framework for information security"
        ],
        keyDeliverables: [
          "Gap Analysis Report",
          "Information Security Policy Manual",
          "Risk Assessment Framework",
          "Security Controls Implementation",
          "Internal Audit Report",
          "ISO 27001 Certificate"
        ],
        scope: {
          description: "The project covers all IT systems, data centers, and digital assets across the organization's three main offices. Includes policy development, technical controls implementation, staff training, and certification audit.",
          attachments: [
            { name: "Project Scope Document v2.1.pdf", uploadedDate: "2025-01-15" }
          ]
        },
        assumptions: [
          "All departments will allocate dedicated resources for security training",
          "External auditor availability for Q2 2025 certification audit",
          "Current IT infrastructure supports required security controls",
          "Management will approve budget for additional security tools"
        ],
        constraints: [
          "Certification must be achieved before end of Q2 2025",
          "Budget limited to AED 1,000.00",
          "Cannot disrupt ongoing business operations during implementation",
          "Must comply with UAE data protection regulations"
        ],
        objectives: [
          { id: 1, title: "Achieve ISO 27001 certification", description: "Complete all requirements for ISO 27001 certification by Q2 2025", metrics: "100% compliance score" },
          { id: 2, title: "Enhance security posture", description: "Reduce security incidents by 80%", metrics: "Incident count < 5 per month" }
        ],
        successCriteria: ["ISO 27001 certification achieved", "Zero critical security incidents", "All policies documented and approved"],
        risks: [
          { id: 1, description: "Resource availability constraints", likelihood: "medium", impact: "high", mitigation: "Hire external consultants as backup", status: "open" as const, owner: "John Smith" },
          { id: 2, description: "Audit delays due to incomplete documentation", likelihood: "low", impact: "medium", mitigation: "Weekly documentation reviews", status: "monitoring" as const, owner: "Sarah Johnson" }
        ],
        issues: [
          { id: 1, description: "Delay in policy approval from legal team", status: "open" as const, owner: "John Smith", resolution: "Escalated to CTO for priority review" }
        ],
        documents: [
          { id: 1, name: "ISO 27001 Project Plan.pdf", type: "Project Plan", uploadedBy: "John Smith", uploadedDate: "2025-01-15" },
          { id: 2, name: "Security Policies v1.2.docx", type: "Documentation", uploadedBy: "Sarah Johnson", uploadedDate: "2025-01-20" }
        ],
        dependencies: [
          { id: 1, type: "Depends on", project: "Network Infrastructure Upgrade", status: "in-progress" as const }
        ],
        milestones: [
          { 
            id: 1, 
            name: "Gap Analysis", 
            dueDate: "2025-02-15", 
            progress: 100, 
            status: "done" as const,
            dependencies: [],
            deliverables: [
              { id: 1, name: "Gap Analysis Report", status: "done" as const, description: "Comprehensive report identifying security gaps", completedDate: "2025-02-10" },
              { id: 2, name: "Risk Assessment Document", status: "done" as const, description: "Initial risk assessment findings", completedDate: "2025-02-14" }
            ]
          },
          { 
            id: 2, 
            name: "Policy Documentation", 
            dueDate: "2025-03-30", 
            progress: 80, 
            status: "in-progress" as const,
            dependencies: [1],
            deliverables: [
              { id: 3, name: "Security Policy Manual", status: "in-progress" as const, description: "Complete security policies documentation" },
              { id: 4, name: "Employee Guidelines", status: "done" as const, description: "Security guidelines for staff", completedDate: "2025-03-15" }
            ]
          },
          { 
            id: 3, 
            name: "Security Controls Implementation", 
            dueDate: "2025-05-15", 
            progress: 60, 
            status: "in-progress" as const,
            dependencies: [2],
            deliverables: [
              { id: 5, name: "Access Control System", status: "in-progress" as const, description: "Implement role-based access controls" },
              { id: 6, name: "Encryption Standards", status: "todo" as const, description: "Deploy encryption across systems" }
            ]
          },
          { 
            id: 4, 
            name: "Internal Audit", 
            dueDate: "2025-06-15", 
            progress: 0, 
            status: "todo" as const,
            dependencies: [3],
            deliverables: [
              { id: 7, name: "Audit Report", status: "todo" as const, description: "Internal audit findings and recommendations" }
            ]
          },
          { 
            id: 5, 
            name: "Certification Audit", 
            dueDate: "2025-06-30", 
            progress: 0, 
            status: "todo" as const,
            dependencies: [4],
            deliverables: [
              { id: 8, name: "ISO 27001 Certificate", status: "todo" as const, description: "Official certification document" }
            ]
          },
        ],
        tasks: [
          // Gap Analysis milestone tasks
          { id: 1, name: "Identify current security controls", status: "done" as const, priority: "high" as const, assignee: "John Smith", dependencies: [], subtasks: [], milestoneId: 1, startDate: "2025-01-15", endDate: "2025-01-25" },
          { id: 2, name: "Interview department heads", status: "done" as const, priority: "medium" as const, assignee: "Sarah Johnson", dependencies: [1], subtasks: [], milestoneId: 1, startDate: "2025-01-25", endDate: "2025-02-05" },
          { id: 3, name: "Document security gaps", status: "done" as const, priority: "high" as const, assignee: "John Smith", dependencies: [2], subtasks: [], milestoneId: 1, startDate: "2025-02-05", endDate: "2025-02-15" },
          // Policy Documentation milestone tasks
          { id: 4, name: "Draft information security policy", status: "done" as const, priority: "high" as const, assignee: "Sarah Johnson", dependencies: [3], subtasks: [], milestoneId: 2, startDate: "2025-02-15", endDate: "2025-03-01" },
          { id: 5, name: "Create access control procedures", status: "in-progress" as const, priority: "high" as const, assignee: "Mike Chen", dependencies: [4], subtasks: [], milestoneId: 2, startDate: "2025-03-01", endDate: "2025-03-15" },
          { id: 6, name: "Review & approve policies", status: "todo" as const, priority: "medium" as const, assignee: "John Smith", dependencies: [5], subtasks: [], milestoneId: 2, startDate: "2025-03-15", endDate: "2025-03-30" },
          // Security Controls Implementation milestone tasks
          { id: 7, name: "Configure firewall rules", status: "in-progress" as const, priority: "high" as const, assignee: "Mike Chen", dependencies: [4], subtasks: [], milestoneId: 3, startDate: "2025-03-01", endDate: "2025-04-01" },
          { id: 8, name: "Deploy endpoint protection", status: "in-progress" as const, priority: "medium" as const, assignee: "Mike Chen", dependencies: [7], subtasks: [], milestoneId: 3, startDate: "2025-04-01", endDate: "2025-04-25" },
          { id: 9, name: "Set up SIEM monitoring", status: "todo" as const, priority: "medium" as const, assignee: "Sarah Johnson", dependencies: [8], subtasks: [], milestoneId: 3, startDate: "2025-04-25", endDate: "2025-05-15" },
          // Internal Audit milestone tasks
          { id: 10, name: "Prepare audit checklist", status: "todo" as const, priority: "medium" as const, assignee: "John Smith", dependencies: [9], subtasks: [], milestoneId: 4, startDate: "2025-05-15", endDate: "2025-05-25" },
          { id: 11, name: "Conduct internal audit", status: "todo" as const, priority: "high" as const, assignee: "John Smith", dependencies: [10], subtasks: [], milestoneId: 4, startDate: "2025-05-25", endDate: "2025-06-05" },
          { id: 12, name: "Write audit findings report", status: "todo" as const, priority: "medium" as const, assignee: "Sarah Johnson", dependencies: [11], subtasks: [], milestoneId: 4, startDate: "2025-06-05", endDate: "2025-06-15" },
          // Certification Audit milestone tasks
          { id: 13, name: "Schedule external auditor", status: "todo" as const, priority: "high" as const, assignee: "John Smith", dependencies: [12], subtasks: [], milestoneId: 5, startDate: "2025-06-15", endDate: "2025-06-20" },
          { id: 14, name: "Conduct certification audit", status: "todo" as const, priority: "high" as const, assignee: "Sarah Johnson", dependencies: [13], subtasks: [], milestoneId: 5, startDate: "2025-06-20", endDate: "2025-06-27" },
          { id: 15, name: "Address non-conformities", status: "todo" as const, priority: "high" as const, assignee: "Mike Chen", dependencies: [14], subtasks: [], milestoneId: 5, startDate: "2025-06-27", endDate: "2025-06-30" },
        ],
        activities: [
          { id: 1, user: "John Smith", action: "updated milestone", detail: "Policy Documentation", timestamp: "2025-01-08 10:30" },
          { id: 2, user: "Sarah Johnson", action: "completed task", detail: "Gap Analysis", timestamp: "2025-01-07 15:45" },
        ],
      },
      {
        id: 2,
        title: "Smart Campus Infrastructure",
        code: "PRJ-2025-002",
        status: "in-progress" as const,
        owner: "Sarah Johnson",
        manager: "Sarah Johnson",
        team: ["Emma Wilson", "Tom Martinez"],
        progress: 60,
        startDate: "2025-02-01",
        endDate: "2025-08-31",
        budget: "AED 2,500.00",
        actualBudget: "AED 1,800.00",
        department: "IT Operations",
        projectType: "IT",
        priority: "medium" as const,
        kpis: ["System Uptime", "Energy Efficiency", "User Satisfaction"],
        stakeholders: ["Facilities Manager", "Campus Director", "Sustainability Team"],
        description: "Deploy smart campus infrastructure including IoT sensors, automated systems, and integrated management platform.",
        purpose: "To modernize campus operations through IoT technology, improving energy efficiency, operational visibility, and user experience across all campus facilities.",
        projectObjectives: [
          "Deploy 500+ IoT sensors across campus by Q3 2025",
          "Achieve 95% system uptime for all smart infrastructure",
          "Reduce energy consumption by 20% through automated systems"
        ],
        keyDeliverables: [
          "IoT Sensor Network",
          "Central Management Platform",
          "Automated HVAC Controls",
          "Smart Lighting System",
          "Real-time Dashboard"
        ],
        scope: {
          description: "Covers all campus buildings including main block, admin offices, and recreation center. Includes hardware procurement, installation, software integration, and staff training.",
          attachments: []
        },
        assumptions: [
          "Existing network infrastructure can support IoT bandwidth requirements",
          "Vendor delivery timelines will be met as per contracts",
          "Building access will be provided for sensor installation"
        ],
        constraints: [
          "Installation cannot disrupt classes or operations",
          "Must integrate with existing building management systems",
          "Budget capped at AED 2,500.00"
        ],
        objectives: [
          { id: 1, title: "Deploy IoT infrastructure", description: "Install 500+ IoT sensors across campus by Q3 2025", metrics: "500 sensors installed" }
        ],
        successCriteria: ["95% system uptime", "20% energy reduction", "User satisfaction > 85%"],
        risks: [],
        issues: [],
        documents: [],
        dependencies: [],
        milestones: [
          { id: 6, name: "Requirements Analysis", dueDate: "2025-02-28", progress: 100, status: "done" as const, deliverables: [] },
          { id: 7, name: "Vendor Selection", dueDate: "2025-03-15", progress: 100, status: "done" as const, deliverables: [] },
          { id: 8, name: "Hardware Installation", dueDate: "2025-06-15", progress: 50, status: "in-progress" as const, deliverables: [] },
          { id: 9, name: "Software Integration", dueDate: "2025-07-31", progress: 30, status: "in-review" as const, deliverables: [] },
          { id: 10, name: "Testing & Deployment", dueDate: "2025-08-31", progress: 0, status: "todo" as const, deliverables: [] },
        ],
        tasks: [
          // Requirements Analysis milestone tasks
          { id: 16, name: "Survey campus infrastructure", status: "done" as const, priority: "high" as const, assignee: "Sarah Johnson", dependencies: [], subtasks: [], milestoneId: 6, startDate: "2025-02-01", endDate: "2025-02-14" },
          { id: 17, name: "Define IoT sensor requirements", status: "done" as const, priority: "high" as const, assignee: "Emma Wilson", dependencies: [16], subtasks: [], milestoneId: 6, startDate: "2025-02-14", endDate: "2025-02-28" },
          // Vendor Selection milestone tasks
          { id: 18, name: "Issue RFP to vendors", status: "done" as const, priority: "high" as const, assignee: "Sarah Johnson", dependencies: [17], subtasks: [], milestoneId: 7, startDate: "2025-02-28", endDate: "2025-03-08" },
          { id: 19, name: "Evaluate vendor proposals", status: "done" as const, priority: "medium" as const, assignee: "Emma Wilson", dependencies: [18], subtasks: [], milestoneId: 7, startDate: "2025-03-08", endDate: "2025-03-15" },
          // Hardware Installation milestone tasks
          { id: 20, name: "Install building sensors", status: "in-progress" as const, priority: "high" as const, assignee: "Tom Martinez", dependencies: [19], subtasks: [], milestoneId: 8, startDate: "2025-03-15", endDate: "2025-05-01" },
          { id: 21, name: "Wire network cabling", status: "in-progress" as const, priority: "high" as const, assignee: "Tom Martinez", dependencies: [20], subtasks: [], milestoneId: 8, startDate: "2025-05-01", endDate: "2025-06-15" },
          // Software Integration milestone tasks
          { id: 22, name: "Configure management platform", status: "in-review" as const, priority: "high" as const, assignee: "Emma Wilson", dependencies: [21], subtasks: [], milestoneId: 9, startDate: "2025-06-15", endDate: "2025-07-15" },
          { id: 23, name: "Integrate HVAC controls", status: "todo" as const, priority: "medium" as const, assignee: "Emma Wilson", dependencies: [22], subtasks: [], milestoneId: 9, startDate: "2025-07-15", endDate: "2025-07-31" },
          // Testing & Deployment milestone tasks
          { id: 24, name: "Run system stress tests", status: "todo" as const, priority: "medium" as const, assignee: "Sarah Johnson", dependencies: [23], subtasks: [], milestoneId: 10, startDate: "2025-07-31", endDate: "2025-08-15" },
          { id: 25, name: "Go-live deployment", status: "todo" as const, priority: "high" as const, assignee: "Tom Martinez", dependencies: [24], subtasks: [], milestoneId: 10, startDate: "2025-08-15", endDate: "2025-08-31" },
        ],
        activities: [
          { id: 3, user: "Emma Wilson", action: "flagged issue", detail: "Software Integration delays", timestamp: "2025-01-08 09:15" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Digital Transformation initiatives",
    projects: [
      {
        id: 3,
        title: "Unified Mobile App Development",
        status: "blocked" as const,
        owner: "David Brown",
        team: ["Lisa Anderson", "Chris Taylor"],
        progress: 30,
        startDate: "2025-01-10",
        endDate: "2025-07-15",
        budget: "AED 1,800.00",
        department: "Digital Services",
        kpis: ["User Adoption Rate", "App Performance", "Feature Completion"],
        stakeholders: ["Student Affairs", "IT Director", "Marketing Team"],
        description: "Develop a unified mobile application that integrates all campus services and information for students, staff, and parents.",
        purpose: "To provide a single-point digital interface for all campus stakeholders, consolidating services and improving engagement.",
        projectObjectives: [
          "Launch unified mobile app with 10+ integrated services",
          "Achieve 70% user adoption rate within first 3 months",
          "Maintain app performance score above 90/100"
        ],
        keyDeliverables: [
          "Mobile App (iOS & Android)",
          "Backend API Services",
          "Admin Dashboard",
          "User Onboarding Guide"
        ],
        scope: {
          description: "Development of cross-platform mobile application integrating student portal, library, cafeteria, events, and communication modules.",
          attachments: [
            { name: "Mobile App Requirements Spec.pdf", uploadedDate: "2025-01-10" }
          ]
        },
        assumptions: [
          "Third-party APIs for existing services are available and documented",
          "App store approval process will take no more than 2 weeks"
        ],
        constraints: [
          "Must support iOS 15+ and Android 12+",
          "Backend API dependencies on infrastructure project",
          "Limited to 2 frontend developers"
        ],
        milestones: [
          { id: 11, name: "UI/UX Design", dueDate: "2025-02-28", progress: 100, status: "done" as const, deliverables: [] },
          { id: 12, name: "Backend API Development", dueDate: "2025-04-30", progress: 40, status: "blocked" as const, deliverables: [] },
          { id: 13, name: "Frontend Development", dueDate: "2025-06-15", progress: 25, status: "in-review" as const, deliverables: [] },
          { id: 14, name: "Integration Testing", dueDate: "2025-07-01", progress: 0, status: "todo" as const, deliverables: [] },
          { id: 15, name: "Beta Testing", dueDate: "2025-07-15", progress: 0, status: "todo" as const, deliverables: [] },
        ],
        tasks: [
          // UI/UX Design milestone tasks
          { id: 26, name: "Create wireframes", status: "done" as const, priority: "high" as const, assignee: "Lisa Anderson", dependencies: [], subtasks: [], milestoneId: 11, startDate: "2025-01-10", endDate: "2025-02-01" },
          { id: 27, name: "Design UI component library", status: "done" as const, priority: "high" as const, assignee: "Lisa Anderson", dependencies: [26], subtasks: [], milestoneId: 11, startDate: "2025-02-01", endDate: "2025-02-28" },
          // Backend API Development milestone tasks
          { id: 28, name: "Design API schema", status: "done" as const, priority: "high" as const, assignee: "David Brown", dependencies: [27], subtasks: [], milestoneId: 12, startDate: "2025-02-28", endDate: "2025-03-15" },
          { id: 29, name: "Build authentication endpoints", status: "blocked" as const, priority: "high" as const, assignee: "David Brown", dependencies: [28], subtasks: [], milestoneId: 12, startDate: "2025-03-15", endDate: "2025-04-10" },
          { id: 30, name: "Build service endpoints", status: "blocked" as const, priority: "high" as const, assignee: "David Brown", dependencies: [29], subtasks: [], milestoneId: 12, startDate: "2025-04-10", endDate: "2025-04-30" },
          // Frontend Development milestone tasks
          { id: 31, name: "Implement navigation & routing", status: "in-review" as const, priority: "high" as const, assignee: "Chris Taylor", dependencies: [27], subtasks: [], milestoneId: 13, startDate: "2025-02-28", endDate: "2025-04-15" },
          { id: 32, name: "Build feature screens", status: "in-progress" as const, priority: "high" as const, assignee: "Chris Taylor", dependencies: [31], subtasks: [], milestoneId: 13, startDate: "2025-04-15", endDate: "2025-06-15" },
          // Integration Testing milestone tasks
          { id: 33, name: "Write integration test cases", status: "todo" as const, priority: "medium" as const, assignee: "Lisa Anderson", dependencies: [30, 32], subtasks: [], milestoneId: 14, startDate: "2025-06-15", endDate: "2025-06-25" },
          { id: 34, name: "Execute end-to-end tests", status: "todo" as const, priority: "medium" as const, assignee: "Lisa Anderson", dependencies: [33], subtasks: [], milestoneId: 14, startDate: "2025-06-25", endDate: "2025-07-01" },
          // Beta Testing milestone tasks
          { id: 35, name: "Recruit beta testers", status: "todo" as const, priority: "medium" as const, assignee: "David Brown", dependencies: [34], subtasks: [], milestoneId: 15, startDate: "2025-07-01", endDate: "2025-07-08" },
          { id: 36, name: "Collect & analyze feedback", status: "todo" as const, priority: "low" as const, assignee: "Lisa Anderson", dependencies: [35], subtasks: [], milestoneId: 15, startDate: "2025-07-08", endDate: "2025-07-15" },
        ],
        activities: [
          { id: 4, user: "David Brown", action: "requested additional resources", detail: "Backend development team", timestamp: "2025-01-07 14:20" },
          { id: 5, user: "Lisa Anderson", action: "completed milestone", detail: "UI/UX Design", timestamp: "2025-01-06 11:30" },
        ],
      },
      {
        id: 4,
        title: "AI-Driven Business Intelligence",
        status: "in-review" as const,
        owner: "Rachel Green",
        team: ["Jennifer Lee", "Michael Scott"],
        progress: 45,
        startDate: "2025-03-01",
        endDate: "2025-09-30",
        budget: "AED 3,200.00",
        department: "Analytics",
        kpis: ["Data Accuracy", "Insight Generation Rate", "User Engagement"],
        stakeholders: ["Executive Team", "Data Analysts", "Department Heads"],
        description: "Implement AI-powered business intelligence dashboards to provide real-time insights and predictive analytics for decision-making.",
        purpose: "To enable data-driven decision-making through AI-powered analytics, providing leadership with real-time insights and predictive capabilities.",
        projectObjectives: [
          "Integrate 15+ data sources into unified analytics platform",
          "Deploy predictive models with 85%+ accuracy",
          "Train 50+ users on BI dashboard usage"
        ],
        keyDeliverables: [
          "Data Integration Pipeline",
          "AI Analytics Dashboard",
          "Predictive Models Suite",
          "Training Materials & Workshops"
        ],
        scope: {
          description: "Covers data integration from all major systems (ERP, CRM, HR), AI model development, dashboard creation, and end-user training across all departments.",
          attachments: []
        },
        assumptions: [
          "Data quality from source systems is sufficient for analytics",
          "Cloud infrastructure for AI model training is available",
          "Department heads will champion adoption in their teams"
        ],
        constraints: [
          "Must comply with data privacy regulations",
          "AI model training requires GPU compute resources",
          "Historical data availability limited to 3 years"
        ],
        milestones: [
          { id: 16, name: "Data Source Integration", dueDate: "2025-04-15", progress: 70, status: "in-progress" as const, deliverables: [] },
          { id: 17, name: "Dashboard Development", dueDate: "2025-06-30", progress: 35, status: "in-review" as const, deliverables: [] },
          { id: 18, name: "AI Model Training", dueDate: "2025-08-15", progress: 20, status: "in-review" as const, deliverables: [] },
          { id: 19, name: "User Training", dueDate: "2025-09-30", progress: 0, status: "todo" as const, deliverables: [] },
        ],
        tasks: [
          // Data Source Integration milestone tasks
          { id: 37, name: "Map ERP data schema", status: "done" as const, priority: "high" as const, assignee: "Rachel Green", dependencies: [], subtasks: [], milestoneId: 16, startDate: "2025-03-01", endDate: "2025-03-20" },
          { id: 38, name: "Build ETL pipelines", status: "in-progress" as const, priority: "high" as const, assignee: "Rachel Green", dependencies: [37], subtasks: [], milestoneId: 16, startDate: "2025-03-20", endDate: "2025-04-10" },
          { id: 39, name: "Validate data quality", status: "todo" as const, priority: "medium" as const, assignee: "Jennifer Lee", dependencies: [38], subtasks: [], milestoneId: 16, startDate: "2025-04-10", endDate: "2025-04-15" },
          // Dashboard Development milestone tasks
          { id: 40, name: "Design dashboard layouts", status: "in-review" as const, priority: "high" as const, assignee: "Jennifer Lee", dependencies: [38], subtasks: [], milestoneId: 17, startDate: "2025-04-10", endDate: "2025-05-15" },
          { id: 41, name: "Implement chart components", status: "in-progress" as const, priority: "high" as const, assignee: "Jennifer Lee", dependencies: [40], subtasks: [], milestoneId: 17, startDate: "2025-05-15", endDate: "2025-06-30" },
          // AI Model Training milestone tasks
          { id: 42, name: "Prepare training datasets", status: "in-review" as const, priority: "high" as const, assignee: "Michael Scott", dependencies: [38], subtasks: [], milestoneId: 18, startDate: "2025-04-10", endDate: "2025-05-30" },
          { id: 43, name: "Train predictive models", status: "todo" as const, priority: "high" as const, assignee: "Michael Scott", dependencies: [42], subtasks: [], milestoneId: 18, startDate: "2025-05-30", endDate: "2025-08-15" },
          // User Training milestone tasks
          { id: 44, name: "Create training materials", status: "todo" as const, priority: "low" as const, assignee: "Rachel Green", dependencies: [41, 43], subtasks: [], milestoneId: 19, startDate: "2025-08-15", endDate: "2025-09-10" },
          { id: 45, name: "Conduct training workshops", status: "todo" as const, priority: "low" as const, assignee: "Rachel Green", dependencies: [44], subtasks: [], milestoneId: 19, startDate: "2025-09-10", endDate: "2025-09-30" },
        ],
        activities: [
          { id: 6, user: "Rachel Green", action: "updated progress", detail: "Data Source Integration at 70%", timestamp: "2025-01-08 08:00" },
        ],
      },
    ],
  },
];

export const getAllProjects = () => {
  return initiatives.flatMap(initiative => 
    initiative.projects.map(project => ({
      ...project,
      initiativeId: initiative.id,
      initiativeTitle: initiative.title,
    }))
  );
};
