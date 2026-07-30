import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

/**
 * Sortable column header. Supports three call styles, all of which are in use:
 *
 * 1. Keyed server-side sort (companies / trusts / customer queue):
 *      sortKey="uid" sortValue={sort} onSort={(key, dir) => ...}
 *    `sortValue` is the active sort string ("uid" | "-uid"). Renders a dropdown.
 *
 * 2. Direction-only server-side sort (transactions list):
 *      onSort={(dir) => handleSort('uid', dir)} sortDirection={'asc'|'desc'|null}
 *    Renders a plain <button> — no Radix dropdown — so dnd-kit drag sensors
 *    don't swallow the click inside the DndContext column headers.
 *    Click behaviour: unsorted → asc → desc → asc → ...
 *
 * 3. No sort props: a cosmetic dropdown (kept for tables that never wired up
 *    sorting). Pass `sortable={false}` for a plain, non-interactive label.
 */
export function DataTableColumnHeader({
  column,
  title,
  className,
  sortKey,
  sortValue,
  onSort,
  sortDirection,
  sortable,
}) {
  const [currentDirection, setCurrentDirection] = useState('asc');

  const isKeyedSortable = !!(sortKey && onSort);
  const isDirectionSortable = !isKeyedSortable && !!onSort;

  // Explicit plain header (no dropdown)
  if (sortable === false && !isKeyedSortable) {
    return (
      <div className={cn('text-xs uppercase font-bold px-2', className)}>{title}</div>
    );
  }

  // ── 1. Keyed server-side sorting ────────────────────────────────────────────
  if (isKeyedSortable) {
    const activeDir =
      sortValue === `-${sortKey}` ? 'desc' : sortValue === sortKey ? 'asc' : null;
    return (
      <div className={cn('flex items-center', className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 hover:bg-transparent hover:text-primary uppercase font-bold',
                activeDir && 'text-primary',
              )}
            >
              <span className="text-xs">{title}</span>
              {activeDir === 'desc' ? (
                <IconArrowDown className="ml-2 size-3" />
              ) : activeDir === 'asc' ? (
                <IconArrowUp className="ml-2 size-3" />
              ) : (
                <ChevronsUpDown className="ml-2 size-3" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onSort(sortKey, 'asc')}>
              <IconArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort(sortKey, 'desc')}>
              <IconArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // ── 2. Direction-only sorting (dnd-safe plain button) ───────────────────────
  if (isDirectionSortable) {
    // cycle: null/desc → asc,  asc → desc
    const handleClick = () => onSort(sortDirection === 'asc' ? 'desc' : 'asc');

    return (
      <div className={cn('flex items-center', className)}>
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1 h-8 px-2 rounded hover:bg-accent hover:text-primary transition-colors uppercase font-bold text-xs"
        >
          {title}
          {sortDirection === 'desc' ? (
            <IconArrowDown className="size-3 text-primary" />
          ) : sortDirection === 'asc' ? (
            <IconArrowUp className="size-3 text-primary" />
          ) : (
            <ChevronsUpDown className="size-3 text-muted-foreground" />
          )}
        </button>
      </div>
    );
  }

  // ── 3. Backward-compatible local-only dropdown (other tables) ──────────────
  return (
    <div className={cn('flex items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 hover:bg-transparent hover:text-primary uppercase font-bold"
          >
            <span className="text-xs">{title}</span>
            {currentDirection === 'desc' ? (
              <IconArrowDown className="ml-2 size-3" />
            ) : currentDirection === 'asc' ? (
              <IconArrowUp className="ml-2 size-3" />
            ) : (
              <ChevronsUpDown className="ml-2 size-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setCurrentDirection('asc')}>
            <IconArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentDirection('desc')}>
            <IconArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
