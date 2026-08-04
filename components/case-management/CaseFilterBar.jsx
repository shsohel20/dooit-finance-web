'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCaseMgmtStore } from '@/app/store/useCaseMgmtStore';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'under_investigation', label: 'Under Investigation' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'closed', label: 'Closed' },
  { value: 'escalated', label: 'Escalated' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

export default function CaseFilterBar() {
  const { filters, setFilter, resetFilters } = useCaseMgmtStore();

  const hasActiveFilters = Object.entries(filters).some(
    ([key, val]) => !['sortBy', 'sortOrder'].includes(key) && val !== ''
  );

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Status */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(v) => setFilter('priority', v === 'all' ? '' : v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {PRIORITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input
            type="date"
            className="h-8 text-xs"
            value={filters.startDate}
            onChange={(e) => setFilter('startDate', e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input
            type="date"
            className="h-8 text-xs"
            value={filters.endDate}
            onChange={(e) => setFilter('endDate', e.target.value)}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(v) => setFilter('sortBy', v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Order</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(v) => setFilter('sortOrder', v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 gap-1 text-xs text-muted-foreground">
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
