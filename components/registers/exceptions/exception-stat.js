import { ShieldCheck, ShieldAlert, Clock, XCircle } from 'lucide-react';

export function ExceptionStats({ exceptions }) {
  const total = exceptions.length;
  const active = exceptions.filter((e) => e.status === 'Active').length;
  const highRisk = exceptions.filter(
    (e) => e.riskLevel === 'High' && e.status === 'Active'
  ).length;
  const pending = exceptions.filter(
    (e) => e.approvalStatus === 'Pending' || e.approvalStatus === 'Under Review'
  ).length;
  const expiringSoon = exceptions.filter((e) => {
    if (e.status !== 'Active') return false;
    const expiry = new Date(e.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

  const stats = [
    {
      label: 'Active Exceptions',
      value: active,
      total,
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'High Risk (Active)',
      value: highRisk,
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Pending Approval',
      value: pending,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Expiring Soon',
      value: expiringSoon,
      description: 'within 30 days',
      icon: XCircle,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-lg border bg-card p-4"
        >
          <div
            className={`${stat.bg} ${stat.color} size-10 rounded-lg flex items-center justify-center shrink-0`}
          >
            <stat.icon className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-semibold text-foreground leading-none tracking-tight">
              {stat.value}
              {stat.total !== undefined && (
                <span className="text-sm font-normal text-muted-foreground ml-0.5">
                  /{stat.total}
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
