"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";

const initialCustomer = {
  fullName: "",
  otherNames: [],
  dateOfBirth: "",
  businessAddress: {
    fullStreetAddress: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
  },
  phoneNumbers: [""],
  emailAddresses: [""],
  occupation: "",
  accounts: [],
  digitalCurrencyWallets: [],
  identityVerification: {
    documentation: [],
    electronicDataSource: [],
    deviceIdentifiers: [],
  },
};

const initialFormData = {
  referenceNumber: "",
  customers: [initialCustomer],
  transactionConductMethod: "individual",
  transaction: {
    date: "",
    referenceNumber: "",
    totalAmount: {
      currencyCode: "AUD",
      amount: 0,
    },
    designatedService: "",
    moneyReceived: {
      foreignCurrency: [],
      digitalCurrency: [],
      otherComponents: [],
    },
    moneyProvided: {
      foreignCurrency: [],
      digitalCurrency: [],
      otherComponents: [],
    },
  },
  recipients: [],
  reportingEntity: {
    identificationNumber: "",
    name: "",
    branch: {
      identificationNumber: "",
      name: "",
      address: {
        fullStreetAddress: "",
        city: "",
        state: "",
        postcode: "",
      },
    },
    personCompleting: {
      name: "",
      jobTitle: "",
      phone: "",
      email: "",
    },
  },
  completionDate: new Date().toISOString().split("T")[0],
};

