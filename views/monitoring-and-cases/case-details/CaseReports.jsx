"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import ResizableTable from "@/components/ui/Resizabletable";
import useAlertStore from "@/app/store/alerts";
import { getCaseReports } from "@/app/dashboard/client/monitoring-and-cases/case-list/actions";

// Report type → display label. Order drives the summary strip + table grouping.
const TYPE_LABELS = {
  ecdd: "ECDD",
  smr: "SMR",
  ttr: "TTR",
  ifti: "IFTI",
  gfs: "GFS",
  rfi: "RFI",
};

// Map any report status string → StatusPill variant (statuses differ per model).
const statusVariant = (status = "") => {
  const s = String(status).toLowerCase();
  if (["approved", "active", "closed", "completed", "submitted"].includes(s)) return "success";
  if (["review", "pending followup", "pending review", "sent"].includes(s)) return "info";
  if (["final notice", "blocked", "rejected", "inactive"].includes(s)) return "danger";
  if (["draft", "pending", "new"].includes(s)) return "muted";
  return "outline";
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

export default function CaseReports() {
  const { details } = useAlertStore();
  // The Case List detail is an Alert; reports hang off the escalated Case.
  const caseId = details?.linkedCase?._id || details?.linkedCase || null;

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!caseId) return;
    let active = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await getCaseReports(caseId);
        if (!active) return;
        if (res?.succeed) {
          const data = res.data || {};
          const flat = Object.keys(TYPE_LABELS).flatMap((key) =>
            (data[key] || []).map((doc) => ({ ...doc, _type: key }))
          );
          flat.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRows(flat);
          setSummary(res.summary || null);
        }
      } catch (e) {
        console.error("Failed to load case reports", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [caseId]);

  const columns = [
    {
      header: "Type",
      accessorKey: "_type",
      cell: ({ row }) => <Badge variant="outline">{TYPE_LABELS[row.original._type]}</Badge>,
    },
    {
      header: "Report ID",
      accessorKey: "uid",
      cell: ({ row }) => <span className="font-medium">{row.original.uid || "—"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <StatusPill variant={statusVariant(row.original.status)}>
          {row.original.status || "—"}
        </StatusPill>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => <span>{fmtDate(row.original.createdAt)}</span>,
    },
  ];

  if (!caseId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No case linked yet</p>
          <p className="max-w-md text-sm text-muted-foreground">
            This alert hasn’t been escalated to a case, so there are no linked compliance reports.
            Escalate the alert to a case to file ECDD, SMR, TTR, IFTI, GFS or RFI reports against it.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary strip — per-type counts + derived SAR status */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-2 text-lg font-semibold">Linked Reports</h2>
        {Object.keys(TYPE_LABELS).map((key) => (
          <StatusPill key={key} variant={summary?.counts?.[key] ? "info" : "muted"}>
            {TYPE_LABELS[key]}: {summary?.counts?.[key] || 0}
          </StatusPill>
        ))}
        <StatusPill variant={summary?.sarFiled ? "success" : "muted"}>
          {summary?.sarFiled ? "SAR Filed" : "No SAR Filed"}
        </StatusPill>
      </div>

      <Card>
        <CardContent className="p-2">
          <div className="overflow-x-auto">
            <ResizableTable columns={columns} data={rows} loading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
