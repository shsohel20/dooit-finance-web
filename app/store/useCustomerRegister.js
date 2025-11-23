import { create } from "zustand";
const initialFormData = {
  customer_details: {
    given_name: '',
    middle_name: '',
    surname: '',
    date_of_birth: '',
    other_names: '',
    referral: '',
  },
  document_type: null,
  contact_details: {
    email: '',
    phone: ''
  },
  employment_details: {
    occupation: '',
    industry: '',
    employer_name: '',
  },
  residential_address: {
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    country: '',

  },
  mailing_address: {
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    country: ""
  },
  funds_wealth: {
    source_of_funds: "",
    source_of_wealth: "",
    account_purpose: "",
    estimated_trading_volume: ""
  },
  sole_trader: {
    is_sole_trader: false,
    business_details: {}
  },
  documents: [

  ],
  declaration: {
    declarations_accepted: false,
    signatory_name: '',
    signature: '',
    date: new Date().toISOString(),
  }
}
export const useCustomerRegisterStore = create((set) => ({
  customerRegisterData: initialFormData,
  registerType: '',
  country: '',
  setCustomerRegisterData: (customerRegisterData) => set({ customerRegisterData }),
  setRegisterType: (registerType) => set({ registerType }),
  setCountry: (country) => set({ country }),
}));