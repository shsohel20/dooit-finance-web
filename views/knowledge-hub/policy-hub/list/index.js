"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Eye,
  Download,
  Trash2,
  FileUp,
  Plus,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";

import {
  deletePolicyHub,
  getAllPolicyDocumentsPaginated,
  importPolicyHubFromDocx,
  savePolicyAsTemplate,
} from "@/app/dashboard/client/knowledge-hub/policy-hub/actions";
import AfcDocumentsList from "./AfcDocumentsList";
import DocumentTypeSelect from "@/components/ui/DocumentTypeSelect";
import TemplatesList from "./TemplatesList";

// ── helpers ───────────────────────────────────────────────────────────────────

const getId = (doc) => {
  const raw = doc?._id ?? doc?.id;
  return raw ? String(raw) : null;
};

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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── skeleton ──────────────────────────────────────────────────────────────────

const PolicyListSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="p-5 rounded-lg border border-border bg-card space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    ))}
  </div>
);

// ── Import DOCX modal ─────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function ImportModal({ file, onClose, onImported }) {
  const [form, setForm] = useState({
    document_type: "",
    name: file.name.replace(/\.docx$/i, ""),
    industry: "",
  });
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setImporting(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "metadata",
      JSON.stringify({
        document_type: form.document_type.trim(),
        name: form.name.trim(),
        industry: form.industry.trim(),
      }),
    );
    try {
      const res = await importPolicyHubFromDocx(formData);
      if (res?.success) {
        onImported(res.data);
      } else {
        setError(res?.error || "Import failed.");
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Import Policy from DOCX</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground">
            <FileUp className="h-4 w-4 shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Policy Name *</label>
            <input className={inputCls} value={form.name} onChange={set("name")} placeholder="AML Policy" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Document Type</label>
            <DocumentTypeSelect value={form.document_type} onChange={set("document_type")} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Industry</label>
            <input className={inputCls} value={form.industry} onChange={set("industry")} placeholder="fintech" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={importing}>Cancel</Button>
            <Button type="submit" disabled={importing} className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              {importing ? "Importing…" : "Import"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Save-as-Template modal ────────────────────────────────────────────────────

function SaveTemplateModal({ policy, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: `${policy?.metadata?.name ?? "Policy"} — Template`,
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
      const res = await savePolicyAsTemplate(getId(policy), {
        name: form.name.trim(),
        description: form.description.trim(),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isGlobal: form.isGlobal,
      });
      if (res?.success) {
        onSaved();
      } else {
        setError(res?.error || "Failed to save template.");
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
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Template Name *</label>
            <input className={inputCls} value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              className={`${inputCls} resize-none h-20`}
              value={form.description}
              onChange={set("description")}
              placeholder="Snapshot description…"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
            <input className={inputCls} value={form.tags} onChange={set("tags")} placeholder="aml, approved" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isGlobal}
              onChange={(e) => setForm((f) => ({ ...f, isGlobal: e.target.checked }))}
              className="h-4 w-4 rounded accent-primary"
            />
            <span className="text-sm text-foreground">Global (visible to all clients)</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const TABS = ["All Policies", "Internal Policies", "Regulatory Policy", "Template", "AFC Documents"];

export default function PolicyList() {
  const [activeTab, setActiveTab] = useState("All Policies");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [importFile, setImportFile] = useState(null);
  const [saveTemplateTarget, setSaveTemplateTarget] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();
  useGetUser();
  const LIMIT = 20;

  const fetchPolicies = async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await getAllPolicyDocumentsPaginated(p, LIMIT);
      const list = res?.data ?? [];
      setPolicies(list);
      setHasMore(list.length === LIMIT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "All Policies") fetchPolicies(page);
  }, [activeTab, page]);

  const setLoading = (id, key, val) =>
    setActionLoading((prev) => ({ ...prev, [`${id}_${key}`]: val }));

  const handleExportPdf = async (policy) => {
    const id = getId(policy);
    if (!id) return;
    setLoading(id, "pdf", true);
    try {
      const res = await fetch(`/api/policy-hub/${id}/download`);
      if (res.ok) triggerBlobDownload(await res.blob(), `${policy.metadata?.name ?? "policy"}.pdf`);
    } finally {
      setLoading(id, "pdf", false);
    }
  };

  const handleExportDocx = async (policy) => {
    const id = getId(policy);
    if (!id) return;
    setLoading(id, "docx", true);
    try {
      const res = await fetch(`/api/policy-hub/${id}/export-docx`);
      if (res.ok) triggerBlobDownload(await res.blob(), `${policy.metadata?.name ?? "policy"}.docx`);
    } finally {
      setLoading(id, "docx", false);
    }
  };

  const handleDelete = async (policy) => {
    const id = getId(policy);
    if (!id) return;
    if (!confirm(`Delete "${policy.metadata?.name ?? "this policy"}"?`)) return;
    setLoading(id, "delete", true);
    try {
      const res = await deletePolicyHub(id);
      if (res?.success) setPolicies((prev) => prev.filter((p) => getId(p) !== id));
    } finally {
      setLoading(id, "delete", false);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    e.target.value = "";
  };

  const filtered = policies.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (p.metadata?.name ?? "").toLowerCase();
    const docType = (p.metadata?.documentType ?? p.metadata?.document_type ?? "").toLowerCase();
    return name.includes(q) || docType.includes(q);
  });

  return (
    <>
      {importFile && (
        <ImportModal
          file={importFile}
          onClose={() => setImportFile(null)}
          onImported={() => { setImportFile(null); fetchPolicies(page); }}
        />
      )}
      {saveTemplateTarget && (
        <SaveTemplateModal
          policy={saveTemplateTarget}
          onClose={() => setSaveTemplateTarget(null)}
          onSaved={() => setSaveTemplateTarget(null)}
        />
      )}

      <div className="min-h-screen">
        {/* Header */}
        <div className="py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Policy Hub</h1>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or type…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          {activeTab === "All Policies" && (
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept=".docx" className="hidden" onChange={handleImportFile} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Import DOCX
              </Button>
              <Button size="sm" onClick={() => router.push("/dashboard/client/knowledge-hub/policy-hub/form")} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Policy
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`pb-3 px-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "AFC Documents" ? (
          <AfcDocumentsList />
        ) : activeTab === "Template" ? (
          <TemplatesList />
        ) : activeTab === "All Policies" ? (
          <>
            {isLoading ? (
              <PolicyListSkeleton />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                <p className="text-sm">{searchQuery ? "No policies match your search." : "No policies found."}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filtered.map((policy) => {
                  const id = getId(policy);
                  const name = policy.metadata?.name ?? policy.metadata?.documentType ?? "Policy";
                  const docType = policy.metadata?.documentType ?? policy.metadata?.document_type ?? "";
                  const industry = policy.metadata?.industry ?? "";
                  const isActive = policy.isActive;

                  return (
                    <div
                      key={id ?? Math.random()}
                      className="p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-all space-y-3"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground text-sm leading-snug">{name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                          {isActive ? "Active" : "Draft"}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {docType && <p><span className="font-medium text-foreground">Type:</span> {docType}</p>}
                        {industry && <p><span className="font-medium text-foreground">Industry:</span> {industry}</p>}
                        <p><span className="font-medium text-foreground">Updated:</span> {formatDate(policy.updatedAt)}</p>
                        {policy.versionNumber != null && (
                          <p><span className="font-medium text-foreground">Version:</span> v{policy.versionNumber}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                          variant="outline" size="sm"
                          onClick={() => router.push(`/dashboard/client/knowledge-hub/policy-hub/details?id=${id}`)}
                          className="flex items-center gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>

                        <Button
                          variant="outline" size="sm"
                          onClick={() => handleExportPdf(policy)}
                          disabled={actionLoading[`${id}_pdf`]}
                          className="flex items-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </Button>

                        <Button
                          variant="outline" size="sm"
                          onClick={() => handleExportDocx(policy)}
                          disabled={actionLoading[`${id}_docx`]}
                          className="flex items-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          DOCX
                        </Button>

                        <Button
                          variant="outline" size="sm"
                          onClick={() => setSaveTemplateTarget(policy)}
                          className="flex items-center gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Save as Template
                        </Button>

                        <Button
                          variant="ghost" size="sm"
                          onClick={() => handleDelete(policy)}
                          disabled={actionLoading[`${id}_delete`]}
                          className="flex items-center gap-1.5 text-destructive hover:text-destructive ml-auto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && (policies.length > 0 || page > 1) && (
              <div className="flex items-center justify-center gap-3 pt-6">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            Coming soon.
          </div>
        )}
      </div>
    </>
  );
}
