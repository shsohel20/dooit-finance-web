"use client";

import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import TransactionListView from '@/views/transactions/list';




export default function TransactionList() {
  const riskData = [
    { name: "Pending", value: 8, color: "var(--chart-3)" },
    { name: "Approved", value: 15, color: "var(--chart-2)" },
    { name: "Flagged", value: 3, color: "var(--chart-5)" },
    { name: "Rejected", value: 2, color: "var(--chart-1)" },
  ]
  return (
    <div>

      <TransactionListView />
    </div>
  )
}
