// TypeScript + Zod
import { z } from "zod";

const country = z.object({
  label: z.string().optional(),
  value: z.string().optional(),
  code: z.string().optional(),
}).nullable();

export const localAddressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: country,
}).optional();

export const localAgentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: localAddressSchema.optional(),
});

export const companyTypeSchema = z.object({
  type: z.object({
    label: z.string().optional(),
    value: z.string().optional(),
  }).optional(),
  is_listed: z.boolean().optional(),
});

export const accountPurposeSchema = z.object({
  digital_currency_exchange: z.boolean().optional(),
  peer_to_peer: z.boolean().optional(),
  fx: z.boolean().optional(),
  other: z.boolean().optional(),
  other_details: z.string().optional(),
});

export const generalInformationSchema = z.object({
  legal_name: z.string().min(1, { message: "Legal name is required" }),
  trading_names: z.string().min(1, { message: "Trading names is required" }),
  phone_number: z.string().min(1, { message: "Phone number is required" }),
  registration_number: z.string().min(1, { message: "Registration number is required" }),
  country_of_incorporation: country,
  contact_email: z.string().email({ message: "Invalid email address" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  nature_of_business: z.string().min(1, { message: "Nature of business is required" }),
  annual_income: z.string().min(1, { message: "Annual income is required" }),
  local_agent: localAgentSchema.optional(),
  registered_address: localAddressSchema.optional(),
  business_address: z
    .object({
      different_from_registered: z.boolean().optional(),
      street: z.string().min(1, { message: "Street is required" }),
      suburb: z.string().min(1, { message: "Suburb is required" }),
      state: z.string().min(1, { message: "State is required" }),
      postcode: z.string().min(1, { message: "Postcode is required" }),
      country: country,
    }).optional(),
  company_type: companyTypeSchema.optional(),
  account_purpose: accountPurposeSchema.optional(),
  estimated_trading_volume: z.string().optional(),
});

export const directorSchema = z.object({
  given_name: z.string().optional(),
  surname: z.string().optional(),
});

export const beneficialOwnerSchema = z.object({
  full_name: z.string().optional(),
  date_of_birth: z.string().optional(), // consider z.string().refine(...) for date format if needed
  residential_address: localAddressSchema.optional(),
});

export const directorsBeneficialOwnerSchema = z.object({
  directors: z.array(directorSchema).optional(),
  beneficial_owners: z.array(beneficialOwnerSchema).optional(),
});

export const documentSchema = z.object({
  name: z.string().optional(),
  url: z.string().url().optional(), // .url() will validate if a non-empty string exists
  mimeType: z.string().optional(),
  type: z.string().optional(),
  docType: z.string().optional(),
});

export const declarationSchema = z.object({
  declarations_accepted: z.boolean().optional(),
  signatory_name: z.string().optional(),
  signature: z.string().url().optional(),
  date: z.string().optional(), // consider date validation if required
});

export const businessFormSchema = z.object({
  general_information: generalInformationSchema,
  directors_beneficial_owner: directorsBeneficialOwnerSchema.optional(),
  documents: z.array(documentSchema).optional(),
  declaration: declarationSchema.optional(),
});
