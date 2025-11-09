import ResizableTable from "@/components/ui/Resizabletable";
import React from "react";

export default function InvestigationPanel() {
  const data = [
    {
      date: "2025-01-01",
      description: "Description of the investigation",
      counterparty: "Global Trading Co.",
      amount: "1000",
      status: "Pending",
      risk: "High",
    },
    {
      date: "2025-01-01",
      description: "Description of the investigation",
      counterparty: "Counterparty name",
      amount: "1000",
      status: "Pending",
      risk: "High",
    },
  ];
  const columns = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Counterparty",
      accessorKey: "counterparty",
    },
    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Risk",
      accessorKey: "risk",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="border-b border-border bg-card">
        <div className="mx-auto   pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Investigation Panel
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage investigation details
          </p>
        </div>
      </div>
      <div>
        <ResizableTable columns={columns} data={data} />
      </div>
    </div>
  );
}
