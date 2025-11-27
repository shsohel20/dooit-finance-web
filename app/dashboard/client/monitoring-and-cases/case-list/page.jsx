"use client";
import CustomDatatable from "@/components/CustomDatatable";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconDotsVertical,
  IconEye,
  IconGridDots,
  IconList,
  IconPennant,
  IconSearch,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getCaseList } from "./actions";
import ResizableTable from "@/components/ui/Resizabletable";
import { ArrowRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const cases = [
  {
    caseId: "#CA-1234567890",
    name: "John Doe",
    risk: "High",
    alertType: "Transaction Monitoring",
    status: "Pending",
    assignedAnalyst: "Peter Parker",
    lastUpdated: "12/08/2025",
  },
  {
    caseId: "#CA-1234567891",
    name: "Jane Smith",
    risk: "Medium",
    alertType: "KYC Review",
    status: "Approved",
    assignedAnalyst: "Tony Stark",
    lastUpdated: "11/08/2025",
  },
  {
    caseId: "#CA-1234567892",
    name: "Michael Johnson",
    risk: "Low",
    alertType: "Sanctions Screening",
    status: "Rejected",
    assignedAnalyst: "Natasha Romanoff",
    lastUpdated: "10/08/2025",
  },
  {
    caseId: "#CA-1234567893",
    name: "Emily Davis",
    risk: "High",
    alertType: "Transaction Monitoring",
    status: "Pending",
    assignedAnalyst: "Steve Rogers",
    lastUpdated: "09/08/2025",
  },
  {
    caseId: "#CA-1234567894",
    name: "Robert Brown",
    risk: "Medium",
    alertType: "AML Alert",
    status: "In Review",
    assignedAnalyst: "Bruce Banner",
    lastUpdated: "08/08/2025",
  },
  {
    caseId: "#CA-1234567895",
    name: "Laura Wilson",
    risk: "High",
    alertType: "KYC Review",
    status: "Pending",
    assignedAnalyst: "Wanda Maximoff",
    lastUpdated: "07/08/2025",
  },
  {
    caseId: "#CA-1234567896",
    name: "James Anderson",
    risk: "Low",
    alertType: "Sanctions Screening",
    status: "Approved",
    assignedAnalyst: "Clint Barton",
    lastUpdated: "06/08/2025",
  },
  {
    caseId: "#CA-1234567897",
    name: "Sarah Martinez",
    risk: "Medium",
    alertType: "Transaction Monitoring",
    status: "Rejected",
    assignedAnalyst: "Scott Lang",
    lastUpdated: "05/08/2025",
  },
  {
    caseId: "#CA-1234567898",
    name: "William Garcia",
    risk: "High",
    alertType: "KYC Review",
    status: "Pending",
    assignedAnalyst: "Peter Parker",
    lastUpdated: "04/08/2025",
  },
  {
    caseId: "#CA-1234567899",
    name: "Olivia Rodriguez",
    risk: "Low",
    alertType: "AML Alert",
    status: "Approved",
    assignedAnalyst: "Tony Stark",
    lastUpdated: "03/08/2025",
  },
  {
    caseId: "#CA-1234567900",
    name: "Daniel Lee",
    risk: "High",
    alertType: "Transaction Monitoring",
    status: "In Review",
    assignedAnalyst: "Steve Rogers",
    lastUpdated: "02/08/2025",
  },
  {
    caseId: "#CA-1234567901",
    name: "Sophia Perez",
    risk: "Medium",
    alertType: "Sanctions Screening",
    status: "Pending",
    assignedAnalyst: "Natasha Romanoff",
    lastUpdated: "01/08/2025",
  },
  {
    caseId: "#CA-1234567902",
    name: "David Thompson",
    risk: "Low",
    alertType: "KYC Review",
    status: "Approved",
    assignedAnalyst: "Bruce Banner",
    lastUpdated: "30/07/2025",
  },
  {
    caseId: "#CA-1234567903",
    name: "Ella White",
    risk: "High",
    alertType: "AML Alert",
    status: "Rejected",
    assignedAnalyst: "Wanda Maximoff",
    lastUpdated: "29/07/2025",
  },
  {
    caseId: "#CA-1234567904",
    name: "Henry Harris",
    risk: "Medium",
    alertType: "Transaction Monitoring",
    status: "In Review",
    assignedAnalyst: "Clint Barton",
    lastUpdated: "28/07/2025",
  },
  {
    caseId: "#CA-1234567905",
    name: "Grace Clark",
    risk: "Low",
    alertType: "Sanctions Screening",
    status: "Pending",
    assignedAnalyst: "Scott Lang",
    lastUpdated: "27/07/2025",
  },
  {
    caseId: "#CA-1234567906",
    name: "Christopher Lewis",
    risk: "High",
    alertType: "KYC Review",
    status: "Approved",
    assignedAnalyst: "Peter Parker",
    lastUpdated: "26/07/2025",
  },
  {
    caseId: "#CA-1234567907",
    name: "Victoria Walker",
    risk: "Medium",
    alertType: "AML Alert",
    status: "Rejected",
    assignedAnalyst: "Tony Stark",
    lastUpdated: "25/07/2025",
  },
  {
    caseId: "#CA-1234567908",
    name: "Benjamin Hall",
    risk: "Low",
    alertType: "Transaction Monitoring",
    status: "Pending",
    assignedAnalyst: "Steve Rogers",
    lastUpdated: "24/07/2025",
  },
  {
    caseId: "#CA-1234567909",
    name: "Mia Allen",
    risk: "High",
    alertType: "Sanctions Screening",
    status: "In Review",
    assignedAnalyst: "Natasha Romanoff",
    lastUpdated: "23/07/2025",
  },
  {
    caseId: "#CA-1234567910",
    name: "Jack Young",
    risk: "Medium",
    alertType: "KYC Review",
    status: "Approved",
    assignedAnalyst: "Bruce Banner",
    lastUpdated: "22/07/2025",
  },
  {
    caseId: "#CA-1234567911",
    name: "Ava Hernandez",
    risk: "Low",
    alertType: "AML Alert",
    status: "Pending",
    assignedAnalyst: "Wanda Maximoff",
    lastUpdated: "21/07/2025",
  },
  {
    caseId: "#CA-1234567912",
    name: "Lucas King",
    risk: "High",
    alertType: "Transaction Monitoring",
    status: "In Review",
    assignedAnalyst: "Clint Barton",
    lastUpdated: "20/07/2025",
  },
  {
    caseId: "#CA-1234567913",
    name: "Chloe Scott",
    risk: "Medium",
    alertType: "Sanctions Screening",
    status: "Rejected",
    assignedAnalyst: "Scott Lang",
    lastUpdated: "19/07/2025",
  },
  {
    caseId: "#CA-1234567914",
    name: "Matthew Green",
    risk: "Low",
    alertType: "KYC Review",
    status: "Approved",
    assignedAnalyst: "Peter Parker",
    lastUpdated: "18/07/2025",
  },
  {
    caseId: "#CA-1234567915",
    name: "Isabella Adams",
    risk: "High",
    alertType: "AML Alert",
    status: "Pending",
    assignedAnalyst: "Tony Stark",
    lastUpdated: "17/07/2025",
  },
  {
    caseId: "#CA-1234567916",
    name: "Ethan Baker",
    risk: "Medium",
    alertType: "Transaction Monitoring",
    status: "Approved",
    assignedAnalyst: "Steve Rogers",
    lastUpdated: "16/07/2025",
  },
  {
    caseId: "#CA-1234567917",
    name: "Amelia Gonzalez",
    risk: "Low",
    alertType: "Sanctions Screening",
    status: "Rejected",
    assignedAnalyst: "Natasha Romanoff",
    lastUpdated: "15/07/2025",
  },
  {
    caseId: "#CA-1234567918",
    name: "Jacob Nelson",
    risk: "High",
    alertType: "KYC Review",
    status: "In Review",
    assignedAnalyst: "Bruce Banner",
    lastUpdated: "14/07/2025",
  },
  {
    caseId: "#CA-1234567919",
    name: "Charlotte Carter",
    risk: "Medium",
    alertType: "AML Alert",
    status: "Pending",
    assignedAnalyst: "Wanda Maximoff",
    lastUpdated: "13/07/2025",
  },
];

const ListView = ({ data, loading }) => {
  const router = useRouter();
  const riskVariants = {
    Low: "info",
    Medium: "warning",
    High: "danger",
  };
  const statusVariants = {
    Pending: "outline",
    Approved: "success",
    Rejected: "danger",
    "In Review": "warning",
  };
  const columns = [
    {
      header: "Actions",
      cell: ({ row }) => (
        <>
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  // size="sm"
                  className="!py-2 h-auto "
                >
                  <IconDotsVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/dashboard/client/monitoring-and-cases/case-list/details/${row?.original?._id}`
                    )
                  }
                >
                  <IconEye className="mr-2 size-3 text-muted-foreground/70" />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ),
    },
    {
      header: "Case ID",
      accessorKey: "uid",
    },

    {
      header: "Transaction",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="">{row?.original?.transaction?.sender?.name}</p>
            <p className="text-muted-foreground text-xs">
              {row?.original?.transaction?.sender?.account}
            </p>
          </div>
          <span>
            <ArrowRight className="size-4 text-green-500" />
          </span>
          <div>
            <p className="">{row?.original?.transaction?.receiver?.name}</p>
            <p className="text-muted-foreground text-xs">
              {row?.original?.transaction?.receiver?.account}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Transaction Amount",
      accessorKey: "transaction.amount",
      cell: ({ row }) => (
        <div>
          <p className="text-end">{row?.original?.transaction?.amount}</p>
        </div>
      ),
    },
    {
      header: "Transaction Date",
      accessorKey: "transaction.timestamp",
      cell: ({ row }) => (
        <div>
          <p className="text-end">
            {formatDateTime(row?.original?.transaction?.timestamp)?.date}
          </p>
          <p className="text-muted-foreground text-xs text-end">
            {formatDateTime(row?.original?.transaction?.timestamp)?.time}
          </p>
        </div>
      ),
    },
    {
      header: "Analyst",
      accessorKey: "analyst.name",
    },
    {
      header: "Risk",
      accessorKey: "risk",
      cell: ({ row }) => (
        <StatusPill
          icon={<IconPennant />}
          variant={riskVariants[row?.original?.riskLabel]}
        >
          {row?.original?.riskLabel}
        </StatusPill>
      ),
    },
    {
      header: "Alert Type",
      accessorKey: "caseType",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <StatusPill variant={statusVariants[row.original.status]} i>
          {row.original.status}
        </StatusPill>
      ),
    },
  ];
  return (
    <div>
      <ResizableTable data={data} columns={columns} loading={loading} />
    </div>
  );
};
export default function CaseList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCaseList();
        console.log("response", response);
        setData(response?.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between bg-white shadow-sm rounded-md p-4">
        <div className="flex items-center gap-2  ">
          <InputGroup className={"max-w-64"}>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="ID" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Name" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <ButtonGroup>
            <Button
              variant="outline"
              // onClick={() => setView("grid")}
              // variant={view === "grid" ? "default" : "outline"}
            >
              <IconGridDots />
            </Button>
            <Button
              variant="outline"
              // variant={view === "list" ? "default" : "outline"}
              // onClick={() => setView("list")}
            >
              <IconList />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <ListView data={data} loading={loading} />
    </div>
  );
}
