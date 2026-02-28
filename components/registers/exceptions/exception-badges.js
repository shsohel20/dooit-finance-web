import { cn } from '@/lib/utils';

export function RiskBadge({ level }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium',
        level === 'High' &&
          'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
        level === 'Medium' &&
          'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
        level === 'Low' &&
          'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          level === 'High' && 'bg-red-500',
          level === 'Medium' && 'bg-amber-500',
          level === 'Low' && 'bg-emerald-500'
        )}
      />
      {level}
    </span>
  );
}

export function ApprovalBadge({ status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        status === 'Approved' &&
          'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
        status === 'Pending' &&
          'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
        status === 'Rejected' &&
          'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
        status === 'Under Review' &&
          'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20'
      )}
    >
      {status}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium',
        status === 'Active' &&
          'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
        status === 'Expired' &&
          'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
        status === 'Closed' &&
          'bg-muted text-muted-foreground ring-1 ring-inset ring-border'
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'Active' && 'bg-emerald-500',
          status === 'Expired' && 'bg-muted-foreground/50',
          status === 'Closed' && 'bg-muted-foreground/50'
        )}
      />
      {status}
    </span>
  );
}
