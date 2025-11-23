"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { ReportsList } from "./reports-list";
import { SuspiciousMatterReportForm } from "@/components/smr-form";
import { ECDDForm } from "@/components/ecdd-form";
import { IFTIForm } from "@/components/ifti-form";
import { TTRForm } from "@/components/ttr-form";
import { GFSForm } from "@/components/gfs-form";
import { RiskAssessmentDashboard } from "@/components/risk-assessment/dashboard";

export default function RiskAssessmentSection() {
  const [activeReport, setActiveReport] = useState("overview");
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [editingReportId, setEditingReportId] = useState(null);

  const reportTypes = [
    { id: "smr", label: "SMR", description: "Suspicious Matter Reports" },
    {
      id: "ecdd",
      label: "ECDD",
      description: "Enhanced Customer Due Diligence",
    },
    {
      id: "ifti",
      label: "IFTI",
      description: "International Funds Transfer Instructions",
    },
    { id: "ttr", label: "TTR", description: "Threshold Transaction Reports" },
    { id: "gfs", label: "GFS", description: "Grounds for Suspicion" },
  ];

  const handleViewReports = (type) => {
    setSelectedReportType(type);
    setActiveReport("list");
  };

  const handleCreateReport = (type) => {
    setEditingReportId(null);
    setActiveReport(type);
  };

  const handleEditReport = (reportId, type) => {
    setEditingReportId(reportId);
    setActiveReport(type);
  };

  if (activeReport === "list" && selectedReportType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setActiveReport("overview")}>
            ← Back to Reports
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {reportTypes.find((r) => r.id === selectedReportType)?.label}{" "}
              Reports
            </h2>
            <p className="text-muted-foreground">
              {
                reportTypes.find((r) => r.id === selectedReportType)
                  ?.description
              }
            </p>
          </div>
        </div>

        <ReportsList
          reportType={selectedReportType}
          onCreateNew={() => handleCreateReport(selectedReportType)}
          onEditReport={(id) => handleEditReport(id, selectedReportType)}
        />
      </div>
    );
  }

  if (activeReport === "overview") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <Card
              key={report.id}
              className="hover:border-primary transition-colors"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {report.label}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleCreateReport(report.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create {report.label}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleViewReports(report.id)}
                >
                  View All {report.label}
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
              <CardDescription>
                Institutional & Customer Risk Management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setActiveReport("risk-assessment")}
              >
                Open Risk Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Draft Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">
                Across all report types
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">42</p>
              <p className="text-xs text-muted-foreground">
                Submitted to AUSTRAC
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveReport("overview")}>
          ← Back to Reports
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {reportTypes.find((r) => r.id === activeReport)?.label ||
              "Risk Assessment"}
          </h2>
          <p className="text-muted-foreground">
            {reportTypes.find((r) => r.id === activeReport)?.description ||
              "Institutional & Customer Risk Management"}
          </p>
        </div>
      </div>

      {activeReport === "smr" && (
        <SuspiciousMatterReportForm reportId={editingReportId} />
      )}
      {activeReport === "ecdd" && <ECDDForm reportId={editingReportId} />}
      {activeReport === "ifti" && <IFTIForm reportId={editingReportId} />}
      {activeReport === "ttr" && <TTRForm reportId={editingReportId} />}
      {activeReport === "gfs" && <GFSForm reportId={editingReportId} />}
      {activeReport === "risk-assessment" && <RiskAssessmentDashboard />}
    </div>
  );
}
