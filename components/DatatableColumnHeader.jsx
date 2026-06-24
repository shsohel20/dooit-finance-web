import { cn } from '@/lib/utils';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { ChevronsUpDown } from 'lucide-react';

/**
 * Server-side sortable column header.
 *
 * Props:
 *   title         — header label
 *   className     — optional extra classes
 *   onSort        — (direction: 'asc' | 'desc') => void
 *   sortDirection — 'asc' | 'desc' | null  (null = this column is not the active sort)
 *
 * Click behaviour: unsorted → asc → desc → asc → ...
 * Uses a plain <button> (no Radix dropdown) so dnd-kit drag sensors don't
 * interfere with the click event inside the DndContext column headers.
 */
export function DataTableColumnHeader({ column, title, className, onSort, sortDirection }) {
  const handleClick = () => {
    if (!onSort) return;
    // cycle: null/desc → asc,  asc → desc
    onSort(sortDirection === 'asc' ? 'desc' : 'asc');
  };

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
