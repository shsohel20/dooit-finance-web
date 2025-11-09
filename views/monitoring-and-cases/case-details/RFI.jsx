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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResizableTable from "@/components/ui/Resizabletable";
const data = [
  {
    date: "2025-01-01",
    subject: "Clarification on recent transactions",
    status: "Pending",
    deadline: "14 days",
  },
];

export default function RFI() {
  const columns = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Subject",
      accessorKey: "subject",
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto  py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Request for Information
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and track all RFI requests and responses
              </p>
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Draft new RFI
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
              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted"
              >
                <span className="text-sm font-medium">Date</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted"
              >
                <span className="text-sm font-medium">Subject</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted"
              >
                <span className="text-sm font-medium">Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted"
              >
                <span className="text-sm font-medium">Deadline</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-card hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* RFI Table */}
          <Card className=" ">
            <CardContent className="p-2">
              <div className="overflow-x-auto mb-4">
                <ResizableTable columns={columns} data={data} />
              </div>

              {/* Pagination */}
              <div className="border-t border-border px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing 1-3 of 68 requests
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 bg-transparent"
                  >
                    Previous
                  </Button>
                  <Button variant="default" size="sm" className="h-8">
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                  >
                    3
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">
                    ...
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                  >
                    67
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                  >
                    68
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Tracker */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-6">
              Response Tracker
            </h2>
            <Card className="border shadow-sm">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Timeline Item 1 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-success/10 border-2 border-success flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div className="h-16 w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold text-foreground">
                        RFI Response Received
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Customer provided documentation for source of funds
                      </p>
                      <p className="text-xs text-muted-foreground mt-3">
                        2023-04-28 11:15 AM
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="h-16 w-0.5 bg-border mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold text-foreground">RFI Sent</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Request for Information sent to customer
                      </p>
                      <p className="text-xs text-muted-foreground mt-3">
                        2023-04-20 02:30 PM
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-muted border-2 border-muted-foreground flex items-center justify-center">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        RFI Drafted
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Drafted request for source of funds verification
                      </p>
                      <p className="text-xs text-muted-foreground mt-3">
                        2023-04-19 10:45 AM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
