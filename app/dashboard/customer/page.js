"use client";

import React from "react";
import { useState } from "react";

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

  const handleInputChange = (
    section,
    field,
    value,
    subfield = null,
    index = null,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (index !== null && subfield) {
        updated[section][field][index][subfield] = value;
      } else if (subfield) {
        updated[section][field][subfield] = value;
      } else {
        updated[section][field] = value;
      }

      return updated;
    });
  };

  const handleAddressChange = (
    section,
    field,
    addressField,
    value,
    index = null,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (index !== null) {
        updated[section][field][index].residential_address[addressField] =
          value;
      } else {
        updated[section][field][addressField] = value;
      }

      return updated;
    });
  };

  const handleCheckboxChange = (section, field, value, subfield = null) => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (subfield) {
        updated[section][field][subfield] = value;
      } else {
        updated[section][field] = value;
      }

      return updated;
    });
  };

  const handleAddDirector = () => {
    setFormData((prev) => {
      const updated = { ...prev };
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
      const updated = { ...prev };
      updated.section_2_director_beneficial_owner.directors.splice(index, 1);
      updated.section_2_director_beneficial_owner.number_of_directors -= 1;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center">
            {formData.metadata.form_title}
          </h1>
          {/* <p className="text-sm opacity-90">
            Version: {formData.metadata.version} | Last Updated:{" "}
            {formData.metadata.last_updated}
          </p> */}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: General Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 1: General Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Legal Name of the Company
                </label>
                <input
                  type="text"
                  value={formData.section_1_general_information.legal_name}
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "legal_name",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business/Trading Names
                </label>
                <input
                  type="text"
                  value={formData.section_1_general_information.trading_names}
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "trading_names",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.section_1_general_information.phone_number}
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "phone_number",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country of Incorporation
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.section_1_general_information.contact_email}
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "contact_email",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Industry of Business
                </label>
                <input
                  type="text"
                  value={formData.section_1_general_information.industry}
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "industry",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nature of Business
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Annual Income
                </label>
                <input
                  type="text"
                  value={formData.section_1_general_information.annual_income}
                  onChange={(e) =>
                    handleInputChange(
                      "section_1_general_information",
                      "annual_income",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Registered Office Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={
                      formData.section_1_general_information.registered_address
                        .street
                    }
                    onChange={(e) =>
                      handleAddressChange(
                        "section_1_general_information",
                        "registered_address",
                        "street",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Suburb 区
                  </label>
                  <input
                    type="text"
                    value={
                      formData.section_1_general_information.registered_address
                        .suburb
                    }
                    onChange={(e) =>
                      handleAddressChange(
                        "section_1_general_information",
                        "registered_address",
                        "suburb",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    value={
                      formData.section_1_general_information.registered_address
                        .state
                    }
                    onChange={(e) =>
                      handleAddressChange(
                        "section_1_general_information",
                        "registered_address",
                        "state",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={
                      formData.section_1_general_information.registered_address
                        .postcode
                    }
                    onChange={(e) =>
                      handleAddressChange(
                        "section_1_general_information",
                        "registered_address",
                        "postcode",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={
                      formData.section_1_general_information.registered_address
                        .country
                    }
                    onChange={(e) =>
                      handleAddressChange(
                        "section_1_general_information",
                        "registered_address",
                        "country",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Principal place of business is different from registered
                  office address
                </span>
              </label>
            </div>

            {formData.section_1_general_information.business_address
              .different_from_registered && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Principal Place of Business
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={
                        formData.section_1_general_information.business_address
                          .street
                      }
                      onChange={(e) =>
                        handleAddressChange(
                          "section_1_general_information",
                          "business_address",
                          "street",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Suburb 区
                    </label>
                    <input
                      type="text"
                      value={
                        formData.section_1_general_information.business_address
                          .suburb
                      }
                      onChange={(e) =>
                        handleAddressChange(
                          "section_1_general_information",
                          "business_address",
                          "suburb",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      value={
                        formData.section_1_general_information.business_address
                          .state
                      }
                      onChange={(e) =>
                        handleAddressChange(
                          "section_1_general_information",
                          "business_address",
                          "state",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={
                        formData.section_1_general_information.business_address
                          .postcode
                      }
                      onChange={(e) =>
                        handleAddressChange(
                          "section_1_general_information",
                          "business_address",
                          "postcode",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={
                        formData.section_1_general_information.business_address
                          .country
                      }
                      onChange={(e) =>
                        handleAddressChange(
                          "section_1_general_information",
                          "business_address",
                          "country",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Company Type
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Proprietary Company
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Public Company
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Regulated / Licensed Company
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Majority Owned Subsidiary of a Listed Company
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Purpose of Account Opening
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Digital Currency Exchange
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Peer-to-Peer (P2P)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">FX</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      formData.section_1_general_information.account_purpose
                        .other
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        "section_1_general_information",
                        "account_purpose",
                        e.target.checked,
                        "other",
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Other</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Estimated Trading Volume
              </h3>

              <select
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Please select</option>
                <option value="Less than $100,000 AUD (per month)">
                  Less than $100,000 AUD (per month) $100,000
                </option>
                <option value="Between $100,000 to $499,999 AUD (per month)">
                  Between $100,000 to $499,999 AUD (per month) $100,000-$500,000
                </option>
                <option value="Between $500,000 to $999,999 AUD (per month)">
                  Between $500,000 to $999,999 AUD (per month)
                  $500,000-$1,000,000
                </option>
                <option value="$1,000,000 and over AUD (per month)">
                  $1,000,000 and over AUD (per month) $1,000,000
                </option>
              </select>
            </div>
          </div>

          {/* Section 2: Director and Beneficial Owner Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 2: Director and Beneficial Owner Information
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Director Information
              </h3>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Number of Directors:{" "}
                  {
                    formData.section_2_director_beneficial_owner
                      .number_of_directors
                  }
                </span>
                <button
                  type="button"
                  onClick={handleAddDirector}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                >
                  Add Director
                </button>
              </div>

              {formData.section_2_director_beneficial_owner.directors.map(
                (director, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-md mb-4 relative"
                  >
                    {formData.section_2_director_beneficial_owner.directors
                      .length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDirector(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}

                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Director {index + 1} {index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Given Name
                        </label>
                        <input
                          type="text"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Surname
                        </label>
                        <input
                          type="text"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Beneficial Owners
              </h3>

              {formData.section_2_director_beneficial_owner.beneficial_owners.map(
                (owner, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Beneficial Owner {index + 1} {index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Date of Birth
                        </label>
                        <input
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Residential Address
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Street
                          </label>
                          <input
                            type="text"
                            value={owner.residential_address.street}
                            onChange={(e) =>
                              handleAddressChange(
                                "section_2_director_beneficial_owner",
                                "beneficial_owners",
                                "street",
                                e.target.value,
                                index,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Suburb
                          </label>
                          <input
                            type="text"
                            value={owner.residential_address.suburb}
                            onChange={(e) =>
                              handleAddressChange(
                                "section_2_director_beneficial_owner",
                                "beneficial_owners",
                                "suburb",
                                e.target.value,
                                index,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            value={owner.residential_address.state}
                            onChange={(e) =>
                              handleAddressChange(
                                "section_2_director_beneficial_owner",
                                "beneficial_owners",
                                "state",
                                e.target.value,
                                index,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Postcode
                          </label>
                          <input
                            type="text"
                            value={owner.residential_address.postcode}
                            onChange={(e) =>
                              handleAddressChange(
                                "section_2_director_beneficial_owner",
                                "beneficial_owners",
                                "postcode",
                                e.target.value,
                                index,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            type="text"
                            value={owner.residential_address.country}
                            onChange={(e) =>
                              handleAddressChange(
                                "section_2_director_beneficial_owner",
                                "beneficial_owners",
                                "country",
                                e.target.value,
                                index,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Section 3: Verification Documents */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 3: Verification Documents
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                KYC Documents for all beneficial owners and company authorised
                personnel KYC
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.section_3_verification_documents.kyc_documents.id_types.includes(
                      "passport",
                    )}
                    onChange={(e) => {
                      const updatedTypes = e.target.checked
                        ? [
                            ...formData.section_3_verification_documents
                              .kyc_documents.id_types,
                            "passport",
                          ]
                        : formData.section_3_verification_documents.kyc_documents.id_types.filter(
                            (type) => type !== "passport",
                          );
                      handleInputChange(
                        "section_3_verification_documents",
                        "kyc_documents",
                        { id_types: updatedTypes },
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Passport</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.section_3_verification_documents.kyc_documents.id_types.includes(
                      "drivers_license",
                    )}
                    onChange={(e) => {
                      const updatedTypes = e.target.checked
                        ? [
                            ...formData.section_3_verification_documents
                              .kyc_documents.id_types,
                            "drivers_license",
                          ]
                        : formData.section_3_verification_documents.kyc_documents.id_types.filter(
                            (type) => type !== "drivers_license",
                          );
                      handleInputChange(
                        "section_3_verification_documents",
                        "kyc_documents",
                        { id_types: updatedTypes },
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Drivers Licence (front and back)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.section_3_verification_documents.kyc_documents.id_types.includes(
                      "national_id",
                    )}
                    onChange={(e) => {
                      const updatedTypes = e.target.checked
                        ? [
                            ...formData.section_3_verification_documents
                              .kyc_documents.id_types,
                            "national_id",
                          ]
                        : formData.section_3_verification_documents.kyc_documents.id_types.filter(
                            (type) => type !== "national_id",
                          );
                      handleInputChange(
                        "section_3_verification_documents",
                        "kyc_documents",
                        { id_types: updatedTypes },
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    National ID (front and back)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.section_3_verification_documents.kyc_documents.id_types.includes(
                      "medicare",
                    )}
                    onChange={(e) => {
                      const updatedTypes = e.target.checked
                        ? [
                            ...formData.section_3_verification_documents
                              .kyc_documents.id_types,
                            "medicare",
                          ]
                        : formData.section_3_verification_documents.kyc_documents.id_types.filter(
                            (type) => type !== "medicare",
                          );
                      handleInputChange(
                        "section_3_verification_documents",
                        "kyc_documents",
                        { id_types: updatedTypes },
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Medicare</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Company KYB Documents
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Certified Share Structure
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Organisational Chart
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Regulated Licences (if applicable)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Recent Bank Statement
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Certified Company Registration/Extract
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Authorisation Letter
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Authorisation */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Section 4: Authorised Personnel Declaration
            </h2>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    1. I declare that the information I have provided is TRUE
                    and CORRECT.
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    2. I declare that all BOs and myself are not politically
                    exposed person (PEP), our funds are not sourced from any
                    kinds of corrupt, criminal, money laundering and/or
                    terrorist financing activities. (PEP)。
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    3. I acknowledge that all the information provided by
                    CloudTechX Pty Ltd does not take into account my financial
                    situation, objectives or needs.，CloudTechX Pty Ltd
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    4. I have been advised to seek independent advice before
                    making any decisions.
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    5. I have read, understood, and accept the Terms and
                    Conditions; and Privacy Policy on CobWeb Pay website:
                    https://www.cobwebpay.com/. cowebpay:
                    https://www.cobwebpay.com/。
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    6. I confirm that I have the authority to commit and act on
                    behalf of the entity for the purposes of account
                    registration and operations.
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
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
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    7. I declare that the registering entity, all its BOs, and
                    myself are not a US resident for tax purposes.
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Authorised Personnel Name
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  value={
                    formData.section_4_authorisation.authorised_personnel
                      .contact
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "section_4_authorisation",
                      "authorised_personnel",
                      e.target.value,
                      "contact",
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.section_4_authorisation.date}
                  onChange={(e) =>
                    handleInputChange(
                      "section_4_authorisation",
                      "date",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Signature
              </label>
              <input
                type="text"
                value={formData.section_4_authorisation.signature}
                onChange={(e) =>
                  handleInputChange(
                    "section_4_authorisation",
                    "signature",
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
