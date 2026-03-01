import { PartyTreeGraph } from "./party-tree.graph";
import { GraphLegend } from "./graph-legend";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { PartyTreeView } from "./party-tree.view";
import { PartyNodeDiagram } from "./party-node-diagram";
import { Network, Users, ArrowLeftRight, Globe } from "lucide-react";
import partyEntities from "./demo.json";
const FILTERS = [
  { mode: "all", label: "All", icon: Network },
  { mode: "relations", label: "Relations", icon: Users },
  { mode: "transactions", label: "Transactions", icon: ArrowLeftRight },
  // { mode: "ip", label: "IP Addresses", icon: Globe },
];

// export const partyEntities = {
//   partyId: "P-5000",
//   partyName: "Sheikh Hasina",
//   partyType: "INDIVIDUAL",
//   role: "PRIMARY_PARTY",
//   pepFlag: true,
//   riskRating: "HIGH",
//   status: "ACTIVE",
//   ipAddress: "103.21.244.10",
//   transactions: [
//     {
//       transactionId: "T-1001",
//       from: "Hasina Family Trust",
//       to: "Sheikh Hasina",
//       relationType: "TRANSACTIONAL",
//       amount: 1200000,
//       currency: "USD",
//       frequency: "ANNUAL",
//       purpose: "Family support",
//       riskFlag: "TRUST_TO_PEP",
//       type: "INCOMING",
//       dateRange: "2025",
//     },
//     {
//       transactionId: "T-1002",
//       from: "Joy Digital Services",
//       to: "Sheikh Hasina",
//       relationType: "TRANSACTIONAL",
//       amount: 300000,
//       currency: "USD",
//       frequency: "ANNUAL",
//       purpose: "Dividend",
//       riskFlag: "BUSINESS_TO_PEP",
//       type: "INCOMING",
//       dateRange: "2025",
//     },
//     {
//       transactionId: "T-1003",
//       from: "Sheikh Hasina",
//       to: "Hasina Family Trust",
//       relationType: "TRANSACTIONAL",
//       amount: 450000,
//       currency: "USD",
//       frequency: "ANNUAL",
//       purpose: "Trust funding",
//       riskFlag: "PEP_TO_TRUST",
//       type: "OUTGOING",
//       dateRange: "2025",
//     },
//     {
//       transactionId: "T-1004",
//       from: "Sheikh Hasina",
//       to: "Bangladesh Future Foundation",
//       relationType: "TRANSACTIONAL",
//       amount: 200000,
//       currency: "USD",
//       frequency: "ANNUAL",
//       purpose: "Charitable donation",
//       riskFlag: "PEP_TO_NGO",
//       type: "OUTGOING",
//       dateRange: "2025",
//     },
//     {
//       transactionId: "T-1005",
//       from: "Prime Minister's Office",
//       to: "Sheikh Hasina",
//       relationType: "TRANSACTIONAL",
//       amount: 50000,
//       currency: "USD",
//       frequency: "MONTHLY",
//       purpose: "Official salary",
//       riskFlag: "GOVERNMENT_TO_PEP",
//       type: "INCOMING",
//       dateRange: "2025",
//     },
//   ],
//   children: [
//     // IMMEDIATE FAMILY - Children of Sheikh Hasina
//     {
//       partyId: "P-5001",
//       partyName: "Sajeeb Wazed Joy",
//       partyType: "INDIVIDUAL",
//       role: "IMMEDIATE_FAMILY",
//       relationshipToParent: "SON",
//       relationType: "FAMILY",
//       riskRating: "MEDIUM",
//       status: "ACTIVE",
//       ipAddress: "103.21.244.21",
//       transactions: Array.from({ length: 18 }, (_, i) => ({
//         transactionId: `T-200${i + 1}`,
//         from: i % 2 === 0 ? "Sheikh Hasina" : "Joy Digital Services",
//         to: "Sajeeb Wazed Joy",
//         relationType: "TRANSACTIONAL",
//         amount: 100000 + i * 15000,
//         currency: "USD",
//         frequency: "MONTHLY",
//         purpose: "Family support & business income",
//         riskFlag: "PEP_FAMILY_TRANSFER",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         // Close Associates of Sajeeb Wazed Joy
//         {
//           partyId: "P-5002",
//           partyName: "Rakib Hasan",
//           partyType: "INDIVIDUAL",
//           role: "CLOSE_ASSOCIATE",
//           relationshipToParent: "FRIEND",
//           relationType: "SOCIAL",
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "192.168.10.45",
//           transactions: Array.from({ length: 14 }, (_, i) => ({
//             transactionId: `T-300${i + 1}`,
//             from: i % 2 === 0 ? "Sajeeb Wazed Joy" : "Rakib Tech Solutions Ltd",
//             to: "Rakib Hasan",
//             relationType: "TRANSACTIONAL",
//             amount: 75000 + i * 12000,
//             currency: "USD",
//             frequency: "MONTHLY",
//             purpose: "Consulting & advisory fees",
//             riskFlag: "PEP_TO_ASSOCIATE",
//             type: "INCOMING",
//             dateRange: "2025",
//           })),
//           children: [
//             // Business owned by Rakib Hasan
//             {
//               partyId: "P-5003",
//               partyName: "Rakib Tech Solutions Ltd",
//               partyType: "BUSINESS",
//               role: "OWNED_ENTITY",
//               relationshipToParent: "DIRECTOR",
//               relationType: "CONTROL",
//               ownershipPercentage: 55,
//               riskRating: "HIGH",
//               status: "ACTIVE",
//               ipAddress: "172.16.5.10",
//               transactions: Array.from({ length: 9 }, (_, i) => ({
//                 transactionId: `T-400${i + 1}`,
//                 from: "Rakib Tech Solutions Ltd",
//                 to: i % 2 === 0 ? "Joy Digital Services" : "Hasina Family Trust",
//                 relationType: "TRANSACTIONAL",
//                 amount: 200000 + i * 25000,
//                 currency: "USD",
//                 frequency: "QUARTERLY",
//                 purpose: "Service & profit transfer",
//                 riskFlag: "RELATED_PARTY_TRANSFER",
//                 type: "OUTGOING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//         // Business owned by Sajeeb Wazed Joy
//         {
//           partyId: "P-5004",
//           partyName: "Joy Digital Services",
//           partyType: "BUSINESS",
//           role: "BENEFICIAL_OWNER",
//           relationshipToParent: "FOUNDER",
//           relationType: "OWNERSHIP",
//           ownershipPercentage: 100,
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "10.10.20.30",
//           transactions: Array.from({ length: 10 }, (_, i) => ({
//             transactionId: `T-500${i + 1}`,
//             from: "Joy Digital Services",
//             to: i % 2 === 0 ? "Sheikh Hasina" : "Joy Innovations LLP",
//             relationType: "TRANSACTIONAL",
//             amount: 180000 + i * 30000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Dividends & operational funding",
//             riskFlag: "BUSINESS_RELATED_PARTY",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [
//             // Subsidiary of Joy Digital Services
//             {
//               partyId: "P-5005",
//               partyName: "Joy Innovations LLP",
//               partyType: "BUSINESS",
//               role: "SUBSIDIARY",
//               relationshipToParent: "MANAGING_PARTNER",
//               relationType: "CONTROL",
//               ownershipPercentage: 70,
//               riskRating: "MEDIUM",
//               status: "ACTIVE",
//               ipAddress: "10.10.30.40",
//               transactions: Array.from({ length: 6 }, (_, i) => ({
//                 transactionId: `T-600${i + 1}`,
//                 from: "Joy Innovations LLP",
//                 to: "Hasina Family Trust",
//                 relationType: "TRANSACTIONAL",
//                 amount: 140000 + i * 20000,
//                 currency: "USD",
//                 frequency: "SEMI_ANNUAL",
//                 purpose: "Return on capital",
//                 riskFlag: "SUBSIDIARY_TO_TRUST",
//                 type: "OUTGOING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//         // Additional close associate
//         {
//           partyId: "P-5006",
//           partyName: "Tanvir Ahmed",
//           partyType: "INDIVIDUAL",
//           role: "CLOSE_ASSOCIATE",
//           relationshipToParent: "BUSINESS_PARTNER",
//           relationType: "PROFESSIONAL",
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "192.168.10.67",
//           transactions: Array.from({ length: 8 }, (_, i) => ({
//             transactionId: `T-310${i + 1}`,
//             from: "Tanvir Ahmed",
//             to: "Joy Digital Services",
//             relationType: "TRANSACTIONAL",
//             amount: 50000 + i * 8000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Investment contribution",
//             riskFlag: "ASSOCIATE_TO_BUSINESS",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [],
//         },
//       ],
//     },
//     // Daughter of Sheikh Hasina
//     {
//       partyId: "P-5007",
//       partyName: "Saima Wazed Putul",
//       partyType: "INDIVIDUAL",
//       role: "IMMEDIATE_FAMILY",
//       relationshipToParent: "DAUGHTER",
//       relationType: "FAMILY",
//       riskRating: "MEDIUM",
//       status: "ACTIVE",
//       ipAddress: "103.21.244.22",
//       transactions: Array.from({ length: 12 }, (_, i) => ({
//         transactionId: `T-210${i + 1}`,
//         from: i % 2 === 0 ? "Sheikh Hasina" : "Putul Welfare Foundation",
//         to: "Saima Wazed Putul",
//         relationType: "TRANSACTIONAL",
//         amount: 80000 + i * 10000,
//         currency: "USD",
//         frequency: "MONTHLY",
//         purpose: "Personal & charitable support",
//         riskFlag: "PEP_FAMILY_TRANSFER",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         // NGO founded by Saima Wazed Putul
//         {
//           partyId: "P-5008",
//           partyName: "Putul Welfare Foundation",
//           partyType: "LEGAL_ENTITY",
//           role: "NGO_FOUNDER",
//           relationshipToParent: "FOUNDER",
//           relationType: "CONTROL",
//           riskRating: "LOW",
//           status: "ACTIVE",
//           ipAddress: "172.31.50.15",
//           transactions: Array.from({ length: 7 }, (_, i) => ({
//             transactionId: `T-710${i + 1}`,
//             from: i % 2 === 0 ? "Saima Wazed Putul" : "WHO Bangladesh",
//             to: "Putul Welfare Foundation",
//             relationType: "TRANSACTIONAL",
//             amount: 120000 + i * 30000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Donations & grants",
//             riskFlag: "NGO_FUNDING",
//             type: "INCOMING",
//             dateRange: "2025",
//           })),
//           children: [
//             // Partner organization
//             {
//               partyId: "P-5009",
//               partyName: "Autism Awareness Centre",
//               partyType: "LEGAL_ENTITY",
//               role: "PARTNER",
//               relationshipToParent: "GRANTEE",
//               relationType: "TRANSACTIONAL",
//               riskRating: "LOW",
//               status: "ACTIVE",
//               ipAddress: "172.31.50.25",
//               transactions: Array.from({ length: 5 }, (_, i) => ({
//                 transactionId: `T-720${i + 1}`,
//                 from: "Putul Welfare Foundation",
//                 to: "Autism Awareness Centre",
//                 relationType: "TRANSACTIONAL",
//                 amount: 40000 + i * 15000,
//                 currency: "USD",
//                 frequency: "SEMI_ANNUAL",
//                 purpose: "Program funding",
//                 riskFlag: "NGO_GRANT",
//                 type: "OUTGOING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//         // International partner
//         {
//           partyId: "P-5010",
//           partyName: "WHO Bangladesh",
//           partyType: "LEGAL_ENTITY",
//           role: "INTERNATIONAL_PARTNER",
//           relationshipToParent: "COLLABORATOR",
//           relationType: "TRANSACTIONAL",
//           riskRating: "LOW",
//           status: "ACTIVE",
//           ipAddress: "10.50.60.70",
//           transactions: Array.from({ length: 4 }, (_, i) => ({
//             transactionId: `T-730${i + 1}`,
//             from: "WHO Geneva",
//             to: "WHO Bangladesh",
//             relationType: "TRANSACTIONAL",
//             amount: 500000 + i * 100000,
//             currency: "CHF",
//             frequency: "ANNUAL",
//             purpose: "Country budget",
//             riskFlag: "INTERNATIONAL_FUNDING",
//             type: "INCOMING",
//             dateRange: "2025",
//           })),
//           children: [
//             {
//               partyId: "P-5011",
//               partyName: "WHO Geneva",
//               partyType: "LEGAL_ENTITY",
//               role: "HEADQUARTERS",
//               relationshipToParent: "PARENT",
//               relationType: "CONTROL",
//               riskRating: "LOW",
//               status: "ACTIVE",
//               ipAddress: "10.50.60.1",
//               transactions: [],
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//     // Family Trust
//     {
//       partyId: "P-5012",
//       partyName: "Hasina Family Trust",
//       partyType: "LEGAL_ENTITY",
//       role: "TRUST",
//       relationshipToParent: "SETTLOR",
//       relationType: "LEGAL_STRUCTURE",
//       riskRating: "HIGH",
//       status: "ACTIVE",
//       ipAddress: "172.31.100.5",
//       transactions: Array.from({ length: 8 }, (_, i) => ({
//         transactionId: `T-800${i + 1}`,
//         from: "Hasina Family Trust",
//         to: i % 3 === 0 ? "Sheikh Hasina" : i % 3 === 1 ? "Sajeeb Wazed Joy" : "Saima Wazed Putul",
//         relationType: "TRANSACTIONAL",
//         amount: 200000 + i * 100000,
//         currency: "USD",
//         frequency: "ANNUAL",
//         purpose: "Trust distribution",
//         riskFlag: "TRUST_TO_BENEFICIARY",
//         type: "OUTGOING",
//         dateRange: "2025",
//       })),
//       children: [
//         // Investments by the trust
//         {
//           partyId: "P-5013",
//           partyName: "Trust Properties Ltd",
//           partyType: "BUSINESS",
//           role: "INVESTMENT_VEHICLE",
//           relationshipToParent: "OWNED",
//           relationType: "OWNERSHIP",
//           ownershipPercentage: 100,
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "172.31.100.15",
//           transactions: Array.from({ length: 6 }, (_, i) => ({
//             transactionId: `T-810${i + 1}`,
//             from: "Hasina Family Trust",
//             to: "Trust Properties Ltd",
//             relationType: "TRANSACTIONAL",
//             amount: 500000 + i * 200000,
//             currency: "USD",
//             frequency: "ANNUAL",
//             purpose: "Capital injection",
//             riskFlag: "TRUST_TO_BUSINESS",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [],
//         },
//       ],
//     },
//     // Sister of Sheikh Hasina (Extended Family)
//     {
//       partyId: "P-5014",
//       partyName: "Rehana Rahman",
//       partyType: "INDIVIDUAL",
//       role: "EXTENDED_FAMILY",
//       relationshipToParent: "SISTER",
//       relationType: "FAMILY",
//       riskRating: "MEDIUM",
//       status: "ACTIVE",
//       ipAddress: "103.21.244.30",
//       transactions: Array.from({ length: 6 }, (_, i) => ({
//         transactionId: `T-900${i + 1}`,
//         from: "Sheikh Hasina",
//         to: "Rehana Rahman",
//         relationType: "TRANSACTIONAL",
//         amount: 50000 + i * 20000,
//         currency: "USD",
//         frequency: "QUARTERLY",
//         purpose: "Family support",
//         riskFlag: "PEP_TO_FAMILY",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         // Rehana's children (niece/nephew of Sheikh Hasina)
//         {
//           partyId: "P-5015",
//           partyName: "Tulip Siddiqui",
//           partyType: "INDIVIDUAL",
//           role: "EXTENDED_FAMILY",
//           relationshipToParent: "DAUGHTER",
//           relationType: "FAMILY",
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "103.21.244.31",
//           transactions: Array.from({ length: 5 }, (_, i) => ({
//             transactionId: `T-910${i + 1}`,
//             from: "Rehana Rahman",
//             to: "Tulip Siddiqui",
//             relationType: "TRANSACTIONAL",
//             amount: 30000 + i * 10000,
//             currency: "GBP",
//             frequency: "QUARTERLY",
//             purpose: "Family support",
//             riskFlag: "FAMILY_TRANSFER",
//             type: "INCOMING",
//             dateRange: "2025",
//           })),
//           children: [
//             // Tulip's political activities
//             {
//               partyId: "P-5016",
//               partyName: "Tulip for Parliament",
//               partyType: "LEGAL_ENTITY",
//               role: "POLITICAL_CAMPAIGN",
//               relationshipToParent: "FOUNDER",
//               relationType: "CONTROL",
//               riskRating: "MEDIUM",
//               status: "ACTIVE",
//               ipAddress: "192.168.20.10",
//               transactions: Array.from({ length: 4 }, (_, i) => ({
//                 transactionId: `T-920${i + 1}`,
//                 from: "Tulip Siddiqui",
//                 to: "Tulip for Parliament",
//                 relationType: "TRANSACTIONAL",
//                 amount: 20000 + i * 5000,
//                 currency: "GBP",
//                 frequency: "MONTHLY",
//                 purpose: "Campaign funding",
//                 riskFlag: "POLITICAL_FUNDING",
//                 type: "OUTGOING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//         {
//           partyId: "P-5017",
//           partyName: "Azmin Siddiqui",
//           partyType: "INDIVIDUAL",
//           role: "EXTENDED_FAMILY",
//           relationshipToParent: "SON",
//           relationType: "FAMILY",
//           riskRating: "LOW",
//           status: "ACTIVE",
//           ipAddress: "103.21.244.32",
//           transactions: [],
//           children: [
//             // Azmin's business
//             {
//               partyId: "P-5018",
//               partyName: "Consulting Connect Ltd",
//               partyType: "BUSINESS",
//               role: "OWNED_ENTITY",
//               relationshipToParent: "DIRECTOR",
//               relationType: "OWNERSHIP",
//               ownershipPercentage: 100,
//               riskRating: "LOW",
//               status: "ACTIVE",
//               ipAddress: "172.20.30.40",
//               transactions: Array.from({ length: 5 }, (_, i) => ({
//                 transactionId: `T-930${i + 1}`,
//                 from: "Consulting Connect Ltd",
//                 to: "UK Business Partners",
//                 relationType: "TRANSACTIONAL",
//                 amount: 25000 + i * 10000,
//                 currency: "GBP",
//                 frequency: "QUARTERLY",
//                 purpose: "Consulting fees",
//                 riskFlag: "BUSINESS_TRANSFER",
//                 type: "OUTGOING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//     // Business Associates
//     {
//       partyId: "P-5019",
//       partyName: "Salman F Rahman",
//       partyType: "INDIVIDUAL",
//       role: "BUSINESS_ASSOCIATE",
//       relationshipToParent: "ADVISOR",
//       relationType: "PROFESSIONAL",
//       riskRating: "MEDIUM",
//       status: "ACTIVE",
//       ipAddress: "103.21.244.40",
//       transactions: Array.from({ length: 6 }, (_, i) => ({
//         transactionId: `T-1000${i + 1}`,
//         from: "Beximco Group",
//         to: "Salman F Rahman",
//         relationType: "TRANSACTIONAL",
//         amount: 150000 + i * 30000,
//         currency: "USD",
//         frequency: "MONTHLY",
//         purpose: "Advisory fees & dividends",
//         riskFlag: "BUSINESS_TO_INDIVIDUAL",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         // Salman's business empire
//         {
//           partyId: "P-5020",
//           partyName: "Beximco Group",
//           partyType: "BUSINESS",
//           role: "OWNED_ENTITY",
//           relationshipToParent: "CHAIRMAN",
//           relationType: "CONTROL",
//           ownershipPercentage: 60,
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "10.20.30.40",
//           transactions: Array.from({ length: 8 }, (_, i) => ({
//             transactionId: `T-1010${i + 1}`,
//             from: "Beximco Group",
//             to: i % 2 === 0 ? "Hasina Family Trust" : "Joy Digital Services",
//             relationType: "TRANSACTIONAL",
//             amount: 300000 + i * 50000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Joint venture funding",
//             riskFlag: "CORPORATE_PARTNERSHIP",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [
//             // Beximco subsidiary
//             {
//               partyId: "P-5021",
//               partyName: "Beximco Pharmaceuticals",
//               partyType: "BUSINESS",
//               role: "SUBSIDIARY",
//               relationshipToParent: "PARENT_COMPANY",
//               relationType: "CONTROL",
//               ownershipPercentage: 80,
//               riskRating: "MEDIUM",
//               status: "ACTIVE",
//               ipAddress: "10.20.30.50",
//               transactions: Array.from({ length: 5 }, (_, i) => ({
//                 transactionId: `T-1020${i + 1}`,
//                 from: "Beximco Pharmaceuticals",
//                 to: "International Pharma Distributors",
//                 relationType: "TRANSACTIONAL",
//                 amount: 200000 + i * 40000,
//                 currency: "USD",
//                 frequency: "MONTHLY",
//                 purpose: "Export revenue",
//                 riskFlag: "INTERNATIONAL_TRADE",
//                 type: "OUTGOING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//     // Another business associate
//     {
//       partyId: "P-5022",
//       partyName: "Aziz Khan",
//       partyType: "INDIVIDUAL",
//       role: "BUSINESS_ASSOCIATE",
//       relationshipToParent: "PARTNER",
//       relationType: "PROFESSIONAL",
//       riskRating: "MEDIUM",
//       status: "ACTIVE",
//       ipAddress: "103.21.244.41",
//       transactions: Array.from({ length: 4 }, (_, i) => ({
//         transactionId: `T-1100${i + 1}`,
//         from: "Summit Group",
//         to: "Aziz Khan",
//         relationType: "TRANSACTIONAL",
//         amount: 200000 + i * 40000,
//         currency: "USD",
//         frequency: "MONTHLY",
//         purpose: "Chairman's fee",
//         riskFlag: "BUSINESS_TO_INDIVIDUAL",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         {
//           partyId: "P-5023",
//           partyName: "Summit Group",
//           partyType: "BUSINESS",
//           role: "OWNED_ENTITY",
//           relationshipToParent: "CHAIRMAN",
//           relationType: "CONTROL",
//           ownershipPercentage: 40,
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "10.30.40.50",
//           transactions: Array.from({ length: 6 }, (_, i) => ({
//             transactionId: `T-1110${i + 1}`,
//             from: "Summit Group",
//             to: i % 2 === 0 ? "Hasina Family Trust" : "Joy Digital Services",
//             relationType: "TRANSACTIONAL",
//             amount: 400000 + i * 80000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Energy partnership",
//             riskFlag: "CORPORATE_PARTNERSHIP",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [],
//         },
//       ],
//     },
//     // Government entities
//     {
//       partyId: "P-5024",
//       partyName: "Prime Minister's Office",
//       partyType: "LEGAL_ENTITY",
//       role: "GOVERNMENT_ENTITY",
//       relationshipToParent: "OFFICE_HELD",
//       relationType: "GOVERNMENT",
//       riskRating: "LOW",
//       status: "ACTIVE",
//       ipAddress: "10.100.10.1",
//       transactions: Array.from({ length: 3 }, (_, i) => ({
//         transactionId: `T-1200${i + 1}`,
//         from: "Government of Bangladesh",
//         to: "Prime Minister's Office",
//         relationType: "TRANSACTIONAL",
//         amount: 1000000 + i * 500000,
//         currency: "USD",
//         frequency: "ANNUAL",
//         purpose: "Budget allocation",
//         riskFlag: "GOVERNMENT_FUNDING",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         {
//           partyId: "P-5025",
//           partyName: "Government of Bangladesh",
//           partyType: "LEGAL_ENTITY",
//           role: "SOVEREIGN",
//           relationshipToParent: "PARENT",
//           relationType: "GOVERNMENT",
//           riskRating: "LOW",
//           status: "ACTIVE",
//           ipAddress: "10.100.10.0",
//           transactions: [],
//           children: [
//             // Other government departments
//             {
//               partyId: "P-5026",
//               partyName: "Ministry of Finance",
//               partyType: "LEGAL_ENTITY",
//               role: "GOVERNMENT_DEPARTMENT",
//               relationshipToParent: "DEPARTMENT",
//               relationType: "GOVERNMENT",
//               riskRating: "LOW",
//               status: "ACTIVE",
//               ipAddress: "10.100.20.1",
//               transactions: Array.from({ length: 4 }, (_, i) => ({
//                 transactionId: `T-1300${i + 1}`,
//                 from: "Government of Bangladesh",
//                 to: "Ministry of Finance",
//                 relationType: "TRANSACTIONAL",
//                 amount: 2000000 + i * 1000000,
//                 currency: "USD",
//                 frequency: "ANNUAL",
//                 purpose: "Department budget",
//                 riskFlag: "GOVERNMENT_FUNDING",
//                 type: "INCOMING",
//                 dateRange: "2025",
//               })),
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//     // International connections
//     {
//       partyId: "P-5027",
//       partyName: "Delaware Investments LLC",
//       partyType: "BUSINESS",
//       role: "INTERNATIONAL_PARTNER",
//       relationshipToParent: "INVESTMENT_PARTNER",
//       relationType: "TRANSACTIONAL",
//       riskRating: "MEDIUM",
//       status: "ACTIVE",
//       ipAddress: "208.67.217.130",
//       transactions: Array.from({ length: 5 }, (_, i) => ({
//         transactionId: `T-1400${i + 1}`,
//         from: "Joy Digital Services",
//         to: "Delaware Investments LLC",
//         relationType: "TRANSACTIONAL",
//         amount: 500000 + i * 100000,
//         currency: "USD",
//         frequency: "ANNUAL",
//         purpose: "Overseas investment",
//         riskFlag: "INTERNATIONAL_TRANSFER",
//         type: "OUTGOING",
//         dateRange: "2025",
//       })),
//       children: [
//         {
//           partyId: "P-5028",
//           partyName: "Delaware Holdings",
//           partyType: "BUSINESS",
//           role: "SUBSIDIARY",
//           relationshipToParent: "PARENT",
//           relationType: "CONTROL",
//           ownershipPercentage: 100,
//           riskRating: "MEDIUM",
//           status: "ACTIVE",
//           ipAddress: "208.67.217.131",
//           transactions: Array.from({ length: 4 }, (_, i) => ({
//             transactionId: `T-1410${i + 1}`,
//             from: "Delaware Holdings",
//             to: "Delaware Investments LLC",
//             relationType: "TRANSACTIONAL",
//             amount: 200000 + i * 50000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Dividend repatriation",
//             riskFlag: "INTERNAL_TRANSFER",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [],
//         },
//       ],
//     },
//     // NGOs and foundations
//     {
//       partyId: "P-5029",
//       partyName: "Bangladesh Future Foundation",
//       partyType: "LEGAL_ENTITY",
//       role: "NGO",
//       relationshipToParent: "CHARITY",
//       relationType: "TRANSACTIONAL",
//       riskRating: "LOW",
//       status: "ACTIVE",
//       ipAddress: "172.40.50.60",
//       transactions: Array.from({ length: 4 }, (_, i) => ({
//         transactionId: `T-1500${i + 1}`,
//         from: "Sheikh Hasina",
//         to: "Bangladesh Future Foundation",
//         relationType: "TRANSACTIONAL",
//         amount: 100000 + i * 50000,
//         currency: "USD",
//         frequency: "ANNUAL",
//         purpose: "Charitable donation",
//         riskFlag: "PEP_DONATION",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [
//         {
//           partyId: "P-5030",
//           partyName: "Future Youth Program",
//           partyType: "LEGAL_ENTITY",
//           role: "PROGRAM",
//           relationshipToParent: "INITIATIVE",
//           relationType: "TRANSACTIONAL",
//           riskRating: "LOW",
//           status: "ACTIVE",
//           ipAddress: "172.40.50.61",
//           transactions: Array.from({ length: 3 }, (_, i) => ({
//             transactionId: `T-1510${i + 1}`,
//             from: "Bangladesh Future Foundation",
//             to: "Future Youth Program",
//             relationType: "TRANSACTIONAL",
//             amount: 30000 + i * 10000,
//             currency: "USD",
//             frequency: "QUARTERLY",
//             purpose: "Program funding",
//             riskFlag: "NGO_GRANT",
//             type: "OUTGOING",
//             dateRange: "2025",
//           })),
//           children: [],
//         },
//       ],
//     },
//     // Media entities
//     {
//       partyId: "P-5031",
//       partyName: "Daily Star",
//       partyType: "BUSINESS",
//       role: "MEDIA_PARTNER",
//       relationshipToParent: "MEDIA",
//       relationType: "TRANSACTIONAL",
//       riskRating: "LOW",
//       status: "ACTIVE",
//       ipAddress: "10.80.90.100",
//       transactions: Array.from({ length: 3 }, (_, i) => ({
//         transactionId: `T-1600${i + 1}`,
//         from: "Joy Digital Services",
//         to: "Daily Star",
//         relationType: "TRANSACTIONAL",
//         amount: 25000 + i * 5000,
//         currency: "USD",
//         frequency: "MONTHLY",
//         purpose: "Advertisement",
//         riskFlag: "BUSINESS_TO_MEDIA",
//         type: "OUTGOING",
//         dateRange: "2025",
//       })),
//       children: [],
//     },
//     {
//       partyId: "P-5032",
//       partyName: "Prothom Alo",
//       partyType: "BUSINESS",
//       role: "MEDIA_PARTNER",
//       relationshipToParent: "MEDIA",
//       relationType: "TRANSACTIONAL",
//       riskRating: "LOW",
//       status: "ACTIVE",
//       ipAddress: "10.80.90.110",
//       transactions: Array.from({ length: 3 }, (_, i) => ({
//         transactionId: `T-1610${i + 1}`,
//         from: "Hasina Family Trust",
//         to: "Prothom Alo",
//         relationType: "TRANSACTIONAL",
//         amount: 30000 + i * 6000,
//         currency: "USD",
//         frequency: "MONTHLY",
//         purpose: "Advertisement",
//         riskFlag: "TRUST_TO_MEDIA",
//         type: "OUTGOING",
//         dateRange: "2025",
//       })),
//       children: [],
//     },
//     // Educational institutions
//     {
//       partyId: "P-5033",
//       partyName: "Sheikh Russel National Child Hospital",
//       partyType: "LEGAL_ENTITY",
//       role: "INSTITUTION",
//       relationshipToParent: "PATRON",
//       relationType: "TRANSACTIONAL",
//       riskRating: "LOW",
//       status: "ACTIVE",
//       ipAddress: "10.110.120.130",
//       transactions: Array.from({ length: 2 }, (_, i) => ({
//         transactionId: `T-1700${i + 1}`,
//         from: "Sheikh Hasina",
//         to: "Sheikh Russel National Child Hospital",
//         relationType: "TRANSACTIONAL",
//         amount: 500000 + i * 200000,
//         currency: "USD",
//         frequency: "ANNUAL",
//         purpose: "Donation",
//         riskFlag: "PEP_DONATION",
//         type: "INCOMING",
//         dateRange: "2025",
//       })),
//       children: [],
//     },
//     // Additional business partners
//   ],
// };

