"use client";

import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import TransactionListView from '@/views/transactions/list';




export default function TransactionList() {

  return (
    <div>

      <TransactionListView />
    </div>
  )
}
