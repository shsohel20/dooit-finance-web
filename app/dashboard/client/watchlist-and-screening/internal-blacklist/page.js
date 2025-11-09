'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ResizableTable from '@/components/ui/Resizabletable'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { IconEdit, IconEye } from '@tabler/icons-react'
import { AlertCircle, AlertTriangle, Building2, CheckCircle2, Clock, Download, FileText, FileUp, MoreHorizontalIcon, TrendingUp, User, UserCheck, Users } from 'lucide-react'
import React, { useState } from 'react'

function getStatusIcon(status) {
  switch (status) {
    case "match":
      return <AlertCircle className="w-5 h-5 text-error" />
    case "clear":
      return <CheckCircle2 className="w-5 h-5 text-success" />
    case "pending":
      return <Clock className="w-5 h-5 text-warning" />
    default:
      return null
  }
}

function getStatusColor(status) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    case "Monitored":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    case "Inactive":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }
}
function getRiskBadgeColor(riskLevel) {
  switch (riskLevel) {
    case "low":
      return "bg-success/15 text-success border border-success/30"
    case "medium":
      return "bg-warning/15 text-warning border border-warning/30"
    case "high":
      return "bg-error/15 text-error border border-error/30"
    default:
      return "bg-muted/15 text-muted-foreground border border-muted/30"
  }
}

function getRiskIcon(riskLevel) {
  switch (riskLevel) {
    case "low":
      return <CheckCircle2 className="w-4 h-4" />
    case "medium":
      return <AlertTriangle className="w-4 h-4" />
    case "high":
      return <AlertCircle className="w-4 h-4" />
    default:
      return null
  }
}

function getRiskLabel(riskLevel) {
  switch (riskLevel) {
    case "low":
      return "Low Risk"
    case "medium":
      return "Medium Risk"
    case "high":
      return "High Risk"
    default:
      return "Unknown"
  }
}


export default function InternalBlacklistPage() {
  const [openViewModal, setOpenViewModal] = useState(false)
  const stats = [
    { label: "Total PEPs", value: "128", color: "from-blue-500 to-blue-600", description: "Total number of PEPs in the system" },
    { label: "Low Risk", value: "15", color: "from-green-500 to-green-600", description: "Number of PEPs with low risk" },
    { label: "Medium Risk", value: "102", color: "from-amber-500 to-amber-600", description: "Number of PEPs with medium risk" },
    { label: "High Risk", value: "11", color: "from-red-500 to-red-600", description: "Number of PEPs with high risk" },

  ]

  function getRiskColor(level) {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "Low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }



  const pepsData = [
    {
      id: 1,
      name: "Admin Core",
      position: "Minister of Finance",
      riskLevel: "High",
      country: "United States",
      lastUpdated: "05-08-2025",
      status: "Active",
    },
    {
      id: 2,
      name: "Jon Due",
      position: "Member of Parliament",
      riskLevel: "Medium",
      country: "Australia",
      lastUpdated: "05-08-2025",
      status: "Monitored",
    },
    {
      id: 3,
      name: "Jon Dua",
      position: "Deputy Minister",
      riskLevel: "Low",
      country: "Germany",
      lastUpdated: "05-08-2025",
      status: "Inactive",
    },
  ]
  const columns = [
    {
      header: "Actions",
      accessorKey: "actions",
      enableResizing: false,
      size: 100,
      cell: ({ row }) => {
        return <div className=' flex items-center justify-center'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="Open menu" size="icon">
                <MoreHorizontalIcon size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 z-[99]" align="start">
              <DropdownMenuLabel className={'text-xs text-muted-foreground'}> Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => { setOpenViewModal(true) }}>
                  <IconEye size={12} /> View
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { }}>
                  <IconEdit size={12} /> Edit
                </DropdownMenuItem>
                {/* <DropdownMenuItem disabled>Download</DropdownMenuItem> */}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    },
    {
      header: "Name",
      accessorKey: "name",
      size: 100,
    },
    {
      header: "Position",
      accessorKey: "position",
      size: 50,
    },
    {
      header: "Risk Level",
      accessorKey: "riskLevel",
      size: 100,
      cell: ({ row }) => {
        const riskLevel = row.original.riskLevel
        return <span className={cn('text-xs font-medium rounded-full px-2 py-0.5', getRiskColor(riskLevel))}>{riskLevel}</span>
      }
    },
    {
      header: "Country",
      accessorKey: "country",
      size: 100,
    },
    {
      header: "Last Updated",
      accessorKey: "lastUpdated",
      size: 100,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 100,
      cell: ({ row }) => {
        const status = row.original.status
        return <span className={cn('text-xs font-medium rounded-full px-2 py-0.5', getStatusColor(status))}>{status}</span>
      }
    },

  ]

  return (
    <div className='space-y-8'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`shadow-none`}>
            <CardHeader>
              <CardTitle className=" font-bold">{stat.label}</CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn('text-4xl font-extrabold  bg-gradient-to-r text-transparent bg-clip-text', stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='py-8 rounded-md border px-4'>
        <ResizableTable data={pepsData} columns={columns} />
      </div>
      <ViewModal open={openViewModal} setOpen={setOpenViewModal} />
    </div>
  )
}

