import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Shield,
  ShieldCheck,
  Building2,
  GitBranch,
  Loader2,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBranches } from "@/app/dashboard/client/branch/actions";
import { assignModuleAccess } from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { toast } from "sonner";
import { getAllClients } from "@/app/dashboard/client/list/actions";
import { getAllRoles } from "@/app/dashboard/client/user-and-role-management/actions";
import useGetUser from "@/hooks/useGetUser";
import CustomSelect from "@/components/AsyncPaginatedSelect";

function newRowId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyRow(defaultClient = "") {
  return { id: newRowId(), client: defaultClient, branch: "none", roles: [] };
}

export default function BulkAccessForm({ bulkOpen, setBulkOpen, selectedModule, onSuccess }) {
  const { loggedInUser } = useGetUser();
  const isClient = loggedInUser?.userType === "client";
  const lockedClientId = isClient ? loggedInUser?.client?._id : "";

  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branchesByClient, setBranchesByClient] = useState({});
  const [rows, setRows] = useState([emptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setRows([emptyRow(lockedClientId)]);
    setBranchesByClient({});
  }, [lockedClientId]);

  const loadBranchesForClient = async (clientId) => {
    if (!clientId) return;
    const res = await getBranches(clientId);
    console.log("res", res);
    setBranchesByClient((prev) => ({ ...prev, [clientId]: res?.data || [] }));
  };

  useEffect(() => {
    if (!bulkOpen) return;
    (async () => {
      const [cRes, rRes] = await Promise.all([getAllClients(1, 100), getAllRoles()]);
      setClients(cRes?.data?.clients || cRes?.data || []);
      setRoles(rRes?.data || []);
    })();
  }, [bulkOpen]);

  useEffect(() => {
    if (!bulkOpen || !lockedClientId) return;
    setRows([emptyRow(lockedClientId)]);
    getBranches(lockedClientId).then((res) => {
      setBranchesByClient((prev) => ({ ...prev, [lockedClientId]: res?.data || [] }));
    });
  }, [bulkOpen, lockedClientId]);

  const updateRow = (index, patch) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const setClientForRow = async (index, e) => {
    const clientId = e?.target?.value;
    updateRow(index, { client: clientId, branch: "none" });
    if (clientId) await loadBranchesForClient(clientId);
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow(lockedClientId)]);

  const removeRow = (index) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const toggleRole = (rowIndex, roleId) => {
    setRows((prev) => {
      const next = [...prev];
      const r = next[rowIndex].roles;
      next[rowIndex] = {
        ...next[rowIndex],
        roles: r.includes(roleId) ? r.filter((x) => x !== roleId) : [...r, roleId],
      };
      return next;
    });
  };

  const roleName = (id) => roles.find((r) => r._id === id)?.name || id;

  const buildPayload = () =>
    rows
      .filter((r) => r.client)
      .map((r) => {
        const entry = {
          client: r.client,
          roles: r.roles || [],
        };
        if (r.branch && r.branch !== "none") {
          entry.branch = r.branch;
        }
        return entry;
      });

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (!selectedModule?._id) {
      toast.error("No module selected");
      return;
    }
    if (payload.length === 0) {
      toast.error("Add at least one row with a client selected");
      return;
    }
    setIsSubmitting(true);
    const res = await assignModuleAccess(selectedModule._id, payload);
    setIsSubmitting(false);
    if (res.success !== false && !res.error) {
      const { inserted = 0, skipped = 0, autoAssigned = 0 } = res;
      toast.success(
        `Bulk access assigned. ${inserted} added, ${skipped} skipped, ${autoAssigned} learners auto-enrolled.`,
      );
      setBulkOpen(false);
      resetForm();
      onSuccess?.();
    } else {
      toast.error(res.message || "Failed to assign bulk access");
    }
  };

  const branchOptionsFor = (clientId) => branchesByClient[clientId] || [];

  return (
    <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Bulk Add Access
        </DialogTitle>
        <DialogDescription>
          Add multiple access scopes for{" "}
          <span className="font-semibold text-foreground">{selectedModule?.title}</span>. Each row
          is sent as one object in the request array (client required; branch optional; empty roles
          means all roles). Matching active users will be auto-enrolled.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-1">
        <div>
          <Button size="sm" onClick={() => setBulkOpen(false)} variant="outline">
            Add Single Access
          </Button>
        </div>
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="rounded-xl border border-border bg-muted/20 p-4 space-y-4 relative"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Scope {index + 1}
              </span>
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={() => removeRow(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="">
                <Label className="">Client</Label>
                <CustomSelect
                  value={row.client}
                  onChange={(v) => setClientForRow(index, v)}
                  disabled={isClient || isSubmitting}
                  options={clients.map((c) => ({ label: c.name, value: c._id }))}
                  placeholder="Select a client..."
                />
              </div>

              <div className="space-y-2">
                <Label className="">Branch</Label>
                <CustomSelect
                  value={row.branch}
                  onChange={(v) => updateRow(index, { branch: v })}
                  disabled={!row.client || isSubmitting}
                  options={branchOptionsFor(row.client).map((b) => ({
                    label: b.name,
                    value: b._id,
                  }))}
                  placeholder="Select a branch..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">
                Roles{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (leave blank for all roles)
                </span>
              </Label>
              <div className="border border-border rounded-xl overflow-hidden max-h-[160px] overflow-y-auto bg-background">
                {roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4">No roles found</p>
                ) : (
                  roles.map((role) => (
                    <label
                      key={role._id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0 transition-colors"
                    >
                      <Checkbox
                        checked={row.roles.includes(role._id)}
                        onCheckedChange={() => toggleRole(index, role._id)}
                        disabled={isSubmitting}
                      />
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{role.name}</span>
                    </label>
                  ))
                )}
              </div>
              {row.roles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {row.roles.map((id) => (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10"
                      onClick={() => !isSubmitting && toggleRole(index, id)}
                    >
                      {roleName(id)} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={addRow}
          disabled={isSubmitting}
        >
          <Plus className="w-4 h-4" />
          Add another scope
        </Button>

        <div className="flex gap-3 justify-end pt-2 border-t border-border">
          <Button variant="outline" onClick={() => setBulkOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || buildPayload().length === 0}
            className="gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {isSubmitting ? "Assigning..." : "Assign bulk access"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
