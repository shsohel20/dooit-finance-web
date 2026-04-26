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
  { id: "assignment", label: "Case Assignment", icon: IconUserCheck, component: CaseAssignmentTab },
  { id: "related", label: "Related Cases", icon: IconLink, component: RelatedCasesTab },
  { id: "customer", label: "Customer Info", icon: IconUser, component: CustomerInfoTab },

  {
    id: "transactions",
    label: "Transactions",
    icon: IconArrowsExchange,
    component: TransactionsTab,
  },
  { id: "relationships", label: "Relationships", icon: IconNetwork, component: RelationshipsTab },
  { id: "atm", label: "ATM Info", icon: IconCreditCard, component: ATMInfoTab },
  // { id: "files", label: "Files", icon: IconFolder, component: FilesTab },
  { id: "devices", label: "Device Info", icon: IconDevices, component: DeviceInfoTab },

  {
    id: "timeline",
    label: "Activity Timeline",
    icon: IconTimeline,
    component: ActivityTimelineTab,
  },
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
  const [activeTab, setActiveTab] = useState("assignment");

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="flex flex-col gap-0 ">
      {/* Sidebar */}
      <aside className="shrink-0 ">
        <nav className="flex flex-row flex-wrap gap-1 rounded-xl  bg-gray-50 p-2 ">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors text-xs",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium "
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
      <div className="flex-1  mt-4 ">
        <Suspense fallback={<TabLoadingSkeleton />}>
          {ActiveComponent && <ActiveComponent caseData={caseData} />}
        </Suspense>
      </div>
    </div>
  );
}
