"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Settings,
  HelpCircle,
  ChevronLeft,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SMReffectiveness from "./SMReffectiveness";

const forms = [
  {
    id: 1,
    title: "Maintain Your AML/CTF Program",
    status: "complete",
    lastUpdated: "15 Aug 2024",
    dueDate: null,
    type: "Program",
  },
  {
    id: 2,
    title: "Independent Evaluation Response",
    status: "in-progress",
    lastUpdated: null,
    dueDate: "30 Sep 2024",
    type: "Evaluation",
  },
  {
    id: 3,
    title: "SMR Effectiveness Check",
    status: "warning",
    lastUpdated: null,
    dueDate: "15 Sep 2024",
    type: "SMR",
  },
  {
    id: 4,
    title: "Compliance Officer Effectiveness",
    status: "complete",
    lastUpdated: "1 Aug 2024",
    dueDate: null,
    type: "Officer",
  },
  {
    id: 5,
    title: "Enhanced CDD Effectiveness Check",
    status: "in-progress",
    lastUpdated: null,
    dueDate: "20 Oct 2024",
    type: "CDD",
  },
  {
    id: 6,
    title: "Transaction Monitoring Effectiveness",
    status: "complete",
    lastUpdated: "10 Aug 2024",
    dueDate: null,
    type: "Monitoring",
  },
];

function StatusIcon({ status }) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-primary" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    default:
      return null;
  }
}

function statusLabel(status) {
  switch (status) {
    case "complete":
      return "Complete";
    case "in-progress":
      return "In Progress";
    case "warning":
      return "Attention Needed";
    default:
      return status;
  }
}

function FormDetail({ form, onBack }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{form.title}</h2>
          <p className="text-sm text-muted-foreground">Governance Regulatory Form</p>
        </div>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Section 1: General Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-muted-foreground">Reporting Entity Name</Label>
              <Input placeholder="Enter entity name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-muted-foreground">ABN/ACN</Label>
              <Input placeholder="Enter ABN or ACN" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-muted-foreground">Reporting Period Start</Label>
              <Input type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-muted-foreground">Reporting Period End</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Enhanced Fields
            </h3>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Show Advanced Fields</Label>
              <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
            </div>
          </div>

          {showAdvanced && (
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="mb-3 text-sm font-medium text-foreground">
                  Enterprise Control Mapping
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-muted-foreground">Control ID</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Auto-generated" readOnly className="flex-1" />
                      <Button variant="outline" size="sm">
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-muted-foreground">Regulatory Obligation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="s36">Section 36 - CDD</SelectItem>
                        <SelectItem value="s41">Section 41 - SMR</SelectItem>
                        <SelectItem value="s81">Section 81 - Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 text-sm font-medium text-foreground">Testing Impact</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-muted-foreground">Interim Controls</Label>
                    <Textarea placeholder="Describe any interim control measures..." rows={3} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* <SMReffectiveness /> */}

      <div className="flex justify-end gap-3">
        <Button variant="outline">Save as Draft</Button>
        <Button>Submit for Approval</Button>
      </div>
    </div>
  );
}

export default function FormsHubPage() {
  const [selectedForm, setSelectedForm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (selectedForm) {
    return <FormDetail form={selectedForm} onBack={() => setSelectedForm(null)} />;
  }

  const filteredForms = forms.filter((form) => {
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    const matchesSearch = form.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Governance Forms Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete all regulatory forms in one place
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-border bg-card">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="warning">Needs Attention</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {(statusFilter !== "all" || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setSearch("");
              }}
            >
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <Card
            key={form.id}
            className="cursor-pointer border-border bg-card transition-colors hover:bg-accent"
            onClick={() => setSelectedForm(form)}
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {form.type}
                </Badge>
                <StatusIcon status={form.status} />
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-snug">{form.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{statusLabel(form.status)}</span>
                <span>
                  {form.dueDate ? `Due: ${form.dueDate}` : `Updated: ${form.lastUpdated}`}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedForm(form);
                }}
              >
                {form.status === "complete"
                  ? "View"
                  : form.status === "in-progress"
                    ? "Continue"
                    : "Review"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
