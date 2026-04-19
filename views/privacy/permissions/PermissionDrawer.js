"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPermission,
  getAllPermissions,
  getAllUsers,
  getPermissionById,
  updatePermission,
} from "@/app/dashboard/client/user-and-role-management/actions";
import { toast } from "sonner";
import ListView from "@/views/privacy/permissions/ListView";

function normalizeRolePermissions(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((p) => (typeof p === "string" ? p : (p?.value ?? p?.name ?? ""))).filter(Boolean);
}

function asUserIdList(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string" && raw) return [raw];
  return [];
}

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
      (mod.permissions ?? []).forEach((p) => {
        nextPerm[p.value] = granted.has(p.value);
      });
    });
    setPermissionChecked(nextPerm);
    restrictedUsers?.forEach((user) => {
      const uid = user.user?._id;
      if (!uid) return;
      user.modules.forEach((mod) => {
        if (!moduleRestrictedUsers[mod]) moduleRestrictedUsers[mod] = [];
        if (!moduleRestrictedUsers[mod].includes(uid)) {
          moduleRestrictedUsers[mod].push(uid);
        }
      });
      user.options.forEach((opt) => {
        if (!permissionRestrictedUsers[opt]) permissionRestrictedUsers[opt] = [];
        if (!permissionRestrictedUsers[opt].includes(uid)) {
          permissionRestrictedUsers[opt].push(uid);
        }
      });
    });

    setRestrictedByModule(moduleRestrictedUsers);
    setRestrictedByPermission(permissionRestrictedUsers);
  }, [modules, roleData]);

  useEffect(() => {
    applyRoleToModules();
  }, [applyRoleToModules]);

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
    const byUser = new Map();

    const ensure = (uid) => {
      if (!uid) return null;
      if (!byUser.has(uid)) {
        byUser.set(uid, { user: uid, modules: [], options: [] });
      }
      return byUser.get(uid);
    };

    Object.entries(restrictedByModule).forEach(([mod, users]) => {
      const list = asUserIdList(users);
      list.forEach((uid) => {
        const row = ensure(uid);
        if (row && !row.modules.includes(mod)) row.modules.push(mod);
      });
    });

    Object.entries(restrictedByPermission).forEach(([perm, users]) => {
      const list = asUserIdList(users);
      list.forEach((uid) => {
        const row = ensure(uid);
        if (row && !row.options.includes(perm)) row.options.push(perm);
      });
    });

    const restrictedUsers = Array.from(byUser.values());

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
      <SheetContent className="sm:max-w-3xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Permissions</SheetTitle>
          <SheetDescription>{roleName} permissions</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 min-h-0 px-4 pb-4">
          <h2 className="text-sm text-gray-600 mb-4 shrink-0 pl-4">
            Selected permissions <span className="text-gray-900 ">({selectedCount})</span>
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto rounded-lg">
            {modules.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">Loading permissions…</p>
            ) : (
              <ListView
                modules={modules}
                permissionChecked={permissionChecked}
                restrictedByModule={restrictedByModule}
                restrictedByPermission={restrictedByPermission}
                userOptions={userOptions}
                getModuleAggregate={getModuleAggregate}
                onModuleCheckboxChange={onModuleCheckboxChange}
                onPermissionCheckboxChange={onPermissionCheckboxChange}
                onModuleUsersChange={(modKey, ids) =>
                  setRestrictedByModule((prev) => ({ ...prev, [modKey]: ids }))
                }
                onPermissionUsersChange={(permValue, ids) =>
                  setRestrictedByPermission((prev) => ({ ...prev, [permValue]: ids }))
                }
              />
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
