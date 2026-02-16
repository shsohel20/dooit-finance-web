'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const assessments = [
  {
    id: 1,
    name: 'Aimun Nahar',
    occupation: 'Manager',
    industry: 'Tech',
    country: 'Afghanistan',
    channel: 'Online',
    riskLevel: 'high',
    score: 50,
    date: '2 hours ago',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    occupation: 'Director',
    industry: 'Finance',
    country: 'Singapore',
    channel: 'Branch',
    riskLevel: 'low',
    score: 20,
    date: '5 hours ago',
  },
  {
    id: 3,
    name: 'Mohammed Al-Rashid',
    occupation: 'CEO',
    industry: 'Energy',
    country: 'UAE',
    channel: 'Online',
    riskLevel: 'medium',
    score: 35,
    date: '1 day ago',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    occupation: 'CFO',
    industry: 'Healthcare',
    country: 'Mexico',
    channel: 'Branch',
    riskLevel: 'low',
    score: 18,
    date: '1 day ago',
  },
  {
    id: 5,
    name: 'David Park',
    occupation: 'VP Operations',
    industry: 'Retail',
    country: 'South Korea',
    channel: 'Online',
    riskLevel: 'low',
    score: 15,
    date: '2 days ago',
  },
  {
    id: 6,
    name: 'Fatima Al-Saud',
    occupation: 'Executive',
    industry: 'Finance',
    country: 'Saudi Arabia',
    channel: 'Branch',
    riskLevel: 'medium',
    score: 38,
    date: '2 days ago',
  },
];

function getRiskStyles(level) {
  switch (level) {
    case 'low':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10';
    case 'medium':
      return 'bg-amber-50 text-amber-700 ring-amber-600/10';
    case 'high':
      return 'bg-orange-50 text-orange-700 ring-orange-600/10';
    case 'critical':
      return 'bg-red-50 text-red-700 ring-red-600/10';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getAvatarColor(name) {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-violet-100 text-violet-700',
    'bg-cyan-100 text-cyan-700',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function RecentAssessments() {
  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent Assessments
            </CardTitle>
            <CardDescription className="text-xs">
              Latest customer risk evaluations
            </CardDescription>
          </div>
          <button className="text-xs font-medium text-primary hover:underline">
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2.5 pr-4 text-xs font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Industry
                </th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Country
                </th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Channel
                </th>
                <th className="text-center py-2.5 px-4 text-xs font-medium text-muted-foreground">
                  Score
                </th>
                <th className="text-right py-2.5 pl-4 text-xs font-medium text-muted-foreground">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={cn(
                            'text-xs font-semibold',
                            getAvatarColor(assessment.name)
                          )}
                        >
                          {assessment.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {assessment.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {assessment.occupation} &middot; {assessment.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {assessment.industry}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {assessment.country}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {assessment.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-mono font-bold">
                      {assessment.score}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset capitalize',
                        getRiskStyles(assessment.riskLevel)
                      )}
                    >
                      {assessment.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
