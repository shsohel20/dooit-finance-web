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
import GoverningBodyForm from "../../testing-and-governance/governing-body/page";
import EcddEffectivenessForm from "./ecdd";
import { useRouter } from "next/navigation";
export const forms = [
  {
    id: 1,
    title: "Maintain Your AML/CTF Program",
    status: "complete",
    lastUpdated: "15 Aug 2024",
    dueDate: null,
    type: "Program",
    component: null,
  },
  {
    id: 2,
    title: "Independent Evaluation Response",
    status: "in-progress",
    lastUpdated: null,
    dueDate: "30 Sep 2024",
    type: "Evaluation",
    component: null,
  },
  {
    id: 3,
    title: "SMR Effectiveness Check",
    status: "warning",
    lastUpdated: null,
    dueDate: "15 Sep 2024",
    type: "SMR",
    component: <SMReffectiveness />,
  },
  {
    id: 4,
    title: "Compliance Officer Effectiveness",
    status: "complete",
    lastUpdated: "1 Aug 2024",
    dueDate: null,
    type: "Officer",
    component: null,
  },
  {
    id: 5,
    title: "Enhanced CDD Effectiveness Check",
    status: "in-progress",
    lastUpdated: null,
    dueDate: "20 Oct 2024",
    type: "CDD",
    component: <EcddEffectivenessForm />,
  },
  {
    id: 6,
    title: "Transaction Monitoring Effectiveness",
    status: "complete",
    lastUpdated: "10 Aug 2024",
    dueDate: null,
    type: "Monitoring",
    component: null,
  },{
    id: 7,
    title: "Governing Body",
    status: "complete",
    lastUpdated: "10 Aug 2024",
    dueDate: null,
    type: "Governing Body",
    component: <GoverningBodyForm />,
  }
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

export default function FormsHubPage() {
  const [selectedForm, setSelectedForm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  console.log({selectedForm});
  const router = useRouter();

  // if (selectedForm) {
  //   return <FormDetail form={selectedForm} onBack={() => setSelectedForm(null)} />;
  // }

  const filteredForms = forms.filter((form) => {
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    const matchesSearch = form.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  console.log({filteredForms});

const handleFormClick = (form) => {
  setSelectedForm(form);
  router.push(`/dashboard/client/grc/forms-hub/form?id=${form.id}`);
}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredForms.map((form) => (
          <Card
            key={form.id}
            className="cursor-pointer border-border bg-card transition-colors hover:bg-accent"
            onClick={() => handleFormClick(form)}
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
                  handleFormClick(form);
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
