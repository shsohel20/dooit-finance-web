import { create } from "zustand";

export const useCustomerStore = create((set) => ({
  customers: [],
  fetching: false,
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  setFetching: (state) => set({ fetching: state }),
  setCurrentPage: (state) => set({ currentPage: state }),
  setLimit: (state) => set({ limit: state }),
  setTotalItems: (state) => set({ totalItems: state }),
  setCustomers: (state) => set({ customers: state }),
}));