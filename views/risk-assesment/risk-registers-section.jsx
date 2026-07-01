"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, FileSpreadsheet } from "lucide-react";

import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import { useLoggedInUser } from "@/app/store/useLoggedInUser";
import { getRiskRegisters } from "@/views/track-progress/actions";
import RiskRegisters from "@/views/track-progress/tabs/risk-assesment/RiskRegisters";

// Standalone host for the EWRA Risk Register details. Reuses the exact
// component rendered inside the onboarding "Risk Assessment" wizard tab, but
// without the stepper navigation — surfaced under the Risk Assessment menu so
// the register can be reviewed/updated outside the onboarding flow.
export default function RiskRegistersSection() {
  const { loggedInUser } = useLoggedInUser();
  const entityName = loggedInUser?.name;

  const [riskRegisters, setRiskRegisters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!entityName) return;

    let active = true;
    const fetchRiskRegisters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRiskRegisters(entityName);
        if (active) setRiskRegisters(response?.data ?? null);
      } catch (e) {
        if (active) setError(e?.message || "Failed to load risk registers.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRiskRegisters();
    return () => {
      active = false;
    };
  }, [entityName]);

  const hasRegister = Array.isArray(riskRegisters)
    ? riskRegisters.length > 0
    : !!riskRegisters;

  return (
    <div className="relative">
      <PageHeader>
        <PageTitle>Risk Registers</PageTitle>
        <PageDescription>
          Entity-wise EWRA risk register — inherent and residual risk by scenario, with
          reviewer overrides and Excel export.
        </PageDescription>
      </PageHeader>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              style={{ width: `${Math.random() * 100}%` }}
              className="h-10 bg-gray-200 animate-pulse rounded"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : hasRegister ? (
        <RiskRegisters riskRegisters={riskRegisters} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-gray-50 px-6 py-16 text-center">
          <FileSpreadsheet className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No risk register found</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            A risk register is generated once the Risk Assessment is completed during
            onboarding. Complete the assessment to view it here.
          </p>
        </div>
      )}
    </div>
  );
}
