"use client";

import React, { useState } from "react";
import Button from "@/app/utils/usealbe/Button";
import Card from "@/app/utils/usealbe/Card";
import Checkbox from "@/app/utils/usealbe/Checkbox";
import Input from "@/app/utils/usealbe/Input";
import Select from "@/app/utils/usealbe/Select";

export default function PersonalOnboardingForm() {
  const [formData, setFormData] = useState({
    onboarding_form: {
      metadata: {
        form_title: "Personal Account Registration and Authorisation Form ",
        completion_date: "Tuesday, August 26, 2025",
      },
      personal_information: {
        name: "gang yang",
        date_of_birth: "1987-09-23",
        phone_number: "(86) 186-10315935",
        email: "snorlax123@163.com",
        occupation: "Business Owner",
        employer_name: "Gang Yang",
        industry: "Education and Training",
        residential_address:
          "Chaoyang district Shimencun Road #1, Jintaixianfeng Building 336-5 Room 602 Beijing, Beijing, 100020 China",
      },
      identification_documents: {
        submitted_id_type: "National Id",
        accepted_id_types: [
          "Passport ",
          "Driver Licence (for Australia only)-front and back ",
          "National ID (for China only)-front and back ",
        ],
      },
      funds_wealth_information: {
        source_of_funds: "Wages/Salary ",
        source_of_wealth: "Accumulated Savings ",
        reason_for_opening_account: "Investment ",
        estimated_trading_volume:
          "Between $5,000 to $9,999 AUD (per month) $5,000-$9,999",
      },
      sole_trader_status: "No",
      customer_declaration: {
        status: "Accepted",
        declarations: [
          "Information provided is true and correct",
          "Not a politically exposed person (PEP); funds not from corrupt/criminal activities",
          "Acknowledges that information from CloudTechX Pty Ltd doesn't consider personal financial situation",
          "Advised to seek independent advice before decisions",
          "Read and accepted Terms & Conditions and Privacy Policy of CobWeb Pay",
          "Not a U.S resident for tax purposes",
        ],
        terms_url: "link",
      },
      signature_provided: true,
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to update nested form sections (sectionKey e.g. "onboarding_form", then childKey)
  const handleInputChange = (sectionKey, childKey, value) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[sectionKey][childKey] = value;
      return copy;
    });
    // clear error
    const errKey = `${sectionKey}_${childKey}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const c = { ...prev };
        delete c[errKey];
        return c;
      });
    }
  };

  const handleNestedChange = (sectionKey, parentKey, childKey, value) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[sectionKey][parentKey][childKey] = value;
      return copy;
    });
    const errKey = `${sectionKey}_${parentKey}_${childKey}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const c = { ...prev };
        delete c[errKey];
        return c;
      });
    }
  };

  const handleArrayCheckboxChange = (sectionKey, arrayKey, item, checked) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const list = copy[sectionKey][arrayKey];
      if (!Array.isArray(list)) return prev;
      if (checked) {
        if (!list.includes(item)) list.push(item);
      } else {
        copy[sectionKey][arrayKey] = list.filter((i) => i !== item);
      }
      return copy;
    });
  };

  const handleAcceptAllDeclarations = (checked) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.onboarding_form.customer_declaration.status = checked
        ? "Accepted"
        : "Not Accepted";
      return copy;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const s = formData.onboarding_form;
    if (!s.personal_information.name.trim())
      newErrors.onboarding_form_name = "Name is required";
    if (!s.personal_information.email.trim())
      newErrors.onboarding_form_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(s.personal_information.email))
      newErrors.onboarding_form_email = "Email is invalid";
    if (!s.personal_information.phone_number.trim())
      newErrors.onboarding_form_phone = "Phone number is required";
    if (!s.identification_documents.submitted_id_type)
      newErrors.onboarding_form_id = "Please indicate the submitted ID type";
    if (s.customer_declaration && s.customer_declaration.status !== "Accepted")
      newErrors.onboarding_form_declaration =
        "You must accept the declarations";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    // simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Onboarding submitted:", formData);
      alert("Personal onboarding submitted successfully!");
    }, 1200);
  };

  const acceptedIdOptions = [
    "Passport 护照",
    "Driver Licence (for Australia only)-front and back 澳洲驾照（正反面）",
    "National ID (for China only)-front and back 中国身份证（正反面）",
  ];

  const tradingVolumeOptions = [
    { value: "", label: "Please select" },
    {
      value: "Less than $5,000 AUD",
      label: "Less than $5,000 AUD (per month)",
    },
    {
      value: "5,000-9,999 AUD",
      label: "Between $5,000 to $9,999 AUD (per month)",
    },
    {
      value: "10,000-49,999 AUD",
      label: "Between $10,000 to $49,999 AUD (per month)",
    },
    { value: "50,000+ AUD", label: "$50,000 and over AUD (per month)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">
            {formData.onboarding_form.metadata.form_title}
          </h1>
          <p className="text-center opacity-90 mt-1">
            Completion date: {formData.onboarding_form.metadata.completion_date}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.onboarding_form.personal_information.name}
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "name",
                    e.target.value,
                  )
                }
                required
                error={errors.onboarding_form_name}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={
                  formData.onboarding_form.personal_information.date_of_birth
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "date_of_birth",
                    e.target.value,
                  )
                }
                required
                error={errors.onboarding_form_dob}
              />

              <Input
                label="Phone Number"
                value={
                  formData.onboarding_form.personal_information.phone_number
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "phone_number",
                    e.target.value,
                  )
                }
                required
                error={errors.onboarding_form_phone}
              />

              <Input
                label="Email"
                type="email"
                value={formData.onboarding_form.personal_information.email}
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "email",
                    e.target.value,
                  )
                }
                required
                error={errors.onboarding_form_email}
              />

              <Input
                label="Occupation"
                value={formData.onboarding_form.personal_information.occupation}
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "occupation",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Employer / Business Name"
                value={
                  formData.onboarding_form.personal_information.employer_name
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "employer_name",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Industry"
                value={formData.onboarding_form.personal_information.industry}
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "industry",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Residential Address"
                value={
                  formData.onboarding_form.personal_information
                    .residential_address
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "personal_information",
                    "residential_address",
                    e.target.value,
                  )
                }
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Identification Documents */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Identification Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accepted ID Types
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1  gap-2">
                    {acceptedIdOptions.map((opt) => {
                      const checked =
                        formData.onboarding_form.identification_documents.accepted_id_types.includes(
                          opt,
                        );
                      return (
                        <Checkbox
                          key={opt}
                          label={opt}
                          checked={checked}
                          onChange={(e) =>
                            handleArrayCheckboxChange(
                              "onboarding_form",
                              "identification_documents.accepted_id_types",
                              opt,
                              e.target.checked,
                            )
                          }
                        />
                      );
                    })}
                  </div>
                  <div className="h-full min-h-[200px] text-gray-700 bg-gray-200 flex flex-col items-center justify-center rounded-2xl">
                    Upload IDS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Funds & Wealth */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Funds & Wealth Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Source of Funds"
                value={
                  formData.onboarding_form.funds_wealth_information
                    .source_of_funds
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "funds_wealth_information",
                    "source_of_funds",
                    e.target.value,
                  )
                }
              />
              <Input
                label="Source of Wealth"
                value={
                  formData.onboarding_form.funds_wealth_information
                    .source_of_wealth
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "funds_wealth_information",
                    "source_of_wealth",
                    e.target.value,
                  )
                }
              />
              <Input
                label="Reason for Opening Account"
                value={
                  formData.onboarding_form.funds_wealth_information
                    .reason_for_opening_account
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "funds_wealth_information",
                    "reason_for_opening_account",
                    e.target.value,
                  )
                }
              />
              <Select
                label="Estimated Trading Volume"
                value={
                  formData.onboarding_form.funds_wealth_information
                    .estimated_trading_volume
                }
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "funds_wealth_information",
                    "estimated_trading_volume",
                    e.target.value,
                  )
                }
                options={tradingVolumeOptions}
              />
            </div>
          </div>

          {/* Sole trader */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Sole Trader Status
            </h2>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Are you a sole trader?
              </label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sole_trader"
                    checked={
                      formData.onboarding_form.sole_trader_status === "Yes"
                    }
                    onChange={() =>
                      handleInputChange(
                        "onboarding_form",
                        "sole_trader_status",
                        "Yes",
                      )
                    }
                  />
                  <span className="ml-1">Yes</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sole_trader"
                    checked={
                      formData.onboarding_form.sole_trader_status === "No"
                    }
                    onChange={() =>
                      handleInputChange(
                        "onboarding_form",
                        "sole_trader_status",
                        "No",
                      )
                    }
                  />
                  <span className="ml-1">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Customer Declaration */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Customer Declaration
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Declarations
              </label>
              <div className="space-y-2">
                {formData.onboarding_form.customer_declaration.declarations.map(
                  (d, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1">
                        <input
                          type="checkbox"
                          checked={
                            formData.onboarding_form.customer_declaration
                              .status === "Accepted"
                          }
                          onChange={(e) =>
                            handleAcceptAllDeclarations(e.target.checked)
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">{d}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {errors.onboarding_form_declaration && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.onboarding_form_declaration}
                </p>
              )}

              <p className="text-sm mt-3">
                Terms &amp; Conditions:{" "}
                <a
                  className="text-blue-600 underline"
                  href={formData.onboarding_form.customer_declaration.terms_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {formData.onboarding_form.customer_declaration.terms_url}
                </a>
              </p>
            </div>
          </div>

          {/* Signature */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Signature
            </h2>
            <div className="mb-4 h-full min-h-[200px] text-gray-700 bg-gray-200 flex flex-col items-center justify-center rounded-2xl">
              Upload Signature here
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Signature provided (typed name)"
                value={
                  formData.onboarding_form.signature_provided
                    ? formData.onboarding_form.personal_information.name
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "onboarding_form",
                    "signature_provided",
                    !!e.target.value,
                  )
                }
                required
              />
              <Input
                label="Date"
                type="date"
                value={formData.onboarding_form.metadata.completion_date}
                onChange={(e) =>
                  handleNestedChange(
                    "onboarding_form",
                    "metadata",
                    "completion_date",
                    e.target.value,
                  )
                }
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⟳</span> Processing...
                </>
              ) : (
                <>Submit </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
