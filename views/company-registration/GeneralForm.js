import React, { Fragment } from "react";
import { FormField } from "../customer-registration/common/FormField";
import { countriesData } from "@/constants";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export default function GeneralForm({ form }) {
  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
  } = useFieldArray({
    control: form.control,
    name: "directors",
  });
  const {
    fields: beneficialOwnerFields,
    append: appendBeneficialOwner,
    remove: removeBeneficialOwner,
  } = useFieldArray({
    control: form.control,
    name: "beneficial_owners",
  });
  return (
    <div className="  mt-8  space-y-4">
      {/* general information */}
      <div className="space-y-2">
        <h6 className="">General Information</h6>
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border p-4 rounded-lg">
          <FormField
            form={form}
            name="general_information.legal_name"
            label="Legal Name"
            placeholder="Enter Legal Name"
          />
          <FormField
            form={form}
            name="general_information.trading_names"
            label="Trading Names"
            type="text"
            placeholder="Enter Trading Names"
          />
          <FormField
            form={form}
            name="general_information.phone_number"
            label="Phone Number"
            type="text"
            placeholder="Enter Phone Number"
          />
          <FormField
            form={form}
            name="general_information.registration_number"
            label="Registration Number"
            type="text"
            placeholder="Enter Registration Number"
          />
          <FormField
            form={form}
            name="general_information.country_of_incorporation"
            label="Country"
            type="select"
            placeholder="Enter Country of Incorporation"
            options={countriesData}
          />
          <FormField
            form={form}
            name="general_information.contact_email"
            label="Contact Email"
            type="email"
            placeholder="Enter Contact Email"
          />
          <FormField
            form={form}
            name="general_information.industry"
            label="Industry"
            type="text"
            placeholder="Enter Industry"
          />
          <FormField
            form={form}
            name="general_information.nature_of_business"
            label="Nature of Business"
            type="text"
            placeholder="Enter Nature of Business"
          />
          <FormField
            form={form}
            name="general_information.annual_income"
            label="Annual Income"
            type="text"
            placeholder="Enter Annual Income"
          />

          <FormField
            form={form}
            name="general_information.estimated_trading_volume"
            label="Estimated Trading Volume"
            type="text"
            placeholder="Enter Estimated Trading Volume"
          />

          <FormField
            form={form}
            name="general_information.estimated_trading_volume"
            label="Estimated Trading Volume"
            type="text"
            placeholder="Enter Estimated Trading Volume"
          />
          <div className="xl:col-span-2 flex gap-4">
            <FormField
              form={form}
              name="general_information.company_type.type"
              label="Company Type"
              type="select"
              options={[
                { label: "Private Company", value: "private_company" },
                { label: "Public Company", value: "public_company" },
                { label: "Regulated / Licensed Company", value: "regulated_company" },
                { label: "Other", value: "other" },
              ]}
              placeholder="Select Company Type"
            />
            <FormField
              form={form}
              name="general_information.company_type.is_listed"
              label="Is Listed?"
              type="checkbox"
              placeholder="Is Listed"
            />
          </div>
        </div>
      </div>
      {/* registered address */}
      <div className="space-y-2">
        <h6 className="">Registered Address</h6>
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border p-4 rounded-lg">
          <FormField
            form={form}
            name="general_information.registered_address.street"
            label="Street"
            type="text"
            placeholder="Enter Street"
          />
          <FormField
            form={form}
            name="general_information.registered_address.suburb"
            label="Suburb"
            type="text"
            placeholder="Enter Suburb"
          />
          <FormField
            form={form}
            name="general_information.registered_address.state"
            label="State"
            type="text"
            placeholder="Enter State"
          />
          <FormField
            form={form}
            name="general_information.registered_address.postcode"
            label="Postcode"
            type="text"
            placeholder="Enter Postcode"
          />
          <FormField
            form={form}
            name="general_information.registered_address.country"
            label="Country"
            type="select"
            options={countriesData}
            placeholder="Enter Country"
          />
        </div>
      </div>
      {/* business address */}
      <div className="space-y-2">
        <h6 className="">Business Address (if different from registered address)</h6>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border p-4 rounded-lg">
          <div className="xl:col-span-5 lg:col-span-4 md:col-span-3 flex gap-4">
            <FormField
              form={form}
              name="general_information.business_address.different_from_registered"
              label="Different from registered address"
              type="checkbox"
              placeholder="Different from registered address"
            />
          </div>
          {form.watch("general_information.business_address.different_from_registered") && (
            <>
              <FormField
                form={form}
                name="general_information.business_address.street"
                label="Street"
                type="text"
                placeholder="Enter Street"
              />
              <FormField
                form={form}
                name="general_information.business_address.suburb"
                label="Suburb"
                type="text"
                placeholder="Enter Suburb"
              />
              <FormField
                form={form}
                name="general_information.business_address.state"
                label="State"
                type="text"
                placeholder="Enter State"
              />
              <FormField
                form={form}
                name="general_information.business_address.postcode"
                label="Postcode"
                type="text"
                placeholder="Enter Postcode"
              />
              <FormField
                form={form}
                name="general_information.business_address.country"
                label="Country"
                type="select"
                options={countriesData}
                placeholder="Enter Country"
              />
            </>
          )}
        </div>
      </div>
      {/* local agent */}
      <div className="space-y-2">
        <h6 className="">Local Agent</h6>
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border p-4 rounded-lg">
          <FormField
            form={form}
            name="general_information.local_agent.name"
            label="Name"
            type="text"
            placeholder="Enter Name"
          />

          <FormField
            form={form}
            name="general_information.local_agent.address.street"
            label="Street"
            type="text"
            placeholder="Enter Street"
          />

          <FormField
            form={form}
            name="general_information.local_agent.address.suburb"
            label="Suburb"
            type="text"
            placeholder="Enter Suburb"
          />

          <FormField
            form={form}
            name="general_information.local_agent.address.state"
            label="State"
            type="text"
            placeholder="Enter Local Agent"
          />

          <FormField
            form={form}
            name="general_information.local_agent.address.postcode"
            label="Postcode"
            type="text"
            placeholder="Enter Postcode"
          />

          <FormField
            form={form}
            name="general_information.local_agent.address.country"
            label="Country"
            type="select"
            options={countriesData}
            placeholder="Enter Country"
          />
        </div>
      </div>

      {/* account purpose */}
      <div className="space-y-2 border p-4 rounded-lg">
        <h6 className="">Account Purpose</h6>
        <div className=" flex flex-col gap-4 max-w-[200px] ">
          <FormField
            form={form}
            name="general_information.account_purpose.digital_currency_exchange"
            label="Account Purpose"
            type="checkbox"
            placeholder="Enter Account Purpose"
          />
          <FormField
            form={form}
            name="general_information.account_purpose.peer_to_peer"
            label="Peer to Peer"
            type="checkbox"
            placeholder="Enter Account Purpose"
          />
          <FormField
            form={form}
            name="general_information.account_purpose.fx"
            label="FX"
            type="checkbox"
            placeholder="Enter Account Purpose"
          />
          <FormField
            form={form}
            name="general_information.account_purpose.other"
            label="Other"
            type="checkbox"
            placeholder="Enter Account Purpose"
          />
          <FormField
            form={form}
            name="general_information.account_purpose.other_details"
            label="Other Details"
            type="text"
            placeholder="Enter Other Details"
          />
        </div>
      </div>

      {/* directors */}
      <div className="space-y-2 border p-4 rounded-lg">
        <h6 className="">Directors</h6>
        <div className="">
          {directorFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <FormField
                form={form}
                name={`directors.${index}.given_name`}
                label="Given Name"
                type="text"
                placeholder="Enter Given Name"
              />
              <FormField
                form={form}
                name={`directors.${index}.surname`}
                label="Surname"
                type="text"
                placeholder="Enter Surname"
              />
              <Button variant="outline" size="sm" onClick={() => removeDirector(index)}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => appendDirector({ given_name: "", surname: "" })}
        >
          <Plus />
        </Button>
      </div>

      {/* beneficial owners */}
      <div className="space-y-2 border p-4 rounded-lg">
        <h6 className="">Beneficial Owners</h6>
        <div className="">
          {beneficialOwnerFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <FormField
                form={form}
                name={`beneficial_owners.${index}.full_name`}
                label="Full Name"
                type="text"
                placeholder="Enter Full Name"
              />
              <FormField
                form={form}
                name={`beneficial_owners.${index}.date_of_birth`}
                label="Date of Birth"
                type="date"
                placeholder="Enter Date of Birth"
              />
              <FormField
                form={form}
                name={`beneficial_owners.${index}.residential_address.street`}
                label="Residential Address"
                type="text"
                placeholder="Enter Street"
              />
              <FormField
                form={form}
                name={`beneficial_owners.${index}.residential_address.suburb`}
                label="Suburb"
                type="text"
                placeholder="Enter Suburb"
              />
              <FormField
                form={form}
                name={`beneficial_owners.${index}.residential_address.state`}
                label="State"
                type="text"
                placeholder="Enter State"
              />
              <FormField
                form={form}
                name={`beneficial_owners.${index}.residential_address.postcode`}
                label="Postcode"
                type="text"
                placeholder="Enter Postcode"
              />
              <FormField
                form={form}
                name={`beneficial_owners.${index}.residential_address.country`}
                label="Country"
                type="select"
                options={countriesData}
                placeholder="Enter Country"
              />
              <Button variant="outline" size="sm" onClick={() => removeBeneficialOwner(index)}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            appendBeneficialOwner({ full_name: "", date_of_birth: "", residential_address: "" })
          }
        >
          <Plus />
        </Button>
      </div>

      {/* declarations */}
      <div className="space-y-2 border p-4 rounded-lg">
        <h6 className="">Declarations</h6>
        <div className="space-y-4">
          <FormField
            form={form}
            name="declarations.declarations_accepted"
            label="Declarations Accepted"
            type="checkbox"
            placeholder="Enter Declarations Accepted"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <FormField
              form={form}
              name="declarations.signatory_name"
              label="Signatory Name"
              type="text"
              placeholder="Enter Signatory Name"
            />
            <FormField
              form={form}
              name="declarations.date"
              label="Date"
              type="date"
              placeholder="Enter Date"
            />
          </div>
          <FormField
            form={form}
            name="declarations.signature"
            label="Signature"
            type="text"
            placeholder="Enter Signature"
          />
        </div>
      </div>
    </div>
  );
}
