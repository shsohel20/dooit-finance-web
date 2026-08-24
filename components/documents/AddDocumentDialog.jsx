"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { IconLoader2 } from "@tabler/icons-react";
import { fileUploadOnCloudinary } from "@/app/actions";

const DEFAULT_FILE_TYPES = ["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx"];

// Reusable "Add Document" dialog: uploads the file to Cloudinary and builds
// the base { name, url, mimeType, docType } payload, then hands persistence
// off to `onSave`. `onSave` may be sync or async and may return nothing
// (treated as success) or a { success, message, error } result — the dialog
// closes/resets and toasts on success, or toasts the error and stays open
// on an explicit `success: false`.
export default function AddDocumentDialog({
  open,
  setOpen,
  onSave,
  docTypeOptions,
  description,
  namePlaceholder,
  fileTypes = DEFAULT_FILE_TYPES,
}) {
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

      const payload = {
        name: name.trim() || file.name,
        url: publicUrl,
        mimeType: file.type || "application/octet-stream",
        docType,
      };

      const result = await onSave(payload);
      if (!result || result.success !== false) {
        toast.success(result?.message || "Document added");
        setOpen(false);
        reset();
      } else {
        toast.error(result?.error || result?.message || "Failed to add document");
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
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <CustomDropZone
          fileTypes={fileTypes}
          handleChange={handleFileChange}
          file={file}
          loading={saving}
          disabled={saving}
          setFile={setFile}
        />

        <div className="space-y-1.5">
          <Label className="font-bold">Document Name</Label>
          <Input
            placeholder={namePlaceholder}
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
              {docTypeOptions.map((o) => (
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
}
