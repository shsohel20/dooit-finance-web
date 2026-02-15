"use client";

import { useState } from "react";

import { RiskAssessmentDashboard } from "@/components/risk-assessment/dashboard";

export default function RiskAssessmentSection() {
  // if (activeReport === "list" && selectedReportType) {
  //   return (
  //     <div className="space-y-6">
  //       <div className="flex items-center gap-4">
  //         <Button variant="outline" onClick={() => setActiveReport("overview")}>
  //           ← Back to Reports
  //         </Button>
  //         <div>
  //           <h2 className="text-2xl font-bold">
  //             {reportTypes.find((r) => r.id === selectedReportType)?.label}{" "}
  //             Reports
  //           </h2>
  //           <p className="text-muted-foreground">
  //             {
  //               reportTypes.find((r) => r.id === selectedReportType)
  //                 ?.description
  //             }
  //           </p>
  //         </div>
  //       </div>

  //       <ReportsList
  //         reportType={selectedReportType}
  //         onCreateNew={() => handleCreateReport(selectedReportType)}
  //         onEditReport={(id) => handleEditReport(id, selectedReportType)}
  //       />
  //     </div>
  //   );
  // }

  // if (activeReport === "overview") {
  //   return (
  //     <div className="space-y-6">
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //         {reportTypes.map((report) => (
  //           <Card
  //             key={report.id}
  //             className="hover:border-primary transition-colors"
  //           >
  //             <CardHeader>
  //               <CardTitle className="flex items-center gap-2">
  //                 <FileText className="h-5 w-5" />
  //                 {report.label}
  //               </CardTitle>
  //               <CardDescription>{report.description}</CardDescription>
  //             </CardHeader>
  //             <CardContent className="space-y-2">
  //               <Button
  //                 className="w-full"
  //                 onClick={() => handleCreateReport(report.id)}
  //               >
  //                 <Plus className="h-4 w-4 mr-2" />
  //                 Create {report.label}
  //               </Button>
  //               <Button
  //                 variant="outline"
  //                 className="w-full bg-transparent"
  //                 onClick={() => handleViewReports(report.id)}
  //               >
  //                 View All {report.label}
  //               </Button>
  //             </CardContent>
  //           </Card>
  //         ))}

  //         <Card className="hover:border-primary transition-colors">
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <FileText className="h-5 w-5" />
  //               Risk Assessment
  //             </CardTitle>
  //             <CardDescription>
  //               Institutional & Customer Risk Management
  //             </CardDescription>
  //           </CardHeader>
  //           <CardContent>
  //             <Button
  //               className="w-full"
  //               onClick={() => setActiveReport("risk-assessment")}
  //             >
  //               Open Risk Assessment
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="text-sm font-medium">
  //               Draft Reports
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <p className="text-3xl font-bold">8</p>
  //             <p className="text-xs text-muted-foreground">
  //               Across all report types
  //             </p>
  //           </CardContent>
  //         </Card>
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="text-sm font-medium">In Review</CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <p className="text-3xl font-bold">5</p>
  //             <p className="text-xs text-muted-foreground">Pending approval</p>
  //           </CardContent>
  //         </Card>
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="text-sm font-medium">Approved</CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <p className="text-3xl font-bold">42</p>
  //             <p className="text-xs text-muted-foreground">
  //               Submitted to AUSTRAC
  //             </p>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <RiskAssessmentDashboard />
    </div>
  );
}
