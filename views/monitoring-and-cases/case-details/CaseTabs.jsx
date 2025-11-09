"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SummaryAndTimeline from "./SummaryTimeline";
import CustomerProfile from "./CustomerProfile";
import RFI from "./RFI";
import ActionAndDisposition from "./ActionAndDisposition";
import InvestigationPanel from "./InvestigationPanel";

const tabs = [
  {
    title: "Summary and Timeline",
    component: <SummaryAndTimeline />,
  },
  {
    title: "Customer profile & CRA",
    component: <CustomerProfile />,
  },
  {
    title: "Investigation panel",
    component: <InvestigationPanel />,
  },
  {
    title: "ECDD Review",
    component: <div />,
  },
  {
    title: "RFI",
    component: <RFI />,
  },
  {
    title: "Action & disposition",
    component: <ActionAndDisposition />,
  },
];

export default function CaseTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <>
      <nav className="flex gap-1 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ",
              activeTab.title === tab.title
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.title}
            {activeTab.title === tab.title && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </nav>
      <main className="  py-8">{activeTab.component}</main>
    </>
  );
}
