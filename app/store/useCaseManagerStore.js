import { create } from "zustand";

export const useCaseManagerStore = create((set) => ({
  // ── Cases list ──────────────────────────────────────────────────────────────
  cases: [],
  setCases: (cases) => set({ cases }),

  fetching: false,
  setFetching: (fetching) => set({ fetching }),

  // ── Pagination ──────────────────────────────────────────────────────────────
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),
  setLimit: (limit) => set({ limit }),
  setTotalItems: (totalItems) => set({ totalItems }),
  setTotalPages: (totalPages) => set({ totalPages }),

  // ── Search ──────────────────────────────────────────────────────────────────
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // ── Filters (keys kept from existing UI; mapped to API params in actions) ──
  // riskLevel  → API: priority
  // caseType   → API: type
  // status     → API: status (new values)
  // assignedAnalyst → API: assignedTo (investigator ID)
  // dateFrom   → API: startDate
  // dateTo     → API: endDate
  filters: {
    caseType: "",
    riskLevel: "",
    status: "",
    assignedAnalyst: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1,
    })),
  resetFilters: () =>
    set({
      filters: {
        caseType: "",
        riskLevel: "",
        status: "",
        assignedAnalyst: "",
        dateFrom: "",
        dateTo: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      searchQuery: "",
      currentPage: 1,
    }),

  // ── Filter panel ────────────────────────────────────────────────────────────
  filterPanelOpen: false,
  setFilterPanelOpen: (filterPanelOpen) => set({ filterPanelOpen }),

  // ── Selected / detail ────────────────────────────────────────────────────────
  selectedCase: null,
  setSelectedCase: (selectedCase) => set({ selectedCase }),

  // ── Create modal ────────────────────────────────────────────────────────────
  createCaseOpen: false,
  setCreateCaseOpen: (createCaseOpen) => set({ createCaseOpen }),

  // ── Notes ────────────────────────────────────────────────────────────────────
  notes: [],
  setNotes: (notes) => set({ notes }),
  prependNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),

  // ── Audit log ────────────────────────────────────────────────────────────────
  auditLogs: [],
  setAuditLogs: (auditLogs) => set({ auditLogs }),

  // ── Investigators (for assignment dropdown) ──────────────────────────────────
  investigators: [],
  setInvestigators: (investigators) => set({ investigators }),

  // ── Submitting (notes / assignment saves) ───────────────────────────────────
  submitting: false,
  setSubmitting: (submitting) => set({ submitting }),
}));
