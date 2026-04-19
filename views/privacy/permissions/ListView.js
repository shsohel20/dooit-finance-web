"use client";

import { Fragment, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Users } from "lucide-react";

function asUserIdList(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string" && raw) return [raw];
  return [];
}

function UserMultiSelect({
  value = [],
  options = [],
  onChange,
  disabled,
  placeholder = "Users",
  searchPlaceholder = "Search users…",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label?.toLowerCase().includes(q));
  }, [options, search]);

  const labelById = useMemo(() => {
    const m = new Map();
    options.forEach((o) => m.set(o.value, o.label));
    return m;
  }, [options]);

  const summary = useMemo(() => {
    if (selected.length === 0) return null;
    const names = selected.map((id) => labelById.get(id) || id);
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  }, [selected, labelById]);

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const clear = () => {
    onChange([]);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9 w-full min-w-[200px] max-w-[280px] justify-between font-normal bg-background px-2.5",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5 truncate text-left text-xs">
            <Users className="size-3.5 shrink-0 opacity-60" />
            {summary ? (
              <span className="truncate text-foreground">{summary}</span>
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-1 size-3.5 shrink-0 opacity-45" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList className="max-h-[220px]">
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {filtered.map((opt) => {
                const isOn = selected.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer text-xs"
                    onSelect={() => toggle(opt.value)}
                  >
                    <span
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded border",
                        isOn
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isOn ? <Check className="size-3" /> : null}
                    </span>
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {selected.length > 0 && (
            <div className="border-t p-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-full text-xs text-muted-foreground"
                onClick={clear}
              >
                Clear selection
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Table layout for role permissions: modules and nested permissions with
 * grant checkboxes and multi-user restriction per row.
 */
export default function PermissionsListView({
  modules = [],
  permissionChecked = {},
  restrictedByModule = {},
  restrictedByPermission = {},
  userOptions = [],
  getModuleAggregate,
  onModuleCheckboxChange,
  onPermissionCheckboxChange,
  onModuleUsersChange,
  onPermissionUsersChange,
}) {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 z-[1] bg-muted/90 backdrop-blur-sm [&_tr]:border-b">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="h-10 w-12 border-r-0 px-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Grant
            </TableHead>
            <TableHead className="h-10 min-w-[200px] border-r-0 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Scope
            </TableHead>
            <TableHead className="h-10 w-[min(280px,32%)] min-w-[220px] border-r-0 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Restricted users
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((mod) => {
            const { checked: modChecked, indeterminate } = getModuleAggregate(mod);
            const modRestrictDisabled = !modChecked && !indeterminate;
            const modUsers = asUserIdList(restrictedByModule[mod.key]);

            return (
              <Fragment key={mod.key}>
                <TableRow className="bg-muted/30 hover:bg-muted/40">
                  <TableCell className="border-r-0 px-3 py-3 align-top">
                    <div className="flex justify-center pt-0.5">
                      <Checkbox
                        id={`module-${mod.key}`}
                        checked={indeterminate ? "indeterminate" : modChecked}
                        onCheckedChange={(v) => onModuleCheckboxChange(mod, v)}
                        aria-label={`Grant all permissions in ${mod.module}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="border-r-0 px-3 py-3 align-top">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-[0.65rem] font-medium">
                          Module
                        </Badge>
                        <Label
                          htmlFor={`module-${mod.key}`}
                          className="cursor-pointer text-sm font-semibold leading-tight text-foreground"
                        >
                          {mod.module}
                        </Label>
                      </div>
                      <p className="font-mono text-[0.7rem] text-muted-foreground">{mod.key}</p>
                    </div>
                  </TableCell>
                  <TableCell className="border-r-0 px-3 py-3 align-top">
                    <UserMultiSelect
                      value={modUsers}
                      options={userOptions}
                      onChange={(ids) => onModuleUsersChange(mod.key, ids)}
                      disabled={modRestrictDisabled}
                      placeholder="None"
                      searchPlaceholder="Search users…"
                    />
                  </TableCell>
                </TableRow>
                {(mod.permissions ?? []).map((p) => {
                  const isOn = !!permissionChecked[p.value];
                  const permUsers = asUserIdList(restrictedByPermission[p.value]);
                  return (
                    <TableRow key={p.value} className="hover:bg-muted/25">
                      <TableCell className="border-r-0 px-3 py-2.5 align-top">
                        <div className="flex justify-center pt-0.5">
                          <Checkbox
                            id={`perm-${p.value}`}
                            checked={isOn}
                            onCheckedChange={(v) => onPermissionCheckboxChange(p.value, v)}
                            aria-label={`Grant ${p.label}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="border-r-0 px-3 py-2.5 align-top">
                        <div className="border-l-2 border-primary/20 pl-3 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-[0.65rem] font-medium">
                              Permission
                            </Badge>
                            <Label
                              htmlFor={`perm-${p.value}`}
                              className="cursor-pointer text-sm font-medium leading-tight text-foreground"
                            >
                              {p.label}
                            </Label>
                          </div>
                          <p className="font-mono text-[0.7rem] text-muted-foreground">{p.value}</p>
                        </div>
                      </TableCell>
                      <TableCell className="border-r-0 px-3 py-2.5 align-top">
                        <UserMultiSelect
                          value={permUsers}
                          options={userOptions}
                          onChange={(ids) => onPermissionUsersChange(p.value, ids)}
                          disabled={!isOn}
                          placeholder="None"
                          searchPlaceholder="Search users…"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
