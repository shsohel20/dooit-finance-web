"use client";

import { useMemo, useRef, useState, lazy, Suspense } from "react";
import { IconFolderOff, IconFolders } from "@tabler/icons-react";
import { mockCases } from "@/lib/case-manager-data";
import { Skeleton } from "@/components/ui/skeleton";
import CaseHeader from "./CaseHeader";
import RightActionPanel from "./RightActionPanel";
import CollapsibleSection from "./components/CollapsibleSection";
import InvestigationSummary from "./sections/InvestigationSummary";
import CustomerProfileSection from "./sections/CustomerProfileSection";
import TransactionAnalysisSection from "./sections/TransactionAnalysisSection";
import InvestigationTimelineSection from "./sections/InvestigationTimelineSection";
import InvestigatorNotes from "./sections/InvestigatorNotes";
import RFISection from "./sections/RFISection";
import CaseAssignmentSection from "./sections/CaseAssignmentSection";
import AuditLog from "./sections/AuditLog";
import RelatedCasesSection from "./sections/RelatedCasesSection";
import CreateRFIModal from "./modals/CreateRFIModal";
import ReassignCaseModal from "./modals/ReassignCaseModal";

const ATMInfoTab = lazy(() => import("./tabs/ATMInfoTab"));
const DeviceInfoTab = lazy(() => import("./tabs/DeviceInfoTab"));
const RelationshipsTab = lazy(() => import("./tabs/RelationshipsTab"));
const FilesTab = lazy(() => import("./tabs/FilesTab"));

function AdditionalRecordsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
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
  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const logAction = ({ user = "You", action, previousValue = "—", newValue = "—", description }) => {
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
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type: "comment", date: now, user, description: description || action },
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
        history: [...(prevAssignment?.history || []), { analyst, date: new Date().toISOString(), action: "Reassigned" }],
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

  const isClosed = status === "Closed";

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="flex flex-col gap-4 xl:col-span-9 col-span-12">
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

        <InvestigationSummary caseData={caseData} sectionRef={setSectionRef("investigation-summary")} />

        <CustomerProfileSection caseData={caseData} sectionRef={setSectionRef("customer-profile")} />

        <TransactionAnalysisSection caseData={caseData} sectionRef={setSectionRef("transactions")} />

        <InvestigationTimelineSection
          caseData={caseData}
          activities={activities}
          sectionRef={setSectionRef("timeline")}
        />

        <InvestigatorNotes
          notes={notes}
          onAddNote={handleAddNote}
          onTogglePin={handleTogglePin}
          sectionRef={setSectionRef("notes")}
        />

        <RFISection rfis={rfis} onOpenCreateRFI={() => setRfiOpen(true)} sectionRef={setSectionRef("rfi")} />

        <CaseAssignmentSection
          assignedAnalyst={assignedAnalyst}
          assignment={assignment}
          onOpenReassign={() => setAssignOpen(true)}
          sectionRef={setSectionRef("assignment")}
        />

        <AuditLog auditLog={auditLog} sectionRef={setSectionRef("audit-log")} />

        <RelatedCasesSection caseData={caseData} sectionRef={setSectionRef("related-cases")} />

        <CollapsibleSection
          id="additional-records"
          title="Additional Records"
          icon={IconFolders}
          defaultOpen={false}
          sectionRef={setSectionRef("additional-records")}
        >
          <Suspense fallback={<AdditionalRecordsSkeleton />}>
            <div className="flex flex-col gap-4">
              <ATMInfoTab caseData={caseData} />
              <DeviceInfoTab caseData={caseData} />
              <RelationshipsTab caseData={caseData} />
              <FilesTab caseData={caseData} />
            </div>
          </Suspense>
        </CollapsibleSection>
      </div>

      <div className="xl:col-span-3 col-span-12">
        <RightActionPanel
          isClosed={isClosed}
          onOpenAssign={() => setAssignOpen(true)}
          onOpenRFI={() => setRfiOpen(true)}
          onFocusNotes={() => scrollToSection("notes")}
          onEscalate={handleEscalate}
          onGenerateSTR={handleGenerateSTR}
          onCloseCase={handleCloseCase}
        />
      </div>

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
