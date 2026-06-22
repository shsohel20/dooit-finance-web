"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, GraduationCap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getMyAssignments,
  startModule,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";

const TrainingTab = ({ setCurrentStep }) => {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // `silent` keeps the current view on screen and spins the button instead of
  // swapping back to the full skeleton — used by Refresh / Retry.
  const fetchTrainingModules = async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      const response = await getMyAssignments();
      if (response?.success === false) {
        setError(response.error || "Couldn't load your training.");
      } else {
        setModules(response?.data || []);
      }
    } catch (err) {
      console.error("Error fetching training modules:", err);
      setError("Couldn't load your training. Please try again.");
    } finally {
      if (silent) setIsRefreshing(false);
      else setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingModules();
  }, []);

  const handleStart = async (moduleId) => {
    await startModule(moduleId);
    router.push(`/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}`);
  };

  const renderRefreshButton = (label = "Refresh") => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => fetchTrainingModules({ silent: true })}
      disabled={isRefreshing}
      className="flex items-center gap-2"
    >
      <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
      {isRefreshing ? "Refreshing…" : label}
    </Button>
  );

  const renderContent = () => {
    // Loading — skeleton rows
    if (isLoading) {
      return (
        <div className="divide-y divide-border rounded-lg border border-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      );
    }

    // Error
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Couldn&apos;t load training</p>
            <p className="mx-auto max-w-sm text-xs text-muted-foreground">{error}</p>
          </div>
          {renderRefreshButton("Retry")}
        </div>
      );
    }

    // Empty — no assignments
    if (modules.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <GraduationCap className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">No training assigned yet</p>
            <p className="mx-auto max-w-sm text-xs text-muted-foreground">
              You don&apos;t have any training modules right now. New modules will appear
              here once they&apos;re assigned to you — check back soon.
            </p>
          </div>
          {renderRefreshButton()}
        </div>
      );
    }

    // List
    return (
      <div className="divide-y divide-border rounded-lg border border-border">
        {modules.map((assignment) => (
          <div key={assignment._id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{assignment.module?.title}</p>
              <p className="text-sm text-primary mt-0.5 leading-snug">
                {assignment.module?.description}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              onClick={() => handleStart(assignment.module?._id)}
            >
              Start
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderContent()}
      <div className="flex justify-between gap-2 mt-4">
        <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep((prev) => prev + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default TrainingTab;
