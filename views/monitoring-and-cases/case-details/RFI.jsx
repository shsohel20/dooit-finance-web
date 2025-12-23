"use client";

import {
  ChevronDown,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ResizableTable from "@/components/ui/Resizabletable";
import { useState } from "react";
import { CaseRequestForm } from "./ecdd/RFIForm";
import { getRFIList } from "@/app/dashboard/client/monitoring-and-cases/case-list/actions";
import { useEffect } from "react";
import RFIDetails from "./ecdd/RFIDetails";
const data = [
  {
    date: "2025-01-01",
    subject: "Clarification on recent transactions",
    status: "Pending",
    deadline: "14 days",
  },
];

export default function RFI() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rfiId, setRfiId] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenDetails = (id) => {
    console.log("id", id);
    setRfiId(id);
    setOpenDetails(true);
  };
  const getRFI = async () => {
    try {
      setLoading(true);
      const response = await getRFIList();
      console.log("rfi list response", response);
      if (response.success) {
        setData(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRFI();
  }, []);
  const columns = [
    {
      header: "Id",
      accessorKey: "uid",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Description",
      accessorKey: "requestedItems?.[0]?.text",
      cell: ({ row }) => {
        const texts = row?.original?.requestedItems.map((itm) => itm.text);
        return <p>{texts.join(",")}</p>;
      },
    },
    // {
    //   header: "Deadline",
    //   accessorKey: "deadline",
    // },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="icon" onClick={() => handleOpenDetails(row.original._id)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  const handleNewRFI = () => {
    setOpen(true);
  };
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto  py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Request for Information</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and track all RFI requests and responses
              </p>
            </div>
            <Button onClick={handleNewRFI} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New RFI
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" py-8">
        <div className="space-y-8">
          {/* Filters Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2 bg-card hover:bg-muted">
                <span className="text-sm font-medium">Date</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2 bg-card hover:bg-muted">
                <span className="text-sm font-medium">Subject</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2 bg-card hover:bg-muted">
                <span className="text-sm font-medium">Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2 bg-card hover:bg-muted">
                <span className="text-sm font-medium">Deadline</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 bg-card hover:bg-muted">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* RFI Table */}
          <Card className=" ">
            <CardContent className="p-2">
              <div className="overflow-x-auto mb-4">
                <ResizableTable columns={columns} data={data} loading={loading} />
              </div>

              {/* Pagination */}
              <div className="border-t border-border px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 1-3 of 68 requests</p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled className="h-8 bg-transparent">
                    Previous
                  </Button>
                  <Button variant="default" size="sm" className="h-8">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    3
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">...</span>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    67
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    68
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Tracker */}
          {/* <ResponseTracker /> */}
        </div>
      </div>
      <CaseRequestForm open={open} setOpen={setOpen} getRFI={getRFI} />
      {openDetails && (
        <RFIDetails open={openDetails} onOpenChange={setOpenDetails} id={rfiId} setId={setRfiId} />
      )}
    </div>
  );
}
