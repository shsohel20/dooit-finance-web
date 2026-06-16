"use client";

import { useEffect } from "react";
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
import { createEmployee } from "../actions";
import { toast } from "sonner";

const personSchema = z.object({
  personal: z.object({
    role: z.string().min(1),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationality: z.string().min(1, "Nationality is required"),
  }),
  contact: z.object({
    workEmail: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    residentialAddress: z.string().min(1, "Residential address is required"),
  }),
  employment: z.object({
    startDate: z.string().min(1, "Start date is required"),
    department: z.string().min(1, "Department is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    employmentType: z.string().min(1, "Employment type is required"),
  }),
  document_type: z.any().optional(),
  documents: z.array(z.any()).optional(),
});

export default function AddPersonModal({
  open,
  onOpenChange,
  roleSlug,
  roleLabel,
  initialData,
  onSave,
}) {
  const isEditing = Boolean(initialData);

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
        jobTitle: normalizeSelectValue(data.employment.jobTitle),
        employmentType: normalizeSelectValue(data.employment.employmentType),
      },
    };
    const response = await createEmployee(payload);
    if (response.success) {
      toast.error(response.error || "Failed to create employee");
    } else {
      toast.success("Employee created successfully");
      handleOpenChange(false);
    }
    console.log("employee response", response);
    // onSave(payload);
    // handleOpenChange(false);
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmployeeFormFields form={form} />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
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
