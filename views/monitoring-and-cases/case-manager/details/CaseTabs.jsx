"use client";

import { useState, lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  IconUser,
  IconCreditCard,
  IconNetwork,
  IconUserCheck,
  IconDevices,
  IconLink,
  IconFolder,
  IconArrowsExchange,
  IconTimeline,
} from "@tabler/icons-react";

const CustomerInfoTab = lazy(() => import("./tabs/CustomerInfoTab"));
const ATMInfoTab = lazy(() => import("./tabs/ATMInfoTab"));
const RelationshipsTab = lazy(() => import("./tabs/RelationshipsTab"));
const CaseAssignmentTab = lazy(() => import("./tabs/CaseAssignmentTab"));
const DeviceInfoTab = lazy(() => import("./tabs/DeviceInfoTab"));
const RelatedCasesTab = lazy(() => import("./tabs/RelatedCasesTab"));
const FilesTab = lazy(() => import("./tabs/FilesTab"));
const TransactionsTab = lazy(() => import("./tabs/TransactionsTab"));
const ActivityTimelineTab = lazy(() => import("./tabs/ActivityTimelineTab"));

const TABS = [
  { id: "customer", label: "Customer Info", icon: IconUser, component: CustomerInfoTab },
  { id: "atm", label: "ATM Info", icon: IconCreditCard, component: ATMInfoTab },
  { id: "relationships", label: "Relationships", icon: IconNetwork, component: RelationshipsTab },
  { id: "assignment", label: "Case Assignment", icon: IconUserCheck, component: CaseAssignmentTab },
  { id: "devices", label: "Device Info", icon: IconDevices, component: DeviceInfoTab },
  { id: "related", label: "Related Cases", icon: IconLink, component: RelatedCasesTab },
  { id: "files", label: "Files", icon: IconFolder, component: FilesTab },
  { id: "transactions", label: "Transactions", icon: IconArrowsExchange, component: TransactionsTab },
  { id: "timeline", label: "Activity Timeline", icon: IconTimeline, component: ActivityTimelineTab },
];

function TabLoadingSkeleton() {
  return (
    <div className="space-y-3 p-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function CaseTabs({ caseData }) {
  const [activeTab, setActiveTab] = useState("customer");

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="flex flex-col gap-0 lg:flex-row">
      {/* Sidebar */}
      <aside className="shrink-0 lg:w-52 xl:w-56">
        <nav className="flex flex-row flex-wrap gap-1 rounded-xl border bg-white p-2 shadow-sm lg:flex-col lg:flex-nowrap lg:gap-0.5 lg:rounded-xl lg:p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-heading",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden sm:inline lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 lg:pl-4 mt-4 lg:mt-0">
        <Suspense fallback={<TabLoadingSkeleton />}>
          {ActiveComponent && <ActiveComponent caseData={caseData} />}
        </Suspense>
      </div>
    </div>
  );
}
