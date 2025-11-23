import React, { useState } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RuleEditor() {
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
    <div className="max-w-2xl">
      {/* Basic Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Configuration</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Enter rule name"
              className="border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule ID</label>
            <Input
              value={ruleId}
              onChange={(e) => setRuleId(e.target.value)}
              placeholder="Auto-generated"
              disabled
              className="border-gray-300 bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Risk"
              className="border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <Input
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="e.g., High"
              className="border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rule Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Status</h2>
        <div className="flex gap-6">
          {['draft', 'active', 'inactive'].map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={ruleStatus === status}
                onChange={(e) => setRuleStatus(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">IF (All conditions must be true)</h2>
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={index} className="flex gap-2 items-end">
              <Input
                placeholder="Field"
                value={condition.field}
                onChange={(e) => {
                  const newConditions = [...conditions]
                  newConditions[index].field = e.target.value
                  setConditions(newConditions)
                }}
                className="border-gray-300 text-sm"
              />
              <Input
                placeholder="Operator"
                value={condition.operator}
                onChange={(e) => {
                  const newConditions = [...conditions]
                  newConditions[index].operator = e.target.value
                  setConditions(newConditions)
                }}
                className="border-gray-300 text-sm"
              />
              <Input
                placeholder="Value"
                value={condition.value}
                onChange={(e) => {
                  const newConditions = [...conditions]
                  newConditions[index].value = e.target.value
                  setConditions(newConditions)
                }}
                className="border-gray-300 text-sm"
              />
              <button
                onClick={() => removeCondition(index)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
        <Button
          onClick={addCondition}
          variant="outline"
          size="sm"
          className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">THEN (Take these actions)</h2>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <div key={index} className="flex gap-2 items-end">
              <Input
                placeholder="Action"
                value={action.action}
                onChange={(e) => {
                  const newActions = [...actions]
                  newActions[index].action = e.target.value
                  setActions(newActions)
                }}
                className="border-gray-300 text-sm"
              />
              <Input
                placeholder="Value"
                value={action.value}
                onChange={(e) => {
                  const newActions = [...actions]
                  newActions[index].value = e.target.value
                  setActions(newActions)
                }}
                className="border-gray-300 text-sm flex-1"
              />
              <button
                onClick={() => removeAction(index)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
        <Button
          onClick={addAction}
          variant="outline"
          size="sm"
          className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Action
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Cancel
        </Button>
        <Button className="bg-gray-900 text-white hover:bg-gray-800">Save Rule</Button>
      </div>
    </div>
  )
}
