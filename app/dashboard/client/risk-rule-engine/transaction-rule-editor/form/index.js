'use client'

import { useState } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RuleEditor from './RuleEditor'
import ExistingRulesPage from './Existing'
import RuleTesterPage from './Tester'
import ChangeHistory from './History'

export default function RuleConfigurationForm() {
  const [activeTab, setActiveTab] = useState('Rule Builder')
  const [ruleName, setRuleName] = useState('')
  const [ruleId, setRuleId] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')
  const [ruleStatus, setRuleStatus] = useState('draft')
  const [conditions, setConditions] = useState([
    { field: 'Transaction Amount', operator: 'Greater Than', value: '10000' },
  ])
  const [actions, setActions] = useState([
    { action: 'Generate Alert', value: 'High value transaction detected' },
  ])

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }])
  }

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const addAction = () => {
    setActions([...actions, { action: '', value: '' }])
  }

  const removeAction = (index) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className=" py-6">
          <h1 className="text-3xl font-semibold text-gray-900">Rule Configuration</h1>
        </div>
      </header>

      <main className="py-8">
        {/* Tabs */}
        <Tabs defaultValue="Rule Builder" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="border-b border-gray-200 bg-white p-0 mb-6">
            {['Rule Builder', 'Existing Rules', 'Rule Tester', 'Change History'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}

              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Rule Builder" className="mt-0">
            <RuleEditor />
          </TabsContent>
          <TabsContent value="Existing Rules" className="mt-0">
            <ExistingRulesPage />
          </TabsContent>
          <TabsContent value="Rule Tester" className="mt-0">
            <RuleTesterPage />
          </TabsContent>
          <TabsContent value="Change History" className="mt-0">
            <ChangeHistory />
          </TabsContent>
          {/* Other tabs */}

        </Tabs>
      </main>
    </div>
  )
}
