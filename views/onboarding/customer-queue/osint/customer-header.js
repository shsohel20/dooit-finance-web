import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Calendar, MapPin, Briefcase, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const riskColors = {
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  active: { label: "Active", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  under_review: { label: "Under Review", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  restricted: { label: "Restricted", cls: "bg-red-100 text-red-700 border-red-200" },
  exited: { label: "Exited", cls: "bg-muted text-muted-foreground" },
};

export function CustomerHeader({ customer }) {
  const risk = riskColors[customer.riskRating] ?? riskColors.low;
  const status = statusLabels[customer.status] ?? statusLabels.active;

  return (
    <header className="border-b border-border bg-card">
      <div className=" max-w-7xl px-4 py-5 lg:px-8">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Search
          </Link>
          <span>/</span>
          <span>Customers</span>
          <span>/</span>
          <span className="text-foreground font-medium">{customer.id}</span>
        </div>

        {/* Main header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-6" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-foreground tracking-tight text-balance">
                  {customer.fullName}
                </h1>
                <Badge variant="outline" className={risk}>
                  {customer.riskRating.toUpperCase()} RISK
                </Badge>
                <Badge variant="outline" className={status.cls}>
                  {status.label}
                </Badge>
                {customer.pep && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20">
                    <Shield className="size-3" />
                    PEP
                  </Badge>
                )}
              </div>
              {customer.aliases.length > 0 && (
                <p className="text-sm text-muted-foreground">AKA: {customer.aliases.join(" / ")}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="size-3.5" />
              Export PDF
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            DOB: {customer.dateOfBirth}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {customer.nationality} / {customer.countryOfResidence}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="size-3.5" />
            {customer.occupation}
          </span>
          <span className="font-mono text-xs">
            ID: {customer.idDocument} {customer.idNumber}
          </span>
          <span>Onboarded: {customer.onboardingDate}</span>
          <span>Last Review: {customer.lastReviewDate}</span>
          <span>Manager: {customer.accountManager}</span>
        </div>
      </div>
    </header>
  );
}
