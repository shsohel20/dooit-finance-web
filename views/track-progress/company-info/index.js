"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { getAllRoles } from "@/app/dashboard/client/user-and-role-management/actions";
import CustomDropZone from "@/components/ui/DropZone";
import { fileUploadOnCloudinary } from "@/app/actions";
import CustomSelect from "@/components/ui/CustomSelect";
import { Label } from "@/components/ui/label";

const SECTOR_OPTIONS = [
  { value: "conveyancing", label: "Conveyancing" },
  { value: "accounting", label: "Accounting" },
  { value: "legal", label: "Legal" },
  { value: "financial_services", label: "Financial Services" },
  { value: "real_estate", label: "Real Estate" },
];

const DOCUMENT_TYPES = [
  { label: "Passport", value: "Passport" },
  { label: "Driving License", value: "Driving License" },
  { label: "National ID", value: "National ID" },
];

const emptyPerson = () => ({
  role: "",
  name: "",
  email: "",
  phone: "",
  document_type: "",
  documents: [],
});

function IdentityDocumentsSection({ form, personIndex }) {
  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);

  const documentsPath = `people.${personIndex}.documents`;
  const documentTypePath = `people.${personIndex}.document_type`;

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
      <p className="text-sm font-medium text-foreground">Identity documents</p>
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
      </div>
    </div>
  );
}

function PersonCard({ form, index, roleOptions, rolesLoading, onRemove }) {
  const selectedRole = useWatch({
    control: form.control,
    name: `people.${index}.role`,
  });

  const roleLabel =
    roleOptions.find((option) => option.value === selectedRole)?.label || `Person ${index + 1}`;

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{roleLabel}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          form={form}
          name={`people.${index}.role`}
          label="Role"
          type="select"
          placeholder="Select a role"
          required
          loading={rolesLoading}
          options={roleOptions}
        />

        {selectedRole && (
          <>
            <FormField
              form={form}
              name={`people.${index}.name`}
              label="Full name"
              type="text"
              placeholder="Enter full name"
              required
            />
            <FormField
              form={form}
              name={`people.${index}.email`}
              label="Email"
              type="email"
              placeholder="name@company.com"
              required
            />
            <FormField
              form={form}
              name={`people.${index}.phone`}
              label="Phone"
              type="text"
              placeholder="Enter phone number"
              required
            />
            <IdentityDocumentsSection form={form} personIndex={index} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompanyInfo({ setInitialized }) {
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      sector: "",
      people: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "people",
  });

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      const response = await getAllRoles();
      setRoles(response?.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role._id,
  }));

  const onSubmit = (data) => {
    console.log(data);
    setInitialized(true);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
            01
          </div>
        </div>
        <div className="flex-1 space-y-3 pt-0.5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Select your sector</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Get a tailored experience to help you meet your AML/CTF obligations throughout the
              client onboarding process.
            </p>
          </div>
          <div className="max-w-xs">
            <FormField
              form={form}
              name="sector"
              label="Your sector"
              type="select"
              placeholder="Select a sector"
              required
              options={SECTOR_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
            02
          </div>
        </div>
        <div className="flex-1 space-y-4 pt-0.5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Assign roles</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Record the AML/CTF roles within your business. Select a role, then add each
              person&apos;s details and identity documents.
            </p>
          </div>

          {rolesLoading && fields.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading roles...
            </div>
          ) : (
            <>
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No people added yet. Add a person and assign them to a role.
                </p>
              )}
              {fields.map((field, index) => (
                <PersonCard
                  key={field.id}
                  form={form}
                  index={index}
                  roleOptions={roleOptions}
                  rolesLoading={rolesLoading}
                  onRemove={() => remove(index)}
                />
              ))}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-teal-600 hover:text-teal-700 font-medium"
                onClick={() => append(emptyPerson())}
                disabled={rolesLoading}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add person
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}
