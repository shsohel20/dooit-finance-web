"use client";
import { fileUploadOnCloudinary } from "@/app/actions";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDropZone from "@/components/ui/DropZone";
import React, { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
const documentTypes = [
  { label: "Trade License", value: "Trade License" },
  { label: "Tax Registration Certificate", value: "Tax Registration Certificate" },
  { label: "Company Registration Certificate", value: "Company Registration Certificate" },
];

export default function IdentificationDocuments({ control }) {
  const [documentType, setDocumentType] = useState(null);
  //front
  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [frontFile, setFrontFile] = useState(null);
  // const [frontBase64, setFrontBase64] = useState(null);
  //back
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);
  const [backFile, setBackFile] = useState(null);
  const [userFrontImage, setUserFrontImage] = useState(null);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "documents",
  });
  const documentTypeValue = useWatch({
    control,
    name: "company_details.document_type",
  });

  const handleFrontChange = async (file) => {
    try {
      const response = await fileUploadOnCloudinary(file);
      console.log("response", response);
      if (response.success) {
        setFrontError(false);
        const existingFrontIndex = fields.findIndex((item) => item.type === "front");
        if (existingFrontIndex !== -1) {
          update(existingFrontIndex, {
            ...fields[existingFrontIndex],
            name: file.name,
            url: response.file.publicUrl,
            mimeType: file.type,
          });
        } else {
          append({
            name: file.name,
            url: response.file.publicUrl,
            mimeType: file.type,
            type: "front",
            docType: documentTypeValue?.value,
          });
        }
      } else {
        setFrontError(true);
      }
    } catch (error) {
      console.error("Front change error", error);
      setFrontError(true);
    } finally {
      setFrontLoading(false);
    }
  };
  const handleBackChange = async (file) => {
    try {
      setBackLoading(true);
      const response = await fileUploadOnCloudinary(file);
      if (response.success) {
        setBackError(false);
        const existingBackIndex = fields.findIndex((item) => item.type === "back");
        if (existingBackIndex !== -1) {
          update(existingBackIndex, {
            ...fields[existingBackIndex],
            name: file.name,
            url: response.file.publicUrl,
            mimeType: file.type,
          });
        } else {
          append({
            name: file.name,
            url: response.file.publicUrl,
            mimeType: file.type,
            type: "back",
            docType: documentTypeValue?.value,
          });
        }
      } else {
        setBackError(true);
      }
    } catch (error) {
      console.error("Back change error", error);
      setBackError(true);
    } finally {
      setBackLoading(false);
    }
  };
  return (
    <div className="border p-4 mt-8 rounded-lg">
      <div className="max-w-[200px] z-3">
        <CustomSelect
          options={documentTypes}
          value={documentType}
          onChange={(value) => setDocumentType(value)}
        />
      </div>
      <div className="flex gap-4 mt-4 z-2">
        <div className="w-full">
          <CustomDropZone
            handleChange={handleFrontChange}
            disabled={!documentType}
            loading={frontLoading}
            url={fields.find((field) => field.type === "front")?.url}
            error={frontError}
            className=""
          >
            <div className="text-center">
              <p className="font-bold">Front of document</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop your document here or click to upload
              </p>
            </div>
          </CustomDropZone>
        </div>
        <div className="w-full">
          <CustomDropZone
            disabled={!documentType}
            handleChange={handleBackChange}
            loading={backLoading}
            url={fields.find((field) => field.type === "back")?.url}
            error={backError}
          >
            <div className="text-center">
              <p className="font-bold">Back of document</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop your document here or click to upload
              </p>
            </div>
          </CustomDropZone>
        </div>
      </div>
    </div>
  );
}
