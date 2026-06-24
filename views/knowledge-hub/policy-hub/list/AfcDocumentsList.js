"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Download, Eye, FileText, FileUp, Send, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteAfcDocument,
  getAfcDocumentById,
  getAllAfcDocuments,
  importAfcDocumentFromDocx,
  pushAfcDocumentToPolicyHub,
} from "@/app/dashboard/client/knowledge-hub/policy-hub/actions";

// Generated / imported document preview uses TinyMCE (read-only WYSIWYG).
const TinyEditor = dynamic(() => import("@/components/ui/TinyEditor"), {
  ssr: false,
});

// ── Generated / imported document preview modal ───────────────────────────────
function AfcPreviewModal({ docId, title, onClose }) {
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await getAfcDocumentById(docId);
      if (active) {
        setHtml(res?.success ? res.data?.contentMd ?? "" : "");
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [docId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-xl border border-border bg-card shadow-xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-2">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
          ) : (
            <TinyEditor value={html} readOnly showSave={false} height={620} />
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
};

// Handles _id (ObjectId or string) and the Mongoose id virtual
const getDocId = (doc) => {
  const raw = doc._id ?? doc.id;
  return raw ? String(raw) : null;
};

function AfcCardSkeleton() {
  return (
    <div className="p-5 rounded-lg border border-border bg-card space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AfcDocumentsList() {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [pushResult, setPushResult] = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);
  const fileInputRef = useRef(null);
  const LIMIT = 20;

  const fetchDocs = async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await getAllAfcDocuments(p, LIMIT);
      const list = res?.data ?? [];
      setDocs(list);
      setHasMore(list.length === LIMIT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(page);
  }, [page]);

  const setLoading = (id, key, value) =>
    setActionLoading((prev) => ({ ...prev, [`${id}_${key}`]: value }));

  const triggerBlobDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async (doc) => {
    const id = getDocId(doc);
    if (!id) return;
    setLoading(id, "pdf", true);
    try {
      const res = await fetch(`/api/afc-documents/${id}/download`);
      if (res.ok) {
        const blob = await res.blob();
        triggerBlobDownload(blob, `${doc.metadata?.company ?? "document"}.pdf`);
      }
    } finally {
      setLoading(id, "pdf", false);
    }
  };

  const handleExportDocx = async (doc) => {
    const id = getDocId(doc);
    if (!id) return;
    setLoading(id, "docx", true);
    try {
      const res = await fetch(`/api/afc-documents/${id}/export-docx`);
      if (res.ok) {
        const blob = await res.blob();
        triggerBlobDownload(blob, `${doc.metadata?.company ?? "document"}.docx`);
      }
    } finally {
      setLoading(id, "docx", false);
    }
  };

  const handlePushToHub = async (doc) => {
    const id = getDocId(doc);
    if (!id) return;
    setLoading(id, "push", true);
    try {
      const res = await pushAfcDocumentToPolicyHub(id, {
        isActive: false,
        editReason: "afc-import",
        company: doc.metadata?.company,
        industry: doc.metadata?.industry,
        documentType: doc.metadata?.documentType,
        complianceOfficer: doc.metadata?.complianceOfficer,
        model: doc.metadata?.model,
      });
      setPushResult((prev) => ({
        ...prev,
        [id]: res?.success ? "pushed" : "error",
      }));
    } finally {
      setLoading(id, "push", false);
    }
  };

  const handleDelete = async (doc) => {
    const id = getDocId(doc);
    if (!id) return;
    if (!confirm(`Delete "${doc.metadata?.documentType ?? id}"?`)) return;
    setLoading(id, "delete", true);
    try {
      const res = await deleteAfcDocument(id);
      if (res?.success) setDocs((prev) => prev.filter((d) => getDocId(d) !== id));
    } finally {
      setLoading(id, "delete", false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);
    try {
      const res = await importAfcDocumentFromDocx(formData);
      if (res?.success) fetchDocs(page);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {previewDoc && (
        <AfcPreviewModal
          docId={previewDoc.id}
          title={previewDoc.title}
          onClose={() => setPreviewDoc(null)}
        />
      )}
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          AI-generated compliance documents from the AFC pipeline.
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
        </div>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <AfcCardSkeleton key={i} />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <FileText className="h-10 w-10 opacity-40" />
          <p className="text-sm">No AFC documents found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {docs.map((doc) => {
            const id = getDocId(doc);
            const meta = doc.metadata ?? {};
            const statusClass = STATUS_COLORS[doc.status] ?? "bg-muted text-muted-foreground";
            const isPushed = pushResult[id] === "pushed";
            const pushError = pushResult[id] === "error";

            return (
              <div
                key={id ?? Math.random()}
                className="p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-all space-y-3"
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground leading-snug text-sm">
                    {meta.documentType
                      ? meta.documentType
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : "AFC Document"}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${statusClass}`}
                  >
                    {doc.status ?? "unknown"}
                  </span>
                </div>

                {/* Meta info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  {meta.company && (
                    <p>
                      <span className="font-medium text-foreground">Company:</span> {meta.company}
                    </p>
                  )}
                  {meta.industry && (
                    <p>
                      <span className="font-medium text-foreground">Industry:</span> {meta.industry}
                    </p>
                  )}
                  {meta.complianceOfficer && (
                    <p>
                      <span className="font-medium text-foreground">Compliance Officer:</span>{" "}
                      {meta.complianceOfficer}
                    </p>
                  )}
                  {meta.version !== undefined && (
                    <p>
                      <span className="font-medium text-foreground">Version:</span> v{meta.version}
                    </p>
                  )}
                  {meta.model && (
                    <p>
                      <span className="font-medium text-foreground">Model:</span> {meta.model}
                    </p>
                  )}
                  <p>
                    <span className="font-medium text-foreground">Created:</span>{" "}
                    {formatDate(doc.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreviewDoc({
                        id,
                        title: meta.documentType
                          ? meta.documentType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                          : "AFC Document",
                      })
                    }
                    className="flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportPdf(doc)}
                    disabled={actionLoading[`${id}_pdf`]}
                    className="flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportDocx(doc)}
                    disabled={actionLoading[`${id}_docx`]}
                    className="flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    DOCX
                  </Button>

                  <Button
                    variant={isPushed ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handlePushToHub(doc)}
                    disabled={actionLoading[`${id}_push`] || isPushed}
                    className="flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isPushed ? "Pushed" : pushError ? "Retry Push" : "Push to Hub"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc)}
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
      {!isLoading && (docs.length > 0 || page > 1) && (
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
  );
}
