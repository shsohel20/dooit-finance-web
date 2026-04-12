"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPermission,
  getAllPermissions,
  getAllUsers,
  getPermissionById,
  updatePermission,
} from "@/app/dashboard/client/user-and-role-management/actions";
import CustomSelect from "@/components/AsyncPaginatedSelect";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function normalizeRolePermissions(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((p) => (typeof p === "string" ? p : (p?.value ?? p?.name ?? ""))).filter(Boolean);
}

const NO_USER = "";

const PermissionDrawer = ({ open = true, onClose = () => {}, role, setRole }) => {
  const [allPermissions, setAllPermissions] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [permissionChecked, setPermissionChecked] = useState({});
  const [restrictedByModule, setRestrictedByModule] = useState({});
  const [restrictedByPermission, setRestrictedByPermission] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [roleData, setRoleData] = useState(null);

  const modules = useMemo(() => {
    const raw = allPermissions?.data ?? allPermissions;
    return Array.isArray(raw) ? raw : [];
  }, [allPermissions]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await getAllPermissions();
      setAllPermissions(res);
    };
    fetchPermissions();
  }, []);
  useEffect(() => {
    const fetchRoleData = async () => {
      if (!modules.length) return;
      const res = await getPermissionById(role._id);
      setRoleData(res?.data || null);
    };
    fetchRoleData();
  }, [role?._id, modules]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      const opts = (res?.data ?? []).map((user) => ({
        label: user.name,
        value: user._id,
      }));
      setUserOptions(opts);
    };
    fetchUsers();
  }, []);

  const applyRoleToModules = useCallback(() => {
    if (!roleData || !modules.length) return;
    const restrictedUsers = roleData?.restrictedUsers || [];
    const moduleRestrictedUsers = {};
    const permissionRestrictedUsers = {};
    const granted = new Set(normalizeRolePermissions(roleData?.permissions ?? []));
    const nextPerm = {};
    modules.forEach((mod) => {
      // nextModRestrict[mod.key] = NO_USER;
      (mod.permissions ?? []).forEach((p) => {
        nextPerm[p.value] = granted.has(p.value);
        // nextPermRestrict[p.value] = NO_USER;
      });
    });
    setPermissionChecked(nextPerm);
    restrictedUsers?.forEach((user) => {
      user.modules.forEach((mod) => {
        moduleRestrictedUsers[mod] = user.user?._id;
      });
      user.options.forEach((opt) => {
        permissionRestrictedUsers[opt] = user.user?._id;
      });
    });

    setRestrictedByModule(moduleRestrictedUsers);
    setRestrictedByPermission(permissionRestrictedUsers);
  }, [role, modules, roleData]);

  useEffect(() => {
    applyRoleToModules();
  }, [applyRoleToModules]);

  const userSelectOptions = useMemo(
    () => [{ label: "No restriction", value: NO_USER }, ...userOptions],
    [userOptions],
  );

  const setAllInModule = (mod, checked) => {
    setPermissionChecked((prev) => {
      const next = { ...prev };
      (mod.permissions ?? []).forEach((p) => {
        next[p.value] = checked;
      });
      return next;
    });
  };

  const onModuleCheckboxChange = (mod, checked) => {
    const nextChecked = checked === true;
    setAllInModule(mod, nextChecked);
  };

  const onPermissionCheckboxChange = (value, checked) => {
    setPermissionChecked((prev) => ({
      ...prev,
      [value]: checked === true,
    }));
  };

  const getModuleAggregate = (mod) => {
    const items = mod.permissions ?? [];
    const n = items.length;
    if (n === 0) return { checked: false, indeterminate: false };
    let count = 0;
    for (const p of items) {
      if (permissionChecked[p.value]) count += 1;
    }
    return {
      checked: count === n && n > 0,
      indeterminate: count > 0 && count < n,
    };
  };

  const selectedCount = useMemo(
    () => Object.values(permissionChecked).filter(Boolean).length,
    [permissionChecked],
  );

  const roleName = role?.name ?? "Role";

  const handleClose = () => {
    setIsSaving(false);
    setPermissionChecked({});
    setRestrictedByModule({});
    setRestrictedByPermission({});
    setRole(null);
    onClose();
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const restrictedModules = Object.keys(restrictedByModule).filter(
      (p) => restrictedByModule[p] !== "",
    );
    const restrictedPermissions = Object.keys(restrictedByPermission).filter(
      (p) => restrictedByPermission[p] !== "",
    );

    let restrictedUsers = [];
    for (const mod of restrictedModules) {
      const alreadyExistsUser = restrictedUsers.find((u) => u.user === restrictedByModule[mod]);
      const alreadyExistsModule = alreadyExistsUser?.modules.find((m) => m === mod);
      if (!alreadyExistsUser) {
        restrictedUsers.push({
          user: restrictedByModule[mod],
          modules: [mod],
          options: restrictedPermissions,
        });
      } else {
        if (!alreadyExistsModule) {
          alreadyExistsUser.modules.push(mod);
        }
      }
    }
    for (const perm of restrictedPermissions) {
      const alreadyExistsUser = restrictedUsers.find(
        (u) => u.user === restrictedByPermission[perm],
      );
      const alreadyExistsPermission = alreadyExistsUser?.options.find((p) => p === perm);

      if (!alreadyExistsUser) {
        restrictedUsers.push({
          // ...alreadyExistsUser,
          user: restrictedByPermission[perm],
          modules: [],
          options: [perm],
        });
      } else {
        if (!alreadyExistsPermission) {
          alreadyExistsUser.options.push(perm);
        }
      }
    }

    const payload = {
      role: role._id,
      // selected permissions
      permissions: Object.keys(permissionChecked).filter((p) => permissionChecked[p]),
      restrictedUsers,
      expiresAt: null, //TODO: Add expiration date
    };
    const res = roleData
      ? await updatePermission(role._id, payload)
      : await createPermission(payload);
    setIsSaving(false);
    if (res.success) {
      toast.success("Permissions saved!");
      handleClose();
    } else {
      toast.error("Failed to save permissions");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Permissions</SheetTitle>
          <SheetDescription>{roleName} permissions</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 min-h-0 px-4 pb-4">
          <h2 className="text-sm text-gray-600 mb-4 shrink-0 pl-4">
            Selected permissions <span className="text-gray-900 ">({selectedCount})</span>
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto rounded-lg  bg-card">
            {modules.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">Loading permissions…</p>
            ) : (
              <div className="divide-y ">
                {modules.map((mod) => {
                  const { checked: modChecked, indeterminate } = getModuleAggregate(mod);
                  const modRestrictDisabled = !modChecked && !indeterminate;
                  return (
                    <div key={mod.key} className="p-4 space-y-3">
                      <div className="flex items-center gap-3  px-4 rounded-md py-2">
                        <Checkbox
                          id={`module-${mod.key}`}
                          checked={indeterminate ? "indeterminate" : modChecked}
                          onCheckedChange={(v) => onModuleCheckboxChange(mod, v)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <Label
                            htmlFor={`module-${mod.key}`}
                            className="text-base font-semibold text-gray-900 cursor-pointer"
                          >
                            {mod.module}
                          </Label>
                          <p className="text-xs text-muted-foreground font-mono">{mod.key}</p>
                        </div>
                        <div
                          className={cn(
                            "w-[220px] shrink-0 space-y-1",
                            modRestrictDisabled && "pointer-events-none opacity-50",
                          )}
                        >
                          <span className="text-[0.7rem] font-medium text-muted-foreground block">
                            Restrict to user
                          </span>
                          <CustomSelect
                            placeholder="User"
                            searchPlaceholder="Search users…"
                            options={userSelectOptions}
                            value={restrictedByModule[mod.key] ?? NO_USER}
                            onChange={(e) =>
                              setRestrictedByModule((prev) => ({
                                ...prev,
                                [mod.key]: e.target.value ?? NO_USER,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <ul className="pl-4 space-y-2   ml-2">
                        {(mod.permissions ?? []).map((p) => {
                          const isOn = !!permissionChecked[p.value];
                          return (
                            <li key={p.value}>
                              <div className="flex  items-center bg-gray-50 px-4 rounded-md py-2 gap-3">
                                <Checkbox
                                  id={`perm-${p.value}`}
                                  checked={isOn}
                                  onCheckedChange={(v) => onPermissionCheckboxChange(p.value, v)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <Label
                                    htmlFor={`perm-${p.value}`}
                                    className="text-sm font-medium text-gray-800 cursor-pointer"
                                  >
                                    {p.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {p.value}
                                  </p>
                                </div>
                                <div
                                  className={cn(
                                    "w-[220px] shrink-0 space-y-1",
                                    !isOn && "pointer-events-none opacity-50",
                                  )}
                                >
                                  <span className="text-[0.7rem] font-medium text-muted-foreground block">
                                    Restrict to user
                                  </span>
                                  <CustomSelect
                                    placeholder="User"
                                    searchPlaceholder="Search users…"
                                    options={userSelectOptions}
                                    value={restrictedByPermission[p.value] ?? NO_USER}
                                    onChange={(e) =>
                                      setRestrictedByPermission((prev) => ({
                                        ...prev,
                                        [p.value]: e.target.value ?? NO_USER,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end shrink-0">
            <Button disabled={isSaving} size="sm" type="button" onClick={handleSaveChanges}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PermissionDrawer;
