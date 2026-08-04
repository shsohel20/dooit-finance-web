"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import CollapsibleSection from "../components/CollapsibleSection";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
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
  IconArrowsExchange,
} from "@tabler/icons-react";
import { dateShowFormat, dateShowFormatWithTime } from "@/lib/utils";

const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

const chartConfig = {
  flagged: { label: "Flagged", color: "var(--danger)" },
  normal: { label: "Normal", color: "var(--muted-foreground)" },
};

// Transaction sender/receiver are PartySchema subdocuments on the API
// ({ name, account, institution, ... }) but plain strings in the mock
// fixtures — never render either straight into JSX.
const partyName = (party) => {
  if (!party) return "";
  if (typeof party === "string") return party;
  return party.name || party.account || party.institution || "";
};

function formatCurrency(amount, currency = "AUD") {
  try {
    return new Intl.NumberFormat("en-AU", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

// Direction is relative to the case's customer: money landing with them is
// IN, money leaving their name as sender is OUT.
function getDirection(txn, customerName) {
  if (!customerName) return "OUT";
  return txn.receiver === customerName ? "IN" : "OUT";
}

export default function TransactionAnalysisSection({ caseData, sectionRef, collapsible = true }) {
  const transactions = caseData?.transactions || [];
  const customerName = caseData?.customer?.name || caseData?.customerName;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortAmt, setSortAmt] = useState(null); // "asc" | "desc" | null

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const dir = getDirection(t, customerName);
        acc[dir === "IN" ? "in" : "out"] += t.amount;
        return acc;
      },
      { in: 0, out: 0 },
    );
  }, [transactions, customerName]);

  const chartData = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      // Mock fixtures use `date`; the API uses `timestamp`.
      const day = String(t.date || t.timestamp || "").slice(0, 10);
      if (!day) return;
      if (!map.has(day)) map.set(day, { date: day, flagged: 0, normal: 0 });
      const entry = map.get(day);
      entry[t.status === "flagged" ? "flagged" : "normal"] += t.amount;
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = transactions.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [
          partyName(t.sender),
          partyName(t.receiver),
          t.country,
          t.id || t.uid,
        ].some((field) => String(field || "").toLowerCase().includes(q));
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
        header: "Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {dateShowFormatWithTime(row.original.date)}
          </span>
        ),
        size: 170,
      },
      {
        id: "direction",
        header: "Direction",
        cell: ({ row }) => {
          const dir = getDirection(row.original, customerName);
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dir === "IN" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
            >
              {dir}
            </span>
          );
        },
        size: 90,
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
          <div className="font-semibold text-heading whitespace-nowrap">
            {formatCurrency(row.original.amount, row.original.currency)}
          </div>
        ),
        size: 150,
      },
      {
        id: "senderReceiver",
        header: "Sender → Receiver",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="text-heading">{partyName(row.original.sender)}</span>
            <IconArrowRight className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-heading">{partyName(row.original.receiver)}</span>
          </div>
        ),
        size: 260,
      },
      {
        id: "country",
        header: "Country",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.country}</span>,
        size: 150,
      },
      {
        id: "channel",
        header: "Payment Channel",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.original.paymentChannel}
          </Badge>
        ),
        size: 150,
      },
      {
        id: "riskIndicator",
        header: "Risk Indicator",
        cell: ({ row }) =>
          row.original.riskIndicator?.length ? (
            <div className="flex flex-wrap gap-1">
              {row.original.riskIndicator.map((r) => (
                <Badge key={r} className="bg-danger/10 text-danger border-danger/20 text-xs" variant="outline">
                  {r}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
        size: 240,
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
        size: 120,
      },
    ],
    [customerName],
  );

  return (
    <CollapsibleSection
      id="transactions"
      title="Suspicious Transaction Analysis"
      icon={IconArrowsExchange}
      badge={transactions.length}
      sectionRef={sectionRef}
      collapsible={collapsible}
      actions={
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            Total in <span className="font-bold text-success">{formatCurrency(totals.in)}</span>
          </span>
          <span className="text-muted-foreground">
            Total out <span className="font-bold text-danger">{formatCurrency(totals.out)}</span>
          </span>
        </div>
      }
    >
      {chartData.length > 0 && (
        <div className="mb-4 rounded-lg border border-border p-3">
          <ChartContainer config={chartConfig} className="aspect-auto h-[160px] w-full">
            <BarChart data={chartData} barCategoryGap={12}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => dateShowFormat(v)}
                fontSize={11}
              />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => dateShowFormat(v)} />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="normal" stackId="a" fill="var(--color-normal)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="flagged" stackId="a" fill="var(--color-flagged)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {flaggedCount > 0 && (
            <Badge className="bg-danger/10 text-danger border-danger/20 text-xs" variant="outline">
              <IconAlertTriangle className="size-3 mr-1" />
              {flaggedCount} flagged
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              className="pl-7 h-8 text-xs w-48"
              placeholder="Search sender, receiver, country..."
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

      {transactions.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No transactions recorded.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <CustomResizableTable
            mainClass="case-transactions-table"
            tableId="case-transactions-table"
            columns={columns}
            data={filtered}
            className="border-0"
          />
        </div>
      )}
    </CollapsibleSection>
  );
}
