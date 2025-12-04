import { create } from "zustand";

export const useAlertStore = create((set) => ({
  alerts: [],
  fetching: false,
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  setAlerts: (alerts) => set({ alerts }),
  setFetching: (fetching) => set({ fetching }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setLimit: (limit) => set({ limit }),
  setTotalItems: (totalItems) => set({ totalItems }),
}));