"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  FileText,
  ImageIcon,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  FingerprintIcon,
} from "lucide-react";
import { IconGridDots, IconList, IconLoader2 } from "@tabler/icons-react";
import { cn, dateShowFormat } from "@/lib/utils";
import AddDocumentDialog from "@/components/documents/AddDocumentDialog";
import TbmlOsintDetails from "./TbmlOsintDetails";

// ── Mock document data ───────────────────────────────────────────────────────

const DOC_TYPE_OPTIONS = [
  { value: "sanctions_screening", label: "Sanctions Screening Report" },
  { value: "adverse_media", label: "Adverse Media Report" },
  { value: "company_registry", label: "Company Registry Extract" },
  { value: "transaction_report", label: "Transaction Analysis Report" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "osint_report", label: "OSINT Findings" },
  { value: "other", label: "Other" },
];

const docTypeLabel = (docType) =>
  DOC_TYPE_OPTIONS.find((o) => o.value === docType)?.label ||
  (docType ? docType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Other");

const isImageDoc = (doc = {}) =>
  /^image\//i.test(doc.mimeType || "") || /\.(png|jpe?g|webp|gif)(\?|$)/i.test(doc.url || "");

const docExt = (doc = {}) => (doc.mimeType || "").split("/").pop()?.toUpperCase() || "FILE";

const MOCK_DOCUMENTS = [
  {
    name: "Sanctions Screening — World-Check",
    url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
    mimeType: "application/pdf",
    docType: "sanctions_screening",
    uploadedAt: "2026-08-10T09:15:00.000Z",
  },
  {
    name: "Adverse Media Summary",
    url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
    mimeType: "application/pdf",
    docType: "adverse_media",
    uploadedAt: "2026-08-12T14:32:00.000Z",
  },
  {
    name: "ACME Holdings — Company Registry Extract",
    url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    mimeType: "image/jpeg",
    docType: "company_registry",
    uploadedAt: "2026-08-15T11:05:00.000Z",
  },
  {
    name: "Transaction Pattern Analysis",
    url: "https://res.cloudinary.com/demo/image/upload/sample.pdfgo",
    mimeType: "application/pdf",
    docType: "transaction_report",
    uploadedAt: "2026-08-18T16:47:00.000Z",
  },
  {
    name: "OSINT Findings — Public Records",
    url: "https://res.cloudinary.com/demo/image/upload/sample.pdfg",
    mimeType: "application/pdf",
    docType: "osint_report",
    uploadedAt: "2026-08-20T08:22:00.000Z",
  },
];

// Two-click confirm remove — shared by the list row and the grid card.
const RemoveDocButton = ({ doc, onRemove, removing, compact = false }) => {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3500);
      return;
    }
    onRemove(doc);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "text-xs",
        compact ? "" : "w-full",
        confirming
          ? "text-white bg-danger hover:bg-danger/90 border-danger"
          : "text-danger border-danger/30 hover:bg-danger/5",
      )}
      disabled={removing}
      onClick={handleClick}
    >
      {removing ? (
        <IconLoader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {confirming ? "Confirm?" : compact ? "" : "Remove"}
    </Button>
  );
};

// ── List row ─────────────────────────────────────────────────────────────────

