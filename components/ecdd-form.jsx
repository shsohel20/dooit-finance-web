"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Download, FileSpreadsheet, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export function ECDDForm({ data, caseNumber }) {
  const [formData, setFormData] = useState({
    isPEP: "No",
    isSanctioned: "No",
    relatedParty: "N/A",
  });
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (data) {
      const formattedData = {
        analystName: data.analyst_name,
        date: data.analysis_date || new Date().toISOString().split("T")[0],
        caseNumber: caseNumber,
        fullName: data.name,
        onboardingDate: data.onboarding_date,
        withdrawalDetails: data.withdrawal_details,
        expectedVolume: data.Expected_Trading_Volume,
        accountCreationDate: data.account_creation_date,
        totalDepositsAUD: data.total_deposits_AUD,
        totalWithdrawalsBTC: data.total_withdrawals_BTC,
        totalWithdrawalsETH: data.total_withdrawals_ETH,
        totalWithdrawalsUSDT: data.total_withdrawals_USDT,
        depositDetails: data.deposit_details,
        ipLocations: data.ip_locations,
        registeredAddress: data.registered_address,
        recommendation: data.recommendation,
        transactionAnalysis: data.transaction_analysis,
        profileSummary: data.recommendation,
        directors: data.director_name,
        isPEP: data.pep_flag,
        isSanctioned: data.sanction_flag,
        userId: data.user_id,
        accountPurpose: data.account_purpose,
        annualIncome: data.annual_income,
        beneficialOwner: data.beneficial_owner,
        analysisEndDate: data.analysis_end_date,
        additionalInfo: data.additonal_information,
        behavioralAnalysis: data.behavioral_analysis,
      };
      setFormData(formattedData);
    }
  }, [data]);
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        // Parse JSON or CSV data
        const data = JSON.parse(content);
        populateFormFromData(data);
      } catch (error) {
        console.error("[v0] Error parsing file:", error);
        alert("Error parsing file. Please ensure it's valid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  const populateFormFromData = (data) => {
    // Auto-populate form fields from uploaded data
    const populated = {
      analystName: data.analystName || "",
      position: data.position || "Compliance Officer",
      date: data.date || new Date().toISOString().split("T")[0],
      caseNumber: data.caseNumber || generateCaseNumber(),
      userId: data.userId || generateUserId(),
      fullName: data.fullName || "",
      customerName: data.customerName || data.fullName || "",
      abn: data.abn || "",
      onboardingDate: data.onboardingDate || "",
      accountPurpose: data.accountPurpose || "Digital Currency Exchange",
      expectedVolume: data.expectedVolume || "",
      annualIncome: data.annualIncome || "",
      beneficialOwner: data.beneficialOwner || "",
      directors: data.directors || "",
      isPEP: data.isPEP || "No",
      isSanctioned: data.isSanctioned || "No",
      relatedParty: data.relatedParty || "N/A",
      // Transaction data
      accountCreationDate:
        data.accountCreationDate || data.onboardingDate || "",
      analysisEndDate: data.analysisEndDate || "",
      totalDepositsAUD: data.totalDepositsAUD || "",
      totalWithdrawalsUSDT: data.totalWithdrawalsUSDT || "",
      totalWithdrawalsETH: data.totalWithdrawalsETH || "",
      totalWithdrawalsBTC: data.totalWithdrawalsBTC || "",
      depositDetails: data.depositDetails || "",
      withdrawalDetails: data.withdrawalDetails || "",
      additionalInfo: data.additionalInfo || "",
      // Behavioral
      ipLocations: data.ipLocations || "",
      registeredAddress: data.registeredAddress || "",
      // Auto-generate summaries
      profileSummary: generateProfileSummary(data),
      transactionAnalysis: generateTransactionAnalysis(data),
      behavioralAnalysis: generateBehavioralAnalysis(data),
      recommendation: generateRecommendation(data),
    };

    setFormData(populated);
  };

  const generateCaseNumber = () => {
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    return `EC_${date}_01`;
  };

  const generateUserId = () => {
    const randomNum = Math.floor(Math.random() * 1000) + 1;
    return `X${randomNum}`;
  };

  const generateProfileSummary = (data) => {
    if (!data.customerName) return "";

    return `The customer ${data.customerName} (UID: ${
      data.userId || "UID"
    }), ABN ${data.abn || "N/A"}, was onboarded on ${
      data.onboardingDate || "dd/mm/yyyy"
    }.

Account opening purpose was stated as ${
      data.accountPurpose || "Digital Currency Exchange"
    } and expected trading volume is listed as $${
      data.expectedVolume || "X"
    } and over AUD (per month), where the company annual income is over $${
      data.annualIncome || "X"
    } million as per onboarding document. An open media search reveals no adverse media for the customer. ${
      data.beneficialOwner || "N/A"
    } appears to be the BO of ${data.customerName}, where ${
      data.directors || "N/A"
    } are the directors of the company. No adverse media was identified for the related parties while conducting open media searches.`;
  };

  const generateTransactionAnalysis = (data) => {
    if (!data.customerName) return "";

    return `Since then account creation date on ${
      data.accountCreationDate || "dd/mm/yyyy"
    }, until ${data.analysisEndDate || "dd/mm/yyyy"}, ${
      data.customerName
    } conducted a total of $${
      data.totalDepositsAUD || "X"
    } million AUD in deposits and withdrawals amounting to ${
      data.totalWithdrawalsUSDT || "X"
    } million USDT, ${data.totalWithdrawalsETH || "X"} ETH and ${
      data.totalWithdrawalsBTC || "X"
    } BTC. The transactions follow a pattern of high-value AUD deposits immediately converted to cryptocurrency, with consistent use of a single beneficiary wallet for USDT withdrawals.

Deposit:
${
  data.depositDetails ||
  "The deposits, totaling $X AUD, ranged between $X AUD and $X AUD. All deposits were from the customer and converted into USDT and BTC. Elliptic screening and World-Check results indicate no adverse findings, with funds originating from legitimate sources."
}

Withdrawals:
${
  data.withdrawalDetails ||
  "Withdrawals included X million USDT sent to various wallets. Elliptic screening did not identify risks for these wallets."
}`;
  };

  const generateBehavioralAnalysis = (data) => {
    if (data.ipLocations) {
      return `The customer account has recorded a total of ${
        data.ipLocations
      } different IP locations, where all the IP logins are from Australia. The customer's registered address is in ${
        data.registeredAddress || "N/A"
      }.`;
    }
    return "The customer is an OTC customer thus no IP information is available.";
  };

  const generateRecommendation = (data) => {
    if (!data.customerName) return "";

    return `Based on our analysis on ${data.customerName} (UID: ${
      data.userId || "UID"
    }) conducted multiple AUD deposits followed by USDT and BTC withdrawals where the majority of them were sourced from an external whitelisted bank account. However, the SOF and SOW needs to be collected. Thus recommending to continue the relationship as a high risk customer (HRC) and request RFI at this stage.`;
  };

  const handleSave = () => {
    setLastSaved(new Date());
    // const {} = formData;

    console.log("[v0] ECDD data saved:", formData);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ECDD_${formData.caseNumber || "report"}.json`;
    link.click();
  };

  const handleGenerateReport = () => {
    // Generate formatted report text
    const report = `
ENHANCED CUSTOMER DUE DILIGENCE REPORT

1. Analysis and Review

1.(i) Analysed By:
(a) Name:     ${formData.analystName || "_________________________"}
(b) Position: ${formData.position || "_________________________"}
(c) Date:     ${formData.date || "_________________________"}
(d) Case Number: ${formData.caseNumber || "_________________________"}

2. Customer Profile
Inherent Customer risk rating:
2.1. User_id: ${formData.userId || "_________________________"}
2.2. Full Name: ${formData.fullName || "_________________________"}
2.3 Profile Summary
${formData.profileSummary || "_________________________"}

3. Customer is PEP (Y/N)
${formData.isPEP || "No"}

4. Sanctioned Customer (Y/N)
${formData.isSanctioned || "No"}

5. Related Party:
${formData.relatedParty || "N/A"}

6. Transaction Analysis
Transaction Analysis:
${formData.transactionAnalysis || "_________________________"}

Additional Information:
${formData.additionalInfo || "_________________________"}

7. Behavioral Analysis
${formData.behavioralAnalysis || "_________________________"}

8. Recommendation
${formData.recommendation || "_________________________"}
`;

    // Download as text file
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ECDD_Report_${formData.caseNumber || "report"}.txt`;
    link.click();
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold  text-zinc-700 mb-2">
          Enhanced Customer Due Diligence
        </h1>
        <p className="text-muted-foreground">
          Upload data or manually complete the ECDD report
        </p>
        {lastSaved && (
          <p className="text-sm text-muted-foreground mt-2">
            Last saved: {lastSaved.toLocaleString()}
          </p>
        )}
      </div>

      {/* File Upload Section */}
      {/* <Card className="border   p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold  text-zinc-700 mb-1">Data Import</h3>
            <p className="text-sm text-muted-foreground">
              Upload JSON or Excel file to auto-populate fields
            </p>
          </div>
          <FileSpreadsheet className="w-8 h-8  text-zinc-700" />
        </div>
        <div className="flex gap-4">
          <Label
            htmlFor="file-upload"
            className="flex-1 cursor-pointer border border-dashed   rounded-lg p-6 hover:bg-primary/5 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8  text-zinc-700" />
              <span className="text-sm font-medium  text-zinc-700">
                Click to upload JSON file
              </span>
              <span className="text-xs text-muted-foreground">
                Supported: .json, .csv
              </span>
            </div>
            <Input
              id="file-upload"
              type="file"
              accept=".json,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Label>
        </div>
      </Card> */}

      {/* Section 1: Analysis and Review */}
      <Card className="border   p-6 mb-6">
        <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
          1. Analysis and Review
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="analystName">Analyst Name</Label>
              <Input
                id="analystName"
                value={formData.analystName || ""}
                onChange={(e) => updateField("analystName", e.target.value)}
                placeholder="Enter analyst name"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position || ""}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="Compliance Officer"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="caseNumber">Case Number</Label>
              <Input
                id="caseNumber"
                value={formData.caseNumber || ""}
                onChange={(e) => updateField("caseNumber", e.target.value)}
                placeholder="EC_20240101_01"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: Customer Profile */}
      <Card className="border   p-6 mb-6">
        <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
          2. Customer Profile
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={formData.userId || ""}
                onChange={(e) => updateField("userId", e.target.value)}
                placeholder="X1"
              />
            </div> */}
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName || ""}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Customer/Company Name"
              />
            </div>
            <div>
              <Label htmlFor="abn">ABN</Label>
              <Input
                id="abn"
                value={formData.abn || ""}
                onChange={(e) => updateField("abn", e.target.value)}
                placeholder="ABN Number"
              />
            </div>
            <div>
              <Label htmlFor="onboardingDate">Onboarding Date</Label>
              <Input
                id="onboardingDate"
                type="date"
                value={formData.onboardingDate || ""}
                onChange={(e) => updateField("onboardingDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountPurpose">Account Purpose</Label>
              <Input
                id="accountPurpose"
                value={formData.accountPurpose || ""}
                onChange={(e) => updateField("accountPurpose", e.target.value)}
                placeholder="Digital Currency Exchange"
              />
            </div>
            <div>
              <Label htmlFor="expectedVolume">
                Expected Trading Volume (AUD)
              </Label>
              <Input
                id="expectedVolume"
                value={formData.expectedVolume || ""}
                onChange={(e) => updateField("expectedVolume", e.target.value)}
                placeholder="1000000"
              />
            </div>
            <div>
              <Label htmlFor="annualIncome">Annual Income (Million AUD)</Label>
              <Input
                id="annualIncome"
                value={formData.annualIncome || ""}
                onChange={(e) => updateField("annualIncome", e.target.value)}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="beneficialOwner">Beneficial Owner</Label>
              <Input
                id="beneficialOwner"
                value={formData.beneficialOwner || ""}
                onChange={(e) => updateField("beneficialOwner", e.target.value)}
                placeholder="Owner Name"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="directors">Directors</Label>
              <Input
                id="directors"
                value={formData.directors || ""}
                onChange={(e) => updateField("directors", e.target.value)}
                placeholder="Director names (comma separated)"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="profileSummary">
              Profile Summary (Auto-generated)
            </Label>
            <Textarea
              id="profileSummary"
              value={formData.profileSummary || ""}
              onChange={(e) => updateField("profileSummary", e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Section 3-5: PEP, Sanctioned, Related Party */}
      <Card className="border   p-6 mb-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="isPEP">3. Customer is PEP (Y/N)</Label>
            <Select
              value={formData.isPEP || "No"}
              onValueChange={(value) => updateField("isPEP", value)}
            >
              <SelectTrigger id="isPEP">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="isSanctioned">4. Sanctioned Customer (Y/N)</Label>
            <Select
              value={formData.isSanctioned || "No"}
              onValueChange={(value) => updateField("isSanctioned", value)}
            >
              <SelectTrigger id="isSanctioned">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="relatedParty">5. Related Party</Label>
            <Input
              id="relatedParty"
              value={formData.relatedParty || ""}
              onChange={(e) => updateField("relatedParty", e.target.value)}
              placeholder="N/A"
            />
          </div>
        </div>
      </Card>

      {/* Section 6: Transaction Analysis */}
      <Card className="border   p-6 mb-6">
        <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
          6. Transaction Analysis
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountCreationDate">Account Creation Date</Label>
              <Input
                id="accountCreationDate"
                type="date"
                value={formData.accountCreationDate || ""}
                onChange={(e) =>
                  updateField("accountCreationDate", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="analysisEndDate">Analysis End Date</Label>
              <Input
                id="analysisEndDate"
                type="date"
                value={formData.analysisEndDate || ""}
                onChange={(e) => updateField("analysisEndDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="totalDepositsAUD">Total Deposits (AUD)</Label>
              <Input
                id="totalDepositsAUD"
                value={formData.totalDepositsAUD || ""}
                onChange={(e) =>
                  updateField("totalDepositsAUD", e.target.value)
                }
                placeholder="1000000"
              />
            </div>
            <div>
              <Label htmlFor="totalWithdrawalsUSDT">
                Total Withdrawals (USDT)
              </Label>
              <Input
                id="totalWithdrawalsUSDT"
                value={formData.totalWithdrawalsUSDT || ""}
                onChange={(e) =>
                  updateField("totalWithdrawalsUSDT", e.target.value)
                }
                placeholder="500000"
              />
            </div>
            <div>
              <Label htmlFor="totalWithdrawalsETH">
                Total Withdrawals (ETH)
              </Label>
              <Input
                id="totalWithdrawalsETH"
                value={formData.totalWithdrawalsETH || ""}
                onChange={(e) =>
                  updateField("totalWithdrawalsETH", e.target.value)
                }
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="totalWithdrawalsBTC">
                Total Withdrawals (BTC)
              </Label>
              <Input
                id="totalWithdrawalsBTC"
                value={formData.totalWithdrawalsBTC || ""}
                onChange={(e) =>
                  updateField("totalWithdrawalsBTC", e.target.value)
                }
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="depositDetails">Deposit Details</Label>
            <Textarea
              id="depositDetails"
              value={formData.depositDetails || ""}
              onChange={(e) => updateField("depositDetails", e.target.value)}
              rows={4}
              placeholder="Detailed deposit information..."
            />
          </div>
          <div>
            <Label htmlFor="withdrawalDetails">Withdrawal Details</Label>
            <Textarea
              id="withdrawalDetails"
              value={formData.withdrawalDetails || ""}
              onChange={(e) => updateField("withdrawalDetails", e.target.value)}
              rows={4}
              placeholder="Detailed withdrawal information..."
            />
          </div>
          <div>
            <Label htmlFor="transactionAnalysis">
              Transaction Analysis (Auto-generated)
            </Label>
            <Textarea
              id="transactionAnalysis"
              value={formData.transactionAnalysis || ""}
              onChange={(e) =>
                updateField("transactionAnalysis", e.target.value)
              }
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo || ""}
              onChange={(e) => updateField("additionalInfo", e.target.value)}
              rows={3}
              placeholder="Any additional context or CCO comments..."
            />
          </div>
        </div>
      </Card>

      {/* Section 7: Behavioral Analysis */}
      <Card className="border   p-6 mb-6">
        <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
          7. Behavioral Analysis
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ipLocations">Number of IP Locations</Label>
              <Input
                id="ipLocations"
                value={formData.ipLocations || ""}
                onChange={(e) => updateField("ipLocations", e.target.value)}
                placeholder="Leave empty for OTC customers"
              />
            </div>
            <div>
              <Label htmlFor="registeredAddress">Registered Address</Label>
              <Input
                id="registeredAddress"
                value={formData.registeredAddress || ""}
                onChange={(e) =>
                  updateField("registeredAddress", e.target.value)
                }
                placeholder="City/State"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="behavioralAnalysis">
              Behavioral Analysis (Auto-generated)
            </Label>
            <Textarea
              id="behavioralAnalysis"
              value={formData.behavioralAnalysis || ""}
              onChange={(e) =>
                updateField("behavioralAnalysis", e.target.value)
              }
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Section 8: Recommendation */}
      <Card className="border   p-6 mb-6">
        <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
          8. Recommendation
        </h2>
        <div>
          <Label htmlFor="recommendation">
            Recommendation (Auto-generated)
          </Label>
          <Textarea
            id="recommendation"
            value={formData.recommendation || ""}
            onChange={(e) => updateField("recommendation", e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          onClick={handleSave}
          size="lg"
          variant="outline"
          className="border   bg-transparent"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Progress
        </Button>
        {/* <Button
          onClick={handleExport}
          size="lg"
          variant="outline"
          className="border   bg-transparent"
        >
          <Download className="w-5 h-5 mr-2" />
          Export JSON
        </Button> */}
        <Button
          onClick={handleGenerateReport}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <FileSpreadsheet className="w-5 h-5 mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  );
}
