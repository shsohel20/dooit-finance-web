'use client'

import { Input } from '@/components/ui/input'

/**
 * Ownership section: config.owner and config.sla.
 * Also displays a read-only Audit row (placeholder for future audit trail).
 */
export default function Ownership({ node, onPatch }) {
  const config = node.config || {}

  const handleConfigChange = (key, value) => {
    onPatch({ config: { ...config, [key]: value } })
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground">Ownership</div>

      <div>
        <label className="text-xs text-muted-foreground">Owner</label>
        <Input
          placeholder="Assign owner (e.g., compliance-team)"
          value={config.owner || ''}
          onChange={(e) => handleConfigChange('owner', e.target.value)}
          className="text-sm mt-1"
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground">SLA</label>
        <Input
          placeholder="SLA duration (e.g., 24h, 2 days)"
          value={config.sla || ''}
          onChange={(e) => handleConfigChange('sla', e.target.value)}
          className="text-sm mt-1"
        />
      </div>

      <div className="p-2 bg-muted rounded border border-border">
        <label className="text-xs text-muted-foreground block mb-1">Audit</label>
        <div className="text-xs text-muted-foreground">No audit events yet</div>
      </div>
    </div>
  )
}
