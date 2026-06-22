"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import DragDrop from "@/components/DragDop";
import { fileUploadOnCloudinary } from "@/app/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
} from "lucide-react";

// FileVault accepts any type; restrict the picker to common document formats.
const DOC_FILE_TYPES = [
  "PDF",
  "PNG",
  "JPG",
  "JPEG",
  "WEBP",
  "DOC",
  "DOCX",
  "XLS",
  "XLSX",
];

// ── Drag-and-drop tile (document-friendly: no broken <img> preview for PDFs) ──
function DocumentDropzone({ hasFile, loading, error, onFile }) {
  return (
    <DragDrop handleChange={onFile} fileTypes={DOC_FILE_TYPES} disabled={loading}>
      <div
        className={cn(
          "group relative w-full rounded-xl border-2 border-dashed px-5 py-5 transition-all duration-200",
          "flex flex-col items-center justify-center gap-3 min-h-[120px] text-center",
          loading && "border-solid border-amber-500/50 bg-amber-50/40",
          error && "border-solid border-destructive/50 bg-destructive/5",
          hasFile && !error && "border-solid border-emerald-500/40 bg-emerald-50/40",
          !loading &&
            !error &&
            !hasFile &&
            "cursor-pointer hover:border-primary/50 hover:bg-muted/30",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full p-3 transition-colors",
            loading && "bg-amber-100 text-amber-600",
            error && "bg-destructive/10 text-destructive",
            hasFile && !error && "bg-emerald-100 text-emerald-600",
            !loading && !error && !hasFile && "bg-primary/10 text-primary",
          )}
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : error ? (
            <XCircle className="size-5" />
          ) : hasFile ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Upload className="size-5" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {loading
              ? "Uploading…"
              : hasFile
                ? "Upload complete — drop a new file to replace"
                : "Drop your document here or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, DOC, or image — up to 50 MB
          </p>
          {error && (
            <p className="text-xs font-medium text-destructive">
              Upload failed. Please try again.
            </p>
          )}
        </div>
      </div>
    </DragDrop>
  );
}

export function DocumentsSection({ control, errors, setValue }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  // Live document values (useFieldArray's `fields` does not reflect edits).
  const watchedDocs = useWatch({ control, name: "documents" }) || [];

  // Per-row upload state keyed by the stable RHF field id.
  const [uploads, setUploads] = useState({});

  const addDocument = () => {
    append({
      name: "",
      url: "",
      mimeType: "application/pdf",
      type: "license",
    });
  };

  const removeDocument = (index) => {
    remove(index);
  };

  const handleUpload = async (file, index, rowId) => {
    if (!file) return;
    setUploads((prev) => ({ ...prev, [rowId]: { loading: true, error: false } }));
    try {
      const res = await fileUploadOnCloudinary(file);
      const publicUrl = res?.file?.publicUrl;
      if (res?.success && publicUrl) {
        setValue(`documents.${index}.url`, publicUrl, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(
          `documents.${index}.mimeType`,
          file.type || "application/octet-stream",
          { shouldDirty: true },
        );
        // Auto-fill the name only when the user hasn't typed one.
        if (!watchedDocs?.[index]?.name) {
          setValue(`documents.${index}.name`, file.name, { shouldDirty: true });
        }
        setUploads((prev) => ({
          ...prev,
          [rowId]: { loading: false, error: false },
        }));
        toast.success("Document uploaded");
      } else {
        throw new Error(res?.message || "Upload failed");
      }
    } catch (e) {
      setUploads((prev) => ({
        ...prev,
        [rowId]: { loading: false, error: true },
      }));
      toast.error(e?.message || "Document upload failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Upload and manage company documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((document, index) => {
          const uploadState = uploads[document.id] || {};
          const url = watchedDocs?.[index]?.url;
          const docName = watchedDocs?.[index]?.name;
          const hasFile = typeof url === "string" && url.length > 0;

          return (
            <div key={document.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Document {index + 1}</h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDocument(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name={`documents.${index}.name`}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor={`doc-name-${index}`}>Document Name</Label>
                      <Input
                        id={`doc-name-${index}`}
                        {...field}
                        placeholder="e.g., Trade License"
                      />
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name={`documents.${index}.type`}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor={`doc-type-${index}`}>Document Type</Label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={`doc-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="license">License</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                          <SelectItem value="permit">Permit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              {/* Document file — uploaded to FileVault via drag-and-drop */}
              <Controller
                control={control}
                name={`documents.${index}.url`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Document File</Label>
                    <DocumentDropzone
                      hasFile={hasFile}
                      loading={uploadState.loading}
                      error={uploadState.error}
                      onFile={(file) => handleUpload(file, index, document.id)}
                    />

                    {hasFile && (
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 truncate text-sm font-medium text-primary hover:underline"
                        >
                          {docName || url}
                        </a>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Open document"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="!size-7 shrink-0"
                          onClick={() => {
                            field.onChange("");
                            setValue(`documents.${index}.mimeType`, "", {
                              shouldDirty: true,
                            });
                          }}
                          aria-label="Remove file"
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    )}

                    {errors?.documents?.[index]?.url?.message && (
                      <p className="text-xs text-destructive">
                        {errors.documents[index].url.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addDocument}
          className="w-full bg-transparent"
        >
          + Add Another Document
        </Button>
      </CardContent>
    </Card>
  );
}
