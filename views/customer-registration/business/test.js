"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function KYCCompanyForm() {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    directors: false,
    documents: false,
    declaration: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formData = {
    general_information: {
      legal_name: "",
      trading_names: "",
      phone_number: "",
      registration_number: "",
      country_of_incorporation: "",
      contact_email: "",
      industry: "",
      nature_of_business: "",
      annual_income: "",
      estimated_trading_volume: "",
    },
    addresses: {
      local_agent: {
        name: "",
        street: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      registered: {
        street: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
      business: {
        street: "",
        suburb: "",
        state: "",
        postcode: "",
        country: "",
      },
    },
    account_purpose: {
      peer_to_peer: true,
      other: true,
      other_details: "",
    },
  }

  const directors = [
    { given_name: "Michael", surname: "Anderson" },
    { given_name: "Sara", surname: "Lee" },
  ]

  const beneficialOwners = [
    {
      full_name: "",
      date_of_birth: "",
      residential_address: "",
    },
  ]

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="">
        <div className="container  pt-10">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">KYC Company Registration</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Complete company verification and beneficial ownership information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container  py-12">
        {/* General Information Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("general")}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/40 hover:border-border/60 hover:bg-card/80 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">General Information</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expandedSections.general ? "rotate-180" : ""
                }`}
            />
          </button>

          {expandedSections.general && (
            <div className="mt-4 space-y-6 p-6 rounded-lg  border ">
              {/* Company Details Grid */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-foreground">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Legal Name</Label>
                    <Input
                      type="text"
                      defaultValue={formData.general_information.legal_name}
                    />
                  </div>
                  <div>
                    <Label>Trading Name</Label>
                    <Input
                      type="text"
                      defaultValue={formData.general_information.trading_names}
                    />
                  </div>
                  <div>
                    <Label >Registration Number</Label>
                    <Input
                      type="text"
                      defaultValue={formData.general_information.registration_number}

                    />
                  </div>
                  <div>
                    <Label >
                      Country of Incorporation
                    </Label>
                    <Input
                      type="text"
                      defaultValue={formData.general_information.country_of_incorporation}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t ">
                <h3 className="font-semibold text-sm text-foreground">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label >Email</Label>
                    <Input
                      type="email"
                      defaultValue={formData.general_information.contact_email}
                    />
                  </div>
                  <div>
                    <Label >Phone</Label>
                    <Input
                      type="tel"
                      defaultValue={formData.general_information.phone_number}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4 pt-4 border-t ">
                <h3 className="font-semibold text-sm text-foreground">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label >Industry</Label>
                    <Input
                      type="text"
                      defaultValue={formData.general_information.industry}
                    />
                  </div>
                  <div>
                    <Label >Annual Income</Label>
                    <Input
                      type="text"
                      defaultValue={formData.general_information.annual_income}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label >Nature of Business</Label>
                    <Textarea
                      defaultValue={formData.general_information.nature_of_business}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-4 pt-4 border-t ">
                <h3 className="font-semibold text-sm text-foreground">Addresses</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-foreground/80 mb-3">Registered Address</h4>
                    <div className="p-3 rounded-lg grid grid-cols-4 gap-4 border ">
                      <div>
                        <Label>Street</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.registered.street}
                        />
                      </div>
                      <div>
                        <Label>Suburb</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.registered.suburb}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.registered.state}
                        />
                      </div>
                      <div>
                        <Label>Postcode</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.registered.postcode}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.registered.country}
                        />
                      </div>

                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className="text-xs font-medium text-foreground/80 mb-3">Business Address</h4>
                      <div className="flex items-center gap-2">
                        <Label>Same as registered address</Label>
                        <Checkbox
                          defaultChecked={false}
                        />
                      </div>
                    </div>
                    <div className="p-3 rounded-lg grid grid-cols-4 gap-4 border ">
                      <div>
                        <Label>Street</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.business.street}
                        />
                      </div>
                      <div>
                        <Label>Suburb</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.business.suburb}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.business.state}
                        />
                      </div>
                      <div>
                        <Label>Postcode</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.business.postcode}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.business.country}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-foreground/80 mb-3">Local Agent</h4>
                    <div className="p-3 rounded-lg grid grid-cols-4 gap-4 border ">
                      <div>
                        <Label>Name</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.local_agent.name}
                        />
                      </div>
                      <div>
                        <Label>Street</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.local_agent.street}
                        />
                      </div>
                      <div>
                        <Label>Suburb</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.local_agent.suburb}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.local_agent.state}
                        />
                      </div>
                      <div>
                        <Label>Postcode</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.local_agent.postcode}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          type="text"
                          defaultValue={formData.addresses.local_agent.country}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Directors & Beneficial Owners Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("directors")}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/40 hover:border-border/60 hover:bg-card/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Directors & Beneficial Owners</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expandedSections.directors ? "rotate-180" : ""
                }`}
            />
          </button>

          {expandedSections.directors && (
            <div className="mt-4 space-y-6 p-6 rounded-lg  border ">
              {/* Directors */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-foreground">Directors</h3>
                <div className="space-y-3">
                  {directors.map((director, index) => (
                    <div key={index} className="p-3 rounded-lg bg-background/50 border ">
                      <p className="text-sm font-medium text-foreground">
                        {director.given_name} {director.surname}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficial Owners */}
              <div className="space-y-4 pt-4 border-t ">
                <h3 className="font-semibold text-sm text-foreground">Beneficial Owners</h3>
                <div className="space-y-3">
                  {beneficialOwners.map((owner, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50 border  space-y-2">
                      <p className="text-sm font-medium text-foreground">{owner.full_name}</p>
                      <p className="text-xs text-muted-foreground">DOB: {owner.date_of_birth}</p>
                      <p className="text-xs text-muted-foreground">Address: {owner.residential_address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("documents")}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/40 hover:border-border/60 hover:bg-card/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Documents</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expandedSections.documents ? "rotate-180" : ""
                }`}
            />
          </button>

          {expandedSections.documents && (
            <div className="mt-4 p-6 rounded-lg  border ">
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-background/50 border  flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">NID Front</p>
                      <p className="text-xs text-muted-foreground">image/jpeg</p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-xs font-medium transition-colors">
                    Download
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border  flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">NID Back</p>
                      <p className="text-xs text-muted-foreground">image/jpeg</p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-xs font-medium transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Declaration Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("declaration")}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/40 hover:border-border/60 hover:bg-card/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">4</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Declaration</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expandedSections.declaration ? "rotate-180" : ""
                }`}
            />
          </button>

          {expandedSections.declaration && (
            <div className="mt-4 p-6 rounded-lg  border  space-y-4">
              <div className="p-4 rounded-lg bg-success/5 border border-success/20 flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Declarations Accepted</p>
                  <p className="text-xs text-muted-foreground mt-1">The applicant has accepted all declarations</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Signatory Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Signature Date</label>
                  <input
                    type="date"
                    defaultValue="2025-11-02"
                    className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-end mt-12 pt-8 border-t ">
          <button className="px-6 py-2.5 rounded-lg border border-border/50 text-foreground hover:bg-muted transition-colors text-sm font-medium">
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
            Submit KYC
          </button>
        </div>
      </div>
    </div>
  )
}
