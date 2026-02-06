import { z } from 'zod'
import React from 'react'
// {
//     "token": "a94765c2b2296dfa209be56824a5cabcb6dd83ca",
//     "cid": "6906cf020acf10ef6ab1ffd3",
//     "requestedType": "company",
//     "kyc": {
//         "general_information": {
//             "legal_name": "NextTech Solutions Pty Ltd",
//             "trading_names": "NextTech",
//             "phone_number": "+61 412 345 678",
//             "registration_number": "ACN123456789",
//             "country_of_incorporation": "Australia",
//             "contact_email": "info@nexttech.com.au",
//             "industry": "Software Development",
//             "nature_of_business": "Custom web & mobile software solutions",
//             "annual_income": "1M - 5M AUD",
//             "local_agent": {
//                 "name": "John Doe",
//                 "address": {
//                     "street": "15 Harbour Street",
//                     "suburb": "Sydney",
//                     "state": "NSW",
//                     "postcode": "2000",
//                     "country": "Australia"
//                 }
//             },
//             "registered_address": {
//                 "street": "10 Pitt Street",
//                 "suburb": "Sydney",
//                 "state": "NSW",
//                 "postcode": "2000",
//                 "country": "Australia"
//             },
//             "business_address": {
//                 "different_from_registered": true,
//                 "street": "25 Bridge Street",
//                 "suburb": "Sydney",
//                 "state": "NSW",
//                 "postcode": "2000",
//                 "country": "Australia"
//             },
//             "company_type": {
//                 "type": "Private Company",
//                 "is_listed": false
//             },
//             "account_purpose": {
//                 "digital_currency_exchange": false,
//                 "peer_to_peer": true,
//                 "fx": false,
//                 "other": true,
//                 "other_details": "Corporate account for software exports"
//             },
//             "estimated_trading_volume": "500K - 1M AUD / year"
//         },
//         "directors_beneficial_owner": {
//             "directors": [
//                 {
//                     "given_name": "Michael",
//                     "surname": "Anderson"
//                 },
//                 {
//                     "given_name": "Sara",
//                     "surname": "Lee"
//                 }
//             ],
//             "beneficial_owners": [
//                 {
//                     "full_name": "Michael Anderson",
//                     "date_of_birth": "1980-06-21",
//                     "residential_address": {
//                         "street": "5 Bay Road",
//                         "suburb": "North Sydney",
//                         "state": "NSW",
//                         "postcode": "2060",
//                         "country": "Australia"
//                     }
//                 }
//             ]
//         }
//     },
//     "documents": [
//         {
//             "name": "NID Front",
//             "url": "https://yourdomain.com/uploads/nid_front.jpg",
//             "mimeType": "image/jpeg",
//             "type": "nid_front",
//             "docType":"NID"

//         },
//         {
//             "name": "NID Back",
//             "url": "https://yourdomain.com/uploads/nid_back.jpg",
//             "mimeType": "image/jpeg",
//             "type": "nid_back",
//             "docType":"NID"

//         }
//     ],
//     "declaration": {
//         "declarations_accepted": true,
//         "signatory_name": "John Doe",
//         "signature": "https://yourdomain.com/uploads/signature.png",
//         "date": "2025-11-02"
//     }
// }
const schema = z.object({
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
})
const CompanyRegistration = () => {
  return (
    <div>CompanyRegistration</div>
  )
}

export default CompanyRegistration