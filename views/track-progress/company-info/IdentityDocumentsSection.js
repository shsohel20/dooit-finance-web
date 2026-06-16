"use client";

import { useState } from "react";
import { useFieldArray, useWatch, Controller } from "react-hook-form";
import CustomDropZone from "@/components/ui/DropZone";
import { fileUploadOnCloudinary } from "@/app/actions";
import CustomSelect from "@/components/ui/CustomSelect";
import { Label } from "@/components/ui/label";
import { DOCUMENT_TYPES } from "./constants";

export default function IdentityDocumentsSection({ form, basePath = "" }) {
  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);

  const documentsPath = basePath ? `${basePath}.documents` : "documents";
  const documentTypePath = basePath ? `${basePath}.document_type` : "document_type";

  const { fields, append, update } = useFieldArray({
    control: form.control,
    name: documentsPath,
  });

  const documentType = useWatch({
    control: form.control,
    name: documentTypePath,
  });

  const uploadDocument = async (file, side, setLoading, setError) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fileUploadOnCloudinary(file);
      if (response.success) {
        const existingIndex = fields.findIndex((item) => item.type === side);
        const docPayload = {
          name: file.name,
          url: response.file.publicUrl,
          mimeType: file.type,
          type: side,
          docType: documentType?.value || documentType,
        };
        if (existingIndex !== -1) {
          update(existingIndex, { ...fields[existingIndex], ...docPayload });
        } else {
          append(docPayload);
        }
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t border-border">
      {/* <p className="text-sm font-medium text-foreground">Identity documents</p> */}
      <Controller
        control={form.control}
        name={documentTypePath}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label>
              Document type
              <span className="text-destructive ml-1">*</span>
            </Label>
            <CustomSelect
              options={DOCUMENT_TYPES}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select document type"
            />
          </div>
        )}
      />
      <div className="flex flex-col gap-3">
        <CustomDropZone
          handleChange={(file) => uploadDocument(file, "front", setFrontLoading, setFrontError)}
          disabled={!documentType}
          loading={frontLoading}
          url={fields.find((field) => field.type === "front")?.url}
          error={frontError}
        >
          <div className="text-center">
            <p className="font-medium text-sm">Front of document</p>
            <p className="text-xs text-muted-foreground">
              Drag and drop your document here or click to upload
            </p>
          </div>
        </CustomDropZone>
        {documentType?.sides === 2 && (
          <CustomDropZone
            handleChange={(file) => uploadDocument(file, "back", setBackLoading, setBackError)}
            disabled={!documentType}
            loading={backLoading}
            url={fields.find((field) => field.type === "back")?.url}
            error={backError}
          >
            <div className="text-center">
              <p className="font-medium text-sm">Back of document</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop your document here or click to upload
              </p>
            </div>
          </CustomDropZone>
        )}
      </div>
    </div>
  );
}
