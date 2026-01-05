"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Download,
  Search,
  RefreshCw,
  Columns3,
  ChevronDown,
  User,
  MoreVertical,
  FolderOpen,
} from "lucide-react";
import { CaseDetails } from "./case-details";

const mockCases = [
  {
    id: 1,
    caseName: "YANG XU",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300208",
    mandatoryActions: 352,
    unresolved: 352,
    reviewRequired: 348,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "17-Jun-2025 22:47",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 2,
    caseName: "JUN WANG",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300243",
    mandatoryActions: 348,
    unresolved: 348,
    reviewRequired: 348,
    ongoingScreening: false,
    archived: true,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "18-Jun-2025 18:01",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 3,
    caseName: "Wei Li",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300350",
    mandatoryActions: 328,
    unresolved: 328,
    reviewRequired: 328,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "17-Jun-2025 21:31",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 4,
    caseName: "LI SHEN",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300360",
    mandatoryActions: 311,
    unresolved: 311,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:29",
    lastModifiedDateOGS: "12-Jun-2025 20:31",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 5,
    caseName: "wei zhang",
    linkedCases: 0,
    caseRating: "High",
    caseId: "5jb7icomkIiw1it55aq5Ici...",
    mandatoryActions: 309,
    unresolved: 308,
    reviewRequired: 1,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Mohammad Hossain",
    lastModifiedDateUser: "05-Feb-2025 05:16",
    lastModifiedDateOGS: "25-Jan-2025 23:29",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 6,
    caseName: "LIN HUANG",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300242",
    mandatoryActions: 286,
    unresolved: 286,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "14-Jun-2025 19:52",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 7,
    caseName: "Tian Li",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300257",
    mandatoryActions: 285,
    unresolved: 285,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "27-May-2025 21:14",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 8,
    caseName: "Shufeng Wang",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300315",
    mandatoryActions: 281,
    unresolved: 281,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "26-Apr-2025 20:34",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 9,
    caseName: "Xueping Wang",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300249",
    mandatoryActions: 265,
    unresolved: 265,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "09-May-2025 21:01",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 10,
    caseName: "JUN ZHANG",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300331",
    mandatoryActions: 259,
    unresolved: 259,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "10-Jun-2025 22:20",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 11,
    caseName: "Xiaomeng Zhang",
    linkedCases: 0,
    caseRating: "Medium",
    caseId: "CXP2300338",
    mandatoryActions: 213,
    unresolved: 213,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "29-Apr-2025 19:21",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 12,
    caseName: "Yunqing Li",
    linkedCases: 0,
    caseRating: "Medium",
    caseId: "CXP2300328",
    mandatoryActions: 210,
    unresolved: 210,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "17-Jun-2025 21:45",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 13,
    caseName: "FENGYING WANG",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300204",
    mandatoryActions: 207,
    unresolved: 207,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "26-Apr-2025 20:17",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 14,
    caseName: "Yang Liu",
    linkedCases: 0,
    caseRating: "Medium",
    caseId: "5jb7yyukoh43b1isyav0g...",
    mandatoryActions: 197,
    unresolved: 197,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Mohammad Hossain",
    lastModifiedDateUser: "05-Feb-2025 05:16",
    lastModifiedDateOGS: "01-Jan-2025 04:57",
    createdBy: "Mohammad Hossain",
  },
  {
    id: 15,
    caseName: "YUE SUN",
    linkedCases: 0,
    caseRating: "High",
    caseId: "CXP2300161",
    mandatoryActions: 195,
    unresolved: 195,
    reviewRequired: 0,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "Michael Sapolu",
    lastModifiedDateUser: "19-Jun-2025 04:28",
    lastModifiedDateOGS: "22-May-2025 18:44",
    createdBy: "Mohammad Hossain",
  },
];

