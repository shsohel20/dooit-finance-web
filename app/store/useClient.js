import { create } from "zustand";


const useClientStore = create((set) => ({
  clients: [],
  fetching: false,
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  setFetching: (state) => set({ fetching: state }),
  setCurrentPage: (state) => set({ currentPage: state }),
  setLimit: (state) => set({ limit: state }),
  setTotalItems: (state) => set({ totalItems: state }),
  setClients: (state) => set({ clients: state }),
}));

export default useClientStore;