"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconCircleDottedLetterE,
  IconDotsVertical,
  IconEye,
  IconFile,
  IconFilePlus,
  IconGridDots,
  IconLetterE,
  IconLetterESmall,
  IconLetterRSmall,
  IconLetterSSmall,
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
import CustomPagination from "@/components/CustomPagination";
import { useAlertStore } from "@/app/store/useAlertStore";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, AlertTriangle } from "lucide-react";
import { CaseRequestForm } from "@/views/monitoring-and-cases/case-details/ecdd/RFIForm";

const ListView = ({}) => {
  const { alerts, fetching, totalItems, currentPage, limit, setCurrentPage, setLimit } =
    useAlertStore();
  const [caseNumber, setCaseNumber] = useState(null);
  const [openRfi, setOpenRfi] = useState(false);
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
  const handleGenerateEcdd = (caseNumber) => {
    // console.log("caseNumber", caseNumber);
    router.push(`/dashboard/client/report-compliance/ecdd/form?caseNumber=${caseNumber}`);
  };
  const handleGenerateSmr = (data) => {
    router.push(
      `/dashboard/client/report-compliance/smr-filing/smr/form?caseNumber=${data?.uid}&caseId=${data?._id}`,
    );
  };
  const handleRfi = (data) => {
    setCaseNumber(data?.uid);

    setOpenRfi(true);
  };
  const columns = [
    {
      header: "Actions",
      size: 40,
      cell: ({ row }) => (
        <>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className=" bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 text-amber-900 font-semibold transition-all duration-200 dark:from-amber-950 dark:to-orange-950 dark:border-amber-800 dark:text-amber-100 dark:hover:border-amber-700"
              onClick={() => handleGenerateEcdd(row?.original?.uid)}
            >
              E
            </Button>

            {/* SMR Button - Blue/Cyan theme */}
            <Button
              size="sm"
              variant="outline"
              className=" bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:from-red-100 hover:to-rose-100 hover:border-red-300 text-red-900 font-semibold  transition-all duration-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800 dark:text-red-100 dark:hover:border-red-700 "
              onClick={() => handleGenerateSmr(row?.original)}
              // disabled={loadingButton === `smr-${alert.caseId}`}
            >
              S
            </Button>

            {/* RFI Button - Red/Rose theme */}
            <Button
              size="sm"
              variant="outline"
              className=" bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 text-blue-900 font-semibold  transition-all duration-200 dark:from-blue-950 dark:to-cyan-950 dark:border-blue-800 dark:text-blue-100 dark:hover:border-blue-700"
              onClick={() => handleRfi(row?.original)}
              // disabled={loadingButton === `rfi-${alert.caseId}`}
            >
              R
            </Button>
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
                      `/dashboard/client/monitoring-and-cases/case-list/details/${row?.original?._id}`,
                    )
                  }
                >
                  <IconEye className="mr-2 size-3 text-muted-foreground/70" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGenerateEcdd(row?.original?.uid)}>
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
      cell: ({ row }) => (
        <div>
          <p className="font-mono">{row?.original?.uid}</p>
        </div>
      ),
    },

    {
      header: "Transaction",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="capitalize text-heading font-semibold">
              {row?.original?.transaction?.sender?.name}
            </p>
            <p className="text-zinc-400 text-xs">{row?.original?.transaction?.sender?.account}</p>
          </div>
          <span>
            <ArrowRight className="size-4 text-green-500" />
          </span>
          <div>
            <p className="text-heading font-semibold">
              {row?.original?.transaction?.receiver?.name}
            </p>
            <p className="text-zinc-400 text-xs">{row?.original?.transaction?.receiver?.account}</p>
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
          <p className="text-end">{formatDateTime(row?.original?.transaction?.timestamp)?.date}</p>
          <p className="text-zinc-400 text-xs text-end">
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
        <StatusPill icon={<IconPennant />} variant={riskVariants[row?.original?.riskLabel]}>
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
        <StatusPill variant={statusVariants[row.original.status]}>{row.original.status}</StatusPill>
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
      {openRfi && (
        <CaseRequestForm
          open={openRfi}
          setOpen={setOpenRfi}
          caseNumber={caseNumber}
          setCaseNumber={setCaseNumber}
        />
      )}
    </div>
  );
};
export default function CaseList() {
  const { currentPage, limit, setAlerts, setFetching, setTotalItems } = useAlertStore();

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const queryParams = {
          page: currentPage,
          limit: limit,
        };
        const response = await getCaseList(queryParams);
        console.log("response", response);

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
