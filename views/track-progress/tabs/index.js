"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionListView from "@/views/transactions/list";
import { Banknote } from "lucide-react";
import RiskAssessmentTab from "./risk-assesment";
import PolicyForm from "@/views/knowledge-hub/policy-hub/policy-form";
import StaffOnboardingTab from "./staff-onboarding";
import TrainingTab from "./training";

const allTabs = [
  {
    name: "Transactions",
    icon: <Banknote className="mr-2 h-4 w-4" />,
    component: <TransactionListView showDashboard={false} />,
  },
  {
    name: "Risk Assessments",
    icon: <Banknote className="mr-2 h-4 w-4" />,
    component: <RiskAssessmentTab />,
  },
  {
    name: "Policy Hub",
    icon: <Banknote className="mr-2 h-4 w-4" />,
    component: <PolicyForm />,
  },
  {
    name: "Staff Onboarding",
    icon: <Banknote className="mr-2 h-4 w-4" />,
    component: <StaffOnboardingTab />,
  },
  {
    name: "Training",
    icon: <Banknote className="mr-2 h-4 w-4" />,
    component: <TrainingTab />,
  },
];

const ProgressTab = () => {
  const [activeTab, setActiveTab] = useState(allTabs[0].name);
  return (
    <div>
      <Tabs defaultValue={activeTab} className="">
        <TabsList>
          {allTabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name} onClick={() => setActiveTab(tab.name)}>
              {tab.icon}
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className={" w-full"}>
          {allTabs.find((tab) => tab.name === activeTab)?.component}
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProgressTab;
