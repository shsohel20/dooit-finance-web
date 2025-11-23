import { StatCard } from './stat-card'
import { RiskMatrix } from './risk-matrix'
import { RiskDistribution } from './risk-distribution'
import { RiskRegister } from './risk-register'

export default function RiskDashboard() {
  const matrixData = [
    {
      probability: 'Rare',
      categories: [
        { impact: 'Insignificant', level: 'Very Low' },
        { impact: 'Minor', level: 'Low' },
        { impact: 'Moderate', level: 'Low' },
        { impact: 'Major', level: 'Low' },
        { impact: 'Severe', level: 'Low' },
      ],
    },
    {
      probability: 'Unlikely',
      categories: [
        { impact: 'Insignificant', level: 'Low' },
        { impact: 'Minor', level: 'Low' },
        { impact: 'Moderate', level: 'Medium' },
        { impact: 'Major', level: 'Medium' },
        { impact: 'Severe', level: 'High' },
      ],
    },
    {
      probability: 'Possible',
      categories: [
        { impact: 'Insignificant', level: 'Low' },
        { impact: 'Minor', level: 'Medium' },
        { impact: 'Moderate', level: 'Medium' },
        { impact: 'Major', level: 'High' },
        { impact: 'Severe', level: 'High' },
      ],
    },
    {
      probability: 'Likely',
      categories: [
        { impact: 'Insignificant', level: 'Medium' },
        { impact: 'Minor', level: 'Medium' },
        { impact: 'Moderate', level: 'High' },
        { impact: 'Major', level: 'High' },
        { impact: 'Severe', level: 'Critical' },
      ],
    },
    {
      probability: 'Almost Certain',
      categories: [
        { impact: 'Insignificant', level: 'Medium' },
        { impact: 'Minor', level: 'High' },
        { impact: 'Moderate', level: 'High' },
        { impact: 'Major', level: 'Critical' },
        { impact: 'Severe', level: 'Critical' },
      ],
    },
  ]

  const distributionData = [
    { name: 'Third-Party Relationships', percentage: 28, color: 'bg-red-500' },
    { name: 'Vendor Management', percentage: 22, color: 'bg-orange-500' },
    { name: 'Compliance Issues', percentage: 20, color: 'bg-yellow-500' },
    { name: 'Operational Risk', percentage: 18, color: 'bg-blue-500' },
    { name: 'Financial Risk', percentage: 12, color: 'bg-purple-500' },
  ]

  const riskItems = [
    {
      id: 'ABC-001',
      description: 'High-risk transaction activity detected from new account',
      category: 'Third Party',
      likelihood: 'High',
      impact: 'Severe',
      level: 'High',
      owner: 'Legal Dept',
      status: 'In Progress',
    },
    {
      id: 'ABC-002',
      description: 'Vendor compliance certification expired',
      category: 'Third Party',
      likelihood: 'Medium',
      impact: 'Major',
      level: 'High',
      owner: 'Compliance',
      status: 'Review Required',
    },
    {
      id: 'ABC-003',
      description: 'Customer due diligence documentation incomplete',
      category: 'Third Party',
      likelihood: 'Low',
      impact: 'Moderate',
      level: 'Medium',
      owner: 'Legal Dept',
      status: 'Completed',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Identified Risks" value="47" color="primary" />
        <StatCard label="High/Critical Risks" value="17" color="destructive" />
        <StatCard label="Departments Assessed" value="14" unit="of 20 departments" color="secondary" />
        <StatCard label="Compliance Score" value="78%" color="accent" />
      </div>

      {/* Risk Matrix */}
      <RiskMatrix data={matrixData} />

      {/* Risk Distribution */}
      <RiskDistribution categories={distributionData} />

      {/* Risk Register */}
      <RiskRegister risks={riskItems} />
    </div>
  )
}
