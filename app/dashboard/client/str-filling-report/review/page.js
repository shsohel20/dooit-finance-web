"use client"

import { Search, Plus, ChevronLeft, ChevronRight, TrendingUp, AlertCircle, Eye, Clock, CheckCircle2, Send, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import ResizableTable from "@/components/ui/Resizabletable"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { IconCalendarDollar, IconFile, IconFilePlus, IconHistory, IconSearch, IconUserQuestion } from "@tabler/icons-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import CustomInput from "@/components/ui/CustomInput"
import CustomSelect from "@/components/ui/CustomSelect"

export default function StrReviewPage() {
  const [detailViewOpen, setDetailViewOpen] = useState(false)
  // Sample data for charts
  const filingProgressData = [
    { name: "Pending Review", value: 8, total: 14 },
    { name: "Submitted", value: 14, total: 24 },
    { name: "Approved", value: 12, total: 24 },
    { name: "Returned", value: 2, total: 24 },
  ]

  const transactionTypeData = [
    { name: "Wire Transfer", value: 40 },
    { name: "Cash Transaction", value: 35 },
    { name: "Cryptocurrency", value: 18 },
    { name: "Other", value: 5 },
  ]
  const data = [
    {
      id: "ALT003",
      name: "Admin Core",
      amount: "$15,000",
      risk: "High",
      officer: "J Hanson",
      date: "08-08-2025",
      status: "Filed",
    },
    {
      id: "ALT004",
      name: "Jim Dua",
      amount: "$7,800",
      risk: "Medium",
      officer: "M Marvin",
      date: "09-08-2025",
      status: "Pending",
    },
    {
      id: "ALT006",
      name: "Jim Dua",
      amount: "$5,700",
      risk: "Low",
      officer: "Lucy Luk",
      date: "09-08-2025",
      status: "Returned",
    },
  ]
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },

    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Risk Level",
      accessorKey: "risk",
    },
    {
      header: "Assigned Officer",
      accessorKey: "officer",
    },
    {
      header: "Transaction Date",
      accessorKey: "date",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="icon" onClick={() => setDetailViewOpen(true)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const chartColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1440px] px-8 py-8">
          <h1 className="text-3xl font-semibold tracking-tight">Suspicious Transaction Reports</h1>
          <p className="mt-2 text-sm text-muted-foreground">Monitor and manage STR filings and compliance status</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-8 py-8">
        {/* Summary Metrics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total STRs Filed</p>
                <p className="text-3xl font-semibold tracking-tight">128</p>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-semibold tracking-tight text-warning">15</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>Requires attention</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Approved / Filed</p>
                <p className="text-3xl font-semibold tracking-tight text-success">102</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <span>79.7% completion rate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Returned / Rejected</p>
                <p className="text-3xl font-semibold tracking-tight text-destructive">11</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <span>8.6% rejection rate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className='flex items-center gap-2 mb-4'>
            <InputGroup className={'max-w-64'}>
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon >
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Case ID" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Email" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <Card className="mb-8 overflow-hidden shadow-none p-2.5">
          <ResizableTable columns={columns} data={data} />

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">Showing 1 of 68 pages</p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                {[1, 2, 3].map((page) => (
                  <Button key={page} size="sm" variant={page === 1 ? "default" : "outline"} className="h-8 w-8 p-0">
                    {page}
                  </Button>
                ))}
                <span className="px-2 text-xs text-muted-foreground">...</span>
                {[67, 68].map((page) => (
                  <Button key={page} size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                    {page}
                  </Button>
                ))}
              </div>
              <Button size="sm" variant="outline">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Analytics Charts */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* STR Filing Progress */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">STR Filing Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filingProgressData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: "12px" }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: `1px solid var(--border)`,
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* STRs by Transaction Type */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">STRs by Transaction Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: "12px" }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: `1px solid var(--border)`,
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <DetailViewModal open={detailViewOpen} setOpen={setDetailViewOpen} />
    </div>
  )
}



