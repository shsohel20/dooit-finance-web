import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RiskAnalysis } from '../risk-analysis'
import { RiskFactorsPanel } from '../risk-factors-panel'
import { RiskMetrics } from './risk-metrics'
import { SimilarTransactions } from './SimilarTransactions'
import ActivityTimeline from './activity-timeline'

const tabs = [
  { id: 'analysis', label: 'Risk Analysis' },
  { id: 'similar', label: 'Similar Transactions' },
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
          {/* <RiskFactorsPanel /> */}
          <RiskMetrics />
        </TabsContent>
        <TabsContent value="similar" >
          <SimilarTransactions />
        </TabsContent>

        <TabsContent value="activity" >
          <ActivityTimeline />
        </TabsContent>
      </Tabs>

    </div>
  )
}
