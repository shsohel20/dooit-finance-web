'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { getCompanyById } from '../actions';
import {
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    DollarSign,
    Users,
    FileText,
    Calendar,
    Globe,
    CheckCircle2,
    Clock,
    AlertCircle,
    Shield,
  } from "lucide-react";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  


function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  
  function formatCurrency(value) {
    const num = Number.parseInt(value);
    if (Number.isNaN(num)) return value;
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(num);
  }
  
  function StatusBadge({ status }) {
    const statusConfig = {
      approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
      in_review: { label: "In Review", variant: "secondary", icon: Clock },
      rejected: { label: "Rejected", variant: "destructive", icon: AlertCircle },
    };
  
    const config = statusConfig[status] || statusConfig.in_review;
    const Icon = config.icon;
  
    return (
      <Badge variant={config.variant} className="gap-1.5 px-3 py-1.5 text-sm font-medium">
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  }
  
  function DataField({ label, value }) {
    if (value === undefined || value === null || value === "") return null;
    
    const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
    
    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{displayValue}</p>
      </div>
    );
  }
  
  function AddressBlock({ address, title }) {
    const streetLine = address.street || address.address;
    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="font-medium text-foreground">
          <p>{streetLine}</p>
          <p>{address.suburb}, {address.state} {address.postcode}</p>
          <p>{address.country}</p>
        </div>
      </div>
    );
  }
  
  function SectionCard({ title, icon: Icon, children }) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

