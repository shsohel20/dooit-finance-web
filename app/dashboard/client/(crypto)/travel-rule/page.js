"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  MoreVertical,
  Building2,
  User,
  FileText,
  Download,
  Eye,
  Send,
  RefreshCw,
  Globe,
  Copy,
  Check,
  ChevronRight,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockTransfers = [
  {
    id: "TR001",
    type: "outgoing",
    asset: "BTC",
    amount: "2.5",
    amountUsd: "$108,750.00",
    originatorName: "John Doe",
    originatorAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    originatorVasp: "CryptoVault",
    beneficiaryName: "Alice Smith",
    beneficiaryAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    beneficiaryVasp: "Coinbase",
    status: "approved",
    complianceScore: 95,
    createdAt: "2026-01-28 14:30",
    txHash: "0x1234...5678",
  },
  {
    id: "TR002",
    type: "incoming",
    asset: "ETH",
    amount: "15.0",
    amountUsd: "$52,500.00",
    originatorName: "Bob Johnson",
    originatorAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8b2E1",
    originatorVasp: "Binance",
    beneficiaryName: "John Doe",
    beneficiaryAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    beneficiaryVasp: "CryptoVault",
    status: "pending",
    complianceScore: 78,
    createdAt: "2026-01-28 12:15",
  },
  {
    id: "TR003",
    type: "outgoing",
    asset: "SOL",
    amount: "500",
    amountUsd: "$62,500.00",
    originatorName: "John Doe",
    originatorAddress: "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs",
    originatorVasp: "CryptoVault",
    beneficiaryName: "Charlie Wilson",
    beneficiaryAddress: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    beneficiaryVasp: "Kraken",
    status: "requires_info",
    complianceScore: 45,
    createdAt: "2026-01-27 16:45",
  },
  {
    id: "TR004",
    type: "incoming",
    asset: "BTC",
    amount: "0.75",
    amountUsd: "$32,625.00",
    originatorName: "Unknown Entity",
    originatorAddress: "bc1q9h5yjfnx6zzgfvx3zjs",
    originatorVasp: "Unverified VASP",
    beneficiaryName: "John Doe",
    beneficiaryAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    beneficiaryVasp: "CryptoVault",
    status: "rejected",
    complianceScore: 15,
    createdAt: "2026-01-27 09:20",
  },
];

const mockVasps = [
  {
    id: "V001",
    name: "Coinbase",
    country: "United States",
    website: "coinbase.com",
    status: "verified",
    protocols: ["TRISA", "TRP", "OpenVASP"],
    lastVerified: "2026-01-15",
  },
  {
    id: "V002",
    name: "Binance",
    country: "Cayman Islands",
    website: "binance.com",
    status: "verified",
    protocols: ["TRISA", "TRP"],
    lastVerified: "2026-01-10",
  },
  {
    id: "V003",
    name: "Kraken",
    country: "United States",
    website: "kraken.com",
    status: "verified",
    protocols: ["TRISA", "OpenVASP"],
    lastVerified: "2026-01-12",
  },
  {
    id: "V004",
    name: "Gemini",
    country: "United States",
    website: "gemini.com",
    status: "pending",
    protocols: ["TRISA"],
    lastVerified: "2025-12-20",
  },
  {
    id: "V005",
    name: "FTX Successor",
    country: "Bahamas",
    website: "ftx.com",
    status: "unverified",
    protocols: [],
    lastVerified: "N/A",
  },
];

const mockBeneficiaries = [
  {
    id: "B001",
    name: "Alice Smith",
    walletAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    vasp: "Coinbase",
    country: "United States",
    accountNumber: "****4521",
    verified: true,
  },
  {
    id: "B002",
    name: "Tech Solutions Ltd",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f8b2E1",
    vasp: "Binance",
    country: "Singapore",
    verified: true,
  },
  {
    id: "B003",
    name: "Michael Brown",
    walletAddress: "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs",
    vasp: "Kraken",
    country: "Germany",
    verified: false,
  },
];

