"use client";

import { useEffect, useState } from "react";
import CaseHeader from "./CaseHeader";
import CaseTabs from "./CaseTabs";
import FilesTab from "./tabs/FilesTab";
import { IconFolderOff, IconLoader2 } from "@tabler/icons-react";
import { getCaseById } from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";

export default function CaseDetails({ caseId }) {
  const { setSelectedCase } = useCaseManagerStore();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCaseById(caseId);
        if (res?.succeed) {
          setCaseData(res.data);
          setSelectedCase(res.data);
        } else {
          setError(res?.message || "Case not found");
        }
      } catch {
        setError("Failed to load case");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => setSelectedCase(null);
  }, [caseId, setSelectedCase]);

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

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="flex flex-col gap-5 xl:col-span-9 col-span-12">
        <CaseHeader caseData={caseData} onCaseUpdate={setCaseData} />
        <CaseTabs caseData={caseData} onCaseUpdate={setCaseData} />
      </div>
      <div className="xl:col-span-3 col-span-12">
        <FilesTab caseData={caseData} />
      </div>
    </div>
  );
}
