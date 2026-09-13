'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Settings section: manage config.fields as label/value pairs.
 * Each row has label and value inputs, a remove button, and an "Add setting" button.
 */
export default function Settings({ node, onPatch }) {
  const fields = (node.config?.fields || [])

  const handleAddField = () => {
    const newFields = [...fields, { label: '', value: '' }]
    onPatch({ config: { ...node.config, fields: newFields } })
  }

  const handleUpdateField = (index, key, val) => {
    const newFields = fields.map((f, i) =>
      i === index ? { ...f, [key]: val } : f
    )
    onPatch({ config: { ...node.config, fields: newFields } })
  }

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index)
    onPatch({ config: { ...node.config, fields: newFields } })
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground">Settings</div>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Label"
              value={field.label || ''}
              onChange={(e) => handleUpdateField(i, 'label', e.target.value)}
              className="flex-1 text-sm"
            />
            <Input
              placeholder="Value"
              value={field.value || ''}
              onChange={(e) => handleUpdateField(i, 'value', e.target.value)}
              className="flex-1 text-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveField(i)}
              className="px-2 text-muted-foreground hover:text-destructive"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddField}
        className="text-xs"
      >
        Add setting
      </Button>
    </div>
  )
}
