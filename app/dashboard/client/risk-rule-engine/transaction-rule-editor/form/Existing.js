'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowUpDown, ChevronLeft, ChevronRight,
  Download, Eye, Pencil, Trash2, Upload, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  getAllRules,
  deleteRule,
  toggleRuleActive,
  importRulesCsv,
  exportRulesCsv,
} from '@/app/dashboard/client/risk-rule-engine/rule-configuration/actions'

const BASE_PATH = '/dashboard/client/risk-rule-engine/rule-configuration'

const CASE_TYPES  = ['Fraud', 'AML', 'Compliance', 'TF']
const RISK_LABELS = ['Low', 'Medium', 'High', 'Critical', 'Info']
const STATUSES    = ['draft', 'active', 'paused', 'archived']

const RISK_VARIANT = {
  Critical: 'destructive',
  High:     'destructive',
  Medium:   'secondary',
  Low:      'outline',
  Info:     'outline',
}
const STATUS_VARIANT = {
  active:   'default',
  draft:    'secondary',
  paused:   'secondary',
  archived: 'outline',
}

const EMPTY_FILTERS = {
  search:   '',
  caseType: '',
  riskLabel:'',
  status:   '',
  isActive: '',
}

const SORT_FIELDS = [
  { value: 'createdAt', label: 'Created'    },
  { value: 'ruleId',    label: 'Rule ID'    },
  { value: 'ruleName',  label: 'Name'       },
  { value: 'riskScore', label: 'Risk Score' },
  { value: 'caseType',  label: 'Case Type'  },
  { value: 'status',    label: 'Status'     },
]

const buildQS = (filters, sort, order, page, limit) => {
  const p = new URLSearchParams()
  if (filters.search)   p.set('search',   filters.search)
  if (filters.caseType) p.set('caseType', filters.caseType)
  if (filters.riskLabel)p.set('riskLabel',filters.riskLabel)
  if (filters.status)   p.set('status',   filters.status)
  if (filters.isActive) p.set('isActive', filters.isActive)
  p.set('sort',  sort)
  p.set('order', order)
  p.set('page',  page)
  p.set('limit', limit)
  return p.toString()
}

