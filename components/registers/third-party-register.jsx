"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Building2,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { ThirdPartyVendorDialog } from "./third-party-vendor-dialog";

// Mock data
const mockVendors = [
  {
    id: "FIVEN045",
    vendorName: "SecureCloud Solutions Inc.",
    servicesProvided: "Cloud Infrastructure & Data Hosting",
    entityType: "banking",
    riskCategory: "critical",
    dueDiligenceStatus: "completed",
    dueDiligenceDate: "2024-09-15",
    ddFindings:
      "Strong security controls; SOC 2 Type II certified; minor gaps in incident response",
    contractStart: "2024-10-01",
    contractEnd: "2027-09-30",
    contractValue: 450000,
    serviceLocation: "offshore",
    dataAccessLevel: "full",
    criticality: "critical",
    contractManager: "Chief Technology Officer",
    nextReviewDate: "2025-04-01",
    performanceRating: "good",
    incidentHistory: 2,
    exitStrategy:
      "90-day data migration plan; alternative providers identified",
    status: "active",
  },
  {
    id: "ACCVEN112",
    vendorName: "TaxSoft Australia Pty Ltd",
    servicesProvided: "Tax Preparation Software",
    entityType: "accounting",
    riskCategory: "high",
    dueDiligenceStatus: "completed",
    dueDiligenceDate: "2024-08-20",
    ddFindings:
      "ASAE 3150 certified; robust security; limited business continuity planning",
    contractStart: "2024-09-01",
    contractEnd: "2026-08-31",
    contractValue: 85000,
    serviceLocation: "onshore",
    dataAccessLevel: "limited",
    criticality: "important",
    contractManager: "IT Manager",
    nextReviewDate: "2025-03-01",
    performanceRating: "excellent",
    incidentHistory: 0,
    exitStrategy: "30-day data export capability",
    status: "active",
  },
  {
    id: "LAWVEN078",
    vendorName: "DocuReview Services India Pvt Ltd",
    servicesProvided: "Document Review & eDiscovery",
    entityType: "legal",
    riskCategory: "high",
    dueDiligenceStatus: "in-progress",
    dueDiligenceDate: "2024-10-25",
    ddFindings:
      "Pending completion of security audit and confidentiality agreements",
    contractStart: "2024-11-15",
    contractEnd: "2025-11-14",
    contractValue: 120000,
    serviceLocation: "offshore",
    dataAccessLevel: "limited",
    criticality: "important",
    contractManager: "Practice Manager",
    nextReviewDate: "2025-05-15",
    incidentHistory: 0,
    exitStrategy: "Immediate service termination clause",
    status: "prospective",
  },
  {
    id: "REVEN089",
    vendorName: "PropertyImage Solutions",
    servicesProvided: "Photography & Virtual Tours",
    entityType: "real-estate",
    riskCategory: "low",
    dueDiligenceStatus: "completed",
    dueDiligenceDate: "2024-09-10",
    ddFindings: "Basic business verification; no data access required",
    contractStart: "2024-09-15",
    contractEnd: "2025-09-14",
    contractValue: 25000,
    serviceLocation: "onshore",
    dataAccessLevel: "no-access",
    criticality: "non-critical",
    contractManager: "Marketing Manager",
    nextReviewDate: "2025-03-15",
    performanceRating: "satisfactory",
    incidentHistory: 0,
    exitStrategy: "14-day notice period",
    status: "active",
  },
  {
    id: "PMVEN056",
    vendorName: "Armoured Transport Services",
    servicesProvided: "Cash & Bullion Transportation",
    entityType: "precious-metals",
    riskCategory: "critical",
    dueDiligenceStatus: "completed",
    dueDiligenceDate: "2024-08-05",
    ddFindings:
      "Extensive security protocols; licensed; full background checks on staff",
    contractStart: "2024-09-01",
    contractEnd: "2026-08-31",
    contractValue: 180000,
    serviceLocation: "onshore",
    dataAccessLevel: "no-access",
    criticality: "critical",
    contractManager: "National Operations Manager",
    nextReviewDate: "2025-06-01",
    performanceRating: "excellent",
    incidentHistory: 0,
    exitStrategy: "60-day transition with parallel operations",
    status: "active",
  },
];

export function ThirdPartyRegister() {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.servicesProvided.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vendor.status === statusFilter;

    const matchesRisk =
      riskFilter === "all" || vendor.riskCategory === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: mockVendors.length,
    critical: mockVendors.filter((v) => v.riskCategory === "critical").length,
    active: mockVendors.filter((v) => v.status === "active").length,
    upcomingReviews: mockVendors.filter((v) => {
      const reviewDate = new Date(v.nextReviewDate);
      const today = new Date();
      const daysUntil = Math.ceil(
        (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil <= 30 && daysUntil >= 0;
    }).length,
  };

  const handleRowClick = (vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleNewVendor = () => {
    setSelectedVendor(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vendors
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Reviews
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Third-Party Risk Management Register</CardTitle>
            <Button onClick={handleNewVendor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Vendor ID, Name, or Services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="prospective">Prospective</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Risk Category</TableHead>
                <TableHead>DD Status</TableHead>
                <TableHead>Contract Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow
                    key={vendor.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(vendor)}
                  >
                    <TableCell className="font-medium">{vendor.id}</TableCell>
                    <TableCell>{vendor.vendorName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {vendor.servicesProvided}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vendor.riskCategory === "critical" ||
                          vendor.riskCategory === "high"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {vendor.riskCategory.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vendor.dueDiligenceStatus === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {vendor.dueDiligenceStatus
                          .replace("-", " ")
                          .toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${vendor.contractValue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vendor.status === "active" ? "default" : "secondary"
                        }
                      >
                        {vendor.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ThirdPartyVendorDialog
        vendor={selectedVendor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
