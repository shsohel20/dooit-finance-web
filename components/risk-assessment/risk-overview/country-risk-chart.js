'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const data = [
  {
    country: 'Somalia',
    code: 'SO',
    score: 72,
    customers: 19,
    level: 'critical',
  },
  { country: 'Syria', code: 'SY', score: 71, customers: 28, level: 'critical' },
  { country: 'Yemen', code: 'YE', score: 68, customers: 24, level: 'high' },
  {
    country: 'Afghanistan',
    code: 'AF',
    score: 65,
    customers: 42,
    level: 'high',
  },
  { country: 'Iraq', code: 'IQ', score: 62, customers: 35, level: 'high' },
  {
    country: 'Pakistan',
    code: 'PK',
    score: 58,
    customers: 38,
    level: 'medium',
  },
  { country: 'Libya', code: 'LY', score: 55, customers: 15, level: 'medium' },
];

const maxScore = 100;

function getLevelStyles(level) {
  switch (level) {
    case 'critical':
      return {
        bar: 'bg-red-500',
        badge: 'bg-red-50 text-red-700',
        dot: 'bg-red-500',
      };
    case 'high':
      return {
        bar: 'bg-orange-500',
        badge: 'bg-orange-50 text-orange-700',
        dot: 'bg-orange-500',
      };
    case 'medium':
      return {
        bar: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-700',
        dot: 'bg-amber-500',
      };
    default:
      return {
        bar: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700',
        dot: 'bg-emerald-500',
      };
  }
}

export function CountryRiskChart() {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          High-Risk Jurisdictions
        </CardTitle>
        <CardDescription className="text-xs">
          Top risk-scored countries with customer counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const styles = getLevelStyles(item.level);
            return (
              <div key={item.country} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                    <span className="text-sm font-medium">{item.country}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.customers} customers
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold tabular-nums">
                    {item.score}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
                    style={{ width: `${(item.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
