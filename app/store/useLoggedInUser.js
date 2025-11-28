import { create } from "zustand";

export const useLoggedInUserStore = create((set) => ({
    loggedInUser: null,
    setLoggedInUser: (loggedInUser) => set({ loggedInUser }),
}))