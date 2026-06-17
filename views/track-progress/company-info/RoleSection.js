"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddPersonModal from "./AddPersonModal";
import PersonCard from "./PersonCard";
import { toRoleSlug } from "./constants";
import { getStuffsByRole } from "../actions";

export default function RoleSection({ form, roleIndex, roleOptions, rolesLoading, onRemove }) {
  const peoplePath = `roleAssignments.${roleIndex}.people`;
  const roleIdPath = `roleAssignments.${roleIndex}.roleId`;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [stuffs, setStuffs] = useState([]);

  const selectedRoleId = useWatch({
    control: form.control,
    name: roleIdPath,
  });
  console.log("currentRoleId", selectedRoleId);

  const allAssignments = useWatch({
    control: form.control,
    name: "roleAssignments",
  });

  useEffect(() => {
    if (selectedRoleId) {
      getStuffsByRole(selectedRoleId).then((res) => {
        console.log("res", res);
        setStuffs(res.data);
      });
    }
  }, [selectedRoleId]);

  const selectedRoleIds = (allAssignments || [])
    .map((assignment, index) => (index !== roleIndex ? assignment?.roleId : null))
    .filter(Boolean);

  const availableRoleOptions = roleOptions.filter(
    (option) => !selectedRoleIds.includes(option.value) || option.value === selectedRoleId,
  );

  const selectedRole = roleOptions.find((option) => option.value === selectedRoleId);
  const selectedRoleLabel = selectedRole?.label || "Role assignment";
  // const roleSlug = toRoleSlug(selectedRole?.label);

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: peoplePath,
  });

  const handleAddClick = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEditClick = (personIndex) => {
    setEditingIndex(personIndex);
    setModalOpen(true);
  };

  const handleSavePerson = (personData) => {
    if (editingIndex !== null) {
      update(editingIndex, personData);
    } else {
      append(personData);
    }
    setEditingIndex(null);
  };

  const editingPerson = editingIndex !== null ? fields[editingIndex] : null;

  return (
    <>
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
              {stuffs.length === 0 && (
                <p className="text-sm text-muted-foreground">No people added for this role yet.</p>
              )}
              {stuffs.map((field, personIndex) => (
                <PersonCard
                  key={field.id}
                  person={field}
                  index={personIndex}
                  onEdit={() => handleEditClick(personIndex)}
                  onRemove={() => remove(personIndex)}
                />
              ))}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-teal-600 hover:text-teal-700 font-medium"
                onClick={handleAddClick}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add person
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddPersonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        roleSlug={selectedRoleLabel}
        roleLabel={selectedRoleLabel}
        initialData={editingPerson}
        onSave={handleSavePerson}
      />
    </>
  );
}
