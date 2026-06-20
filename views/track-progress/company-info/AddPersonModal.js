"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmployeeFormFields from "./EmployeeFormFields";
import { emptyPerson } from "./constants";
import { createEmployee, getStuffsByRole } from "../actions";
import { toast } from "sonner";

const personSchema = z.object({
  personal: z.object({
    role: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationality: z.string(),
  }),
  contact: z.object({
    workEmail: z.string(),
    phone: z.string(),
    residentialAddress: z.string(),
  }),
  employment: z.object({
    startDate: z.string(),
    department: z.string(),
    jobTitle: z.string(),
    employmentType: z.string(),
  }),
  document_type: z.any().optional(),
  documents: z.array(z.any()).optional(),
});

export default function AddPersonModal({
  open,
  onOpenChange,
  role,
  roleLabel,
  initialData,
  setStuffs,
}) {
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);

  const roleSlug = role?.label;
  const form = useForm({
    defaultValues: emptyPerson(roleSlug),
    resolver: zodResolver(personSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData ?? emptyPerson(roleSlug));
    }
  }, [open, initialData, roleSlug, form]);

  const handleOpenChange = (nextOpen) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset(emptyPerson(roleSlug));
    }
  };

  const normalizeSelectValue = (value) =>
    typeof value === "object" && value !== null ? value.value : value;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      personal: {
        ...data.personal,
        role: roleSlug,
        nationality: normalizeSelectValue(data.personal.nationality),
      },
      employment: {
        ...data.employment,
        department: normalizeSelectValue(data.employment.department),
        jobTitle: roleSlug ?? "",
        employmentType: normalizeSelectValue(data.employment.employmentType),
      },
      document_type: data.document_type?.value ?? {},
      documents: data.documents ?? [],
    };
    console.log("payload", JSON.stringify(payload, null, 2));
    setLoading(true);
    const response = await createEmployee(payload);

    setLoading(false);
    console.log("response", response);
    if (response.success) {
      toast.success("Employee created successfully");
      const response = await getStuffsByRole(role.value);
      setStuffs(response.data);
      handleOpenChange(false);
    } else {
      toast.error(response.error || "Failed to create employee");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[660px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit person" : "Add person"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update employee details for the ${roleLabel} role.`
              : `Enter employee details for the ${roleLabel} role.`}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <EmployeeFormFields form={form} />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} onClick={form.handleSubmit(onSubmit)}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add person"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