export function CaseManager() {
  const [selectedCases, setSelectedCases] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCases([]);
    } else {
      setSelectedCases(mockCases.map((c) => c.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCase = (id) => {
    if (selectedCases.includes(id)) {
      setSelectedCases(selectedCases.filter((cId) => cId !== id));
    } else {
      setSelectedCases([...selectedCases, id]);
    }
  };

  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem);
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

  if (selectedCase) {
    return <CaseDetails caseData={selectedCase} onBack={() => setSelectedCase(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Case Manager Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-slate-600" />
            <span className="text-sm text-slate-500">CASE MANAGER</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-slate-700">
                  Default view <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Default view</DropdownMenuItem>
                <DropdownMenuItem>High Risk Cases</DropdownMenuItem>
                <DropdownMenuItem>Unresolved Only</DropdownMenuItem>
                <DropdownMenuItem>My Cases</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              <Columns3 className="h-4 w-4" />
              COLUMNS
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Filter className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              EXPORT <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2 text-left w-10">
                <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-2 py-2 text-left w-10 text-slate-500 font-medium"></th>
              <th className="px-2 py-2 text-left w-8"></th>
              <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">
                Case Name
              </th>
              <th className="px-3 py-2 text-center text-slate-600 font-medium w-20">
                Linked
                <br />
                Cases
              </th>
              <th className="px-3 py-2 text-center text-slate-600 font-medium w-24">Case Rating</th>
              <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">ID</th>
              <th className="px-3 py-2 text-center text-slate-600 font-medium w-24">
                Mandatory
                <br />
                Actions
              </th>
              <th className="px-1 py-2 text-center text-slate-500 font-medium text-xs" colSpan={2}>
                World-Check - Summary
              </th>
              <th className="px-3 py-2 text-center text-slate-600 font-medium w-24">
                Ongoing
                <br />
                Screening
              </th>
              <th className="px-3 py-2 text-center text-slate-600 font-medium w-20">Archived</th>
              <th className="px-3 py-2 text-center text-slate-600 font-medium w-24">Assignee</th>
              <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[130px]">
                Last Modified By
              </th>
              <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">
                Last Modified Date -<br />
                User
              </th>
              <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">
                Last Modified Date -<br />
                OGS
              </th>
              <th className="px-3 py-2 text-left text-slate-600 font-medium min-w-[140px]">
                Created By
              </th>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th colSpan={8}></th>
              <th className="px-2 py-1 text-center text-slate-500 font-medium text-xs bg-red-50">
                Unresolved
              </th>
              <th className="px-2 py-1 text-center text-slate-500 font-medium text-xs">
                Review
                <br />
                Required
              </th>
              <th colSpan={7}></th>
            </tr>
          </thead>
          <tbody>
            {mockCases.map((caseItem, index) => (
              <tr
                key={caseItem.id}
                className={cn(
                  "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  selectedCases.includes(caseItem.id) && "bg-blue-50",
                )}
              >
                <td className="px-3 py-2">
                  <Checkbox
                    checked={selectedCases.includes(caseItem.id)}
                    onCheckedChange={() => handleSelectCase(caseItem.id)}
                  />
                </td>
                <td className="px-2 py-2 text-slate-500 text-xs">{index + 1}</td>
                <td className="px-2 py-2">
                  <User className="h-4 w-4 text-slate-400" />
                </td>
                <td
                  className="px-3 py-2 font-medium text-blue-600 hover:underline cursor-pointer"
                  onClick={() => handleCaseClick(caseItem)}
                >
                  {caseItem.caseName}
                </td>
                <td className="px-3 py-2 text-center text-slate-600">{caseItem.linkedCases}</td>
                <td className="px-3 py-2 text-center">{getRatingBadge(caseItem.caseRating)}</td>
                <td className="px-3 py-2 text-slate-600 font-mono text-xs">{caseItem.caseId}</td>
                <td className="px-3 py-2 text-center text-slate-600">
                  {caseItem.mandatoryActions}
                </td>
                <td className="px-2 py-2 text-center">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                    {caseItem.unresolved}
                  </span>
                </td>
                <td className="px-2 py-2 text-center text-slate-600">{caseItem.reviewRequired}</td>
                <td className="px-3 py-2 text-center">
                  <Checkbox checked={caseItem.ongoingScreening} disabled />
                </td>
                <td className="px-3 py-2 text-center">
                  <Checkbox checked={caseItem.archived} disabled />
                </td>
                <td className="px-3 py-2 text-center">
                  {caseItem.assignee ? (
                    <span className="flex items-center justify-center gap-1">
                      <User className="h-3 w-3" />
                      {caseItem.assignee}
                    </span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="px-3 py-2 text-slate-600">{caseItem.lastModifiedBy}</td>
                <td className="px-3 py-2 text-slate-500 text-xs">
                  {caseItem.lastModifiedDateUser}
                </td>
                <td className="px-3 py-2 text-slate-500 text-xs">{caseItem.lastModifiedDateOGS}</td>
                <td className="px-3 py-2 text-slate-600">{caseItem.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
