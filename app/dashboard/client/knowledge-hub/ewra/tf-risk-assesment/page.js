'use client'

import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { AlertCircle, TrendingUp, Shield, Activity } from 'lucide-react'
import { TransactionDashboard } from './form/dashboard'

const trendData = [
  { time: '14:00', risk: 45 },
  { time: '14:30', risk: 52 },
  { time: '15:00', risk: 78 },
  { time: '15:30', risk: 125 },
  { time: '16:00', risk: 142 },
  { time: '16:30', risk: 118 },
  { time: '17:00', risk: 95 },
  { time: '17:30', risk: 62 },
]

const riskDistribution = [
  { name: 'High Risk', value: 12, color: '#ef4444' },
  { name: 'Medium Risk', value: 28, color: '#f59e0b' },
  { name: 'Low Risk', value: 45, color: '#3b82f6' },
  { name: 'Safe', value: 15, color: '#10b981' },
]

const fraudPatterns = [
  { pattern: 'Rapid Multiple Transactions', count: 23, color: '#ef4444' },
  { pattern: 'Geographic Anomalies', count: 18, color: '#f97316' },
  { pattern: 'Unusual Amount Patterns', count: 12, color: '#eab308' },
  { pattern: 'New Recipient Transfers', count: 7, color: '#f59e0b' },
]

export default function TfRiskAssesmentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground blurry-overlay">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className=" px-6 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-accent-foreground" />
            <h1 className="text-3xl font-bold">Fraud Risk Monitor</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Real-time transaction fraud detection and risk analysis</p>
        </div>
      </header>

      <main className="px-6 py-8">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-8">
          <KPICard
            label="Transactions"
            value="1,247"
            icon={<Activity className="h-4 w-4" />}
            color="text-blue-500"
          />
          <KPICard
            label="High Risk"
            value="15"
            icon={<AlertCircle className="h-4 w-4" />}
            color="text-red-500"
          />
          <KPICard
            label="Medium Risk"
            value="8"
            color="text-amber-500"
          />
          <KPICard
            label="Low Risk"
            value="1,177"
            color="text-green-500"
          />
          <KPICard
            label="Total Value at Risk"
            value="$284K"
            color="text-indigo-500"
          />
          <KPICard
            label="Accuracy Rate"
            value="98.2%"
            color="text-emerald-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Trend Chart */}
          <Card className="lg:col-span-2 p-6 bg-card border-border">
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
                Transaction Fraud Risk Trends
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Last 4 hours activity</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Risk Distribution */}
          <Card className="p-6 bg-card border-border flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Risk Distribution</h2>
              <p className="text-sm text-muted-foreground mt-1">By transaction type</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Fraud Patterns */}
        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Common Fraud Patterns</h2>
            <p className="text-sm text-muted-foreground mt-1">Detected in last 24 hours</p>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {fraudPatterns.map((pattern) => (
              <div key={pattern.pattern} className="rounded-lg bg-muted/50 p-4 border border-border">
                <div
                  className="h-2 w-full rounded-full mb-3"
                  style={{ backgroundColor: pattern.color }}
                ></div>
                <p className="text-sm font-medium text-foreground">{pattern.pattern}</p>
                <p className="text-2xl font-bold mt-2" style={{ color: pattern.color }}>
                  {pattern.count}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <TransactionDashboard />
      </main>
    </div>
  )
}

function KPICard({ label, value, icon, color }) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </Card>
  )
}
