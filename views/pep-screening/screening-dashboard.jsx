"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Globe,
  Search,
  User,
  Building2,
  Ship,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Settings,
  RefreshCw,
  Loader2,
  MonitorCheck,
} from "lucide-react";
import { ScreeningResults } from "./screening-results";
import { CaseManager } from "./case-manager";

const initialFormData = {
  name: "",
  caseId: "",
  group: "",
  registeredCountry: "",
  identificationNumber: "",
  issuerCountry: "",
  idType: "",
  primaryCase: "",
  dateOfBirth: "",
  nationality: "",
  gender: "",
  imoNumber: "",
  flagState: "",
  vesselType: "",
};

export default function PEPScreeningDashboard() {
  const [activeTab, setActiveTab] = useState("screening");
  const [mode, setMode] = useState("single");
  const [entityType, setEntityType] = useState("organisation");
  const [worldCheckEnabled, setWorldCheckEnabled] = useState(true);
  const [ongoingScreeningEnabled, setOngoingScreeningEnabled] = useState(false);
  const [idSectionOpen, setIdSectionOpen] = useState(true);
  const [linkCaseSectionOpen, setLinkCaseSectionOpen] = useState(true);

  const [formData, setFormData] = useState(initialFormData);
  const [isScreening, setIsScreening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const entityTypes = [
    { id: "individual", value: "individual", label: "Individual", icon: User },
    { id: "organisation", value: "organisation", label: "Organisation", icon: Building2 },
    { id: "vessel", value: "vessel", label: "Vessel", icon: Ship },
  ];

  const navTabs = [
    { id: "screening", label: "Screening", icon: Search },
    { id: "case-manager", label: "Case Manager", icon: MonitorCheck },
  ];

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScreen = async () => {
    // if (!formData.name.trim()) {
    //   return;
    // }
    setIsScreening(true);
    setShowResults(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsScreening(false);
    setShowResults(true);
  };

  const handleSave = () => {
    setSavedMessage("Case saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setShowResults(false);
    setSavedMessage("");
  };

  const renderEntitySpecificFields = () => {
    switch (entityType) {
      case "individual":
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                  Date of Birth
                  <HelpCircle className="h-3 w-3 text-slate-400" />
                </Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                  Nationality
                  <HelpCircle className="h-3 w-3 text-slate-400" />
                </Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) => handleFieldChange("nationality", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ch">Switzerland</SelectItem>
                    <SelectItem value="sg">Singapore</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="ru">Russia</SelectItem>
                    <SelectItem value="cn">China</SelectItem>
                    <SelectItem value="ir">Iran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                Gender
                <HelpCircle className="h-3 w-3 text-slate-400" />
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleFieldChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Collapsible open={idSectionOpen} onOpenChange={setIdSectionOpen} className="mb-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full bg-primary/10 px-3 py-2 rounded text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                {idSectionOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                IDENTIFICATION NUMBER
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                      Identification Number
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Input
                      placeholder="Enter ID number"
                      value={formData.identificationNumber}
                      onChange={(e) => handleFieldChange("identificationNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                      Country/Jurisdiction
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Select
                      value={formData.issuerCountry}
                      onValueChange={(value) => handleFieldChange("issuerCountry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ch">Switzerland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                      ID Type
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Select
                      value={formData.idType}
                      onValueChange={(value) => handleFieldChange("idType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="national-id">National ID</SelectItem>
                        <SelectItem value="drivers-license">{"Driver's License"}</SelectItem>
                        <SelectItem value="registration">Registration Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        );

      case "organisation":
        return (
          <>
            <div className="mb-4">
              <Label className="text-sm text-slate-600 mb-1.5 block">Registered Country</Label>
              <Select
                value={formData.registeredCountry}
                onValueChange={(value) => handleFieldChange("registeredCountry", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ch">Switzerland</SelectItem>
                  <SelectItem value="sg">Singapore</SelectItem>
                  <SelectItem value="hk">Hong Kong</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="ru">Russia</SelectItem>
                  <SelectItem value="ir">Iran</SelectItem>
                  <SelectItem value="kp">North Korea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Collapsible open={idSectionOpen} onOpenChange={setIdSectionOpen} className="mb-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full bg-primary/10 px-3 py-2 rounded text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                {idSectionOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                IDENTIFICATION NUMBER
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                      Identification Number
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Input
                      placeholder="Enter ID number"
                      value={formData.identificationNumber}
                      onChange={(e) => handleFieldChange("identificationNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                      Country/Jurisdiction
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Select
                      value={formData.issuerCountry}
                      onValueChange={(value) => handleFieldChange("issuerCountry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ch">Switzerland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                      ID Type
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Select
                      value={formData.idType}
                      onValueChange={(value) => handleFieldChange("idType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="national-id">National ID</SelectItem>
                        <SelectItem value="drivers-license">{"Driver's License"}</SelectItem>
                        <SelectItem value="registration">Registration Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        );

      case "vessel":
        return (
          <div className="mb-4">
            <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
              IMO Number
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input
              placeholder=""
              value={formData.imoNumber}
              onChange={(e) => handleFieldChange("imoNumber", e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderScreeningContent = () => (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Mini Sidebar */}

      {/* Screening Settings Sidebar */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 pt-4">
          <h3 className="text-xs font-semibold text-slate-500 mb-3">SCREENING SETTINGS</h3>

          {/* Mode Section */}
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
              MODE
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="batch">Batch</SelectItem>
              </SelectContent>
            </Select>
            {/* <div className="space-y-1">
              <button
                onClick={() => setMode("single")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                  mode === "single"
                    ? "bg-primary text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200",
                )}
              >
                Single
              </button>
              <button
                onClick={() => setMode("batch")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                  mode === "batch"
                    ? "bg-primary text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200",
                )}
              >
                Batch
              </button>
            </div> */}
          </div>
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-2">ENTITY TYPE</div>
            <Select value={entityType} onValueChange={(value) => setEntityType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id} className={"capitalize"}>
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Check Types Section */}
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
              CHECK TYPES
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  Dooit Screening
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-slate-400 hover:text-slate-600">
                    <Settings className="h-4 w-4" />
                  </button>
                  <Switch checked={worldCheckEnabled} onCheckedChange={setWorldCheckEnabled} />
                </div>
              </div>
              {/* <div className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  UBO CHECK
                </div>
                <Switch checked={uboCheckEnabled} onCheckedChange={setUboCheckEnabled} />
              </div> */}
            </div>
          </div>

          {/* Ongoing Screening Section */}
          <div>
            <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
              ONGOING SCREENING
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </div>
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 text-slate-500" />
                Dooit Screening
              </div>
              <Switch
                checked={ongoingScreeningEnabled}
                onCheckedChange={setOngoingScreeningEnabled}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Form Area */}
      <main className="flex-1 bg-white p-6 overflow-y-auto">
        <div className="max-w-3xl">
          <h2 className="text-sm font-semibold text-slate-500 mb-4">SCREENING</h2>

          {/* Name Field */}
          <div className="mb-4">
            <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
              Name <span className="text-red-500">*</span>
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <div className="relative">
              {entityType === "individual" ? (
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              ) : entityType === "vessel" ? (
                <Ship className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              ) : (
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              )}
              <Input
                placeholder={
                  entityType === "individual"
                    ? "Enter Individual Name"
                    : entityType === "vessel"
                      ? "Enter Vessel Name"
                      : "Enter Organisation Name"
                }
                className="pl-10 "
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </div>
          </div>

          {/* Case ID and Group Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                Case ID
                <HelpCircle className="h-3 w-3 text-slate-400" />
              </Label>
              <Input
                placeholder="Enter Case ID"
                value={formData.caseId}
                onChange={(e) => handleFieldChange("caseId", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                Group
                <HelpCircle className="h-3 w-3 text-slate-400" />
              </Label>
              <Input
                value={formData.group}
                onChange={(e) => handleFieldChange("group", e.target.value)}
              />
            </div>
          </div>

          {renderEntitySpecificFields()}

          {/* Identification Number Section */}

          {/* Link to Primary Case Section */}
          <Collapsible
            open={linkCaseSectionOpen}
            onOpenChange={setLinkCaseSectionOpen}
            className="mb-6"
          >
            <CollapsibleTrigger className="flex items-center gap-2 w-full bg-primary/10 px-3 py-2 rounded text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
              {linkCaseSectionOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              LINK TO CASE
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div>
                <Label className="text-sm text-slate-600 flex items-center gap-1 mb-1.5">
                  Choose Case
                  <HelpCircle className="h-3 w-3 text-slate-400" />
                </Label>
                <Input
                  placeholder="Enter Case ID or Name or Custom Field"
                  value={formData.primaryCase}
                  onChange={(e) => handleFieldChange("primaryCase", e.target.value)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleScreen}
              disabled={isScreening}
            >
              {isScreening ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  SCREENING...
                </>
              ) : (
                "SCREEN"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-slate-300 text-slate-700 px-6 bg-transparent"
              onClick={handleSave}
              disabled={!formData.name.trim()}
            >
              SAVE
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-slate-500 px-6 ml-auto"
              onClick={handleClear}
            >
              CLEAR
            </Button>
          </div>

          {savedMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-sm">
              {savedMessage}
            </div>
          )}

          {showResults && (
            <div className="mt-6">
              <ScreeningResults
                entityName={formData.name}
                entityType={entityType}
                caseId={formData.caseId || `WC-${Date.now().toString().slice(-6)}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen  flex flex-col">
      <nav className=" px-2 py-1 flex items-center shrink-0   bg-gray-100 rounded-md">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1 rounded-md ",
              activeTab === tab.id
                ? "text-primary border shadow-sm bg-white"
                : "text-slate-700 hover:text-primary hover:bg-white",
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-sm capitalize">{tab.label}</span>
            {tab.hasDropdown && <ChevronDown className="h-3 w-3" />}
          </button>
        ))}
      </nav>

      {activeTab === "screening" && renderScreeningContent()}
      {activeTab === "case-manager" && <CaseManager />}
      {activeTab === "dashboards" && (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Dashboards coming soon
        </div>
      )}
      {activeTab === "bulk-actions" && (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Bulk Actions coming soon
        </div>
      )}
      {activeTab === "status-reports" && (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Status Reports coming soon
        </div>
      )}
      {activeTab === "admin" && (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Admin coming soon
        </div>
      )}
    </div>
  );
}
