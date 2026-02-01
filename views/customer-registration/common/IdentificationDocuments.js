import React, { useState } from "react";
import FormTitle from "./FormTitle";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import CustomSelect from "@/components/ui/CustomSelect";
import { fileUploadOnCloudinary } from "@/app/actions";
import CustomDropZone from "@/components/ui/DropZone";
import { Button } from "@/components/ui/button";
import { getDataFromDocuments, verifyDocument } from "@/app/customer/registration/actions";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

const documentTypes = [
  { label: "Passport", value: "Passport" },
  { label: "Driving License", value: "Driving License" },
  { label: "Medical Card", value: "Medical Card" },
];

function formatDate(dateString) {
  if (!dateString) return "";

  const [day, mon, year] = dateString.split(" ");

  const months = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };

  const month = months[mon];
  if (!month) return ""; // invalid month

  const formattedDate = `${year}-${month}-${day.padStart(2, "0")}`;
  console.log("formattedDate", formattedDate);
  return formattedDate;
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
const Scanner = () => {
  return <div className="scanner-effect absolute top-0 left-0 w-full h-full" />;
};
const IdentificationDocuments = ({
  control,
  errors,
  setValue,
  setVerifyingStatus,
  setVerifiedMsg,
}) => {
  const [livenessVerdict, setLivenessVerdict] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  //front
  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [frontFile, setFrontFile] = useState(null);
  const [frontBase64, setFrontBase64] = useState(null);
  //back
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);
  const [userFrontImage, setUserFrontImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "documents",
  });
  const documentTypeValue = useWatch({
    control,
    name: "document_type",
  });

  useEffect(() => {
    const live_photo = localStorage.getItem("live_photo");
    if (live_photo) {
      setUserFrontImage(live_photo);
    }
  }, []);
  useEffect(() => {
    const livenessVerdict = localStorage.getItem("liveness_verdict");
    if (livenessVerdict) {
      setLivenessVerdict(livenessVerdict);
    }
  }, []);
  const handleFrontChange = async (file) => {
    setFrontFile(file);
    const base64 = await getBase64(file);
    setFrontBase64(base64.replace("data:image/jpeg;base64,", ""));
    setFrontLoading(true);
    try {
      const response = await fileUploadOnCloudinary(file);
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
    setBackLoading(true);
    try {
      const response = await fileUploadOnCloudinary(file);
      if (response.success) {
        setFrontError(false);
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
  const handleDocumentTypeChange = (e, onChange) => {
    onChange(e);
    setFrontError(false);
    setBackError(false);
    fields.forEach((field) => {
      remove(field.id);
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("image", frontFile);
    formData.append("card_type", documentTypeValue?.value);
    const live_photo = localStorage.getItem("live_photo")?.replace("data:image/jpeg;base64,", "");
    const verify_data = {
      app_id: 1,
      image_1: frontBase64,
      image_2: live_photo,
      hash: "",
    };
    let verifiedMsg = null;
    try {
      setIsSaving(true);
      // setVerifyingStatus("verifying");
      const verify_response = await verifyDocument(verify_data);
      console.log("verify-res", verify_response);

      const verification_status = verify_response.data?.result?.verification_status;
      console.log("verification status", verification_status);
      if (verification_status === 0) {
        toast.error("Documents are not verified. You can't proceed further.");
        setVerifyingStatus("idle");
        setIsSaving(false);

        return;
      } else {
        verifiedMsg = `Found ${verify_response.data?.result?.similarity}% similarity with the document`;

        if (verify_response?.error?.length > 0) {
          toast.error("Documents are not verified");
          setVerifyingStatus("idle");
          return;
        } else {
          const response = await getDataFromDocuments(formData);
          console.log("response", response);
          if (response.success) {
            // const formData = response.data;
            // const full_name = formData.full_name;
            // const given_name = full_name ? formData.full_name?.split(" ")[0] : formData?.given_name;
            // const middle_name = full_name ? formData.full_name?.split(" ")[1] : formData?.middle_name;
            // const surname = full_name ? formData.full_name?.split(" ")[2] : formData?.surname;

            // //23-dec-1990 to yyyy-mm-dd
            // const date_of_birth = formatDate(formData.date_of_birth);
            // setValue("customer_details.given_name", given_name || "");
            // setValue("customer_details.middle_name", middle_name || "");
            // setValue("customer_details.surname", surname || "");
            // setValue("residential_address.address", formData.address || formData?.permanent_address);
            // setValue("customer_details.date_of_birth", date_of_birth);
            const formData = response.data ?? {};

            const fullNameParts = formData.full_name?.trim().split(/\s+/) ?? [];

            const given_name = fullNameParts[0] || formData.given_name || "";

            const middle_name =
              fullNameParts.length > 2
                ? fullNameParts.slice(1, -1).join(" ")
                : formData.middle_name || "";

            const surname =
              fullNameParts.length > 1
                ? fullNameParts[fullNameParts.length - 1]
                : formData.surname || "";

            const date_of_birth = formData.date_of_birth ? formatDate(formData.date_of_birth) : "";

            setValue("customer_details.given_name", given_name);
            setValue("customer_details.middle_name", middle_name);
            setValue("customer_details.surname", surname);
            setValue(
              "residential_address.address",
              formData.address || formData.permanent_address || "",
            );
            setValue("customer_details.date_of_birth", date_of_birth);
            setVerifyingStatus("verified");
          } else {
            setVerifyingStatus("verified");
          }
        }
      }
    } catch (error) {
      setVerifyingStatus("verified");
      toast.error("Failed to save identification documents");
    } finally {
      setIsSaving(false);
      setVerifiedMsg(verifiedMsg);
    }
  };
  const documentsAdded = fields.length === 2;
  return (
    <div className="mt-4 space-y-4">
      <div>
        {livenessVerdict ? (
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Liveness verification successful</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Liveness verification failed</AlertDescription>
          </Alert>
        )}
      </div>
      <div>
        <FormTitle>Identification Documents</FormTitle>
        <div className="max-w-56 my-4 relative z-3">
          <Controller
            control={control}
            name="document_type"
            render={({ field }) => (
              <CustomSelect
                label="Select Document Type"
                options={documentTypes}
                value={field.value}
                placeholder="Select Document Type"
                error={errors.document_type?.message}
                onChange={(e) => handleDocumentTypeChange(e, field.onChange)}
              />
            )}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <CustomDropZone
              handleChange={handleFrontChange}
              disabled={!documentTypeValue}
              loading={frontLoading}
              url={fields.find((field) => field.type === "front")?.url}
              error={frontError}
            >
              <p className="font-bold">Front of document</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your document here or click to upload
              </p>
            </CustomDropZone>
          </div>
          <div className="w-full">
            <CustomDropZone
              disabled={!documentTypeValue}
              handleChange={handleBackChange}
              loading={backLoading}
              url={fields.find((field) => field.type === "back")?.url}
              error={backError}
            >
              <p className="font-bold">Back of document</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your document here or click to upload
              </p>
            </CustomDropZone>
          </div>
        </div>
      </div>
      {documentsAdded && (
        <div>
          <div className="flex gap-4 max-w-xl mx-auto">
            <div className="w-full aspect-4/3 rounded-md overflow-hidden border bg-gradient-to-b from-green-500 to-green-300 relative">
              {isSaving && <Scanner />}
              <img
                src={userFrontImage}
                alt="user front image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full aspect-4/3 rounded-md overflow-hidden border relative">
              {isSaving && <Scanner />}
              <img
                src={fields.find((field) => field.type === "front")?.url}
                alt="document front"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="py-6 flex justify-center">
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Please wait..." : "Verify Documents"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentificationDocuments;
