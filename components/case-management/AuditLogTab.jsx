'use client';

import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuditLog } from '@/app/dashboard/client/case-management/actions';
import { useCaseMgmtStore } from '@/app/store/useCaseMgmtStore';
import { formatDateTime } from '@/lib/utils';
import {
  IconFileCheck,
  IconArrowRightCircle,
  IconUserPlus,
  IconNote,
  IconPaperclip,
  IconPencil,
} from '@tabler/icons-react';

const ACTION_META = {
  case_created: { icon: IconFileCheck, color: 'text-success', label: 'Case Created' },
  status_change: { icon: IconArrowRightCircle, color: 'text-info', label: 'Status Changed' },
  assignment: { icon: IconUserPlus, color: 'text-warning', label: 'Assignment Updated' },
  note_added: { icon: IconNote, color: 'text-primary', label: 'Note Added' },
  evidence_added: { icon: IconPaperclip, color: 'text-muted-foreground', label: 'Evidence Added' },
  field_update: { icon: IconPencil, color: 'text-muted-foreground', label: 'Fields Updated' },
};

function LogItem({ log }) {
  const meta = ACTION_META[log.action] ?? { icon: IconFileCheck, color: 'text-muted-foreground', label: log.action };
  const Icon = meta.icon;

  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[18px] top-7 h-full w-px bg-border last:hidden" />

      {/* Icon bubble */}
      <span className={`relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm ${meta.color}`}>
        <Icon className="h-4 w-4" />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-heading">{meta.label}</span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(log.createdAt)?.date} {formatDateTime(log.createdAt)?.time}
          </span>
        </div>
        {log.details && (
          <p className="mt-0.5 text-xs text-muted-foreground">{log.details}</p>
        )}
        {log.user && (
          <div className="mt-1 flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarImage src={log.user.avatar} />
              <AvatarFallback className="text-[9px]">
                {log.user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{log.user.name}</span>
          </div>
        )}
      </div>
    </li>
  );
}

export default function AuditLogTab({ caseId }) {
  const { auditLogs, setAuditLogs, fetching, setFetching } = useCaseMgmtStore();

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setFetching(true);
      try {
        const res = await getAuditLog(caseId);
        if (res?.succeed) setAuditLogs(res.data);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [caseId]);

  if (fetching) {
    return (
      <div className="space-y-4 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
    );
  }

  return (
    <ul className="py-4">
      {auditLogs.map((log) => (
        <LogItem key={log._id} log={log} />
      ))}
    </ul>
  );
}
