import { useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Calendar, CheckCircle2, User, Users, Flag, TrendingUp,
  DollarSign, AlertTriangle, AlertCircle, FileText, Link2,
  BarChart3, Network, Clock, Printer, ListChecks, Package
} from "lucide-react";

interface ProjectOverviewSnapshotProps {
  project: any;
  parentInitiative: any;
  completedMilestones: number;
  completedTasks: number;
}

export const ProjectOverviewSnapshot = ({
  project,
  parentInitiative,
  completedMilestones,
  completedTasks,
}: ProjectOverviewSnapshotProps) => {
  const snapshotRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    const printContent = snapshotRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${project.title} - Project Snapshot</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1a1a1a; font-size: 12px; }
            .snapshot-header { margin-bottom: 24px; border-bottom: 3px solid #2563eb; padding-bottom: 16px; }
            .snapshot-header h1 { font-size: 22px; margin-bottom: 4px; }
            .snapshot-header p { color: #666; font-size: 11px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
            .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
            .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
            .section { margin-bottom: 20px; break-inside: avoid; }
            .section-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
            .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #fff; }
            .card-accent { border-left: 3px solid #2563eb; }
            .stat-value { font-size: 20px; font-weight: 700; }
            .stat-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
            .badge-green { background: #dcfce7; color: #166534; }
            .badge-yellow { background: #fef9c3; color: #854d0e; }
            .badge-red { background: #fee2e2; color: #991b1b; }
            .badge-blue { background: #dbeafe; color: #1e40af; }
            .badge-gray { background: #f3f4f6; color: #374151; }
            .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-top: 4px; }
            .progress-fill { height: 100%; background: #2563eb; border-radius: 4px; }
            .table { width: 100%; border-collapse: collapse; font-size: 11px; }
            .table th { text-align: left; padding: 6px 8px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; }
            .table td { padding: 6px 8px; border-bottom: 1px solid #f3f4f6; }
            .meta-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .meta-label { color: #666; font-size: 11px; }
            .meta-value { font-weight: 600; font-size: 11px; }
            .team-member { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
            .avatar { width: 24px; height: 24px; border-radius: 50%; background: #dbeafe; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #1e40af; }
            .risk-high { color: #dc2626; font-weight: 600; }
            .risk-medium { color: #d97706; font-weight: 600; }
            .risk-low { color: #6b7280; }
            .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 10px; }
            @media print { body { padding: 16px; } .section { break-inside: avoid; } }
          </style>
        </head>
        <body>
          <div class="snapshot-header">
            <h1>${project.title}</h1>
            <p>${(project as any).code || 'PRJ-001'} • ${project.department} • ${parentInitiative.title}</p>
          </div>

          <!-- Quick Stats -->
          <div class="grid-4">
            <div class="card card-accent">
              <div class="stat-label">Status</div>
              <div class="stat-value" style="font-size:14px;">${project.status.replace('-', ' ').toUpperCase()}</div>
            </div>
            <div class="card card-accent">
              <div class="stat-label">Progress</div>
              <div class="stat-value">${project.progress}%</div>
              <div class="progress-bar"><div class="progress-fill" style="width:${project.progress}%"></div></div>
            </div>
            <div class="card card-accent">
              <div class="stat-label">Budget</div>
              <div class="stat-value" style="font-size:14px;">${project.budget}</div>
              <div style="font-size:10px;color:#666;">Spent: ${(project as any).actualBudget || 'N/A'}</div>
            </div>
            <div class="card card-accent">
              <div class="stat-label">Timeline</div>
              <div style="font-size:11px;font-weight:600;">${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}</div>
            </div>
          </div>

          <!-- Project Info -->
          <div class="section">
            <div class="section-title">📋 Project Information</div>
            <div class="grid-2">
              <div class="card">
                <div class="meta-row"><span class="meta-label">Owner</span><span class="meta-value">${project.owner}</span></div>
                <div class="meta-row"><span class="meta-label">Manager</span><span class="meta-value">${(project as any).manager || project.owner}</span></div>
                <div class="meta-row"><span class="meta-label">Department</span><span class="meta-value">${project.department}</span></div>
                <div class="meta-row"><span class="meta-label">Type</span><span class="meta-value">${(project as any).projectType || 'Strategic'}</span></div>
                <div class="meta-row"><span class="meta-label">Priority</span><span class="meta-value">${(project as any).priority || 'Medium'}</span></div>
              </div>
              <div class="card">
                <div style="font-size:11px;color:#666;margin-bottom:4px;">Description</div>
                <div style="font-size:11px;line-height:1.5;">${project.description}</div>
              </div>
            </div>
          </div>

          <!-- Milestones -->
          <div class="section">
            <div class="section-title">🎯 Milestones (${completedMilestones}/${project.milestones.length} completed)</div>
            <table class="table">
              <thead><tr><th>Milestone</th><th>Due Date</th><th>Progress</th><th>Status</th><th>Deliverables</th></tr></thead>
              <tbody>
                ${project.milestones.map((m: any) => `
                  <tr>
                    <td style="font-weight:500;">${m.name}</td>
                    <td>${new Date(m.dueDate).toLocaleDateString()}</td>
                    <td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle;"><div class="progress-fill" style="width:${m.progress}%"></div></div> ${m.progress}%</td>
                    <td><span class="badge ${m.status === 'done' ? 'badge-green' : m.status === 'blocked' ? 'badge-red' : m.status === 'in-progress' ? 'badge-blue' : 'badge-gray'}">${m.status}</span></td>
                    <td>${m.deliverables?.length || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Tasks -->
          <div class="section">
            <div class="section-title">✅ Tasks (${completedTasks}/${project.tasks.length} completed)</div>
            <table class="table">
              <thead><tr><th>Task</th><th>Assignee</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                ${project.tasks.map((t: any) => `
                  <tr>
                    <td style="font-weight:500;">${t.name}</td>
                    <td>${t.assignee}</td>
                    <td><span class="badge ${t.priority === 'high' ? 'badge-red' : t.priority === 'medium' ? 'badge-yellow' : 'badge-gray'}">${t.priority}</span></td>
                    <td><span class="badge ${t.status === 'done' ? 'badge-green' : t.status === 'blocked' ? 'badge-red' : t.status === 'in-progress' ? 'badge-blue' : 'badge-gray'}">${t.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Budget -->
          <div class="section">
            <div class="section-title">💰 Budget Summary</div>
            <div class="grid-3">
              <div class="card card-accent"><div class="stat-label">Planned</div><div class="stat-value" style="font-size:16px;">${project.budget}</div></div>
              <div class="card card-accent"><div class="stat-label">Actual Spent</div><div class="stat-value" style="font-size:16px;">${(project as any).actualBudget || 'N/A'}</div></div>
              <div class="card card-accent"><div class="stat-label">Remaining</div><div class="stat-value" style="font-size:16px;">${(project as any).actualBudget ? `AED ${(parseFloat(project.budget.replace(/[^0-9.]/g, '')) - parseFloat((project as any).actualBudget.replace(/[^0-9.]/g, ''))).toFixed(2)}` : project.budget}</div></div>
            </div>
          </div>

          <!-- Risks & Issues -->
          ${(project as any).risks?.length > 0 || (project as any).issues?.length > 0 ? `
          <div class="section">
            <div class="section-title">⚠️ Risks & Issues</div>
            <div class="grid-2">
              <div>
                <div style="font-weight:600;margin-bottom:6px;font-size:11px;">Risks (${(project as any).risks?.length || 0})</div>
                ${((project as any).risks || []).map((r: any) => `
                  <div class="card" style="margin-bottom:6px;">
                    <div style="font-weight:500;margin-bottom:4px;">${r.description}</div>
                    <div style="font-size:10px;">Likelihood: <span class="risk-${r.likelihood}">${r.likelihood}</span> | Impact: <span class="risk-${r.impact}">${r.impact}</span> | Owner: ${r.owner}</div>
                  </div>
                `).join('')}
              </div>
              <div>
                <div style="font-weight:600;margin-bottom:6px;font-size:11px;">Issues (${(project as any).issues?.length || 0})</div>
                ${((project as any).issues || []).map((i: any) => `
                  <div class="card" style="margin-bottom:6px;">
                    <div style="font-weight:500;margin-bottom:4px;">${i.description}</div>
                    <div style="font-size:10px;">Status: <span class="badge ${i.status === 'open' ? 'badge-red' : 'badge-green'}">${i.status}</span> | Owner: ${i.owner}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          ` : ''}

          <!-- KPIs -->
          <div class="section">
            <div class="section-title">📊 KPIs</div>
            <div class="grid-3">
              ${project.kpis.map((kpi: string) => `
                <div class="card"><div style="font-weight:500;">${kpi}</div></div>
              `).join('')}
            </div>
          </div>

          <!-- Team -->
          <div class="section">
            <div class="section-title">👥 Team & Stakeholders</div>
            <div class="grid-2">
              <div class="card">
                <div style="font-weight:600;margin-bottom:6px;font-size:11px;">Team Members</div>
                <div class="team-member"><div class="avatar">${project.owner.split(' ').map((n: string) => n[0]).join('')}</div><span>${project.owner} (Owner)</span></div>
                ${project.team.map((m: string) => `<div class="team-member"><div class="avatar">${m.split(' ').map((n: string) => n[0]).join('')}</div><span>${m}</span></div>`).join('')}
              </div>
              <div class="card">
                <div style="font-weight:600;margin-bottom:6px;font-size:11px;">Stakeholders</div>
                ${(project.stakeholders || []).map((s: string) => `<div class="team-member"><div class="avatar">${s.split(' ').map((n: string) => n[0]).join('')}</div><span>${s}</span></div>`).join('')}
              </div>
            </div>
          </div>

          <!-- Dependencies -->
          ${(project as any).dependencies?.length > 0 ? `
          <div class="section">
            <div class="section-title">🔗 Dependencies</div>
            <table class="table">
              <thead><tr><th>Type</th><th>Project</th><th>Status</th></tr></thead>
              <tbody>
                ${(project as any).dependencies.map((d: any) => `
                  <tr><td>${d.type}</td><td>${d.project}</td><td><span class="badge badge-blue">${d.status}</span></td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="footer">
            Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • ${project.title} Project Snapshot
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium": return "bg-warning/10 text-warning border-warning/30";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const openRisks = ((project as any).risks || []).filter((r: any) => r.status === 'open').length;
  const openIssues = ((project as any).issues || []).filter((i: any) => i.status === 'open').length;
  const tasksByStatus = project.tasks.reduce((acc: any, t: any) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6" ref={snapshotRef}>
      {/* Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Snapshot</h3>
          <p className="text-sm text-muted-foreground">Comprehensive overview of all project dimensions</p>
        </div>
        <Button onClick={handleExportPDF} className="gap-2">
          <Printer className="h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Progress</p>
          <p className="text-2xl font-bold">{project.progress}%</p>
          <Progress value={project.progress} className="h-1.5 mt-2" />
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Milestones</p>
          <p className="text-2xl font-bold">{completedMilestones}/{project.milestones.length}</p>
          <p className="text-xs text-muted-foreground mt-1">completed</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Tasks</p>
          <p className="text-2xl font-bold">{completedTasks}/{project.tasks.length}</p>
          <p className="text-xs text-muted-foreground mt-1">completed</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-destructive">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Open Risks</p>
          <p className="text-2xl font-bold">{openRisks}</p>
          <p className="text-xs text-muted-foreground mt-1">{openIssues} open issues</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
          <p className="text-lg font-bold">{project.budget}</p>
          <p className="text-xs text-muted-foreground mt-1">Spent: {(project as any).actualBudget || 'N/A'}</p>
        </Card>
      </div>

      {/* Project Info + Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground text-xs">Owner</p><p className="font-semibold">{project.owner}</p></div>
              <div><p className="text-muted-foreground text-xs">Manager</p><p className="font-semibold">{(project as any).manager || project.owner}</p></div>
              <div><p className="text-muted-foreground text-xs">Department</p><p className="font-semibold">{project.department}</p></div>
              <div><p className="text-muted-foreground text-xs">Start Date</p><p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p></div>
              <div><p className="text-muted-foreground text-xs">End Date</p><p className="font-semibold">{new Date(project.endDate).toLocaleDateString()}</p></div>
              <div><p className="text-muted-foreground text-xs">Priority</p><Badge variant="outline" className={getPriorityColor((project as any).priority || 'medium')}>{(project as any).priority || 'Medium'}</Badge></div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Parent Initiative</p>
              <Link to={`/initiatives/${parentInitiative.id}`}>
                <p className="text-sm font-semibold text-primary hover:underline">{parentInitiative.title}</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Team Snapshot */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Team ({1 + project.team.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded bg-accent/50">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{project.owner.split(' ').map((n: string) => n[0]).join('')}</span>
                </div>
                <div><p className="text-sm font-semibold">{project.owner}</p><p className="text-xs text-muted-foreground">Owner</p></div>
              </div>
              {project.team.map((member: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 p-1">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{member.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                  <p className="text-sm">{member}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Flag className="h-4 w-4 text-primary" />
            Milestones Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.milestones.map((milestone: any) => (
              <div key={milestone.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{milestone.name}</span>
                    <StatusBadge status={milestone.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(milestone.dueDate).toLocaleDateString()}</span>
                    {milestone.deliverables?.length > 0 && (
                      <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {milestone.deliverables.filter((d: any) => d.status === 'done').length}/{milestone.deliverables.length} deliverables</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 w-32">
                  <Progress value={milestone.progress} className="h-2 flex-1" />
                  <span className="text-xs font-semibold w-8 text-right">{milestone.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            Tasks Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <StatusBadge status={status as any} />
                <span className="font-semibold">{count as number}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {project.tasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.name}</span>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> {task.assignee}</span>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget + KPIs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-accent/30">
                <p className="text-xs text-muted-foreground">Planned</p>
                <p className="text-lg font-bold">{project.budget}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/30">
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-bold">{(project as any).actualBudget || 'N/A'}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-lg font-bold text-primary">
                  {(project as any).actualBudget
                    ? `AED ${(parseFloat(project.budget.replace(/[^0-9.]/g, '')) - parseFloat((project as any).actualBudget.replace(/[^0-9.]/g, ''))).toFixed(2)}`
                    : project.budget}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {project.kpis.map((kpi: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-2 border rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{kpi}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risks & Issues */}
      {((project as any).risks?.length > 0 || (project as any).issues?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(project as any).risks?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Risks ({(project as any).risks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(project as any).risks.map((risk: any) => (
                    <div key={risk.id} className="p-3 border rounded-lg text-sm space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="font-medium">{risk.description}</span>
                        <Badge variant={risk.status === 'open' ? 'destructive' : 'secondary'} className="text-xs">{risk.status}</Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Likelihood: <span className={getRiskColor(risk.likelihood)}>{risk.likelihood}</span></span>
                        <span>Impact: <span className={getRiskColor(risk.impact)}>{risk.impact}</span></span>
                        <span>Owner: {risk.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(project as any).issues?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Issues ({(project as any).issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(project as any).issues.map((issue: any) => (
                    <div key={issue.id} className="p-3 border rounded-lg text-sm space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="font-medium">{issue.description}</span>
                        <Badge variant={issue.status === 'open' ? 'destructive' : 'secondary'} className="text-xs">{issue.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Owner: {issue.owner}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Dependencies */}
      {(project as any).dependencies?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(project as any).dependencies.map((dep: any) => (
                <div key={dep.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">{dep.type}</p>
                    <p className="font-medium">{dep.project}</p>
                  </div>
                  <StatusBadge status={dep.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.activities.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span><strong>{activity.user}</strong> {activity.action}: {activity.detail}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
