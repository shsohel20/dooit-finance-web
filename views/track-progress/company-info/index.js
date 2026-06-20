"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { getAllRoles } from "@/app/dashboard/client/user-and-role-management/actions";
import RoleSection from "./RoleSection";
import { SECTOR_OPTIONS, emptyRoleAssignment } from "./constants";

export default function CompanyInfo({ setCurrentStep }) {
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
    const employees = data.roleAssignments.flatMap((assignment) =>
      assignment.people.map((person) => ({
        personal: person.personal,
        contact: person.contact,
        employment: person.employment,
      })),
    );
    console.log({ sector: data.sector, roleAssignments: data.roleAssignments, employees });
    setCurrentStep(2);
  };

  const canAddRole = !rolesLoading && roleFields.length < roleOptions.length;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8 py-6">
      {/* <div className="flex gap-4">
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
      </div> */}

      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
            01
          </div>
        </div>
        <div className="flex-1 space-y-4 pt-0.5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Assign roles</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose a role, then add one or more people with their personal, contact, and
              employment details.
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
                // variant="link"
                size="sm"
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
        <Button type="submit" size="sm">
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}
