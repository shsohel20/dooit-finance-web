import { z } from "zod";
const commonAddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  suburb: z.string().min(1, "Suburb is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
});
const localAgentSchema = z.object({
  name: z.string().min(1, "Local agent name is required"),
  address: commonAddressSchema,
});

const registeredAddressSchema = commonAddressSchema;
const businessAddressSchema = z
  .object({
    different_from_registered: z.boolean(),
    address: commonAddressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.different_from_registered && !data.address) {
      ctx.addIssue({
        path: ["address"],
        message: "Business address is required when different from registered",
        code: z.ZodIssueCode.custom,
      });
    }
  });
export const companyRegistrationFormSchema = z.object({
  general_information: z.object({
    legal_name: z.string().min(1, "Legal name is required"),
    trading_names: z.string().min(1, "Trading names is required"),
    phone_number: z.string().min(1, "Phone number is required"),
    registration_number: z.string().min(1, "Registration number is required"),
    country_of_incorporation: z.string().min(1, "Country of incorporation is required"),
    contact_email: z.string().email("Invalid email address"),
    industry: z.string().min(1, "Industry is required"),
    nature_of_business: z.string().min(1, "Nature of business is required"),
    annual_income: z.string().min(1, "Annual income is required"),
    local_agent: localAgentSchema,
    registered_address: registeredAddressSchema,
    business_address: businessAddressSchema,
    company_type: z.object({
      type: z.string().min(1, "Company type is required"),
      is_listed: z.boolean(),
    }),
    account_purpose: z.object({
      digital_currency_exchange: z.boolean(),
      peer_to_peer: z.boolean(),
      fx: z.boolean(),
      other: z.boolean(),
      other_details: z.string().optional(),
    }),
    estimated_trading_volume: z.string().min(1, "Estimated trading volume is required"),
  }),
  directors: z.array(
    z.object({
      given_name: z.string().min(1, "Given name is required"),
      surname: z.string().min(1, "Surname is required"),
    }),
  ),
  beneficial_owners: z.array(
    z.object({
      full_name: z.string().min(1, "Full name is required"),
      date_of_birth: z.string().min(1, "Date of birth is required"),
      residential_address: z.object({
        street: z.string().min(1, "Street is required"),
        suburb: z.string().min(1, "Suburb is required"),
        state: z.string().min(1, "State is required"),
        postcode: z.string().min(1, "Postcode is required"),
        country: z.string().min(1, "Country is required"),
      }),
    }),
  ),
  documents: z
    .array(
      z.object({
        name: z.string().optional(),
        url: z.string().optional(),
        mimeType: z.string().optional(),
        type: z.enum(["front", "back"]),
        docType: z.string().optional(),
      }),
    )
    .max(2, "You can only upload 2 documents"),
  declaration: z.object({
    declarations_accepted: z
      .boolean()
      .refine((val) => val === true, "You must accept the declarations"),
    signatory_name: z
      .string()
      .min(1, "Signatory name is required")
      .min(2, "Signatory name must be at least 2 characters"),
    signature: z.string().optional(),
    date: z.string().optional(),
  }),
});
