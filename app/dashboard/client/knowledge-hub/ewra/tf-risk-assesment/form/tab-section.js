import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RiskAnalysis } from './risk-analysis'
import { RiskFactorsPanel } from './risk-factors-panel'

const tabs = [
  { id: 'analysis', label: 'Risk Analysis' },
  { id: 'similar', label: 'Similar Transactions' },
  { id: 'details', label: 'Transaction Details' },
  { id: 'activity', label: 'Activity Timeline' }
]

export function TabSection({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-border">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="analysis">
          {/* <RiskAnalysis /> */}
          <RiskFactorsPanel />
        </TabsContent>
        <TabsContent value="similar" />
        <TabsContent value="details" />
        <TabsContent value="activity" />
      </Tabs>

    </div>
  )
}
