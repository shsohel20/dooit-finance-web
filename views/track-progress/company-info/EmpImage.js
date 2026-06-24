import { fileUploadOnCloudinary } from "@/app/actions";
import CustomDropZone from "@/components/ui/DropZone";
import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

export default function EmpImage({ form }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  const uploadDocument = async (file) => {
    try {
      setLoading(true);
      setError(false);
      const response = await fileUploadOnCloudinary(file);
      if (response.success) {
        const imageDoc = {
          name: file.name,
          url: response.file.publicUrl,
          mimeType: file.type,
          type: "image",
          docType: "employee_image",
        };
        setFile(imageDoc);
        const isAlreadyExists = fields.find((doc) => doc.type === "image");
        if (isAlreadyExists) {
          remove(isAlreadyExists.id);
        }
        append(imageDoc);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <CustomDropZone handleChange={uploadDocument} loading={loading} url={file?.url} error={error}>
        <div className="text-center">
          <p className="font-medium text-xs ">Employee Image</p>
          <p className="text-xs text-muted-foreground">
            Drag and drop your employee image here or click to upload
          </p>
        </div>
      </CustomDropZone>
    </div>
  );
}
