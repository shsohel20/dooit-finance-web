'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Radix Select forbids empty-string item values, so use a sentinel for "no target"
const NONE = '__none__'

/**
 * Outcomes section: non-condition nodes.
 * config.outcomes[] is an array of { cond, then } pairs (schema:
 * WorkflowConfigSchema.outcomes, api/models/Workflow.js).
 * `cond` is a freetext field description or label.
 * `then` is a target node selector.
 */
export default function Outcomes({ node, allNodes, onPatch }) {
  const outcomes = (node.config?.outcomes || [])

  const handleAddOutcome = () => {
    const newOutcomes = [...outcomes, { cond: '', then: '' }]
    onPatch({ config: { ...node.config, outcomes: newOutcomes } })
  }

  const handleUpdateOutcome = (index, key, val) => {
    const newOutcomes = outcomes.map((o, i) =>
      i === index ? { ...o, [key]: val } : o
    )
    onPatch({ config: { ...node.config, outcomes: newOutcomes } })
  }

  const handleRemoveOutcome = (index) => {
    const newOutcomes = outcomes.filter((_, i) => i !== index)
    onPatch({ config: { ...node.config, outcomes: newOutcomes } })
  }

  const otherNodes = allNodes?.filter((n) => n.id !== node.id) || []

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground">Outcomes</div>

      <div className="space-y-3">
        {outcomes.map((outcome, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted">
            <div>
              <label className="text-xs text-muted-foreground">Condition</label>
              <Textarea
                placeholder="Describe the condition"
                value={outcome.cond || ''}
                onChange={(e) => handleUpdateOutcome(i, 'cond', e.target.value)}
                className="text-sm mt-1"
                rows={2}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Then →</label>
              <Select value={outcome.then || NONE} onValueChange={(v) => handleUpdateOutcome(i, 'then', v === NONE ? '' : v)}>
                <SelectTrigger className="text-sm mt-1">
                  <SelectValue placeholder="Select target node" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {otherNodes.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.title || n.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveOutcome(i)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remove outcome
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddOutcome}
        className="text-xs"
      >
        Add outcome
      </Button>
    </div>
  )
}
