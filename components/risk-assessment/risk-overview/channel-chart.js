'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const data = [
  { channel: 'Online', assessments: 180, avgScore: 35 },
  { channel: 'Branch', assessments: 120, avgScore: 28 },
  { channel: 'Mobile', assessments: 95, avgScore: 42 },
  { channel: 'Agent', assessments: 75, avgScore: 48 },
  { channel: 'ATM', assessments: 40, avgScore: 22 },
  { channel: 'Phone', assessments: 20, avgScore: 31 },
];

const chartConfig = {
  assessments: {
    label: 'Assessments',
    color: 'hsl(221, 83%, 53%)',
  },
};

export function ChannelChart() {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Channel Analysis
        </CardTitle>
        <CardDescription className="text-xs">
          Assessment volume by service channel
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[280px] w-full max-w-[320px]"
        >
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(220, 13%, 91%)" />
            <PolarAngleAxis
              dataKey="channel"
              tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }}
            />
            <PolarRadiusAxis
              angle={90}
              tick={{ fontSize: 10, fill: 'hsl(220, 9%, 46%)' }}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Radar
              name="Assessments"
              dataKey="assessments"
              stroke="hsl(221, 83%, 53%)"
              fill="hsl(221, 83%, 53%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
