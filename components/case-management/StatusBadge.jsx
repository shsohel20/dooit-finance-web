import { StatusPill } from '@/components/ui/StatusPill';

const STATUS_CONFIG = {
  open: { variant: 'info', label: 'Open' },
  under_investigation: { variant: 'warning', label: 'Under Investigation' },
  pending_review: { variant: 'outline', label: 'Pending Review' },
  closed: { variant: 'success', label: 'Closed' },
  escalated: { variant: 'danger', label: 'Escalated' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { variant: 'outline', label: status };
  return <StatusPill variant={config.variant}>{config.label}</StatusPill>;
}
