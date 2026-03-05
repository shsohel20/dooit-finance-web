"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  complianceMetrics,
  keyRiskIndicators,
  controlEffectiveness,
  regulatoryCalendar,
} from "@/lib/dashboard-data";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ComplianceStatus() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Compliance Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">AML/CTF Assurance Metrics</p>
          </div>
          <Badge
            variant={complianceMetrics.auditReady.status === "READY" ? "default" : "secondary"}
            className={cn(
              "text-xs",
              complianceMetrics.auditReady.status === "READY" &&
                "bg-success text-success-foreground",
            )}
          >
            <Shield className="h-3 w-3 mr-1" />
            {complianceMetrics.auditReady.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main Compliance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricItem
            label="SMR Compliance"
            value={`${complianceMetrics.smrCompliance.value}%`}
            change={complianceMetrics.smrCompliance.change}
          />
          <MetricItem
            label="ECDD On-time"
            value={`${complianceMetrics.ecddOnTime.value}%`}
            change={complianceMetrics.ecddOnTime.change}
          />
          <MetricItem
            label="Training Rate"
            value={`${complianceMetrics.trainingRate.value}%`}
            change={complianceMetrics.trainingRate.change}
          />
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">Last Audit</p>
            <p className="text-lg font-bold text-foreground">
              {complianceMetrics.auditReady.lastAudit}
            </p>
          </div>
        </div>

        {/* Key Risk Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Key Risk Indicators (KRI)</h4>
          <div className="space-y-2">
            {keyRiskIndicators.map((kri) => (
              <div key={kri.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{kri.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {kri.isCount ? kri.value : `${kri.value}%`}
                    </span>
                    {kri.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
                {!kri.isCount && (
                  <Progress
                    value={kri.value}
                    className={cn(
                      "h-1.5",
                      kri.status === "success" ? "[&>div]:bg-success" : "[&>div]:bg-warning",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Control Effectiveness */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Control Effectiveness</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-secondary/50 text-center">
              <p className="text-lg font-bold text-foreground">{controlEffectiveness.automated}%</p>
              <p className="text-xs text-muted-foreground">Automated</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50 text-center">
              <p className="text-lg font-bold text-foreground">{controlEffectiveness.manual}%</p>
              <p className="text-xs text-muted-foreground">Manual</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50 text-center">
              <p className="text-lg font-bold text-foreground">
                {controlEffectiveness.documentation}%
              </p>
              <p className="text-xs text-muted-foreground">Documentation</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
            <span className="text-sm text-foreground">Overall Effectiveness</span>
            <span className="text-xl font-bold text-primary">{controlEffectiveness.overall}%</span>
          </div>
        </div>

        {/* Regulatory Calendar */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Regulatory Calendar
          </h4>
          <div className="space-y-2">
            {regulatoryCalendar.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 text-sm"
              >
                <span className="text-foreground">{item.name}</span>
                {item.status === "pending" && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.daysLeft} days left
                  </Badge>
                )}
                {item.status === "overdue" && (
                  <Badge variant="destructive" className="text-xs">
                    {item.overdue} overdue
                  </Badge>
                )}
                {item.status === "complete" && (
                  <Badge className="text-xs bg-success text-success-foreground">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {item.completed} filed
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value, change }) {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="p-3 rounded-lg bg-secondary/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <div
        className={cn(
          "flex items-center gap-1 text-xs mt-1",
          isPositive ? "text-success" : "text-destructive",
        )}
      >
        <TrendIcon className="h-3 w-3" />
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
  );
}
