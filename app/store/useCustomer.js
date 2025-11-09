import { create } from "zustand";

export const useCustomerStore = create((set) => ({
  customers: [],
  fetching: true,
  currentPage: 1,
  limit: 10,
  kycStatus: '',
  totalItems: 0,
  setFetching: (state) => set({ fetching: state }),
  setCurrentPage: (state) => set({ currentPage: state }),
  setLimit: (state) => set({ limit: state }),
  setTotalItems: (state) => set({ totalItems: state }),
  setCustomers: (state) => set({ customers: state }),
  setKycStatus: (state) => set({ kycStatus: state }),
}));