"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { matters } from "../dashboard/dummyData"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, Circle, Calendar, DollarSign, User } from "lucide-react"

const statusColors = {
  active: "bg-info/20 text-info border-info/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  settled: "bg-success/20 text-success border-success/30",
  "on-hold": "bg-muted text-muted-foreground border-muted",
}

const taskStatusConfig = {
  completed: { icon: CheckCircle2, color: "text-success" },
  "in-progress": { icon: Clock, color: "text-warning" },
  pending: { icon: Circle, color: "text-muted-foreground" },
}

export default function TrackStatus() {
  // In a real app, this would be filtered by the logged-in client
  const clientMatters = matters.slice(0, 2)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Track Your Transactions</h1>
        <p className="text-muted-foreground">Monitor the progress of your property transactions</p>
      </div>

      <div className="space-y-6">
        {clientMatters.map((matter) => (
          <Card key={matter.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">{matter.id}</span>
                    <Badge variant="outline" className={cn("capitalize", statusColors[matter.status])}>
                      {matter.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {matter.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{matter.propertyAddress}</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${matter.purchasePrice.toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
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
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Conveyancer</p>
                    <p className="font-medium text-foreground">{matter.conveyancer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium text-foreground">
                      {new Date(matter.created).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="font-medium text-foreground">{matter.progress}% Complete</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium text-foreground">{matter.progress}%</span>
                </div>
                <Progress value={matter.progress} className="h-2" />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Task Progress</h4>
                <div className="space-y-3">
                  {matter.tasks.map((task, index) => {
                    const config = taskStatusConfig[task.status]
                    const Icon = config.icon
                    return (
                      <div key={task.id} className="flex items-center gap-4">
                        <div className="relative flex flex-col items-center">
                          <div className={cn("rounded-full p-1", config.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          {index < matter.tasks.length - 1 && (
                            <div
                              className={cn(
                                "absolute top-8 h-8 w-0.5",
                                task.status === "completed" ? "bg-success" : "bg-border",
                              )}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={cn(
                              "font-medium",
                              task.status === "completed" ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {task.name}
                          </p>
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
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
