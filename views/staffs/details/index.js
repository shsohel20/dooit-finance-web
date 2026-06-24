"use client";
import { getStaffDetails } from "@/app/dashboard/client/staffs/actions";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import StaffHeader from "./components/StaffHeader";
import StaffOverviewCard from "./components/StaffOverviewCard";
import PersonalDetailsSection from "./components/PersonalDetailsSection";
import ContactSection from "./components/ContactSection";
import EmploymentSection from "./components/EmploymentSection";
import KYCSection from "./components/KYCSection";
import AMLScreeningSection from "./components/AMLScreeningSection";
import RiskAssessmentSection from "./components/RiskAssessmentSection";
import DocumentsSection from "./components/DocumentsSection";
import ComplianceSection from "./components/ComplianceSection";
import SumsubHistoryTimeline from "./components/SumsubHistoryTimeline";
import MetadataSection from "./components/MetadataSection";

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-36 rounded-xl" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <IconAlertCircle className="h-8 w-8 text-danger" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-foreground">Failed to load staff details</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <IconRefresh className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

export default function StaffDetails({ staffId }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchId = useSearchParams().get("id");
  const id = staffId || searchId;

  const fetchStaff = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getStaffDetails(id);
      if (response.success) {
        setStaff(response.data);
      } else {
        setError(response.message || "Failed to load staff details");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchStaff} />;
  if (!staff) return null;

  return (
    <div className="space-y-6 pb-10">
      <StaffHeader staff={staff} />

      <StaffOverviewCard staff={staff} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PersonalDetailsSection staff={staff} />
          <ContactSection staff={staff} />
          <EmploymentSection staff={staff} />
          <DocumentsSection staff={staff} />
        </div>
        <div className="space-y-6">
          <KYCSection staff={staff} />
          <AMLScreeningSection staff={staff} />
          <RiskAssessmentSection staff={staff} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceSection staff={staff} />
        <SumsubHistoryTimeline staff={staff} />
      </div>

      <MetadataSection staff={staff} />
    </div>
  );
}
