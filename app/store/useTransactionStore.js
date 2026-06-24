import { create } from 'zustand';
import { getTransactions } from '@/app/dashboard/client/transactions/actions';

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS = {
  search:          '',
  status:          '',   // comma-separated: "pending,completed"
  type:            '',   // comma-separated: "deposit,withdrawal"
  currency:        '',
  channel:         '',
  dateFrom:        '',
  dateTo:          '',
  amountMin:       '',
  amountMax:       '',
  riskMin:         '',
  riskMax:         '',
  flagged:         '',   // '' | 'true' | 'false'
  relatedPartyFlag:'',
};

export const DEFAULT_SORT = { field: 'timestamp', order: 'desc' };

// How many active (non-empty) filters are currently set
export const countActiveFilters = (filters) =>
  Object.values(filters).filter((v) => v !== '').length;

// Build a clean URLSearchParams-compatible object from store state
export const buildQueryParams = ({ filters, page, limit, sort }) => {
  const params = { page, limit, sort: sort.field, order: sort.order };
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== '' && v != null) params[k] = v;
  });
  return params;
};

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

const useTransactionStore = create((set, get) => ({
  // ── Data ──────────────────────────────────────────────────────────────────
  data:         [],
  totalRecords: 0,
  loading:      false,
  error:        null,

  // ── Pagination ────────────────────────────────────────────────────────────
  page:  1,
  limit: 10,

  // ── Sort ──────────────────────────────────────────────────────────────────
  sort: { ...DEFAULT_SORT },

  // ── Filters ───────────────────────────────────────────────────────────────
  filters: { ...DEFAULT_FILTERS },

  // ── Computed helpers (call these in components) ────────────────────────────
  activeFilterCount: () => countActiveFilters(get().filters),

  // ─────────────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────────────

  /** Set a single filter field; resets to page 1 */
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    })),

  /** Replace all filters at once (used for URL → store hydration) */
  setFilters: (incoming) =>
    set({
      filters: { ...DEFAULT_FILTERS, ...incoming },
      page: 1,
    }),

  /** Clear every filter */
  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS }, page: 1 }),

  setPage:  (page)  => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),

  /** Set sort field; toggling the same field flips the direction */
  setSort: (field) =>
    set((state) => {
      const sameField = state.sort.field === field;
      return {
        sort: {
          field,
          order: sameField && state.sort.order === 'asc' ? 'desc' : 'asc',
        },
        page: 1,
      };
    }),

  /** Explicit sort setter (used when restoring from URL) */
  setSortExplicit: (field, order) =>
    set({ sort: { field, order }, page: 1 }),

  /** Set sort field + explicit direction (used by column header dropdown) */
  setSortWithDirection: (field, order) =>
    set({ sort: { field, order }, page: 1 }),

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────────────────────────────────────

  fetch: async () => {
    const { filters, page, limit, sort } = get();
    set({ loading: true, error: null });

    const params = buildQueryParams({ filters, page, limit, sort });

    try {
      const res = await getTransactions(params);

      if (res?.success) {
        set({
          data:         res.data         ?? [],
          totalRecords: res.totalRecords  ?? 0,
          loading:      false,
        });
      } else {
        set({
          data:         [],
          totalRecords: 0,
          loading:      false,
          error:        res?.message ?? 'Failed to load transactions.',
        });
      }
    } catch (err) {
      set({
        loading: false,
        error:   err?.message ?? 'Unexpected error.',
      });
    }
  },
}));

export default useTransactionStore;
