"use client";

import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import TransactionListView from '@/views/transactions/list';




export default function TransactionList() {

  return (
    <div>
      {/* <Card className="border-border/50 mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction Risk Status</CardTitle>
              <CardDescription className="mt-1">Overview of all transaction statuses</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{riskData.reduce((sum, item) => sum + item.value, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Transactions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <ChartContainer
              config={{
                pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-3))",
                },
                approved: {
                  label: "Approved",
                  color: "hsl(var(--chart-2))",
                },
                flagged: {
                  label: "Flagged",
                  color: "hsl(var(--chart-5))",
                },
                rejected: {
                  label: "Rejected",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[240px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-4 content-center">
              {riskData.map((item) => (
                <div key={item.name} className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: item.color, opacity: 0.2 }}
                  >
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card> */}
      <TransactionListView />
    </div>
  )
}
