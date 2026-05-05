'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconEye, IconEdit } from '@tabler/icons-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDateTime } from '@/lib/utils';

const COLS = ['Title', 'Type', 'Priority', 'Status', 'Assigned To', 'Updated', 'Actions'];

function SkeletonRow() {
  return (
    <tr>
      {COLS.map((c) => (
        <td key={c} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function CaseTable({ cases, loading }) {
  const router = useRouter();

  const go = (path) => router.push(path);

  return (
    <div className="overflow-x-auto rounded-md border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
          <tr>
            {COLS.map((col) => (
              <th key={col} className="px-4 py-3 text-left font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : cases.length === 0
            ? (
              <tr>
                <td colSpan={COLS.length} className="py-12 text-center text-muted-foreground">
                  No cases found.
                </td>
              </tr>
            )
            : cases.map((c) => (
              <tr
                key={c._id}
                className="cursor-pointer transition-colors hover:bg-muted/10"
                onClick={() => go(`/dashboard/client/case-management/${c._id}`)}
              >
                {/* Title */}
                <td className="max-w-[200px] px-4 py-3">
                  <p className="truncate font-medium text-heading">{c.title}</p>
                  {c.description && (
                    <p className="truncate text-xs text-muted-foreground">{c.description}</p>
                  )}
                </td>

                {/* Type */}
                <td className="px-4 py-3 text-xs font-mono">{c.type}</td>

                {/* Priority */}
                <td className="px-4 py-3">
                  <PriorityBadge priority={c.priority} />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>

                {/* Assigned To */}
                <td className="px-4 py-3">
                  <div className="flex -space-x-2">
                    {(c.assignedTo || []).slice(0, 4).map((u) => (
                      <Avatar key={u._id} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback className="text-[8px]">
                          {u.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {(c.assignedTo?.length ?? 0) > 4 && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-muted text-[9px]">
                        +{c.assignedTo.length - 4}
                      </span>
                    )}
                    {(c.assignedTo?.length ?? 0) === 0 && (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </td>

                {/* Updated */}
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {formatDateTime(c.updatedAt)?.date}
                  <br />
                  <span className="text-[11px]">{formatDateTime(c.updatedAt)?.time}</span>
                </td>

                {/* Actions — stop row click propagation */}
                <td
                  className="px-4 py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => go(`/dashboard/client/case-management/${c._id}`)}
                      >
                        <IconEye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => go(`/dashboard/client/case-management/${c._id}/edit`)}
                      >
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
