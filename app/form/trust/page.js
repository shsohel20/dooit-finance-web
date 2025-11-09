"use client";

import React, { useState } from "react";
import Button from "@/app/utils/usealbe/Button";
import Card from "@/app/utils/usealbe/Card";
import Checkbox from "@/app/utils/usealbe/Checkbox";
import Input from "@/app/utils/usealbe/Input";
import Select from "@/app/utils/usealbe/Select";
import AddressFields from "@/app/components/form/AddressField";

export default function TrustRegistrationForm() {
  const [formData, setFormData] = useState({
    metadata: {
      form_title: "Trust Registration and Authorisation Form ",
      version: "Ver1.2",
      last_updated: "15th Aug 2024",
    },
    section_1_trust_details: {
      full_trust_name: "",
      country_of_establishment: "",
      settlor_name: "",
      industry: "",
      nature_of_business: "",
      annual_income: "",
      principal_address: {
        address: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      postal_address: {
        different_from_principal: false,
        address: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      contact_information: {
        email: "",
        phone: "",
        website: "",
      },
      trust_type: {
        selected_type: "",
        unregulated_trust: {
          type_description: "",
          is_registered: false,
          regulatory_body: "",
          registration_number: "",
        },
        self_managed_super_fund: {
          abn: "",
        },
        managed_investment_scheme_registered: {
          asrn: "",
        },
        government_superannuation_fund: {
          legislation_name: "",
        },
        managed_investment_scheme_unregistered: {
          abn: "",
        },
        other_superannuation_trust: {
          regulator_name: "",
          registration_number: "",
        },
      },
      account_purpose: {
        digital_currency_exchange: false,
        peer_to_peer: false,
        fx: false,
        other: false,
      },
      estimated_trading_volume: "",
    },
    section_2_beneficiaries: {
      named_beneficiaries: [],
      beneficiary_classes: [],
    },
    section_3_company_trustees: {
      has_company_trustees: false,
      company_details: [],
    },
    section_4_individual_trustees: {
      trustees: [
        {
          full_name: "",
          date_of_birth: "",
          residential_address: {
            address: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
      ],
      has_additional_trustees: false,
    },
    section_5_identification: {
      kyc_documents: {
        id_types: [],
      },
      trust_documents: {
        recent_bank_statement: false,
        certified_trust_deed: false,
        company_documents_provided: false,
      },
    },
    section_6_authorisation: {
      declarations_accepted: false,
      authorised_personnel: {
        name: "",
        title: "",
        contact: "",
      },
      signature: "",
      date: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler functions
  const handleInputChange = (
    section,
    field,
    value,
    subfield = null,
    index = null,
  ) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (index !== null && subfield) {
        updated[section][field][index][subfield] = value;
      } else if (subfield) {
        updated[section][field][subfield] = value;
      } else {
        updated[section][field] = value;
      }

      return updated;
    });

    // Clear error when user starts typing
    if (errors[`${section}_${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${section}_${field}`];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (section, field, newAddress, index = null) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (index !== null) {
        updated[section][field][index].residential_address = newAddress;
      } else {
        updated[section][field] = newAddress;
      }

      return updated;
    });
  };

  const handleCheckboxChange = (section, field, value, subfield = null) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (subfield) {
        // Handle nested fields like "trust_type.unregulated_trust.is_registered"
        const subfields = subfield.split(".");
        let current = updated[section][field];
        for (let i = 0; i < subfields.length - 1; i++) {
          current = current[subfields[i]];
        }
        current[subfields[subfields.length - 1]] = value;
      } else {
        updated[section][field] = value;
      }

      return updated;
    });
  };

  const handleArrayCheckboxChange = (section, field, value, item) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const currentTypes = updated[section][field].id_types;

      if (value) {
        if (!currentTypes.includes(item)) {
          currentTypes.push(item);
        }
      } else {
        updated[section][field].id_types = currentTypes.filter(
          (type) => type !== item,
        );
      }

      return updated;
    });
  };

  const handleAddBeneficiary = () => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_2_beneficiaries.named_beneficiaries.push("");
      return updated;
    });
  };

  const handleRemoveBeneficiary = (index) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_2_beneficiaries.named_beneficiaries.splice(index, 1);
      return updated;
    });
  };

  const handleAddBeneficiaryClass = () => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_2_beneficiaries.beneficiary_classes.push("");
      return updated;
    });
  };

  const handleRemoveBeneficiaryClass = (index) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_2_beneficiaries.beneficiary_classes.splice(index, 1);
      return updated;
    });
  };

  const handleAddTrustee = () => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_4_individual_trustees.trustees.push({
        full_name: "",
        date_of_birth: "",
        residential_address: {
          address: "",
          suburb: "",
          state: "",
          postcode: "",
          country: "",
        },
      });
      return updated;
    });
  };

  const handleRemoveTrustee = (index) => {
    if (formData.section_4_individual_trustees.trustees.length <= 1) return;

    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_4_individual_trustees.trustees.splice(index, 1);
      return updated;
    });
  };

  const handleAddCompanyTrustee = () => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_3_company_trustees.company_details.push({
        company_name: "",
        registration_number: "",
      });
      return updated;
    });
  };

  const handleRemoveCompanyTrustee = (index) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_3_company_trustees.company_details.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Trust Registration Form submitted successfully!");
    }, 1500);
  };

  // Options for selects
  const trustTypeOptions = [
    { value: "", label: "Please select" },
    { value: "unregulated_trust", label: "Unregulated Trust" },
    {
      value: "self_managed_super_fund",
      label: "Self-Managed Super Fund (SMSF)",
    },
    {
      value: "managed_investment_scheme_registered",
      label: "Managed Investment Scheme Registered with ASIC",
    },
    {
      value: "government_superannuation_fund",
      label: "Government Superannuation Fund",
    },
    {
      value: "managed_investment_scheme_unregistered",
      label: "Managed Investment Scheme Not Registered with ASIC",
    },
    {
      value: "other_superannuation_trust",
      label: "Other Superannuation Fund or Trust",
    },
  ];

  const tradingVolumeOptions = [
    { value: "", label: "Please select" },
    {
      value: "Less than $100,000 AUD (per month)",
      label: "Less than $100,000 AUD (per month)",
    },
    {
      value: "Between $100,000 to $499,999 AUD (per month)",
      label: "Between $100,000 to $499,999 AUD (per month)",
    },
    {
      value: "Between $500,000 to $999,999 AUD (per month)",
      label: "Between $500,000 to $999,999 AUD (per month)",
    },
    {
      value: "$1,000,000 and over AUD (per month)",
      label: "$1,000,000 and over AUD (per month)",
    },
  ];

  const idTypeOptions = [
    { value: "passport", label: "Passport" },
    { value: "drivers_license", label: "Drivers Licence (front and back)" },
    { value: "national_id", label: "National ID (front and back)" },
    { value: "medicare", label: "Medicare" },
  ];

  // Render trust type specific fields
  const renderTrustTypeFields = () => {
    const selectedType =
      formData.section_1_trust_details.trust_type.selected_type;

    switch (selectedType) {
      case "unregulated_trust":
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
            <Input
              label="Type of Trust (e.g., family, discretionary, unit)"
              value={
                formData.section_1_trust_details.trust_type.unregulated_trust
                  .type_description
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "unregulated_trust.type_description",
                )
              }
            />
            <Checkbox
              label="Is the Trust Registered with ASIC or an Equivalent Foreign Body?"
              checked={
                formData.section_1_trust_details.trust_type.unregulated_trust
                  .is_registered
              }
              onChange={(e) =>
                handleCheckboxChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.checked,
                  "unregulated_trust.is_registered",
                )
              }
            />
            {formData.section_1_trust_details.trust_type.unregulated_trust
              .is_registered && (
              <>
                <Input
                  label="Regulatory Body Name"
                  value={
                    formData.section_1_trust_details.trust_type
                      .unregulated_trust.regulatory_body
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_trust_details",
                      "trust_type",
                      e.target.value,
                      "unregulated_trust.regulatory_body",
                    )
                  }
                />
                <Input
                  label="Registration Number"
                  value={
                    formData.section_1_trust_details.trust_type
                      .unregulated_trust.registration_number
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_trust_details",
                      "trust_type",
                      e.target.value,
                      "unregulated_trust.registration_number",
                    )
                  }
                />
              </>
            )}
          </div>
        );

      case "self_managed_super_fund":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <Input
              label="Australian Business Number (ABN)"
              value={
                formData.section_1_trust_details.trust_type
                  .self_managed_super_fund.abn
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "self_managed_super_fund.abn",
                )
              }
              required
            />
          </div>
        );

      case "managed_investment_scheme_registered":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <Input
              label="Australian Registered Scheme Number (ASRN)"
              value={
                formData.section_1_trust_details.trust_type
                  .managed_investment_scheme_registered.asrn
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "managed_investment_scheme_registered.asrn",
                )
              }
              required
            />
          </div>
        );

      case "government_superannuation_fund":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <Input
              label="Legislation Name"
              value={
                formData.section_1_trust_details.trust_type
                  .government_superannuation_fund.legislation_name
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "government_superannuation_fund.legislation_name",
                )
              }
              required
            />
          </div>
        );

      case "managed_investment_scheme_unregistered":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <Input
              label="Australian Business Number (ABN)"
              value={
                formData.section_1_trust_details.trust_type
                  .managed_investment_scheme_unregistered.abn
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "managed_investment_scheme_unregistered.abn",
                )
              }
              required
            />
          </div>
        );

      case "other_superannuation_trust":
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
            <Input
              label="Regulator Name"
              value={
                formData.section_1_trust_details.trust_type
                  .other_superannuation_trust.regulator_name
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "other_superannuation_trust.regulator_name",
                )
              }
              required
            />
            <Input
              label="Registration Number"
              value={
                formData.section_1_trust_details.trust_type
                  .other_superannuation_trust.registration_number
              }
              onChange={(e) =>
                handleInputChange(
                  "section_1_trust_details",
                  "trust_type",
                  e.target.value,
                  "other_superannuation_trust.registration_number",
                )
              }
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">
            {formData.metadata.form_title}
          </h1>
          <p className="text-center text-sm opacity-90 mt-2">
            Version: {formData.metadata.version} | Last Updated:{" "}
            {formData.metadata.last_updated}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: Trust Details */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 1: Trust Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name of Trust including Trustee"
                value={formData.section_1_trust_details.full_trust_name}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "full_trust_name",
                    e.target.value,
                  )
                }
                required
              />

              <Input
                label="Country Where Trust was Established"
                value={
                  formData.section_1_trust_details.country_of_establishment
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "country_of_establishment",
                    e.target.value,
                  )
                }
                required
              />

              <Input
                label="Name of the Settlor"
                value={formData.section_1_trust_details.settlor_name}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "settlor_name",
                    e.target.value,
                  )
                }
                required
              />

              <Input
                label="Industry of Business"
                value={formData.section_1_trust_details.industry}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "industry",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Nature of Business"
                value={formData.section_1_trust_details.nature_of_business}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "nature_of_business",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Annual Income"
                value={formData.section_1_trust_details.annual_income}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "annual_income",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Contact Email"
                type="email"
                value={
                  formData.section_1_trust_details.contact_information.email
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "contact_information",
                    e.target.value,
                    "email",
                  )
                }
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={
                  formData.section_1_trust_details.contact_information.phone
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "contact_information",
                    e.target.value,
                    "phone",
                  )
                }
                required
              />

              <Input
                label="Website"
                value={
                  formData.section_1_trust_details.contact_information.website
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "contact_information",
                    e.target.value,
                    "website",
                  )
                }
                className="md:col-span-2"
              />
            </div>

            {/* Principal Address */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Residential Address / Principal Place of Business
              </h3>
              <AddressFields
                address={formData.section_1_trust_details.principal_address}
                onChange={(newAddress) =>
                  handleAddressChange(
                    "section_1_trust_details",
                    "principal_address",
                    newAddress,
                  )
                }
              />
            </div>

            {/* Postal Address Toggle */}
            <div className="mt-6">
              <Checkbox
                label="Postal/Registered Office Address is different from principal address"
                checked={
                  formData.section_1_trust_details.postal_address
                    .different_from_principal
                }
                onChange={(e) =>
                  handleCheckboxChange(
                    "section_1_trust_details",
                    "postal_address",
                    e.target.checked,
                    "different_from_principal",
                  )
                }
              />
            </div>

            {/* Postal Address */}
            {formData.section_1_trust_details.postal_address
              .different_from_principal && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Postal / Registered Office Address
                </h3>
                <AddressFields
                  address={formData.section_1_trust_details.postal_address}
                  onChange={(newAddress) =>
                    handleAddressChange(
                      "section_1_trust_details",
                      "postal_address",
                      newAddress,
                    )
                  }
                />
              </div>
            )}

            {/* Trust Type */}
            <div className="mt-6">
              <Select
                label="Trust Type"
                value={
                  formData.section_1_trust_details.trust_type.selected_type
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "trust_type",
                    e.target.value,
                    "selected_type",
                  )
                }
                options={trustTypeOptions}
                required
              />
              {renderTrustTypeFields()}
            </div>

            {/* Account Purpose */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Purpose of Account Opening
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  label="Digital Currency Exchange"
                  checked={
                    formData.section_1_trust_details.account_purpose
                      .digital_currency_exchange
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_trust_details",
                      "account_purpose",
                      e.target.checked,
                      "digital_currency_exchange",
                    )
                  }
                />
                <Checkbox
                  label="Peer-to-Peer (P2P)"
                  checked={
                    formData.section_1_trust_details.account_purpose
                      .peer_to_peer
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_trust_details",
                      "account_purpose",
                      e.target.checked,
                      "peer_to_peer",
                    )
                  }
                />
                <Checkbox
                  label="FX"
                  checked={formData.section_1_trust_details.account_purpose.fx}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_trust_details",
                      "account_purpose",
                      e.target.checked,
                      "fx",
                    )
                  }
                />
                <Checkbox
                  label="Other"
                  checked={
                    formData.section_1_trust_details.account_purpose.other
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_trust_details",
                      "account_purpose",
                      e.target.checked,
                      "other",
                    )
                  }
                />
              </div>
            </div>

            {/* Estimated Trading Volume */}
            <div className="mt-6">
              <Select
                label="Estimated Trading Volume "
                value={
                  formData.section_1_trust_details.estimated_trading_volume
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_trust_details",
                    "estimated_trading_volume",
                    e.target.value,
                  )
                }
                options={tradingVolumeOptions}
              />
            </div>
          </div>

          {/* Section 2: Beneficiaries */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 2: Beneficiaries (If Applicable)
            </h2>

            {/* Named Beneficiaries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Named Beneficiaries
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBeneficiary}
                >
                  Add Beneficiary
                </Button>
              </div>

              {formData.section_2_beneficiaries.named_beneficiaries.map(
                (beneficiary, index) => (
                  <Card key={index} className="p-4 mb-4 relative">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveBeneficiary(index)}
                    >
                      Remove
                    </Button>

                    <h4 className="text-md font-medium text-gray-700 mb-4">
                      Beneficiary {index + 1}
                    </h4>

                    <Input
                      label="Full Name"
                      value={beneficiary}
                      onChange={(e) => {
                        const updatedBeneficiaries = [
                          ...formData.section_2_beneficiaries
                            .named_beneficiaries,
                        ];
                        updatedBeneficiaries[index] = e.target.value;
                        handleInputChange(
                          "section_2_beneficiaries",
                          "named_beneficiaries",
                          updatedBeneficiaries,
                        );
                      }}
                    />
                  </Card>
                ),
              )}
            </div>

            {/* Beneficiary Classes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Beneficiary Classes
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBeneficiaryClass}
                >
                  Add Beneficiary Class
                </Button>
              </div>

              {formData.section_2_beneficiaries.beneficiary_classes.map(
                (beneficiaryClass, index) => (
                  <Card key={index} className="p-4 mb-4 relative">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveBeneficiaryClass(index)}
                    >
                      Remove
                    </Button>

                    <h4 className="text-md font-medium text-gray-700 mb-4">
                      Beneficiary Class {index + 1}
                    </h4>

                    <Input
                      label="Beneficiary Class Description"
                      value={beneficiaryClass}
                      onChange={(e) => {
                        const updatedClasses = [
                          ...formData.section_2_beneficiaries
                            .beneficiary_classes,
                        ];
                        updatedClasses[index] = e.target.value;
                        handleInputChange(
                          "section_2_beneficiaries",
                          "beneficiary_classes",
                          updatedClasses,
                        );
                      }}
                    />
                  </Card>
                ),
              )}
            </div>
          </div>

          {/* Section 3: Company Trustees */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 3: Company Trustees And Appointors
            </h2>

            <Checkbox
              label="Are any of the Trustees and/or Appointors of the Trust a Company?"
              checked={formData.section_3_company_trustees.has_company_trustees}
              onChange={(e) =>
                handleCheckboxChange(
                  "section_3_company_trustees",
                  "has_company_trustees",
                  e.target.checked,
                )
              }
            />

            {formData.section_3_company_trustees.has_company_trustees && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Company Trustees Details
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCompanyTrustee}
                  >
                    Add Company Trustee
                  </Button>
                </div>

                {formData.section_3_company_trustees.company_details.map(
                  (company, index) => (
                    <Card key={index} className="p-4 mb-4 relative">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveCompanyTrustee(index)}
                      >
                        Remove
                      </Button>

                      <h4 className="text-md font-medium text-gray-700 mb-4">
                        Company Trustee {index + 1}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Company Name"
                          value={company.company_name}
                          onChange={(e) => {
                            const updatedCompanies = [
                              ...formData.section_3_company_trustees
                                .company_details,
                            ];
                            updatedCompanies[index].company_name =
                              e.target.value;
                            handleInputChange(
                              "section_3_company_trustees",
                              "company_details",
                              updatedCompanies,
                            );
                          }}
                        />
                        <Input
                          label="Registration Number"
                          value={company.registration_number}
                          onChange={(e) => {
                            const updatedCompanies = [
                              ...formData.section_3_company_trustees
                                .company_details,
                            ];
                            updatedCompanies[index].registration_number =
                              e.target.value;
                            handleInputChange(
                              "section_3_company_trustees",
                              "company_details",
                              updatedCompanies,
                            );
                          }}
                        />
                      </div>
                    </Card>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Section 4: Individual Trustees */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 4: Individual Trustees And Appointors
            </h2>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Individual Trustees
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTrustee}
              >
                Add Trustee
              </Button>
            </div>

            {formData.section_4_individual_trustees.trustees.map(
              (trustee, index) => (
                <Card key={index} className="p-4 mb-4 relative">
                  {formData.section_4_individual_trustees.trustees.length >
                    1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveTrustee(index)}
                    >
                      Remove
                    </Button>
                  )}

                  <h4 className="text-md font-medium text-gray-700 mb-4">
                    Trustee {index + 1}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Full Name"
                      value={trustee.full_name}
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_individual_trustees",
                          "trustees",
                          e.target.value,
                          "full_name",
                          index,
                        )
                      }
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={trustee.date_of_birth}
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_individual_trustees",
                          "trustees",
                          e.target.value,
                          "date_of_birth",
                          index,
                        )
                      }
                    />
                  </div>

                  <AddressFields
                    title="Residential Address"
                    address={trustee.residential_address}
                    onChange={(newAddress) =>
                      handleAddressChange(
                        "section_4_individual_trustees",
                        "trustees",
                        newAddress,
                        index,
                      )
                    }
                  />
                </Card>
              ),
            )}

            <Checkbox
              label="Are there more than three beneficiaries or trustees?"
              checked={
                formData.section_4_individual_trustees.has_additional_trustees
              }
              onChange={(e) =>
                handleCheckboxChange(
                  "section_4_individual_trustees",
                  "has_additional_trustees",
                  e.target.checked,
                )
              }
            />
          </div>

          {/* Section 5: Identification */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 5: Identification
            </h2>

            {/* KYC Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                KYC Documents for all Trustees, Appointors, Settlors and Company
                Authorised Personnel
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {idTypeOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={formData.section_5_identification.kyc_documents.id_types.includes(
                      option.value,
                    )}
                    onChange={(e) =>
                      handleArrayCheckboxChange(
                        "section_5_identification",
                        "kyc_documents",
                        e.target.checked,
                        option.value,
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Trust Documents */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Trust Documents
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  label="Recent Bank Statement"
                  checked={
                    formData.section_5_identification.trust_documents
                      .recent_bank_statement
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_5_identification",
                      "trust_documents",
                      e.target.checked,
                      "recent_bank_statement",
                    )
                  }
                />
                <Checkbox
                  label="Certified Copy of the Trust Deed"
                  checked={
                    formData.section_5_identification.trust_documents
                      .certified_trust_deed
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_5_identification",
                      "trust_documents",
                      e.target.checked,
                      "certified_trust_deed",
                    )
                  }
                />
                <Checkbox
                  label="Company Documents Provided (if applicable)"
                  checked={
                    formData.section_5_identification.trust_documents
                      .company_documents_provided
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_5_identification",
                      "trust_documents",
                      e.target.checked,
                      "company_documents_provided",
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 6: Authorisation */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 6: Authorised Personnel Acknowledgement
            </h2>

            {/* Declarations */}
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                {[
                  "1. I declare that the information I have provided is TRUE and CORRECT。",
                  "2. I declare that I am NOT a politically exposed person (PEP), all my funds are not sourced from any kinds of corrupt, criminal, money laundering and/or terrorist financing activities.(PEP)",
                  "3. I acknowledge that all the information provided by CloudTechX Pty Ltd does not take into account my financial situation, objectives or needs. 我承认，CloudTechX Pty Ltd",
                  "4. I have been advised to seek independent advice before making any decisions. ",
                  "5. I have read, understood, and accept the Terms and Conditions and Privacy Policy on CobWeb Pay website: https://www.cobwebpay.com/. ",
                  "6. I confirm that I have the authority to commit and act on behalf of the entity for the purposes of account registration.",
                  "7. I declare that I am not a U.S resident for tax purposes.",
                ].map((declaration, index) => (
                  <Checkbox
                    key={index}
                    label={declaration}
                    checked={
                      formData.section_6_authorisation.declarations_accepted
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        "section_6_authorisation",
                        "declarations_accepted",
                        e.target.checked,
                      )
                    }
                    required
                  />
                ))}
              </div>
            </Card>

            {/* Authorised Personnel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Authorised Personnel Name"
                value={
                  formData.section_6_authorisation.authorised_personnel.name
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_6_authorisation",
                    "authorised_personnel",
                    e.target.value,
                    "name",
                  )
                }
                required
              />
              <Input
                label="Title"
                value={
                  formData.section_6_authorisation.authorised_personnel.title
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_6_authorisation",
                    "authorised_personnel",
                    e.target.value,
                    "title",
                  )
                }
                required
              />
              <Input
                label="Contact"
                value={
                  formData.section_6_authorisation.authorised_personnel.contact
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_6_authorisation",
                    "authorised_personnel",
                    e.target.value,
                    "contact",
                  )
                }
                required
              />
              <Input
                label="Date"
                type="date"
                value={formData.section_6_authorisation.date}
                onChange={(e) =>
                  handleInputChange(
                    "section_6_authorisation",
                    "date",
                    e.target.value,
                  )
                }
                required
              />
            </div>

            <Input
              label="Signature"
              value={formData.section_6_authorisation.signature}
              onChange={(e) =>
                handleInputChange(
                  "section_6_authorisation",
                  "signature",
                  e.target.value,
                )
              }
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Processing...
                </>
              ) : (
                <>Submit Trust Registration Form</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
