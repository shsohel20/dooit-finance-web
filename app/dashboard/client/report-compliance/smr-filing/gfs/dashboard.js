"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, TrendingDown, Users, Globe, Shield, FileText, Activity, Wallet } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from "recharts"



const countByKey = (data, key) => {
  const counts = {}
  data.forEach((record) => {
    const value = String(record[key])
    counts[value] = (counts[value] || 0) + 1
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

const groupByMonth = (data) => {
  const monthly = {}

  data.forEach((record) => {
    const date = new Date(record.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!monthly[monthKey]) {
      monthly[monthKey] = { suspicions: 0, amount: 0, deposited: 0, withdrawn: 0 }
    }

    monthly[monthKey].suspicions += 1
    monthly[monthKey].amount += record.totalSuspicionAmount
    monthly[monthKey].deposited += record.totalDeposited
    monthly[monthKey].withdrawn += record.totalWithdrawn
  })

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }))
}
const sampleData = [
  {
    accountOpeningDate: "1978-07-09T00:00:00.000Z",
    accountOpeningPurpose: "Excepturi tempore i",
    additionalNotes: "Sint mollitia id e",
    attachments: [],
    companyName: "Explicabo Laborum m",
    createdAt: "2025-11-30T05:59:45.761Z",
    cryptoAddresses: ["Nisi in aut omnis do"],
    customerAge: 80,
    customerCountry: "Australia",
    customerName: "Consequatur Dolores",
    customerUID: "Consequatur Esse al",
    generatedReport: "",
    id: "692bdd513b1479ae11dda525",
    ipAddresses: [{ address: "192.168.1.1" }],
    metadata: { createdBy: "6906ef042b25d3502f3a6915" },
    ofis: [{ name: "Sample OFI" }],
    pois: [],
    reviewEndDate: "1982-06-10T00:00:00.000Z",
    reviewStartDate: "1977-02-10T00:00:00.000Z",
    sequence: 1,
    sourceOfFunds: "Earum facilis aspern",
    status: "draft",
    suspicionBehaviour: "",
    suspicionDates: "Ut sint aut eaque du",
    suspicionIntensity: "7.5",
    suspicionReason: "Voluptatem cum aspe",
    suspicionType: "Money Laundering",
    totalDeposited: 74,
    totalSuspicionAmount: 28,
    totalWithdrawn: 0,
    transactions: [{ id: "tx1", amount: 74 }],
    uid: "GFS_1764482385761",
    updatedAt: "2025-11-30T05:59:45.761Z",
    __v: 0,
    _id: "692bdd513b1479ae11dda525",
  },
  {
    accountOpeningDate: "2020-03-15T00:00:00.000Z",
    accountOpeningPurpose: "Business operations",
    additionalNotes: "High volume trader",
    attachments: [{ name: "doc1.pdf" }],
    companyName: "Tech Corp Ltd",
    createdAt: "2025-10-15T08:30:00.000Z",
    cryptoAddresses: ["0xabc123", "0xdef456"],
    customerAge: 45,
    customerCountry: "United States",
    customerName: "John Smith",
    customerUID: "JS_USA_2020",
    generatedReport: "",
    id: "692bdd513b1479ae11dda526",
    ipAddresses: [{ address: "10.0.0.1" }, { address: "192.168.100.5" }],
    metadata: { createdBy: "admin_001" },
    ofis: [],
    pois: [],
    reviewEndDate: "2025-12-31T00:00:00.000Z",
    reviewStartDate: "2025-10-01T00:00:00.000Z",
    sequence: 2,
    sourceOfFunds: "Trading profits",
    status: "completed",
    suspicionBehaviour: "Unusual patterns",
    suspicionDates: "Oct 2025",
    suspicionIntensity: "8.2",
    suspicionReason: "Large volume transactions",
    suspicionType: "Money Laundering",
    totalDeposited: 250000,
    totalSuspicionAmount: 180000,
    totalWithdrawn: 50000,
    transactions: [
      { id: "tx2", amount: 250000 },
      { id: "tx3", amount: 50000 },
    ],
    uid: "GFS_1729000000000",
    updatedAt: "2025-11-15T10:00:00.000Z",
    __v: 0,
    _id: "692bdd513b1479ae11dda526",
  },
  {
    accountOpeningDate: "2019-08-20T00:00:00.000Z",
    accountOpeningPurpose: "Personal savings",
    additionalNotes: "Multiple small deposits",
    attachments: [],
    companyName: "",
    createdAt: "2025-09-20T14:20:00.000Z",
    cryptoAddresses: [],
    customerAge: 32,
    customerCountry: "United Kingdom",
    customerName: "Emma Watson",
    customerUID: "EW_UK_2019",
    generatedReport: "",
    id: "692bdd513b1479ae11dda527",
    ipAddresses: [{ address: "172.16.0.1" }],
    metadata: { createdBy: "admin_002" },
    ofis: [],
    pois: [],
    reviewEndDate: "2025-11-30T00:00:00.000Z",
    reviewStartDate: "2025-09-15T00:00:00.000Z",
    sequence: 3,
    sourceOfFunds: "Employment income",
    status: "draft",
    suspicionBehaviour: "Structuring",
    suspicionDates: "Sep 2025",
    suspicionIntensity: "6.0",
    suspicionReason: "Multiple deposits under threshold",
    suspicionType: "Structuring",
    totalDeposited: 45000,
    totalSuspicionAmount: 42000,
    totalWithdrawn: 2000,
    transactions: Array(15).fill({ id: "tx", amount: 3000 }),
    uid: "GFS_1726843200000",
    updatedAt: "2025-10-05T09:30:00.000Z",
    __v: 0,
    _id: "692bdd513b1479ae11dda527",
  },
  {
    accountOpeningDate: "2021-01-10T00:00:00.000Z",
    accountOpeningPurpose: "Investment account",
    additionalNotes: "Crypto heavy user",
    attachments: [{ name: "id.pdf" }, { name: "proof.pdf" }],
    companyName: "Crypto Ventures Inc",
    createdAt: "2025-11-05T16:45:00.000Z",
    cryptoAddresses: ["0x111", "0x222", "0x333"],
    customerAge: 28,
    customerCountry: "Canada",
    customerName: "Michael Chen",
    customerUID: "MC_CA_2021",
    generatedReport: "",
    id: "692bdd513b1479ae11dda528",
    ipAddresses: [{ address: "203.0.113.0" }, { address: "198.51.100.0" }],
    metadata: { createdBy: "admin_003" },
    ofis: [],
    pois: [],
    reviewEndDate: "2026-01-10T00:00:00.000Z",
    reviewStartDate: "2025-11-01T00:00:00.000Z",
    sequence: 4,
    sourceOfFunds: "Cryptocurrency trading",
    status: "ongoing",
    suspicionBehaviour: "Rapid movement of funds",
    suspicionDates: "Nov 2025",
    suspicionIntensity: "9.1",
    suspicionReason: "Suspected crypto money laundering",
    suspicionType: "Cryptocurrency Fraud",
    totalDeposited: 500000,
    totalSuspicionAmount: 480000,
    totalWithdrawn: 450000,
    transactions: Array(50).fill({ id: "tx", amount: 10000 }),
    uid: "GFS_1730822400000",
    updatedAt: "2025-11-28T12:00:00.000Z",
    __v: 0,
    _id: "692bdd513b1479ae11dda528",
  },
  {
    accountOpeningDate: "2018-05-12T00:00:00.000Z",
    accountOpeningPurpose: "Retirement savings",
    additionalNotes: "Long-term customer",
    attachments: [],
    companyName: "",
    createdAt: "2025-08-10T11:15:00.000Z",
    cryptoAddresses: [],
    customerAge: 62,
    customerCountry: "Australia",
    customerName: "Patricia Johnson",
    customerUID: "PJ_AU_2018",
    generatedReport: "",
    id: "692bdd513b1479ae11dda529",
    ipAddresses: [],
    metadata: { createdBy: "admin_001" },
    ofis: [],
    pois: [],
    reviewEndDate: "2025-10-15T00:00:00.000Z",
    reviewStartDate: "2025-08-01T00:00:00.000Z",
    sequence: 5,
    sourceOfFunds: "Pension funds",
    status: "completed",
    suspicionBehaviour: "None",
    suspicionDates: "Aug 2025",
    suspicionIntensity: "3.5",
    suspicionReason: "Routine compliance check",
    suspicionType: "Structuring",
    totalDeposited: 85000,
    totalSuspicionAmount: 5000,
    totalWithdrawn: 15000,
    transactions: [{ id: "tx10", amount: 85000 }],
    uid: "GFS_1723291200000",
    updatedAt: "2025-09-30T15:20:00.000Z",
    __v: 0,
    _id: "692bdd513b1479ae11dda529",
  },
]
export function SuspicionDashboard({ data = sampleData }) {
  const totalCases = data.length
  const activeCases = data.filter((d) => d.status.toLowerCase() !== "completed").length
  const totalSuspicionAmount = data.reduce((sum, d) => sum + d.totalSuspicionAmount, 0)
  const totalDeposited = data.reduce((sum, d) => sum + d.totalDeposited, 0)
  const totalWithdrawn = data.reduce((sum, d) => sum + d.totalWithdrawn, 0)

  const intensityValues = data
    .filter((d) => d.suspicionIntensity)
    .map((d) => Number.parseFloat(d.suspicionIntensity) || 0)
  const avgIntensity =
    intensityValues.length > 0
      ? (intensityValues.reduce((sum, val) => sum + val, 0) / intensityValues.length).toFixed(1)
      : null

  const suspicionTypeData = countByKey(data, "suspicionType")
  const statusData = countByKey(data, "status")
  const countryData = countByKey(data, "customerCountry").slice(0, 5) // Top 5 countries

  const monthlyData = groupByMonth(data)

  const reasonCounts = {}
  data.forEach((d) => {
    reasonCounts[d.suspicionReason] = (reasonCounts[d.suspicionReason] || 0) + 1
  })
  const mostCommonReason = Object.entries(reasonCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

  const avgCustomerAge = (data.reduce((sum, d) => sum + d.customerAge, 0) / data.length).toFixed(0)
  const customersWithCrypto = data.filter((d) => d.cryptoAddresses && d.cryptoAddresses.length > 0).length
  const customersWithSuspiciousIP = data.filter((d) => d.ipAddresses && d.ipAddresses.length > 0).length
  const uniqueCustomers = new Set(data.map((d) => d.customerUID)).size
  const casesWithAttachments = data.filter((d) => d.attachments && d.attachments.length > 0).length
  const casesWithTransactions = data.filter((d) => d.transactions && d.transactions.length > 0).length

  const COLORS = [
    "var(--chart-1)", // blue
    "var(--chart-2)", // green
    "var(--chart-3)", // amber
    "var(--chart-4)", // red
    "var(--chart-5)", // purple
    "var(--chart-6)", // teal
  ]

  return (
    <div className="space-y-4">
      {/* High-Level KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
            <FileText className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
            <p className="mt-1 text-xs text-muted-foreground">{activeCases} active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Cases</CardTitle>
            <Activity className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {((activeCases / totalCases) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Suspicion</CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSuspicionAmount.toLocaleString()}</div>
            <p className="mt-1 text-xs text-muted-foreground">Flagged amount</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deposited</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposited.toLocaleString()}</div>
            <p className="mt-1 text-xs text-muted-foreground">Total inflow</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Withdrawn</CardTitle>
            <TrendingDown className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawn.toLocaleString()}</div>
            <p className="mt-1 text-xs text-muted-foreground">Total outflow</p>
          </CardContent>
        </Card>
      </div>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Common Reason</CardTitle>
            <Shield className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-balance line-clamp-3">{mostCommonReason}</p>
            <p className="mt-1 text-xs text-muted-foreground">{reasonCounts[mostCommonReason] || 0} cases</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Customer Age</CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCustomerAge} years</div>
            <p className="mt-1 text-xs text-muted-foreground">Across {uniqueCustomers} customers</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">With Crypto</CardTitle>
            <Wallet className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersWithCrypto}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {((customersWithCrypto / totalCases) * 100).toFixed(0)}% have crypto addresses
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspicious IPs</CardTitle>
            <Globe className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersWithSuspiciousIP}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {((customersWithSuspiciousIP / totalCases) * 100).toFixed(0)}% have flagged IPs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="mt-1 text-xs text-muted-foreground">Distinct customer UIDs</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cases with Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casesWithAttachments}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {((casesWithAttachments / totalCases) * 100).toFixed(0)}% have documents
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cases with Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casesWithTransactions}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {((casesWithTransactions / totalCases) * 100).toFixed(0)}% have activity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
