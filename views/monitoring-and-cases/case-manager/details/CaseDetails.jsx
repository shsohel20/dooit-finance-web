"use client";

import { useMemo, useRef, useState, lazy, Suspense, useEffect } from "react";
import {
  IconFolderOff,
  IconBriefcase,
  IconUser,
  IconCreditCard,
  IconFolder,
  IconClipboardList,
  IconLoader2,
  IconSitemap,
} from "@tabler/icons-react";
import { mockCases } from "@/lib/case-manager-data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCaseById,
  getCaseReports,
  getCaseNotes,
  getAuditLog,
  addNote as addNoteAction,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";
import { adaptCase, adaptNotes, adaptAuditLog, adaptRfis, adaptPreviousSARs } from "./caseAdapter";
import CaseHeader from "./CaseHeader";
import CustomerProfileSection from "./sections/CustomerProfileSection";
import TransactionAnalysisSection from "./sections/TransactionAnalysisSection";
import CaseActivityView from "./CaseActivityView";
import InvestigationHub from "./investigation-hub/InvestigationHub";
import CreateRFIModal from "./modals/CreateRFIModal";
import ReassignCaseModal from "./modals/ReassignCaseModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkGraph from "@/views/onboarding/customer-queue/details/d3/Networkgraph";
import { transformToGraph } from "@/views/onboarding/customer-queue/details/d3/lib/transformgraphData";
import partyEntities from "@/views/onboarding/customer-queue/details/demo.json";

const FilesTab = lazy(() => import("./tabs/FilesTab"));
const graphData = transformToGraph(partyEntities);

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
  const { setSelectedCase } = useCaseManagerStore();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Regulatory filings live on their own endpoint so the case document stays
  // lean; they load alongside the case rather than blocking it.
  const [reports, setReports] = useState(null);
  const [reportsSummary, setReportsSummary] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(true);

  const sectionRefs = useRef({});
  const setSectionRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setLoading(true);
      setReportsLoading(true);
      setError(null);
      try {
        // One round trip each, in parallel — a failure in any companion
        // endpoint must not stop the case itself from rendering.
        const [res, reportsRes, notesRes, auditRes] = await Promise.all([
          getCaseById(caseId),
          getCaseReports(caseId).catch(() => null),
          getCaseNotes(caseId).catch(() => null),
          getAuditLog(caseId).catch(() => null),
        ]);

        const filings = reportsRes?.succeed ? reportsRes.data : null;
        setReports(filings);
        setReportsSummary(reportsRes?.succeed ? reportsRes.summary : null);

        if (res?.succeed) {
          // Normalise the API document into the shape the sections expect.
          const loaded = adaptCase(res.data);
          loaded.rfis = adaptRfis(filings?.rfi);
          loaded.previousSARs = adaptPreviousSARs(filings?.smr);
          loaded.notes = notesRes?.succeed ? adaptNotes(notesRes.data) : [];
          loaded.auditLog = auditRes?.succeed ? adaptAuditLog(auditRes.data) : [];
          setCaseData(loaded);
          setSelectedCase(loaded);
          // Seed the action state from the loaded case. These drive the header
          // badges and the action bar, and are updated optimistically by the
          // handlers below — the `useState` initialisers above run before the
          // fetch resolves, so they cannot do this on their own.
          setStatus(loaded?.status);
          setPriority(loaded?.priority);
          setAssignedAnalyst(loaded?.assignedAnalyst ?? loaded?.assignedTo?.name);
          setAssignment(loaded?.assignment);
          setNotes(loaded?.notes || []);
          setRfis(loaded?.rfis || []);
          setActivities(loaded?.activities || []);
          setAuditLog(loaded?.auditLog || []);
        } else {
          setError(res?.message || "Case not found");
        }
      } catch {
        setError("Failed to load case");
      } finally {
        setLoading(false);
        setReportsLoading(false);
      }
    };
    load();
    return () => setSelectedCase(null);
  }, [caseId, setSelectedCase]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <IconLoader2 className="size-6 animate-spin mr-2" />
        <span className="text-sm">Loading case...</span>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <IconFolderOff className="mb-3 size-12 opacity-40" />
        <p className="text-sm font-medium">Case not found</p>
        <p className="mt-1 text-xs">{error || `The case ID "${caseId}" does not exist.`}</p>
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

  // Notes are the one action with a real write endpoint — persist, then
  // reconcile from the server so the note carries its real id and author.
  const handleAddNote = async (note) => {
    setNotes((prev) => [...prev, note]);
    const res = await addNoteAction(caseId, {
      content: note.text ?? note.content ?? "",
      attachments: note.attachment ? [note.attachment] : [],
    }).catch(() => null);
    if (res?.succeed) {
      const fresh = await getCaseNotes(caseId).catch(() => null);
      if (fresh?.succeed) setNotes(adaptNotes(fresh.data));
    }
  };
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
          <TabsTrigger value="relation-graph">
            <IconSitemap />
            Relation graph
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
        <TabsContent value="relation-graph">
          <NetworkGraph data={graphData} onNodeClick={() => {}} />
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
