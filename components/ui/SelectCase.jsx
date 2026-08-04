'use client';

import { useEffect, useState } from 'react';
import { getCases } from '@/app/dashboard/client/monitoring-and-cases/case-manager/actions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IconLoader2 } from '@tabler/icons-react';
import { Label } from './label';
import { Button } from './button';

/**
 * Picks the investigation Case a report attaches to.
 *
 * Distinct from SelectCaseList, which despite the name lists *Alerts* by uid.
 * The value is the Case `_id`, which resolveCaseLinkage on the API accepts
 * directly. There is deliberately no "create new" affordance — a Case is
 * opened from the Case Manager, never invented on a report form.
 */
export default function SelectCase({
  label = 'Case',
  value,
  onChange,
  error,
  disabled,
}) {
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = page < pages;

  useEffect(() => {
    let cancelled = false;
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await getCases({ page, limit: 20 });
        if (cancelled || !res?.succeed) return;
        const mapped = (res.data || []).map((c) => ({
          value: c._id,
          label: c.uid ? `${c.uid} — ${c.title || 'Untitled'}` : c.title || c._id,
          status: c.status,
        }));
        setOptions((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
        setPages(res.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to load cases', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPage();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // An already-linked case (edit mode) may sit outside the loaded page — keep it
  // selectable so the trigger shows a label instead of the placeholder.
  const merged =
    value?.value && !options.some((o) => o.value === value.value)
      ? [value, ...options]
      : options;

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Select
        disabled={disabled}
        value={value?.value || ''}
        onValueChange={(v) => onChange(merged.find((o) => o.value === v) || null)}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? 'Loading cases…' : 'Select a case'} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {merged.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-3">
              {loading ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  <span className="text-xs text-muted-foreground">Loading…</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No cases found</span>
              )}
            </div>
          ) : (
            <SelectGroup>
              <SelectLabel>Cases</SelectLabel>
              {merged.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {hasMore && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => p + 1);
                  }}
                >
                  {loading ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    'Load more'
                  )}
                </Button>
              )}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
