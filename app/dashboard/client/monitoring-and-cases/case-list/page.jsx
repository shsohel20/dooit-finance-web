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
  IconFile,
  IconFilePlus,
  IconGridDots,
  IconList,
  IconPencil,
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
import CustomPagination from "@/components/CustomPagination";
import { useAlertStore } from "@/app/store/useAlertStore";

const ListView = ({}) => {
  const {
    alerts,
    fetching,
    totalItems,
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
  } = useAlertStore();
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
  const handleEdit = (caseNumber) => {
    // console.log("caseNumber", caseNumber);
    router.push(
      `/dashboard/client/report-compliance/ecdd/form?caseNumber=${caseNumber}`
    );
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
                <DropdownMenuItem
                  onClick={() => handleEdit(row?.original?.uid)}
                >
                  <IconFilePlus className="mr-2 size-3 " />
                  Generate ECDD
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
  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleLimitChange = (limit) => {
    setLimit(limit);
    setCurrentPage(1);
  };
  return (
    <div>
      <ResizableTable data={alerts} columns={columns} loading={fetching} />
      <CustomPagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        limit={limit}
        onChangeLimit={handleLimitChange}
      />
    </div>
  );
};
export default function CaseList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentPage, limit, setAlerts, setFetching, setTotalItems } =
    useAlertStore();

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const queryParams = {
          page: currentPage,
          limit: limit,
        };
        const response = await getCaseList(queryParams);

        setAlerts(response?.data);
        setTotalItems(response?.totalRecords);
      } catch (error) {
        console.error("Failed to get data", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [currentPage, limit]);

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
      <ListView />
    </div>
  );
}
