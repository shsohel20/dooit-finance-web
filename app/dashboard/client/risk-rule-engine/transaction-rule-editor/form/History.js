'use client'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getAllRules } from '@/app/dashboard/client/risk-rule-engine/rule-configuration/actions'

const STATUS_VARIANT = {
  active: 'default',
  draft: 'secondary',
  paused: 'secondary',
  archived: 'outline',
}

const fmtDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

const resolveUser = (ref) => {
  if (!ref) return '—'
  if (typeof ref === 'object') return ref.name || ref.email || String(ref._id || '—')
  return String(ref)
}

export default function ChangeHistory() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await getAllRules()
        if (!cancelled) {
          const data = Array.isArray(res?.data) ? res.data : []
          setRules(data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
        }
      } catch (e) {
        if (!cancelled) toast.error(e?.message || 'Failed to load history')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rules
    return rules.filter((r) =>
      r.ruleId?.toLowerCase().includes(q) ||
      r.ruleName?.toLowerCase().includes(q) ||
      resolveUser(r.updatedBy).toLowerCase().includes(q)
    )
  }, [rules, search])

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search by rule ID, name, or editor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading history…</p>
      ) : !filtered.length ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No results.</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Rule ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Version</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Modified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Updated By</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((rule) => (
                <tr key={rule._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{rule.ruleId}</td>
                  <td className="px-4 py-3 font-medium">{rule.ruleName}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                      v{rule.version ?? 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={STATUS_VARIANT[rule.status] || 'secondary'}
                      className="text-xs px-1.5 py-0 capitalize"
                    >
                      {rule.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {fmtDate(rule.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {resolveUser(rule.updatedBy)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        Showing {filtered.length} of {rules.length} rule{rules.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