const DocumentRow = ({ doc, onRemove, removing, onOsint }) => (
  <div className="flex items-center gap-3 py-2.5 px-2 border-b border-border/60 last:border-0 hover:bg-muted/30 rounded-md transition-colors">
    <div className="size-11 rounded-md overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center flex-shrink-0">
      {isImageDoc(doc) ? (
        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
      ) : (
        <FileText className="size-5 text-primary/60" />
      )}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium truncate" title={doc.name}>
        {doc.name || docTypeLabel(doc.docType)}
      </p>
      <p className="text-xs text-muted-foreground truncate">{docExt(doc)}</p>
    </div>

    <Badge variant="outline" className="text-[10px] flex-shrink-0 hidden sm:inline-flex">
      {docTypeLabel(doc.docType)}
    </Badge>

    <span className="text-xs text-muted-foreground flex-shrink-0 w-24 text-right hidden md:block">
      {doc.uploadedAt ? dateShowFormat(doc.uploadedAt) : "—"}
    </span>

    <div className="flex items-center gap-1.5 flex-shrink-0">
      <Button variant="outline" size="icon" className="size-8" asChild title="View">
        <a href={doc.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-3.5" />
        </a>
      </Button>
      <Button variant="outline" size="icon" className="size-8" asChild title="Download">
        <a href={doc.url} download>
          <Download className="size-3.5" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={onOsint}>
        <FingerprintIcon />
      </Button>
      {onRemove && <RemoveDocButton doc={doc} onRemove={onRemove} removing={removing} compact />}
    </div>
  </div>
);

const DocumentCard = ({ doc, onRemove, removing }) => {
  const ext = docExt(doc);

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors p-0 gap-0">
      <div className="aspect-video bg-muted/50 relative group">
        {isImageDoc(doc) ? (
          <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-primary/5">
            <FileText className="size-8 text-primary/60" />
            <span className="text-xs font-bold text-primary/80">{ext}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" asChild>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5 mr-1.5" />
              View
            </a>
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <a href={doc.url} download>
              <Download className="size-3.5 mr-1.5" />
              Download
            </a>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate" title={doc.name}>
              {doc.name || docTypeLabel(doc.docType)}
            </h4>
            <p className="text-xs text-muted-foreground">
              {doc.uploadedAt ? dateShowFormat(doc.uploadedAt) : "—"}
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] flex-shrink-0">
            {docTypeLabel(doc.docType)}
          </Badge>
        </div>

        {onRemove && <RemoveDocButton doc={doc} onRemove={onRemove} removing={removing} />}
      </div>
    </Card>
  );
};

// ── Main tab ─────────────────────────────────────────────────────────────────

export default function TbmlOsint() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [addOpen, setAddOpen] = useState(false);
  const [removingUrl, setRemovingUrl] = useState(null);
  const [view, setView] = useState("list");
  const [openOsintDetails, setOpenOsintDetails] = useState(false);
  const [currentOsint, setCurrentOsint] = useState(null);

  const handleAdd = (doc) => setDocuments((prev) => [doc, ...prev]);

  const handleRemove = (doc) => {
    setRemovingUrl(doc.url);
    setDocuments((prev) => prev.filter((d) => d.url !== doc.url));
    setRemovingUrl(null);
  };

  const handleOsint = (id) => {
    setOpenOsintDetails(true);
    setCurrentOsint(id);
  };

  return (
    <div className="mt-6">
      <Card className="border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              TBML / OSINT Documents
              <Badge variant="secondary">{documents.length}</Badge>
            </h3>
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button
                  size="sm"
                  variant={view === "list" ? "default" : "outline"}
                  onClick={() => setView("list")}
                  title="List view"
                >
                  <IconList className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant={view === "grid" ? "default" : "outline"}
                  onClick={() => setView("grid")}
                  title="Grid view"
                >
                  <IconGridDots className="size-4" />
                </Button>
              </ButtonGroup>
              <Button size="sm" className="text-xs" onClick={() => setAddOpen(true)}>
                <Plus className="size-4" /> Add Document
              </Button>
            </div>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border">
              <ImageIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No documents yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="size-4" /> Add the first document
              </Button>
            </div>
          ) : view === "list" ? (
            <div>
              {documents.map((doc, i) => (
                <DocumentRow
                  key={i}
                  doc={doc}
                  onRemove={handleRemove}
                  removing={removingUrl === doc.url}
                  onOsint={handleOsint}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {documents.map((doc, i) => (
                <DocumentCard
                  key={doc.url || i}
                  doc={doc}
                  onRemove={handleRemove}
                  removing={removingUrl === doc.url}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      <AddDocumentDialog
        open={addOpen}
        setOpen={setAddOpen}
        docTypeOptions={DOC_TYPE_OPTIONS}
        description="Attach a TBML / OSINT document to this case."
        namePlaceholder="e.g. Sanctions Screening — ACME Holdings"
        onSave={(payload) => handleAdd({ ...payload, uploadedAt: new Date().toISOString() })}
      />
      {openOsintDetails && (
        <TbmlOsintDetails open={openOsintDetails} setOpen={setOpenOsintDetails} />
      )}
    </div>
  );
}
