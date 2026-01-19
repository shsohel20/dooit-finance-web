import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, Upload, AlertCircle, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    type: "document",
    icon: Upload,
    title: "Document uploaded",
    description: "Building Inspection Report for 42 Collins St",
    time: "2 hours ago",
    color: "text-info",
  },
  {
    id: 2,
    type: "settlement",
    icon: CheckCircle2,
    title: "Settlement completed",
    description: "MAT-2024-003 successfully settled",
    time: "5 hours ago",
    color: "text-success",
  },
  {
    id: 3,
    type: "payment",
    icon: DollarSign,
    title: "Payment received",
    description: "Deposit of $125,000 for MAT-2024-001",
    time: "1 day ago",
    color: "text-primary",
  },
  {
    id: 4,
    type: "alert",
    icon: AlertCircle,
    title: "Compliance alert",
    description: "KYC verification pending for Chen Wei",
    time: "1 day ago",
    color: "text-warning",
  },
  {
    id: 5,
    type: "contract",
    icon: FileText,
    title: "Contract signed",
    description: "Contract of Sale for 18 Beach Road",
    time: "2 days ago",
    color: "text-success",
  },
]

export function ActivityFeed() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className={cn("rounded-full bg-secondary p-2", activity.color)}>
                  <activity.icon className="h-4 w-4" />
                </div>
                {index < activities.length - 1 && <div className="absolute top-10 h-full w-px bg-border" />}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
