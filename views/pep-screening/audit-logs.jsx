"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter, Eye, FileText, UserCheck, Settings, Shield } from "lucide-react";

const mockLogs = [
  {
    id: "LOG-001",
    action: "screening_performed",
    description: "Single entity screening performed",
    details: 'Query: "Vladimir Petrov" - 3 matches found',
    user: "John Doe",
    timestamp: "2024-01-15T11:45:32Z",
    ipAddress: "192.168.1.100",
  },
  {
    id: "LOG-002",
    action: "case_decision",
    description: "Case marked as False Positive",
    details: "CASE-2024-005 - Rationale: Entity verified via passport check",
    user: "Jane Smith",
    timestamp: "2024-01-15T11:30:15Z",
    ipAddress: "192.168.1.101",
  },
  {
    id: "LOG-003",
    action: "case_escalation",
    description: "Case escalated to MLRO",
    details: "CASE-2024-003 - High-risk match requiring senior review",
    user: "John Doe",
    timestamp: "2024-01-15T11:15:00Z",
    ipAddress: "192.168.1.100",
  },
  {
    id: "LOG-004",
    action: "config_change",
    description: "Scoring threshold modified",
    details: "Match threshold changed from 70% to 65% for PEP screening",
    user: "Admin User",
    timestamp: "2024-01-15T10:45:00Z",
    ipAddress: "192.168.1.50",
  },
  {
    id: "LOG-005",
    action: "bulk_screening",
    description: "Bulk screening completed",
    details: "Batch ID: BATCH-2024-012 - 1,250 entities screened, 45 matches",
    user: "System",
    timestamp: "2024-01-15T10:00:00Z",
    ipAddress: "N/A",
  },
  {
    id: "LOG-006",
    action: "user_login",
    description: "User logged in",
    details: "Successful authentication via SSO",
    user: "John Doe",
    timestamp: "2024-01-15T09:00:00Z",
    ipAddress: "192.168.1.100",
  },
  {
    id: "LOG-007",
    action: "case_approval",
    description: "Case decision approved",
    details: "CASE-2024-002 - False Positive decision approved by senior analyst",
    user: "Senior Analyst",
    timestamp: "2024-01-15T08:45:00Z",
    ipAddress: "192.168.1.102",
  },
  {
    id: "LOG-008",
    action: "report_generated",
    description: "Compliance report generated",
    details: "Weekly screening summary report exported to PDF",
    user: "Jane Smith",
    timestamp: "2024-01-15T08:30:00Z",
    ipAddress: "192.168.1.101",
  },
];

const actionConfig = {
  screening_performed: { icon: Search, className: "bg-blue-100 text-blue-600" },
  case_decision: { icon: UserCheck, className: "bg-emerald-100 text-emerald-600" },
  case_escalation: { icon: Shield, className: "bg-amber-100 text-amber-600" },
  config_change: { icon: Settings, className: "bg-purple-100 text-purple-600" },
  bulk_screening: { icon: FileText, className: "bg-blue-100 text-blue-600" },
  user_login: { icon: UserCheck, className: "bg-slate-100 text-slate-600" },
  case_approval: { icon: UserCheck, className: "bg-emerald-100 text-emerald-600" },
  report_generated: { icon: FileText, className: "bg-slate-100 text-slate-600" },
};

export function AuditLogs() {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Audit Trail</h2>
          <p className="text-sm text-muted-foreground">
            Immutable record of all screening activities and system changes
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search audit logs..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="case">Case Decisions</SelectItem>
                <SelectItem value="config">Configuration</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="admin">Admin User</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="today">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past 7 Days</SelectItem>
                <SelectItem value="month">Past 30 Days</SelectItem>
                <SelectItem value="quarter">Past 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    IP Address
                  </th>
                  <th className="w-10 p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockLogs.map((log) => {
                  const config = actionConfig[log.action];
                  const IconComponent = config?.icon || FileText;
                  return (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <span className="font-mono text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full ${config?.className}`}
                          >
                            <IconComponent className="h-3.5 w-3.5" />
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.action.replace("_", " ")}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium">{log.description}</p>
                          <p className="text-xs text-muted-foreground">{log.details}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{log.user}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-sm text-muted-foreground">
                          {log.ipAddress}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">Showing 1-8 of 1,247 entries</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
