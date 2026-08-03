"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IconCircleCheck, IconCircle, IconEye } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const WORKFLOW_TASKS = [
  {
    id: "task-01",
    title:
      "Understand the basis for the alert by reviewing triggered AML rules, transaction patterns, and system-generated risk indicators.",
    completed: true,
    owner: "James Whitfield",
    date: "14 Jul 2026",
  },
  {
    id: "task-02",
    title:
      "Review the customer's KYC profile, customer type, occupation, country of residence, and overall risk rating.",
    completed: true,
    owner: "James Whitfield",
    date: "15 Jul 2026",
  },
  {
    id: "task-03",
    title:
      "Analyze recent transaction history, including transaction amounts, frequency, counterparties, channels, and unusual behavioral patterns.",
    completed: true,
    owner: "James Whitfield",
    date: "16 Jul 2026",
  },
  {
    id: "task-04",
    title:
      "Perform Name Screening and Sanctions Screening against applicable watchlists. Document whether any matches were identified.",
    completed: true,
    owner: "James Whitfield",
    date: "17 Jul 2026",
    description: "No matches identified against sanctions or watchlists.",
  },
  {
    id: "task-05",
    title:
      "Perform Adverse Media screening and record findings related to financial crime, fraud, corruption, or other reputational risks.",
    completed: true,
    owner: "James Whitfield",
    date: "17 Jul 2026",
    description: "No adverse media identified for the customer or related parties.",
  },
  {
    id: "task-06",
    title:
      "Verify the source of funds and source of wealth using available documents and customer information.",
    completed: false,
    owner: "Unassigned",
    date: "Pending",
  },
  {
    id: "task-07",
    title:
      "Review historical alerts, previous investigations, SAR filings, and prior ECDD activities related to the customer.",
    completed: false,
    owner: "Unassigned",
    date: "Pending",
  },
  {
    id: "task-08",
    title: "Determine whether Enhanced Customer Due Diligence (ECDD) is required.",
    completed: false,
    owner: "Unassigned",
    date: "Pending",
    note: {
      assignedTo: "Compliance Officer",
      status: "Completed",
      outcome: "No additional high-risk indicators identified",
    },
  },
  {
    id: "task-09",
    title: "Make the final investigation decision.",
    completed: false,
    owner: "Unassigned",
    date: "Pending",
    options: [
      "False Positive",
      "Escalate to Level 2",
      "Request Additional Information (RFI)",
      "File Suspicious Activity Report (SAR)",
    ],
  },
];

function WorkflowItem({ task, isLast, onView }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 py-3",
        !isLast && "border-b border-border/70",
      )}
    >
      {task.completed ? (
        <IconCircleCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />
      ) : (
        <IconCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground/40" />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-relaxed",
            task.completed ? "text-heading" : "text-muted-foreground",
          )}
        >
          {task.title}
        </p>

        {task.note && (
          <div className="mt-2 rounded-md border border-border/70 bg-muted/30 p-2.5 text-xs text-muted-foreground">
            <p>
              Assigned to <span className="font-medium text-heading">{task.note.assignedTo}</span>
            </p>
            <p>
              Status: <span className="font-medium text-heading">{task.note.status}</span>
            </p>
            <p>
              Outcome: <span className="font-medium text-heading">{task.note.outcome}</span>
            </p>
          </div>
        )}

        {task.options && (
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {task.options.map((option) => (
              <li key={option} className="flex items-center gap-1.5">
                <span className="size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => onView?.(task)}
        aria-label={`View details for ${task.title}`}
        className="mt-0.5 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-heading"
      >
        <IconEye className="size-4" />
      </button>
    </div>
  );
}

export default function InvestigationSummary({ caseData, sectionRef }) {
  const [selectedTask, setSelectedTask] = useState(null);

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
              onView={setSelectedTask}
            />
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTask?.completed ? (
                <IconCircleCheck className="size-5 shrink-0 text-blue-600" />
              ) : (
                <IconCircle className="size-5 shrink-0 text-muted-foreground/40" />
              )}
              Checklist item details
            </DialogTitle>
            <DialogDescription>{selectedTask?.title}</DialogDescription>
          </DialogHeader>

          {selectedTask?.description && (
            <p className="-mt-2 text-sm text-heading">{selectedTask.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <p className="mt-0.5 text-heading">
                {selectedTask?.completed ? "Completed" : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Owner
              </p>
              <p className="mt-0.5 text-heading">{selectedTask?.owner}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </p>
              <p className="mt-0.5 text-heading">{selectedTask?.date}</p>
            </div>
          </div>

          {selectedTask?.note && (
            <div className="rounded-md border border-border/70 bg-muted/30 p-3 text-sm">
              <p>
                Assigned to{" "}
                <span className="font-medium text-heading">{selectedTask.note.assignedTo}</span>
              </p>
              <p>
                Status: <span className="font-medium text-heading">{selectedTask.note.status}</span>
              </p>
              <p>
                Outcome:{" "}
                <span className="font-medium text-heading">{selectedTask.note.outcome}</span>
              </p>
            </div>
          )}

          {selectedTask?.options && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Decision options
              </p>
              <ul className="mt-1.5 space-y-1 text-sm text-heading">
                {selectedTask.options.map((option) => (
                  <li key={option} className="flex items-center gap-1.5">
                    <span className="size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
