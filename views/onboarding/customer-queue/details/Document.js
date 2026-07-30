"use client";
// Documents tab — functional version.
// Left: Document Verification Status derived from the customer's latest
// verification journey (previously hard-coded). Right: real documents gallery
// (customer.documents + journey step documents) with reviewer Add / Remove
// (POST/DELETE customer/:id/documents) — uploads go through the FileVault
// (fileUploadOnCloudinary) like the profile Documents section.

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomDropZone from "@/components/ui/DropZone";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ImageIcon,
  Download,
  Trash2,
  Plus,
  ExternalLink,
} from "lucide-react";
import { IconGridDots, IconList, IconLoader2 } from "@tabler/icons-react";
import { cn, dateShowFormat } from "@/lib/utils";
import { fileUploadOnCloudinary } from "@/app/actions";
import {
  addCustomerDocuments,
  removeCustomerDocument,
} from "@/app/dashboard/client/onboarding/customer-queue/actions";

// ── Verification status (derived from journey steps) ────────────────────────

const STEP_LABELS = {
  personal_form: "Personal Details",
  id_document: "Identity Document",
  liveness: "Liveness / Facial Check",
  proof_of_address: "Address Proof",
  questionnaire: "Questionnaire",
  funds_wealth: "Source of Funds & Wealth",
  declaration: "Declaration",
  authorization: "Authorization",
  consent: "Consent",
  review: "Review",
};

const STEP_STATUS_UI = {
  approved: { label: "Passed", icon: CheckCircle2, box: "bg-success/5 border-success/20", iconCls: "bg-success/15 text-success", badge: "bg-success text-success-foreground" },
  submitted: { label: "Submitted", icon: Clock, box: "bg-primary/5 border-primary/20", iconCls: "bg-primary/15 text-primary", badge: "bg-primary text-primary-foreground" },
  in_progress: { label: "In Progress", icon: Clock, box: "bg-warning/5 border-warning/20", iconCls: "bg-warning/15 text-warning-foreground", badge: "bg-warning text-warning-foreground" },
  rejected: { label: "Failed", icon: XCircle, box: "bg-danger/5 border-danger/20", iconCls: "bg-danger/15 text-danger", badge: "bg-danger text-danger-foreground" },
  pending: { label: "Pending", icon: Clock, box: "bg-muted/40 border-border/50", iconCls: "bg-muted text-muted-foreground", badge: "bg-muted text-muted-foreground" },
  skipped: { label: "Skipped", icon: Clock, box: "bg-muted/40 border-border/50", iconCls: "bg-muted text-muted-foreground", badge: "bg-muted text-muted-foreground" },
  expired: { label: "Expired", icon: XCircle, box: "bg-danger/5 border-danger/20", iconCls: "bg-danger/15 text-danger", badge: "bg-danger text-danger-foreground" },
};

