'use client';

import { format } from 'date-fns';
import {
  CalendarDays,
  Clock,
  User,
  FileText,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { RiskBadge, ApprovalBadge, StatusBadge } from './exception-badges';

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function ExceptionDetail({ exception, open, onOpenChange }) {
  if (!exception) return null;

  const isExpiringSoon = (() => {
    const expiry = new Date(exception.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  })();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-2">
          <div className="flex items-center gap-3">
            <SheetTitle className="font-mono text-base">
              {exception.id}
            </SheetTitle>
            <StatusBadge status={exception.status} />
          </div>
          <SheetDescription className="text-left">
            {exception.relatedPolicy}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-4">
          {isExpiringSoon && exception.status === 'Active' && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-800">
                  Expiring Soon
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This exception expires on{' '}
                  {format(new Date(exception.expiryDate), 'MMMM dd, yyyy')}.
                  Consider renewing or closing.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              {exception.description}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Risk & Approval
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow icon={Shield} label="Risk Level">
                <RiskBadge level={exception.riskLevel} />
              </DetailRow>
              <DetailRow icon={FileText} label="Approval Status">
                <ApprovalBadge status={exception.approvalStatus} />
              </DetailRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow icon={User} label="Approved By">
                {exception.approvedBy ?? (
                  <span className="text-muted-foreground/60">
                    Not yet approved
                  </span>
                )}
              </DetailRow>
              <DetailRow icon={CalendarDays} label="Approval Date">
                {exception.approvalDate ? (
                  format(new Date(exception.approvalDate), 'MMM dd, yyyy')
                ) : (
                  <span className="text-muted-foreground/60">Pending</span>
                )}
              </DetailRow>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Business Justification
            </h4>
            <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-md p-3">
              {exception.businessJustification}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Compensating Controls
            </h4>
            <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-md p-3">
              {exception.compensatingControls}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Timeline
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow icon={CalendarDays} label="Created">
                {format(new Date(exception.createdAt), 'MMM dd, yyyy')}
              </DetailRow>
              <DetailRow icon={CalendarDays} label="Expiry Date">
                {format(new Date(exception.expiryDate), 'MMM dd, yyyy')}
              </DetailRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow icon={User} label="Requested By">
                {exception.requestedBy}
              </DetailRow>
              <DetailRow icon={Clock} label="Review Reminder">
                {exception.reviewReminder ? (
                  format(new Date(exception.reviewReminder), 'MMM dd, yyyy')
                ) : (
                  <span className="text-muted-foreground/60">Not set</span>
                )}
              </DetailRow>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
