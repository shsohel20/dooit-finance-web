"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  calculateInherentRisk,
  calculateResidualRisk,
} from "@/lib/risk-calculations";

const LIKELIHOOD_LEVELS = [
  "Rare",
  "Unlikely",
  "Possible",
  "Likely",
  "Almost Certain",
];
const IMPACT_LEVELS = [
  "Insignificant",
  "Minor",
  "Moderate",
  "Major",
  "Catastrophic",
];
const INHERENT_RISK_LEVELS = ["Low", "Medium", "High", "Very High", "Critical"];
const CONTROL_ASSESSMENTS = [
  "Excellent",
  "Good",
  "Adequate",
  "Poor",
  "Deficient",
];

const getRiskColor = (rating) => {
  switch (rating) {
    case "Low":
      return "bg-green-500 hover:bg-green-600";
    case "Medium":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "High":
      return "bg-orange-500 hover:bg-orange-600";
    case "Very High":
      return "bg-red-500 hover:bg-red-600";
    case "Critical":
      return "bg-purple-600 hover:bg-purple-700";
    default:
      return "bg-gray-500";
  }
};

export function RiskMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Matrices</CardTitle>
        <CardDescription>
          Interactive matrices for inherent and residual risk assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inherent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inherent">Matrix A: Inherent Risk</TabsTrigger>
            <TabsTrigger value="residual">Matrix B: Residual Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="inherent" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">
                Likelihood × Impact → Inherent Risk Rating
              </p>
              <p className="text-xs mt-1">
                Inherent risk is assessed before controls are applied, based on
                likelihood and impact.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted text-xs font-medium text-left w-32">
                        Likelihood ↓
                      </th>
                      {IMPACT_LEVELS.map((impact) => (
                        <th
                          key={impact}
                          className="border p-2 bg-muted text-xs font-medium text-center min-w-24"
                        >
                          {impact}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...LIKELIHOOD_LEVELS].reverse().map((likelihood) => (
                      <tr key={likelihood}>
                        <td className="border p-2 text-xs font-medium bg-muted">
                          {likelihood}
                        </td>
                        {IMPACT_LEVELS.map((impact) => {
                          const rating = calculateInherentRisk(
                            likelihood,
                            impact
                          );
                          return (
                            <td
                              key={`${likelihood}-${impact}`}
                              className="border p-0"
                            >
                              <div
                                className={`${getRiskColor(
                                  rating
                                )} text-white text-xs font-bold p-3 text-center cursor-pointer transition-colors`}
                                title={`${likelihood} × ${impact} = ${rating}`}
                              >
                                {rating}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              {INHERENT_RISK_LEVELS.map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded ${getRiskColor(level)}`}
                  ></div>
                  <span>{level}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="residual" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">
                Inherent Risk Rating × Control Assessment → Residual Risk Rating
              </p>
              <p className="text-xs mt-1">
                Residual risk is assessed after controls are applied, based on
                inherent risk and control effectiveness.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted text-xs font-medium text-left w-32">
                        Inherent Risk ↓
                      </th>
                      {CONTROL_ASSESSMENTS.map((control) => (
                        <th
                          key={control}
                          className="border p-2 bg-muted text-xs font-medium text-center min-w-24"
                        >
                          {control}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...INHERENT_RISK_LEVELS].reverse().map((inherentRisk) => (
                      <tr key={inherentRisk}>
                        <td className="border p-2 text-xs font-medium bg-muted">
                          {inherentRisk}
                        </td>
                        {CONTROL_ASSESSMENTS.map((control) => {
                          const rating = calculateResidualRisk(
                            inherentRisk,
                            control
                          );
                          return (
                            <td
                              key={`${inherentRisk}-${control}`}
                              className="border p-0"
                            >
                              <div
                                className={`${getRiskColor(
                                  rating
                                )} text-white text-xs font-bold p-3 text-center cursor-pointer transition-colors`}
                                title={`${inherentRisk} × ${control} = ${rating}`}
                              >
                                {rating}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              {INHERENT_RISK_LEVELS.map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded ${getRiskColor(level)}`}
                  ></div>
                  <span>{level}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
