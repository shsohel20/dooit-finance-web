"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Download, Save, FileText } from "lucide-react";

const INITIAL_FORM_DATA = {
  transaction: {
    dateReceived: "",
    dateAvailable: "",
    currencyCode: "",
    totalAmount: "",
    transferType: "",
    propertyDescription: "",
    referenceNumber: "",
  },
  orderingCustomer: {
    fullName: "",
    otherName: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    phone: "",
    email: "",
    occupation: "",
    abnAcnArbn: "",
    customerNumber: "",
    accountNumber: "",
    businessStructure: "",
  },
  beneficiaryCustomer: {
    fullName: "",
    dateOfBirth: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    phone: "",
    email: "",
    occupation: "",
    abnAcnArbn: "",
    businessStructure: "",
    accountNumber: "",
    institutionName: "",
    institutionCity: "",
    institutionCountry: "",
  },
  intermediaries: {},
  reportCompletion: {
    transferReason: "",
    completedBy: {
      fullName: "",
      jobTitle: "",
      phone: "",
      email: "",
    },
  },
};

const TRANSFER_TYPES = [
  "Electronic",
  "Cheque",
  "Cash",
  "Wire Transfer",
  "Other",
];
const BUSINESS_STRUCTURES = [
  "Company",
  "Trust",
  "Partnership",
  "Sole Trader",
  "Other",
];
const ID_TYPES = [
  "Passport",
  "Driver's License",
  "National ID",
  "Birth Certificate",
  "Other",
];

