"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Boxes,
  CircleDollarSign,
  Layers,
  Pencil,
  Plus,
  Search,
  SearchX,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import useGetUser from "@/hooks/useGetUser";
import {
  deleteProduct,
  getProductCategories,
  getProducts,
  setProductStatus,
} from "@/app/dashboard/client/billing/actions";

import ProductFormDialog from "./ProductFormDialog";

// Category chip colours, carried over from the AML Billing design bundle's
// spend-by-category palette so the two screens read as one system.
const CATEGORY_COLORS = {
  Platform: "bg-[#2c74d6]/10 text-[#2c74d6]",
  Verification: "bg-[#0e766a]/10 text-[#0e766a]",
  Screening: "bg-[#d97706]/10 text-[#b45c06]",
  Biometrics: "bg-[#7c3aed]/10 text-[#7c3aed]",
  Monitoring: "bg-[#0891b2]/10 text-[#0891b2]",
  Risk: "bg-[#e11d63]/10 text-[#e11d63]",
  Data: "bg-[#65a30d]/10 text-[#4d7c0f]",
  Notifications: "bg-slate-400/15 text-slate-600",
};

/** A$ with 4dp for sub-cent unit prices, 2dp otherwise — matches the prototype. */
const formatUnit = (n) => {
  const v = Number(n) || 0;
  const dp = v > 0 && v < 0.1 ? 4 : 2;
  return `A$${v.toLocaleString("en-AU", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
};

function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="flex min-h-[112px] flex-col gap-1 rounded-2xl border border-[#e9ebef] bg-white p-[17px_18px] dark:border-border dark:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#8a919b]">
          {label}
        </span>
        {Icon ? <Icon className="size-4 text-[#b0b6be]" /> : null}
      </div>
      <div className="text-[25px] font-extrabold leading-tight tracking-[-0.7px] text-[#12151a] dark:text-foreground">
        {value}
      </div>
      <div className="text-xs text-[#9aa0a8]">{sub}</div>
    </div>
  );
}

function CategoryChip({ category }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-[2px] text-[10.5px] font-bold ${
        CATEGORY_COLORS[category] || "bg-muted text-muted-foreground"
      }`}
    >
      {category}
    </span>
  );
}

