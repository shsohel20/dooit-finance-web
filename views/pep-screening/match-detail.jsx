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

export function MatchDetail({
  matchData,
  caseData,
  matchIndex,
  totalMatches,
  onBack,
  onBackToCaseManager,
  onNavigate,
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

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-700 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCaseManager}
            className="text-sm text-slate-300 hover:text-white flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Case Manager
          </button>
          <div className="flex items-center gap-2 border-l border-slate-500 pl-4">
            <span className="text-sm text-slate-300">Case</span>
            <button className="text-slate-400 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="bg-slate-600 px-2 py-0.5 rounded text-sm">2</span>
            <button className="text-slate-400 hover:text-white">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-400">of 100</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-300 hover:text-white flex items-center gap-1">
            <Download className="h-4 w-4" />
            EXPORT
          </button>
          <button className="text-sm text-slate-300 hover:text-white flex items-center gap-1">
            <StickyNote className="h-4 w-4" />
            NOTES
          </button>
          <button className="text-sm text-slate-300 hover:text-white flex items-center gap-1">
            <Activity className="h-4 w-4" />
            ACTIVITY
          </button>
        </div>
      </div>

      {/* Case Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
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
            <span className="text-sm text-slate-700">{caseData.assignee || "Case Unassigned"}</span>
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
      </div>

      {/* Left Sidebar + Main Content Row */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Case Details */}
        <div className="w-44 bg-slate-100 border-r border-slate-200 p-4 shrink-0">
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
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("summary")}
              className={cn(
                "px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                activeTab === "summary"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50",
              )}
            >
              <FileText className="h-4 w-4" />
              SUMMARY
            </button>
            <button
              onClick={() => setActiveTab("world-check")}
              className={cn(
                "px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                activeTab === "world-check"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50",
              )}
            >
              <Globe className="h-4 w-4" />
              WORLD-CHECK
              <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">348</span>
            </button>
            <button
              onClick={() => setActiveTab("linked-cases")}
              className={cn(
                "px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                activeTab === "linked-cases"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50",
              )}
            >
              <Link2 className="h-4 w-4" />
              LINKED CASES
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={cn(
                "px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                activeTab === "audit"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50",
              )}
            >
              <FileSearch className="h-4 w-4" />
              AUDIT
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack} className="gap-1 bg-transparent">
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
          </div>

          {/* Archived Warning Banner */}
          {caseData.archived && (
            <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800 font-medium">ARCHIVED</span>
              <span className="text-sm text-amber-700">
                This case is archived and cannot be amended. To unarchive it, please click on the
                Archive icon above.
              </span>
            </div>
          )}

          {/* Match Detail Content */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Current Status */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase">
                  Current Status
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="text-slate-500 w-32">Resolution Status</span>
                    <span className="text-slate-800">Unresolved</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-32">Risk Level</span>
                    <span className="text-slate-800">-</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-32">Reason</span>
                    <span className="text-slate-800">-</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-32">Resolution Remark</span>
                    <span className="text-slate-800">-</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-32">Review Comment</span>
                    <span className="text-slate-800">-</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-32">Last Updated</span>
                    <span className="text-slate-800">-</span>
                  </div>
                </div>
              </div>

              {/* Archived Notice */}
              {caseData.archived && (
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-amber-800">ARCHIVED</span>
                    <p className="text-sm text-amber-700 mt-1">
                      This case is archived and cannot be amended. To unarchive it, please click on
                      the Archive icon above.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Data */}
            <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase">Comparison Data</h3>
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
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-200",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {/* Key Data Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">KEY DATA</span>
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
                    <span className="text-slate-500 w-40">Name</span>
                    <span className="text-slate-800">{keyData.name}</span>
                  </div>
                  <div></div>
                  <div className="flex">
                    <span className="text-slate-500 w-40">Record Update</span>
                    <div className="flex gap-8">
                      <div>
                        <span className="text-slate-500 text-xs">Update Categorization</span>
                        <p className="text-blue-600 hover:underline cursor-pointer">
                          {keyData.updateCategorization}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">Entered Date</span>
                        <p className="text-slate-800">{keyData.enteredDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs">Updated Date</span>
                        <p className="text-slate-800">{keyData.updatedDate}</p>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div className="flex">
                    <span className="text-slate-500 w-40">Category</span>
                    <span className="text-slate-800">{keyData.category}</span>
                  </div>
                  <div></div>
                  <div className="flex">
                    <span className="text-slate-500 w-40">Sub-Category</span>
                    <span className="text-slate-800">{keyData.subCategory}</span>
                  </div>
                  <div></div>
                  <div className="flex">
                    <span className="text-slate-500 w-40">PEP Status</span>
                    <span className="text-slate-800">{keyData.pepStatus}</span>
                  </div>
                  <div></div>
                  <div className="flex">
                    <span className="text-slate-500 w-40">Gender</span>
                    <span className="text-slate-800">{keyData.gender}</span>
                  </div>
                  <div></div>
                  <div className="flex">
                    <span className="text-slate-500 w-40">Citizenship</span>
                    <span className="text-slate-800">{keyData.citizenship}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
