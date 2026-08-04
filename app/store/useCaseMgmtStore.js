import { create } from 'zustand';

export const useCaseMgmtStore = create((set, get) => ({
  // ── Case list ──────────────────────────────────────────────────────────────
  cases: [],
  setCases: (cases) => set({ cases }),

  totalItems: 0,
  setTotalItems: (totalItems) => set({ totalItems }),

  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),

  limit: 10,
  setLimit: (limit) => set({ limit, currentPage: 1 }),

  totalPages: 1,
  setTotalPages: (totalPages) => set({ totalPages }),

  // ── Filters ────────────────────────────────────────────────────────────────
  filters: {
    status: '',
    priority: '',
    assignedTo: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1,
    })),
  resetFilters: () =>
    set({
      filters: {
        status: '',
        priority: '',
        assignedTo: '',
        startDate: '',
        endDate: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      currentPage: 1,
    }),

  // ── Loading ────────────────────────────────────────────────────────────────
  fetching: false,
  setFetching: (fetching) => set({ fetching }),

  submitting: false,
  setSubmitting: (submitting) => set({ submitting }),

  // ── Selected / detail ──────────────────────────────────────────────────────
  selectedCase: null,
  setSelectedCase: (selectedCase) => set({ selectedCase }),

  // ── Notes ──────────────────────────────────────────────────────────────────
  notes: [],
  setNotes: (notes) => set({ notes }),
  prependNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),

  // ── Audit log ──────────────────────────────────────────────────────────────
  auditLogs: [],
  setAuditLogs: (auditLogs) => set({ auditLogs }),

  // ── Investigators (for assignment dropdown) ────────────────────────────────
  investigators: [],
  setInvestigators: (investigators) => set({ investigators }),
}));
