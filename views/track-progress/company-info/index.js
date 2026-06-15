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
  { label: "Passport", value: "Passport", sides: 1 },
  { label: "Driving License", value: "Driving License", sides: 2 },
  { label: "National ID", value: "National ID", sides: 2 },
];

const emptyPerson = () => ({
  name: "",
  email: "",
  phone: "",
  document_type: "",
  documents: [],
});

const emptyRoleAssignment = () => ({
  roleId: "",
  people: [],
});

function IdentityDocumentsSection({ form, basePath }) {
  const [frontLoading, setFrontLoading] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [backError, setBackError] = useState(false);

  const documentsPath = `${basePath}.documents`;
  const documentTypePath = `${basePath}.document_type`;

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

function PersonEntry({ form, roleIndex, personIndex, onRemove }) {
  const basePath = `roleAssignments.${roleIndex}.people.${personIndex}`;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Person {personIndex + 1}</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <FormField
        form={form}
        name={`${basePath}.name`}
        label="Full name"
        type="text"
        placeholder="Enter full name"
        required
      />
      <FormField
        form={form}
        name={`${basePath}.email`}
        label="Email"
        type="email"
        placeholder="name@company.com"
        required
      />
      <FormField
        form={form}
        name={`${basePath}.phone`}
        label="Phone"
        type="text"
        placeholder="Enter phone number"
        required
      />
      <IdentityDocumentsSection form={form} basePath={basePath} />
    </div>
  );
}

function RoleSection({ form, roleIndex, roleOptions, rolesLoading, onRemove }) {
  const peoplePath = `roleAssignments.${roleIndex}.people`;
  const roleIdPath = `roleAssignments.${roleIndex}.roleId`;

  const selectedRoleId = useWatch({
    control: form.control,
    name: roleIdPath,
  });

  const allAssignments = useWatch({
    control: form.control,
    name: "roleAssignments",
  });

  const selectedRoleIds = (allAssignments || [])
    .map((assignment, index) => (index !== roleIndex ? assignment?.roleId : null))
    .filter(Boolean);

  const availableRoleOptions = roleOptions.filter(
    (option) => !selectedRoleIds.includes(option.value) || option.value === selectedRoleId,
  );

  const selectedRoleLabel =
    roleOptions.find((option) => option.value === selectedRoleId)?.label || "Role assignment";

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: peoplePath,
  });

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{selectedRoleLabel}</CardTitle>
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
          name={roleIdPath}
          label="Role"
          type="select"
          placeholder="Select a role"
          required
          loading={rolesLoading}
          options={availableRoleOptions}
        />

        {selectedRoleId && (
          <div className="space-y-3">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">No people added for this role yet.</p>
            )}
            {fields.map((field, personIndex) => (
              <PersonEntry
                key={field.id}
                form={form}
                roleIndex={roleIndex}
                personIndex={personIndex}
                onRemove={() => remove(personIndex)}
              />
            ))}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-teal-600 hover:text-teal-700 font-medium"
              onClick={() => append(emptyPerson())}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add person
            </Button>
          </div>
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
      roleAssignments: [],
    },
  });

  const {
    fields: roleFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "roleAssignments",
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

  const canAddRole = !rolesLoading && roleFields.length < roleOptions.length;

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
              Choose a role, then add one or more people with their details and identity documents.
            </p>
          </div>

          {rolesLoading && roleFields.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading roles...
            </div>
          ) : (
            <>
              {roleFields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No roles assigned yet. Add a role to get started.
                </p>
              )}
              {roleFields.map((field, roleIndex) => (
                <RoleSection
                  key={field.id}
                  form={form}
                  roleIndex={roleIndex}
                  roleOptions={roleOptions}
                  rolesLoading={rolesLoading}
                  onRemove={() => remove(roleIndex)}
                />
              ))}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-teal-600 hover:text-teal-700 font-medium"
                onClick={() => append(emptyRoleAssignment())}
                disabled={!canAddRole}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add role
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
