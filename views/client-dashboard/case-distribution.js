import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Open", value: 56, color: "bg-primary " },
  { label: "Pending", value: 120, color: "bg-primary-light " },
  { label: "Closed", value: 290, color: "bg-accent " },
];

export function CaseDistribution() {
  const total = stats.reduce((acc, stat) => acc + stat.value, 0);

  return (
    <Card className="border bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Case Status Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Current case breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
          <p className="text-4xl font-semibold text-heading font-mono">{total}</p>
        </div>

        <div className="flex flex-col gap-2">
          {stats.map((stat) => {
            const percentage = ((stat.value / total) * 100).toFixed(1);
            return (
              <div
                key={stat.label}
                className="relative border w-full px-4 rounded-md flex items-center gap-2 py-3"
              >
                <div className={`${stat.color} size-4  rounded-full flex-shrink-0`} />
                <div className="flex justify-between text-sm   w-full">
                  <span className="text-heading font-medium">{stat.label}</span>
                  <span className="font-semibold text-foreground">
                    {stat.value} <span className="text-primary-gray text-xs">({percentage}%)</span>
                  </span>
                </div>
                {/* <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stat.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div> */}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
