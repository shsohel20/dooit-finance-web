"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, UserCheck, Link2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LabelDetails from "@/components/LabelDetails";

const caseManagers = [
  { label: "Sarah Mitchell", value: "sarah.mitchell" },
  { label: "David Chen", value: "david.chen" },
  { label: "Fatima Al-Hassan", value: "fatima.alhassan" },
  { label: "Robert Jameson", value: "robert.jameson" },
  { label: "Priya Sharma", value: "priya.sharma" },
];

const availableLinkedCases = [
  { id: "AML2026003", name: "SHEIKH REHANA", relationship: "Sibling" },
  { id: "AML2026004", name: "SAJEEB WAZED JOY", relationship: "Child" },
  { id: "AML2026007", name: "WAJED MIAH", relationship: "Spouse (Deceased)" },
  { id: "AML2026008", name: "SHIRIN SHARMIN CHAUDHURY", relationship: "Political Associate" },
];

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
  resolution,
  onResolve,
}) {
  const [activeTab, setActiveTab] = useState("world-check");
  const [activeDetailTab, setActiveDetailTab] = useState("key-data");
  const [showAllUpdatedDates, setShowAllUpdatedDates] = useState(false);
  const [localResolution, setLocalResolution] = useState(null);
  const [falsePositiveReason, setFalsePositiveReason] = useState("");
  const [assignee, setAssignee] = useState("");
  const [linkedCaseIds, setLinkedCaseIds] = useState([]);

  useEffect(() => {
    if (resolution) {
      setLocalResolution(resolution.type);
      setFalsePositiveReason(resolution.reason || "");
      setAssignee(resolution.assignee || "");
      setLinkedCaseIds(resolution.linkedCases || []);
    } else {
      setLocalResolution(null);
      setFalsePositiveReason("");
      setAssignee("");
      setLinkedCaseIds([]);
    }
  }, [resolution, open]);

  const handleSave = () => {
    if (localResolution === "false_positive") {
      onResolve?.("false_positive", { reason: falsePositiveReason });
    } else if (localResolution === "confirmed") {
      onResolve?.("confirmed", { assignee, linkedCases: linkedCaseIds });
    }
    onOpenChange?.(false);
  };

  const toggleLinkedCase = (id) => {
    setLinkedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={"sm:max-w-7xl w-full bg-white"}>
        <SheetHeader>
          <SheetTitle>Match Detail</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col  overflow-hidden">
          {/* Left Sidebar + Main Content Row */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
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
                  <div className="border rounded-lg   p-4">
                    {/* Current Status */}
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase">
                        Current Status
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <LabelDetails label="Resolution" value="Unresolved" />
                        {/* <div className="flex flex-col"> */}
                        <LabelDetails label="Risk Level" value={caseData.riskLevel} />
                        <LabelDetails label="Reason" value={caseData.reason} />
                        <LabelDetails label="Resolution Remark" value={caseData.resolutionRemark} />
                        <LabelDetails label="Review Comment" value={caseData.reviewComment} />
                        <LabelDetails label="Last Updated" value={caseData.lastUpdated} />
                      </div>
                    </div>
                    {/* Comparison Data */}
                  </div>
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

                {/* Detail Tabs */}
                <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-2 py-1 border-b border-slate-200 flex items-center gap-1 flex-wrap">
                    {[
                      { id: "key-data", label: "General Information" },
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
                      <div className="grid grid-cols-4 gap-x-8 gap-y-3 text-sm">
                        <LabelDetails label="Name" value={keyData.name} />

                        <LabelDetails
                          label="Update Categorization"
                          value={keyData.updateCategorization}
                        />
                        <LabelDetails label="Entered Date" value={keyData.enteredDate} />
                        <LabelDetails label="Updated Date" value={keyData.updatedDate} />

                        <LabelDetails label="Category" value={keyData.category} />
                        <LabelDetails label="Sub-Category" value={keyData.subCategory} />
                        <LabelDetails label="PEP Status" value={keyData.pepStatus} />
                        <LabelDetails label="Gender" value={keyData.gender} />
                        <LabelDetails label="Citizenship" value={keyData.citizenship} />
                        <LabelDetails label="Professional Title" value={"-"} />
                        <LabelDetails label="Date of Birth" value={"19th NOV 1990"} />
                        <LabelDetails label="Place of Birth" value={"Kabul, Afghanistan"} />
                        <LabelDetails label="Alias" value={"AHMADI, Sitara"} />
                        <LabelDetails label="Keyword" value={"AHMADI, Sitara"} />
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "pep-role" && (
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-x-8 gap-y-3 text-sm">
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

                {/* Disposition */}
                <div className="mt-4 border rounded-lg p-4 space-y-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase">Disposition</h3>

                  {!localResolution && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="border-amber-400 text-amber-600 hover:bg-amber-50"
                        onClick={() => setLocalResolution("false_positive")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Mark as False Positive
                      </Button>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setLocalResolution("confirmed")}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm as True Match
                      </Button>
                    </div>
                  )}

                  {localResolution === "false_positive" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-600 font-medium">
                        <X className="h-4 w-4" />
                        Marked as False Positive
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Reason</Label>
                        <Input
                          value={falsePositiveReason}
                          onChange={(e) => setFalsePositiveReason(e.target.value)}
                          placeholder="Explain why this is a false positive..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          Save Resolution
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setLocalResolution(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {localResolution === "confirmed" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-medium">
                        <UserCheck className="h-4 w-4" />
                        Confirmed as True Match
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Assign to Case Manager</Label>
                        <select
                          value={assignee}
                          onChange={(e) => setAssignee(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">Select case manager...</option>
                          {caseManagers.map((cm) => (
                            <option key={cm.value} value={cm.value}>
                              {cm.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-3.5 w-3.5 text-slate-500" />
                          <Label className="text-xs text-slate-500">
                            Add Linked Cases / Related Parties
                          </Label>
                        </div>
                        <div className="space-y-2 rounded-md border border-border p-3">
                          {availableLinkedCases.map((lc) => (
                            <div key={lc.id} className="flex items-center gap-3">
                              <Checkbox
                                id={lc.id}
                                checked={linkedCaseIds.includes(lc.id)}
                                onCheckedChange={() => toggleLinkedCase(lc.id)}
                              />
                              <label htmlFor={lc.id} className="flex-1 cursor-pointer text-sm">
                                <span className="font-medium">{lc.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {lc.relationship}
                                </span>
                                <span className="ml-2 text-xs text-slate-400">{lc.id}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          Save &amp; Assign
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setLocalResolution(null)}
                        >
                          Cancel
                        </Button>
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
