"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsage, reverseUsage } from "@/app/dashboard/client/billing/actions";
import { money } from "../plans/planFormat";

const STATUS_TINT = {
  recorded: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  billed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  excluded: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  reversed: "bg-slate-400/15 text-slate-500 line-through dark:text-slate-400",
};

const fmt = (d) =>
  d ? new Date(d).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" }) : "—";

/**
 * Individual usage records behind one product row.
 *
 * dooit can reverse a record here — the one correction path in the module.
 * A reversal APPENDS a negative record; the original is never edited, so every
 * invoice that already included it still reproduces.
 */
export default function RecordsDrawer({
  open,
  onOpenChange,
  product,
  periodKey,
  isDooit,
  // The account the page is filtered to, or null for all. Passed through so the
  // drawer cannot contradict the summary it was opened from — drilling into a
  // product while scoped to one customer must not list everyone's records.
  user = null,
  onChanged,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    if (!product) return;
    setLoading(true);
    const res = await getUsage({
      productCode: product.productCode,
      periodKey,
      limit: 100,
      status: "all",
      ...(user ? { user } : {}),
    });
    if (res.ok) setRows(res.data || []);
    else toast.error(res.error || "Could not load usage records");
    setLoading(false);
  }, [product, periodKey, user]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const onReverse = async (row) => {
    setBusyId(row._id);
    const res = await reverseUsage(row._id, "Corrected from the usage page");
    setBusyId(null);
    if (!res.ok) return toast.error(res.error || "Could not reverse");
    toast.success("Reversal recorded", { description: res.meta?.note });
    load();
    onChanged?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[820px]">
        <DialogHeader>
          <DialogTitle>{product?.productName}</DialogTitle>
          <DialogDescription>
            Individual records for {periodKey}. Corrections are appended as reversing
            records — nothing here is ever edited in place.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col gap-2 py-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-[#9aa0a8]">
            No records for this product in {periodKey}.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase text-[#98a0ab]">
                  When
                </TableHead>
                <TableHead className="w-[150px] text-[11px] font-bold uppercase text-[#98a0ab]">
                  Applicant
                </TableHead>
                <TableHead className="w-[70px] text-right text-[11px] font-bold uppercase text-[#98a0ab]">
                  Qty
                </TableHead>
                <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase text-[#98a0ab]">
                  Amount
                </TableHead>
                <TableHead className="w-[100px] text-center text-[11px] font-bold uppercase text-[#98a0ab]">
                  Status
                </TableHead>
                {isDooit && <TableHead className="w-[110px]" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id} className="border-t border-[#f4f5f7]">
                  <TableCell className="text-[12.5px] text-[#6b7280]">
                    {fmt(r.usageDate)}
                    {r.isLate && (
                      <span className="ml-1.5 rounded bg-amber-500/15 px-1 py-[1px] text-[9.5px] font-bold uppercase text-amber-700">
                        late
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="truncate font-mono text-[11px] text-[#9aa0a8]">
                    {r.applicantKey || "—"}
                  </TableCell>
                  <TableCell className="text-right text-[12.5px] tabular-nums">
                    {r.quantity}
                  </TableCell>
                  <TableCell className="text-right text-[12.5px] font-bold tabular-nums">
                    {money(r.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                        STATUS_TINT[r.status] || ""
                      }`}
                    >
                      {r.status}
                    </span>
                  </TableCell>
                  {isDooit && (
                    <TableCell className="text-right">
                      {/* A reversal cannot itself be reversed, and an already
                          reversed record cannot be reversed twice. */}
                      {!r.reversalOf && r.status !== "reversed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={busyId === r._id}
                          onClick={() => onReverse(r)}
                        >
                          {busyId === r._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Undo2 className="size-3.5" />
                          )}
                          Reverse
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
