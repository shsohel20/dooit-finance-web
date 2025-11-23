'use client'

import { AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useState } from 'react'
import { TransactionDetail } from './Detail'



const transactions = [
  {
    id: 'TX-0034-2023',
    customer: 'Alice Green',
    email: 'a-0347-7617',
    amount: '$28,200',
    type: 'Intl. Offshore Bank',
    riskScore: 87,
    pattern: 'Suspicious',
    patternBadge: 'critical',
    time: '2 mins ago\n10:34 AM',
  },
  {
    id: 'TX-4394-2023',
    customer: 'Brian Roberts',
    email: 'b-0501-4405',
    amount: '€15,400',
    type: 'Multiple locations',
    riskScore: 76,
    pattern: 'Warning',
    patternBadge: 'warning',
    time: '5 mins ago\n10:29 AM',
  },
  {
    id: 'TX-6894-2023',
    customer: 'Catherine Smith',
    email: 'c-0331-6434',
    amount: '$53,200',
    type: 'Cryptocurrency exchange',
    riskScore: 80,
    pattern: 'Critical',
    patternBadge: 'critical',
    time: '5 mins ago\n10:28 AM',
  },
]

export function TransactionTable() {
  const [openDetail, setOpenDetail] = useState(false)
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Risk Score</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Pattern</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
              <td className="px-4 py-4 text-sm font-medium text-primary">{tx.id}</td>
              <td className="px-4 py-4">
                <div className="text-sm font-medium text-foreground">{tx.customer}</div>
                <div className="text-xs text-muted-foreground">{tx.email}</div>
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-accent">{tx.amount}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">{tx.type}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-accent">{tx.riskScore}</span>
                  <div className="h-2 w-16 rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${tx.riskScore >= 80
                        ? 'bg-destructive'
                        : tx.riskScore >= 70
                          ? 'bg-accent'
                          : 'bg-chart-3'
                        }`}
                      style={{ width: `${tx.riskScore}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span
                    className={
                      tx.patternBadge === 'critical'
                        ? 'text-destructive'
                        : 'text-accent'
                    }
                  >
                    {tx.pattern}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{tx.time}</td>
              <td className="px-4 py-4">
                <button className="p-1 hover:bg-secondary rounded transition-colors" onClick={() => setOpenDetail(true)}>
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Showing 3 of 87 transactions</span>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded transition-colors">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground">1 / 29</span>
          <button className="p-2 hover:bg-secondary rounded transition-colors">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      {openDetail ? <TransactionDetail openDetail={openDetail} setOpenDetail={setOpenDetail} /> : null}
    </div>
  )
}
