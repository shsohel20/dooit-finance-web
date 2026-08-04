// Static configuration for the investigation wizard: the ordered list of
// steps, the option sets each step offers, and the field definitions for the
// structured narrative / SMR forms. Kept data-only (no React) so it can be
// unit-tested and imported by both the wizard hook and the step renderers.

export const INVESTIGATION_STEPS = [
  {
    key: "triage",
    name: "Triage",
    kind: "options",
    multi: false,
    title: "Triage the alert",
    subtitle: "Decide whether this alert warrants a full investigation.",
    options: ["Proceed to investigation", "Escalate to senior analyst", "Dismiss as false positive"],
  },
  {
    key: "gather-information",
    name: "Gather Information",
    kind: "options",
    multi: true,
    title: "Gather information",
    subtitle: "Confirm the information and documents collected for this case.",
    options: [
      "Customer KYC / CDD record",
      "Transaction history export",
      "Source of funds documentation",
      "Previous case history",
      "Device & IP data",
      "OSINT report",
    ],
  },
  {
    key: "date-ranges",
    name: "Date Ranges",
    kind: "dateRange",
    title: "Set activity date range",
    subtitle: "Define the period of activity covered by this review.",
  },
  {
    key: "pois",
    name: "POIs",
    kind: "poi",
    title: "Persons of interest",
    subtitle: "Individuals and entities linked to the suspicious activity.",
  },
  {
    key: "suspicious-activities",
    name: "Suspicious Activities",
    kind: "options",
    multi: true,
    title: "Suspicious activities & red flags",
    subtitle: "Select all red-flag indicators observed in this case.",
    options: [
      "Structuring / deposits below reporting threshold",
      "Cash deposits inconsistent with customer profile",
      "Rapid movement of funds in and out",
      "Third-party access to the account",
      "Links to previously flagged wallets",
      "Customer behaviour suggesting duress",
      "CCTV mismatch with stated customer",
      "Use of crypto to obscure the money trail",
    ],
  },
  {
    key: "products",
    name: "Products",
    kind: "options",
    multi: true,
    title: "Products & instruments",
    subtitle: "Select all products and instruments involved in the activity.",
    options: [
      "Cash deposit",
      "Domestic wire transfer",
      "International wire transfer",
      "Crypto wallet",
      "Debit card",
      "Merchant account",
    ],
  },
  {
    key: "narrative",
    name: "Narrative",
    kind: "narrative",
    title: "Describe the activity that occurred",
    subtitle: "Complete the structured narrative. Choose the template that matches this report type.",
    rightLabel: "Structured narrative",
  },
  {
    key: "typologies",
    name: "Typologies",
    kind: "options",
    multi: true,
    grouped: true,
    canAdd: true,
    title: "Set typologies",
    subtitle: "Select all applicable typologies (multiple allowed). Add your own if a typology is missing.",
  },
  {
    key: "decision",
    name: "Decision",
    kind: "options",
    multi: false,
    title: "Investigation decision",
    subtitle: "Choose the outcome of this investigation.",
    options: ["File SMR / SAR", "Issue Request for Information (RFI)", "Dismiss — no further action"],
  },
  {
    key: "manager-review",
    name: "Manager Review",
    kind: "options",
    multi: false,
    title: "Manager review",
    subtitle: "Manager's approval decision for this case.",
    options: ["Approve", "Approve with conditions", "Request changes — with notes", "Reject", "Escalate to MLRO"],
  },
  {
    key: "smr",
    name: "SMR / Dismissal / RFI",
    kind: "smr",
    title: "Suspicious Matter Report",
    subtitle: "Complete as much of this form as possible as required under applicable law.",
    rightLabel: "AUSTRAC SMR",
  },
  {
    key: "ongoing-monitoring",
    name: "Ongoing Monitoring",
    kind: "options",
    multi: false,
    title: "Should this case be monitored?",
    subtitle: "Decide whether continued monitoring is required after closure.",
    options: ["Yes — flag for ongoing monitoring", "No — no further monitoring"],
  },
];

