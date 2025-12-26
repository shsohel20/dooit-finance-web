import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stages = [
  {
    name: "Collect",
    cases: 890,
    bgColor: "bg-primary/5",
    textColor: "text-primary",
    borderColor: "border-primary/5",
  },
  {
    name: "Verify",
    cases: 350,
    bgColor: "bg-primary-light/5",
    textColor: "text-primary-light",
    borderColor: "border-primary-light/5",
  },
  {
    name: "CRA Unique",
    cases: 1020,
    bgColor: "bg-accent/5",
    textColor: "text-accent",
    borderColor: "border-accent/5",
  },
];

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
            <div
              key={stage.name}
              className={`${stage.bgColor} border ${stage.borderColor} rounded-lg p-5`}
            >
              <p className={`text-sm font-medium tracking-tight ${stage.textColor} mb-2`}>
                {stage.name}
              </p>
              <p className="text-3xl font-semibold text-foreground mb-1 font-mono">
                {stage.cases.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Cases</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
