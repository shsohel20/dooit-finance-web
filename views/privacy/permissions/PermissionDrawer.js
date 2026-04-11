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
  getAllPermissions,
  getAllUsers,
} from "@/app/dashboard/client/user-and-role-management/actions";
import CustomSelect from "@/components/AsyncPaginatedSelect";
import { cn } from "@/lib/utils";

function normalizeRolePermissions(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((p) => (typeof p === "string" ? p : (p?.value ?? p?.name ?? ""))).filter(Boolean);
}

const NO_USER = "";

const PermissionDrawer = ({ open = true, onClose = () => {}, role }) => {
  const [allPermissions, setAllPermissions] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [permissionChecked, setPermissionChecked] = useState({});
  const [restrictedByModule, setRestrictedByModule] = useState({});
  const [restrictedByPermission, setRestrictedByPermission] = useState({});

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
    if (!role || !modules.length) return;
    const granted = new Set(normalizeRolePermissions(role.permissions));
    const nextPerm = {};
    const nextModRestrict = {};
    const nextPermRestrict = {};
    modules.forEach((mod) => {
      nextModRestrict[mod.key] = NO_USER;
      (mod.permissions ?? []).forEach((p) => {
        nextPerm[p.value] = granted.has(p.value);
        nextPermRestrict[p.value] = NO_USER;
      });
    });
    setPermissionChecked(nextPerm);
    setRestrictedByModule(nextModRestrict);
    setRestrictedByPermission(nextPermRestrict);
  }, [role, modules]);

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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Permissions</SheetTitle>
          <SheetDescription>{roleName} permissions</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 min-h-0 px-2 py-4">
          <h2 className="text-sm text-gray-600 mb-4 shrink-0">
            Selected permissions <span className="text-gray-900">({selectedCount})</span>
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
                      <div className="flex items-start gap-3 bg-gray-100 px-4 rounded-md py-2">
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
            <Button size="sm" type="button">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PermissionDrawer;
