import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Globe,
  Briefcase,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function CustomerProfile() {
  const customerData = {
    fullName: "John Smith",
    dateOfBirth: "1985-03-15",
    nationality: "United States",
    occupation: "Business Owner",
    accountStatus: "Active",
    associatedEntities: ["Smith Enterprises LLC", "Global Trading Co"],
  };

  const riskData = {
    overallRisk: "high",
    geographicRisk: 85,
    productRisk: 62,
    transactionRisk: 58,
  };

  const documents = [
    { name: "KYC Documentation", status: "pending" },
    { name: "ID Verification", status: "pending" },
    { name: "Address Proof", status: "pending" },
  ];

  const getRiskColor = (level) => {
    if (level >= 70) return "bg-destructive";
    if (level >= 40) return "bg-warning";
    return "bg-success";
  };

  const getRiskLabel = (level) => {
    if (level >= 70) return "High Risk";
    if (level >= 40) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {customerData.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-sm text-foreground">
                    {customerData.dateOfBirth}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Nationality
                  </p>
                  <p className="text-sm text-foreground">
                    {customerData.nationality}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Occupation
                  </p>
                  <p className="text-sm text-foreground">
                    {customerData.occupation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <Badge
                    variant="outline"
                    className="h-6 border-success/30 bg-success/10 text-success"
                  >
                    {customerData.accountStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  Associated Entities
                </p>
              </div>
              <div className="space-y-1.5">
                {customerData.associatedEntities.map((entity, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-muted/50 px-3 py-2 text-sm text-foreground"
                  >
                    {entity}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Gauge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Overall Risk Level
                </p>
                <span className="text-sm font-semibold text-destructive">
                  {getRiskLabel(riskData.geographicRisk)}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className="absolute inset-0 flex">
                  <div className="h-full w-1/3 bg-success/20" />
                  <div className="h-full w-1/3 bg-warning/20" />
                  <div className="h-full w-1/3 bg-destructive/20" />
                </div>
                <div
                  className="absolute top-0 h-full w-1 bg-foreground shadow-lg transition-all"
                  style={{ left: `${(riskData.geographicRisk / 100) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <Separator />

            {/* Risk Categories */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                Risk Categories
              </p>

              <div className="space-y-4">
                {/* Geographic Risk */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Geographic Risk
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {riskData.geographicRisk}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${getRiskColor(
                        riskData.geographicRisk
                      )}`}
                      style={{ width: `${riskData.geographicRisk}%` }}
                    />
                  </div>
                </div>

                {/* Product Risk */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Product Risk
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {riskData.productRisk}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${getRiskColor(
                        riskData.productRisk
                      )}`}
                      style={{ width: `${riskData.productRisk}%` }}
                    />
                  </div>
                </div>

                {/* Transaction Risk */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Transaction Risk
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {riskData.transactionRisk}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${getRiskColor(
                        riskData.transactionRisk
                      )}`}
                      style={{ width: `${riskData.transactionRisk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Source Documents */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Source Documents
                </p>
              </div>
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {doc.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs"
                    >
                      Review
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
