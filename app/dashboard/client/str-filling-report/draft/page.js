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
  Upload,
  Users,
  Zap,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";
import ResizableTable from "@/components/ui/Resizabletable";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { IconFilePlus, IconHistory } from "@tabler/icons-react";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";

export default function Draft() {
  const [currentPage, setCurrentPage] = useState(1);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const alerts = [
    {
      id: 1,
      icon: AlertCircle,
      message: "3 drafts approaching 30-day limit",
      type: "warning",
    },
    {
      id: 2,
      icon: Clock,
      message: "5 drafts ready for submission",
      type: "warning",
    },
  ];

  const metrics = [
    { label: "Total Drafts", value: "128", color: "text-blue-600" },
    { label: "My Drafts", value: "15", color: "text-amber-600" },
    { label: "Updated Today", value: "102", color: "text-teal-600" },
    { label: "Incomplete", value: "11", color: "text-red-600" },
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
  const quickActions = [
    {
      id: 1,
      title: "Create New STR from Template",
      description: "Start a new STR using pre-built templates",
      icon: Plus,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      id: 2,
      title: "Import STR Data",
      description: "Import STR data from external sources",
      icon: Upload,
      color: "bg-green-500/10 text-green-600",
    },
    {
      id: 3,
      title: "Manage Draft Holders",
      description: "Manage and assign draft holders",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      id: 4,
      title: "Share Draft with team",
      description: "Collaborate with team members",
      icon: Zap,
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  const templates = [
    {
      id: 1,
      name: "Standard STR Template",
      description: "General purpose STR template for all transaction types",
      usage: "Most Used",
      icon: "📋",
    },
    {
      id: 2,
      name: "High-Risk Customer STR",
      description: "Specialized template for high-risk customer transactions",
      usage: "Compliance",
      icon: "⚠️",
    },
    {
      id: 3,
      name: "Cash Transaction STR",
      description: "Optimized for cash deposit and withdrawal transactions",
      usage: "Common",
      icon: "💵",
    },
    {
      id: 4,
      name: "Wire Transfer STR",
      description: "Designed for international and domestic wire transfers",
      usage: "Common",
      icon: "🔄",
    },
    {
      id: 5,
      name: "Cryptocurrency STR",
      description: "Template for cryptocurrency-related suspicious transactions",
      usage: "Emerging",
      icon: "₿",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-border ">
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
        <div>
          <div className=" ">
            {/* Main Content */}
            <div className="pt-4">
              <div className="grid gap-12 lg:grid-cols-3">
                {/* Quick Actions Section */}
                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
                    <p className="text-sm text-muted-foreground mt-1">Common tasks and workflows</p>
                  </div>

                  <div className="space-y-3">
                    {quickActions.map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={action.id}
                          className="w-full group relative overflow-hidden rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md hover:bg-card/80"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg p-2 ${action.color}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {action.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STR Templates Section */}
                <div className="lg:col-span-2">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">STR Templates</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pre-built templates for common scenarios
                      </p>
                    </div>
                    {/* <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Template
                    </Button> */}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className="group cursor-pointer border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:bg-card/80"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="text-2xl">{template.icon}</div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base group-hover:text-primary transition-colors">
                                  {template.name}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {template.usage}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {template.description}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-primary hover:text-primary hover:bg-primary/10 gap-1"
                          >
                            Use Template
                            <span className="text-xs">→</span>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
      <div className="grid grid-cols-3 gap-4">
        <CustomInput label="Draft ID" placeholder="Enter Draft ID" />
        <CustomSelect label="Risk Level" placeholder="Select Risk Level" />
        <CustomInput label="Customer Name" placeholder="Enter Customer Name" />
        <CustomSelect label="Suspicion Category" placeholder="Select Suspicion Category" />
        <CustomInput label="ID Number" placeholder="Enter ID Number" />
        <CustomInput label="Account Number" placeholder="Account Number " />
        <CustomInput
          label="Initial Detection Date *"
          type="date"
          placeholder="Select Date First Detected"
        />
        <CustomSelect label="Assigned Officer" placeholder="Select Assigned Officer" />
        <div className="col-span-3">
          <CustomInput
            label="Suspicion Reason *"
            type="textarea"
            placeholder="Multiple cash deposits just below reporting threshold. Unusual transaction pattern inconsistent with customer profile."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline">Save Draft</Button>
        <Button>Next</Button>
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
          <h2 className=" font-semibold     flex items-center gap-2">Reporting Entry Details</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <CustomInput label="Financial Institution" placeholder="Enter Financial Institution" />
            <CustomInput label="Branch" placeholder="Enter Branch" />
            <CustomInput label="Reporting Officer" placeholder="Enter Reporting Officer" />
          </div>
        </div>
        <div className="border p-4 rounded-md space-y-8">
          <h2 className=" font-semibold flex items-center gap-2">Transaction Details</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <CustomInput label="Total Amount Involved" placeholder="Enter Total Amount Involved" />
            <CustomInput
              label="Date Range of Transactions"
              type="date"
              placeholder="Select Date First Detected"
            />
          </div>
        </div>
        <div className="border p-4 rounded-md">
          <h2 className=" font-semibold     flex items-center gap-2">
            <span>
              <IconHistory className="size-5" />
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

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Next</Button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

const Preview = () => {
  const caseDetails = {
    strId: "STR-2025-00124",
    customerName: "Md. Rahim",
    riskLevel: "High",
    suspicionCategory: "Structuring / Smurfing",
  };

  const reportingDetails = {
    financialInstitution: "Prime Bank Ltd.",
    branch: "Gulshan Branch",
    reportingOfficer: "A. Hasan",
    submissionDate: "2025-10-10",
  };

  const transactions = [
    {
      id: 1,
      date: "2025-10-04",
      type: "Cash Deposit",
      amount: "$15,200",
      channel: "Branch",
      account: "ACC-987654",
    },
    {
      id: 2,
      date: "2025-10-03",
      type: "Cash Deposit",
      amount: "$7,800",
      channel: "ATM",
      account: "ACC-987654",
    },
    {
      id: 3,
      date: "2025-10-08",
      type: "Jet Dua",
      amount: "$5,700",
      channel: "Branch",
      account: "ACC-987654",
    },
  ];

  const attachments = [
    { id: 1, name: "transaction_evidence.pdf", size: "2.4 MB" },
    { id: 2, name: "kyc_documents.zip", size: "1.8 MB" },
  ];
  return (
    <div className="">
      {/* Header */}
      <div className=" bg-card">
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">STR Preview</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and verify STR details before submission
                </p>
              </div>
            </div>
            {/* <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" py-8">
        {/* Case Details and Reporting Details */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Case Details Card */}
          <Card className="border border-border bg-card shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    STR ID
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">{caseDetails.strId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Customer Name
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {caseDetails.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Risk Level
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      {caseDetails.riskLevel}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Suspicion Category
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {caseDetails.suspicionCategory}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Details Card */}
          <Card className="border border-border bg-card shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Reporting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Financial Institution
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {reportingDetails.financialInstitution}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Branch
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {reportingDetails.branch}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Reporting Officer
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {reportingDetails.reportingOfficer}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Submission Date
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {reportingDetails.submissionDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Summary */}
        <Card className="border border-border bg-card mb-8 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Channel</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Account</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
                      <td className="py-3 px-4 text-foreground">{tx.type}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{tx.amount}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tx.channel}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tx.account}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Narrative Description */}
        <Card className="border border-border bg-card mb-8 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Narrative Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customer Md. Rahim, a business owner, has made multiple cash deposits over the past
              week totaling $28,700. Each deposit is just below the $10,000 reporting threshold.
              Unusual transaction patterns inconsistent with customer profile. The transactions
              appear to be structured to avoid reporting requirements. Multiple deposits at
              different branches suggest deliberate structuring activity.
            </p>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="border border-border bg-card shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{attachment.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Attachments = () => {
  const documentTypes = [
    { label: "Transaction Evidence", value: "transaction_evidence" },
    { label: "KYC Documents", value: "kyc_documents" },
    { label: "Account Statement", value: "account_statement" },
    { label: "Internal Report", value: "internal_report" },
  ];
  return (
    <div>
      <h2 className="font-semibold mb-6">Supporting Documents</h2>

      <div className="flex items-center gap-4">
        <div className="space-y-4 w-[400px] shrink-0 border rounded-md p-4">
          <CustomSelect
            label="Document Type"
            placeholder="Select Document Type"
            options={documentTypes}
          />
          <CustomInput label="Description" placeholder="Enter Description" type="textarea" />
        </div>
        <div
          className="flex items-center justify-center gap-2 border-2
        h-[180px] border-dashed w-full"
        >
          <span>
            <IconFilePlus className="size-5" />
          </span>
          <span className="text-sm text-muted-foreground">
            Upload a file or drag and drop a PNG, JPG, or PDF up to 10MB
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="outline">Save Draft</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
};

const DetailView = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("case-details");

  const tabs = [
    { id: "case-details", label: "Case Details" },
    { id: "str-form", label: "STR Form" },
    { id: "attachments", label: "Attachments" },
    { id: "preview", label: "Preview" },
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
            {activeTab === "attachments" && <Attachments />}
            {activeTab === "preview" && <Preview />}
            {/* {activeTab === "audit-trail" && (
                <AuditTrail />
              )} */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
