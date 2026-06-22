"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Download,
  History,
  RotateCcw,
  Send,
  GitCompare,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { editorToHtml, parseToEditorJS } from "@/lib/utils";
import {
  getPolicyById,
  updatePolicy,
  listPolicyVersions,
  restorePolicyVersion,
  diffPolicyVersions,
  savePolicyAsTemplate,
} from "../actions";

const EditorForm = dynamic(
  () => import("@/views/knowledge-hub/policy-hub/policy-form/Editor"),
  { ssr: false },
);

// ── helpers ───────────────────────────────────────────────────────────────────

const triggerBlobDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── skeletons ─────────────────────────────────────────────────────────────────

const DocSkeleton = () => (
  <div className="flex flex-col gap-3 p-6">
    {[...Array(8)].map((_, i) => (
      <Skeleton key={i} className={`h-6 w-${["full", "4/5", "3/5", "full", "4/5", "2/5", "full", "3/5"][i]}`} />
    ))}
  </div>
);

// ── Save-as-Template modal ────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function SaveTemplateModal({ policyId, policyName, onClose }) {
  const [form, setForm] = useState({
    name: `${policyName ?? "Policy"} — Template`,
    description: "",
    tags: "",
    isGlobal: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await savePolicyAsTemplate(policyId, {
        name: form.name.trim(),
        description: form.description.trim(),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isGlobal: form.isGlobal,
      });
      if (res?.success) {
        toast.success("Saved as template");
        onClose();
      } else {
        setError(res?.error || "Failed to save.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Save as Template</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Template Name *</label>
            <input className={inputCls} value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea className={`${inputCls} resize-none h-20`} value={form.description} onChange={set("description")} placeholder="Snapshot description…" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
            <input className={inputCls} value={form.tags} onChange={set("tags")} placeholder="aml, approved" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={form.isGlobal} onChange={(e) => setForm((f) => ({ ...f, isGlobal: e.target.checked }))} className="h-4 w-4 rounded accent-primary" />
            <span className="text-sm text-foreground">Global (visible to all clients)</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Template"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Diff modal ────────────────────────────────────────────────────────────────

function DiffModal({ policyId, versions, onClose }) {
  const [v1, setV1] = useState(versions[1]?.versionNumber ?? 1);
  const [v2, setV2] = useState(versions[0]?.versionNumber ?? 2);
  const [diff, setDiff] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiff = async () => {
    setLoading(true);
    try {
      const res = await diffPolicyVersions(policyId, v1, v2);
      setDiff(res?.data ?? res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (versions.length >= 2) runDiff(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-xl flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="font-semibold text-foreground">Version Diff</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 py-4 flex items-end gap-3 border-b border-border">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">From version</label>
            <select className={inputCls + " w-32"} value={v1} onChange={(e) => setV1(Number(e.target.value))}>
              {versions.map((v) => (
                <option key={v.versionNumber} value={v.versionNumber}>v{v.versionNumber}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">To version</label>
            <select className={inputCls + " w-32"} value={v2} onChange={(e) => setV2(Number(e.target.value))}>
              {versions.map((v) => (
                <option key={v.versionNumber} value={v.versionNumber}>v{v.versionNumber}</option>
              ))}
            </select>
          </div>
          <Button size="sm" onClick={runDiff} disabled={loading}>
            {loading ? "Comparing…" : "Compare"}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
          ) : diff ? (
            <pre className="text-xs font-mono whitespace-pre-wrap text-foreground bg-muted p-4 rounded-lg">
              {typeof diff === "string" ? diff : JSON.stringify(diff, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">Select versions and click Compare.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Version History panel ─────────────────────────────────────────────────────

function VersionPanel({ policyId, currentVersion, onRestore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await listPolicyVersions(policyId);
        setVersions(res?.data ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [policyId]);

  const handleRestore = async (versionNumber) => {
    if (!confirm(`Restore to version ${versionNumber}?`)) return;
    setRestoring(versionNumber);
    try {
      const res = await restorePolicyVersion(policyId, versionNumber);
      if (res?.success) {
        toast.success(`Restored to v${versionNumber}`);
        onRestore();
      } else {
        toast.error("Restore failed");
      }
    } finally {
      setRestoring(null);
    }
  };

  return (
    <>
      {showDiff && versions.length >= 2 && (
        <DiffModal policyId={policyId} versions={versions} onClose={() => setShowDiff(false)} />
      )}
      <div className="w-72 shrink-0 border-l border-border flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </span>
          <div className="flex items-center gap-1">
            {versions.length >= 2 && (
              <Button variant="ghost" size="sm" onClick={() => setShowDiff(true)} title="Diff versions">
                <GitCompare className="h-4 w-4" />
              </Button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : versions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8 px-4">No version history yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {versions.map((v) => {
                const isCurrent = v.versionNumber === currentVersion;
                return (
                  <li key={v.versionNumber} className={`px-4 py-3 space-y-1 ${isCurrent ? "bg-primary/5" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        v{v.versionNumber}
                        {isCurrent && (
                          <span className="text-xs font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">current</span>
                        )}
                      </span>
                      {!isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(v.versionNumber)}
                          disabled={restoring === v.versionNumber}
                          className="h-7 px-2 text-xs"
                        >
                          <RotateCcw className="h-3.5 w-3.5 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                    {v.editReason && (
                      <p className="text-xs text-muted-foreground">{v.editReason}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(v.createdAt)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function PolicyDetails() {
  const id = useSearchParams().get("id");
  const router = useRouter();

  const [data, setData] = useState(null);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [exportLoading, setExportLoading] = useState({ pdf: false, docx: false });

  const loadPolicy = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getPolicyById(id);
      if (response.success) {
        setData(response.data);
        setContent(parseToEditorJS(response.data.docs ?? ""));
      } else {
        toast.error(response.error ?? "Failed to load policy");
      }
    } catch {
      toast.error("Failed to load policy");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { loadPolicy(); }, [loadPolicy]);

  const onSubmit = async (editorData) => {
    try {
      setIsSaving(true);
      const docs = editorToHtml(editorData);
      const payload = {
        docs,
        generatedBy: data?.generatedBy?._id,
        metadata: {
          createdBy: data?.client?.id,
          assignedTo: data?.assignee?._id ?? null,
          tags: [],
        },
        isActive: true,
      };
      const res = await updatePolicy(id, payload);
      if (res.success) {
        toast.success("Policy updated");
        router.push("/dashboard/client/knowledge-hub/policy-hub");
      } else {
        toast.error("Failed to update policy");
      }
    } catch {
      toast.error("Failed to update policy");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPdf = async () => {
    setExportLoading((s) => ({ ...s, pdf: true }));
    try {
      const res = await fetch(`/api/policy-hub/${id}/download`);
      if (res.ok) {
        triggerBlobDownload(await res.blob(), `${data?.metadata?.name ?? "policy"}.pdf`);
      } else {
        toast.error("PDF export failed");
      }
    } finally {
      setExportLoading((s) => ({ ...s, pdf: false }));
    }
  };

  const handleExportDocx = async () => {
    setExportLoading((s) => ({ ...s, docx: true }));
    try {
      const res = await fetch(`/api/policy-hub/${id}/export-docx`);
      if (res.ok) {
        triggerBlobDownload(await res.blob(), `${data?.metadata?.name ?? "policy"}.docx`);
      } else {
        toast.error("DOCX export failed");
      }
    } finally {
      setExportLoading((s) => ({ ...s, docx: false }));
    }
  };

  const policyName = data?.metadata?.name ?? data?.metadata?.documentType ?? "Policy";

  return (
    <>
      {showSaveTemplate && (
        <SaveTemplateModal
          policyId={id}
          policyName={policyName}
          onClose={() => setShowSaveTemplate(false)}
        />
      )}

      <div className="flex flex-col h-full">
        {/* Top action bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            {data && (
              <span className="text-sm font-semibold text-foreground ml-2">{policyName}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline" size="sm"
              onClick={handleExportPdf}
              disabled={exportLoading.pdf || !data}
              className="flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={handleExportDocx}
              disabled={exportLoading.docx || !data}
              className="flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              DOCX
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => setShowSaveTemplate(true)}
              disabled={!data}
              className="flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Save as Template
            </Button>
            <Button
              variant={showVersions ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowVersions((v) => !v)}
              className="flex items-center gap-1.5"
            >
              <History className="h-3.5 w-3.5" />
              History
            </Button>
          </div>
        </div>

        {/* Body: editor + optional version panel */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <DocSkeleton />
            ) : (
              <EditorForm
                data={content}
                onSubmit={onSubmit}
                isSaving={isSaving}
                setData={setContent}
              />
            )}
          </div>

          {showVersions && data && (
            <VersionPanel
              policyId={id}
              currentVersion={data.versionNumber}
              onRestore={loadPolicy}
              onClose={() => setShowVersions(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}
