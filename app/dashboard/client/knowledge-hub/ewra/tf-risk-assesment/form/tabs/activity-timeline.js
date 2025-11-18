'use client';

import { CheckCircle2, Clock, AlertCircle, PhoneCall } from 'lucide-react';


const typeConfig = {
  approved: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    textColor: 'text-emerald-900 dark:text-emerald-100',
  },
  review: {
    icon: Clock,
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-900 dark:text-amber-100',
  },
  contact: {
    icon: PhoneCall,
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
    textColor: 'text-blue-900 dark:text-blue-100',
  },
  initiated: {
    icon: AlertCircle,
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    borderColor: 'border-slate-200 dark:border-slate-800',
    dotColor: 'bg-slate-500',
    textColor: 'text-slate-900 dark:text-slate-100',
  },
};
const events = [
  {
    id: '1',
    title: 'Approved with Conditions',
    timestamp: 'Oct 25, 2023 - 10:15 AM',
    actor: 'John Smith (Supervisor)',
    type: 'approved',
    description: 'Transaction approved pending additional documentation',
  },
  {
    id: '2',
    title: 'Sent for Review',
    timestamp: 'Oct 25, 2023 - 09:45 AM',
    actor: 'System',
    type: 'review',
    description: 'Flagged for compliance review due to high risk score',
  },
  {
    id: '3',
    title: 'Customer Contacted',
    timestamp: 'Oct 24, 2023 - 02:30 PM',
    actor: 'Sarah Johnson',
    type: 'contact',
    description: 'Customer contacted to verify transaction details',
  },
  {
    id: '4',
    title: 'Transaction Initiated',
    timestamp: 'Oct 24, 2023 - 09:25 AM',
    actor: 'Alice Green',
    type: 'initiated',
  },
]
export default function ActivityTimeline() {
  return (
    <div className="w-full">
      <div className="space-y-4">
        {events.map((event, index) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className="relative flex gap-4 pb-4"
            >
              {/* Timeline connector line */}
              {index < events.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-12 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800" />
              )}

              {/* Timeline dot with icon */}
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full ${config.dotColor} flex items-center justify-center ring-4 ring-background`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Event card */}
              <div className={`flex-1 rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-4 transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-semibold text-sm ${config.textColor}`}>
                    {event.title}
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.bgColor} ${config.textColor} whitespace-nowrap`}>
                    {event.timestamp}
                  </span>
                </div>
                {event.description && (
                  <p className={`text-sm ${config.textColor} opacity-80 mb-2`}>
                    {event.description}
                  </p>
                )}
                <div className={`text-xs ${config.textColor} opacity-70`}>
                  By: <span className="font-medium">{event.actor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
