import { z } from 'zod';

const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  suburb: z.string().min(1, 'Suburb is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
});

const principalAddressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  suburb: z.string().min(1, 'Suburb is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
});

const postalAddressSchema = z.object({
  different_from_principal: z.boolean(),
  address: z.string().optional().or(z.literal('')),
  suburb: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  postcode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
}).refine(
  (data) => !data.different_from_principal || (data.address && data.suburb && data.state && data.postcode && data.country),
  { message: 'Postal address is required when different from principal', path: ['address'] }
);

const contactInformationSchema = z.object({
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  website: z.string().url('Valid URL is required').optional().or(z.literal('')),
});

const unregulatedTrustSchema = z.object({
  type_description: z.string().min(1, 'Type description is required'),
  is_registered: z.boolean(),
  regulatory_body: z.string().optional().or(z.literal('')),
  registration_number: z.string().optional().or(z.literal('')),
});

const trustTypeSchema = z.object({
  selected_type: z.string().min(1, 'Trust type is required'),
  unregulated_trust: unregulatedTrustSchema,
});

const accountPurposeSchema = z.object({
  digital_currency_exchange: z.boolean(),
  peer_to_peer: z.boolean(),
  fx: z.boolean(),
  other: z.boolean(),
}).refine(
  (data) => data.digital_currency_exchange || data.peer_to_peer || data.fx || data.other,
  { message: 'At least one account purpose must be selected' }
);

const trustDetailsSchema = z.object({
  full_trust_name: z.string().min(1, 'Trust name is required'),
  country_of_establishment: z.string().min(1, 'Country of establishment is required'),
  settlor_name: z.string().min(1, 'Settlor name is required'),
  industry: z.string().min(1, 'Industry is required'),
  nature_of_business: z.string().min(1, 'Nature of business is required'),
  annual_income: z.string().min(1, 'Annual income is required'),
  principal_address: principalAddressSchema,
  postal_address: postalAddressSchema,
  contact_information: contactInformationSchema,
  trust_type: trustTypeSchema,
  account_purpose: accountPurposeSchema,
  estimated_trading_volume: z.string().min(1, 'Estimated trading volume is required'),
});

const beneficiarySchema = z.object({
  named_beneficiaries: z.string().min(1, 'Named beneficiaries is required'),
  beneficiary_classes: z.string().min(1, 'Beneficiary classes is required'),
});

const companyTrusteeSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
});

const companyTrusteesSchema = z.object({
  has_company_trustees: z.boolean(),
  company_details: z.array(companyTrusteeSchema).optional(),
});

const individualTrusteeSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  residential_address: addressSchema,
});

const individualTrusteesSchema = z.object({
  trustees: z.array(individualTrusteeSchema).min(1, 'At least one trustee is required'),
  has_additional_trustees: z.boolean(),
});

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  url: z.string().url('Valid URL is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  type: z.string().min(1, 'Type is required'),
  docType: z.string().min(1, 'Document type is required'),
});

const declarationSchema = z.object({
  declarations_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the declarations',
  }),
  signatory_name: z.string().min(1, 'Signatory name is required'),
  signature: z.string().min(1, 'Signature is required'),
  date: z.string().min(1, 'Date is required'),
});

export const TrustRegistrationFormSchema = z.object({
  kyc: z.object({
    trust_details: trustDetailsSchema,
    beneficiaries: z.array(beneficiarySchema),
    company_trustees: companyTrusteesSchema,
    individual_trustees: individualTrusteesSchema,
  }),
  documents: z.array(documentSchema),
  declaration: declarationSchema,
});
