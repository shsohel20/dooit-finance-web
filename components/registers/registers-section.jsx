"use client";
import React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ECDDRegister } from "./ecdd-register";
import { BreachIncidentRegister } from "./breach-incident-register";
import { ThirdPartyRegister } from "./third-party-register";
import { EscalationsExemptionsRegister } from "./escalations-exemptions-register";
import { ExternalRequestsRegister } from "./external-requests-register";
import { ConflictsRegister } from "./conflicts-register";
import { RiskStatusRegister } from "./risk-status-register";
import { SMRRegister } from "./smr-register";
import { TrainingSection } from "../training/training-section";

export function RegistersSection() {
  const [activeTab, setActiveTab] = useState("ecdd");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Compliance Registers
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all compliance registers and case workflows
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-2">
          <TabsTrigger value="ecdd" className="text-xs">
            ECDD & RFI
          </TabsTrigger>
          <TabsTrigger value="breach" className="text-xs">
            Breaches
          </TabsTrigger>
          <TabsTrigger value="third-party" className="text-xs">
            Third-Party
          </TabsTrigger>
          <TabsTrigger value="escalations" className="text-xs">
            Escalations
          </TabsTrigger>
          <TabsTrigger value="external" className="text-xs">
            Legal Orders
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="text-xs">
            Conflicts
          </TabsTrigger>
          <TabsTrigger value="risk-status" className="text-xs">
            WSTI
          </TabsTrigger>
          <TabsTrigger value="smr" className="text-xs">
            SMR
          </TabsTrigger>
          <TabsTrigger value="training" className="text-xs">
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ecdd" className="space-y-4">
          <ECDDRegister />
        </TabsContent>

        <TabsContent value="breach" className="space-y-4">
          <BreachIncidentRegister />
        </TabsContent>

        <TabsContent value="third-party" className="space-y-4">
          <ThirdPartyRegister />
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <EscalationsExemptionsRegister />
        </TabsContent>

        <TabsContent value="external" className="space-y-4">
          <ExternalRequestsRegister />
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <ConflictsRegister />
        </TabsContent>

        <TabsContent value="risk-status" className="space-y-4">
          <RiskStatusRegister />
        </TabsContent>

        <TabsContent value="smr" className="space-y-4">
          <SMRRegister />
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <TrainingSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