export default function ProductCatalogue() {
  const { loggedInUser } = useGetUser();
  // Writes are dooit-only. The API enforces this with 403; the UI hides the
  // controls so a client admin is never shown an action that cannot succeed.
  const isDooit = loggedInUser?.userType === "dooit";

  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showInactive, setShowInactive] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Always fetch the FULL catalogue (status=all) and filter in the browser.
  // The catalogue is ~30 rows, so this is one request instead of a refetch per
  // toggle, and it means the inactive count is known even while inactive rows
  // are hidden — otherwise "Show inactive" gives no feedback on an all-active
  // catalogue and looks broken.
  const load = useCallback(async () => {
    setLoading(true);
    const [list, cats] = await Promise.all([
      getProducts({ limit: 200, sort: "category", status: "all" }),
      getProductCategories(),
    ]);
    if (list.ok) setRows(list.data || []);
    else toast.error(list.error || "Could not load products");
    if (cats.ok) setCategories(cats.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((p) => {
      if (!showInactive && p.status !== "active") return false;
      if (category !== "all" && p.category !== category) return false;
      if (!term) return true;
      return (
        p.name?.toLowerCase().includes(term) ||
        p.code?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    });
  }, [rows, search, category, showInactive]);

  const stats = useMemo(() => {
    const active = rows.filter((p) => p.status === "active");
    const prices = active.map((p) => Number(p.defaultUnitPrice) || 0).filter((v) => v > 0);
    return {
      total: rows.length,
      active: active.length,
      inactive: rows.length - active.length,
      categories: new Set(rows.map((p) => p.category)).size,
      cheapest: prices.length ? Math.min(...prices) : 0,
    };
  }, [rows]);

  const onToggle = async (product) => {
    if (!isDooit) return;
    const next = product.status === "active" ? "inactive" : "active";
    setBusyId(product._id);
    const res = await setProductStatus(product._id, next);
    setBusyId(null);

    if (!res.ok) {
      toast.error(res.error || "Could not change status");
      return;
    }
    const affected = res.meta?.affectedPublishedPlans;
    toast.success(
      `${product.name} ${next === "active" ? "enabled" : "disabled"}`,
      affected
        ? {
            description: `${affected} published plan(s) still sell this product — they are frozen and unaffected.`,
          }
        : undefined
    );
    setRows((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, status: next } : p))
    );
  };

  const onDelete = async () => {
    const product = confirmDelete;
    setConfirmDelete(null);
    const res = await deleteProduct(product._id);
    if (!res.ok) {
      // 409 = a live plan still sells it. Show the API's reason verbatim.
      toast.error(res.error || "Could not delete product");
      return;
    }
    toast.success(`${product.name} deleted`);
    setRows((prev) => prev.filter((p) => p._id !== product._id));
  };

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
            Product catalogue
          </h1>
          <p className="mt-[3px] text-[13px] text-[#8a919b]">
            Metered AML products that plans are assembled from
            {isDooit ? "" : " — read only"}
          </p>
        </div>
        {isDooit && (
          <Button
            className="gap-2 rounded-[10px] bg-primary font-bold"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add product
          </Button>
        )}
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[112px] rounded-2xl" />)
        ) : (
          <>
            <StatCard
              label="Products"
              value={stats.total}
              sub={
                stats.inactive
                  ? `${stats.active} active · ${stats.inactive} inactive`
                  : `${stats.active} active`
              }
              icon={Boxes}
            />
            <StatCard
              label="Categories"
              value={stats.categories}
              sub={`of ${categories.length} available`}
              icon={Layers}
            />
            <StatCard
              label="Lowest unit price"
              value={formatUnit(stats.cheapest)}
              sub="across active products"
              icon={CircleDollarSign}
            />
            <StatCard
              label="Showing"
              value={filtered.length}
              sub={search || category !== "all" ? "matching filters" : "all products"}
              icon={Search}
            />
          </>
        )}
      </div>

      {/* ── Catalogue card ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#eef0f3] p-4 dark:border-border">
          <div className="min-w-[180px] flex-1">
            <div className="text-[15px] font-extrabold text-[#12151a] dark:text-foreground">
              Product catalog
            </div>
            <div className="mt-[2px] text-xs text-[#8a919b]">
              {isDooit
                ? "Enable or disable metered products, and set list pricing"
                : "Metered products available on this account"}
            </div>
          </div>

          <div className="relative w-full sm:w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a0ab]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="h-9 rounded-[10px] pl-9 text-[13px]"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-[10px] border border-input bg-background px-3 text-[13px] font-semibold text-foreground"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.count})
              </option>
            ))}
          </select>

          {/* Radix Switch renders a <button>, which IS a labelable element —
              nesting it inside <label> makes a click on the switch fire twice
              (once directly, once forwarded by the label) and cancel itself out.
              Pair them with id + htmlFor instead. */}
          <div className="flex items-center gap-2">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <Label
              htmlFor="show-inactive"
              className="cursor-pointer select-none text-[12.5px] font-semibold text-[#6b7280]"
            >
              Show inactive
              {stats.inactive > 0 && !showInactive ? ` (${stats.inactive})` : ""}
            </Label>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3 p-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
              <SearchX className="size-5 text-[#9aa0a8]" />
            </div>
            <div className="text-sm font-bold text-[#4a515b] dark:text-foreground">
              No matching products
            </div>
            <div className="mt-1 text-[12.5px] text-[#9aa0a8]">
              {rows.length === 0
                ? isDooit
                  ? "Add your first product to start building plans."
                  : "No products have been made available yet."
                : "Try a different search term or category."}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Product
                </TableHead>
                <TableHead className="w-[150px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Category
                </TableHead>
                <TableHead className="w-[110px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Unit
                </TableHead>
                <TableHead className="w-[130px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Unit price
                </TableHead>
                <TableHead className="w-[140px] text-center text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Status
                </TableHead>
                {isDooit && <TableHead className="w-[90px]" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const on = p.status === "active";
                return (
                  <TableRow key={p._id} className="border-t border-[#f4f5f7]">
                    <TableCell className="max-w-0">
                      <div className="truncate text-[13.5px] font-semibold text-[#25292f] dark:text-foreground">
                        {p.name}
                      </div>
                      <div className="truncate font-mono text-[11px] text-[#9aa0a8]">
                        {p.code}
                        {p.billable === false && " · non-billable"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryChip category={p.category} />
                    </TableCell>
                    <TableCell className="text-[13px] text-[#6b7280]">{p.unit}</TableCell>
                    <TableCell className="text-right text-[13.5px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                      {formatUnit(p.defaultUnitPrice)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={on}
                          disabled={!isDooit || busyId === p._id}
                          onCheckedChange={() => onToggle(p)}
                        />
                        <span
                          className={`w-[52px] text-[11.5px] font-bold ${
                            on ? "text-[#16a34a]" : "text-[#9aa0a8]"
                          }`}
                        >
                          {on ? "Enabled" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    {isDooit && (
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                              setEditing(p);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="size-4 text-[#6b7280]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setConfirmDelete(p)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {isDooit && (
        <ProductFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          product={editing}
          onSaved={load}
        />
      )}

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{confirmDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              The product is soft-deleted and hidden from the catalogue. If any
              non-archived plan still includes it, the API will refuse — deactivate
              it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