export function IFTIForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentSection, setCurrentSection] = useState(0);
  const [showIntermediaries, setShowIntermediaries] = useState({
    acceptingInstruction: false,
    acceptingMoney: false,
    sendingInstruction: false,
    receivingInstruction: false,
    distributingMoney: false,
    retailOutlet: false,
  });

  const sections = [
    "Transaction Details",
    "Ordering Customer",
    "Beneficiary Customer",
    "Intermediary Parties",
    "Report Completion",
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result);
        setFormData(json);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ifti-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const handleGenerateReport = () => {
    const report = `
INTERNATIONAL FUNDS TRANSFER INSTRUCTION REPORT
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════════

SECTION 1: TRANSACTION DETAILS
═══════════════════════════════════════════════════════════════

Date Money/Property Received: ${formData.transaction.dateReceived}
Date Made Available to Beneficiary: ${formData.transaction.dateAvailable}
Currency Code: ${formData.transaction.currencyCode}
Total Amount/Value: ${formData.transaction.totalAmount}
Type of Transfer: ${formData.transaction.transferType}
${
  formData.transaction.propertyDescription
    ? `Property Description: ${formData.transaction.propertyDescription}`
    : ""
}
Transaction Reference Number: ${formData.transaction.referenceNumber}

═══════════════════════════════════════════════════════════════

SECTION 2: ORDERING CUSTOMER (SENDER)
═══════════════════════════════════════════════════════════════

Full Name: ${formData.orderingCustomer.fullName}
${
  formData.orderingCustomer.otherName
    ? `Other Name: ${formData.orderingCustomer.otherName}`
    : ""
}
${
  formData.orderingCustomer.dateOfBirth
    ? `Date of Birth: ${formData.orderingCustomer.dateOfBirth}`
    : ""
}
Address: ${formData.orderingCustomer.address}
City: ${formData.orderingCustomer.city}
State: ${formData.orderingCustomer.state}
Postcode: ${formData.orderingCustomer.postcode}
Country: ${formData.orderingCustomer.country}
${
  formData.orderingCustomer.phone
    ? `Phone: ${formData.orderingCustomer.phone}`
    : ""
}
${
  formData.orderingCustomer.email
    ? `Email: ${formData.orderingCustomer.email}`
    : ""
}
${
  formData.orderingCustomer.occupation
    ? `Occupation: ${formData.orderingCustomer.occupation}`
    : ""
}
${
  formData.orderingCustomer.abnAcnArbn
    ? `ABN/ACN/ARBN: ${formData.orderingCustomer.abnAcnArbn}`
    : ""
}
${
  formData.orderingCustomer.customerNumber
    ? `Customer Number: ${formData.orderingCustomer.customerNumber}`
    : ""
}
${
  formData.orderingCustomer.accountNumber
    ? `Account Number: ${formData.orderingCustomer.accountNumber}`
    : ""
}
${
  formData.orderingCustomer.businessStructure
    ? `Business Structure: ${formData.orderingCustomer.businessStructure}`
    : ""
}

═══════════════════════════════════════════════════════════════

SECTION 3: BENEFICIARY CUSTOMER (RECEIVER)
═══════════════════════════════════════════════════════════════

Full Name: ${formData.beneficiaryCustomer.fullName}
${
  formData.beneficiaryCustomer.dateOfBirth
    ? `Date of Birth: ${formData.beneficiaryCustomer.dateOfBirth}`
    : ""
}
${
  formData.beneficiaryCustomer.businessName
    ? `Business Name: ${formData.beneficiaryCustomer.businessName}`
    : ""
}
Address: ${formData.beneficiaryCustomer.address}
City: ${formData.beneficiaryCustomer.city}
State: ${formData.beneficiaryCustomer.state}
Postcode: ${formData.beneficiaryCustomer.postcode}
Country: ${formData.beneficiaryCustomer.country}
${
  formData.beneficiaryCustomer.phone
    ? `Phone: ${formData.beneficiaryCustomer.phone}`
    : ""
}
${
  formData.beneficiaryCustomer.email
    ? `Email: ${formData.beneficiaryCustomer.email}`
    : ""
}
${
  formData.beneficiaryCustomer.occupation
    ? `Occupation: ${formData.beneficiaryCustomer.occupation}`
    : ""
}
${
  formData.beneficiaryCustomer.abnAcnArbn
    ? `ABN/ACN/ARBN: ${formData.beneficiaryCustomer.abnAcnArbn}`
    : ""
}
${
  formData.beneficiaryCustomer.accountNumber
    ? `Account Number: ${formData.beneficiaryCustomer.accountNumber}`
    : ""
}
${
  formData.beneficiaryCustomer.institutionName
    ? `Institution Name: ${formData.beneficiaryCustomer.institutionName}`
    : ""
}
${
  formData.beneficiaryCustomer.institutionCity
    ? `Institution City: ${formData.beneficiaryCustomer.institutionCity}`
    : ""
}
${
  formData.beneficiaryCustomer.institutionCountry
    ? `Institution Country: ${formData.beneficiaryCustomer.institutionCountry}`
    : ""
}

═══════════════════════════════════════════════════════════════

SECTION 4: REPORT COMPLETION
═══════════════════════════════════════════════════════════════

Reason for Transfer: ${formData.reportCompletion.transferReason}

Report Completed By:
Name: ${formData.reportCompletion.completedBy.fullName}
Job Title: ${formData.reportCompletion.completedBy.jobTitle}
Phone: ${formData.reportCompletion.completedBy.phone}
Email: ${formData.reportCompletion.completedBy.email}

═══════════════════════════════════════════════════════════════
End of Report
═══════════════════════════════════════════════════════════════
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ifti-report-${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-8  ">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            International Funds Transfer Instruction
          </h2>
          <p className="text-sm text-muted-foreground">
            Report international fund transfers to AUSTRAC
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="w-4 h-4" />
            Upload JSON
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleGenerateReport}
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Save className="w-4 h-4" />
            Save Progress
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => setCurrentSection(index)}
                className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                  currentSection === index
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {index + 1}. {section}
              </button>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Section 0: Transaction Details */}
        {currentSection === 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateReceived">
                  Date Money/Property Received
                </Label>
                <Input
                  id="dateReceived"
                  type="date"
                  value={formData.transaction.dateReceived}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction: {
                        ...formData.transaction,
                        dateReceived: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateAvailable">
                  Date Made Available to Beneficiary
                </Label>
                <Input
                  id="dateAvailable"
                  type="date"
                  value={formData.transaction.dateAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction: {
                        ...formData.transaction,
                        dateAvailable: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="currencyCode">Currency Code</Label>
                <Input
                  id="currencyCode"
                  placeholder="e.g., AUD, USD, EUR"
                  value={formData.transaction.currencyCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction: {
                        ...formData.transaction,
                        currencyCode: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="totalAmount">Total Amount/Value</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.transaction.totalAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction: {
                        ...formData.transaction,
                        totalAmount: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="transferType">Type of Transfer</Label>
                <Select
                  value={formData.transaction.transferType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      transaction: {
                        ...formData.transaction,
                        transferType: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSFER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="referenceNumber">
                  Transaction Reference Number
                </Label>
                <Input
                  id="referenceNumber"
                  placeholder="Reference number"
                  value={formData.transaction.referenceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      transaction: {
                        ...formData.transaction,
                        referenceNumber: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="propertyDescription">
                Description of Property (if not money)
              </Label>
              <Textarea
                id="propertyDescription"
                placeholder="Describe the property being transferred..."
                value={formData.transaction.propertyDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transaction: {
                      ...formData.transaction,
                      propertyDescription: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Section 1: Ordering Customer */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Ordering Customer (Sender)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="ocFullName">Full Name *</Label>
                <Input
                  id="ocFullName"
                  placeholder="Full legal name"
                  value={formData.orderingCustomer.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        fullName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocOtherName">Other Name</Label>
                <Input
                  id="ocOtherName"
                  placeholder="Known by any other name"
                  value={formData.orderingCustomer.otherName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        otherName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocDob">Date of Birth</Label>
                <Input
                  id="ocDob"
                  type="date"
                  value={formData.orderingCustomer.dateOfBirth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        dateOfBirth: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="ocAddress">
                  Business/Residential Address *
                </Label>
                <Input
                  id="ocAddress"
                  placeholder="Street address (not PO box)"
                  value={formData.orderingCustomer.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocCity">City/Town/Suburb</Label>
                <Input
                  id="ocCity"
                  value={formData.orderingCustomer.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        city: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocState">State</Label>
                <Input
                  id="ocState"
                  value={formData.orderingCustomer.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        state: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocPostcode">Postcode</Label>
                <Input
                  id="ocPostcode"
                  value={formData.orderingCustomer.postcode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        postcode: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocCountry">Country</Label>
                <Input
                  id="ocCountry"
                  value={formData.orderingCustomer.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        country: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocPhone">Phone</Label>
                <Input
                  id="ocPhone"
                  type="tel"
                  value={formData.orderingCustomer.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        phone: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocEmail">Email</Label>
                <Input
                  id="ocEmail"
                  type="email"
                  value={formData.orderingCustomer.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocOccupation">
                  Occupation/Business/Principal Activity
                </Label>
                <Input
                  id="ocOccupation"
                  value={formData.orderingCustomer.occupation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        occupation: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocAbn">ABN/ACN/ARBN</Label>
                <Input
                  id="ocAbn"
                  value={formData.orderingCustomer.abnAcnArbn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        abnAcnArbn: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocCustomerNumber">Customer Number</Label>
                <Input
                  id="ocCustomerNumber"
                  value={formData.orderingCustomer.customerNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        customerNumber: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocAccountNumber">Account Number</Label>
                <Input
                  id="ocAccountNumber"
                  value={formData.orderingCustomer.accountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ocBusinessStructure">Business Structure</Label>
                <Select
                  value={formData.orderingCustomer.businessStructure}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      orderingCustomer: {
                        ...formData.orderingCustomer,
                        businessStructure: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_STRUCTURES.map((structure) => (
                      <SelectItem key={structure} value={structure}>
                        {structure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Beneficiary Customer */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Beneficiary Customer (Receiver)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="bcFullName">Full Name *</Label>
                <Input
                  id="bcFullName"
                  placeholder="Full legal name"
                  value={formData.beneficiaryCustomer.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        fullName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcDob">Date of Birth</Label>
                <Input
                  id="bcDob"
                  type="date"
                  value={formData.beneficiaryCustomer.dateOfBirth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        dateOfBirth: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcBusinessName">Business Name</Label>
                <Input
                  id="bcBusinessName"
                  value={formData.beneficiaryCustomer.businessName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        businessName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bcAddress">
                  Business/Residential Address *
                </Label>
                <Input
                  id="bcAddress"
                  placeholder="Street address (not PO box)"
                  value={formData.beneficiaryCustomer.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcCity">City/Town/Suburb</Label>
                <Input
                  id="bcCity"
                  value={formData.beneficiaryCustomer.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        city: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcState">State</Label>
                <Input
                  id="bcState"
                  value={formData.beneficiaryCustomer.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        state: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcPostcode">Postcode</Label>
                <Input
                  id="bcPostcode"
                  value={formData.beneficiaryCustomer.postcode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        postcode: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcCountry">Country</Label>
                <Input
                  id="bcCountry"
                  value={formData.beneficiaryCustomer.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        country: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcPhone">Phone</Label>
                <Input
                  id="bcPhone"
                  type="tel"
                  value={formData.beneficiaryCustomer.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        phone: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcEmail">Email</Label>
                <Input
                  id="bcEmail"
                  type="email"
                  value={formData.beneficiaryCustomer.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcOccupation">
                  Occupation/Business/Principal Activity
                </Label>
                <Input
                  id="bcOccupation"
                  value={formData.beneficiaryCustomer.occupation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        occupation: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcAbn">ABN/ACN/ARBN</Label>
                <Input
                  id="bcAbn"
                  value={formData.beneficiaryCustomer.abnAcnArbn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        abnAcnArbn: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcBusinessStructure">Business Structure</Label>
                <Select
                  value={formData.beneficiaryCustomer.businessStructure}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        businessStructure: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_STRUCTURES.map((structure) => (
                      <SelectItem key={structure} value={structure}>
                        {structure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bcAccountNumber">Account Number</Label>
                <Input
                  id="bcAccountNumber"
                  value={formData.beneficiaryCustomer.accountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcInstitutionName">Institution Name</Label>
                <Input
                  id="bcInstitutionName"
                  placeholder="Where account is held"
                  value={formData.beneficiaryCustomer.institutionName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        institutionName: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcInstitutionCity">Institution City</Label>
                <Input
                  id="bcInstitutionCity"
                  value={formData.beneficiaryCustomer.institutionCity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        institutionCity: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bcInstitutionCountry">
                  Institution Country
                </Label>
                <Input
                  id="bcInstitutionCountry"
                  value={formData.beneficiaryCustomer.institutionCountry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beneficiaryCustomer: {
                        ...formData.beneficiaryCustomer,
                        institutionCountry: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Intermediary Parties */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Intermediary Parties
            </h3>
            <p className="text-sm text-muted-foreground">
              Add intermediary parties involved in the transfer (optional)
            </p>

            <div className="space-y-4">
              {[
                {
                  key: "acceptingInstruction",
                  label: "Person/Organisation Accepting Transfer Instruction",
                },
                {
                  key: "acceptingMoney",
                  label: "Person/Organisation Accepting Money/Property",
                },
                {
                  key: "sendingInstruction",
                  label: "Person/Organisation Sending Transfer Instruction",
                },
                {
                  key: "receivingInstruction",
                  label: "Person/Organisation Receiving Transfer Instruction",
                },
                {
                  key: "distributingMoney",
                  label: "Person/Organisation Distributing Money/Property",
                },
                {
                  key: "retailOutlet",
                  label: "Retail Outlet/Business Location",
                },
              ].map(({ key, label }) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      id={key}
                      checked={showIntermediaries[key]}
                      onCheckedChange={(checked) =>
                        setShowIntermediaries({
                          ...showIntermediaries,
                          [key]: checked,
                        })
                      }
                    />
                    <Label htmlFor={key} className="font-medium cursor-pointer">
                      {label}
                    </Label>
                  </div>
                  {showIntermediaries[key] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pl-6">
                      <div className="md:col-span-2">
                        <Label>Full Name</Label>
                        <Input placeholder="Full name" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input placeholder="Street address" />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input />
                      </div>
                      <div>
                        <Label>Postcode</Label>
                        <Input />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Report Completion */}
        {currentSection === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">
              Report Completion Details
            </h3>
            <div>
              <Label htmlFor="transferReason">Reason for the Transfer *</Label>
              <Textarea
                id="transferReason"
                placeholder="Describe the reason for this international funds transfer..."
                rows={4}
                value={formData.reportCompletion.transferReason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reportCompletion: {
                      ...formData.reportCompletion,
                      transferReason: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">
                Person Completing This Report
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="completedByName">Full Name *</Label>
                  <Input
                    id="completedByName"
                    value={formData.reportCompletion.completedBy.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reportCompletion: {
                          ...formData.reportCompletion,
                          completedBy: {
                            ...formData.reportCompletion.completedBy,
                            fullName: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="completedByTitle">Job Title *</Label>
                  <Input
                    id="completedByTitle"
                    value={formData.reportCompletion.completedBy.jobTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reportCompletion: {
                          ...formData.reportCompletion,
                          completedBy: {
                            ...formData.reportCompletion.completedBy,
                            jobTitle: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="completedByPhone">Phone *</Label>
                  <Input
                    id="completedByPhone"
                    type="tel"
                    value={formData.reportCompletion.completedBy.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reportCompletion: {
                          ...formData.reportCompletion,
                          completedBy: {
                            ...formData.reportCompletion.completedBy,
                            phone: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="completedByEmail">Email *</Label>
                  <Input
                    id="completedByEmail"
                    type="email"
                    value={formData.reportCompletion.completedBy.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reportCompletion: {
                          ...formData.reportCompletion,
                          completedBy: {
                            ...formData.reportCompletion.completedBy,
                            email: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentSection(
                Math.min(sections.length - 1, currentSection + 1)
              )
            }
            disabled={currentSection === sections.length - 1}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
