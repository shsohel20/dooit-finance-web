'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

/**
 * FlowControl section: the endOfFlow checkbox and start node selector.
 * When endOfFlow is checked, any outgoing edges from this node are cleared.
 * The "Set as start" button makes this the workflow's entry point.
 */
export default function FlowControl({ node, startNodeId, onPatch, onClearEdges, onSetStart }) {
  const handleEndOfFlowChange = (checked) => {
    onPatch({ endOfFlow: checked })
    if (checked) {
      // Clear all outgoing edges when marking as end of flow
      onClearEdges(node.id)
    }
  }

  const isStart = node.id === startNodeId

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-foreground">Flow Control</div>

      <div className="flex items-start gap-3">
        <Checkbox
          checked={node.endOfFlow || false}
          onCheckedChange={handleEndOfFlowChange}
          id="endOfFlow"
        />
        <div className="flex-1">
          <label htmlFor="endOfFlow" className="text-sm text-foreground cursor-pointer">
            Mark as end of flow
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            When checked, this step is the final step in the workflow. Any outgoing connectors are automatically removed.
          </p>
        </div>
      </div>

      <div>
        <Button
          variant={isStart ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSetStart(node.id)}
          disabled={isStart}
          className="text-xs w-full"
        >
          {isStart ? '✓ Start node' : 'Set as start node'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          The workflow begins at the start node. Only one node can be the start.
        </p>
      </div>
    </div>
  )
}
