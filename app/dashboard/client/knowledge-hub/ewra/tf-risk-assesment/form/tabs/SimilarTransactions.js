'use client'
import { useState } from 'react'
import { AlertCircle, TrendingUp } from 'lucide-react'
import TransactionDetail from './TransactionDetails'



function TransactionCard({ transaction }) {
  const [openDetails, setOpenDetails] = useState(false)
  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getRiskBgColor = (score) => {
    if (score >= 75) return 'bg-red-500/10 border-red-500/20'
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-green-500/10 border-green-500/20'
  }

  return (
    <div className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg" onClick={() => setOpenDetails(!openDetails)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Transaction ID and Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">{transaction.id}</span>
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-foreground mb-1">{transaction.name}</h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{transaction.description}</p>
        </div>

        {/* Amount - Right Side */}
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-primary">${transaction.amount.toLocaleString()}</div>
        </div>
      </div>

      {/* Risk Score Section */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <AlertCircle className={`w-4 h-4 ${getRiskColor(transaction.riskScore)}`} />
          <span className="text-sm text-muted-foreground">Risk Score</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRiskBgColor(
            transaction.riskScore
          )}`}
        >
          <TrendingUp className={`w-4 h-4 ${getRiskColor(transaction.riskScore)}`} />
          <span className={`font-semibold text-sm ${getRiskColor(transaction.riskScore)}`}>
            {transaction.riskScore}
          </span>
        </div>
      </div>
      {openDetails ? <TransactionDetail {...transaction} /> : null}
    </div>
  )
}


const transactions = [
  {
    id: 'TX-4591-2023',
    name: 'Brian Roberts',
    description: 'Multiple locations',
    riskScore: 76,
    amount: 5750,
    senderName: 'Brian Roberts',
    senderTitle: 'CEO',
    senderAddress: '123 Main St, Anytown, USA',
    senderEmail: 'brian@example.com',
    recipientName: 'Catherine Smith',
    recipientAccount: '1234567890',
    recipientBranch: 'Anytown Branch',
    recipientSwift: '1234567890',
    purpose: 'Payment',
    paymentMethod: 'Bank Transfer',
    notes: 'Payment for services',
  },
  {
    id: 'TX-6204-2023',
    name: 'Catherine Smith',
    description: 'Cryptocurrency exchange',
    riskScore: 80,
    amount: 12500,
    senderName: 'Catherine Smith',
    senderTitle: 'CEO',
    senderAddress: '123 Main St, Anytown, USA',
    senderEmail: 'catherine@example.com',
    recipientName: 'Brian Roberts',
    recipientAccount: '1234567890',
    recipientBranch: 'Anytown Branch',
    recipientSwift: '1234567890',
    purpose: 'Payment',
    paymentMethod: 'Bank Transfer',
    notes: 'Payment for services',
  },
  {
    id: 'TX-6204-2023',
    name: 'Catherine Smith',
    description: 'Cryptocurrency exchange',
    riskScore: 80,
    amount: 12500,
    senderName: 'Catherine Smith',
    senderTitle: 'CEO',
    senderAddress: '123 Main St, Anytown, USA',
    senderEmail: 'catherine@example.com',
    recipientName: 'Brian Roberts',
    recipientAccount: '1234567890',
    recipientBranch: 'Anytown Branch',
    recipientSwift: '1234567890',
    purpose: 'Payment',
    paymentMethod: 'Bank Transfer',
    notes: 'Payment for services',
  },
]

export function SimilarTransactions() {
  return (
    <div className="">
      <div className="max-w-4xl mx-auto">


        {/* Transaction List */}
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <TransactionCard key={index} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  )
}
