"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
} from "lucide-react";

export function TrainingDashboard() {
  // Mock dashboard stats
  const stats = {
    totalRecords: 7,
    compliantCount: 5,
    dueSoonCount: 1,
    overdueCount: 1,
    compliancePercentage: 71,
    byDepartment: [
      {
        department: "Payments Operations",
        compliantCount: 1,
        totalCount: 1,
        percentage: 100,
      },
      {
        department: "Tax Services",
        compliantCount: 1,
        totalCount: 1,
        percentage: 100,
      },
      {
        department: "Conveyancing",
        compliantCount: 1,
        totalCount: 1,
        percentage: 100,
      },
      {
        department: "Sales",
        compliantCount: 1,
        totalCount: 1,
        percentage: 100,
      },
      {
        department: "Retail Operations",
        compliantCount: 1,
        totalCount: 1,
        percentage: 100,
      },
      {
        department: "Compliance",
        compliantCount: 0,
        totalCount: 1,
        percentage: 0,
      },
      { department: "Audit", compliantCount: 0, totalCount: 1, percentage: 0 },
    ],
    recentActivity: [
      {
        id: "1",
        type: "completion",
        participantName: "Chloe Li",
        trainingTopic: "Cash & Bullion Transactions",
        timestamp: "2024-11-01T10:00:00Z",
      },
      {
        id: "2",
        type: "acknowledgment",
        participantName: "Amelia Rodriguez",
        trainingTopic: "ECDD for Real Estate",
        timestamp: "2024-11-06T14:20:00Z",
      },
      {
        id: "3",
        type: "completion",
        participantName: "David Jones",
        trainingTopic: "Client SOF & Tax Evasion Risks",
        timestamp: "2024-10-22T16:45:00Z",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Compliance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.compliancePercentage}%
            </div>
            <Progress value={stats.compliancePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.compliantCount} of {stats.totalRecords} compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.compliantCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Training up to date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.dueSoonCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdueCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requires immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Compliance Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance by Department</CardTitle>
          <CardDescription>
            Training compliance percentage across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.byDepartment.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dept.department}</span>
                  <span className="text-muted-foreground">
                    {dept.compliantCount}/{dept.totalCount} ({dept.percentage}%)
                  </span>
                </div>
                <Progress value={dept.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest training completions and acknowledgments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-1">
                  {activity.type === "completion" ? (
                    <FileText className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {activity.participantName}{" "}
                    {activity.type === "completion"
                      ? "completed"
                      : "acknowledged"}{" "}
                    training
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.trainingTopic}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
