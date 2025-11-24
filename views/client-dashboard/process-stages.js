import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stages = [
  { name: "Collect", cases: 890, bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  {
    name: "Verify",
    cases: 350,
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  {
    name: "CRA Unique",
    cases: 1020,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
]

export function ProcessStages() {
  return (
    <Card className="border bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">KYC Process Overview Dashboard</CardTitle>
        <p className="text-sm text-muted-foreground">Pipeline stages and case volume</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map((stage) => (
            <div key={stage.name} className={`${stage.bgColor} border ${stage.borderColor} rounded-lg p-5`}>
              <p className={`text-sm font-medium ${stage.textColor} mb-2`}>{stage.name}</p>
              <p className="text-3xl font-semibold text-foreground mb-1">{stage.cases.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Cases</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
