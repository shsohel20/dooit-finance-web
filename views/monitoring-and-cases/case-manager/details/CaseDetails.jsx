"use client";

import { useMemo } from "react";
import CaseHeader from "./CaseHeader";
import CaseTabs from "./CaseTabs";
import { mockCases } from "@/lib/case-manager-data";
import { IconFolderOff } from "@tabler/icons-react";

export default function CaseDetails({ caseId }) {
  const caseData = useMemo(
    () => mockCases.find((c) => c._id === caseId) || null,
    [caseId],
  );

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <IconFolderOff className="mb-3 size-12 opacity-40" />
        <p className="text-sm font-medium">Case not found</p>
        <p className="mt-1 text-xs">The case ID "{caseId}" does not exist.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <CaseHeader caseData={caseData} />
      <CaseTabs caseData={caseData} />
    </div>
  );
}
