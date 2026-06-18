"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Loader2,
  UserCheck,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { getAllAssessments } from "@/app/dashboard/client/risk-assessment/actions";
import { CraWizard } from "./cra/cra-wizard";
import { CraDetailDialog } from "./cra/cra-detail-dialog";
import { RISK_BADGE_VARIANT } from "./cra/constants";

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CustomerRiskAssessment() {
  const [view, setView] = useState("list"); // 'list' | 'new'
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [detailId, setDetailId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getAllAssessments();
      // advancedResults → { success, data: [...] } ; tolerate either shape
      setAssessments(r?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = (id) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  const handleSaved = (saved) => {
    setView("list");
    load();
    if (saved?._id) openDetail(saved._id);
  };

  const filtered = assessments.filter((a) => {
    const matchesRisk = !riskFilter || a.riskLabel === riskFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.customerName?.toLowerCase().includes(q) ||
      a.uid?.toLowerCase().includes(q) ||
      a.inputSnapshot?.country?.toLowerCase().includes(q);
    return matchesRisk && matchesSearch;
  });

  if (view === "new") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView("list")}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Assessments
        </Button>
        <CraWizard onSaved={handleSaved} onCancel={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" /> Customer Risk Assessments
              </CardTitle>
              <CardDescription>
                CRA V2 — entity-scoped products, PEP/SOF/SOW/adverse-media scoring, automatic ECDD
                gate and audit trail.
              </CardDescription>
            </div>
            <Button onClick={() => setView("new")}>
              <Plus className="w-4 h-4 mr-2" /> New Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, UID, jurisdiction…"
                className="pl-10"
              />
            </div>
            <div className="flex gap-1.5">
              {["", "Low", "Medium", "High", "Unacceptable"].map((r) => (
                <Button
                  key={r || "all"}
                  variant={riskFilter === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRiskFilter(r)}
                >
                  {r || "All"}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No assessments found.</p>
              <Button variant="outline" onClick={() => setView("new")}>
                Create your first assessment
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>ECDD</TableHead>
                  <TableHead>Assessed</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow
                    key={a._id}
                    className="cursor-pointer"
                    onClick={() => openDetail(a._id)}
                  >
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {a.uid}
                    </TableCell>
                    <TableCell className="font-medium">{a.customerName || "—"}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {a.inputSnapshot?.type || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.inputSnapshot?.country || "—"}
                    </TableCell>
                    <TableCell className="text-center font-bold">{a.riskScore ?? "—"}</TableCell>
                    <TableCell>
                      {a.riskLabel ? (
                        <Badge variant={RISK_BADGE_VARIANT[a.riskLabel]}>{a.riskLabel}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {a.cddGate && a.ecddStatus !== "Approved" ? (
                        <span className="flex items-center gap-1 text-[11px] text-danger font-medium">
                          <Lock className="w-3 h-3" /> {a.ecddStatus || "Pending"}
                        </span>
                      ) : a.ecddStatus === "Approved" ? (
                        <span className="text-[11px] text-success">Approved</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">
                      {fmtDate(a.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(a._id);
                        }}
                      >
                        View →
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CraDetailDialog
        assessmentId={detailId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onChanged={load}
      />
    </div>
  );
}
