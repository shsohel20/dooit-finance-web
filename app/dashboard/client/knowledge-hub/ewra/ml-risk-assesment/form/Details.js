import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Megaphone, Play, Search } from 'lucide-react'
import MetricsOverview from './MetricsOverview'
import QuickActionsSection from './QuickActions'
import ProgressTraining from './ProgressTraining'
import SystemDetails from './SystemDetails'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import TimelineEvent from './TimelineEvent'
import ImpactAnalysis from './ImpactAnalysis'
import DocumentsTable from './DocumentsTable'
const tabs = [
  { id: 'status', label: 'Mitigation Status' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'impact', label: 'Impact Analysis' },
  { id: 'documents', label: 'Documents' },
]

const actionPlan = [
  {
    id: 1,
    title: 'Data Quality Assessment',
    description: 'Analyze recent data patterns and identify drift sources',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: 'Model Retraining',
    description: 'Retrain model with updated dataset',
    status: 'in-progress',
    icon: Clock,
  },
  {
    id: 3,
    title: 'Validation Testing',
    description: 'Test retrained model against validation dataset',
    status: 'pending',
    icon: AlertCircle,
  },
  {
    id: 4,
    title: 'Deployment',
    description: 'Deploy updated model to production environment',
    status: 'pending',
    icon: ArrowRight,
  },
]

export default function Details({ open, setOpen }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto '>
        <SheetHeader>
          <SheetTitle>Risk Details</SheetTitle>
          <SheetDescription>
            View the risk details here.
          </SheetDescription>
        </SheetHeader>

        <div>
          <div className="min-h-screen ">
            {/* Header */}
            <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">KYC Fraud Detection</h1>
                      <p className="text-sm text-muted-foreground">Performance Monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-semibold text-green-500">Monitoring Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
              {/* Metrics Grid */}
              <MetricsOverview />

              {/* Quick Actions and Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2">
                  <QuickActionsSection />
                </div>
                <div>
                  <ProgressTraining />
                </div>
              </div>

              {/* System Details */}
              <SystemDetails />
            </main>
          </div>



          <Tabs defaultValue="status" className="w-full px-8 py-4">
            <TabsList className="">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn('data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none text-sm font-medium transition-all py-3 px-4 text-xs')}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Status Tab Content */}
            <TabsContent value="status" className="p-2">
              <StatusTab />
            </TabsContent>

            {/* Placeholder tabs */}
            <TabsContent value="timeline" className="p-2">

              <MitigationTimeline />

            </TabsContent>

            <TabsContent value="impact" className="p-2">
              <ImpactAnalysis />
            </TabsContent>

            <TabsContent value="documents" className="p-2">
              <DocumentsTable />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}


const StatusTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Action Plan */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-4 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-3 text-white" />
            </div>
            <h2 className=" font-bold text-foreground">Action Plan</h2>
          </div>

          <div className="">
            {actionPlan.map((item, index) => {
              const Icon = item.icon
              const statusColors = {
                completed: 'bg-green-50 border-green-200',
                'in-progress': 'bg-blue-50 border-blue-200',
                pending: 'bg-gray-50 border-gray-200',
              }

              const iconColors = {
                completed: 'bg-green-500 text-white',
                'in-progress': 'bg-blue-500 text-white',
                pending: 'bg-gray-300 text-gray-600',
              }

              return (
                <div key={item.id}>
                  <div className={`rounded-lg border-2 p-6 transition-all ${statusColors[item.status]}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[item.status]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground ">{item.title}</h3>
                        <p className="text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-white/60">
                        {item.status === 'completed' && <span className="text-green-700">Completed</span>}
                        {item.status === 'in-progress' && <span className="text-blue-700">In Progress</span>}
                        {item.status === 'pending' && <span className="text-gray-600">Pending</span>}
                      </div>
                    </div>
                  </div>
                  {index < actionPlan.length - 1 && (
                    <div className="flex justify-center my-3">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-gray-300 to-gray-200" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
          <h3 className="font-bold text-foreground mb-6">Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Completed</span>
              <span className="text-xl font-bold text-green-600">1/4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }} />
            </div>

            <div className="pt-4 space-y-3 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-muted-foreground">Data Quality Assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs text-muted-foreground">Model Retraining</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="text-xs text-muted-foreground">Validation Testing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="text-xs text-muted-foreground">Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const events = [
  {
    id: 1,
    timestamp: '2023-05-18 15:45',
    title: 'Model Retraining Initiated',
    description: 'Retraining process started with updated dataset. Expected completion in 2 hours.',
    icon: Play,
    status: 'completed'
  },
  {
    id: 2,
    timestamp: '2023-05-18 16:20',
    title: 'Root Cause Identified',
    description: 'Data drift detected in customer behavior patterns due to recent market changes.',
    icon: Search,
    status: 'completed'
  },
  {
    id: 3,
    timestamp: '2023-05-18 16:45',
    title: 'Stakeholders Notified',
    description: 'Risk management team and business stakeholders informed about the issue.',
    icon: Megaphone,
    status: 'completed'
  },
  {
    id: 4,
    timestamp: '2023-05-18 17:30',
    title: 'Risk Detected',
    description: 'Automated monitoring system detected performance degradation in KYC Fraud Detection model.',
    icon: AlertCircle,
    status: 'active'
  }
];
const MitigationTimeline = () => {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 text-center md:text-left">
        <h1 className=" font-bold text-foreground mb-1 tracking-tight">
          Mitigation Timeline
        </h1>
        <p className="text-muted-foreground">
          Tracking incident response and resolution steps
        </p>
      </div>

      <div className="relative ">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-muted" />

        {/* Events */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <TimelineEvent key={event.id} event={event} isLast={index === events.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
