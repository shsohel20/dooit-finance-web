"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/risk-badge";
import { Bell, BellOff, CheckCircle, Clock, ExternalLink, RefreshCw, User } from "lucide-react";

const mockAlerts = [
  {
    id: "ALT-001",
    type: "new_match",
    title: "New Critical Match Detected",
    description:
      "Existing customer CHEN, Wei Holdings Ltd matched against UN Security Council list update",
    timestamp: "2024-01-15T11:45:00Z",
    riskTier: "critical",
    read: false,
    actionRequired: true,
  },
  {
    id: "ALT-002",
    type: "list_update",
    title: "OFAC SDN List Updated",
    description: "152 new entries added, 23 entries modified, 8 entries removed",
    timestamp: "2024-01-15T10:00:00Z",
    riskTier: "high",
    read: false,
    actionRequired: false,
  },
  {
    id: "ALT-003",
    type: "new_match",
    title: "New High-Risk Match",
    description: "Counterparty NOVAK Trading SA matched against EU Consolidated Sanctions List",
    timestamp: "2024-01-15T09:30:00Z",
    riskTier: "high",
    read: true,
    actionRequired: true,
  },
  {
    id: "ALT-004",
    type: "sla_warning",
    title: "SLA Deadline Approaching",
    description: "Case CASE-2024-003 has 2 hours remaining before SLA breach",
    timestamp: "2024-01-15T08:00:00Z",
    riskTier: "medium",
    read: true,
    actionRequired: true,
  },
  {
    id: "ALT-005",
    type: "status_change",
    title: "Entity Status Changed",
    description: "Previously cleared entity RODRIGUEZ, Carlos has been re-listed on OFAC SDN",
    timestamp: "2024-01-14T16:20:00Z",
    riskTier: "critical",
    read: true,
    actionRequired: true,
  },
];

const listUpdates = [
  { name: "OFAC SDN", lastUpdate: "2 hours ago", additions: 152, removals: 8 },
  { name: "EU Consolidated", lastUpdate: "6 hours ago", additions: 45, removals: 3 },
  { name: "UN Security Council", lastUpdate: "1 day ago", additions: 12, removals: 0 },
  { name: "UK HMT", lastUpdate: "1 day ago", additions: 28, removals: 5 },
  { name: "PEP Database", lastUpdate: "3 hours ago", additions: 234, removals: 12 },
];

export function AlertsDashboard() {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Alerts List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <BellOff className="mr-2 h-4 w-4" />
              Manage Rules
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`transition-all ${!alert.read ? "border-l-4 border-l-primary" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      alert.type === "new_match"
                        ? "bg-red-100 text-red-600"
                        : alert.type === "list_update"
                          ? "bg-blue-100 text-blue-600"
                          : alert.type === "sla_warning"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {alert.type === "new_match" ? (
                      <User className="h-4 w-4" />
                    ) : alert.type === "list_update" ? (
                      <RefreshCw className="h-4 w-4" />
                    ) : alert.type === "sla_warning" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-medium ${!alert.read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {alert.title}
                      </h3>
                      <RiskBadge tier={alert.riskTier} />
                      {!alert.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </span>
                      {alert.actionRequired && (
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          Take Action
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Alert Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unread Alerts</span>
              <Badge className="bg-primary">{mockAlerts.filter((a) => !a.read).length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Action Required</span>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {mockAlerts.filter((a) => a.actionRequired).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today&apos;s Total</span>
              <span className="text-sm font-medium">{mockAlerts.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* List Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">List Update Status</CardTitle>
            <CardDescription>Recent changes to screening lists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listUpdates.map((list, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{list.name}</p>
                    <p className="text-xs text-muted-foreground">{list.lastUpdate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600">+{list.additions}</span>
                    {list.removals > 0 && (
                      <span className="text-red-600 ml-2">-{list.removals}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Continuous Monitoring</span>
              <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Entities Monitored</span>
              <span className="text-sm font-medium">12,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Next Batch Rescreen</span>
              <span className="text-sm text-muted-foreground">In 4 hours</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
