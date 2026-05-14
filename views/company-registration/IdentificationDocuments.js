"use client";
import { fileUploadOnCloudinary } from "@/app/actions";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDropZone from "@/components/ui/DropZone";
import React, { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import Question from "../onboarding/Question";
import { getCardTypesByCountryId } from "@/lib/card-type";
import { Button } from "@/components/ui/button";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
const documentTypes = [
  { label: "Trade License", value: "Trade License" },
  { label: "Tax Registration Certificate", value: "Tax Registration Certificate" },
  { label: "Company Registration Certificate", value: "Company Registration Certificate" },
];

export default function IdentificationDocuments({ form }) {
  const [documentType, setDocumentType] = useState(null);
  //front
  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const { setStep } = useCustomerRegisterStore();
  const [frontFile, setFrontFile] = useState(null);
  // const [frontBase64, setFrontBase64] = useState(null);
  //back
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);
  const [backFile, setBackFile] = useState(null);
  const [userFrontImage, setUserFrontImage] = useState(null);
  const control = form.control;
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
  const handleContinue = () => {
    if (documentType) {
      form.setValue("document_type", documentType);
      setStep(7);
    }
  };
  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>Which ID would you like to use for verification?</Question>
        <div className="max-w-[600px] w-full mt-4">
          <CustomSelect
            options={getCardTypesByCountryId(form.watch("country")?.id) || []}
            value={form.watch("company_details.document_type")}
            onChange={(value) => setDocumentType(value)}
          />
        </div>
      </div>
      <div>
        <div className="flex  flex-col gap-4 mt-4 ">
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
        <Button onClick={handleContinue} className="w-full mt-4">
          Continue
        </Button>
      </div>
    </div>
  );
}
