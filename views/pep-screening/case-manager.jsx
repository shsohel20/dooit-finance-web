"use client";

import { useEffect, useState } from "react";
import { cn, riskLevelVariants } from "@/lib/utils";
import { CaseDetails } from "./case-details";
import ResizableTable from "@/components/ui/Resizabletable";
import { getCustomers } from "@/app/dashboard/client/onboarding/customer-queue/actions";

import { StatusPill } from "@/components/ui/StatusPill";
import { IconPennant } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

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

export function CaseManager({ formData = null }) {
  const [selectedCases, setSelectedCases] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [fetching, setFetching] = useState(false);
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

  const fetchCustomers = async () => {
    setFetching(true);
    const queryParams = {
      page: 1,
      limit: 10,
    };
    try {
      const response = await getCustomers(queryParams);
      console.log("customers", response.data);
      setCases(response.data);
    } catch (error) {
      console.error("Failed to get customers", error);
    } finally {
      setFetching(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

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
  const columns = [
    {
      id: "caseId",
      header: "Case ID",
      accessorKey: "uid",
      cell: ({ row }) => (
        <div className="" onClick={() => handleCaseClick(row.original)}>
          <p className="capitalize font-bold cursor-pointer hover:underline">
            {row?.original?.personalKyc?.personal_form?.customer_details?.given_name}{" "}
            {row?.original?.personalKyc?.personal_form?.customer_details?.middle_name}{" "}
            {row?.original?.personalKyc?.personal_form?.customer_details?.surname}
          </p>
          <p className="text-sm text-muted-foreground">{row?.original?._id}</p>
        </div>
      ),
      size: 100,
    },

    {
      id: "linkedCases",
      header: "Linked Cases",
      accessorKey: "linkedCases",
      cell: ({ row }) => (
        <div>
          <p className="font-mono text-end text-muted-foreground">
            {row?.original?.linkedCases || 10}
          </p>
        </div>
      ),
      size: 100,
    },
    // {
    //   id: "type",
    //   header: "Case Type",
    //   accessorKey: "type",
    //   cell: ({ row }) => (
    //     <div>
    //       <p className="">{row?.original?.caseType}</p>
    //     </div>
    //   ),
    //   size: 100,
    // },
    // {
    //   id: "caseRating",
    //   header: "Case Rating",
    //   accessorKey: "caseRating",
    //   cell: ({ row }) => (
    //     <StatusPill icon={<IconPennant />} variant={riskLevelVariants[row?.original?.riskLabel]}>
    //       {row?.original?.riskLabel}
    //     </StatusPill>
    //   ),
    //   size: 100,
    // },

    {
      id: "mandatoryActions",
      header: "Actions Required",
      accessorKey: "mandatoryActions",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.mandatoryActions || 0}</p>
        </div>
      ),
    },
    {
      id: "unresolved",
      header: "Unresolved",
      accessorKey: "unresolved",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.unresolved || 0}</p>
        </div>
      ),
      size: 100,
    },
    {
      id: "reviewRequired",
      header: "Review",
      accessorKey: "reviewRequired",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.reviewRequired || 0}</p>
        </div>
      ),
      size: 100,
    },
    {
      id: "ongoingScreening",
      header: "Ongoing Screening",
      accessorKey: "ongoingScreening",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">
            {row?.original?.ongoingScreening ? "Yes" : "No"}
          </p>
        </div>
      ),
    },
    {
      id: "archived",
      header: "Archived",
      accessorKey: "archived",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.archived ? "Yes" : "No"}</p>
        </div>
      ),
    },
    {
      id: "assignee",
      header: "Assignee",
      accessorKey: "assignee",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.assignee || "N/A"}</p>
        </div>
      ),
    },
    {
      id: "lastModifiedBy",
      header: "Last Updated By",
      accessorKey: "lastModifiedBy",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.analyst?.name || "N/A"}</p>
        </div>
      ),
    },
    {
      id: "lastModifiedDateUser",
      header: "Last Modified Date - User",
      accessorKey: "lastModifiedDateUser",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.analyst?.name || "N/A"}</p>
        </div>
      ),
    },
    {
      id: "lastModifiedDateOGS",
      header: "Last Modified Date - OGS",
      accessorKey: "lastModifiedDateOGS",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.analyst?.name || "N/A"}</p>
        </div>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      accessorKey: "createdBy",
      cell: ({ row }) => (
        <div>
          <p className="text-end text-muted-foreground">{row?.original?.analyst?.name || "N/A"}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="  ">
      {/* Case Manager Header */}
      {/* filter and search */}
      <div className="flex gap-2">
        <Input type="text" placeholder="Search" />
        <Input type="text" placeholder="Case ID" />
      </div>
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <CustomResizableTable
          columns={columns}
          data={cases}
          tableId="pep-screening-case-manager"
          loading={fetching}
          mainClass="pep-screening-case-manager"
        />
      </div>
    </div>
  );
}
