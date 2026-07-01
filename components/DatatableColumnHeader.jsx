// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   CaretSortIcon,
//   EyeNoneIcon,
// } from "@radix-ui/react-icons";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  IconArrowDown,
  IconArrowUp,
  IconCaretUpDown,
  IconEyeOff,
} from '@tabler/icons-react';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export function DataTableColumnHeader({
  column,
  title,
  className,
  // Server-side sorting (opt-in). When `sortKey` + `onSort` are provided the
  // dropdown drives the parent's sort state. `sortValue` is the active sort
  // string (e.g. "-createdAt"). Pass `sortable={false}` to render a plain,
  // non-interactive header.
  sortKey,
  sortValue,
  onSort,
  sortable,
}) {
  const [currentDirection, setCurrentDirection] = useState('asc');

  const isServerSortable = !!(sortKey && onSort);

  // Explicit plain header (no dropdown)
  if (sortable === false && !isServerSortable) {
    return (
      <div className={cn('text-xs uppercase font-bold px-2', className)}>{title}</div>
    );
  }

  // ── Functional server-side sorting ──────────────────────────────────────────
  if (isServerSortable) {
    const activeDir =
      sortValue === `-${sortKey}` ? 'desc' : sortValue === sortKey ? 'asc' : null;
    return (
      <div className={cn('flex items-center  ', className)}>
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

  // ── Backward-compatible local-only dropdown (other tables) ──────────────────
  const handleDirectionChange = (direction) => {
    setCurrentDirection(direction);
  };

  return (
    <div className={cn('flex items-center  ', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 hover:bg-transparent hover:text-primary uppercase font-bold"
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
          <DropdownMenuItem onClick={() => handleDirectionChange('asc')}>
            <IconArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDirectionChange('desc')}>
            <IconArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
