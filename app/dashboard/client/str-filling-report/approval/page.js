"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import {
  AlertCircle,
  Clock,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Download,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import ResizableTable from "@/components/ui/Resizabletable";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  IconCalendarDollar,
  IconFilePlus,
  IconHistory,
  IconUserQuestion,
} from "@tabler/icons-react";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";

export default function Approve() {
  const [currentPage, setCurrentPage] = useState(1);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const alerts = [
    {
      id: 1,
      icon: AlertCircle,
      message: "3 STRs awaiting additional documentation",
      type: "warning",
    },
    {
      id: 2,
      icon: Clock,
      message: "1 STR converted for clarification",
      type: "warning",
    },
  ];

  const metrics = [
    { label: "Awaiting for Review", value: "128", color: "text-blue-600" },
    { label: "Pending Review", value: "15", color: "text-amber-600" },
    { label: "Approved / Filed", value: "102", color: "text-teal-600" },
    { label: "Returned / Rejected", value: "11", color: "text-red-600" },
  ];

  const queueData = [
    {
      id: "ALT01",
      name: "Admin Core",
      amount: "$15,000",
      riskLevel: "High",
      officer: "J Hanson",
      date: "08-09-2025",
      daysInQueue: "5",
      status: "Urgent Review",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "ALT04",
      name: "Jim Dua",
      amount: "$7,800",
      riskLevel: "Medium",
      officer: "M Marvin",
      date: "08-08-2025",
      daysInQueue: "-",
      status: "Awaiting Approval",
      statusColor: "bg-amber-100 text-amber-700",
    },
    {
      id: "ALT08",
      name: "Jim Dua",
      amount: "$5,700",
      riskLevel: "Low",
      officer: "Lucy Luk",
      date: "09-08-2025",
      daysInQueue: "-",
      status: "Awaiting Approval",
      statusColor: "bg-amber-100 text-amber-700",
    },
  ];

  const recentActions = [
    {
      id: 1,
      caseNumber: "STR 8025-8047",
      description: "Case Number",
      recommendation: "Recommended for Escalation",
      color: "bg-red-100 text-red-700",
    },
    {
      id: 2,
      caseNumber: "STR 8025-8047",
      description: "Case Number",
      recommendation: "Recommended for Escalation",
      color: "bg-red-100 text-red-700",
    },
  ];

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      size: 100,
    },
    {
      header: "Name",
      accessorKey: "name",
      size: 200,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      size: 100,
    },
    {
      header: "Risk Level",
      accessorKey: "riskLevel",
      size: 100,
    },
    {
      header: "Assigned Officer",
      accessorKey: "officer",
      size: 100,
    },
    {
      header: "Transaction Date",
      accessorKey: "date",
      size: 100,
    },
    {
      header: "Days in Queue",
      accessorKey: "daysInQueue",
      size: 100,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 100,
    },
    {
      header: "Actions",
      accessorKey: "actions",
      size: 100,
      cell: ({ row }) => (
        <Button variant="outline" size="icon" onClick={() => setDetailViewOpen(true)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-border  sticky top-0 z-50">
        <div className="mx-auto max-w-[1440px] px-8 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Request for Information</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-8 py-8 space-y-8">
        {/* Alert Notifications */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">{alert.message}</span>
                </div>
                <button className="text-xs font-medium text-amber-700 hover:text-amber-900">
                  View All
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="border shadow-sm">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {metric.label}
                </p>
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, ID, date"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          {["Case ID", "Status", "KYC Status", "Risk Level", "Date Range", "Officer"].map(
            (filter) => (
              <select
                key={filter}
                className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>{filter}</option>
              </select>
            ),
          )}
          <Button size="sm" variant="outline" className="h-10 w-10 p-0 bg-transparent">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* STR Approval Queue Table */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">STR Approval Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ResizableTable columns={columns} data={queueData} />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">Showing 3 of 68 entries</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <span className="text-xs text-muted-foreground px-2 py-2">...</span>
                <Button variant="outline" size="sm">
                  67
                </Button>
                <Button variant="outline" size="sm">
                  68
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Approval Actions */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-4">Recent Approval Actions</h2>
          <div className="space-y-3">
            {recentActions.map((action) => (
              <Card key={action.id} className="border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{action.caseNumber}</p>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${action.color}`}
                    >
                      {action.recommendation}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <DetailView open={detailViewOpen} setOpen={setDetailViewOpen} />
    </div>
  );
}

const CaseDetails = () => {
  const linkedTransactions = [
    { date: "2025-10-04", type: "Cash Deposit", branch: "Branch 045", amount: "$15,000" },
    { date: "2025-10-03", type: "Cash Deposit", branch: "ATM 112", amount: "$9,800" },
    { date: "2025-10-01", type: "Cash Deposit", branch: "Branch 045", amount: "$12,000" },
  ];

  const supportingDocs = [
    { name: "transaction_evidence.pdf", size: "2.4 MB" },
    { name: "kyc_documents.zip", size: "5.1 MB" },
  ];
  return (
    <div className="space-y-6">
      {/* Case ID */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Case ID
        </p>
        <p className="text-lg font-semibold text-foreground">CASE-2025-00124</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Customer KYC Snapshot */}
        <div className="lg:col-span-2">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Customer KYC Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-foreground">Admin Core</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    ID Number
                  </p>
                  <p className="text-sm font-medium text-foreground">0123456789</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Account No.
                  </p>
                  <p className="text-sm font-medium text-foreground">ACC-987654</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Designation
                  </p>
                  <p className="text-sm font-medium text-foreground">Business Owner</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Risk Level
                </p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  High
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Suspicion Reason */}
          <Card className="border shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-base">Suspicion Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                Multiple cash deposits just below reporting threshold. Unusual transaction patterns
                inconsistent with customer profile.
              </p>
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          <Card className="border shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-base">Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportingDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Linked Transactions */}
        <div>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Linked Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {linkedTransactions.map((tx, idx) => (
                  <div key={idx} className="pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                        <p className="text-sm font-medium text-foreground">{tx.type}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tx.branch}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                        {tx.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const STRForm = () => {
  const data = [
    {
      date: "2025-10-04",
      type: "Cash Deposit",
      amount: 15000,
      channel: "Branch",
      account: "ACC-987654",
    },
    {
      date: "2025-10-03",
      type: "Cash Withdrawal",
      amount: 10000,
      channel: "Branch",
      account: "ACC-987654",
    },
    {
      date: "2025-10-02",
      type: "Cash Deposit",
      amount: 15000,
      channel: "Branch",
      account: "ACC-987654",
    },
  ];
  const columns = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Channel",
      accessorKey: "channel",
    },
    {
      header: "Account",
      accessorKey: "account",
    },
  ];
  return (
    <div>
      <div className="space-y-8">
        <div className="border p-4 rounded-md space-y-8">
          <h2 className=" font-semibold  flex items-center gap-2">
            <span>
              <IconCalendarDollar className="size-3" />
            </span>
            Financial Institution
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <CustomInput label="Financial Institution" placeholder="Enter Financial Institution" />
            <CustomInput label="Branch" placeholder="Enter Branch" />
            <CustomInput label="Reporting Officer" placeholder="Enter Reporting Officer" />
          </div>
        </div>
        <div className="border p-4 rounded-md space-y-8">
          <h2 className=" font-semibold flex items-center gap-2">
            <span>
              <IconUserQuestion className="size-3" />
            </span>
            Suspicion Details
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <CustomSelect label="Suspicion Category" placeholder="Select Suspicion Category" />
            <CustomInput
              label="Date First Detected"
              type="date"
              placeholder="Select Date First Detected"
            />
          </div>
        </div>
        <div className=" border p-4 rounded-md">
          <h2 className=" font-semibold     flex items-center gap-2">
            <span>
              <IconHistory className="size-3" />
            </span>
            Transaction History
          </h2>
          <div>
            <ResizableTable columns={columns} data={data} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-base">Narrative Description</h2>
          <p className="leading-relaxed text-neutral-800">
            Customer Jon Deau, a business owner, has made multiple cash deposits over the past week
            totaling $37,300. Each transaction is just below the $15,000 reporting threshold,
            indicating potential structuring activity. This pattern is inconsistent with the
            customer&apos;s known business operations and declared income sources. The transactions
            were conducted at different branches and ATM’s, further raising suspicion of intentional
            avoidance of detection.
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

const AuditTrail = () => {
  const auditEvents = [
    {
      id: 1,
      title: "Draft Created",
      date: "2025-10-09 10:25",
      user: "R. Ahmed",
      status: "completed",
      icon: "check",
    },
    {
      id: 2,
      title: "Reviewed",
      date: "2025-10-09 12:40",
      user: "Compliance Officer",
      status: "completed",
      icon: "check",
    },
    {
      id: 3,
      title: "Submitted to FIU",
      date: "2025-10-10 09:00",
      user: "System",
      description: "Submitted electronically",
      status: "completed",
      icon: "check",
    },
    {
      id: 4,
      title: "FIU Acknowledged",
      date: "2025-10-10 10:30",
      user: "FIU System",
      description: "FIU Acknowledgement ID: FIU-BD5678",
      status: "completed",
      icon: "check",
    },
  ];
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle className="text-base">STR Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {auditEvents.map((event, idx) => (
            <div key={event.id} className="relative">
              {/* Timeline connector line */}
              {idx < auditEvents.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-16 bg-gradient-to-b from-primary/20 to-primary/5" />
              )}

              {/* Event item */}
              <div className="flex gap-4 py-6 first:pt-0 last:pb-0">
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1 flex-shrink-0">
                  <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 border-2 border-primary">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Event content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">by {event.user}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                      {event.date}
                    </p>
                  </div>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Approval = () => {
  const decisionOptions = [
    { label: "Approve and File", value: "approve" },
    { label: "Return to collection", value: "return-to-collection" },
    { label: "Reject STR", value: "reject-str" },
  ];
  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];
  const previousReviews = [
    {
      id: 1,
      reviewer: "A. Hasan",
      title: "Initial Review",
      comment: "STR appears valid with sufficient evidence of structuring.",
      date: "2025-10-03 10:25",
      status: "completed",
    },
    {
      id: 2,
      reviewer: "N. Karim",
      title: "Compliance Review",
      comment: "Recommend approval. All documentation appears complete.",
      date: "2025-09-14 16:30",
      status: "completed",
    },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-base">Approval Decision</h2>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-6   rounded ">
          <CustomSelect
            label="Decision"
            placeholder="Select Approval Decision"
            options={decisionOptions}
          />
          <CustomInput type="textarea" label="Reason" placeholder="Enter Reason" />
          <CustomSelect
            label="Priority for Re submission (if returning)"
            placeholder="Select Priority for Re submission"
            options={priorityOptions}
          />
        </div>
        <div className="">
          <div className="space-y-6">
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Previous Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousReviews.map((review, idx) => (
                    <div key={review.id} className="relative">
                      {/* Timeline connector */}
                      {/* {idx < previousReviews.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-12 bg-gradient-to-b from-primary/30 to-transparent" />
                      )} */}

                      {/* Review item */}
                      <div className="flex gap-4">
                        {/* Timeline dot */}

                        {/* Review content */}
                        <div className="flex-1 pb-4">
                          <div className="bg-muted/40 rounded-lg p-4 border border-border hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {review.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  by {review.reviewer}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {review.date}
                              </p>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailView = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("case-details");

  const tabs = [
    { id: "case-details", label: "Case Details" },
    { id: "str-form", label: "STR Form" },
    { id: "approval", label: "Approval" },
    { id: "audit-trail", label: "Audit Trail" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-5xl w-full overflow-y-auto">
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card sticky top-0 z-50">
            <div className="mx-auto max-w-[1440px] px-8 py-6">
              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">STR Review & Approval</h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-8 border-b border-border -mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-[1440px] px-8 py-8">
            {activeTab === "case-details" && <CaseDetails />}

            {activeTab === "str-form" && <STRForm />}
            {activeTab === "approval" && <Approval />}
            {activeTab === "audit-trail" && <AuditTrail />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