const VerificationStatusCard = ({ journey }) => {
  const steps = [...(journey?.steps || [])]
    .filter((s) => s.type !== "journey_start" && s.type !== "selfie")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Card className="border-border/50">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Document Verification Status
        </h3>
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No verification journey found for this customer.
          </p>
        ) : (
          <div className="space-y-3">
            {steps.map((step) => {
              const cfg = STEP_STATUS_UI[step.status] ?? STEP_STATUS_UI.pending;
              const Icon = cfg.icon;
              return (
                <div
                  key={step.type}
                  className={cn("flex items-center justify-between p-4 rounded-lg border", cfg.box)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", cfg.iconCls)}>
                      <Icon className="size-4" />
                    </div>
                    <span className="font-medium text-sm">
                      {STEP_LABELS[step.type] ?? step.type}
                    </span>
                  </div>
                  <Badge className={cfg.badge}>{cfg.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

// ── Documents gallery ────────────────────────────────────────────────────────

const DOC_TYPE_OPTIONS = [
  { value: "id_front", label: "ID — Front" },
  { value: "id_back", label: "ID — Back" },
  { value: "passport", label: "Passport" },
  { value: "driver_licence", label: "Driver Licence" },
  { value: "proof_of_address", label: "Proof of Address" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "source_of_funds", label: "Source of Funds" },
  { value: "source_of_wealth", label: "Source of Wealth" },
  { value: "selfie", label: "Selfie" },
  { value: "other", label: "Other" },
];

const docTypeLabel = (docType) =>
  DOC_TYPE_OPTIONS.find((o) => o.value === docType)?.label ||
  (docType ? docType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Other");

const isImageDoc = (doc = {}) =>
  /^image\//i.test(doc.mimeType || "") || /\.(png|jpe?g|webp|gif)(\?|$)/i.test(doc.url || "");

const docExt = (doc = {}) => (doc.mimeType || "").split("/").pop()?.toUpperCase() || "FILE";

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

const DocumentRow = ({ doc, onRemove, removing }) => (
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
      <p className="text-xs text-muted-foreground truncate">
        {docExt(doc)}
        {doc._step ? ` · from ${doc._step}` : " · added by reviewer"}
      </p>
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
              {doc._step ? ` · from ${doc._step}` : ""}
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

// ── Add Document dialog ──────────────────────────────────────────────────────

const AddDocumentDialog = ({ open, setOpen, customerId, onUpdated }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [docType, setDocType] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setFile(null);
    setName("");
    setDocType("");
  };

  const handleFileChange = (f) => {
    setFile(f);
    if (f && !name) setName(f.name);
  };

  const handleSave = async () => {
    if (!file || !docType || saving) return;
    setSaving(true);
    try {
      const uploadRes = await fileUploadOnCloudinary(file);
      const publicUrl = uploadRes?.file?.publicUrl;
      if (!uploadRes?.success || !publicUrl) {
        throw new Error(uploadRes?.message || "File upload failed");
      }
      const res = await addCustomerDocuments(customerId, [
        {
          name: name.trim() || file.name,
          url: publicUrl,
          mimeType: file.type || "application/octet-stream",
          type: "manual_upload",
          docType,
        },
      ]);
      if (res?.success) {
        toast.success(res.message || "Document added");
        setOpen(false);
        reset();
        onUpdated?.();
      } else {
        toast.error(res?.error || res?.message || "Failed to add document");
      }
    } catch (error) {
      console.error("Add document failed", error);
      toast.error(error.message || "Failed to add document");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Attach a document to this customer&apos;s KYC record.
          </DialogDescription>
        </DialogHeader>

        <CustomDropZone
          fileTypes={["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx"]}
          handleChange={handleFileChange}
          file={file}
          loading={saving}
          disabled={saving}
          setFile={setFile}
        />

        <div className="space-y-1.5">
          <Label className="font-bold">Document Name</Label>
          <Input
            placeholder="e.g. Passport — Jane Example"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bold">
            Document Type <span className="text-danger">*</span>
          </Label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!file || !docType || saving}>
            {saving ? (
              <>
                Saving... <IconLoader2 className="size-4 animate-spin" />
              </>
            ) : (
              "Add Document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Main tab ─────────────────────────────────────────────────────────────────

export default function Documents({ details, onUpdated }) {
  const [addOpen, setAddOpen] = useState(false);
  const [removingUrl, setRemovingUrl] = useState(null);
  const [view, setView] = useState("list");

  const journeys = useMemo(() => details?.journeys || [], [details]);
  const primaryJourney = journeys[0];

  // Customer-level documents are managed here (removable); journey step
  // documents are evidence collected during onboarding (read-only).
  const customerDocs = useMemo(() => details?.documents || [], [details]);
  const journeyDocs = useMemo(() => {
    const customerUrls = new Set(customerDocs.map((d) => d.url));
    const seen = new Set();
    return journeys.flatMap((j) =>
      (j.steps || []).flatMap((s) =>
        (s.documents || []).filter((d) => {
          if (!d.url || customerUrls.has(d.url) || seen.has(d.url)) return false;
          seen.add(d.url);
          return true;
        }).map((d) => ({ ...d, _step: STEP_LABELS[s.type] ?? s.type })),
      ),
    );
  }, [journeys, customerDocs]);

  const handleRemove = async (doc) => {
    if (removingUrl) return;
    setRemovingUrl(doc.url);
    try {
      const res = await removeCustomerDocument(details._id, doc.url);
      if (res?.success) {
        toast.success(res.message || "Document removed");
        onUpdated?.();
      } else {
        toast.error(res?.error || res?.message || "Failed to remove document");
      }
    } catch (error) {
      console.error("Remove document failed", error);
      toast.error("Failed to remove document");
    } finally {
      setRemovingUrl(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 mt-6">
      <VerificationStatusCard journey={primaryJourney} />

      <Card className="border-border/50 lg:col-span-2">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              Uploaded Documents
              <Badge variant="secondary">{customerDocs.length + journeyDocs.length}</Badge>
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

          {customerDocs.length === 0 && journeyDocs.length === 0 ? (
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
              {customerDocs.map((doc, i) => (
                <DocumentRow
                  key={doc.url || i}
                  doc={doc}
                  onRemove={handleRemove}
                  removing={removingUrl === doc.url}
                />
              ))}
              {journeyDocs.map((doc, i) => (
                <DocumentRow key={doc.url || `j-${i}`} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {customerDocs.map((doc, i) => (
                <DocumentCard
                  key={doc.url || i}
                  doc={doc}
                  onRemove={handleRemove}
                  removing={removingUrl === doc.url}
                />
              ))}
              {journeyDocs.map((doc, i) => (
                <DocumentCard key={doc.url || `j-${i}`} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </Card>

      <AddDocumentDialog
        open={addOpen}
        setOpen={setAddOpen}
        customerId={details?._id}
        onUpdated={onUpdated}
      />
    </div>
  );
}
