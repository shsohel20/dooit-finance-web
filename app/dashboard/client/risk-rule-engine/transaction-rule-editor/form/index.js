'use client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RuleEditor from './RuleEditor'
import ExistingRulesPage from './Existing'
import RuleTesterPage from './Tester'
import ChangeHistory from './History'

const TABS = [
  { value: 'builder', label: 'Rule Builder' },
  { value: 'existing', label: 'Existing Rules' },
  { value: 'tester', label: 'Rule Tester' },
  { value: 'history', label: 'Change History' },
]

export default function RuleConfigurationForm() {
  const [activeTab, setActiveTab] = useState('builder')

  const handleRuleSaved = (rule) => {
    if (rule?._id) {
      setActiveTab('existing')
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-heading">Transaction Rule Builder</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Visually build, test, and manage AML detection rules
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 h-9">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="builder">
          <RuleEditor onSaved={handleRuleSaved} />
        </TabsContent>

        <TabsContent value="existing">
          <ExistingRulesPage />
        </TabsContent>

        <TabsContent value="tester">
          <RuleTesterPage />
        </TabsContent>

        <TabsContent value="history">
          <ChangeHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
