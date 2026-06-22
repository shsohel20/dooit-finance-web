"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getMyAssignments,
  startModule,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";

const TrainingTab = ({ setCurrentStep }) => {
  const router = useRouter();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchTrainingModules = async () => {
      try {
        const response = await getMyAssignments();
        setModules(response.data || []);
      } catch (error) {
        console.error("Error fetching training modules:", error);
      }
    };
    fetchTrainingModules();
  }, []);

  const handleStart = async (moduleId) => {
    await startModule(moduleId);
    router.push(`/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}`);
  };
  //     const handleStartModule = async (moduleId) => {
  //     console.log("moduleId", moduleId);
  //     const res = await startModule(moduleId);
  //     console.log("training start res", res);
  //     router.push(`/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}`);
  //   };

  return (
    <div>
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
