'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RiskBadge, ApprovalBadge, StatusBadge } from './exception-badges';

const riskOrder = { High: 3, Medium: 2, Low: 1 };
const statusOrder = { Active: 3, Expired: 2, Closed: 1 };

export function ExceptionTable({ exceptions, userRole, onViewDetails }) {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sorted = [...exceptions].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'id':
        return a.id.localeCompare(b.id) * dir;
      case 'riskLevel':
        return (
          ((riskOrder[a.riskLevel] ?? 0) - (riskOrder[b.riskLevel] ?? 0)) * dir
        );
      case 'expiryDate':
        return (
          (new Date(a.expiryDate).getTime() -
            new Date(b.expiryDate).getTime()) *
          dir
        );
      case 'status':
        return (
          ((statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)) * dir
        );
      default:
        return 0;
    }
  });

  const canEdit = userRole === 'Admin' || userRole === 'Compliance Officer';

  function SortableHead({ field, children }) {
    return (
      <TableHead>
        <button
          onClick={() => handleSort(field)}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {children}
          <ArrowUpDown className="size-3.5 text-muted-foreground/60" />
        </button>
      </TableHead>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Eye className="size-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          No exceptions found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No exceptions match your current filters. Try adjusting your search or
          filter criteria.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead field="id">Exception ID</SortableHead>
            <TableHead>Related Policy / Control</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <SortableHead field="riskLevel">Risk Level</SortableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Approved By</TableHead>
            <TableHead>Approval Date</TableHead>
            <SortableHead field="expiryDate">Expiry Date</SortableHead>
            <SortableHead field="status">Status</SortableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((exception) => (
            <TableRow
              key={exception.id}
              className="cursor-pointer group"
              onClick={() => onViewDetails(exception)}
            >
              <TableCell className="font-mono text-sm font-medium text-primary">
                {exception.id}
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  {exception.relatedPolicy}
                </span>
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground line-clamp-2 max-w-[280px] block">
                      {exception.description}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-sm">
                    <p className="text-sm">{exception.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <RiskBadge level={exception.riskLevel} />
              </TableCell>
              <TableCell>
                <ApprovalBadge status={exception.approvalStatus} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {exception.approvedBy ?? (
                  <span className="text-muted-foreground/50">--</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {exception.approvalDate ? (
                  format(new Date(exception.approvalDate), 'MMM dd, yyyy')
                ) : (
                  <span className="text-muted-foreground/50">--</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(exception.expiryDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <StatusBadge status={exception.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(exception);
                      }}
                    >
                      <Eye className="size-4" />
                      View Details
                    </DropdownMenuItem>
                    {canEdit && (
                      <>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Pencil className="size-4" />
                          Edit Exception
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