export const TYPOLOGY_GROUPS = [
  {
    label: "Placement & structuring",
    options: [
      "Structuring / smurfing",
      "Cash-intensive business misuse",
      "Bulk cash smuggling",
      "Cuckoo smurfing",
      "Refining / currency exchange",
    ],
  },
  {
    label: "Layering & concealment",
    options: [
      "Layering",
      "Round-tripping",
      "Funnel accounts",
      "Shell / front company",
      "Nominee / strawman arrangement",
      "3rd-party wallet use",
      "Trade-based money laundering",
    ],
  },
  {
    label: "Muling, takeover & identity",
    options: [
      "Money muling",
      "Account takeover",
      "Identity takeover / theft",
      "Account sharing",
      "Fake / stolen ID",
      "Synthetic identity",
    ],
  },
  {
    label: "Predicate crime proceeds",
    options: [
      "Investment fraud",
      "Romance scam",
      "Employment / job scam",
      "Advance-fee fraud",
      "Business email compromise (BEC)",
      "Phishing",
      "Ponzi / pyramid scheme",
      "Bribery / corruption",
      "Tax evasion",
      "Drug trafficking proceeds",
      "Human trafficking / modern slavery",
      "Wildlife trafficking",
    ],
  },
  {
    label: "Terrorism, sanctions & proliferation",
    options: [
      "Terrorism financing",
      "Proliferation financing",
      "Sanctions evasion",
      "PEP / high-risk jurisdiction exposure",
    ],
  },
  {
    label: "Virtual asset typologies",
    options: [
      "Crypto mixing / tumbling",
      "Chain-hopping / cross-chain swaps",
      "Privacy-coin usage",
      "Peer-to-peer laundering",
      "NFT wash trading",
      "Darknet marketplace",
      "Ransomware / cyber-extortion",
    ],
  },
];

export const SMR_SERVICE_OPTIONS = [
  "AFSL holder arranging a designated service",
  "Account / deposit-taking services",
  "Chequebook access facilities",
  "Currency exchange services",
  "Custodial / depository services",
  "Debit card access facilities",
  "Debt instruments",
  "Digital currency exchange services",
  "Electronic funds transfers",
  "Lease / hire purchase services",
  "Life insurance services",
  "Loan services",
  "Money / postal orders",
  "Payroll services",
  "Pension / annuity services",
  "Remittance services (money transfers)",
  "Retirement savings accounts",
  "Securities / investment services",
  "Stored value cards",
  "Superannuation / approved deposit funds",
  "Traveller's cheque services",
  "Bullion dealing",
  "Gambling / betting services",
];

export const SMR_REASON_OPTIONS = [
  "ATM / cheque fraud",
  "Advanced fee / scam",
  "Avoiding reporting obligations",
  "Corporate / investment fraud",
  "Counterfeit currency",
  "Country / jurisdiction risk",
  "Credit card fraud",
  "Credit / loan facility fraud",
  "Currency not declared at border",
  "DFAT watch list",
  "False name / identity or documents",
  "Immigration related issue",
  "Inconsistent with customer profile",
  "Internet fraud",
  "National security concern",
  "Other watch list",
  "Phishing",
  "Refusal to show identification",
  "Suspected / known criminal",
  "Suspicious behaviour",
  "Unauthorised account transactions",
  "Unusual account activity",
  "Unusual use / exchange of cash",
  "Unusually large FX transaction",
  "Unusually large cash transaction",
  "Unusually large transfer",
];

export const SMR_PROVIDED_OPTIONS = ["Provided", "Requested", "Enquired about"];

export const SMR_PART_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const SMR_PART_TITLES = {
  A: "Part A — Details of the Matter",
  B: "Part B — Grounds for Suspicion",
  C: "Part C — Persons / Customers Involved",
  D: "Part D — Accounts Involved",
  E: "Part E — Transactions",
  F: "Part F — Property & Goods",
  G: "Part G — Reporting Entity",
  H: "Part H — Declaration & Submission",
};

function field(label, type, opts = {}) {
  return {
    label,
    type,
    placeholder: opts.placeholder || "",
    options: opts.options || [],
    full: type === "textarea" || !!opts.full,
  };
}

