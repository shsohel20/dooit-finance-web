"use client";

import {
  FileText,
  UserCheck,
  ArrowRightLeft,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const REPORT_TYPES = [
  {
    id: "smr",
    title: "SMR",
    fullTitle: "Suspicious Matter Report",
    icon: FileText,
    description: "Report suspicious activities to AUSTRAC",
  },
  {
    id: "ecdd",
    title: "ECDD",
    fullTitle: "Enhanced Customer Due Diligence",
    icon: UserCheck,
    description: "Generate customer due diligence reports",
  },
  {
    id: "ifti",
    title: "IFTI",
    fullTitle: "International Funds Transfer Instruction",
    icon: ArrowRightLeft,
    description: "Report international fund transfers",
  },
  {
    id: "ttr",
    title: "TTR",
    fullTitle: "Threshold Transaction Report",
    icon: DollarSign,
    description: "Report transactions of $10,000 or more",
  },
  {
    id: "gfs",
    title: "GFS",
    fullTitle: "Grounds for Suspicion",
    icon: AlertTriangle,
    description: "Generate formatted suspicion reports",
  },
];

export function ReportNavigation({ activeReport, onReportChange }) {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Compliance Reporting System
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isActive = activeReport === report.id;

          return (
            <Card
              key={report.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                isActive
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-muted hover:border-primary/50"
              }`}
              onClick={() => onReportChange(report.id)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {report.fullTitle}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {report.description}
                  </p>
                </div>
                {isActive && (
                  <Button
                    size="sm"
                    className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Active
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
