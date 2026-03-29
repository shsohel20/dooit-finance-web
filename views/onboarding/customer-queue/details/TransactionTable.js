"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

/** Fictional dummy rows for UI / onboarding demos only. */
const DUMMY_TRANSACTIONS = [
  {
    id: "TXN-DMY-24089",
    date: "2025-01-14",
    description: "Incoming wire — family trust settlement",
    counterparty: "Prime Bank PLC (Gulshan)",
    direction: "Credit",
    amount: "৳ 4,250,000.00",
    status: "Posted",
  },
  {
    id: "TXN-DMY-24091",
    date: "2025-01-12",
    description: "Charitable foundation disbursement",
    counterparty: "Shikkha Sheba Foundation",
    direction: "Debit",
    amount: "৳ 1,800,000.00",
    status: "Posted",
  },
  {
    id: "TXN-DMY-24094",
    date: "2025-01-08",
    description: "FX conversion USD → BDT",
    counterparty: "Bangladesh Bank nostro",
    direction: "Credit",
    amount: "৳ 12,340,500.00",
    status: "Posted",
  },
  {
    id: "TXN-DMY-24102",
    date: "2024-12-22",
    description: "Property management — Dhanmondi lease",
    counterparty: "Urban Estates Ltd.",
    direction: "Credit",
    amount: "৳ 385,000.00",
    status: "Posted",
  },
  {
    id: "TXN-DMY-24105",
    date: "2024-12-18",
    description: "International transfer (flagged for review)",
    counterparty: "Geneva Holdings SA",
    direction: "Debit",
    amount: "CHF 220,000.00",
    status: "Under review",
  },
  {
    id: "TXN-DMY-24111",
    date: "2024-12-05",
    description: "Royalty — book publication",
    counterparty: "Prothoma Prokashoni",
    direction: "Credit",
    amount: "৳ 2,150,000.00",
    status: "Posted",
  },
  {
    id: "TXN-DMY-24118",
    date: "2024-11-30",
    description: "Card payment — diplomatic travel",
    counterparty: "Singapore Airlines",
    direction: "Debit",
    amount: "SGD 8,420.00",
    status: "Posted",
  },
];

const ACCOUNT_LABEL = "Sheikh Hasina — account";

export default function TransactionTable() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-50 flex flex-col justify-end pointer-events-none",
      )}
      aria-label="Transaction drawer"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto w-full max-w-[min(100%,1200px)] border-t border-x border-border bg-background/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.12)]  transition-[max-height] duration-300 ease-out",
          expanded ? "max-h-[min(70vh,640px)]" : "max-h-[52px]",
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-between gap-3 px-4 py-1 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="size-2" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">Transactions</p>
              {/* <p className="truncate text-xs text-muted-foreground">{ACCOUNT_LABEL}</p> */}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
            <span className="hidden text-xs sm:inline">
              {expanded ? "Tap to collapse" : "Tap to expand"}
            </span>
            {expanded ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
          </div>
        </button>

        <div
          className={cn(
            "overflow-hidden border-t border-border transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0 pointer-events-none h-0 border-0",
          )}
        >
          <div className="max-h-[min(calc(70vh-52px),588px)] overflow-auto px-4 pb-4">
            <p className="py-2 text-xs text-muted-foreground">financial records.</p>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-[1] bg-muted/95 backdrop-blur-sm">
                <tr>
                  <th className="p-2 text-left font-medium">Reference</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium hidden md:table-cell">Description</th>
                  <th className="p-2 text-left font-medium hidden lg:table-cell">Counterparty</th>
                  <th className="p-2 text-center font-medium">Dir.</th>
                  <th className="p-2 text-right font-medium">Amount</th>
                  <th className="p-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_TRANSACTIONS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 transition-colors hover:bg-secondary/40"
                  >
                    <td className="p-2 font-mono text-xs text-muted-foreground">{row.id}</td>
                    <td className="p-2 whitespace-nowrap">{row.date}</td>
                    <td
                      className="p-2 hidden md:table-cell max-w-[200px] truncate"
                      title={row.description}
                    >
                      {row.description}
                    </td>
                    <td
                      className="p-2 hidden lg:table-cell max-w-[180px] truncate"
                      title={row.counterparty}
                    >
                      {row.counterparty}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-xs font-medium",
                          row.direction === "Credit"
                            ? "bg-success/15 text-success"
                            : "bg-muted text-foreground",
                        )}
                      >
                        {row.direction}
                      </span>
                    </td>
                    <td className="p-2 text-right tabular-nums whitespace-nowrap">{row.amount}</td>
                    <td className="p-2 text-right">
                      <span
                        className={cn(
                          "text-xs",
                          row.status === "Under review"
                            ? "text-warning-foreground font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
