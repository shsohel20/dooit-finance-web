"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  MoreVertical,
  Search,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
} from "lucide-react";

// Mock data - in real app, this would come from API/database
const mockReports = [
  {
    id: "1",
    type: "smr",
    status: "draft",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    createdBy: "John Smith",
    title: "Suspicious Transaction - Customer ABC123",
    referenceNumber: "SMR-2025-001",
    data: {},
  },
  {
    id: "2",
    type: "smr",
    status: "review",
    createdAt: new Date("2025-01-14"),
    updatedAt: new Date("2025-01-14"),
    createdBy: "Jane Doe",
    title: "Multiple High-Value Transactions",
    referenceNumber: "SMR-2025-002",
    data: {},
  },
  {
    id: "3",
    type: "smr",
    status: "approved",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-12"),
    createdBy: "John Smith",
    reviewedBy: "Sarah Johnson",
    approvedBy: "Michael Brown",
    title: "Structuring Activity Detected",
    referenceNumber: "SMR-2025-003",
    data: {},
  },
];

export function ReportsList({ reportType, onCreateNew, onEditReport }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredReports = mockReports.filter((report) => {
    const matchesType = report.type === reportType;
    const matchesStatus = activeTab === "all" || report.status === activeTab;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      review: "default",
      approved: "default",
    };

    const colors = {
      draft: "bg-gray-500",
      review: "bg-yellow-500",
      approved: "bg-green-500",
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    const reports = mockReports.filter((r) => r.type === reportType);
    return {
      all: reports.length,
      draft: reports.filter((r) => r.status === "draft").length,
      review: reports.filter((r) => r.status === "review").length,
      approved: reports.filter((r) => r.status === "approved").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreateNew}>
          <FileText className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
          <TabsTrigger value="review">Review ({counts.review})</TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({counts.approved})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Reports"
                  : `${
                      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                    } Reports`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reports found</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={onCreateNew}
                  >
                    Create your first report
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Updated Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.referenceNumber}
                        </TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.createdBy}</TableCell>
                        <TableCell>
                          {report.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {report.updatedAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              {report.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() => onEditReport(report.id)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {report.status === "draft" && (
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Submit for Review
                                </DropdownMenuItem>
                              )}
                              {report.status === "review" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {report.status === "draft" && (
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
