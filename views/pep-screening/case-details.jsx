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
import CustomResizableTable from "@/components/ui/CustomResizable";

const mockMatches = [
  {
    id: 1,
    name: "SHEIKH HASINA WAZED",
    matchedAlias: "HASINA, Sheikh\nPrimary Name",
    matchStrength: 95,
    matchStrengthColor: "red",
    types: [
      { label: "PEP", color: "bg-green-500" },
      { label: "SAN", color: "bg-purple-500" },
    ],
    gender: "Female",
    dateOfBirth: "28-Sep-1947",
    placeOfBirth: "Tungipara, Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "FORMER HEAD OF GOVERNMENT",
    count: 24,
  },
  {
    id: 2,
    name: "SHEIKH HASINA WAZED",
    matchedAlias: "HASINA WAZED, Sheikh\nDuplicate Entry",
    matchStrength: 91,
    matchStrengthColor: "red",
    types: [{ label: "PEP", color: "bg-green-500" }],
    gender: "Female",
    dateOfBirth: "28-Sep-1947",
    placeOfBirth: "Tungipara",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "FORMER HEAD OF GOVERNMENT",
    count: 12,
  },
  {
    id: 3,
    name: "HASINA WAJED",
    matchedAlias: "WAJED, Hasina\nAlias",
    matchStrength: 88,
    matchStrengthColor: "red",
    types: [
      { label: "PEP", color: "bg-green-500" },
      { label: "SAN", color: "bg-purple-500" },
    ],
    gender: "Female",
    dateOfBirth: "28-Sep-1947",
    placeOfBirth: "Gopalganj, Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh / India",
    category: "SANCTIONS - FINANCIAL RESTRICTIONS",
    count: 18,
  },
  {
    id: 4,
    name: "SHEIKH HASINA",
    matchedAlias: "HASINA, S.\nShort Alias",
    matchStrength: 82,
    matchStrengthColor: "red",
    types: [
      { label: "PEP", color: "bg-green-500" },
      { label: "SAN", color: "bg-purple-500" },
    ],
    gender: "Female",
    dateOfBirth: "28-Sep-1947",
    placeOfBirth: "Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "POLITICAL EXPOSURE",
    count: 15,
  },
  {
    id: 5,
    name: "SHAIKH HASINA",
    matchedAlias: "HASINA, Shaikh\nAlternate Spelling",
    matchStrength: 76,
    matchStrengthColor: "orange",
    types: [{ label: "PEP", color: "bg-green-500" }],
    gender: "Female",
    dateOfBirth: "28-Sep-1947",
    placeOfBirth: "Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "POLITICAL EXPOSURE",
    count: 8,
  },
  {
    id: 6,
    name: "HASINA BEGUM SHEIKH",
    matchedAlias: "BEGUM, Hasina Sheikh\nAlias",
    matchStrength: 71,
    matchStrengthColor: "orange",
    types: [{ label: "SIC", color: "bg-orange-500" }],
    gender: "Female",
    dateOfBirth: "15-Mar-1952",
    placeOfBirth: "Dhaka, Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "INDIRECT WATCHLIST",
    count: 6,
  },
  {
    id: 7,
    name: "SHEIKH REHANA",
    matchedAlias: "REHANA, Sheikh\nRelated Party",
    matchStrength: 64,
    matchStrengthColor: "orange",
    types: [
      { label: "PEP", color: "bg-green-500" },
      { label: "SIC", color: "bg-orange-500" },
    ],
    gender: "Female",
    dateOfBirth: "13-Sep-1955",
    placeOfBirth: "Bangladesh",
    citizenship: "Bangladesh / United Kingdom",
    countryLocation: "United Kingdom",
    category: "RELATIVE OF PEP",
    count: 5,
  },
  {
    id: 8,
    name: "SAJEEB WAZED JOY",
    matchedAlias: "WAZED, Sajeeb Joy\nChild of PEP",
    matchStrength: 58,
    matchStrengthColor: "orange",
    types: [{ label: "PEP", color: "bg-green-500" }],
    gender: "Male",
    dateOfBirth: "27-Jul-1971",
    placeOfBirth: "Dhaka, Bangladesh",
    citizenship: "Bangladesh / United States",
    countryLocation: "United States",
    category: "CHILD OF PEP",
    count: 4,
  },
  {
    id: 9,
    name: "HASINA KHATUN",
    matchedAlias: "KHATUN, Hasina\nName Match",
    matchStrength: 48,
    matchStrengthColor: "green",
    types: [{ label: "LE", color: "bg-blue-500" }],
    gender: "Female",
    dateOfBirth: "05-Jan-1965",
    placeOfBirth: "Sylhet, Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "LOW RISK",
    count: 2,
  },
  {
    id: 10,
    name: "HASINA BEGUM",
    matchedAlias: "BEGUM, Hasina\nCommon Name",
    matchStrength: 43,
    matchStrengthColor: "green",
    types: [{ label: "LE", color: "bg-blue-500" }],
    gender: "Female",
    dateOfBirth: "12-Jun-1970",
    placeOfBirth: "Chittagong, Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "LOW RISK",
    count: 1,
  },
  {
    id: 11,
    name: "WAJED MIAH",
    matchedAlias: "MIAH, Wajed\nSpouse (Deceased)",
    matchStrength: 38,
    matchStrengthColor: "green",
    types: [{ label: "SIC", color: "bg-orange-500" }],
    gender: "Male",
    dateOfBirth: "16-Feb-1942",
    placeOfBirth: "Bangladesh",
    citizenship: "Bangladesh",
    countryLocation: "Bangladesh",
    category: "RELATED PARTY",
    count: 2,
  },
  {
    id: 12,
    name: "HASENA SHIEK",
    matchedAlias: "SHIEK, Hasena\nTypo Variant",
    matchStrength: 35,
    matchStrengthColor: "green",
    types: [{ label: "LE", color: "bg-blue-500" }],
    gender: "Female",
    dateOfBirth: "Unknown",
    placeOfBirth: "Unknown",
    citizenship: "Bangladesh",
    countryLocation: "Unknown",
    category: "LOW RISK",
    count: 1,
  },
];

