"use client";

import { useState, useCallback } from "react";
import { CustomerHeader } from "./customer-header";
import { OsintScanStatus } from "./osint-scan-status";
import { AdverseMediaPanel } from "./adverse-media-panel";
import { SanctionsPepPanel } from "./sanctions-pep-panel";
import { PublicRecordsPanel } from "./public-records-panel";
import { RiskIndicatorsPanel } from "./risk-indicators-panel";
import { EvidencePanel } from "./evidence-panel";
import { AnalystNotesPanel } from "./analyst-notes-panel";
import { ComplianceDisclaimer } from "./compliance-disclaimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockCustomer, mockOsintResults } from "@/lib/customer-data";
import {
  Newspaper,
  ShieldAlert,
  FileSearch,
  AlertTriangle,
  Paperclip,
  MessageSquare,
} from "lucide-react";

export default function OSINTPage() {
  const customer = mockCustomer;
  const [scan, setScan] = useState(mockOsintResults);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshScan = useCallback(() => {
    setIsRefreshing(true);
    // Simulate scan refresh
    setTimeout(() => {
      setScan((prev) => ({
        ...prev,
        status: "completed",
        lastScanDate: new Date().toISOString(),
        scanDuration: "2m 58s",
        triggeredBy: "Manual Refresh",
      }));
      setIsRefreshing(false);
    }, 3000);
  }, []);

  const criticalCount = scan.riskIndicators.filter((r) => r.severity === "critical").length;
  const highCount = scan.riskIndicators.filter((r) => r.severity === "high").length;

  return (
    <div className="min-h-screen ">
      <CustomerHeader customer={customer} />

      <main className=" max-w-7xl px-4 py-6 lg:px-8">
        {/* OSINT Scan Status */}
        <OsintScanStatus scan={scan} onRefresh={handleRefreshScan} isRefreshing={isRefreshing} />

        {/* Identifiers used for scan */}
        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Identifiers Used for Scan
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              customer.fullName,
              ...customer.aliases,
              `DOB: ${customer.dateOfBirth}`,
              customer.nationality,
              customer.countryOfResidence,
            ].map((id) => (
              <span
                key={id}
                className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 text-xs font-mono text-foreground"
              >
                {id}
              </span>
            ))}
          </div>
        </div>

        {/* Tabbed results */}
        <Tabs defaultValue="media" className="mt-6">
          <TabsList>
            <TabsTrigger value="media">
              <Newspaper className="size-3.5" />
              Adverse Media
              {scan.adverseMedia.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-1 h-5 min-w-5 bg-orange-50 text-orange-700 border-orange-200 text-[10px] px-1.5"
                >
                  {scan.adverseMedia.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sanctions">
              <ShieldAlert className="size-3.5" />
              Sanctions / PEP
              {scan.sanctionsPep.filter((s) => s.status !== "false_positive").length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-1 h-5 min-w-5 bg-red-50 text-red-700 border-red-200 text-[10px] px-1.5"
                >
                  {scan.sanctionsPep.filter((s) => s.status !== "false_positive").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="records">
              <FileSearch className="size-3.5" />
              Public Records
              {scan.publicRecords.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-1 h-5 min-w-5 bg-muted text-muted-foreground text-[10px] px-1.5"
                >
                  {scan.publicRecords.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="risk">
              <AlertTriangle className="size-3.5" />
              Risk Flags
              {(criticalCount > 0 || highCount > 0) && (
                <Badge
                  variant="outline"
                  className="ml-1 h-5 min-w-5 bg-red-50 text-red-700 border-red-200 text-[10px] px-1.5"
                >
                  {criticalCount + highCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="evidence">
              <Paperclip className="size-3.5" />
              Evidence
              <Badge
                variant="outline"
                className="ml-1 h-5 min-w-5 bg-muted text-muted-foreground text-[10px] px-1.5"
              >
                {scan.evidenceItems.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="size-3.5" />
              Analyst Notes
              <Badge
                variant="outline"
                className="ml-1 h-5 min-w-5 bg-muted text-muted-foreground text-[10px] px-1.5"
              >
                {scan.analystNotes.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="mt-5">
            <TabsContent value="media">
              <AdverseMediaPanel items={scan.adverseMedia} />
            </TabsContent>
            <TabsContent value="sanctions">
              <SanctionsPepPanel items={scan.sanctionsPep} />
            </TabsContent>
            <TabsContent value="records">
              <PublicRecordsPanel items={scan.publicRecords} />
            </TabsContent>
            <TabsContent value="risk">
              <RiskIndicatorsPanel items={scan.riskIndicators} />
            </TabsContent>
            <TabsContent value="evidence">
              <EvidencePanel items={scan.evidenceItems} />
            </TabsContent>
            <TabsContent value="notes">
              <AnalystNotesPanel notes={scan.analystNotes} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Compliance Disclaimer */}
        <div className="mt-8 mb-6">
          <ComplianceDisclaimer
            lastScanDate={scan.lastScanDate}
            sourcesCount={scan.sourcesChecked.length}
          />
        </div>
      </main>
    </div>
  );
}
