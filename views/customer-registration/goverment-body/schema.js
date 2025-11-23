import { z } from "zod";

// Contact Information Schema
const contactInformationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-()]+$/, "Invalid phone number format"),
});

// Registered Address Schema
const registeredAddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  suburb: z.string().min(1, "Suburb is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
});

// General Information Schema
const generalInformationSchema = z.object({
  entity_name: z
    .string()
    .min(1, "Entity name is required")
    .min(2, "Entity name must be at least 2 characters"),
  country_of_formation: z
    .string()
    .min(1, "Country of formation is required"),
  industry: z.string().min(1, "Industry is required"),
  contact_information: contactInformationSchema,
  registered_address: registeredAddressSchema,
});

// Government Body Schema
const governmentBodySchema = z.object({
  government_body_type: z
    .string()
    .min(1, "Government body type is required"),
  government_name: z.string().min(1, "Government name is required"),
  legislation_name: z.string().min(1, "Legislation name is required"),
});

// Document Schema
const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  url: z.string().url("Invalid URL").min(1, "Document URL is required"),
  mimeType: z
    .string()
    .min(1, "MIME type is required")
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_+]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_+]*$/,
      "Invalid MIME type format"
    ),
  type: z.string().min(1, "Document type is required"),
  docType: z.string().min(1, "Document category is required"),
});

// Declaration Schema
const declarationSchema = z.object({
  declarations_accepted: z.boolean().refine(
    (val) => val === true,
    "You must accept the declarations"
  ),
  signatory_name: z
    .string()
    .min(1, "Signatory name is required")
    .min(2, "Signatory name must be at least 2 characters"),
  signature: z.string().min(1, "Signature is required"),
  date: z
    .string()
  ,
});

// Main KYC Schema
const kycSchema = z.object({
  general_information: generalInformationSchema,
  government_body: governmentBodySchema,
});

// Full Form Schema
export const kycFormSchema = z.object({

  kyc: kycSchema,
  documents: z
    .array(documentSchema)
    .min(1, "At least one document is required"),
  declaration: declarationSchema,
});
