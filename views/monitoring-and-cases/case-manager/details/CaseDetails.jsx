"use client";

import { useMemo, useRef, useState, lazy, Suspense } from "react";
import {
  IconFolderOff,
  IconBriefcase,
  IconUser,
  IconCreditCard,
  IconFolder,
  IconClipboardList,
} from "@tabler/icons-react";
import { mockCases } from "@/lib/case-manager-data";
import { Skeleton } from "@/components/ui/skeleton";
import CaseHeader from "./CaseHeader";
import CustomerProfileSection from "./sections/CustomerProfileSection";
import TransactionAnalysisSection from "./sections/TransactionAnalysisSection";
import CaseActivityView from "./CaseActivityView";
import InvestigationHub from "./investigation-hub/InvestigationHub";
import CreateRFIModal from "./modals/CreateRFIModal";
import ReassignCaseModal from "./modals/ReassignCaseModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FilesTab = lazy(() => import("./tabs/FilesTab"));

function FilesTabSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function CaseDetails({ caseId }) {
  const caseData = useMemo(() => mockCases.find((c) => c._id === caseId) || null, [caseId]);

  const [status, setStatus] = useState(caseData?.status);
  const [priority, setPriority] = useState(caseData?.priority);
  const [assignedAnalyst, setAssignedAnalyst] = useState(caseData?.assignedAnalyst);
  const [assignment, setAssignment] = useState(caseData?.assignment);
  const [notes, setNotes] = useState(caseData?.notes || []);
  const [rfis, setRfis] = useState(caseData?.rfis || []);
  const [activities, setActivities] = useState(caseData?.activities || []);
  const [auditLog, setAuditLog] = useState(caseData?.auditLog || []);

  const [assignOpen, setAssignOpen] = useState(false);
  const [rfiOpen, setRfiOpen] = useState(false);

  const sectionRefs = useRef({});
  const setSectionRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const logAction = ({
    user = "You",
    action,
    previousValue = "—",
    newValue = "—",
    description,
  }) => {
    const now = new Date().toISOString();
    setAuditLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: now,
        user,
        action,
        previousValue,
        newValue,
        ip: "10.44.2.18",
        device: "Chrome / Windows 11",
      },
    ]);
    setActivities((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "comment",
        date: now,
        user,
        description: description || action,
      },
    ]);
  };

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <IconFolderOff className="mb-3 size-12 opacity-40" />
        <p className="text-sm font-medium">Case not found</p>
        <p className="mt-1 text-xs">The case ID &quot;{caseId}&quot; does not exist.</p>
      </div>
    );
  }

  const handleEscalate = (reason) => {
    setPriority((prev) => {
      logAction({
        action: "Case Escalated",
        previousValue: prev,
        newValue: "Critical",
        description: `Case escalated to Critical priority${reason ? `: ${reason}` : ""}`,
      });
      return "Critical";
    });
  };

  const handleGenerateSTR = (reason) => {
    logAction({
      action: "STR/SAR Draft Generated",
      previousValue: "—",
      newValue: "Draft created",
      description: `STR/SAR draft generated${reason ? `: ${reason}` : ""}`,
    });
  };

  const handleCloseCase = (reason) => {
    setStatus((prev) => {
      logAction({
        action: "Case Closed",
        previousValue: prev,
        newValue: "Closed",
        description: `Case closed${reason ? `: ${reason}` : ""}`,
      });
      return "Closed";
    });
  };

  const handleReopenCase = () => {
    setStatus((prev) => {
      logAction({
        action: "Case Reopened",
        previousValue: prev,
        newValue: "Active",
        description: "Case reopened for further investigation",
      });
      return "Active";
    });
  };

  const handleReassign = ({ analyst, reason }) => {
    setAssignedAnalyst((prev) => {
      logAction({
        action: "Reassigned Investigator",
        previousValue: prev,
        newValue: analyst,
        description: `Reassigned from ${prev} to ${analyst}. Reason: ${reason}`,
      });
      setAssignment((prevAssignment) => ({
        ...prevAssignment,
        assignedAnalyst: analyst,
        history: [
          ...(prevAssignment?.history || []),
          { analyst, date: new Date().toISOString(), action: "Reassigned" },
        ],
      }));
      return analyst;
    });
  };

  const handleCreateRFI = ({ documents, dueDate, message }) => {
    const id = `RFI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRfis((prev) => [
      ...prev,
      {
        id,
        status: "Pending",
        documents,
        dueDate,
        sentBy: assignedAnalyst,
        sentDate: new Date().toISOString(),
        respondedDate: null,
        message,
      },
    ]);
    logAction({
      action: "RFI Sent",
      previousValue: "—",
      newValue: `${id} sent to customer`,
      description: `RFI ${id} sent requesting ${documents.join(", ")}`,
    });
  };

  const handleAddNote = (note) => setNotes((prev) => [...prev, note]);
  const handleTogglePin = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  return (
    <div className="flex flex-col gap-4">
      <CaseHeader
        caseData={{ ...caseData, lastUpdated: caseData.lastUpdated }}
        status={status}
        priority={priority}
        assignedAnalyst={assignedAnalyst}
        onOpenAssign={() => setAssignOpen(true)}
        onOpenRFI={() => setRfiOpen(true)}
        onEscalate={handleEscalate}
        onGenerateSTR={handleGenerateSTR}
        onCloseCase={handleCloseCase}
        onReopenCase={handleReopenCase}
      />

      <Tabs defaultValue="investigation-hub">
        <TabsList>
          <TabsTrigger value="investigation-hub">
            <IconBriefcase />
            Investigation Hub
          </TabsTrigger>
          <TabsTrigger value="customer-profile">
            <IconUser />
            Customer Profile
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <IconCreditCard />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="files">
            <IconFolder />
            Files
          </TabsTrigger>
          <TabsTrigger value="case-activity">
            <IconClipboardList />
            Case Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investigation-hub">
          <InvestigationHub caseData={caseData} />
        </TabsContent>

        <TabsContent value="customer-profile">
          <CustomerProfileSection
            caseData={caseData}
            sectionRef={setSectionRef("customer-profile")}
            collapsible={false}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionAnalysisSection
            caseData={caseData}
            sectionRef={setSectionRef("transactions")}
            collapsible={false}
          />
        </TabsContent>

        <TabsContent value="files">
          <Suspense fallback={<FilesTabSkeleton />}>
            <FilesTab caseData={caseData} />
          </Suspense>
        </TabsContent>

        <TabsContent value="case-activity">
          <CaseActivityView
            caseData={caseData}
            rfis={rfis}
            onOpenCreateRFI={() => setRfiOpen(true)}
            assignedAnalyst={assignedAnalyst}
            assignment={assignment}
            onOpenReassign={() => setAssignOpen(true)}
            notes={notes}
            onAddNote={handleAddNote}
            onTogglePin={handleTogglePin}
            activities={activities}
            auditLog={auditLog}
            setSectionRef={setSectionRef}
          />
        </TabsContent>
      </Tabs>

      <CreateRFIModal open={rfiOpen} onOpenChange={setRfiOpen} onSubmit={handleCreateRFI} />
      <ReassignCaseModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        currentAnalyst={assignedAnalyst}
        onSubmit={handleReassign}
      />
    </div>
  );
}