export function ecddSections() {
  return [
    {
      heading: "1. Analysis & Review",
      fields: [
        field("Analysed by — name", "text", { placeholder: "Analyst name" }),
        field("Position", "text", { placeholder: "e.g. Compliance Officer" }),
        field("Date", "date"),
        field("Case number", "text", { placeholder: "Case number" }),
      ],
    },
    {
      heading: "2. Customer Profile",
      fields: [
        field("Inherent customer risk rating", "select", { options: ["Low", "Medium", "High"] }),
        field("User ID", "text", { placeholder: "UID" }),
        field("Full / company name", "text", { placeholder: "Enter full name" }),
        field("ABN", "text", { placeholder: "Enter ABN" }),
        field("Onboarding date", "date"),
        field("Account purpose", "text", { placeholder: "e.g. Digital Currency Exchange" }),
        field("Expected trading volume (AUD / month)", "number", { placeholder: "0" }),
        field("Annual income (million AUD)", "number", { placeholder: "0" }),
        field("Beneficial owner", "text", { placeholder: "Enter beneficial owner" }),
        field("Directors", "text", { placeholder: "Enter directors" }),
        field("Profile summary", "textarea", {
          placeholder: "Onboarding summary, adverse media findings, related parties…",
        }),
      ],
    },
    {
      heading: "3. Risk Flags",
      fields: [
        field("Customer is PEP", "select", { options: ["No", "Yes"] }),
        field("Sanctioned customer", "select", { options: ["No", "Yes"] }),
        field("Related party", "text", { placeholder: "N/A" }),
      ],
    },
    {
      heading: "4. Transaction Analysis",
      fields: [
        field("Account creation date", "date"),
        field("Analysis end date", "date"),
        field("Total deposits (AUD)", "number", { placeholder: "0" }),
        field("Total withdrawals (USDT)", "number", { placeholder: "0" }),
        field("Total withdrawals (ETH)", "number", { placeholder: "0" }),
        field("Total withdrawals (BTC)", "number", { placeholder: "0" }),
        field("Deposit details", "textarea", {
          placeholder: "Deposit amounts, sources, screening results…",
        }),
        field("Withdrawal details", "textarea", {
          placeholder: "Withdrawal wallets, exchange rates, screening results…",
        }),
        field("Transaction analysis", "textarea", { placeholder: "Overall pattern and interpretation…" }),
        field("Additional information", "textarea", {
          placeholder: "CCO / account manager commentary…",
        }),
      ],
    },
    {
      heading: "5. Behavioral Analysis",
      fields: [
        field("Number of IP locations", "number", { placeholder: "0" }),
        field("Registered address", "text", { placeholder: "Enter registered address" }),
        field("Behavioral analysis", "textarea", {
          placeholder: "Login / device / IP behaviour, OTC status…",
        }),
      ],
    },
    {
      heading: "6. Recommendation",
      fields: [
        field("Recommendation", "textarea", {
          placeholder: "Continue / offboard, HRC classification, RFI decision…",
        }),
      ],
    },
  ];
}

export function gfsSections() {
  return [
    {
      heading: "1. Suspicion Summary",
      fields: [
        field("Reason for suspicion", "text", { placeholder: "e.g. Person is not who they claim to be" }),
        field("Customer name", "text", { placeholder: "Customer name" }),
      ],
    },
    {
      heading: "2. Customer Profile",
      fields: [
        field("Company / account name", "text", { placeholder: "Company name" }),
        field("Customer UID", "text", { placeholder: "Customer UID" }),
        field("Age", "number", { placeholder: "0" }),
        field("Account opening date", "date"),
        field("Source of funds", "select", {
          options: ["Salary / wages", "Business income", "Investment", "Savings", "Other"],
        }),
        field("Account opening purpose", "text", { placeholder: "AOP" }),
      ],
    },
    {
      heading: "3. Transaction Analysis",
      fields: [
        field("Review period — from", "date"),
        field("Review period — to", "date"),
        field("Total suspicion amount (AUD)", "number", { placeholder: "0" }),
        field("Transaction analysis", "textarea", {
          placeholder: "Third-party requests, DEFTs, crypto wallet transfers, references…",
        }),
      ],
    },
    {
      heading: "4. Conclusion",
      fields: [
        field("Conclusion", "textarea", {
          placeholder: "Origin of funds, unusual pattern, IP vs identity mismatch…",
        }),
      ],
    },
  ];
}

