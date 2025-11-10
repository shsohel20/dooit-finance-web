import { create } from "zustand";

export const useCustomerRegisterStore = create((set) => ({
  customerRegisterData: null,
  registerType: '',
  country: '',
  setCustomerRegisterData: (customerRegisterData) => set({ customerRegisterData }),
  setRegisterType: (registerType) => set({ registerType }),
  setCountry: (country) => set({ country }),
}));