const mockLinkedCases = [
  {
    id: 1,
    caseName: "Sitara Ahmadi",
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
  const [openMatchDetail, setOpenMatchDetail] = useState(false);
  const [resolutions, setResolutions] = useState({});

  const handleMatchClick = (index) => {
    setSelectedMatchIndex(index);
    setOpenMatchDetail(true);
  };

  const handleResolve = (matchId, type, metadata = {}) => {
    setResolutions((prev) => ({ ...prev, [matchId]: { type, ...metadata } }));
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
      <div className="w-48  border-r border-slate-200 p-4 shrink-0">
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
        <div className=" border-b border-slate-200 px-4 py-2 flex items-center justify-between">
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
        {/* <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className=" sticky top-0 z-10">
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
              <tr className="border-b border-slate-200 ">
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
                  className="border-b border-slate-100 hover: transition-colors "
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
        </div> */}
        <CustomResizableTable
          columns={linkedCasesColumns}
          data={mockLinkedCases}
          tableId="pep-screening-linked-cases"
          mainClass="pep-screening-linked-cases"
        />
      </div>
    </div>
  );

  const matchedCasesColumns = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row, index }) => (
        <div onClick={() => handleMatchClick(index)} className="group">
          <p className="text-slate-800 font-semibold group-hover:underline cursor-pointer">
            {row.original.name}
          </p>
          <div className="text-muted-foreground text-xs whitespace-pre-line">
            {row?.original.matchedAlias}
          </div>
        </div>
      ),
    },
    // {
    //   id: "matchedAlias",
    //   header: "Matched Alias",
    //   accessorKey: "matchedAlias",
    // },
    {
      id: "matchStrength",
      header: "Match",
      accessorKey: "matchStrength",
      cell: ({ row }) => (
        <div className="text-end flex items-center gap-1 border rounded-full w-max px-2 py-1">
          {getMatchStrengthBar(row.original.matchStrength, row.original.matchStrengthColor)}
          <span className="text-xs text-muted-foreground">{row.original.matchStrength}</span>
        </div>
      ),
    },
    {
      id: "types",
      header: "Type",
      accessorKey: "types.label",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.types.map((type) => (
            <span
              key={type.label}
              className={cn("px-1.5 py-0.5 rounded text-xs font-medium text-white", type.color)}
            >
              {type.label}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "gender",
      header: "Gender",
      accessorKey: "gender",
      cell: ({ row }) => (
        <div className="text-center">
          <span className=" text-muted-foreground">{row.original.gender}</span>
        </div>
      ),
    },
    {
      id: "dateOfBirth",
      header: "Place & Date of Birth",
      accessorKey: "dateOfBirth",
      cell: ({ row }) => (
        <div className="text-center flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.dateOfBirth}
          </span>
          <span className=" text-smoke-600 font-semibold">{row.original.placeOfBirth}</span>
        </div>
      ),
    },
    // {
    //   id: "placeOfBirth",
    //   header: "Place of Birth",
    //   accessorKey: "placeOfBirth",
    //   cell: ({ row }) => (
    //     <div className="text-center">
    //       <span className="text-xs text-muted-foreground">{row.original.placeOfBirth}</span>
    //     </div>
    //   ),
    // },
    {
      id: "citizenship",
      header: "Citizenship",
      accessorKey: "citizenship",
      cell: ({ row }) => (
        <div className="text-center">
          <span className=" text-muted-foreground">{row.original.citizenship}</span>
        </div>
      ),
    },
    // {
    //   id: "countryLocation",
    //   header: "Country Location",
    //   accessorKey: "countryLocation",
    //   cell: ({ row }) => (
    //     <div className="text-center">
    //       <span className="text-xs text-muted-foreground">{row.original.countryLocation}</span>
    //     </div>
    //   ),
    // },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <div className="text-center">
          <span className="text-xs text-muted-foreground">{row.original.category}</span>
        </div>
      ),
    },
    {
      id: "resolution",
      header: "Resolution",
      accessorKey: "resolution",
      cell: ({ row }) => {
        const res = resolutions[row.original.id];
        if (!res)
          return <span className="text-xs text-slate-400 italic">Unresolved</span>;
        if (res.type === "false_positive")
          return (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              False Positive
            </span>
          );
        return (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Confirmed
          </span>
        );
      },
      size: 120,
    },
  ];

  const linkedCasesColumns = [
    {
      id: "caseName",
      header: "Case Name",
      accessorKey: "caseName",
      cell: ({ row }) => (
        <div className="text-slate-800 font-semibold">{row.original.caseName}</div>
      ),
    },
    {
      id: "relationship",
      header: "Relationship",
      accessorKey: "relationship",
    },
    {
      id: "caseId",
      header: "Case ID",
      accessorKey: "caseId",
      cell: ({ row }) => <div className="text-slate-600">{row.original.caseId}</div>,
    },
    {
      id: "mandatoryActions",
      header: "Mandatory Actions",
      accessorKey: "mandatoryActions",
      cell: ({ row }) => <div className="text-slate-600">{row.original.mandatoryActions}</div>,
    },
    {
      id: "unresolved",
      header: "Unresolved",
      accessorKey: "unresolved",
      cell: ({ row }) => <div className="text-slate-600">{row.original.unresolved}</div>,
    },
    {
      id: "reviewRequired",
      header: "Review Required",
      accessorKey: "reviewRequired",
      cell: ({ row }) => <div className="text-slate-600">{row.original.reviewRequired}</div>,
    },
    {
      id: "ongoingScreening",
      header: "Ongoing Screening",
      accessorKey: "ongoingScreening",
      cell: ({ row }) => (
        <div className="text-slate-600">{row.original.ongoingScreening ? "Yes" : "No"}</div>
      ),
    },
    {
      id: "archived",
      header: "Archived",
      accessorKey: "archived",
      cell: ({ row }) => (
        <div className="text-slate-600">{row.original.archived ? "Yes" : "No"}</div>
      ),
    },
  ];

  const renderWorldCheckTab = () => (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {/* <table className="w-full text-sm">
            <thead className=" sticky top-0 z-10">
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
                    "border-b border-slate-100 hover: transition-colors",
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
                    className="px-3 py-2  hover:underline cursor-pointer font-medium"
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
          </table> */}
          <CustomResizableTable
            columns={matchedCasesColumns}
            data={mockMatches}
            tableId="pep-screening-matched-cases"
            mainClass="pep-screening-matched-cases"
          />
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

  const toggleMatchDetail = () => {
    setOpenMatchDetail(!openMatchDetail);
  };

  return (
    <div className="h-full flex flex-col ">
      {/* Case Header */}
      <div className="   py-3 flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1 text-primary bg-smoke-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white py-2  flex items-center gap-1">
        <button
          onClick={() => setActiveTab("world-check")}
          className={cn(
            "px-4 py-2 text-sm font-medium flex items-center gap-2  transition-colors rounded-md",
            activeTab === "world-check"
              ? "bg-primary text-white"
              : "border-transparent text-slate-600 hover:text-slate-800 hover:",
          )}
        >
          <Search className="h-4 w-4" />
          Dooit
          <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded">348</span>
        </button>
        <button
          onClick={() => setActiveTab("linked-cases")}
          className={cn(
            "px-4 py-2 text-sm font-medium flex items-center gap-2  transition-colors rounded-md",
            activeTab === "linked-cases"
              ? "bg-primary text-white"
              : "border-transparent text-slate-600 hover:text-slate-800 hover:",
          )}
        >
          <Link2 className="h-4 w-4" />
          LINKED CASES
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
          open={openMatchDetail}
          onOpenChange={toggleMatchDetail}
          resolution={resolutions[mockMatches[selectedMatchIndex]?.id]}
          onResolve={(type, metadata) =>
            handleResolve(mockMatches[selectedMatchIndex]?.id, type, metadata)
          }
        />
      )}
    </div>
  );
}