const SMR_FORM_MAP = {
  C: {
    note: "Details of the person(s) / customer(s) involved in the suspicious matter.",
    fields: [
      field("Full name", "text", { placeholder: "Person / entity name" }),
      field("Type", "select", { options: ["Individual", "Organisation"] }),
      field("Date of birth / registration", "date"),
      field("Identification number", "text", { placeholder: "Passport / ABN / licence" }),
      field("Residential / registered address", "text", { placeholder: "Address", full: true }),
      field("Role in the matter", "text", { placeholder: "e.g. account holder, beneficiary", full: true }),
      field("Additional details", "textarea", { placeholder: "Any other identifying information…" }),
    ],
  },
  D: {
    note: "Details of the account(s) involved.",
    fields: [
      field("Account number", "text", { placeholder: "Account number" }),
      field("BSB / branch", "text", { placeholder: "BSB" }),
      field("Account name", "text", { placeholder: "Account name" }),
      field("Account type", "select", {
        options: ["Transaction", "Savings", "Crypto wallet", "Term deposit", "Other"],
      }),
      field("Current balance (AUD)", "number", { placeholder: "0" }),
      field("Date opened", "date"),
      field("Additional details", "textarea", { placeholder: "Signatories, linked accounts…" }),
    ],
  },
  E: {
    note: "Details of the transaction(s) that gave rise to the suspicion.",
    fields: [
      field("Transaction date", "date"),
      field("Amount", "number", { placeholder: "0" }),
      field("Currency", "select", { options: ["AUD", "USD", "USDT", "BTC", "ETH", "Other"] }),
      field("Direction", "select", { options: ["Deposit / credit", "Withdrawal / debit", "Transfer"] }),
      field("From (account / wallet)", "text", { placeholder: "Source" }),
      field("To (account / wallet)", "text", { placeholder: "Destination" }),
      field("Transaction detail", "textarea", {
        placeholder: "Method, references, wallet addresses, pattern…",
      }),
    ],
  },
  F: {
    note: "Details of any property, goods or physical currency involved.",
    fields: [
      field("Type of property", "select", {
        options: ["Physical currency", "Real estate", "Vehicle", "Precious metals", "Digital asset", "Other"],
      }),
      field("Estimated value (AUD)", "number", { placeholder: "0" }),
      field("Description", "textarea", { placeholder: "Description of the property / goods…" }),
    ],
  },
  G: {
    note: "Details of the reporting entity submitting this report.",
    fields: [
      field("Reporting entity", "text", { placeholder: "Reporting entity name" }),
      field("AUSTRAC / regulator ID", "text", { placeholder: "Entity ID" }),
      field("Contact person", "text", { placeholder: "Contact name" }),
      field("Position", "text", { placeholder: "Position" }),
      field("Phone", "text", { placeholder: "Phone" }),
      field("Email", "text", { placeholder: "Email" }),
    ],
  },
  H: {
    note: "Declaration and submission.",
    fields: [
      field("Prepared by", "text", { placeholder: "Name" }),
      field("Position", "text", { placeholder: "Position" }),
      field("Date", "date"),
      field("Declaration", "select", {
        options: ["I declare the information is true and correct", "Not yet confirmed"],
      }),
      field("Submission notes", "textarea", { placeholder: "Any notes for the submission…" }),
    ],
  },
};

export function smrFormSections(part) {
  const def = SMR_FORM_MAP[part];
  if (!def) return [];
  return [{ heading: "", hasNote: true, note: def.note, fields: def.fields }];
}

export const DEFAULT_CHECKLIST = [
  {
    text: "Understand the basis for the suspicion and the steps taken to validate or invalidate the alert.",
    checked: true,
  },
  {
    text: "Examine the customer's profile and any previous interactions with the organization.",
    checked: true,
  },
  {
    text: "Assess the transaction amounts, frequency, and patterns to determine if they raise legitimate concerns.",
    checked: true,
  },
  {
    text: "Confirm the funds' source for flagged transactions aligns with the customer's business and has valid documentation.",
    checked: false,
  },
  { text: "Evaluate the communication between the analyst and the customer.", checked: false },
  { text: "Cross-check OSINT findings against internal KYC records.", checked: false },
  { text: "Document typologies and red-flag indicators observed.", checked: false },
  { text: "Draft the narrative for the suspicious matter report.", checked: false },
  { text: "Prepare recommendation for manager review.", checked: false },
];

export const DEFAULT_STEP_DONE = [
  true, true, true, true, true, true, false, false, false, false, false, false,
];
