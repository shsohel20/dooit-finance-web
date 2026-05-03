import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { getBranches } from "@/app/dashboard/client/branch/actions";
import { assignModuleAccess } from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { toast } from "sonner";
import { getAllClients } from "@/app/dashboard/client/list/actions";
import { getAllRoles } from "@/app/dashboard/client/user-and-role-management/actions";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import useGetUser from "@/hooks/useGetUser";
import BulkAccessForm from "./BulkAccessForm";

export default function ModuleAccessForm({ addOpen, setAddOpen, selectedModule }) {
  const [formClient, setFormClient] = useState("");
  const [formBranch, setFormBranch] = useState("none");
  const { loggedInUser } = useGetUser();
  const isClient = loggedInUser?.userType === "client";
  const isDooit = loggedInUser?.userType === "dooit";
  const [formRoles, setFormRoles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [bulkAccessFormOpen, setBulkAccessFormOpen] = useState(false);

  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const form = useForm({
    defaultValues: {
      client: isClient ? loggedInUser?.client?._id : "",
      branch: "none",
      roles: [],
    },
    // resolver: zodResolver(
    //   z.object({
    //     client: z.string().required(),
    //     branch: z.string().optional(),
    //     roles: z.array(z.string()).optional(),
    //   }),
    // ),
  });

  const getClients = async () => {
    const res = await getAllClients(1, 100);

    setClients(res?.data?.clients || res?.data || []);
  };
  const getAllBranches = async (clientId) => {
    const res = await getBranches(clientId);
    console.log("branches res", res);
    setBranches(res?.data || []);
  };
  const getRoles = async () => {
    const res = await getAllRoles();

    setRoles(res?.data || []);
  };
  useEffect(() => {
    getClients();

    getRoles();
    if (isClient) {
      getAllBranches(loggedInUser?.client?._id);
    }
  }, []);
  const handleAdd = async (data) => {
    if (!data?.client) return;
    setIsAdding(true);
    const payload = {
      ...data,
      roles: formRoles,
    };
    console.log("payload", JSON.stringify(payload, null, 2));
    const res = await assignModuleAccess(selectedModule._id, payload);
    setIsAdding(false);
    if (res.success !== false && !res.error) {
      const { inserted = 0, skipped = 0, autoAssigned = 0 } = res;
      toast.success(
        `Access assigned. ${inserted} added, ${skipped} skipped, ${autoAssigned} learners auto-enrolled.`,
      );
      setAddOpen(false);
    } else {
      toast.error(res.message || "Failed to assign access");
    }
  };
  const toggleRole = (roleId) =>
    setFormRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId],
    );
  const roleName = (id) => roles.find((r) => r._id === id)?.name || id;
  return (
    <Dialog
      open={addOpen}
      onOpenChange={(open) => {
        setAddOpen(open);
      }}
    >
      {bulkAccessFormOpen ? (
        <BulkAccessForm
          bulkOpen={bulkAccessFormOpen}
          setBulkOpen={setBulkAccessFormOpen}
          selectedModule={selectedModule}
        />
      ) : (
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Add Access Scope
            </DialogTitle>
            <DialogDescription>
              Grant a client/branch combination access to{" "}
              <span className="font-semibold text-foreground">{selectedModule?.title}</span>.
              Matching active users will be auto-enrolled.
            </DialogDescription>
          </DialogHeader>
          {/* <BulkAccessForm />:{" "} */}
          <div className="space-y-5 pt-1">
            {isDooit && (
              <Button size="sm" onClick={() => setBulkAccessFormOpen(true)} variant="outline">
                Bulk Add Access
              </Button>
            )}
            {/* Client */}

            <div className="space-y-2">
              <FormField
                form={form}
                name="client"
                label="Client"
                required
                type="select"
                options={clients.map((c) => ({ label: c.name, value: c._id }))}
                placeholder="Select a client..."
                onChange={(value) => {
                  getAllBranches(value?.value);
                }}
                disabled={isClient}
              />
            </div>

            {/* Branch */}
            <FormField
              form={form}
              name="branch"
              label="Branch"
              required
              type="select"
              disabled={form.watch("client") === ""}
              options={branches.map((b) => ({ label: b.name, value: b._id }))}
              placeholder="Select a branch..."
            />

            {/* Roles */}
            <div className="space-y-2">
              <Label className="font-semibold">
                Roles{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (leave blank for all roles)
                </span>
              </Label>
              <div className="border border-border rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                {roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4">No roles found</p>
                ) : (
                  roles.map((role) => (
                    <label
                      key={role._id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0 transition-colors"
                    >
                      <Checkbox
                        checked={formRoles.includes(role._id)}
                        onCheckedChange={() => toggleRole(role._id)}
                      />
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{role.name}</span>
                    </label>
                  ))
                )}
              </div>
              {formRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formRoles.map((id) => (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10"
                      onClick={() => toggleRole(id)}
                    >
                      {roleName(id)} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setAddOpen(false)} disabled={isAdding}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(handleAdd)} disabled={isAdding} className="gap-2">
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isAdding ? "Assigning..." : "Assign Access"}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