export default function ExistingRulesPage() {
  const router = useRouter()

  // ── Data ──────────────────────────────────────────────────────────────────
  const [rules,        setRules]        = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages,   setTotalPages]   = useState(1)
  const [loading,      setLoading]      = useState(true)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [pendingDelete, setPendingDelete] = useState(null)
  const [importing,     setImporting]     = useState(false)
  const [exporting,     setExporting]     = useState(false)
  const fileInputRef = useRef(null)

  // ── Filter / sort / page ──────────────────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sort,    setSort]    = useState('createdAt')
  const [order,   setOrder]   = useState('desc')
  const [page,    setPage]    = useState(1)
  const limit = 25

  // Debounce search so we don't fire on every keystroke
  const searchTimer = useRef(null)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchRules = useCallback(async (f, s, o, p) => {
    setLoading(true)
    try {
      const qs = buildQS(f, s, o, p, limit)
      const res = await getAllRules(qs)
      if (!res?.success) {
        toast.error(res?.message || 'Failed to load rules')
        return
      }
      setRules(Array.isArray(res.data) ? res.data : [])
      setTotalRecords(res.totalRecords ?? 0)
      setTotalPages(res.totalPages ?? 1)
    } catch (e) {
      toast.error(e?.message || 'Failed to load rules')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRules(filters, sort, order, page)
  }, [sort, order, page])   // search changes go through the debounced path

  // ── Filter change handlers ────────────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    if (key === 'search') {
      clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => {
        setPage(1)
        fetchRules(next, sort, order, 1)
      }, 400)
    } else {
      setPage(1)
      fetchRules(next, sort, order, 1)
    }
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
    fetchRules(EMPTY_FILTERS, sort, order, 1)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  // ── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = (field) => {
    const nextOrder = sort === field && order === 'desc' ? 'asc' : 'desc'
    setSort(field)
    setOrder(nextOrder)
    setPage(1)
  }

  // ── Row actions ───────────────────────────────────────────────────────────
  const handleToggleActive = async (rule, next) => {
    setRules(prev => prev.map(r => r._id === rule._id ? { ...r, isActive: next } : r))
    const res = await toggleRuleActive(rule._id, next)
    if (!res?.success) {
      toast.error(res?.message || 'Update failed')
      setRules(prev => prev.map(r => r._id === rule._id ? { ...r, isActive: !next } : r))
    }
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete?._id) return
    const res = await deleteRule(pendingDelete._id)
    if (res?.success) {
      toast.success(`Deleted ${pendingDelete.ruleId || 'rule'}`)
      fetchRules(filters, sort, order, page)
    } else {
      toast.error(res?.message || 'Delete failed')
    }
    setPendingDelete(null)
  }

  // ── Import ────────────────────────────────────────────────────────────────
  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setImporting(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await importRulesCsv(fd)
      if (res?.success) {
        const msg =
          `Imported ${res.inserted} new, updated ${res.updated}` +
          (res.skipped    ? `, ${res.skipped} skipped`    : '') +
          (res.autoFilled ? `, ${res.autoFilled} auto-filled` : '')
        toast.success(msg)
        fetchRules(filters, sort, order, 1)
        setPage(1)
      } else {
        toast.error(res?.message || 'Import failed')
      }
    } catch (err) {
      toast.error(err?.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await exportRulesCsv()
      if (res?.success) {
        const bytes = Uint8Array.from(atob(res.data), c => c.charCodeAt(0))
        const blob  = new Blob([bytes], { type: 'text/csv' })
        const url   = URL.createObjectURL(blob)
        const a     = document.createElement('a')
        a.href      = url
        a.download  = res.filename || 'rule-engine.csv'
        a.click()
        URL.revokeObjectURL(url)
      } else {
        toast.error(res?.message || 'Export failed')
      }
    } catch (err) {
      toast.error(err?.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  // ── Sortable column header ────────────────────────────────────────────────
  const SortHeader = ({ field, label }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sort === field ? 'text-foreground' : 'opacity-40'}`} />
      </span>
    </th>
  )

  return (
    <div className="space-y-3">

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Input
            placeholder="Search by name, ID, description…"
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="h-8 text-xs pr-7"
          />
          {filters.search && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => handleFilterChange('search', '')}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Case Type */}
        <Select value={filters.caseType} onValueChange={v => handleFilterChange('caseType', v === '__all' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue placeholder="Case Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all" className="text-xs text-muted-foreground">All types</SelectItem>
            {CASE_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Risk Label */}
        <Select value={filters.riskLabel} onValueChange={v => handleFilterChange('riskLabel', v === '__all' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue placeholder="Risk Label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all" className="text-xs text-muted-foreground">All labels</SelectItem>
            {RISK_LABELS.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={filters.status} onValueChange={v => handleFilterChange('status', v === '__all' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs w-[110px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all" className="text-xs text-muted-foreground">All statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Active */}
        <Select value={filters.isActive} onValueChange={v => handleFilterChange('isActive', v === '__all' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs w-[100px]">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all"  className="text-xs text-muted-foreground">All</SelectItem>
            <SelectItem value="true"   className="text-xs">Active</SelectItem>
            <SelectItem value="false"  className="text-xs">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={clearFilters}>
            <X className="w-3 h-3" /> Clear
          </Button>
        )}

        <div className="flex-1" />

        {/* Sort */}
        <Select value={sort} onValueChange={v => { setSort(v); setPage(1); fetchRules(filters, v, order, 1) }}>
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_FIELDS.map(f => <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant="outline" size="sm" className="h-8 w-8 p-0"
          title={order === 'desc' ? 'Descending' : 'Ascending'}
          onClick={() => {
            const next = order === 'desc' ? 'asc' : 'desc'
            setOrder(next); setPage(1); fetchRules(filters, sort, next, 1)
          }}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </Button>

        {/* Import / Export */}
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
        <Button
          variant="outline" size="sm" className="h-8 gap-1.5 text-xs"
          disabled={importing}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-3.5 h-3.5" />
          {importing ? 'Importing…' : 'Import'}
        </Button>
        <Button
          variant="outline" size="sm" className="h-8 gap-1.5 text-xs"
          disabled={exporting || !totalRecords}
          onClick={handleExport}
        >
          <Download className="w-3.5 h-3.5" />
          {exporting ? 'Exporting…' : 'Export'}
        </Button>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <SortHeader field="ruleId"    label="ID"     />
              <SortHeader field="ruleName"  label="Name"   />
              <SortHeader field="caseType"  label="Case"   />
              <SortHeader field="riskScore" label="Risk"   />
              <SortHeader field="status"    label="Status" />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Active</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : !rules.length ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  {hasFilters ? 'No rules match the current filters.' : 'No rules yet.'}
                </td>
              </tr>
            ) : rules.map((rule) => (
              <tr key={rule._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {rule.ruleId}
                </td>
                <td className="px-4 py-3 max-w-[240px]">
                  <div className="font-medium leading-tight truncate">{rule.ruleName}</div>
                  {rule.mainDomain && (
                    <div className="text-xs text-muted-foreground mt-0.5">{rule.mainDomain}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">{rule.caseType}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={RISK_VARIANT[rule.riskLabel] || 'outline'} className="text-xs px-1.5 py-0">
                      {rule.riskLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{rule.riskScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[rule.status] || 'secondary'} className="text-xs px-1.5 py-0 capitalize">
                    {rule.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={!!rule.isActive}
                    onCheckedChange={v => handleToggleActive(rule, v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="View"
                      onClick={() => router.push(`${BASE_PATH}/${rule._id}`)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit"
                      onClick={() => router.push(`${BASE_PATH}/${rule._id}/edit`)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete"
                      onClick={() => setPendingDelete(rule)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {totalRecords} rule{totalRecords !== 1 ? 's' : ''}
          {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ''}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              disabled={page <= 1 || loading}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            {/* Page numbers — show at most 7 around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .reduce((acc, n, i, arr) => {
                if (i > 0 && n - arr[i - 1] > 1) acc.push('…')
                acc.push(n)
                return acc
              }, [])
              .map((n, i) =>
                n === '…' ? (
                  <span key={`e${i}`} className="px-1">…</span>
                ) : (
                  <Button
                    key={n}
                    variant={n === page ? 'default' : 'outline'}
                    size="icon"
                    className="h-7 w-7 text-xs"
                    onClick={() => setPage(n)}
                    disabled={loading}
                  >
                    {n}
                  </Button>
                )
              )}
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Delete confirm dialog ─────────────────────────────────────────── */}
      <AlertDialog open={!!pendingDelete} onOpenChange={o => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{pendingDelete?.ruleId}</strong> — {pendingDelete?.ruleName}
              <br />
              This cannot be undone. Any alerts that referenced this rule will lose their backing definition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
