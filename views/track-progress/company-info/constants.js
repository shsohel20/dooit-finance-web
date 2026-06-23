import { nationalitiesData } from "@/constants";

export const SECTOR_OPTIONS = [
  { value: "conveyancing", label: "Conveyancing" },
  { value: "accounting", label: "Accounting" },
  { value: "legal", label: "Legal" },
  { value: "financial_services", label: "Financial Services" },
  { value: "real_estate", label: "Real Estate" },
];

export const DOCUMENT_TYPES = [
  { label: "Passport", value: "Passport", sides: 1 },
  { label: "Driving License", value: "driving_license", sides: 2 },
  { label: "National ID", value: "nid", sides: 2 },
];

export const DEPARTMENT_OPTIONS = [
  { value: "compliance", label: "Compliance" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "IT" },
  { value: "other", label: "Other" },
];

export const JOB_TITLE_OPTIONS = [
  { value: "aml_analyst", label: "AML Analyst" },
  { value: "compliance_officer", label: "Compliance Officer" },
  { value: "senior_manager", label: "Senior Manager" },
  { value: "governing_body", label: "Governing Body" },
  { value: "client_facing", label: "Client Facing" },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "casual", label: "Casual" },
];

export const NATIONALITY_OPTIONS = nationalitiesData.map(({ label, value }) => ({
  label,
  value,
}));

export const toRoleSlug = (name) =>
  name
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") ?? "";

export const emptyPerson = (roleSlug = "") => ({
  personal: {
    role: roleSlug,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
  },
  contact: {
    workEmail: "",
    phone: "",
    residentialAddress: "",
  },
  employment: {
    startDate: "",
    department: "",
    jobTitle: "",
    employmentType: "",
  },
  document_type: "",
  documents: [],
});

export const emptyRoleAssignment = () => ({
  roleId: "",
  people: [],
});
