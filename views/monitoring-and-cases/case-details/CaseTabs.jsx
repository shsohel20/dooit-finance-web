"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SummaryAndTimeline from "./SummaryTimeline";
import CustomerProfile from "./CustomerProfile";
import RFI from "./RFI";
import ActionAndDisposition from "./ActionAndDisposition";
import InvestigationPanel from "./InvestigationPanel";
import Ecdd from "./Ecdd";
import { getCaseDetails } from "@/app/dashboard/client/monitoring-and-cases/case-list/actions";
import { useEffect } from "react";
import useAlertStore from "@/app/store/alerts";
import { useSearchParams } from "next/navigation";
import UILoader from "@/components/UILoader";

const tabs = [
  {
    title: "Summary and Timeline",
    component: <SummaryAndTimeline />,
    id: "summary-and-timeline",
  },
  {
    title: "Customer profile & CRA",
    component: <CustomerProfile />,
    id: "customer-profile-and-cra",
  },
  {
    title: "Investigation panel",
    component: <InvestigationPanel />,
    id: "investigation-panel",
  },
  {
    title: "ECDD Review",
    component: <Ecdd />,
    id: "ecdd-review",
  },
  {
    title: "RFI",
    component: <RFI />,
    id: "rfi",
  },
  {
    title: "Action & disposition",
    component: <ActionAndDisposition />,
    id: "action-and-disposition",
  },
];

export default function CaseTabs({ caseNumber, id, tab = "summary-and-timeline" }) {
  const { details, setDetails, setFetching, fetching } = useAlertStore();

  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    return () => {
      setDetails(null);
      setFetching(false);
    };
  }, []);
  useEffect(() => {
    const tabObj = tabs.find((t) => t.id === tab);

    setActiveTab(tabObj || tabs[0]);
  }, [tab]);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getCaseDetails(id);
        console.log("alert details response", response);
        setDetails(response?.data || null);
      } catch (error) {
        console.error("Failed to get data", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="bg-white p-4 rounded-lg">
      <nav className="flex gap-1 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab?.title}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ",
              activeTab?.title === tab?.title
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.title}
            {activeTab?.title === tab?.title && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </nav>
      <UILoader loading={fetching} type="page">
        <main className="  py-8">{activeTab.component}</main>
      </UILoader>
    </div>
  );
}