const CompanyDetailsPage = () => {
    const id = useSearchParams().get('id');
    const [company, setCompany] = useState(null);
    console.log('company', JSON.stringify(company, null, 2));
    useEffect(() => {
        const fetchCompany = async () => {
            const response = await getCompanyById(id);
            setCompany(response.data);
        }
        fetchCompany();
    }, [id]);
    if (!company) return null;
    const { customer, general_information, directors_beneficial_owner } = company;
    const personal = customer.personalKyc.personal_form;
    const funds = customer.personalKyc.funds_wealth;
  return (
    <div className="min-h-screen ">
    {/* Header */}
    <header className=" z-10 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{general_information.legal_name}</h1>
            <p className="text-sm text-muted-foreground">
              {general_information.trading_names} | {general_information.registration_number}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={customer.kycStatus} />
          <div className="hidden text-right sm:block">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-sm font-medium text-foreground">{formatDate(company.createdAt)}</p>
          </div>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <Globe className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="font-semibold text-foreground">{general_information.country_of_incorporation}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-semibold text-foreground">{general_information.industry}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Income</p>
              <p className="font-semibold text-foreground">{general_information.annual_income}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Directors</p>
              <p className="font-semibold text-foreground">{directors_beneficial_owner.number_of_directors}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Flags */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Badge variant={customer.isPep ? "destructive" : "outline"} className="gap-1.5 px-3 py-1.5">
          <Shield className="h-3.5 w-3.5" />
          PEP: {customer.isPep ? "Yes" : "No"}
        </Badge>
        <Badge variant={customer.sanction ? "destructive" : "outline"} className="gap-1.5 px-3 py-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          Sanction: {customer.sanction ? "Yes" : "No"}
        </Badge>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
          <FileText className="h-3.5 w-3.5" />
          ID: {personal.identificationNo}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={User}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DataField label="Full Name" value={`${personal.customer_details.given_name} ${personal.customer_details.middle_name} ${personal.customer_details.surname}`} />
            <DataField label="Other Names" value={personal.customer_details.other_names} />
            <DataField label="Date of Birth" value={formatDate(personal.customer_details.date_of_birth)} />
            <DataField label="Country" value={customer.country} />
            <DataField label="Referral Source" value={personal.customer_details.referral} />
            <DataField label="Sole Trader" value={customer.personalKyc.sole_trader.is_sole_trader} />
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact Information" icon={Mail}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{personal.contact_details.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{personal.contact_details.phone}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Employment Details */}
        <SectionCard title="Employment Details" icon={Briefcase}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DataField label="Occupation" value={personal.employment_details.occupation} />
            <DataField label="Industry" value={personal.employment_details.industry} />
            <DataField label="Employer" value={personal.employment_details.employer_name} />
          </div>
        </SectionCard>

        {/* Funds & Wealth */}
        <SectionCard title="Funds & Wealth" icon={DollarSign}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DataField label="Source of Funds" value={funds.source_of_funds} />
            <DataField label="Source of Wealth" value={funds.source_of_wealth} />
            <DataField label="Account Purpose" value={funds.account_purpose} />
            <DataField label="Estimated Trading Volume" value={formatCurrency(funds.estimated_trading_volume)} />
          </div>
        </SectionCard>

        {/* Residential Address */}
        <SectionCard title="Residential Address" icon={MapPin}>
          <AddressBlock address={personal.residential_address} title="Address" />
        </SectionCard>

        {/* Mailing Address */}
        <SectionCard title="Mailing Address" icon={MapPin}>
          <AddressBlock address={personal.mailing_address} title="Address" />
        </SectionCard>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        Business Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Details */}
        <SectionCard title="Company Details" icon={Building2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DataField label="Legal Name" value={general_information.legal_name} />
            <DataField label="Trading Name" value={general_information.trading_names} />
            <DataField label="Registration Number" value={general_information.registration_number} />
            <DataField label="Country of Incorporation" value={general_information.country_of_incorporation} />
            <DataField label="Company Type" value={general_information.company_type.type} />
            <DataField label="Listed Company" value={general_information.company_type.is_listed} />
            <DataField label="Industry" value={general_information.industry} />
            <DataField label="Nature of Business" value={general_information.nature_of_business} />
          </div>
        </SectionCard>

        {/* Business Contact */}
        <SectionCard title="Business Contact" icon={Phone}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{general_information.contact_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{general_information.phone_number}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Financial Information */}
        <SectionCard title="Financial Information" icon={DollarSign}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DataField label="Annual Income" value={general_information.annual_income} />
            <DataField label="Estimated Trading Volume" value={general_information.estimated_trading_volume} />
          </div>
          <Separator className="my-4" />
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Account Purpose</p>
            <div className="flex flex-wrap gap-2">
              {general_information.account_purpose.digital_currency_exchange && (
                <Badge variant="secondary">Digital Currency Exchange</Badge>
              )}
              {general_information.account_purpose.peer_to_peer && (
                <Badge variant="secondary">Peer to Peer</Badge>
              )}
              {general_information.account_purpose.fx && (
                <Badge variant="secondary">FX</Badge>
              )}
              {general_information.account_purpose.other && (
                <Badge variant="secondary">{general_information.account_purpose.other_details}</Badge>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Local Agent */}
        <SectionCard title="Local Agent" icon={User}>
          <div className="space-y-4">
            <DataField label="Name" value={general_information.local_agent.name} />
            <AddressBlock address={general_information.local_agent.address} title="Address" />
          </div>
        </SectionCard>

        {/* Registered Address */}
        <SectionCard title="Registered Address" icon={MapPin}>
          <AddressBlock address={general_information.registered_address} title="Address" />
        </SectionCard>

        {/* Business Address */}
        <SectionCard title="Business Address" icon={MapPin}>
          <div className="space-y-4">
            {general_information.business_address.different_from_registered && (
              <Badge variant="outline" className="text-xs">Different from Registered Address</Badge>
            )}
            <AddressBlock address={general_information.business_address} title="Address" />
          </div>
        </SectionCard>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        Directors & Beneficial Owners
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Directors */}
        <SectionCard title="Directors" icon={Users}>
          <div className="space-y-3">
            {directors_beneficial_owner.directors.map((director, index) => (
              <div
                key={director._id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {director.given_name} {director.surname}
                  </p>
                  <p className="text-sm text-muted-foreground">Director</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Beneficial Owners */}
        <SectionCard title="Beneficial Owners" icon={User}>
          <div className="space-y-4">
            {directors_beneficial_owner.beneficial_owners.map((owner) => (
              <div
                key={owner._id}
                className="rounded-lg border border-border bg-muted/30 p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{owner.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      {formatDate(owner.date_of_birth)}
                    </p>
                  </div>
                </div>
                <AddressBlock address={owner.residential_address} title="Residential Address" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>Application ID: {company._id}</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Created: {formatDate(company.createdAt)}</span>
            <span>Updated: {formatDate(company.updatedAt)}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
  )
}

export default CompanyDetailsPage