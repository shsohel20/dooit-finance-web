"use client";
import React, { useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Loader2, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomDropZone from "@/components/ui/DropZone";
import CustomInput from "@/components/ui/CustomInput";
import FormTitle from "@/views/customer-registration/common/FormTitle";
import { fileUploadOnCloudinary } from "@/app/actions";
import { ocrStaffDocument } from "@/app/dashboard/client/onboarding/customer-queue/actions";
import { countries } from "@/lib/country";
import { countriesData } from "@/constants";
import { getCardTypesByCountryId } from "@/lib/card-type";

const CustomSelect = dynamic(() => import("@/components/ui/CustomSelect"), { ssr: false });

// OCR dates arrive as "12 JAN 1990" — convert to the form's YYYY-MM-DD.
function formatOcrDate(dateString) {
  if (!dateString) return "";
  const [day, mon, year] = dateString.split(" ");
  const months = {
    JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
    JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
  };
  const month = months[mon];
  if (!month) return "";
  return `${year}-${month}-${day?.padStart(2, "0")}`;
}

const DocumentsStep = ({ form, onExtracted }) => {
  const { control, setValue } = form;
  const errors = form.formState.errors;

  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);
  const [selfieLoading, setSelfieLoading] = useState(false);
  const [selfieError, setSelfieError] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const docCountry = useWatch({ control, name: "doc_country" });
  const documentType = useWatch({ control, name: "document_type" });
  const selfie = useWatch({ control, name: "selfie" });

  const { fields, append, update, remove } = useFieldArray({ control, name: "documents" });
  const frontDoc = fields.find((f) => f.type === "front");
  const backDoc = fields.find((f) => f.type === "back");

  const uploadSide = async (file, side, setLoading, setError) => {
    setLoading(true);
    try {
      const response = await fileUploadOnCloudinary(file);
      if (response.success) {
        setError(false);
        const existingIndex = fields.findIndex((item) => item.type === side);
        const doc = {
          name: file.name,
          url: response.file.publicUrl,
          mimeType: file.type,
          type: side,
          docType: documentType?.value,
        };
        if (existingIndex !== -1) {
          update(existingIndex, { ...fields[existingIndex], ...doc });
        } else {
          append(doc);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(`${side} upload error`, error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfieChange = async (file) => {
    setSelfieLoading(true);
    try {
      const response = await fileUploadOnCloudinary(file);
      if (response.success) {
        setSelfieError(false);
        setValue("selfie", {
          name: file.name,
          url: response.file.publicUrl,
          mimeType: file.type,
        });
      } else {
        setSelfieError(true);
      }
    } catch (error) {
      console.error("Selfie upload error", error);
      setSelfieError(true);
    } finally {
      setSelfieLoading(false);
    }
  };

  const handleDocumentTypeChange = (option, onChange) => {
    onChange(option);
    setFrontError(false);
    setBackError(false);
    remove(); // clear all uploaded sides — the doc type they belong to changed
    setValue("ocr", null); // drop OCR extracted from the previous document
  };

  const applyOcrFields = (ocrFields) => {
    const fullNameParts = ocrFields.full_name?.trim().split(/\s+/) ?? [];
    const given_name = fullNameParts[0] || ocrFields.given_name || "";
    const middle_name =
      fullNameParts.length > 2 ? fullNameParts.slice(1, -1).join(" ") : ocrFields.middle_name || "";
    const surname =
      fullNameParts.length > 1 ? fullNameParts[fullNameParts.length - 1] : ocrFields.surname || "";

    if (given_name) setValue("customer_details.given_name", given_name);
    if (middle_name) setValue("customer_details.middle_name", middle_name);
    if (surname) setValue("customer_details.surname", surname);

    const dob = ocrFields.date_of_birth ? formatOcrDate(ocrFields.date_of_birth) : "";
    if (dob) setValue("customer_details.date_of_birth", dob);

    const address = ocrFields.address || ocrFields.permanent_address || "";
    if (address) setValue("residential_address.address", address);

    const breakdown = ocrFields.address_breakdown || {};
    if (breakdown.street) setValue("residential_address.street", breakdown.street);
    if (breakdown.state) setValue("residential_address.state", breakdown.state);
    if (breakdown.postcode) {
      setValue("residential_address.postcode", breakdown.postcode);
      setValue("residential_address.zip_code", breakdown.postcode);
    }
    if (breakdown.country) {
      const match = countriesData.find(
        (c) => c.value.toLowerCase() === String(breakdown.country).toLowerCase(),
      );
      if (match) setValue("residential_address.country", match);
    }

    if (ocrFields.document_number) setValue("identificationNo", ocrFields.document_number);
  };

  const handleExtract = async () => {
    if (!frontDoc?.url) return;
    setExtracting(true);
    try {
      const payload = {
        cardType: documentType?.value,
        documents: [
          { url: frontDoc.url, docType: "id_front" },
          ...(documentType?.sides === 2 && backDoc?.url
            ? [{ url: backDoc.url, docType: "id_back" }]
            : []),
        ],
      };
      const response = await ocrStaffDocument(payload);
      if (response?.success && response.data?.ocr?.fields) {
        applyOcrFields(response.data.ocr.fields);
        // Keep the raw OCR result so it's submitted with the import and shown
        // on the customer details page (not just used to pre-fill the form).
        setValue("ocr", response.data.ocr);
        toast.success("Document data extracted — review the pre-filled fields");
        onExtracted?.();
      } else {
        toast.error(response?.message || response?.error || "OCR extraction failed");
      }
    } catch (error) {
      console.error("OCR extract error", error);
      toast.error("OCR extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  const documentsAdded = documentType?.sides === 2 ? fields.length === 2 : fields.length === 1;

  return (
    <div className="mt-4 space-y-6">
      <div>
        <FormTitle>Identification Documents</FormTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Upload the customer&apos;s ID and extract their details, or skip ahead and fill the form
          manually.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-3">
        <Controller
          control={control}
          name="doc_country"
          render={({ field }) => (
            <CustomSelect
              label="Document Country"
              placeholder="Select country"
              options={countries}
              value={field.value}
              onChange={(option) => {
                field.onChange(option);
                setValue("document_type", null);
                remove();
              }}
              error={errors.doc_country?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="document_type"
          render={({ field }) => (
            <CustomSelect
              label="Document Type"
              placeholder="Select document type"
              options={getCardTypesByCountryId(docCountry?.id) || []}
              value={field.value}
              onChange={(option) => handleDocumentTypeChange(option, field.onChange)}
              error={errors.document_type?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="identificationNo"
          render={({ field }) => (
            <CustomInput
              label="Document / ID Number"
              placeholder="Auto-filled from OCR or type manually"
              {...field}
              error={errors.identificationNo?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CustomDropZone
          handleChange={(file) => uploadSide(file, "front", setFrontLoading, setFrontError)}
          disabled={!documentType}
          loading={frontLoading}
          url={frontDoc?.url}
          error={frontError}
        >
          <div className="flex flex-col">
            <p className="font-bold">Front of document</p>
            <p className="text-xs text-muted-foreground">
              Drag and drop the document here or click to upload
            </p>
          </div>
        </CustomDropZone>

        {documentType?.sides === 2 && (
          <CustomDropZone
            handleChange={(file) => uploadSide(file, "back", setBackLoading, setBackError)}
            disabled={!documentType}
            loading={backLoading}
            url={backDoc?.url}
            error={backError}
          >
            <div className="flex flex-col">
              <p className="font-bold">Back of document</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop the document here or click to upload
              </p>
            </div>
          </CustomDropZone>
        )}

        <CustomDropZone
          handleChange={handleSelfieChange}
          loading={selfieLoading}
          url={selfie?.url}
          error={selfieError}
        >
          <div className="flex flex-col">
            <p className="font-bold">Customer photo / selfie (recommended)</p>
            <p className="text-xs text-muted-foreground">
              Used by the identity check — without it the verification may stay incomplete
            </p>
          </div>
        </CustomDropZone>
      </div>

      {documentsAdded && (
        <div className="flex justify-center">
          <Button onClick={handleExtract} disabled={extracting} className="w-[260px]">
            {extracting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Extracting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ScanLine className="size-4" /> Extract Data From Document
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentsStep;
