"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IconCircleCheck, IconCircle, IconEye } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const WORKFLOW_TASKS = [
  {
    id: "task-01",
    title: "Alert triage review",
    completed: true,
  },
  {
    id: "task-02",
    title: "Customer risk assessment",
    completed: true,
  },
  {
    id: "task-03",
    title: "Enhanced due diligence (ECDD)",
    completed: true,
  },
  {
    id: "task-04",
    title: "Source of funds verification",
    completed: true,
  },
  {
    id: "task-05",
    title: "Transaction pattern analysis",
    completed: true,
  },
  {
    id: "task-06",
    title: "Request for information (RFI)",
    completed: false,
  },
  {
    id: "task-07",
    title: "Senior analyst escalation",
    completed: false,
  },
  {
    id: "task-08",
    title: "Supervisor approval",
    completed: false,
  },
  {
    id: "task-09",
    title: "Final disposition & SAR filing",
    completed: false,
  },
];

function WorkflowItem({ task, isLast, onView }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3",
        !isLast && "border-b border-border/70",
      )}
    >
      {task.completed ? (
        <IconCircleCheck className="size-5 shrink-0 text-blue-600" />
      ) : (
        <IconCircle className="size-5 shrink-0 text-muted-foreground/40" />
      )}

      <p
        className={cn(
          "flex-1 truncate text-sm",
          task.completed ? "text-heading" : "text-muted-foreground",
        )}
      >
        {task.title}
      </p>

      <button
        type="button"
        onClick={() => onView?.(task)}
        aria-label={`View details for ${task.title}`}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-heading"
      >
        <IconEye className="size-4" />
      </button>
    </div>
  );
}

export default function InvestigationSummary({ caseData, sectionRef }) {
  if (!caseData) return null;

  const completedCount = WORKFLOW_TASKS.filter((t) => t.completed).length;
  const totalCount = WORKFLOW_TASKS.length;
  const progressValue = (completedCount / totalCount) * 100;

  return (
    <Card
      ref={sectionRef}
      id="investigation-summary"
      className="scroll-mt-4 border-border shadow-sm"
    >
      <CardContent>
        <h2 className="text-sm font-semibold text-heading">Investigation Workflow</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {completedCount} of {totalCount} completed
        </p>

        <Progress
          value={progressValue}
          className="mt-3 h-1.5 bg-muted [&>div]:bg-blue-600"
        />

        <div className="mt-4">
          {WORKFLOW_TASKS.map((task, idx) => (
            <WorkflowItem
              key={task.id}
              task={task}
              isLast={idx === WORKFLOW_TASKS.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
