import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { TabSection } from './tabs/tab-section'
import RiskPanel from './tabs/RiskPanel'

export function RiskAnalysis({ activeTab, setActiveTab }) {
  return (
    <div className="space-y-6">
      <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <RiskPanel /> */}

      {/* AI Assessment */}
      {/* <Card className="bg-card border border-warning/30 p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">AI Risk Assessment</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This transaction exhibits multiple high-risk indicators including offshore destination, unusual transaction pattern for this customer, and large transfer amount. The combination of factors suggests enhanced due diligence and customer verification is recommended before processing.
            </p>
          </div>
        </div>
      </Card> */}
    </div>
  )
}
