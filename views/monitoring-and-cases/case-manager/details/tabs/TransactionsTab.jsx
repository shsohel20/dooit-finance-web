"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
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
  IconSearch,
  IconArrowRight,
  IconAlertTriangle,
  IconCircleCheck,
  IconArrowsSort,
} from "@tabler/icons-react";
import { dateShowFormatWithTime } from "@/lib/utils";

const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

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

  const flaggedCount = transactions.filter((t) => t.status === "flagged").length;
  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "Transaction ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>
        ),
        size: 160,
      },
      {
        id: "amount",
        header: () => (
          <button
            className="flex items-center gap-1 hover:text-heading transition-colors"
            onClick={() =>
              setSortAmt((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null))
            }
          >
            Amount
            <IconArrowsSort className="size-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-heading">
            {formatCurrency(row.original.amount)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {row.original.currency}
            </span>
          </div>
        ),
        size: 160,
      },
      {
        id: "senderReceiver",
        header: "Sender → Receiver",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="text-heading">{row.original.sender}</span>
            <IconArrowRight className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-heading">{row.original.receiver}</span>
          </div>
        ),
        size: 260,
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
        size: 160,
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {dateShowFormatWithTime(row.original.date)}
          </span>
        ),
        size: 180,
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.status === "flagged" ? (
            <StatusPill icon={<IconAlertTriangle />} variant="danger">
              Flagged
            </StatusPill>
          ) : (
            <StatusPill icon={<IconCircleCheck />} variant="success">
              Normal
            </StatusPill>
          ),
        size: 140,
      },
    ],
    [],
  );

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
    <Card className="border-0">
      <CardHeader className="p-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 px-0">
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
          <CustomResizableTable
            mainClass="case-transactions-table"
            tableId="case-transactions-table"
            columns={columns}
            data={filtered}
            className="border-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