function flatten(node, parent, out) {
  out.push({
    name: node.partyName,
    partyId: node.partyId,
    partyType: node.partyType,
    role: node.role,
    pepFlag: node.pepFlag ?? false,
    riskRating: node.riskRating,
    status: node.status,
    ipAddress: node.ipAddress,
    parentName: parent,
    relation: node.relationshipToParent ?? "self",
    relationType: node.relationType ?? "FAMILY",
    ownershipPercentage: node.ownershipPercentage,
    transactions: node.transactions,
  });
  for (const child of node?.children) flatten(child, node.partyName, out);
}
const _flat = [];
flatten(partyEntities, null, _flat);
const entities = _flat;

export function RelationsTree() {
  const [viewMode, setViewMode] = useState("family");
  const [filterMode, setFilterMode] = useState("all");
  const expandAllRef = useRef(null);
  const collapseAllRef = useRef(null);
  return (
    <main className="min-h-screen ">
      <div className=" px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
              Party Relationship Graph
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Click a node to expand its children. Drag nodes to rearrange. Scroll to zoom, drag the
              canvas to pan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Expand / Collapse buttons */}
            <button
              type="button"
              onClick={() => expandAllRef.current?.()}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={() => collapseAllRef.current?.()}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              Collapse All
            </button>

            {/* View mode toggle */}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="graph">Graph View</TabsTrigger>
            {/* <TabsTrigger value="tree">Tree View</TabsTrigger> */}
            <TabsTrigger value="diagram">Tree View</TabsTrigger>
          </TabsList>

          {/* Graph View Tab */}
          <TabsContent value="graph" className="mt-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Legend Bar */}
              {/* <div className="border-b border-border px-6 py-3">
                <GraphLegend viewMode={viewMode} />
              </div> */}

              {/* Graph */}
              <div className="h-[1580px]">
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                  {/* Filter bar + Legend */}
                  <div className="border-b border-border px-5 py-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/50">
                        {FILTERS.map(({ mode: m, label, icon: Icon }) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setFilterMode(m)}
                            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                              filterMode === m
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <GraphLegend filterMode={filterMode} />
                  </div>
                  <div className="h-[1500px]">
                    <PartyTreeGraph
                      entities={entities}
                      filterMode={filterMode}
                      expandAllRef={expandAllRef}
                      collapseAllRef={collapseAllRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tree View Tab */}
          <TabsContent value="tree" className="mt-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Legend Bar */}
              <div className="border-b border-border px-6 py-3">
                <GraphLegend viewMode={viewMode} />
              </div>

              {/* Tree */}
              <div className="h-[680px]">
                {/* <PartyTreeView data={dummyData} viewMode={viewMode} /> */}
              </div>
            </div>
          </TabsContent>

          {/* Node Diagram Tab */}
          <TabsContent value="diagram" className="mt-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Legend Bar */}
              <div className="border-b border-border px-6 py-3">
                <GraphLegend viewMode={viewMode} />
              </div>

              {/* Diagram */}
              <div className="h-[680px]">
                <PartyNodeDiagram entities={entities} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }) {
  const accentColor =
    accent === "green"
      ? "#22c55e"
      : accent === "red"
        ? "#ef4444"
        : accent === "amber"
          ? "#f59e0b"
          : "#0ea5e9";

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}
