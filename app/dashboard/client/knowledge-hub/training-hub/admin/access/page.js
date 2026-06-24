"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Building2,
  GitBranch,
  Shield,
  Plus,
  Trash2,
  Users,
  ChevronDown,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { getModules, getModuleAccess, assignModuleAccess, deleteModuleAccess } from "../../actions";
import { getAllClients } from "@/app/dashboard/client/list/actions";
import { getBranches } from "@/app/dashboard/client/branch/actions";
import { getAllRoles } from "@/app/dashboard/client/user-and-role-management/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ModuleAccessPage() {
  // ── Static data ──────────────────────────────────────────────────────────
  const [modules, setModules] = useState([]);
  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);

  // ── Selected module + its access rules ──────────────────────────────────
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [accessRules, setAccessRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(false);

  // ── Add rule dialog state ────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [formClient, setFormClient] = useState("");
  const [formBranch, setFormBranch] = useState("none");
  const [formRoles, setFormRoles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  // ── Delete confirmation ──────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Bootstrap ───────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [mRes, cRes, bRes, rRes] = await Promise.all([
        getModules(),
        getAllClients(1, 100),
        getBranches(),
        getAllRoles(),
      ]);
      setModules(mRes?.data || []);
      // setClients(cRes?.data?.clients || cRes?.data || []);
      // setBranches(bRes?.data || []);
      setRoles(rRes?.data || []);
      setBootstrapLoading(false);
    })();
  }, []);

  // ── Fetch access rules when module changes ───────────────────────────────
  const fetchRules = useCallback(async (moduleId) => {
    if (!moduleId) return;
    setRulesLoading(true);
    const res = await getModuleAccess(moduleId);
    setAccessRules(res?.data || []);
    setRulesLoading(false);
  }, []);

  useEffect(() => {
    fetchRules(selectedModuleId);
  }, [selectedModuleId, fetchRules]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const toggleRole = (roleId) =>
    setFormRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId],
    );

  const resetForm = () => {
    setFormClient("");
    setFormBranch("none");
    setFormRoles([]);
  };

  const selectedModule = modules.find((m) => m._id === selectedModuleId);

  // ── Add access rule ──────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!formClient) return;
    setIsAdding(true);
    const payload = {
      client: formClient,
      ...(formBranch && formBranch !== "none" ? { branch: formBranch } : {}),
      roles: formRoles,
    };
    const res = await assignModuleAccess(selectedModuleId, payload);
    setIsAdding(false);
    if (res.success !== false && !res.error) {
      const { inserted = 0, skipped = 0, autoAssigned = 0 } = res;
      toast.success(
        `Access assigned. ${inserted} added, ${skipped} skipped, ${autoAssigned} learners auto-enrolled.`,
      );
      setAddOpen(false);
      resetForm();
      fetchRules(selectedModuleId);
    } else {
      toast.error(res.message || "Failed to assign access");
    }
  };

  // ── Delete access rule ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteModuleAccess(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success !== false && !res.error) {
      toast.success("Access rule removed");
      fetchRules(selectedModuleId);
    } else {
      toast.error(res.message || "Failed to remove access rule");
    }
  };

  // ── Lookup helpers for display ───────────────────────────────────────────
  const clientName = (id) => clients.find((c) => c._id === id)?.name || id;
  const branchName = (id) => branches.find((b) => b._id === id)?.name || id;
  const roleName = (id) => roles.find((r) => r._id === id)?.name || id;

  return (
    <>
      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Access Rule</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this scope&apos;s access to the module. Existing learner assignments
              are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add rule dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) resetForm();
        }}
      >
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

          <div className="space-y-5 pt-1">
            {/* Client */}
            <div className="space-y-2">
              <Label className="font-semibold">
                Client <span className="text-destructive">*</span>
              </Label>
              <Select value={formClient} onValueChange={setFormClient}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label className="font-semibold">
                Branch <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Select value={formBranch} onValueChange={setFormBranch}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All branches</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        {b.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Button onClick={handleAdd} disabled={!formClient || isAdding} className="gap-2">
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
      </Dialog>

      {/* Page */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Module Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control which organisations and roles can see each training module
          </p>
        </div>

        {/* Module selector */}
        <Card className="border-border">
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold">Select Module</Label>
                {bootstrapLoading ? (
                  <Skeleton className="h-11 w-full" />
                ) : (
                  <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a module to manage its access rules..." />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((m) => (
                        <SelectItem key={m._id} value={m._id}>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>{m.title}</span>
                            <Badge variant="outline" className="ml-1 text-xs py-0 capitalize">
                              {m.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {selectedModuleId && (
                <Button
                  className="gap-2 sm:self-end sm:mb-0 sm:mt-6"
                  onClick={() => setAddOpen(true)}
                  disabled={bootstrapLoading}
                >
                  <Plus className="w-4 h-4" />
                  Add Access Rule
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Access Rules */}
        {!selectedModuleId ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Select a Module</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Choose a training module above to view and manage its access scopes.
              </p>
            </CardContent>
          </Card>
        ) : rulesLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <Card className="border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Access Rules
                    <Badge variant="secondary" className="font-normal">
                      {accessRules.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Organisations and roles permitted to access{" "}
                    <span className="font-medium text-foreground">{selectedModule?.title}</span>
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {accessRules.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No access rules yet.</p>
                  <p className="text-xs mt-1">
                    Add a scope so the right organisations can see this module.
                  </p>
                  <Button size="sm" className="gap-2 mt-4" onClick={() => setAddOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Add First Rule
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Auto-enrolled</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessRules.map((rule) => {
                        const cName =
                          typeof rule.client === "object"
                            ? rule.client?.name
                            : clientName(rule.client);
                        const bName = rule.branch
                          ? typeof rule.branch === "object"
                            ? rule.branch?.name
                            : branchName(rule.branch)
                          : null;
                        const ruleRoles =
                          rule.roles?.length > 0
                            ? rule.roles.map((r) => (typeof r === "object" ? r.name : roleName(r)))
                            : null;

                        return (
                          <TableRow key={rule._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium text-sm text-foreground">
                                  {cName || "—"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {bName ? (
                                <div className="flex items-center gap-2">
                                  <GitBranch className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  <span className="text-sm text-foreground">{bName}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  All branches
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {ruleRoles ? (
                                <div className="flex flex-wrap gap-1">
                                  {ruleRoles.map((r) => (
                                    <Badge key={r} variant="secondary" className="text-xs">
                                      {r}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Users className="w-3.5 h-3.5" />
                                  All roles
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {rule.autoAssigned != null ? (
                                <Badge variant="outline" className="gap-1 text-xs">
                                  <Users className="w-3 h-3" />
                                  {rule.autoAssigned}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteTarget(rule)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">How access scopes work:</span>{" "}
                  Each rule grants a client (and optionally a branch) access to the module. If roles
                  are left blank, all roles within the scope are permitted.
                </p>
                <p>
                  When a new scope is saved, every active user matching the client/branch/role
                  criteria is automatically enrolled as a <em>pending</em> assignment. Duplicate
                  enrollments are silently skipped.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
