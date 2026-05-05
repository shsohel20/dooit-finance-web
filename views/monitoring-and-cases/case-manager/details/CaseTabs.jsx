"use client";

import { useState, lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  IconUserCheck,
  IconTimeline,
  IconNotes,
  IconClipboardList,
  IconUser,
  IconArrowsExchange,
  IconNetwork,
  IconCreditCard,
  IconDevices,
  IconLink,
  IconBell,
} from "@tabler/icons-react";

const CaseAssignmentTab = lazy(() => import("./tabs/CaseAssignmentTab"));
const LinkedAlertsTab   = lazy(() => import("./tabs/LinkedAlertsTab"));
const ActivityTimelineTab = lazy(() => import("./tabs/ActivityTimelineTab"));
const CaseNotesTab = lazy(() => import("./tabs/CaseNotesTab"));
const AuditLogTab = lazy(() => import("./tabs/AuditLogTab"));
const CustomerInfoTab = lazy(() => import("./tabs/CustomerInfoTab"));
const TransactionsTab = lazy(() => import("./tabs/TransactionsTab"));
const RelationshipsTab = lazy(() => import("./tabs/RelationshipsTab"));
const ATMInfoTab = lazy(() => import("./tabs/ATMInfoTab"));
const DeviceInfoTab = lazy(() => import("./tabs/DeviceInfoTab"));
const RelatedCasesTab = lazy(() => import("./tabs/RelatedCasesTab"));

const TABS = [
  { id: "assignment",  label: "Assignment",    icon: IconUserCheck,      component: CaseAssignmentTab },
  { id: "alerts",      label: "Linked Alerts", icon: IconBell,           component: LinkedAlertsTab },
  { id: "notes",       label: "Notes",         icon: IconNotes,          component: CaseNotesTab },
  { id: "audit",       label: "Audit Log",     icon: IconClipboardList,  component: AuditLogTab },
  { id: "timeline",    label: "Activity",      icon: IconTimeline,       component: ActivityTimelineTab },
  { id: "customer",    label: "Customer",      icon: IconUser,           component: CustomerInfoTab },
  { id: "transactions",label: "Transactions",  icon: IconArrowsExchange, component: TransactionsTab },
  { id: "relationships",label: "Relationships",icon: IconNetwork,        component: RelationshipsTab },
  { id: "atm",         label: "ATM Info",      icon: IconCreditCard,     component: ATMInfoTab },
  { id: "devices",     label: "Device Info",   icon: IconDevices,        component: DeviceInfoTab },
  { id: "related",     label: "Related Cases", icon: IconLink,           component: RelatedCasesTab },
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

export default function CaseTabs({ caseData, onCaseUpdate }) {
  const [activeTab, setActiveTab] = useState("assignment");

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="flex flex-col gap-0">
      <aside className="shrink-0">
        <nav className="flex flex-row flex-wrap gap-1 rounded-xl bg-gray-50 p-2">
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
                    ? "bg-primary text-primary-foreground font-medium"
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

      <div className="flex-1 mt-4">
        <Suspense fallback={<TabLoadingSkeleton />}>
          {ActiveComponent && (
            <ActiveComponent caseData={caseData} onCaseUpdate={onCaseUpdate} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
