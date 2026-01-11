"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  User,
  FileText,
  Globe,
  Link2,
  FileSearch,
  ChevronLeft,
  ChevronRight,
  Download,
  StickyNote,
  Activity,
  Check,
} from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LabelDetails from "@/components/LabelDetails";

export function MatchDetail({
  matchData,
  caseData,
  matchIndex,
  totalMatches,
  onBack,
  onBackToCaseManager,
  onNavigate,
  open,
  onOpenChange,
}) {
  const [activeTab, setActiveTab] = useState("world-check");
  const [activeDetailTab, setActiveDetailTab] = useState("key-data");
  const [showAllUpdatedDates, setShowAllUpdatedDates] = useState(false);

  const getRatingBadge = (rating) => {
    const colors = {
      High: "bg-red-600 text-white",
      Medium: "bg-amber-500 text-white",
      Low: "bg-emerald-500 text-white",
    };
    return (
      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", colors[rating])}>
        {rating}
      </span>
    );
  };

  // Generate mock key data based on match
  const keyData = {
    name: matchData.name.replace("Dr ", "").replace("Brigadier General ", ""),
    updateCategorization: "C1",
    enteredDate: "17-Oct-2019",
    updatedDate: "15-Aug-2023",
    category: "INDIVIDUAL",
    subCategory: "PEP - National Government",
    pepStatus: "Inactive - 3 Year(s)",
    gender: matchData.gender || "UNKNOWN",
    citizenship: matchData.citizenship,
  };
  console.log("caseData", caseData);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={"sm:max-w-7xl w-full bg-white"}>
        <SheetHeader>
          <SheetTitle>Match Detail</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col  overflow-hidden">
          {/* Top Bar */}

          {/* Case Header */}
          {/* <div className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                <span className="font-semibold text-slate-800">{caseData.caseName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Case Rating</span>
                {getRatingBadge(caseData.caseRating)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Case ID</span>
                <span className="text-sm font-mono text-slate-700">{caseData.caseId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Group</span>
                <span className="text-sm text-slate-700">Line1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Assignee</span>
                <span className="text-sm text-slate-700">
                  {caseData.assignee || "Case Unassigned"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Case Last Updated</span>
                <span className="text-sm text-slate-700">{caseData.lastModifiedDateUser}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Ongoing Screening</span>
                <span className="text-sm text-slate-700">
                  {caseData.ongoingScreening ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div> */}

          {/* Left Sidebar + Main Content Row */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Case Details */}
            {/* <div className="w-44  border-r border-slate-200 p-4 shrink-0">
              <h3 className="text-xs font-semibold text-slate-500 mb-3">CASE DETAILS</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 text-xs">Name Transposition</span>
                  <p className="text-slate-800">Yes</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Primary Name</span>
                  <p className="text-slate-800 font-medium">{caseData.caseName}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Status</span>
                  <div className="mt-1">
                    {caseData.archived ? (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        Archived
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div> */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navigation Bar */}
              {/* <div className=" border-b border-slate-200 px-4 py-2 flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="gap-1 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Matches
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Matching World-Check Record</span>
                  <button
                    onClick={() => onNavigate("prev")}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
                    disabled={matchIndex <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-sm min-w-[40px] text-center">
                    {matchIndex}
                  </span>
                  <button
                    onClick={() => onNavigate("next")}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
                    disabled={matchIndex >= totalMatches}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-slate-500">of {totalMatches}</span>
                </div>
              </div> */}

              {/* Archived Warning Banner */}
              {caseData.archived && (
                <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-800 font-medium">ARCHIVED</span>
                  <span className="text-sm text-amber-700">
                    This case is archived and cannot be amended. To unarchive it, please click on
                    the Archive icon above.
                  </span>
                </div>
              )}

              {/* Match Detail Content */}
              <div className="flex-1 overflow-auto p-4">
                <div className=" gap-4">
                  {/* Current Status */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase">
                      Current Status
                    </h3>
                    <div className="flex text-sm justify-between">
                      <LabelDetails label="Resolution Status" value="Unresolved" />
                      {/* <div className="flex flex-col"> */}
                      <LabelDetails label="Risk Level" value={caseData.riskLevel} />
                      <LabelDetails label="Reason" value={caseData.reason} />
                      <LabelDetails label="Resolution Remark" value={caseData.resolutionRemark} />
                      <LabelDetails label="Review Comment" value={caseData.reviewComment} />
                      <LabelDetails label="Last Updated" value={caseData.lastUpdated} />
                    </div>
                  </div>

                  {/* Archived Notice */}
                  {caseData.archived && (
                    <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-amber-800">ARCHIVED</span>
                        <p className="text-sm text-amber-700 mt-1">
                          This case is archived and cannot be amended. To unarchive it, please click
                          on the Archive icon above.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparison Data */}
                <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className=" px-4 py-2 border-b border-slate-200">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase">
                      Comparison Data
                    </h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-2 text-left text-slate-600 font-medium w-1/3"></th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium w-1/3">
                          Submitted Data
                        </th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium w-1/3">
                          Matched Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-2 text-slate-800 font-medium">Name</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-800">{caseData.caseName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-slate-800">{keyData.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Detail Tabs */}
                <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-2 py-1 border-b border-slate-200 flex items-center gap-1 flex-wrap">
                    {[
                      { id: "key-data", label: "KEY DATA" },
                      { id: "further-info", label: "FURTHER INFORMATION" },
                      { id: "aliases", label: "ALIASES" },
                      { id: "keywords", label: "KEYWORDS" },
                      { id: "pep-role", label: "PEP ROLE DETAILS" },
                      { id: "connections", label: "CONNECTIONS / RELATIONSHIPS" },
                      { id: "sources", label: "SOURCES" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDetailTab(tab.id)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded transition-colors",
                          activeDetailTab === tab.id
                            ? "bg-primary text-white"
                            : "text-slate-600 hover:bg-slate-200",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeDetailTab === "key-data" && (
                    <div className="p-4">
                      {/* Key Data Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            KEY DATA
                          </span>
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                            PEP
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">Show all Updated Dates</span>
                          <Switch
                            checked={showAllUpdatedDates}
                            onCheckedChange={setShowAllUpdatedDates}
                          />
                        </div>
                      </div>

                      {/* Key Data Table */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div className="flex">
                          <LabelDetails label="Name" value={keyData.name} />
                        </div>
                        <div></div>
                        <div className="flex">
                          <span className="text-slate-500 w-40">Record Update</span>
                          <div className="flex gap-8">
                            <div>
                              <LabelDetails
                                label="Update Categorization"
                                value={keyData.updateCategorization}
                              />
                            </div>
                            <div>
                              <LabelDetails label="Entered Date" value={keyData.enteredDate} />
                            </div>
                            <div>
                              <LabelDetails label="Updated Date" value={keyData.updatedDate} />
                            </div>
                          </div>
                        </div>
                        <div></div>
                        <div className="flex">
                          <LabelDetails label="Category" value={keyData.category} />
                        </div>
                        <div></div>
                        <div className="flex">
                          <LabelDetails label="Sub-Category" value={keyData.subCategory} />
                        </div>
                        <div></div>
                        <div className="flex">
                          <LabelDetails label="PEP Status" value={keyData.pepStatus} />
                        </div>
                        <div></div>
                        <div className="flex">
                          <LabelDetails label="Gender" value={keyData.gender} />
                        </div>
                        <div></div>
                        <div className="flex">
                          <LabelDetails label="Citizenship" value={keyData.citizenship} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "further-info" && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase">
                        FURTHER INFORMATION
                      </h3>

                      <div className="py-4 flex flex-col gap-2">
                        <LabelDetails label="Professional Title" value={"-"} />
                        <LabelDetails label="Date of Birth" value={"19th NOV 1990"} />
                        <LabelDetails label="Place of Birth" value={"Kabul, Afghanistan"} />
                      </div>
                    </div>
                  )}
                  {activeDetailTab === "aliases" && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase">ALIASES</h3>
                      <div className="py-4 flex flex-col gap-2">
                        <LabelDetails label="Alias" value={"AHMADI, Sitara"} />
                        {/* <LabelDetails label="Alias" value={"AHMADI, Sitara"} /> */}
                      </div>
                    </div>
                  )}
                  {activeDetailTab === "keywords" && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase">KEYWORDS</h3>
                      <div className="py-4 flex flex-col gap-2">
                        <LabelDetails label="Keyword" value={"AHMADI, Sitara"} />
                      </div>
                    </div>
                  )}
                  {activeDetailTab === "pep-role" && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase">
                        PEP ROLE DETAILS
                      </h3>
                      <div className="py-4 flex flex-col gap-2">
                        <LabelDetails label="Is PEP" value={"Yes"} />
                        <LabelDetails label="PEP Role" value={"President"} />
                        <LabelDetails
                          label="PEP Role Description"
                          value={"President of the United States"}
                        />
                        <LabelDetails label="PEP Role Start Date" value={"01-Jan-2020"} />
                        <LabelDetails label="PEP Role End Date" value={"01-Jan-2020"} />
                        <LabelDetails label="PEP Role Status" value={"Active"} />
                        <LabelDetails label="PEP Role Status Description" value={"Active"} />
                        <LabelDetails label="PEP Role Status Start Date" value={"01-Jan-2020"} />
                      </div>
                    </div>
                  )}
                  {activeDetailTab === "connections" && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase">
                        CONNECTIONS / RELATIONSHIPS
                      </h3>
                      <div className="py-4 flex flex-col gap-2">
                        NO CONNECTIONS / RELATIONSHIPS FOUND
                      </div>
                    </div>
                  )}
                  {activeDetailTab === "sources" && (
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase">SOURCES</h3>
                      <div className="py-4 flex flex-col gap-2">
                        <a
                          href="https://www.prothomalo.com/bangladesh/district/2ulbxsr9q2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LabelDetails
                            label="Source"
                            value={"https://www.prothomalo.com/bangladesh/district/2ulbxsr9q2"}
                          />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
