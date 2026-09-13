'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

/**
 * CardContent section: manage the step card display fields.
 * - card.inset: subtitle text
 * - card.decision: decision text
 * - card.reason: reason text
 * - card.chips[]: plain strings (schema: `chips: [String]`) — detail lines,
 *   no tone. StepNode.jsx renders each chip's text directly.
 * - card.tags[]: { text, tone } objects — schema and StepNode.jsx both use
 *   `text`, not `label`.
 */
export default function CardContent({ node, onPatch }) {
  const card = node.card || {}

  const handleCardChange = (key, value) => {
    onPatch({ card: { ...card, [key]: value } })
  }

  const handleAddChip = () => {
    const chips = card.chips || []
    handleCardChange('chips', [...chips, ''])
  }

  const handleUpdateChip = (index, val) => {
    const chips = (card.chips || []).map((c, i) => (i === index ? val : c))
    handleCardChange('chips', chips)
  }

  const handleRemoveChip = (index) => {
    const chips = (card.chips || []).filter((_, i) => i !== index)
    handleCardChange('chips', chips)
  }

  const handleAddTag = () => {
    const tags = card.tags || []
    const newTags = [...tags, { text: '', tone: 'plain' }]
    handleCardChange('tags', newTags)
  }

  const handleUpdateTag = (index, key, val) => {
    const tags = (card.tags || []).map((t, i) =>
      i === index ? { ...t, [key]: val } : t
    )
    handleCardChange('tags', tags)
  }

  const handleRemoveTag = (index) => {
    const tags = (card.tags || []).filter((_, i) => i !== index)
    handleCardChange('tags', tags)
  }

  const toneOptions = [
    { value: 'plain', label: 'Plain' },
    { value: 'warn', label: 'Warning' },
    { value: 'bad', label: 'Bad' },
  ]

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-foreground">Card Content</div>

      <div>
        <label className="text-xs text-muted-foreground">Inset (subtitle)</label>
        <Input
          placeholder="Card inset text"
          value={card.inset || ''}
          onChange={(e) => handleCardChange('inset', e.target.value)}
          className="text-sm mt-1"
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Decision</label>
        <Textarea
          placeholder="Decision text"
          value={card.decision || ''}
          onChange={(e) => handleCardChange('decision', e.target.value)}
          className="text-sm mt-1"
          rows={2}
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Reason</label>
        <Textarea
          placeholder="Reason text"
          value={card.reason || ''}
          onChange={(e) => handleCardChange('reason', e.target.value)}
          className="text-sm mt-1"
          rows={2}
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-2">Chips</label>
        <div className="space-y-2">
          {(card.chips || []).map((chip, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Detail line"
                value={chip || ''}
                onChange={(e) => handleUpdateChip(i, e.target.value)}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveChip(i)}
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
          onClick={handleAddChip}
          className="text-xs mt-2"
        >
          Add chip
        </Button>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-2">Tags</label>
        <div className="space-y-2">
          {(card.tags || []).map((tag, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Label"
                value={tag.text || ''}
                onChange={(e) => handleUpdateTag(i, 'text', e.target.value)}
                className="flex-1 text-sm"
              />
              <Select value={tag.tone || 'plain'} onValueChange={(v) => handleUpdateTag(i, 'tone', v)}>
                <SelectTrigger className="w-24 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveTag(i)}
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
          onClick={handleAddTag}
          className="text-xs mt-2"
        >
          Add tag
        </Button>
      </div>
    </div>
  )
}
