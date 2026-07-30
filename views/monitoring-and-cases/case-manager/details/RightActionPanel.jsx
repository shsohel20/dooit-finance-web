"use client";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  IconUserCheck,
  IconMessageCircle,
  IconNotes,
  IconAlertOctagon,
  IconDownload,
  IconFileExport,
  IconGavel,
  IconBan,
} from "@tabler/icons-react";
import ReasonAlertDialog from "./components/ReasonAlertDialog";

function ActionButton({ icon: Icon, label, onClick, variant = "outline", className }) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={`h-9 w-full justify-start gap-2 text-xs ${className || ""}`}
      onClick={onClick}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}

export default function RightActionPanel({
  isClosed,
  onOpenAssign,
  onOpenRFI,
  onFocusNotes,
  onEscalate,
  onGenerateSTR,
  onCloseCase,
}) {
  return (
    <Card className="sticky top-4 h-fit border-border p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</p>
      <div className="flex flex-col gap-2">
        <ActionButton icon={IconUserCheck} label="Assign Case" onClick={onOpenAssign} variant="default" />
        <ActionButton icon={IconMessageCircle} label="Create RFI" onClick={onOpenRFI} />
        <ActionButton icon={IconNotes} label="Add Note" onClick={onFocusNotes} />

        <ReasonAlertDialog
          trigger={
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-full justify-start gap-2 text-xs">
                <IconAlertOctagon className="size-4" />
                Escalate
              </Button>
            </AlertDialogTrigger>
          }
          title="Escalate this case"
          description="This raises the case priority and notifies the compliance lead. Provide a reason for the audit trail."
          actionLabel="Escalate Case"
          onConfirm={(reason) => {
            onEscalate?.(reason);
            toast.success("Case escalated to Critical priority");
          }}
        />

        <Separator className="my-1" />

        <ActionButton
          icon={IconDownload}
          label="Download Evidence"
          onClick={() => toast.success("Preparing evidence package (files, transactions, statements)...")}
        />
        <ActionButton
          icon={IconFileExport}
          label="Export Case PDF"
          onClick={() => toast.success("Case PDF export queued")}
        />

        <Separator className="my-1" />

        <ReasonAlertDialog
          trigger={
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-full justify-start gap-2 text-xs">
                <IconGavel className="size-4" />
                Generate STR
              </Button>
            </AlertDialogTrigger>
          }
          title="Generate STR/SAR draft"
          description="A draft Suspicious Transaction/Activity Report will be created from this case's evidence for compliance review."
          actionLabel="Generate Draft"
          onConfirm={(reason) => {
            onGenerateSTR?.(reason);
            toast.success("STR/SAR draft created");
          }}
        />

        {!isClosed && (
          <ReasonAlertDialog
            destructive
            trigger={
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full justify-start gap-2 text-xs text-danger hover:text-danger"
                >
                  <IconBan className="size-4" />
                  Close Investigation
                </Button>
              </AlertDialogTrigger>
            }
            title="Close this case"
            description="This marks the investigation as closed. You can reopen it later if new evidence emerges."
            actionLabel="Close Case"
            onConfirm={(reason) => {
              onCloseCase?.(reason);
              toast.success("Case closed");
            }}
          />
        )}
      </div>
    </Card>
  );
}
