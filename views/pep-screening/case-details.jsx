"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  User,
  FileText,
  Globe,
  Link2,
  FileSearch,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  Filter,
  Download,
  Archive,
  MoreVertical,
  RefreshCw,
  Search,
} from "lucide-react";
import { MatchDetail } from "./match-detail";

const mockMatches = [
  {
    id: 1,
    name: "- XIELAOSHILA",
    matchedAlias: "WANG,Jun\nAlias",
    matchStrength: 75,
    matchStrengthColor: "orange",
    types: [
      { label: "LE", color: "bg-blue-500" },
      { label: "SIC", color: "bg-orange-500" },
    ],
    gender: "Male",
    dateOfBirth: "06-May-1991",
    placeOfBirth: "China",
    citizenship: "China",
    countryLocation: "China",
    category: "CRIME - ORGANIZED",
    count: 4,
  },
  {
    id: 2,
    name: "Brigadier General Jun WANG",
    matchedAlias: "",
    matchStrength: 85,
    matchStrengthColor: "green",
    types: [{ label: "PEP", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "United States\nChina",
    category: "DIPLOMAT",
    count: 1,
  },
  {
    id: 3,
    name: "Changli WANG",
    matchedAlias: "WANG,Jun\nAlias",
    matchStrength: 70,
    matchStrengthColor: "green",
    types: [
      { label: "OB", color: "bg-blue-500" },
      { label: "SIC", color: "bg-orange-500" },
    ],
    gender: "Male",
    dateOfBirth: "03-Jul-1956",
    placeOfBirth: "China",
    citizenship: "China",
    countryLocation: "China",
    category: "CRIME - FINANCIAL",
    count: 1,
  },
  {
    id: 4,
    name: "Chuangguo WANG",
    matchedAlias: "WANG,Jun\nAlias",
    matchStrength: 68,
    matchStrengthColor: "green",
    types: [
      { label: "OB", color: "bg-blue-500" },
      { label: "SIC", color: "bg-orange-500" },
    ],
    gender: "Male",
    dateOfBirth: "14-Feb-1971",
    placeOfBirth: "China",
    citizenship: "China",
    countryLocation: "China",
    category: "CRIME - FINANCIAL",
    count: 5,
  },
  {
    id: 5,
    name: "Dr Jun WANG",
    matchedAlias: "",
    matchStrength: 80,
    matchStrengthColor: "green",
    types: [{ label: "PEP", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "Nov-1971",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "China",
    category: "INDIVIDUAL",
    count: 3,
  },
  {
    id: 6,
    name: "Dr Jun WANG",
    matchedAlias: "",
    matchStrength: 82,
    matchStrengthColor: "green",
    types: [{ label: "PEP", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "Mar-1971",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "China",
    category: "POLITICAL INDIVIDUAL",
    count: 2,
  },
  {
    id: 7,
    name: "Dr Jun WANG",
    matchedAlias: "",
    matchStrength: 78,
    matchStrengthColor: "green",
    types: [
      { label: "PEP", color: "bg-orange-500" },
      { label: "SIC", color: "bg-orange-500" },
    ],
    gender: "Male",
    dateOfBirth: "Apr-1970",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "China",
    category: "CRIME - FINANCIAL",
    count: 1,
  },
  {
    id: 8,
    name: "Dr Jun WANG",
    matchedAlias: "",
    matchStrength: 83,
    matchStrengthColor: "green",
    types: [{ label: "PEP", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "15-Feb-1971",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "Hong Kong\nUnited Kingdom\nChina",
    category: "INDIVIDUAL",
    count: 3,
  },
  {
    id: 9,
    name: "Dr Jun WANG",
    matchedAlias: "",
    matchStrength: 79,
    matchStrengthColor: "green",
    types: [{ label: "PEP", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "Nov-1958",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "China",
    category: "INDIVIDUAL",
    count: 7,
  },
  {
    id: 10,
    name: "Dr Jun WANG",
    matchedAlias: "",
    matchStrength: 81,
    matchStrengthColor: "green",
    types: [{ label: "PEP", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "May-1976",
    placeOfBirth: "",
    citizenship: "China",
    countryLocation: "China",
    category: "POLITICAL INDIVIDUAL",
    count: 6,
  },
];

const mockLinkedCases = [
  {
    id: 1,
    caseName: "JUN WANG",
    relationship: "",
    caseId: "CXP2300243",
    mandatoryActions: 348,
    unresolved: 348,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: true,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "18-Jun-2025",
  },
];

export function CaseDetails({ caseData, onBack, onBackToManager }) {
  const [activeTab, setActiveTab] = useState("world-check");
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(null);

  // Filter states
  const [matchStrengthOpen, setMatchStrengthOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [dobOpen, setDobOpen] = useState(false);
  const [identificationOpen, setIdentificationOpen] = useState(false);
  const [placeOfBirthOpen, setPlaceOfBirthOpen] = useState(false);
  const [citizenshipOpen, setCitizenshipOpen] = useState(false);
  const [countryLocationOpen, setCountryLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [pepStatusOpen, setPepStatusOpen] = useState(false);

  const handleSelectMatch = (id) => {
    if (selectedMatches.includes(id)) {
      setSelectedMatches(selectedMatches.filter((mId) => mId !== id));
    } else {
      setSelectedMatches([...selectedMatches, id]);
    }
  };

  const handleMatchClick = (index) => {
    setSelectedMatchIndex(index);
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

  const getMatchStrengthBar = (strength, color) => {
    const bgColors = {
      green: "bg-emerald-500",
      orange: "bg-orange-500",
      yellow: "bg-amber-400",
    };
    return (
      <div className="w-20 h-3 bg-slate-200 rounded-sm overflow-hidden">
        <div
          className={cn("h-full rounded-sm", bgColors[color])}
          style={{ width: `${strength}%` }}
        />
      </div>
    );
  };

  const renderLinkedCasesTab = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Case Details */}
      <div className="w-48 bg-slate-100 border-r border-slate-200 p-4 shrink-0">
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
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Archived</span>
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
        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-slate-600">
              <Filter className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-slate-600 gap-1">
                  <Download className="h-4 w-4" />
                  EXPORT
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-slate-600 gap-1">
                  <Link2 className="h-4 w-4" />
                  LINK CASES
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Link to existing case</DropdownMenuItem>
                <DropdownMenuItem>Create new linked case</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Linked Cases Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2 text-left w-10">
                  <Checkbox />
                </th>
                <th className="px-3 py-2 text-left w-10 text-slate-600 font-medium"></th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[150px]">
                  Case Name
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[120px]">
                  Relationship
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-28">ID</th>
                <th className="px-3 py-2 text-center text-slate-600 font-medium w-24">
                  Mandatory Actions
                </th>
                <th className="px-3 py-2 text-center text-slate-600 font-medium" colSpan={2}>
                  <div className="text-center">World-Check - Summary</div>
                </th>
                <th className="px-3 py-2 text-center text-slate-600 font-medium w-24">
                  Ongoing Screening
                </th>
                <th className="px-3 py-2 text-center text-slate-600 font-medium w-20">Archived</th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[100px]">
                  Assignee
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[120px]">
                  Last Modified By
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">
                  Last Modified Date - User
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">
                  Last Modified Date - OGS
                </th>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1 text-center text-slate-500 font-normal text-xs">
                  Unresolved
                </th>
                <th className="px-3 py-1 text-center text-slate-500 font-normal text-xs">
                  Review Required
                </th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {mockLinkedCases.map((linkedCase) => (
                <tr
                  key={linkedCase.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-blue-50"
                >
                  <td className="px-3 py-2">
                    <span className="text-slate-500">{linkedCase.id}</span>
                  </td>
                  <td className="px-3 py-2">
                    <User className="h-4 w-4 text-slate-400" />
                  </td>
                  <td className="px-3 py-2 text-slate-800 font-medium">{linkedCase.caseName}</td>
                  <td className="px-3 py-2 text-slate-600">{linkedCase.relationship}</td>
                  <td className="px-3 py-2 text-slate-600">{linkedCase.caseId}</td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">
                      {linkedCase.mandatoryActions}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">
                      {linkedCase.unresolved}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600">
                    {linkedCase.reviewRequired}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Checkbox checked={linkedCase.ongoingScreening} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Archive className="h-4 w-4 text-slate-400 mx-auto" />
                  </td>
                  <td className="px-3 py-2 text-slate-600">{linkedCase.assignee}</td>
                  <td className="px-3 py-2 text-blue-600">{linkedCase.lastModifiedBy}</td>
                  <td className="px-3 py-2 text-slate-600">{linkedCase.lastModifiedDateUser}</td>
                  <td className="px-3 py-2 text-slate-600">{linkedCase.lastModifiedDateOGS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWorldCheckTab = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Case Details */}
      <div className="w-48 bg-slate-100 border-r border-slate-200 p-4 shrink-0">
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
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Archived</span>
              ) : (
                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
          Showing <strong>348</strong> of <strong>1140</strong> matches for{" "}
          <strong className="text-blue-600">{caseData.caseName}</strong>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2 text-left w-10">
                  <Checkbox />
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[180px]">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[100px]">
                  Matched Alias
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-24">
                  Match Strength
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-24">Type</th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-16">Gender</th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-28">
                  Date(s) of Birth
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-24">
                  Place of Birth
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-24">Citizenship</th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium w-28">
                  Country Location
                </th>
                <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[120px]">
                  Category
                </th>
                <th className="px-3 py-2 text-center text-slate-600 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody>
              {mockMatches.map((match, index) => (
                <tr
                  key={match.id}
                  className={cn(
                    "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                    selectedMatches.includes(match.id) && "bg-blue-50",
                  )}
                >
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selectedMatches.includes(match.id)}
                      onCheckedChange={() => handleSelectMatch(match.id)}
                    />
                  </td>
                  <td
                    className="px-3 py-2 text-blue-600 hover:underline cursor-pointer font-medium"
                    onClick={() => handleMatchClick(index)}
                  >
                    {match.name}
                  </td>
                  <td className="px-3 py-2 text-slate-600 whitespace-pre-line text-xs">
                    {match.matchedAlias}
                  </td>
                  <td className="px-3 py-2">
                    {getMatchStrengthBar(match.matchStrength, match.matchStrengthColor)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {match.types.map((type, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "px-1.5 py-0.5 rounded text-xs font-medium text-white",
                            type.color,
                          )}
                        >
                          {type.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{match.gender}</td>
                  <td className="px-3 py-2 text-slate-600">{match.dateOfBirth}</td>
                  <td className="px-3 py-2 text-slate-600">{match.placeOfBirth}</td>
                  <td className="px-3 py-2 text-slate-600">{match.citizenship}</td>
                  <td className="px-3 py-2 text-slate-600 text-xs whitespace-pre-line">
                    {match.countryLocation}
                  </td>
                  <td className="px-3 py-2 text-slate-600 text-xs">{match.category}</td>
                  <td className="px-3 py-2 text-center text-slate-400">{match.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "linked-cases":
        return renderLinkedCasesTab();
      case "world-check":
      default:
        return renderWorldCheckTab();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Case Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
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
          <span className="text-sm text-slate-700">{caseData.ongoingScreening ? "Yes" : "No"}</span>
        </div>
      </div>

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

      {/* Main Content - render based on active tab */}
      {renderTabContent()}

      {/* Match Detail Modal */}
      {selectedMatchIndex !== null && (
        <MatchDetail
          caseData={caseData}
          matchData={mockMatches[selectedMatchIndex]}
          matchIndex={selectedMatchIndex}
          totalMatches={mockMatches.length}
          onBack={() => setSelectedMatchIndex(null)}
          onBackToManager={onBackToManager}
          onNavigate={(direction) => {
            if (direction === "prev" && selectedMatchIndex > 0) {
              setSelectedMatchIndex(selectedMatchIndex - 1);
            } else if (direction === "next" && selectedMatchIndex < mockMatches.length - 1) {
              setSelectedMatchIndex(selectedMatchIndex + 1);
            }
          }}
        />
      )}
    </div>
  );
}
