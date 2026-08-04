"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Server-side list state for the KYB lists (docs/65 Step 68) — page, limit,
 * sort, filters and the fetch, in one place so the Companies and Trusts tabs
 * cannot drift apart.
 *
 * Deliberately LOCAL state, not a zustand store. The customer queue keeps
 * page/limit/sort in a shared store and had to patch around it twice (docs/49
 * §1 stale closure, §8 stale page across tabs). Two tabs on one page each get
 * their own instance, so switching tabs cannot land on another tab's page 5.
 *
 * The fetch is a useCallback with REAL deps + one debounced effect — the exact
 * shape docs/49 §1 landed on. An empty dep array here is what made "page 2"
 * re-fetch page 1.
 */
export function useListQuery({ fetcher, initialFilters = {}, initialSort = "-createdAt", pageSize = 25 }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);
  const [sort, setSort] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);

  // Identity of the fetcher shouldn't retrigger the effect on every render.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetcherRef.current({ page, limit, sort, ...filters });
      setRows(res?.data ?? []);
      // The KYB list endpoints answer with `total`; tolerate `totalRecords`
      // (the customer endpoints' name) so this hook works against either.
      setTotal(typeof res?.total === "number" ? res.total : (res?.totalRecords ?? 0));
    } catch {
      setRows([]);
      setTotal(0);
    } finally {
      setFetching(false);
    }
  }, [page, limit, sort, filters]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  // Every filter/sort change resets to page 1 — otherwise narrowing the result
  // set while on page 4 shows an empty table that looks like "no results".
  const resetPage = () => setPage((p) => (p === 1 ? p : 1));

  const setFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    resetPage();
  };
  const clearFilters = () => {
    setFilters(initialFilters);
    resetPage();
  };
  const handleSort = (key, direction) => {
    setSort(direction === "desc" ? `-${key}` : key);
    resetPage();
  };

  const activeFilters = Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined);

  return {
    rows,
    total,
    fetching,
    page,
    limit,
    sort,
    filters,
    activeFilters,
    setPage,
    setLimit,
    setFilter,
    clearFilters,
    handleSort,
    refetch: fetchData,
  };
}