export function TTRForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [currentPart, setCurrentPart] = useState("A");
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);

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

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ttr-${formData.referenceNumber || "draft"}.json`;
    link.click();
  };

  const handleGenerateReport = () => {
    let report = "THRESHOLD TRANSACTION REPORT\n";
    report += "Financial and Bullion Services\n";
    report += "=".repeat(80) + "\n\n";

    report += `Reference Number: ${formData.referenceNumber}\n`;
    report += `Date: ${formData.completionDate}\n\n`;

    report += "PART A - DETAILS OF THE CUSTOMER(S)\n";
    report += "-".repeat(80) + "\n";
    formData.customers.forEach((customer, idx) => {
      report += `\nCustomer ${idx + 1}:\n`;
      report += `Full Name: ${customer.fullName}\n`;
      if (customer.otherNames.length > 0) {
        report += `Other Names: ${customer.otherNames.join(", ")}\n`;
      }
      report += `Date of Birth: ${customer.dateOfBirth}\n`;
      report += `Address: ${customer.businessAddress.fullStreetAddress}, ${customer.businessAddress.city}, ${customer.businessAddress.state} ${customer.businessAddress.postcode}\n`;
      report += `Phone: ${customer.phoneNumbers.join(", ")}\n`;
      report += `Email: ${customer.emailAddresses.join(", ")}\n`;
      report += `Occupation: ${customer.occupation}\n`;
      if (customer.abn) report += `ABN: ${customer.abn}\n`;
      if (customer.acn) report += `ACN: ${customer.acn}\n`;
      if (customer.arbn) report += `ARBN: ${customer.arbn}\n`;
      if (customer.businessStructure)
        report += `Business Structure: ${customer.businessStructure}\n`;
    });

    report +=
      "\n\nPART B - DETAILS OF THE INDIVIDUAL CONDUCTING THE TRANSACTION\n";
    report += "-".repeat(80) + "\n";
    report += `Transaction Conducted By: ${formData.transactionConductMethod}\n`;
    if (formData.transactionConductDescription) {
      report += `Description: ${formData.transactionConductDescription}\n`;
    }

    report += "\n\nPART C - DETAILS OF THE TRANSACTION\n";
    report += "-".repeat(80) + "\n";
    report += `Date: ${formData.transaction.date}\n`;
    report += `Reference Number: ${formData.transaction.referenceNumber}\n`;
    report += `Total Amount: ${
      formData.transaction.totalAmount.currencyCode
    } ${formData.transaction.totalAmount.amount.toFixed(2)}\n`;
    report += `Designated Service: ${formData.transaction.designatedService}\n\n`;

    report += "Money/Value RECEIVED:\n";
    if (formData.transaction.moneyReceived.australianDollars) {
      report += `  AUD: ${formData.transaction.moneyReceived.australianDollars.amount.toFixed(
        2
      )}\n`;
    }
    formData.transaction.moneyReceived.foreignCurrency.forEach((fc) => {
      report += `  ${fc.currencyCode}: ${fc.amount.toFixed(2)}\n`;
    });

    report += "\nMoney/Value PROVIDED:\n";
    if (formData.transaction.moneyProvided.australianDollars) {
      report += `  AUD: ${formData.transaction.moneyProvided.australianDollars.amount.toFixed(
        2
      )}\n`;
    }
    formData.transaction.moneyProvided.foreignCurrency.forEach((fc) => {
      report += `  ${fc.currencyCode}: ${fc.amount.toFixed(2)}\n`;
    });

    report += "\n\nPART D - DETAILS OF REPORTING ENTITY\n";
    report += "-".repeat(80) + "\n";
    report += `Entity ID: ${formData.reportingEntity.identificationNumber}\n`;
    report += `Entity Name: ${formData.reportingEntity.name}\n`;
    report += `Branch: ${formData.reportingEntity.branch.name}\n`;
    report += `Branch Address: ${formData.reportingEntity.branch.address.fullStreetAddress}, ${formData.reportingEntity.branch.address.city}\n`;
    report += `\nCompleted By: ${formData.reportingEntity.personCompleting.name}\n`;
    report += `Job Title: ${formData.reportingEntity.personCompleting.jobTitle}\n`;
    report += `Phone: ${formData.reportingEntity.personCompleting.phone}\n`;
    report += `Email: ${formData.reportingEntity.personCompleting.email}\n`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ttr-report-${formData.referenceNumber || "draft"}.txt`;
    link.click();
  };

  const addCustomer = () => {
    setFormData({
      ...formData,
      customers: [...formData.customers, { ...initialCustomer }],
    });
  };

  const removeCustomer = (index) => {
    if (formData.customers.length === 1) return;
    const newCustomers = formData.customers.filter((_, i) => i !== index);
    setFormData({ ...formData, customers: newCustomers });
    if (currentCustomerIndex >= newCustomers.length) {
      setCurrentCustomerIndex(newCustomers.length - 1);
    }
  };

  const updateCustomer = (index, updates) => {
    const newCustomers = [...formData.customers];
    newCustomers[index] = { ...newCustomers[index], ...updates };
    setFormData({ ...formData, customers: newCustomers });
  };

  const addRecipient = () => {
    setFormData({
      ...formData,
      recipients: [
        ...formData.recipients,
        {
          isCustomer: false,
          phoneNumbers: [""],
          emailAddresses: [""],
          accounts: [],
        },
      ],
    });
  };

  const currentCustomer = formData.customers[currentCustomerIndex];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="border-primary">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold text-primary">
            Threshold Transaction Report (TTR)
          </CardTitle>
          <CardDescription className="text-base">
            Financial and Bullion Services - Transactions of $10,000 or more
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-4 w-4" />
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
              onClick={handleExportJSON}
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleGenerateReport}
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>

          <div className="mb-6 flex gap-2 border-b">
            {["A", "B", "C", "D"].map((part) => (
              <button
                key={part}
                onClick={() => setCurrentPart(part)}
                className={`px-4 py-2 font-medium transition-colors ${
                  currentPart === part
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Part {part}
              </button>
            ))}
          </div>

          {currentPart === "A" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Part A - Details of the Customer(s)
                </h3>
                <Button onClick={addCustomer} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              </div>

              {formData.customers.length > 1 && (
                <div className="flex gap-2">
                  {formData.customers.map((_, idx) => (
                    <Button
                      key={idx}
                      variant={
                        currentCustomerIndex === idx ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentCustomerIndex(idx)}
                    >
                      Customer {idx + 1}
                    </Button>
                  ))}
                </div>
              )}

              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    Customer {currentCustomerIndex + 1}
                  </h4>
                  {formData.customers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomer(currentCustomerIndex)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={currentCustomer.fullName}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={currentCustomer.dateOfBirth}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">
                      Occupation/Business/Principal Activity
                    </Label>
                    <Input
                      id="occupation"
                      value={currentCustomer.occupation}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          occupation: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessStructure">
                      Business Structure
                    </Label>
                    <Select
                      value={currentCustomer.businessStructure}
                      onValueChange={(value) =>
                        updateCustomer(currentCustomerIndex, {
                          businessStructure: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business/Residential Address</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Full street address"
                      value={currentCustomer.businessAddress.fullStreetAddress}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          businessAddress: {
                            ...currentCustomer.businessAddress,
                            fullStreetAddress: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="City/Town/Suburb"
                      value={currentCustomer.businessAddress.city}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          businessAddress: {
                            ...currentCustomer.businessAddress,
                            city: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="State"
                      value={currentCustomer.businessAddress.state}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          businessAddress: {
                            ...currentCustomer.businessAddress,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Postcode"
                      value={currentCustomer.businessAddress.postcode}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          businessAddress: {
                            ...currentCustomer.businessAddress,
                            postcode: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="abn">ABN</Label>
                    <Input
                      id="abn"
                      value={currentCustomer.abn}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          abn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acn">ACN</Label>
                    <Input
                      id="acn"
                      value={currentCustomer.acn}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          acn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arbn">ARBN</Label>
                    <Input
                      id="arbn"
                      value={currentCustomer.arbn}
                      onChange={(e) =>
                        updateCustomer(currentCustomerIndex, {
                          arbn: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Numbers</Label>
                  {currentCustomer.phoneNumbers.map((phone, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...currentCustomer.phoneNumbers];
                          newPhones[idx] = e.target.value;
                          updateCustomer(currentCustomerIndex, {
                            phoneNumbers: newPhones,
                          });
                        }}
                        placeholder="Phone number"
                      />
                      {idx === currentCustomer.phoneNumbers.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateCustomer(currentCustomerIndex, {
                              phoneNumbers: [
                                ...currentCustomer.phoneNumbers,
                                "",
                              ],
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Email Addresses</Label>
                  {currentCustomer.emailAddresses.map((email, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...currentCustomer.emailAddresses];
                          newEmails[idx] = e.target.value;
                          updateCustomer(currentCustomerIndex, {
                            emailAddresses: newEmails,
                          });
                        }}
                        placeholder="Email address"
                      />
                      {idx === currentCustomer.emailAddresses.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateCustomer(currentCustomerIndex, {
                              emailAddresses: [
                                ...currentCustomer.emailAddresses,
                                "",
                              ],
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>How was the transaction conducted?</Label>
                <Select
                  value={formData.transactionConductMethod}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      transactionConductMethod: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">By an individual</SelectItem>
                    <SelectItem value="armoured-car">
                      Armoured car service
                    </SelectItem>
                    <SelectItem value="atm">ATM deposit</SelectItem>
                    <SelectItem value="night-deposit">
                      Night/quick deposit facility
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.transactionConductMethod === "other" && (
                <div className="space-y-2">
                  <Label>Provide description</Label>
                  <Textarea
                    value={formData.transactionConductDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionConductDescription: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}

          {currentPart === "B" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                Part B - Details of the Individual Conducting the Transaction
              </h3>

              <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                  <Label>Is the individual conducting the transaction:</Label>
                  <Select
                    value={formData.individualConducting?.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        individualConducting: {
                          ...formData.individualConducting,
                          type: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="employee">
                        Employee of Customer
                      </SelectItem>
                      <SelectItem value="other">Another individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.individualConducting?.type === "customer" && (
                  <div className="space-y-2">
                    <Label>Select Customer</Label>
                    <Select
                      value={formData.individualConducting.customerIndex?.toString()}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          individualConducting: {
                            ...formData.individualConducting,
                            customerIndex: Number.parseInt(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.customers.map((customer, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            Customer {idx + 1} - {customer.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(formData.individualConducting?.type === "employee" ||
                  formData.individualConducting?.type === "other") && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Please provide details of the individual conducting the
                      transaction
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="Full name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Occupation</Label>
                        <Input placeholder="Occupation" />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship to Customer</Label>
                        <Input placeholder="e.g., Employee, Agent, Representative" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPart === "C" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                Part C - Details of the Transaction
              </h3>

              <div className="space-y-4 rounded-lg border p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date of Transaction</Label>
                    <Input
                      type="date"
                      value={formData.transaction.date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            date: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction Reference Number</Label>
                    <Input
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

                  <div className="space-y-2">
                    <Label>Total Amount (AUD)</Label>
                    <Input
                      type="number"
                      value={formData.transaction.totalAmount.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            totalAmount: {
                              ...formData.transaction.totalAmount,
                              amount: Number.parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Designated Service</Label>
                    <Select
                      value={formData.transaction.designatedService}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            designatedService: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="currency-exchange">
                          Currency Exchange
                        </SelectItem>
                        <SelectItem value="funds-transfer">
                          Funds Transfer
                        </SelectItem>
                        <SelectItem value="cash-deposit">
                          Cash Deposit
                        </SelectItem>
                        <SelectItem value="cash-withdrawal">
                          Cash Withdrawal
                        </SelectItem>
                        <SelectItem value="bullion-purchase">
                          Bullion Purchase
                        </SelectItem>
                        <SelectItem value="bullion-sale">
                          Bullion Sale
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Money/Value RECEIVED</h4>
                  <div className="space-y-2">
                    <Label>Australian Dollars</Label>
                    <Input
                      type="number"
                      placeholder="Amount in AUD"
                      value={
                        formData.transaction.moneyReceived.australianDollars
                          ?.amount || ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            moneyReceived: {
                              ...formData.transaction.moneyReceived,
                              australianDollars: {
                                currencyCode: "AUD",
                                amount: Number.parseFloat(e.target.value) || 0,
                              },
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Foreign Currency</Label>
                    {formData.transaction.moneyReceived.foreignCurrency.map(
                      (fc, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            placeholder="Currency code"
                            value={fc.currencyCode}
                            onChange={(e) => {
                              const newFC = [
                                ...formData.transaction.moneyReceived
                                  .foreignCurrency,
                              ];
                              newFC[idx].currencyCode = e.target.value;
                              setFormData({
                                ...formData,
                                transaction: {
                                  ...formData.transaction,
                                  moneyReceived: {
                                    ...formData.transaction.moneyReceived,
                                    foreignCurrency: newFC,
                                  },
                                },
                              });
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={fc.amount}
                            onChange={(e) => {
                              const newFC = [
                                ...formData.transaction.moneyReceived
                                  .foreignCurrency,
                              ];
                              newFC[idx].amount = Number.parseFloat(
                                e.target.value
                              );
                              setFormData({
                                ...formData,
                                transaction: {
                                  ...formData.transaction,
                                  moneyReceived: {
                                    ...formData.transaction.moneyReceived,
                                    foreignCurrency: newFC,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            moneyReceived: {
                              ...formData.transaction.moneyReceived,
                              foreignCurrency: [
                                ...formData.transaction.moneyReceived
                                  .foreignCurrency,
                                { currencyCode: "", amount: 0 },
                              ],
                            },
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Foreign Currency
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Money/Value PROVIDED</h4>
                  <div className="space-y-2">
                    <Label>Australian Dollars</Label>
                    <Input
                      type="number"
                      placeholder="Amount in AUD"
                      value={
                        formData.transaction.moneyProvided.australianDollars
                          ?.amount || ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            moneyProvided: {
                              ...formData.transaction.moneyProvided,
                              australianDollars: {
                                currencyCode: "AUD",
                                amount: Number.parseFloat(e.target.value) || 0,
                              },
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Foreign Currency</Label>
                    {formData.transaction.moneyProvided.foreignCurrency.map(
                      (fc, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            placeholder="Currency code"
                            value={fc.currencyCode}
                            onChange={(e) => {
                              const newFC = [
                                ...formData.transaction.moneyProvided
                                  .foreignCurrency,
                              ];
                              newFC[idx].currencyCode = e.target.value;
                              setFormData({
                                ...formData,
                                transaction: {
                                  ...formData.transaction,
                                  moneyProvided: {
                                    ...formData.transaction.moneyProvided,
                                    foreignCurrency: newFC,
                                  },
                                },
                              });
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={fc.amount}
                            onChange={(e) => {
                              const newFC = [
                                ...formData.transaction.moneyProvided
                                  .foreignCurrency,
                              ];
                              newFC[idx].amount = Number.parseFloat(
                                e.target.value
                              );
                              setFormData({
                                ...formData,
                                transaction: {
                                  ...formData.transaction,
                                  moneyProvided: {
                                    ...formData.transaction.moneyProvided,
                                    foreignCurrency: newFC,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          transaction: {
                            ...formData.transaction,
                            moneyProvided: {
                              ...formData.transaction.moneyProvided,
                              foreignCurrency: [
                                ...formData.transaction.moneyProvided
                                  .foreignCurrency,
                                { currencyCode: "", amount: 0 },
                              ],
                            },
                          },
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Foreign Currency
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Recipients</h4>
                    <Button onClick={addRecipient} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Recipient
                    </Button>
                  </div>

                  {formData.recipients.map((recipient, idx) => (
                    <div key={idx} className="space-y-4 rounded border p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Recipient {idx + 1}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newRecipients = formData.recipients.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({
                              ...formData,
                              recipients: newRecipients,
                            });
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Is the recipient a customer?</Label>
                        <Select
                          value={recipient.isCustomer ? "yes" : "no"}
                          onValueChange={(value) => {
                            const newRecipients = [...formData.recipients];
                            newRecipients[idx].isCustomer = value === "yes";
                            setFormData({
                              ...formData,
                              recipients: newRecipients,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes (Customer)</SelectItem>
                            <SelectItem value="no">No (Other)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!recipient.isCustomer && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={recipient.fullName || ""}
                              onChange={(e) => {
                                const newRecipients = [...formData.recipients];
                                newRecipients[idx].fullName = e.target.value;
                                setFormData({
                                  ...formData,
                                  recipients: newRecipients,
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Occupation</Label>
                            <Input
                              value={recipient.occupation || ""}
                              onChange={(e) => {
                                const newRecipients = [...formData.recipients];
                                newRecipients[idx].occupation = e.target.value;
                                setFormData({
                                  ...formData,
                                  recipients: newRecipients,
                                });
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentPart === "D" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                Part D - Details of Reporting Entity
              </h3>

              <div className="space-y-4 rounded-lg border p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Identification Number (ABN/AUSTRAC ID)</Label>
                    <Input
                      value={formData.reportingEntity.identificationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reportingEntity: {
                            ...formData.reportingEntity,
                            identificationNumber: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Name of Reporting Entity</Label>
                    <Input
                      value={formData.reportingEntity.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reportingEntity: {
                            ...formData.reportingEntity,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Branch/Office Details</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Branch Identification Number</Label>
                      <Input
                        value={
                          formData.reportingEntity.branch.identificationNumber
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              branch: {
                                ...formData.reportingEntity.branch,
                                identificationNumber: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Branch Name</Label>
                      <Input
                        value={formData.reportingEntity.branch.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              branch: {
                                ...formData.reportingEntity.branch,
                                name: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Branch Address</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        placeholder="Full street address"
                        value={
                          formData.reportingEntity.branch.address
                            .fullStreetAddress
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              branch: {
                                ...formData.reportingEntity.branch,
                                address: {
                                  ...formData.reportingEntity.branch.address,
                                  fullStreetAddress: e.target.value,
                                },
                              },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="City/Town/Suburb"
                        value={formData.reportingEntity.branch.address.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              branch: {
                                ...formData.reportingEntity.branch,
                                address: {
                                  ...formData.reportingEntity.branch.address,
                                  city: e.target.value,
                                },
                              },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="State"
                        value={formData.reportingEntity.branch.address.state}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              branch: {
                                ...formData.reportingEntity.branch,
                                address: {
                                  ...formData.reportingEntity.branch.address,
                                  state: e.target.value,
                                },
                              },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="Postcode"
                        value={formData.reportingEntity.branch.address.postcode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              branch: {
                                ...formData.reportingEntity.branch,
                                address: {
                                  ...formData.reportingEntity.branch.address,
                                  postcode: e.target.value,
                                },
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Person Completing This Report</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.reportingEntity.personCompleting.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              personCompleting: {
                                ...formData.reportingEntity.personCompleting,
                                name: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={
                          formData.reportingEntity.personCompleting.jobTitle
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              personCompleting: {
                                ...formData.reportingEntity.personCompleting,
                                jobTitle: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={formData.reportingEntity.personCompleting.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              personCompleting: {
                                ...formData.reportingEntity.personCompleting,
                                phone: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.reportingEntity.personCompleting.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingEntity: {
                              ...formData.reportingEntity,
                              personCompleting: {
                                ...formData.reportingEntity.personCompleting,
                                email: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Completion Date</Label>
                  <Input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        completionDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                const parts = ["A", "B", "C", "D"];
                const currentIndex = parts.indexOf(currentPart);
                if (currentIndex > 0) setCurrentPart(parts[currentIndex - 1]);
              }}
              disabled={currentPart === "A"}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                const parts = ["A", "B", "C", "D"];
                const currentIndex = parts.indexOf(currentPart);
                if (currentIndex < parts.length - 1)
                  setCurrentPart(parts[currentIndex + 1]);
              }}
              disabled={currentPart === "D"}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
