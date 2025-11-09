"use client";

import React, { useState } from "react";
import Button from "@/app/utils/usealbe/Button";
import Card from "@/app/utils/usealbe/Card";
import Checkbox from "@/app/utils/usealbe/Checkbox";
import Input from "@/app/utils/usealbe/Input";
import Select from "@/app/utils/usealbe/Select";
import AddressFields from "@/app/components/form/AddressField";

export default function CompanyRegistrationForm() {
  const [formData, setFormData] = useState({
    metadata: {
      form_title: "Company Account Registration and Authorisation Form ",
      form_number: "Form 2",
      acn: "859 353 796",
      version: "Ver1.4.2",
      last_updated: "7 Oct 2024",
    },
    section_1_general_information: {
      legal_name: "LIGHTNING CLOUD COMPANY LIMITED",
      trading_names: "",
      phone_number: "",
      registration_number: "73213127",
      country_of_incorporation: "",
      contact_email: "",
      industry: "",
      nature_of_business: "",
      annual_income: "USD 25 million",
      local_agent: {
        name: "",
        address: {
          street: "",
          suburb: "",
          state: "",
          postcode: "",
          country: "",
        },
      },
      registered_address: {
        street: "149 Queen's Road Central",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      business_address: {
        different_from_registered: false,
        street: "149 Queen's Road Central",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      company_type: {
        proprietary_company: false,
        public_company: false,
        regulated_company: {
          is_regulated: false,
          regulator: "",
          licence_name: "",
          licence_number: "",
        },
        listed_company: {
          is_listed: false,
          market_exchange_name: "",
          ticker_symbol: "",
        },
        subsidiary_of_listed_company: false,
      },
      account_purpose: {
        digital_currency_exchange: false,
        peer_to_peer: false,
        fx: false,
        other: false,
      },
      estimated_trading_volume: "",
    },
    section_2_director_beneficial_owner: {
      number_of_directors: 1,
      directors: [
        {
          given_name: "ZHILIANG",
          surname: "WEN",
        },
      ],
      beneficial_owners: [
        {
          full_name: "ZHI LIANG WEN",
          date_of_birth: "1975.06.02",
          residential_address: {
            street: "",
            suburb: "",
            state: "",
            postcode: "",
            country: "",
          },
        },
        {
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
        {
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
        {
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
      ],
    },
    section_3_verification_documents: {
      kyc_documents: {
        id_types: [],
      },
      company_kyb_documents: {
        certified_share_structure: false,
        organisational_chart: false,
        regulated_licences: false,
        recent_bank_statement: false,
        certified_company_registration: false,
        authorisation_letter: false,
      },
    },
    section_4_authorisation: {
      declarations_accepted: false,
      authorised_personnel: {
        name: "WEN ZHI LIANG",
        title: "CEO",
        contact: "",
      },
      signature: "Wen Zhi Liang",
      date: "2025.07.14",
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
        // Handle nested fields like "regulated_company.is_regulated"
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

  const handleAddDirector = () => {
    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_2_director_beneficial_owner.directors.push({
        given_name: "",
        surname: "",
      });
      updated.section_2_director_beneficial_owner.number_of_directors += 1;
      return updated;
    });
  };

  const handleRemoveDirector = (index) => {
    if (formData.section_2_director_beneficial_owner.directors.length <= 1)
      return;

    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.section_2_director_beneficial_owner.directors.splice(index, 1);
      updated.section_2_director_beneficial_owner.number_of_directors -= 1;
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
  const tradingVolumeOptions = [
    { value: "", label: "Please select" },
    {
      value: "Less than $100,000 AUD (per month)",
      label: "Less than $100,000 AUD (per month) $100,000",
    },
    {
      value: "Between $100,000 to $499,999 AUD (per month)",
      label: "Between $100,000 to $499,999 AUD (per month) $100,000-$500,000",
    },
    {
      value: "Between $500,000 to $999,999 AUD (per month)",
      label: "Between $500,000 to $999,999 AUD (per month) $500,000-$1,000,000",
    },
    {
      value: "$1,000,000 and over AUD (per month)",
      label: "$1,000,000 and over AUD (per month) $1,000,000",
    },
  ];

  const idTypeOptions = [
    { value: "passport", label: "Passport" },
    { value: "drivers_license", label: "Drivers Licence (front and back)" },
    { value: "national_id", label: "National ID (front and back)" },
    { value: "medicare", label: "Medicare" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">
            {formData.metadata.form_title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: General Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 1: General Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Legal Name of the Company"
                value={formData.section_1_general_information.legal_name}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "legal_name",
                    e.target.value,
                  )
                }
                required
                error={errors.section_1_general_information_legal_name}
              />

              <Input
                label="Business/Trading Names"
                value={formData.section_1_general_information.trading_names}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "trading_names",
                    e.target.value,
                  )
                }
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.section_1_general_information.phone_number}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "phone_number",
                    e.target.value,
                  )
                }
                required
                error={errors.section_1_general_information_phone_number}
              />

              <Input
                label="Registration Number"
                value={
                  formData.section_1_general_information.registration_number
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "registration_number",
                    e.target.value,
                  )
                }
                required
                error={errors.section_1_general_information_registration_number}
              />

              <Input
                label="Country of Incorporation"
                value={
                  formData.section_1_general_information
                    .country_of_incorporation
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "country_of_incorporation",
                    e.target.value,
                  )
                }
                required
                error={
                  errors.section_1_general_information_country_of_incorporation
                }
              />

              <Input
                label="Contact Email"
                type="email"
                value={formData.section_1_general_information.contact_email}
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "contact_email",
                    e.target.value,
                  )
                }
                required
                error={errors.section_1_general_information_contact_email}
              />

              <Input
                label="Industry of Business"
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
                  formData.section_1_general_information.nature_of_business
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_1_general_information",
                    "nature_of_business",
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
                className="md:col-span-2"
              />
            </div>

            {/* Registered Address */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Registered Office Address
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
                label="Principal place of business is different from registered office address"
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
                  Principal Place of Business
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

            {/* Company Type */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Company Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  label="Proprietary Company"
                  checked={
                    formData.section_1_general_information.company_type
                      .proprietary_company
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "company_type",
                      e.target.checked,
                      "proprietary_company",
                    )
                  }
                />
                <Checkbox
                  label="Public Company"
                  checked={
                    formData.section_1_general_information.company_type
                      .public_company
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "company_type",
                      e.target.checked,
                      "public_company",
                    )
                  }
                />
                <Checkbox
                  label="Regulated / Licensed Company"
                  checked={
                    formData.section_1_general_information.company_type
                      .regulated_company.is_regulated
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "company_type",
                      e.target.checked,
                      "regulated_company.is_regulated",
                    )
                  }
                />
                <Checkbox
                  label="Majority Owned Subsidiary of a Listed Company"
                  checked={
                    formData.section_1_general_information.company_type
                      .subsidiary_of_listed_company
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_1_general_information",
                      "company_type",
                      e.target.checked,
                      "subsidiary_of_listed_company",
                    )
                  }
                />
              </div>
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

          {/* Section 2: Director and Beneficial Owner Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 2: Director and Beneficial Owner Information
            </h2>

            {/* Directors */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Director Information (Number of Directors:{" "}
                  {
                    formData.section_2_director_beneficial_owner
                      .number_of_directors
                  }
                  )
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDirector}
                >
                  Add Director
                </Button>
              </div>

              {formData.section_2_director_beneficial_owner.directors.map(
                (director, index) => (
                  <Card key={index} className="p-4 mb-4 relative">
                    {formData.section_2_director_beneficial_owner.directors
                      .length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveDirector(index)}
                      >
                        Remove
                      </Button>
                    )}

                    <h4 className="text-md font-medium text-gray-700 mb-4">
                      Director {index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Given Name"
                        value={director.given_name}
                        onChange={(e) =>
                          handleInputChange(
                            "section_2_director_beneficial_owner",
                            "directors",
                            e.target.value,
                            "given_name",
                            index,
                          )
                        }
                      />
                      <Input
                        label="Surname"
                        value={director.surname}
                        onChange={(e) =>
                          handleInputChange(
                            "section_2_director_beneficial_owner",
                            "directors",
                            e.target.value,
                            "surname",
                            index,
                          )
                        }
                      />
                    </div>
                  </Card>
                ),
              )}
            </div>

            {/* Beneficial Owners */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Beneficial Owners
              </h3>

              {formData.section_2_director_beneficial_owner.beneficial_owners.map(
                (owner, index) => (
                  <Card key={index} className="p-4 mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">
                      Beneficial Owner {index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Full Name"
                        value={owner.full_name}
                        onChange={(e) =>
                          handleInputChange(
                            "section_2_director_beneficial_owner",
                            "beneficial_owners",
                            e.target.value,
                            "full_name",
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
                            "section_2_director_beneficial_owner",
                            "beneficial_owners",
                            e.target.value,
                            "date_of_birth",
                            index,
                          )
                        }
                      />
                    </div>

                    <AddressFields
                      title="Residential Address"
                      address={owner.residential_address}
                      onChange={(newAddress) =>
                        handleAddressChange(
                          "section_2_director_beneficial_owner",
                          "beneficial_owners",
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

          {/* Section 3: Verification Documents */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 3: Verification Documents
            </h2>

            {/* KYC Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                KYC Documents for all beneficial owners and company authorised
                personnel
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {idTypeOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={formData.section_3_verification_documents.kyc_documents.id_types.includes(
                      option.value,
                    )}
                    onChange={(e) =>
                      handleArrayCheckboxChange(
                        "section_3_verification_documents",
                        "kyc_documents",
                        e.target.checked,
                        option.value,
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Company KYB Documents */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Company KYB Documents
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  label="Certified Share Structure"
                  checked={
                    formData.section_3_verification_documents
                      .company_kyb_documents.certified_share_structure
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_3_verification_documents",
                      "company_kyb_documents",
                      e.target.checked,
                      "certified_share_structure",
                    )
                  }
                />
                <Checkbox
                  label="Organisational Chart"
                  checked={
                    formData.section_3_verification_documents
                      .company_kyb_documents.organisational_chart
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_3_verification_documents",
                      "company_kyb_documents",
                      e.target.checked,
                      "organisational_chart",
                    )
                  }
                />
                <Checkbox
                  label="Regulated Licences (if applicable)"
                  checked={
                    formData.section_3_verification_documents
                      .company_kyb_documents.regulated_licences
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_3_verification_documents",
                      "company_kyb_documents",
                      e.target.checked,
                      "regulated_licences",
                    )
                  }
                />
                <Checkbox
                  label="Recent Bank Statement"
                  checked={
                    formData.section_3_verification_documents
                      .company_kyb_documents.recent_bank_statement
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_3_verification_documents",
                      "company_kyb_documents",
                      e.target.checked,
                      "recent_bank_statement",
                    )
                  }
                />
                <Checkbox
                  label="Certified Company Registration/Extract"
                  checked={
                    formData.section_3_verification_documents
                      .company_kyb_documents.certified_company_registration
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_3_verification_documents",
                      "company_kyb_documents",
                      e.target.checked,
                      "certified_company_registration",
                    )
                  }
                />
                <Checkbox
                  label="Authorisation Letter"
                  checked={
                    formData.section_3_verification_documents
                      .company_kyb_documents.authorisation_letter
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      "section_3_verification_documents",
                      "company_kyb_documents",
                      e.target.checked,
                      "authorisation_letter",
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 4: Authorisation */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 4: Authorised Personnel Declaration
            </h2>

            {/* Declarations */}
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                {[
                  "1. I declare that the information I have provided is TRUE and CORRECT.",
                  "2. I declare that all BOs and myself are not politically exposed person (PEP), our funds are not sourced from any kinds of corrupt, criminal, money laundering and/or terrorist financing activities.",
                  "3. I acknowledge that all the information provided by CloudTechX Pty Ltd does not take into account my financial situation, objectives or needs.",
                  "4. I have been advised to seek independent advice before making any decisions.",
                  "5. I have read, understood, and accept the Terms and Conditions; and Privacy Policy on CobWeb Pay website: https://www.cobwebpay.com/.",
                  "6. I confirm that I have the authority to commit and act on behalf of the entity for the purposes of account registration and operations.",
                  "7. I declare that the registering entity, all its BOs, and myself are not a US resident for tax purposes.",
                ].map((declaration, index) => (
                  <Checkbox
                    key={index}
                    label={declaration}
                    checked={
                      formData.section_4_authorisation.declarations_accepted
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        "section_4_authorisation",
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
                label="Company Authorised Personnel Name"
                value={
                  formData.section_4_authorisation.authorised_personnel.name
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_4_authorisation",
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
                  formData.section_4_authorisation.authorised_personnel.title
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_4_authorisation",
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
                  formData.section_4_authorisation.authorised_personnel.contact
                }
                onChange={(e) =>
                  handleInputChange(
                    "section_4_authorisation",
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
                value={formData.section_4_authorisation.date}
                onChange={(e) =>
                  handleInputChange(
                    "section_4_authorisation",
                    "date",
                    e.target.value,
                  )
                }
                required
              />
            </div>

            <Input
              label="Signature"
              value={formData.section_4_authorisation.signature}
              onChange={(e) =>
                handleInputChange(
                  "section_4_authorisation",
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
                <>Submit Form</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
