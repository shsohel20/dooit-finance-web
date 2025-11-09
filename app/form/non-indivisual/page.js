"use client";

import React, { useState } from "react";
import Button from "@/app/utils/usealbe/Button";
import Card from "@/app/utils/usealbe/Card";
import Checkbox from "@/app/utils/usealbe/Checkbox";
import Input from "@/app/utils/usealbe/Input";
import Select from "@/app/utils/usealbe/Select";
import AddressFields from "@/app/components/form/AddressField";

export default function NonIndividualRegistrationForm() {
  const [formData, setFormData] = useState({
    metadata: {
      form_title:
        "Other Non-Individual Customers Account Registration and Authorisation Form ",
      version: "Ver1.2.1",
      last_updated: "18th Aug 2024",
    },
    section_1_general_information: {
      entity_name: "",
      country_of_formation: "",
      registered_business_name: "",
      industry: "",
      nature_of_Business: "",
      annual_income: "",
      asic_registration: {
        is_registered: false,
        registration_body: "",
        registration_number: "",
      },
      contact_information: {
        email: "",
        phone: "",
        website: "",
      },
      registered_address: {
        street: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      business_address: {
        different_from_registered: false,
        street: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      account_purpose: {
        digital_currency_exchange: false,
        peer_to_peer: false,
        fx: false,
        other: false,
      },
      estimated_trading_volume: "",
      customer_type: "",
    },
    section_2_partnerships: {
      partnership_type: "",
      is_regulated: false,
      regulator_name: "",
      membership_number: "",
      nature_of_business_activities: "",
      company_partners: [
        {
          legal_entity_name: "",
          registration_number: "",
        },
      ],
      individual_partners: [
        {
          is_managing_partner: false,
          given_name: "",
          surname: "",
          date_of_birth: "",
          residential_address: {
            street: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
      ],
    },
    section_3_government_bodies: {
      government_body_type: "",
      government_name: "",
      legislation_name: "",
    },
    section_4_association_cooperative: {
      entity_type: "",
      officeholders: {
        president_chair: {
          given_name: "",
          surname: "",
          date_of_birth: "",
          residential_address: {
            street: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
        secretary: {
          full_name: "",
          date_of_birth: "",
          residential_address: {
            street: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
        treasurer: {
          full_name: "",
          date_of_birth: "",
          residential_address: {
            street: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
        public_officer: {
          full_name: "",
          date_of_birth: "",
          residential_address: {
            street: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
      },
      beneficial_owners: [
        {
          given_name: "",
          surname: "",
          date_of_birth: "",
        },
      ],
    },
    section_5_identification: {
      kyc_documents: {
        id_types: [],
        partnership_documents: [],
        association_documents: [],
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
    nestedSection = null,
  ) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (nestedSection && index !== null && subfield) {
        // Handle nested arrays like section_2_partnerships.individual_partners[0].given_name
        updated[section][nestedSection][index][subfield] = value;
      } else if (nestedSection && subfield) {
        // Handle nested objects like section_4_association_cooperative.officeholders.president_chair.given_name
        const subfields = subfield.split(".");
        let current = updated[section][nestedSection];
        for (let i = 0; i < subfields.length - 1; i++) {
          current = current[subfields[i]];
        }
        current[subfields[subfields.length - 1]] = value;
      } else if (index !== null && subfield) {
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

  const handleAddressChange = (
    section,
    field,
    newAddress,
    index = null,
    nestedSection = null,
  ) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (nestedSection && index !== null) {
        updated[section][nestedSection][index].residential_address = newAddress;
      } else if (nestedSection) {
        const subfields = field.split(".");
        let current = updated[section][nestedSection];
        for (let i = 0; i < subfields.length - 1; i++) {
          current = current[subfields[i]];
        }
        current[subfields[subfields.length - 1]] = newAddress;
      } else if (index !== null) {
        updated[section][field][index].residential_address = newAddress;
      } else {
        updated[section][field] = newAddress;
      }

      return updated;
    });
  };

  const handleCheckboxChange = (
    section,
    field,
    value,
    subfield = null,
    nestedSection = null,
  ) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (nestedSection && subfield) {
        // Handle deeply nested fields like "asic_registration.is_registered"
        const subfields = subfield.split(".");
        let current = updated[section][nestedSection];
        for (let i = 0; i < subfields.length - 1; i++) {
          current = current[subfields[i]];
        }
        current[subfields[subfields.length - 1]] = value;
      } else if (subfield) {
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

  const handleArrayCheckboxChange = (
    section,
    field,
    value,
    item,
    arrayField = null,
  ) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let currentArray;

      if (arrayField) {
        currentArray = updated[section][field][arrayField];
      } else {
        currentArray = updated[section][field];
      }

      if (value) {
        if (!currentArray.includes(item)) {
          currentArray.push(item);
        }
      } else {
        if (arrayField) {
          updated[section][field][arrayField] = currentArray.filter(
            (type) => type !== item,
          );
        } else {
          updated[section][field] = currentArray.filter(
            (type) => type !== item,
          );
        }
      }

      return updated;
    });
  };

  // Array management functions
  const handleAddArrayItem = (section, field, template) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[section][field].push(template);
      return updated;
    });
  };

  const handleRemoveArrayItem = (section, field, index) => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated[section][field].length > 1) {
        updated[section][field].splice(index, 1);
      }
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
      alert("Form submitted successfully!");
    }, 1500);
  };

  // Options for selects
  const customerTypeOptions = [
    { value: "", label: "Please select" },
    { value: "partnership", label: "Partnership" },
    { value: "government_body", label: "Government Body" },
    { value: "association", label: "Association" },
    { value: "cooperative", label: "Cooperative" },
    { value: "trust", label: "Trust" },
    { value: "other", label: "Other" },
  ];

  const partnershipTypeOptions = [
    { value: "", label: "Please select" },
    { value: "general", label: "General Partnership" },
    { value: "limited", label: "Limited Partnership" },
    { value: "incorporated", label: "Incorporated Limited Partnership" },
  ];

  const governmentBodyOptions = [
    { value: "", label: "Please select" },
    { value: "federal", label: "Federal Government Body" },
    { value: "state", label: "State Government Body" },
    { value: "local", label: "Local Government Body" },
    { value: "statutory", label: "Statutory Authority" },
  ];

  const entityTypeOptions = [
    { value: "", label: "Please select" },
    { value: "incorporated_association", label: "Incorporated Association" },
    {
      value: "unincorporated_association",
      label: "Unincorporated Association",
    },
    { value: "cooperative", label: "Cooperative" },
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

  const partnershipDocOptions = [
    { value: "partnership_agreement", label: "Partnership Agreement" },
    {
      value: "certified_extract",
      label: "Certified Extract from Partnership Register",
    },
    {
      value: "business_registration",
      label: "Business Registration Certificate",
    },
  ];

  const associationDocOptions = [
    { value: "constitution", label: "Constitution or Rules of Association" },
    {
      value: "certificate_incorporation",
      label: "Certificate of Incorporation",
    },
    {
      value: "minutes_meeting",
      label: "Minutes of Meeting authorising account opening",
    },
  ];

  // Conditional rendering based on customer type
  const showPartnershipSection =
    formData.section_1_general_information.customer_type === "partnership";
  const showGovernmentSection =
    formData.section_1_general_information.customer_type === "government_body";
  const showAssociationSection = ["association", "cooperative"].includes(
    formData.section_1_general_information.customer_type,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">
            {formData.metadata.form_title}
          </h1>
          <div className="text-center text-sm mt-2 opacity-90">
            Version: {formData.metadata.version} | Last Updated:{" "}
            {formData.metadata.last_updated}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: General Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 1: General Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Customer Type"
                value={formData.section_1_general_information.customer_type}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "customer_type",
                    e.target.value,
                  )
                }
                options={customerTypeOptions}
                required
              />

              <Input
                label="Entity Name"
                value={formData.section_1_general_information.entity_name}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "entity_name",
                    e.target.value,
                  )
                }
                required
              />

              <Input
                label="Country of Formation"
                value={
                  formData.section_1_general_information.country_of_formation
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "country_of_formation",
                    e.target.value,
                  )
                }
                required
              />

              <Input
                label="Registered Business Name"
                value={
                  formData.section_1_general_information
                    .registered_business_name
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "registered_business_name",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Industry"
                value={formData.section_1_general_information.industry}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "industry",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Nature of Business"
                value={
                  formData.section_1_general_information.nature_of_Business
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "nature_of_Business",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Annual Income"
                value={formData.section_1_general_information.annual_income}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "annual_income",
                    e.target.value,
                  )
                }
              />
            </div>

            {/* ASIC Registration */}
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                ASIC Registration
              </h3>
              <Checkbox
                label="Registered with ASIC or equivalent body"
                checked={
                  formData.section_1_general_information.asic_registration
                    .is_registered
                }
                onChange={(e) =>
                  handleCheckboxChange(
                    "section_1_general_information",
                    "asic_registration",
                    e.target.checked,
                    "is_registered",
                  )
                }
              />

              {formData.section_1_general_information.asic_registration
                .is_registered && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Registration Body"
                    value={
                      formData.section_1_general_information.asic_registration
                        .registration_body
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "section_1_general_information",
                        "asic_registration",
                        e.target.value,
                        "registration_body",
                      )
                    }
                  />
                  <Input
                    label="Registration Number"
                    value={
                      formData.section_1_general_information.asic_registration
                        .registration_number
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "section_1_general_information",
                        "asic_registration",
                        e.target.value,
                        "registration_number",
                      )
                    }
                  />
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  value={
                    formData.section_1_general_information.contact_information
                      .email
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "contact_information",
                      e.target.value,
                      "email",
                    )
                  }
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={
                    formData.section_1_general_information.contact_information
                      .phone
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "contact_information",
                      e.target.value,
                      "phone",
                    )
                  }
                  required
                />
                <Input
                  label="Website"
                  type="url"
                  value={
                    formData.section_1_general_information.contact_information
                      .website
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "contact_information",
                      e.target.value,
                      "website",
                    )
                  }
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Registered Address */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Registered Address
              </h3>
              <AddressFields
                address={
                  formData.section_1_general_information.registered_address
                }
                onChange={(newAddress) =>
                  handleAddressChange(
                    "section_1_general_information",
                    "registered_address",
                    newAddress,
                  )
                }
              />
            </div>

            {/* Business Address Toggle */}
            <div className="mt-6">
              <Checkbox
                label="Principal place of business is different from registered address"
                checked={
                  formData.section_1_general_information.business_address
                    .different_from_registered
                }
                onChange={(e) =>
                  handleCheckboxChange(
                    "section_1_general_information",
                    "business_address",
                    e.target.checked,
                    "different_from_registered",
                  )
                }
              />
            </div>

            {/* Business Address */}
            {formData.section_1_general_information.business_address
              .different_from_registered && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Business Address
                </h3>
                <AddressFields
                  address={
                    formData.section_1_general_information.business_address
                  }
                  onChange={(newAddress) =>
                    handleAddressChange(
                      "section_1_general_information",
                      "business_address",
                      newAddress,
                    )
                  }
                />
              </div>
            )}

            {/* Account Purpose */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Purpose of Account Opening
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  label="Digital Currency Exchange"
                  checked={
                    formData.section_1_general_information.account_purpose
                      .digital_currency_exchange
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "account_purpose",
                      e.target.checked,
                      "digital_currency_exchange",
                    )
                  }
                />
                <Checkbox
                  label="Peer-to-Peer (P2P)"
                  checked={
                    formData.section_1_general_information.account_purpose
                      .peer_to_peer
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "account_purpose",
                      e.target.checked,
                      "peer_to_peer",
                    )
                  }
                />
                <Checkbox
                  label="FX"
                  checked={
                    formData.section_1_general_information.account_purpose.fx
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "account_purpose",
                      e.target.checked,
                      "fx",
                    )
                  }
                />
                <Checkbox
                  label="Other"
                  checked={
                    formData.section_1_general_information.account_purpose.other
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
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
                label="Estimated Trading Volume"
                value={
                  formData.section_1_general_information
                    .estimated_trading_volume
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "estimated_trading_volume",
                    e.target.value,
                  )
                }
                options={tradingVolumeOptions}
              />
            </div>
          </div>

          {/* Section 2: Partnerships (Conditional) */}
          {showPartnershipSection && (
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                Section 2: Partnership Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Select
                  label="Partnership Type"
                  value={formData.section_2_partnerships.partnership_type}
                  onChange={(e) =>
                    handleInputChange(
                      "section_2_partnerships",
                      "partnership_type",
                      e.target.value,
                    )
                  }
                  options={partnershipTypeOptions}
                />
                <Input
                  label="Nature of Business Activities"
                  value={
                    formData.section_2_partnerships
                      .nature_of_business_activities
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_2_partnerships",
                      "nature_of_business_activities",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Regulation Information */}
              <div className="mb-6 p-4 border rounded-lg">
                <Checkbox
                  label="Partnership is regulated"
                  checked={formData.section_2_partnerships.is_regulated}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_2_partnerships",
                      "is_regulated",
                      e.target.checked,
                    )
                  }
                />

                {formData.section_2_partnerships.is_regulated && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Regulator Name"
                      value={formData.section_2_partnerships.regulator_name}
                      onChange={(e) =>
                        handleInputChange(
                          "section_2_partnerships",
                          "regulator_name",
                          e.target.value,
                        )
                      }
                    />
                    <Input
                      label="Membership Number"
                      value={formData.section_2_partnerships.membership_number}
                      onChange={(e) =>
                        handleInputChange(
                          "section_2_partnerships",
                          "membership_number",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                )}
              </div>

              {/* Company Partners */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Company Partners
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAddArrayItem(
                        "section_2_partnerships",
                        "company_partners",
                        {
                          legal_entity_name: "",
                          registration_number: "",
                        },
                      )
                    }
                  >
                    Add Company Partner
                  </Button>
                </div>

                {formData.section_2_partnerships.company_partners.map(
                  (partner, index) => (
                    <Card key={index} className="p-4 mb-4 relative">
                      {formData.section_2_partnerships.company_partners.length >
                        1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            handleRemoveArrayItem(
                              "section_2_partnerships",
                              "company_partners",
                              index,
                            )
                          }
                        >
                          Remove
                        </Button>
                      )}

                      <h4 className="text-md font-medium text-gray-700 mb-4">
                        Company Partner {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Legal Entity Name"
                          value={partner.legal_entity_name}
                          onChange={(e) =>
                            handleInputChange(
                              "section_2_partnerships",
                              "company_partners",
                              e.target.value,
                              "legal_entity_name",
                              index,
                            )
                          }
                        />
                        <Input
                          label="Registration Number"
                          value={partner.registration_number}
                          onChange={(e) =>
                            handleInputChange(
                              "section_2_partnerships",
                              "company_partners",
                              e.target.value,
                              "registration_number",
                              index,
                            )
                          }
                        />
                      </div>
                    </Card>
                  ),
                )}
              </div>

              {/* Individual Partners */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Individual Partners
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAddArrayItem(
                        "section_2_partnerships",
                        "individual_partners",
                        {
                          is_managing_partner: false,
                          given_name: "",
                          surname: "",
                          date_of_birth: "",
                          residential_address: {
                            street: "",
                            suburb: "",
                            state: "",
                            postcode: "",
                            country: "",
                          },
                        },
                      )
                    }
                  >
                    Add Individual Partner
                  </Button>
                </div>

                {formData.section_2_partnerships.individual_partners.map(
                  (partner, index) => (
                    <Card key={index} className="p-4 mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-4">
                        Individual Partner {index + 1}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Checkbox
                          label="Managing Partner"
                          checked={partner.is_managing_partner}
                          onChange={(e) =>
                            handleInputChange(
                              "section_2_partnerships",
                              "individual_partners",
                              e.target.checked,
                              "is_managing_partner",
                              index,
                            )
                          }
                        />
                        <div></div> {/* Spacer */}
                        <Input
                          label="Given Name"
                          value={partner.given_name}
                          onChange={(e) =>
                            handleInputChange(
                              "section_2_partnerships",
                              "individual_partners",
                              e.target.value,
                              "given_name",
                              index,
                            )
                          }
                        />
                        <Input
                          label="Surname"
                          value={partner.surname}
                          onChange={(e) =>
                            handleInputChange(
                              "section_2_partnerships",
                              "individual_partners",
                              e.target.value,
                              "surname",
                              index,
                            )
                          }
                        />
                        <Input
                          label="Date of Birth"
                          type="date"
                          value={partner.date_of_birth}
                          onChange={(e) =>
                            handleInputChange(
                              "section_2_partnerships",
                              "individual_partners",
                              e.target.value,
                              "date_of_birth",
                              index,
                            )
                          }
                          className="md:col-span-2"
                        />
                      </div>

                      <AddressFields
                        title="Residential Address"
                        address={partner.residential_address}
                        onChange={(newAddress) =>
                          handleAddressChange(
                            "section_2_partnerships",
                            "individual_partners",
                            newAddress,
                            index,
                          )
                        }
                      />
                    </Card>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Section 3: Government Bodies (Conditional) */}
          {showGovernmentSection && (
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                Section 3: Government Body Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <Select
                  label="Government Body Type"
                  value={
                    formData.section_3_government_bodies.government_body_type
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_3_government_bodies",
                      "government_body_type",
                      e.target.value,
                    )
                  }
                  options={governmentBodyOptions}
                />
                <Input
                  label="Government Name"
                  value={formData.section_3_government_bodies.government_name}
                  onChange={(e) =>
                    handleInputChange(
                      "section_3_government_bodies",
                      "government_name",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="Legislation Name"
                  value={formData.section_3_government_bodies.legislation_name}
                  onChange={(e) =>
                    handleInputChange(
                      "section_3_government_bodies",
                      "legislation_name",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          )}

          {/* Section 4: Association/Cooperative (Conditional) */}
          {showAssociationSection && (
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                Section 4: Association/Cooperative Information
              </h2>

              <div className="mb-6">
                <Select
                  label="Entity Type"
                  value={formData.section_4_association_cooperative.entity_type}
                  onChange={(e) =>
                    handleInputChange(
                      "section_4_association_cooperative",
                      "entity_type",
                      e.target.value,
                    )
                  }
                  options={entityTypeOptions}
                />
              </div>

              {/* Officeholders */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Officeholders
                </h3>

                {/* President/Chair */}
                <Card className="p-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4">
                    President/Chair
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Given Name"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .president_chair.given_name
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "president_chair.given_name",
                        )
                      }
                    />
                    <Input
                      label="Surname"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .president_chair.surname
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "president_chair.surname",
                        )
                      }
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .president_chair.date_of_birth
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "president_chair.date_of_birth",
                        )
                      }
                      className="md:col-span-2"
                    />
                  </div>
                  <AddressFields
                    title="Residential Address"
                    address={
                      formData.section_4_association_cooperative.officeholders
                        .president_chair.residential_address
                    }
                    onChange={(newAddress) =>
                      handleAddressChange(
                        "section_4_association_cooperative",
                        "officeholders",
                        newAddress,
                        null,
                        "president_chair.residential_address",
                      )
                    }
                  />
                </Card>

                {/* Secretary */}
                <Card className="p-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4">
                    Secretary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Full Name"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .secretary.full_name
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "secretary.full_name",
                        )
                      }
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .secretary.date_of_birth
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "secretary.date_of_birth",
                        )
                      }
                    />
                  </div>
                  <AddressFields
                    title="Residential Address"
                    address={
                      formData.section_4_association_cooperative.officeholders
                        .secretary.residential_address
                    }
                    onChange={(newAddress) =>
                      handleAddressChange(
                        "section_4_association_cooperative",
                        "officeholders",
                        newAddress,
                        null,
                        "secretary.residential_address",
                      )
                    }
                  />
                </Card>

                {/* Treasurer */}
                <Card className="p-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4">
                    Treasurer
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Full Name"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .treasurer.full_name
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "treasurer.full_name",
                        )
                      }
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .treasurer.date_of_birth
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "treasurer.date_of_birth",
                        )
                      }
                    />
                  </div>
                  <AddressFields
                    title="Residential Address"
                    address={
                      formData.section_4_association_cooperative.officeholders
                        .treasurer.residential_address
                    }
                    onChange={(newAddress) =>
                      handleAddressChange(
                        "section_4_association_cooperative",
                        "officeholders",
                        newAddress,
                        null,
                        "treasurer.residential_address",
                      )
                    }
                  />
                </Card>

                {/* Public Officer */}
                <Card className="p-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4">
                    Public Officer
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Full Name"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .public_officer.full_name
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "public_officer.full_name",
                        )
                      }
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={
                        formData.section_4_association_cooperative.officeholders
                          .public_officer.date_of_birth
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "section_4_association_cooperative",
                          "officeholders",
                          e.target.value,
                          "public_officer.date_of_birth",
                        )
                      }
                    />
                  </div>
                  <AddressFields
                    title="Residential Address"
                    address={
                      formData.section_4_association_cooperative.officeholders
                        .public_officer.residential_address
                    }
                    onChange={(newAddress) =>
                      handleAddressChange(
                        "section_4_association_cooperative",
                        "officeholders",
                        newAddress,
                        null,
                        "public_officer.residential_address",
                      )
                    }
                  />
                </Card>
              </div>

              {/* Beneficial Owners */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Beneficial Owners
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAddArrayItem(
                        "section_4_association_cooperative",
                        "beneficial_owners",
                        {
                          given_name: "",
                          surname: "",
                          date_of_birth: "",
                        },
                      )
                    }
                  >
                    Add Beneficial Owner
                  </Button>
                </div>

                {formData.section_4_association_cooperative.beneficial_owners.map(
                  (owner, index) => (
                    <Card key={index} className="p-4 mb-4 relative">
                      {formData.section_4_association_cooperative
                        .beneficial_owners.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            handleRemoveArrayItem(
                              "section_4_association_cooperative",
                              "beneficial_owners",
                              index,
                            )
                          }
                        >
                          Remove
                        </Button>
                      )}

                      <h4 className="text-md font-medium text-gray-700 mb-4">
                        Beneficial Owner {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Given Name"
                          value={owner.given_name}
                          onChange={(e) =>
                            handleInputChange(
                              "section_4_association_cooperative",
                              "beneficial_owners",
                              e.target.value,
                              "given_name",
                              index,
                            )
                          }
                        />
                        <Input
                          label="Surname"
                          value={owner.surname}
                          onChange={(e) =>
                            handleInputChange(
                              "section_4_association_cooperative",
                              "beneficial_owners",
                              e.target.value,
                              "surname",
                              index,
                            )
                          }
                        />
                        <Input
                          label="Date of Birth"
                          type="date"
                          value={owner.date_of_birth}
                          onChange={(e) =>
                            handleInputChange(
                              "section_4_association_cooperative",
                              "beneficial_owners",
                              e.target.value,
                              "date_of_birth",
                              index,
                            )
                          }
                        />
                      </div>
                    </Card>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Section 5: Identification */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 5: Identification Documents
            </h2>

            {/* KYC Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                KYC Documents
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
                        "id_types",
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Partnership Documents (Conditional) */}
            {showPartnershipSection && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Partnership Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnershipDocOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      label={option.label}
                      checked={formData.section_5_identification.kyc_documents.partnership_documents.includes(
                        option.value,
                      )}
                      onChange={(e) =>
                        handleArrayCheckboxChange(
                          "section_5_identification",
                          "kyc_documents",
                          e.target.checked,
                          option.value,
                          "partnership_documents",
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Association Documents (Conditional) */}
            {showAssociationSection && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Association/Cooperative Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {associationDocOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      label={option.label}
                      checked={formData.section_5_identification.kyc_documents.association_documents.includes(
                        option.value,
                      )}
                      onChange={(e) =>
                        handleArrayCheckboxChange(
                          "section_5_identification",
                          "kyc_documents",
                          e.target.checked,
                          option.value,
                          "association_documents",
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Authorisation */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 6: Authorisation
            </h2>

            {/* Declarations */}
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                {[
                  "1. I declare that the information I have provided is TRUE and CORRECT.",
                  "2. I declare that all beneficial owners and myself are not politically exposed persons (PEPs), and our funds are not sourced from any kinds of corrupt, criminal, money laundering and/or terrorist financing activities.",
                  "3. I acknowledge that all the information provided does not take into account my financial situation, objectives or needs.",
                  "4. I have been advised to seek independent advice before making any decisions.",
                  "5. I have read, understood, and accept the Terms and Conditions and Privacy Policy.",
                  "6. I confirm that I have the authority to commit and act on behalf of the entity for the purposes of account registration and operations.",
                  "7. I declare that the registering entity, all its beneficial owners, and myself are not US residents for tax purposes.",
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
                "Submit Form"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