const CaseDetails = () => {
  return (
    <div className="space-y-8">
      {/* Case ID */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Case ID</p>
        <p className="text-lg font-semibold text-foreground">CASE-2025-00124</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Customer KYC Snapshot */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Customer KYC Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Full Name</span>
                <span className="text-sm font-medium text-foreground">Judith Core</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">ID Number</span>
                <span className="text-sm font-medium text-foreground font-mono">0123456789</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Account No.</span>
                <span className="text-sm font-medium text-foreground font-mono">ACC-987654</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-foreground">judith@email.com</span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">High</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Linked Transactions */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Linked Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { date: "2025-10-04", type: "Debit", branch: "Branch-1345", amount: "$10,000" },
              { date: "2025-10-03", type: "Debit", branch: "Branch-1345", amount: "$9,800" },
              { date: "2025-10-02", type: "Debit", branch: "Branch-1345", amount: "$12,000" },
              { date: "2025-10-01", type: "Debit", branch: "Branch-1345", amount: "$12,000" },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                  <p className="text-sm font-medium text-foreground">
                    {tx.type} • {tx.branch}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">{tx.amount}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Suspension Reason */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Suspension Reason</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            Multiple cash deposits just below reporting threshold. Unusual transaction patterns inconsistent with
            customer profile.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

const STRForm = () => {
  const data = [
    {
      date: "2025-10-04",
      type: 'Cash Deposit',
      amount: 15000,
      channel: 'Branch',
      account: 'ACC-987654',
    },
    {
      date: "2025-10-03",
      type: 'Cash Withdrawal',
      amount: 10000,
      channel: 'Branch',
      account: 'ACC-987654',
    },
    {
      date: "2025-10-02",
      type: 'Cash Deposit',
      amount: 15000,
      channel: 'Branch',
      account: 'ACC-987654',
    },

  ]
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
  ]
  return (
    <div>
      <div className="space-y-8">
        <div className="border p-4 rounded-md">
          <h2 className="text-base font-semibold     flex items-center gap-2">
            <span><IconCalendarDollar className="size-5" /></span>
            Financial Institution</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <CustomInput label="Financial Institution" placeholder="Enter Financial Institution" />
            <CustomInput label="Branch" placeholder="Enter Branch" />
            <CustomInput label="Reporting Officer" placeholder="Enter Reporting Officer" />
          </div>
        </div>
        <div className="border p-4 rounded-md">
          <h2 className="text-base font-semibold     flex items-center gap-2">
            <span><IconUserQuestion className="size-5" /></span>
            Suspicion Details
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <CustomSelect label='Suspicion Category' placeholder="Select Suspicion Category" />
            <CustomInput label='Date First Detected' type="date" placeholder="Select Date First Detected" />
          </div>
        </div>
        <div className=" border p-4 rounded-md">
          <h2 className="text-base font-semibold     flex items-center gap-2">
            <span><IconHistory className="size-5" /></span>
            Transaction History
          </h2>
          <div>
            <ResizableTable columns={columns} data={data} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-base">STR Summary</h2>
          <p className="leading-relaxed text-neutral-800">During a routine transaction monitoring review, multiple high-value inward remittances totaling USD 120,000 were identified in the account of Mr. Admin Core, a local freelancer, within a span of five days. The account history shows low monthly activity averaging USD 1,000. The remittances originated from three unrelated overseas entities without clear business justification. </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-base">Narrative Description</h2>
          <p className="leading-relaxed text-neutral-800">Customer Jon Deau, a business owner, has made multiple cash deposits over the past week totaling $37,300. Each transaction is just below the $15,000 reporting threshold, indicating potential structuring activity. This pattern is inconsistent with the customer&apos;s known business operations and declared income sources. The transactions were conducted at different branches and ATM’s, further raising suspicion of intentional avoidance of detection.</p>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-base">Attachments</h2>
          <div className="flex flex-col items-center justify-center gap-2 h-[100px] border-2 border-dashed  rounded-lg p-2">
            <span><IconFilePlus className="size-5" /></span>
            <span className="text-sm text-muted-foreground">Upload a file or drag and drop a PNG, JPG, or PDF up to 10MB</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant='outline'>Save draft</Button>
          <Button>Submit To FIU</Button>
        </div>

      </div>
      <div>

      </div>
    </div>
  )
}

const AuditTrail = () => {

  const auditEvents = [
    {
      id: 1,
      title: "Draft Created",
      timestamp: "2025-10-04 23:01",
      user: "R. Ahmed",
      icon: Clock,
      status: "completed",
    },
    {
      id: 2,
      title: "Reviewed",
      timestamp: "2025-10-10 12:45",
      user: "Compliance Officer",
      icon: CheckCircle2,
      status: "completed",
    },
    {
      id: 3,
      title: "Submitted to FIU",
      timestamp: "2025-10-15 10:03:02",
      description: "Submitted internally",
      icon: Send,
      status: "completed",
    },
    {
      id: 4,
      title: "FIU Acknowledged",
      timestamp: "2025-10-15 10:20",
      description: "FIU Acknowledgement ID: FIU-RCS8678",
      icon: FileCheck,
      status: "completed",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">STR Audit Trail</h2>
        <p className="text-sm text-muted-foreground">Complete history of all actions and status updates</p>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {auditEvents.map((event, index) => {
          const IconComponent = event.icon
          const isLast = index === auditEvents.length - 1

          return (
            <div key={event.id} className="flex gap-6">
              {/* Timeline Line and Icon */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                {!isLast && <div className="w-0.5 h-16 bg-gradient-to-b from-primary/30 to-primary/10" />}
              </div>

              {/* Event Content */}
              <div className="flex-1 ">
                <Card className="border shadow-none">
                  <CardContent className="pt-2 ">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        <span className="text-xs font-medium text-success">Completed</span>
                      </div>
                    </div>

                    {event.user && (
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">By: </span>
                        <span className="font-medium">{event.user}</span>
                      </p>
                    )}

                    {event.description && <p className="text-sm text-muted-foreground mt-2">{event.description}</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })}
      </div>


    </div>
  )


}
const tabs = [
  { id: "details", label: "Case Details", component: <CaseDetails /> },
  { id: "form", label: "STR Form", component: <STRForm /> },
  { id: "audit", label: "Audit Trail", component: <AuditTrail /> },
]
export const DetailViewModal = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState(tabs[0])


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>STR Filing Workflow</SheetTitle>
        </SheetHeader>
        <div className="min-h-screen bg-background">
          <div className=" bg-card">
            <div className="px-8 py-6">
              {/* Tabs */}
              <div className="flex gap-8 border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 text-sm font-medium transition-colors
                      ${activeTab.id === tab.id
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                      }
                  `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-2">
            {activeTab.component}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}