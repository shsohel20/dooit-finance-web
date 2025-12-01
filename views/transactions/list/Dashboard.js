"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  Globe,
  Smartphone,
  DollarSign,
} from "lucide-react"




export function TransactionDashboard({ transactions }) {
  // Calculate KPIs
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalTransactions = transactions.length
  const uniqueSenders = new Set(transactions.map((t) => t.sender.id)).size
  const uniqueReceivers = new Set(transactions.map((t) => t.receiver.name)).size
  const avgAmount = totalAmount / totalTransactions

  // Calculate distributions
  const currencyDist = calculateDistribution(transactions, "currency")
  const statusDist = calculateDistribution(transactions, "status")
  const channelDist = calculateDistribution(transactions, "channel")
  const typeDist = calculateDistribution(transactions, "subtype")

  // Calculate trends
  const amountTrend = calculateTrend(transactions)
  const purposeData = calculatePurposeData(transactions)
  const countryComparison = calculateCountryComparison(transactions)

  // Risk metrics
  const highRiskCount = transactions.filter((t) => t.riskScore > 0).length
  const riskFlagsCount = transactions.filter((t) => t.riskFlags.length > 0).length
  const flaggedInvestigations = transactions.filter((t) => t.investigation.flagged).length
  const relatedPartyCount = transactions.filter((t) => t.relatedPartyFlag).length

  // Metadata insights
  const uniqueIPs = new Set(transactions.map((t) => t.metadata.ip)).size
  const uniqueDevices = new Set(transactions.map((t) => t.metadata.deviceId)).size
  const purposeCounts = transactions.reduce(
    (acc, t) => {
      acc[t.purpose] = (acc[t.purpose] || 0) + 1
      return acc
    },
    {}
  )
  const mostCommonPurpose = Object.entries(purposeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  const institutionCounts = transactions.reduce(
    (acc, t) => {
      acc[t.receiver.institutionCountry] = (acc[t.receiver.institutionCountry] || 0) + 1
      return acc
    },
    {}
  )
  const mostCommonCountry = Object.entries(institutionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  // Additional summary cards
  const largestTransaction = Math.max(...transactions.map((t) => t.amount))
  const senderCounts = transactions.reduce(
    (acc, t) => {
      acc[t.sender.name] = (acc[t.sender.name] || 0) + 1
      return acc
    },
    {}
  )
  const mostActiveSender = Object.entries(senderCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  const receiverCounts = transactions.reduce(
    (acc, t) => {
      acc[t.receiver.name] = (acc[t.receiver.name] || 0) + 1
      return acc
    },
    {}
  )
  const mostActiveReceiver = Object.entries(receiverCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  const COLORS = [
    " var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]

  return (
    <div className="space-y-6">
      {/* High-Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Amount"
          value={`$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-4 h-4" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard title="Unique Senders" value={uniqueSenders.toLocaleString()} icon={<Users className="w-4 h-4" />} />
        <StatCard
          title="Unique Receivers"
          value={uniqueReceivers.toLocaleString()}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Avg Transaction"
          value={`$${avgAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Currency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={currencyDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {currencyDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={channelDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transaction Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={typeDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line and Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transaction Amount Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={amountTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transactions Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={amountTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--chart-1)",
                    border: "1px solid var(--chart-2)",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}



      </div>

      {/* Risk & Compliance Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Risk & Compliance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            title="High-Risk Transactions"
            value={highRiskCount}
            icon={<AlertTriangle className="w-4 h-4 text-orange-500" />}
            color="orange"
          />
          <InfoCard
            title="Transactions with Risk Flags"
            value={riskFlagsCount}
            icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            color="red"
          />
          <InfoCard
            title="Flagged Investigations"
            value={flaggedInvestigations}
            icon={<Shield className="w-4 h-4 text-red-500" />}
            color="red"
          />
          <InfoCard
            title="Related Party Transactions"
            value={relatedPartyCount}
            icon={<Users className="w-4 h-4 text-yellow-500" />}
            color="yellow"
          />
        </div>
      </div>

      {/* Metadata-Level Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Metadata Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard title="Unique IP Addresses" value={uniqueIPs} icon={<Globe className="w-4 h-4" />} />
          <InfoCard title="Unique Devices" value={uniqueDevices} icon={<Smartphone className="w-4 h-4" />} />
          <InfoCard title="Most Common Purpose" value={mostCommonPurpose.replace(/_/g, " ")} isText />
          <InfoCard title="Top Receiver Country" value={mostCommonCountry} isText />
        </div>
      </div>

      {/* Additional Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Additional Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            title="Largest Single Transaction"
            value={`$${largestTransaction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <InfoCard title="Most Active Sender" value={mostActiveSender} isText />
          <InfoCard title="Most Active Receiver" value={mostActiveReceiver} isText />
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InfoCard({
  title,
  value,
  icon,
  color,
  isText = false,
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className={`${isText ? "text-lg" : "text-2xl"} font-bold truncate`}>{value}</div>
      </CardContent>
    </Card>
  )
}

// Helper Functions
function calculateDistribution(transactions, key) {
  const dist = transactions.reduce(
    (acc, t) => {
      const value = t[key]
      acc[value] = (acc[value] || 0) + 1
      return acc
    },
    {}
  )

  return Object.entries(dist).map(([name, value]) => ({ name, value }))
}

function calculateTrend(transactions) {
  const grouped = transactions.reduce(
    (acc, t) => {
      const date = new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!acc[date]) {
        acc[date] = { amount: 0, count: 0 }
      }
      acc[date].amount += t.amount
      acc[date].count += 1
      return acc
    },
    {}
  )

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      amount: Math.round(data.amount),
      count: data.count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function calculatePurposeData(transactions) {
  const grouped = transactions.reduce(
    (acc, t) => {
      if (!acc[t.purpose]) {
        acc[t.purpose] = 0
      }
      acc[t.purpose] += t.amount
      return acc
    },
    {}
  )

  return Object.entries(grouped)
    .map(([purpose, amount]) => ({
      purpose: purpose.replace(/_/g, " "),
      amount: Math.round(amount),
    }))
    .sort((a, b) => b.amount - a.amount)
}

function calculateCountryComparison(transactions) {
  const countries = new Set([
    ...transactions.map((t) => t.sender.institutionCountry),
    ...transactions.map((t) => t.receiver.institutionCountry),
  ])

  return Array.from(countries)
    .map((country) => ({
      country,
      senderCount: transactions.filter((t) => t.sender.institutionCountry === country).length,
      receiverCount: transactions.filter((t) => t.receiver.institutionCountry === country).length,
    }))
    .slice(0, 8) // Top 8 countries
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}
