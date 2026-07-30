"use client";

import { useCallback, useEffect, useState } from "react";
import { getLawyerDashboardSummary } from "@/app/dashboard/actions";
import useGetUser from "@/hooks/useGetUser";
import { Button } from "@/components/ui/button";
import { StatCards } from "./StatCards";
import { TrustAccountTrend } from "./TrustAccountTrend";
import { ClientRiskChart } from "./ClientRiskChart";
import { KycPipeline } from "./KycPipeline";
import { EcddQueue } from "./EcddQueue";
import { UpcomingReviews } from "./UpcomingReviews";
import { RecentCases } from "./RecentCases";
import { ReportingSnapshot } from "./ReportingSnapshot";

export default function LawyerConveyancerDashboard() {
  const { loggedInUser } = useGetUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLawyerDashboardSummary();
      if (response?.success) {
        setData(response.data);
      } else {
        setError(response?.error || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Failed to load lawyer dashboard:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={fetchSummary}>
          Retry
        </Button>
      </div>
    );
  }

  const firstName = loggedInUser?.name?.split(" ")[0];

  return (
    <main className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Practice Dashboard</h1>
        <p className="text-muted-foreground">
          {firstName ? `Welcome back, ${firstName}. ` : ""}
          AML/CTF compliance overview for your legal practice.
        </p>
      </div>

      <StatCards kpi={data?.kpi} clients={data?.clients} trust={data?.trust} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrustAccountTrend trend={data?.trust?.trend} />
        </div>
        <ClientRiskChart risk={data?.risk} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <KycPipeline clients={data?.clients} onboarding={data?.onboarding} />
        <div className="lg:col-span-2">
          <EcddQueue ecdd={data?.ecdd} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <UpcomingReviews reviews={data?.reviews} />
        <RecentCases cases={data?.cases} />
        <ReportingSnapshot reports={data?.reports} />
      </div>
    </main>
  );
}
