"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconSearch,
  IconArrowRight,
  IconAlertTriangle,
  IconCircleCheck,
  IconArrowsSort,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime } from "@/lib/utils";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(amount);
}

export default function TransactionsTab({ caseData }) {
  const transactions = caseData?.transactions || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortAmt, setSortAmt] = useState(null); // "asc" | "desc" | null

  const filtered = useMemo(() => {
    let list = transactions.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.sender.toLowerCase().includes(q) ||
          t.receiver.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortAmt === "asc") list = [...list].sort((a, b) => a.amount - b.amount);
    if (sortAmt === "desc") list = [...list].sort((a, b) => b.amount - a.amount);

    return list;
  }, [transactions, search, statusFilter, sortAmt]);

  const toggleSort = () => {
    setSortAmt((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
  };

  const flaggedCount = transactions.filter((t) => t.status === "flagged").length;

  if (transactions.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No transactions recorded.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            Transactions ({transactions.length})
            {flaggedCount > 0 && (
              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs" variant="outline">
                <IconAlertTriangle className="size-3 mr-1" />
                {flaggedCount} flagged
              </Badge>
            )}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                className="pl-7 h-8 text-xs w-44"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs uppercase tracking-wide">
                <TableHead className="w-28">Transaction ID</TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-heading transition-colors"
                    onClick={toggleSort}
                  >
                    Amount
                    <IconArrowsSort className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead>Sender → Receiver</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((txn) => (
                <TableRow
                  key={txn.id}
                  className={cn(
                    "text-sm transition-colors",
                    txn.status === "flagged" && "bg-red-50/50 hover:bg-red-50",
                  )}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {txn.id}
                  </TableCell>
                  <TableCell className="font-semibold text-heading">
                    {formatCurrency(txn.amount)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {txn.currency}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-heading">{txn.sender}</span>
                      <IconArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="text-heading">{txn.receiver}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{txn.location}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {dateShowFormatWithTime(txn.date)}
                  </TableCell>
                  <TableCell>
                    {txn.status === "flagged" ? (
                      <StatusPill icon={<IconAlertTriangle />} variant="danger">
                        Flagged
                      </StatusPill>
                    ) : (
                      <StatusPill icon={<IconCircleCheck />} variant="success">
                        Normal
                      </StatusPill>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions match filters.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