export default function TravelRulePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addBeneficiaryOpen, setAddBeneficiaryOpen] = useState(false);
  const [viewTransferOpen, setViewTransferOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Settings state
  const [autoApproveVerified, setAutoApproveVerified] = useState(true);
  const [thresholdAmount, setThresholdAmount] = useState("1000");
  const [requireManualReview, setRequireManualReview] = useState(true);

  // New beneficiary form
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    walletAddress: "",
    vasp: "",
    country: "",
    accountNumber: "",
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "requires_info":
        return (
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Requires Info
          </Badge>
        );
    }
  };

  const getVaspStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "unverified":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="h-3 w-3 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  const getComplianceColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getComplianceProgressColor = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const filteredTransfers = mockTransfers.filter((transfer) => {
    const matchesSearch =
      transfer.originatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalTransfers: mockTransfers.length,
    approved: mockTransfers.filter((t) => t.status === "approved").length,
    pending: mockTransfers.filter((t) => t.status === "pending").length,
    rejected: mockTransfers.filter((t) => t.status === "rejected").length,
    requiresInfo: mockTransfers.filter((t) => t.status === "requires_info").length,
    complianceRate: Math.round(
      (mockTransfers.filter((t) => t.status === "approved").length / mockTransfers.length) * 100,
    ),
  };

  const handleAddBeneficiary = () => {
    // In a real app, this would save to the backend
    setAddBeneficiaryOpen(false);
    setNewBeneficiary({
      name: "",
      walletAddress: "",
      vasp: "",
      country: "",
      accountNumber: "",
    });
  };

  const handleViewTransfer = (transfer) => {
    setSelectedTransfer(transfer);
    setViewTransferOpen(true);
  };

  const handleApproveTransfer = (id) => {
    // In a real app, this would update the backend
    console.log("Approving transfer:", id);
  };

  const handleRejectTransfer = (id) => {
    // In a real app, this would update the backend
    console.log("Rejecting transfer:", id);
  };

  const handleRequestInfo = (id) => {
    // In a real app, this would send a request to the counterparty VASP
    console.log("Requesting info for transfer:", id);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-card">
            Overview
          </TabsTrigger>
          <TabsTrigger value="transfers" className="data-[state=active]:bg-card">
            Transfers
          </TabsTrigger>
          <TabsTrigger value="beneficiaries" className="data-[state=active]:bg-card">
            Beneficiaries
          </TabsTrigger>
          <TabsTrigger value="vasp-directory" className="data-[state=active]:bg-card">
            VASP Directory
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-card">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transfers</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalTransfers}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ArrowLeftRight className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Rate</p>
                    <p className="text-2xl font-bold text-success">{stats.complianceRate}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-warning">
                      {stats.pending + stats.requiresInfo}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Compliance Status
                </CardTitle>
                <CardDescription>
                  Your organization&apos;s FATF Travel Rule compliance status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">TRISA Protocol</span>
                    <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">TRP Integration</span>
                    <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">OpenVASP</span>
                    <Badge className="bg-warning/20 text-warning border-warning/30">
                      Configuring
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sygna Bridge</span>
                    <Badge className="bg-secondary text-muted-foreground">Not Configured</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Compliance Score</span>
                    <span className="text-lg font-bold text-success">92%</span>
                  </div>
                  <Progress value={92} className="h-2 bg-secondary [&>div]:bg-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Pending Actions
                </CardTitle>
                <CardDescription>Transfers requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransfers
                    .filter((t) => t.status === "pending" || t.status === "requires_info")
                    .slice(0, 3)
                    .map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => handleViewTransfer(transfer)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center",
                              transfer.type === "outgoing" ? "bg-destructive/10" : "bg-success/10",
                            )}
                          >
                            {transfer.type === "outgoing" ? (
                              <ArrowUpRight className="h-4 w-4 text-destructive" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-success" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {transfer.amount} {transfer.asset}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.type === "outgoing"
                                ? `To: ${transfer.beneficiaryName}`
                                : `From: ${transfer.originatorName}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(transfer.status)}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  {mockTransfers.filter(
                    (t) => t.status === "pending" || t.status === "requires_info",
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No pending actions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transfers</CardTitle>
                <CardDescription>Latest Travel Rule compliance activities</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setActiveTab("transfers")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Counterparty</TableHead>
                    <TableHead className="text-muted-foreground">VASP</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransfers.slice(0, 4).map((transfer) => (
                    <TableRow
                      key={transfer.id}
                      className="border-border cursor-pointer hover:bg-secondary/50"
                      onClick={() => handleViewTransfer(transfer)}
                    >
                      <TableCell className="font-mono text-sm">{transfer.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transfer.type === "outgoing" ? (
                            <ArrowUpRight className="h-4 w-4 text-destructive" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-success" />
                          )}
                          <span className="capitalize">{transfer.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {transfer.amount} {transfer.asset}
                          </p>
                          <p className="text-xs text-muted-foreground">{transfer.amountUsd}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transfer.type === "outgoing"
                          ? transfer.beneficiaryName
                          : transfer.originatorName}
                      </TableCell>
                      <TableCell>
                        {transfer.type === "outgoing"
                          ? transfer.beneficiaryVasp
                          : transfer.originatorVasp}
                      </TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            getComplianceColor(transfer.complianceScore),
                          )}
                        >
                          {transfer.complianceScore}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <CardTitle>Travel Rule Transfers</CardTitle>
                  <CardDescription>
                    Manage incoming and outgoing transfer compliance
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="requires_info">Requires Info</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transfers Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                      <TableHead className="text-muted-foreground">Transfer ID</TableHead>
                      <TableHead className="text-muted-foreground">Type</TableHead>
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Originator</TableHead>
                      <TableHead className="text-muted-foreground">Beneficiary</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Score</TableHead>
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((transfer) => (
                      <TableRow key={transfer.id} className="border-border">
                        <TableCell className="font-mono text-sm">{transfer.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transfer.type === "outgoing" ? (
                              <ArrowUpRight className="h-4 w-4 text-destructive" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-success" />
                            )}
                            <span className="capitalize">{transfer.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {transfer.amount} {transfer.asset}
                            </p>
                            <p className="text-xs text-muted-foreground">{transfer.amountUsd}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transfer.originatorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.originatorVasp}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transfer.beneficiaryName}</p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.beneficiaryVasp}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  getComplianceProgressColor(transfer.complianceScore),
                                )}
                                style={{ width: `${transfer.complianceScore}%` }}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-sm font-medium",
                                getComplianceColor(transfer.complianceScore),
                              )}
                            >
                              {transfer.complianceScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTransfer(transfer)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {transfer.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleApproveTransfer(transfer.id)}
                                    className="text-success"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRejectTransfer(transfer.id)}
                                    className="text-destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {transfer.status === "requires_info" && (
                                <DropdownMenuItem onClick={() => handleRequestInfo(transfer.id)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Request Info
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Download Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Beneficiaries Tab */}
        <TabsContent value="beneficiaries" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <CardTitle>Saved Beneficiaries</CardTitle>
                  <CardDescription>Pre-verified beneficiaries for faster transfers</CardDescription>
                </div>
                <Dialog open={addBeneficiaryOpen} onOpenChange={setAddBeneficiaryOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Beneficiary
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Add New Beneficiary</DialogTitle>
                      <DialogDescription>
                        Add a new beneficiary for Travel Rule compliant transfers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Full Name / Entity Name</Label>
                        <Input
                          placeholder="Enter name"
                          value={newBeneficiary.name}
                          onChange={(e) =>
                            setNewBeneficiary({ ...newBeneficiary, name: e.target.value })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Wallet Address</Label>
                        <Input
                          placeholder="Enter wallet address"
                          value={newBeneficiary.walletAddress}
                          onChange={(e) =>
                            setNewBeneficiary({ ...newBeneficiary, walletAddress: e.target.value })
                          }
                          className="bg-secondary border-border font-mono text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>VASP / Exchange</Label>
                          <Select
                            value={newBeneficiary.vasp}
                            onValueChange={(value) =>
                              setNewBeneficiary({ ...newBeneficiary, vasp: value })
                            }
                          >
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select VASP" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockVasps
                                .filter((v) => v.status === "verified")
                                .map((vasp) => (
                                  <SelectItem key={vasp.id} value={vasp.name}>
                                    {vasp.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Select
                            value={newBeneficiary.country}
                            onValueChange={(value) =>
                              setNewBeneficiary({ ...newBeneficiary, country: value })
                            }
                          >
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="Singapore">Singapore</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                              <SelectItem value="Switzerland">Switzerland</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number (Optional)</Label>
                        <Input
                          placeholder="Enter account number"
                          value={newBeneficiary.accountNumber}
                          onChange={(e) =>
                            setNewBeneficiary({ ...newBeneficiary, accountNumber: e.target.value })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddBeneficiaryOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleAddBeneficiary}
                      >
                        Add Beneficiary
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockBeneficiaries.map((beneficiary) => (
                  <Card key={beneficiary.id} className="bg-secondary/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{beneficiary.name}</p>
                            <p className="text-xs text-muted-foreground">{beneficiary.country}</p>
                          </div>
                        </div>
                        {beneficiary.verified ? (
                          <Badge className="bg-success/20 text-success border-success/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-warning/20 text-warning border-warning/30">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">VASP</span>
                          <span className="text-foreground">{beneficiary.vasp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Address</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs text-foreground">
                              {beneficiary.walletAddress.slice(0, 8)}...
                              {beneficiary.walletAddress.slice(-6)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                copyToClipboard(beneficiary.walletAddress, beneficiary.id)
                              }
                            >
                              {copiedId === beneficiary.id ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {beneficiary.accountNumber && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Account</span>
                            <span className="text-foreground">{beneficiary.accountNumber}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VASP Directory Tab */}
        <TabsContent value="vasp-directory" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    VASP Directory
                  </CardTitle>
                  <CardDescription>
                    Virtual Asset Service Providers for Travel Rule compliance
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search VASPs..."
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                      <TableHead className="text-muted-foreground">VASP Name</TableHead>
                      <TableHead className="text-muted-foreground">Country</TableHead>
                      <TableHead className="text-muted-foreground">Protocols</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Last Verified</TableHead>
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVasps.map((vasp) => (
                      <TableRow key={vasp.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{vasp.name}</p>
                              <p className="text-xs text-muted-foreground">{vasp.website}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            {vasp.country}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {vasp.protocols.length > 0 ? (
                              vasp.protocols.map((protocol) => (
                                <Badge key={protocol} variant="outline" className="text-xs">
                                  {protocol}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getVaspStatusBadge(vasp.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{vasp.lastVerified}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Status
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Test Connection
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Compliance Thresholds</CardTitle>
                <CardDescription>
                  Configure Travel Rule trigger amounts and requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Threshold Amount (USD)</Label>
                  <Input
                    type="number"
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(e.target.value)}
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Transfers above this amount will require Travel Rule compliance
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">Auto-approve verified VASPs</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve transfers to verified VASPs
                    </p>
                  </div>
                  <Switch checked={autoApproveVerified} onCheckedChange={setAutoApproveVerified} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">Require manual review</p>
                    <p className="text-sm text-muted-foreground">
                      Always require manual review for new beneficiaries
                    </p>
                  </div>
                  <Switch checked={requireManualReview} onCheckedChange={setRequireManualReview} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Protocol Configuration</CardTitle>
                <CardDescription>Manage Travel Rule protocol connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">TRISA</p>
                      <p className="text-sm text-muted-foreground">Connected & Active</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">TRP (Travel Rule Protocol)</p>
                      <p className="text-sm text-muted-foreground">Connected & Active</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">OpenVASP</p>
                      <p className="text-sm text-muted-foreground">Configuration in progress</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Setup
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Sygna Bridge</p>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Originator Information</CardTitle>
              <CardDescription>
                Your organization&apos;s information for outgoing transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Legal Entity Name</Label>
                  <Input defaultValue="CryptoVault Inc." className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>LEI (Legal Entity Identifier)</Label>
                  <Input
                    defaultValue="529900T8BM49AURSDO55"
                    className="bg-secondary border-border font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registered Address</Label>
                  <Input
                    defaultValue="123 Blockchain Street, San Francisco, CA 94102"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country of Registration</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="ch">Switzerland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transfer Details Dialog */}
      <Dialog open={viewTransferOpen} onOpenChange={setViewTransferOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Transfer Details
              {selectedTransfer && getStatusBadge(selectedTransfer.status)}
            </DialogTitle>
            <DialogDescription>
              Travel Rule compliance information for transfer {selectedTransfer?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-6 py-4">
              {/* Transfer Summary */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center",
                      selectedTransfer.type === "outgoing" ? "bg-destructive/10" : "bg-success/10",
                    )}
                  >
                    {selectedTransfer.type === "outgoing" ? (
                      <ArrowUpRight className="h-6 w-6 text-destructive" />
                    ) : (
                      <ArrowDownLeft className="h-6 w-6 text-success" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedTransfer.amount} {selectedTransfer.asset}
                    </p>
                    <p className="text-muted-foreground">{selectedTransfer.amountUsd}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      getComplianceColor(selectedTransfer.complianceScore),
                    )}
                  >
                    {selectedTransfer.complianceScore}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Originator Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Originator
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground">{selectedTransfer.originatorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VASP</span>
                      <span className="text-foreground">{selectedTransfer.originatorVasp}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address</span>
                      <p className="font-mono text-xs text-foreground mt-1 break-all">
                        {selectedTransfer.originatorAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Beneficiary Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Beneficiary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground">{selectedTransfer.beneficiaryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VASP</span>
                      <span className="text-foreground">{selectedTransfer.beneficiaryVasp}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address</span>
                      <p className="font-mono text-xs text-foreground mt-1 break-all">
                        {selectedTransfer.beneficiaryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{selectedTransfer.createdAt}</span>
                </div>
                {selectedTransfer.txHash && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <span className="font-mono text-foreground">{selectedTransfer.txHash}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedTransfer?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                  onClick={() => {
                    handleRejectTransfer(selectedTransfer.id);
                    setViewTransferOpen(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => {
                    handleApproveTransfer(selectedTransfer.id);
                    setViewTransferOpen(false);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedTransfer?.status === "requires_info" && (
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  handleRequestInfo(selectedTransfer.id);
                  setViewTransferOpen(false);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Request Information
              </Button>
            )}
            {(selectedTransfer?.status === "approved" ||
              selectedTransfer?.status === "rejected") && (
              <Button variant="outline" onClick={() => setViewTransferOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
