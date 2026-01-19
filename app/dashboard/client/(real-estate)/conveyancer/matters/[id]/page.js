import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  Download,
  Upload,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { documents, matters } from "@/views/real-estate/dashboard/dummyData"

const statusColors = {
  active: "bg-info/20 text-info border-info/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  settled: "bg-success/20 text-success border-success/30",
  "on-hold": "bg-muted text-muted-foreground border-muted",
}

const taskStatusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  "in-progress": { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted/10" },
}

export default async function MatterDetailPage({ params }) {
  const { id } = await params
  const matter = matters.find((m) => m.id === id) || matters[0]
  const matterDocuments = documents.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/conveyancer/matters">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-muted-foreground">{matter.id}</span>
            <Badge variant="outline" className={cn("capitalize", statusColors[matter.status])}>
              {matter.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {matter.type}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{matter.propertyAddress}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Client
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Matter Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="font-medium text-foreground">{matter.client}</p>
                    <p className="text-xs text-muted-foreground">{matter.clientEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Settlement Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(matter.settlementDate).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="font-medium text-foreground">{matter.progress}%</span>
                </div>
                <Progress value={matter.progress} className="h-3" />
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <h4 className="font-medium text-foreground">Financial Summary</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Purchase Price</p>
                    <p className="text-xl font-bold text-foreground">${matter.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deposit Held</p>
                    <p className="text-xl font-bold text-foreground">
                      ${(matter.purchasePrice * 0.1).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Settlement</p>
                    <p className="text-xl font-bold text-foreground">
                      ${(matter.purchasePrice * 0.9).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Task Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matter.tasks.map((task, index) => {
                      const config = taskStatusConfig[task.status]
                      const Icon = config.icon
                      return (
                        <div key={task.id} className="flex items-center gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className={cn("rounded-full p-2", config.bg)}>
                              <Icon className={cn("h-4 w-4", config.color)} />
                            </div>
                            {index < matter.tasks.length - 1 && (
                              <div
                                className={cn(
                                  "absolute top-10 h-8 w-0.5",
                                  task.status === "completed" ? "bg-success" : "bg-border",
                                )}
                              />
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                            <div>
                              <p className="font-medium text-foreground">{task.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(task.dueDate).toLocaleDateString("en-AU")}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "capitalize",
                                task.status === "completed" && "bg-success/20 text-success border-success/30",
                                task.status === "in-progress" && "bg-warning/20 text-warning border-warning/30",
                                task.status === "pending" && "bg-muted text-muted-foreground border-muted",
                              )}
                            >
                              {task.status.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Documents</CardTitle>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matterDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString("en-AU")}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="rounded-full bg-success/10 p-2 h-fit">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Contract signed by client</p>
                        <p className="text-sm text-muted-foreground">December 18, 2024 at 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="rounded-full bg-info/10 p-2 h-fit">
                        <FileText className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Title search completed</p>
                        <p className="text-sm text-muted-foreground">December 16, 2024 at 10:15 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="rounded-full bg-primary/10 p-2 h-fit">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Matter created</p>
                        <p className="text-sm text-muted-foreground">December 15, 2024 at 9:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No notes added yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Generate Contract
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Settlement
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                Send to PEXA
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Flag Issue
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract Date</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(matter.created).toLocaleDateString("en-AU")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Finance Deadline</span>
                <span className="text-sm font-medium text-foreground">Jan 10, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Building Inspection</span>
                <span className="text-sm font-medium text-foreground">Jan 5, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Settlement</span>
                <span className="text-sm font-medium text-primary">
                  {new Date(matter.settlementDate).toLocaleDateString("en-AU")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Purchaser</p>
                <p className="font-medium text-foreground">{matter.client}</p>
                <p className="text-sm text-muted-foreground">{matter.clientEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendor</p>
                <p className="font-medium text-foreground">Property Holdings Pty Ltd</p>
                <p className="text-sm text-muted-foreground">vendor@example.com</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendor Solicitor</p>
                <p className="font-medium text-foreground">Smith & Associates</p>
                <p className="text-sm text-muted-foreground">legal@smith.com.au</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
