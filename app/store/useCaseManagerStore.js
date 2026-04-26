import { create } from "zustand";

export const useCaseManagerStore = create((set) => ({
  // Cases list
  cases: [],
  setCases: (cases) => set({ cases }),

  // Loading
  fetching: false,
  setFetching: (fetching) => set({ fetching }),

  // Pagination
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  setCurrentPage: (currentPage) => set({ currentPage }),
  setLimit: (limit) => set({ limit }),
  setTotalItems: (totalItems) => set({ totalItems }),

  // Search
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Filters
  filters: {
    caseType: "",
    riskLevel: "",
    status: "",
    assignedAnalyst: "",
    dateFrom: "",
    dateTo: "",
  },
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () =>
    set({
      filters: {
        caseType: "",
        riskLevel: "",
        status: "",
        assignedAnalyst: "",
        dateFrom: "",
        dateTo: "",
      },
      searchQuery: "",
    }),

  // Filter panel open/close
  filterPanelOpen: false,
  setFilterPanelOpen: (filterPanelOpen) => set({ filterPanelOpen }),

  // Selected case for details
  selectedCase: null,
  setSelectedCase: (selectedCase) => set({ selectedCase }),

  // Create new case modal
  createCaseOpen: false,
  setCreateCaseOpen: (createCaseOpen) => set({ createCaseOpen }),
}));
