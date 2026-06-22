"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileUp,
  Globe,
  Pencil,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  importTemplateFromDocx,
  updateTemplate,
  useTemplate as applyTemplate,
} from "@/app/dashboard/client/knowledge-hub/policy-hub/actions";
import DocumentTypeSelect from "@/components/ui/DocumentTypeSelect";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Template management uses TinyMCE (rich HTML, full WYSIWYG, DOCX fidelity).
// The Policy Hub keeps Editor.js — see policy-form/Editor.js.
const TinyEditor = dynamic(() => import("@/components/ui/TinyEditor"), {
  ssr: false,
});

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

// ── skeleton ──────────────────────────────────────────────────────────────────

function TemplateSkeleton() {
  return (
    <div className="p-5 rounded-lg border border-border bg-card space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

// ── modal (create / edit) ─────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  description: "",
  tags: "",
  industry: "",
  document_type: "",
  jurisdiction: "",
  isGlobal: false,
};

function TemplateModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name ?? "",
          description: initial.description ?? "",
          tags: (initial.tags ?? []).join(", "),
          industry: initial.metadata?.industry ?? "",
          document_type: initial.metadata?.document_type ?? "",
          jurisdiction: initial.metadata?.jurisdiction ?? "",
          isGlobal: initial.isGlobal ?? false,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isGlobal: form.isGlobal,
      metadata: {
        industry: form.industry.trim(),
        document_type: form.document_type.trim(),
        jurisdiction: form.jurisdiction.trim(),
      },
    };
    const res = initial
      ? await updateTemplate(getId(initial), payload)
      : await createTemplate(payload);
    setSaving(false);
    if (res?.success) {
      onSaved(res.data);
    } else {
      setError(res?.error || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">
            {initial ? "Edit Template" : "Create Template"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Name *">
            <input
              className={inputCls}
              value={form.name}
              onChange={set("name")}
              placeholder="AML Policy Template"
            />
          </Field>

          <Field label="Description">
            <textarea
              className={`${inputCls} resize-none h-20`}
              value={form.description}
              onChange={set("description")}
              placeholder="Brief description of the template"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry">
              <input
                className={inputCls}
                value={form.industry}
                onChange={set("industry")}
                placeholder="fintech"
              />
            </Field>
            <Field label="Document Type">
              <DocumentTypeSelect value={form.document_type} onChange={set("document_type")} />
            </Field>
          </div>

          <Field label="Jurisdiction">
            <input
              className={inputCls}
              value={form.jurisdiction}
              onChange={set("jurisdiction")}
              placeholder="AU"
            />
          </Field>

          <Field label="Tags (comma-separated)">
            <input
              className={inputCls}
              value={form.tags}
              onChange={set("tags")}
              placeholder="aml, policy, compliance"
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isGlobal}
              onChange={(e) => setForm((f) => ({ ...f, isGlobal: e.target.checked }))}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">Global (visible to all clients)</span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : initial ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── editable preview modal ────────────────────────────────────────────────────

const REGION_TABS = [
  { key: "body",   label: "Body",        height: 540, hint: "Main document content." },
  { key: "header", label: "Page header", height: 320, hint: "Appears at the top of every page." },
  { key: "footer", label: "Page footer", height: 320, hint: "Appears at the bottom of every page. Use [Page] / [Pages] for page numbers." },
];

function PreviewModal({ template, onClose, onSaved }) {
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState("body");

  // One TinyMCE instance per active tab (keyed → clean remount on switch). Content
  // is lifted to state on edit, so all three regions are captured even though only
  // the active one is mounted (avoids the TinyMCE-in-hidden-tab rendering bug).
  const [regions, setRegions] = useState({
    body:   template.docs || "",
    header: template.headerHtml || "",
    footer: template.footerHtml || "",
  });
  const activeApi = useRef(null);

  const setRegion = (key) => (html) =>
    setRegions((r) => (r[key] === html ? r : { ...r, [key]: html }));

  // Pull the freshest content from the live editor for the current tab.
  const flushActive = () => {
    const html = activeApi.current?.getContent();
    if (html == null) return regions;
    const next = { ...regions, [tab]: html };
    setRegions(next);
    return next;
  };

  const switchTab = (next) => { flushActive(); setTab(next); };

  const handleSave = async () => {
    const id = getId(template);
    if (!id) return;
    setIsSaving(true);
    try {
      const r = flushActive();
      const payload = { docs: r.body, headerHtml: r.header, footerHtml: r.footer };
      const res = await updateTemplate(id, payload);
      if (res?.success) {
        onSaved({ ...template, ...payload });
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const active = REGION_TABS.find((t) => t.key === tab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-xl border border-border bg-card shadow-xl flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="font-semibold text-foreground truncate">{template.name}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save all"}
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={switchTab} className="flex-1 min-h-0 px-6 pt-4 overflow-y-auto">
          <TabsList>
            {REGION_TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
            ))}
          </TabsList>

          <p className="text-xs text-muted-foreground mt-2">{active?.hint}</p>

          {REGION_TABS.map((t) => (
            <TabsContent key={t.key} value={t.key} className="mt-2">
              {/* Only the active editor mounts; key forces a clean instance per region */}
              {tab === t.key && (
                <TinyEditor
                  key={t.key}
                  value={regions[t.key]}
                  onChange={setRegion(t.key)}
                  onReady={(api) => { activeApi.current = api; }}
                  showSave={false}
                  height={t.height}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// ── import DOCX modal ─────────────────────────────────────────────────────────

function ImportModal({ file, onClose, onImported }) {
  const [form, setForm] = useState({
    name: file.name.replace(/\.docx$/i, ""),
    description: "",
    tags: "",
    industry: "",
    document_type: "",
    jurisdiction: "",
    isGlobal: false,
  });
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setImporting(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append(
      "tags",
      JSON.stringify(
        form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    );
    formData.append(
      "metadata",
      JSON.stringify({
        industry: form.industry.trim(),
        document_type: form.document_type.trim(),
        jurisdiction: form.jurisdiction.trim(),
      }),
    );
    formData.append("isGlobal", String(form.isGlobal));
    try {
      const res = await importTemplateFromDocx(formData);
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
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Import DOCX</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Selected file chip */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground">
            <FileUp className="h-4 w-4 shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>

          <Field label="Name *">
            <input
              className={inputCls}
              value={form.name}
              onChange={set("name")}
              placeholder="AML Policy Template"
            />
          </Field>

          <Field label="Description">
            <textarea
              className={`${inputCls} resize-none h-20`}
              value={form.description}
              onChange={set("description")}
              placeholder="Brief description of the template"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry">
              <input
                className={inputCls}
                value={form.industry}
                onChange={set("industry")}
                placeholder="fintech"
              />
            </Field>
            <Field label="Document Type">
              <DocumentTypeSelect value={form.document_type} onChange={set("document_type")} />
            </Field>
          </div>

          <Field label="Jurisdiction">
            <input
              className={inputCls}
              value={form.jurisdiction}
              onChange={set("jurisdiction")}
              placeholder="AU"
            />
          </Field>

          <Field label="Tags (comma-separated)">
            <input
              className={inputCls}
              value={form.tags}
              onChange={set("tags")}
              placeholder="aml, policy, compliance"
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isGlobal}
              onChange={(e) => setForm((f) => ({ ...f, isGlobal: e.target.checked }))}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">Global (visible to all clients)</span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={importing}>
              Cancel
            </Button>
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

// ── field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

// ── main component ────────────────────────────────────────────────────────────

export default function TemplatesList({ hideHeader = false }) {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [useResult, setUseResult] = useState({});

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [importFile, setImportFile] = useState(null);

  const fileInputRef = useRef(null);
  const LIMIT = 20;

  const fetchTemplates = async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await getAllTemplates(p, LIMIT);
      const list = res?.data ?? [];
      setTemplates(list);
      setHasMore(list.length === LIMIT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(page);
  }, [page]);

  const setLoading = (id, key, val) =>
    setActionLoading((prev) => ({ ...prev, [`${id}_${key}`]: val }));

  // ── export PDF ──────────────────────────────────────────────────────────────
  const handleExportPdf = async (tmpl) => {
    const id = getId(tmpl);
    if (!id) return;
    setLoading(id, "pdf", true);
    try {
      const res = await fetch(`/api/policy-hub-templates/${id}/export-pdf`);
      if (res.ok) triggerBlobDownload(await res.blob(), `${tmpl.name}.pdf`);
    } finally {
      setLoading(id, "pdf", false);
    }
  };

  // ── export DOCX ─────────────────────────────────────────────────────────────
  const handleExportDocx = async (tmpl) => {
    const id = getId(tmpl);
    if (!id) return;
    setLoading(id, "docx", true);
    try {
      const res = await fetch(`/api/policy-hub-templates/${id}/export-docx`);
      if (res.ok) triggerBlobDownload(await res.blob(), `${tmpl.name}.docx`);
    } finally {
      setLoading(id, "docx", false);
    }
  };

  // ── use template ────────────────────────────────────────────────────────────
  const handleUse = async (tmpl) => {
    const id = getId(tmpl);
    if (!id) return;
    setLoading(id, "use", true);
    try {
      const res = await applyTemplate(id);
      setUseResult((prev) => ({
        ...prev,
        [id]: res?.success ? "used" : "error",
      }));
    } finally {
      setLoading(id, "use", false);
    }
  };

  // ── delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (tmpl) => {
    const id = getId(tmpl);
    if (!id) return;
    if (!confirm(`Delete template "${tmpl.name}"?`)) return;
    setLoading(id, "delete", true);
    try {
      const res = await deleteTemplate(id);
      if (res?.success) setTemplates((prev) => prev.filter((t) => getId(t) !== id));
    } finally {
      setLoading(id, "delete", false);
    }
  };

  // ── import DOCX — just capture file, show metadata modal ───────────────────
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    e.target.value = "";
  };

  // ── after create / edit ─────────────────────────────────────────────────────
  const handleSaved = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchTemplates(page);
  };

  return (
    <>
      {/* Modals */}
      {importFile && (
        <ImportModal
          file={importFile}
          onClose={() => setImportFile(null)}
          onImported={() => {
            setImportFile(null);
            fetchTemplates(page);
          }}
        />
      )}
      {(showCreate || editTarget) && (
        <TemplateModal
          initial={editTarget}
          onClose={() => {
            setShowCreate(false);
            setEditTarget(null);
          }}
          onSaved={handleSaved}
        />
      )}
      {previewTarget && (
        <PreviewModal
          template={previewTarget}
          onClose={() => setPreviewTarget(null)}
          onSaved={(updated) => {
            setTemplates((prev) => prev.map((t) => (getId(t) === getId(updated) ? updated : t)));
            setPreviewTarget(null);
          }}
        />
      )}

      <div className="space-y-6">
        {/* Toolbar */}
        {hideHeader ? null : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              Reusable policy templates — preview, export, or apply to create a new policy.
            </p>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                className="hidden"
                onChange={handleImport}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <FileUp className="h-4 w-4" />
                Import DOCX
              </Button>
              <Button
                size="sm"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
          </div>
        )}

        {/* Cards */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <TemplateSkeleton key={i} />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
            <p className="text-sm">No templates found. Create one or import a DOCX.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {templates.map((tmpl) => {
              const id = getId(tmpl);
              const wasUsed = useResult[id] === "used";
              const useError = useResult[id] === "error";

              return (
                <div
                  key={id ?? Math.random()}
                  className="p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-all space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-snug truncate">
                        {tmpl.name}
                      </h3>
                      {tmpl.isGlobal && (
                        <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          <Globe className="h-3 w-3" />
                          Global
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setEditTarget(tmpl)}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Description */}
                  {tmpl.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{tmpl.description}</p>
                  )}

                  {/* Meta */}
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {tmpl.metadata?.industry && (
                      <p>
                        <span className="font-medium text-foreground">Industry:</span>{" "}
                        {tmpl.metadata.industry}
                      </p>
                    )}
                    {tmpl.metadata?.document_type && (
                      <p>
                        <span className="font-medium text-foreground">Type:</span>{" "}
                        {tmpl.metadata.document_type}
                      </p>
                    )}
                    {tmpl.metadata?.jurisdiction && (
                      <p>
                        <span className="font-medium text-foreground">Jurisdiction:</span>{" "}
                        {tmpl.metadata.jurisdiction}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {tmpl.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTarget(tmpl)}
                      className="flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPdf(tmpl)}
                      disabled={actionLoading[`${id}_pdf`]}
                      className="flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportDocx(tmpl)}
                      disabled={actionLoading[`${id}_docx`]}
                      className="flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DOCX
                    </Button>

                    <Button
                      variant={wasUsed ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleUse(tmpl)}
                      disabled={actionLoading[`${id}_use`] || wasUsed}
                      className="flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {wasUsed ? "Applied" : useError ? "Retry" : "Use Template"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tmpl)}
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
        {!isLoading && (templates.length > 0 || page > 1) && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
