"use client";

import { FormField } from "@/components/ui/FormField";
import {
  DEPARTMENT_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_TITLE_OPTIONS,
  NATIONALITY_OPTIONS,
} from "./constants";
import IdentityDocumentsSection from "./IdentityDocumentsSection";
import EmpImage from "./EmpImage";

export default function EmployeeFormFields({ form }) {
  return (
    <div className="space-y-6">
      <div>
        <EmpImage form={form} />
      </div>
      <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            form={form}
            name="personal.firstName"
            label="First name"
            type="text"
            placeholder="Enter first name"
          />
          <FormField
            form={form}
            name="personal.lastName"
            label="Last name"
            type="text"
            placeholder="Enter last name"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField form={form} name="personal.dateOfBirth" label="Date of birth" type="date" />
          <FormField
            form={form}
            name="personal.nationality"
            label="Nationality"
            type="select"
            placeholder="Select nationality"
            options={NATIONALITY_OPTIONS}
          />
        </div>
      </section>

      <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <FormField
          form={form}
          name="contact.workEmail"
          label="Work email"
          type="email"
          placeholder="name@company.com"
        />
        <FormField
          form={form}
          name="contact.phone"
          label="Phone"
          type="text"
          placeholder="Enter phone number"
        />
        <FormField
          form={form}
          name="contact.residentialAddress"
          label="Residential address"
          type="textarea"
          placeholder="Enter residential address"
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Employment details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField form={form} name="employment.startDate" label="Start date" type="date" />
          <FormField
            form={form}
            name="employment.department"
            label="Department"
            type="select"
            placeholder="Select department"
            options={DEPARTMENT_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* <FormField
            form={form}
            name="employment.jobTitle"
            label="Job title"
            type="select"
            placeholder="Select job title"
            options={JOB_TITLE_OPTIONS}
          /> */}
          <FormField
            form={form}
            name="employment.employmentType"
            label="Employment type"
            type="select"
            placeholder="Select employment type"
            options={EMPLOYMENT_TYPE_OPTIONS}
          />
        </div>
      </section>

      <IdentityDocumentsSection form={form} />
    </div>
  );
}
