'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { stepType, STEP_TYPES } from '../../lib/stepTypes'
import { OPERATORS, VARIABLE_NAMESPACES } from '../../lib/variableCatalog'

import SectionLabel from './SectionLabel'
import Settings from './sections/Settings'
import CardContent from './sections/CardContent'
import Branches from './sections/Branches'
import Outcomes from './sections/Outcomes'
import Ownership from './sections/Ownership'
import FlowControl from './sections/FlowControl'

/**
 * Step Inspector: header + six sections that manage the selected node.
 * - Header: type badge, editable title, remove button, purpose textarea, type select
 * - Sections: Settings, CardContent, Branches (condition only), Outcomes, Ownership, FlowControl
 * - Condition nodes also show operator chips and variable reference below Branches
 */
export default function StepInspector({
  node,
  allNodes,
  startNodeId,
  onPatch,
  onRemove,
  onClearEdges,
  onSetStart,
}) {
  if (!node) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a step to edit it
      </div>
    )
  }

  const type = stepType(node.type)
  const isCondition = node.type === 'cond'

  return (
    <div className="flex flex-col h-full bg-card border-l border-border overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: `var(${type.colorVar})` }}
            >
              {type.iconLetter}
            </div>
            <span className="text-sm font-medium text-foreground">{type.label}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Remove
          </Button>
        </div>

        <Input
          placeholder="Step title"
          value={node.title || ''}
          onChange={(e) => onPatch({ title: e.target.value })}
          className="text-sm font-medium"
        />

        <Textarea
          placeholder="Purpose of this step"
          value={node.purpose || ''}
          onChange={(e) => onPatch({ purpose: e.target.value })}
          className="text-sm"
          rows={2}
        />

        <div>
          <label className="text-xs text-muted-foreground">Step type</label>
          <Select value={node.type} onValueChange={(v) => onPatch({ type: v })}>
            <SelectTrigger className="text-sm mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(STEP_TYPES).map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sections. Each carries a mono uppercase heading, as the design draws
          them — without these the inspector is one long undifferentiated
          column of inputs with no way to tell where one concern ends. */}
      <div className="flex-1 overflow-y-auto p-4">
        <SectionLabel>Settings</SectionLabel>
        <Settings node={node} onPatch={onPatch} />

        <SectionLabel>Card content</SectionLabel>
        <CardContent node={node} onPatch={onPatch} />

        {isCondition && (
          <>
            <SectionLabel>Branches</SectionLabel>
            <Branches node={node} onPatch={onPatch} />

            <SectionLabel>Operators</SectionLabel>
            <div className="flex flex-wrap gap-[5px]">
              {OPERATORS.map((op) => (
                <span
                  key={op.value}
                  className="rounded-[5px] border border-[var(--wf-card-border)] bg-card px-[7px] py-[3px] font-mono text-[10.5px] text-[var(--smoke-600)]"
                >
                  {op.label}
                </span>
              ))}
            </div>

            <SectionLabel>Variables</SectionLabel>
            <div className="overflow-hidden rounded-[9px] border border-[var(--wf-card-border)]">
              {VARIABLE_NAMESPACES.map((ns) => (
                <div key={ns.ns} className="border-b border-[var(--wf-rule)] px-[11px] py-[9px] last:border-b-0">
                  <div className="font-mono text-[11px] text-[var(--primary)]">{ns.ns}</div>
                  <div className="mt-[3px] font-mono text-[10px] leading-[1.5] text-[var(--txt-mute)] break-words">
                    {ns.fields}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!isCondition && (
          <>
            <SectionLabel>Outcomes</SectionLabel>
            <Outcomes node={node} allNodes={allNodes} onPatch={onPatch} />
          </>
        )}

        <SectionLabel>Flow control</SectionLabel>
        <FlowControl
          node={node}
          startNodeId={startNodeId}
          onPatch={onPatch}
          onClearEdges={onClearEdges}
          onSetStart={onSetStart}
        />

        <SectionLabel>Ownership</SectionLabel>
        <Ownership node={node} onPatch={onPatch} />
      </div>
    </div>
  )
}
