
import RiskDashboard from './form/risk-dashboard'


export default function ABCRiskAssesment() {
  return (
    <main className="min-h-screen bg-background blurry-overlay">
      <div className=" p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Risk Score Analysis</h1>
          <p className="text-muted-foreground">Comprehensive risk assessment and compliance dashboard</p>
        </div>

        {/* Risk Dashboard Section */}
        <div className="mb-16">
          <RiskDashboard />
        </div>

      </div>
    </main>
  )
}
