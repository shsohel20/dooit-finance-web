import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, AlertCircle, ArrowRight } from "lucide-react"

const customers = [
  { name: "Jin Park", riskScore: 94 },
  { name: "Alex Smith", riskScore: 88 },
  { name: "Robert Cruz", riskScore: 79 },
  { name: "Alice Johnson", riskScore: 70 },
  { name: "Ben Williams", riskScore: 84 },
]

export function HighRiskCustomers() {
  return (
    <Card className="border bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              High-Risk Customers
            </CardTitle>
            <p className="text-sm text-muted-foreground">Requires immediate attention</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.name}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="font-medium text-foreground">{customer.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">
                  RISK SCORE: {customer.riskScore}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