const Profile = () => {
  const personalInfo = [
    {
      label: "Full Name",
      value: "John Doe",
    },
    {
      label: "Date of Birth",
      value: "05-08-2025",
    },
    {
      label: "Phone Number",
      value: "+61 412 345 678",
    },
    {
      label: "Email",
      value: "john.doe@example.com",
    },
    {
      label: "Occupation",
      value: "Minister of Finance",
    },
    {
      label: 'Place of Birth',
      value: "Sydney, Australia",
    },
    {
      label: 'Identification Type',
      value: "Passport",
    },
    {
      label: 'Position & Contact',
      value: 'Minister of Finance'
    },
    {
      label: 'Country',
      value: "Australia",
    },
    {
      label: 'Jurisdiction',
      value: 'Federal'
    },
    {
      label: 'Appointment Date',
      value: '05-08-2025',
    },
    {
      label: 'Nationality',
      value: 'Australian',
    }
  ]
  const riskFactors = [
    { name: "Political Influence", level: "High", percentage: 85, color: 'bg-red-500' },
    { name: "Country Risk", level: "Medium", percentage: 60, color: 'bg-amber-500' },
    { name: "Associations", level: "High", percentage: 80, color: 'bg-red-500' },
    { name: "Duration in Office", level: "Medium", percentage: 65, color: 'bg-amber-500' },
  ]
  return (
    <div className='space-y-4'>
      {/* personal & contact information */}
      <div className='space-y-4 p-4 border rounded-md'>
        <h2 className='font-bold '>Personal & Contact Information</h2>
        <div className='grid grid-cols-4 gap-2'>
          {personalInfo.map((info) => (
            <div key={info.label}>
              <span className='text-xs text-muted-foreground'>{info.label}</span>
              <p className='text-sm font-bold'>{info.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {/* risk assessment */}
        <div className='p-4 border rounded-md'>
          <h2 className='font-bold '>Risk Assessment</h2>
          <div className='pt-10 space-y-4'>
            <div className='flex items-center flex-col justify-center '>
              <span className='text-red-700 font-bold text-5xl'>85</span>
              <span>/100</span>
            </div>
            <div>
              <div className='bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md px-2 py-2 text-center font-semibold'>High Risk</div>
            </div>
            <div>
              <p className='text-xs text-muted-foreground text-center'>Last Updated: 05-08-2025</p>
            </div>
          </div>
        </div>
        {/* risk factors */}
        <div className='p-4 border rounded-md col-span-2'>
          <h2 className='font-bold '>Risk Factors</h2>
          <div className='pt-4 pb-2 space-y-4 '>
            {riskFactors.map((factor) => (
              <div key={factor.name} className='space-y-0.5'>
                <span className='text-xs text-muted-foreground'>{factor.name} ({factor.percentage}%)</span>
                <p className='text-sm font-bold'>{factor.level}</p>
                <div
                  style={{ width: `${factor.percentage}%` }}
                  className={cn('h-2 rounded-full', factor.color)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
const Relationships = () => {
  const relationships = [
    {
      id: "1",
      name: "Jane Doe",
      type: "person",
      relationship: "Spouse",
      details: ["DOB: 1978-07-22", "Nationality: American"],
      riskLevel: "medium",
    },
    {
      id: "2",
      name: "Michael Doe",
      type: "person",
      relationship: "Son",
      details: ["DOB: 2005-11-03", "Nationality: American"],
      riskLevel: "low",
    },
    {
      id: "3",
      name: "Global Investments LLC",
      type: "entity",
      relationship: "Business Associate - Shareholder (15%)",
      details: ["Registered: Cayman Islands"],
      riskLevel: "high",
      highlighted: true,
    },
    {
      id: "4",
      name: "Robert Smith",
      type: "person",
      relationship: "Political Associate - Former Campaign Manager",
      details: ["DOB: 1970-02-14"],
      riskLevel: "medium",
    },
  ]
  return (
    <div>
      <h2 className='font-bold '>Relationships</h2>
      <div className='pt-4 space-y-4'>
        {relationships.map((rel) => (
          <div
            key={rel.id}
            className={`group border rounded-xl p-5 transition-all duration-200 border-border bg-card/50 hover:bg-card hover:border-border/80 `}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Content */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {rel.type === "entity" ? (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{rel.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{rel.relationship}</p>
                  <div className="flex flex-wrap gap-2">
                    {rel.details.map((detail, idx) => (
                      <span key={idx} className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Risk Badge */}
              <div className="flex-shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm ${getRiskBadgeColor(rel.riskLevel)}`}
                >
                  {getRiskIcon(rel.riskLevel)}
                  <span>{getRiskLabel(rel.riskLevel)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Documents = () => {
  const documents = [
    {
      id: "1",
      name: "Passport Copy",
      type: "Identity Document",
      uploadedDate: "2023-01-15",
      verificationStatus: "verified",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      name: "Proof of Address",
      type: "Address Verification",
      uploadedDate: "2023-01-15",
      verificationStatus: "verified",
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      name: "Declaration Form",
      type: "Compliance Document",
      uploadedDate: "2023-01-20",
      verificationStatus: "pending",
      fileSize: "0.9 MB",
    },
    {
      id: "4",
      name: "Source of Wealth",
      type: "Financial Document",
      uploadedDate: "2023-02-05",
      verificationStatus: "verified",
      fileSize: "3.2 MB",
    },
  ]
  function getStatusBadgeColor(status) {
    switch (status) {
      case "verified":
        return "bg-success/15 text-success border border-success/30"
      case "pending":
        return "bg-warning/15 text-warning border border-warning/30"
      case "rejected":
        return "bg-error/15 text-error border border-error/30"
      default:
        return "bg-muted/15 text-muted-foreground border border-muted/30"
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "verified":
        return "Verified"
      case "pending":
        return "Pending"
      case "rejected":
        return "Rejected"
      default:
        return "Unknown"
    }
  }
  return (
    <div>
      <h2 className='font-bold '>Documents</h2>
      <div className='pt-4 space-y-4'>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group border border-border bg-card/50 hover:bg-card hover:border-border/80 rounded-xl p-6 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left Content */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{doc.name}</h3>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-sm text-muted-foreground">{doc.type}</span>
                    <span className="text-xs text-muted-foreground/60 bg-muted/20 px-2 py-1 rounded">
                      {doc.fileSize}
                    </span>
                    <span className="text-xs text-muted-foreground">Uploaded {doc.uploadedDate}</span>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Status Badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap ${getStatusBadgeColor(doc.verificationStatus)}`}
                >
                  {getStatusIcon(doc.verificationStatus)}
                  <span>{getStatusLabel(doc.verificationStatus)}</span>
                </div>

                {/* Download Button */}
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/10">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
const ActivityHistory = () => {
  const activities = [
    {
      id: "1",
      type: "status",
      title: "PEP Status Updated",
      description: "Status changed from 'Under Review' to 'Active'",
      timestamp: "2023-06-15 10:45",
      actor: "Sarah Johnson",
    },
    {
      id: "2",
      type: "screening",
      title: "Screening Completed",
      description: "Automated screening detected new adverse media",
      timestamp: "2023-06-15 09:30",
      actor: "System",
    },
    {
      id: "3",
      type: "document",
      title: "Document Uploaded",
      description: "Source of Wealth document added and verified",
      timestamp: "2023-02-05 14:20",
      actor: "Michael Chen",
    },
    {
      id: "4",
      type: "risk",
      title: "Risk Assessment Updated",
      description: "Risk score increased from 72 to 85 due to new business association",
      timestamp: "2023-01-25 11:15",
      actor: "Sarah Johnson",
    },
    {
      id: "5",
      type: "registration",
      title: "Initial Registration",
      description: "PEP record created in the system",
      timestamp: "2023-01-15 16:30",
      actor: "David Wilson",
    },
  ]
  function getActivityColor(type) {
    switch (type) {
      case "status":
        return "bg-success/10 text-success border-success/20"
      case "screening":
        return "bg-warning/10 text-warning border-warning/20"
      case "document":
        return "bg-primary/10 text-primary border-primary/20"
      case "risk":
        return "bg-danger/5 text-error border-red-300"
      case "registration":
        return "bg-muted text-muted-foreground border-muted"
      default:
        return "bg-muted/10 text-muted-foreground border-muted"
    }
  }
  function getActivityIcon(type) {
    switch (type) {
      case "status":
        return <CheckCircle2 className="w-5 h-5" />
      case "screening":
        return <AlertCircle className="w-5 h-5" />
      case "document":
        return <FileUp className="w-5 h-5" />
      case "risk":
        return <TrendingUp className="w-5 h-5" />
      case "registration":
        return <UserCheck className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }
  return (
    <div>
      <h2 className='font-bold '>Activity History</h2>
      <div className='pt-4 space-y-4'>
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative pl-20 md:pl-24">
            {/* Timeline dot */}
            <div
              className={`absolute left-0 md:left-1 top-1 w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-background flex items-center justify-center ${getActivityColor(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* Activity card */}
            <div className="group border border-border bg-card/50 hover:bg-card hover:border-border/80 rounded-xl p-5 md:p-6 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activity.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{activity.actor}</span>
                    </div>
                  </div>
                </div>

                {/* Right content - Activity type badge */}
                <div className="flex-shrink-0">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-muted/20 text-muted-foreground border border-muted/30">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
const RiskFactors = () => {
  const results = [
    {
      id: "sanctions",
      title: "Sanctions List Match",
      description: "Partial name match found in OFAC SDN List",
      status: "match",
      details: "Requires review and verification",
      timestamp: "2023-06-15 14:23",

    },
    {
      id: "watchlist",
      title: "Global Watchlist",
      description: "No matches found in World-Check database",
      status: "clear",
      timestamp: "2023-06-15 14:23",
    },
    {
      id: "media",
      title: "Adverse Media",
      description: "3 media references found related to corruption allegations",
      status: "match",
      details: "Requires further investigation",
      timestamp: "2023-06-15 14:23",
    },
    {
      id: "pep",
      title: "PEP Database",
      description: "Confirmed PEP status in official government registry",
      status: "match",
      details: "Active political exposure detected",
      timestamp: "2023-06-15 14:23",
    },
  ]
  return (
    <div>
      <h2 className='font-bold '>Risk Factors</h2>
      <div className='pt-4'>
        {/* Results Grid */}
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className={`border rounded-lg p-6 transition-all duration-200 `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(result.status)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{result.title}</h3>
                    <p className="text-foreground/80 mb-2">{result.description}</p>
                    {result.details && <p className="text-sm text-muted-foreground">{result.details}</p>}
                    <p className="text-xs text-muted-foreground mt-3">Screened on {result.timestamp}</p>
                  </div>
                </div>
                <Button variant={'outline'} className="whitespace-nowrap">
                  {result.status === "clear" ? "Clear" : "Review"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const tabs = [
  {
    title: "Profile",
    component: <Profile />,
  },
  {
    title: "Risk Factors",
    component: <RiskFactors />,
  },
  {
    title: "Relationships",
    component: <Relationships />,
  },
  {
    title: "Documents",
    component: <Documents />,
  },
  {
    title: "Activity History",
    component: <ActivityHistory />,
  },
];
export const ViewModal = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>View PEP</SheetTitle>
        </SheetHeader>

        <div className='px-8'>
          <div className='flex justify-between items-center'>
            <div className='flex  gap-4'>
              {/* img */}
              <div className='size-20 rounded-md object-cover overflow-hidden'>
                <img src="/profile.png" alt="" className='w-full h-full object-cover' />
              </div>
              {/* name, role */}
              <div>
                <h4 className='text-lg font-bold'>John Doe</h4>
                <p className='text-sm text-muted-foreground'>Minister of Finance</p>
                <p className='text-sm  font-bold'>Customer ID: C-10045</p>
              </div>
            </div>
            <div className='space-y-0'>
              <div>
                <span className='text-xs text-muted-foreground'>Last Screening</span>
                <p className='text-sm font-bold'>05-08-2025</p>
              </div>
              <div>
                <span className='text-xs text-muted-foreground'>New Screening Due</span>
                <p className='text-sm font-bold'>05-08-2025</p>
              </div>
            </div>
          </div>
          <div className='mt-3'>
            {tabs.map((tab) => (
              <button
                key={tab.title}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ",
                  activeTab.title === tab.title
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.title}
                {activeTab.title === tab.title && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
          <div className='py-8'>
            {activeTab.component}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}