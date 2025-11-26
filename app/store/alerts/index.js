import { create } from "zustand";


const useAlertStore = create((set) => ({
  alerts: [],
  fetching: false,
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  details: null,
  setDetails: (state) => set({ details: state }),
  setFetching: (state) => set({ fetching: state }),
  setCurrentPage: (state) => set({ currentPage: state }),
  setLimit: (state) => set({ limit: state }),
  setTotalItems: (state) => set({ totalItems: state }),
  setAlerts: (state) => set({ alerts: state }),
}));

export default useAlertStore;