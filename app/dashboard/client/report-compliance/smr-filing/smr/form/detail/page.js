'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  User,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  Hash,
  Banknote,
  Shield,
  Users,
  UserX,
  FileWarning,
  Building,
  MapPin,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getSMRById } from "../../actions"
import { useEffect, useState } from "react"
import UILoader from "@/components/UILoader"


export default function ReportDetailView() {
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const id = useSearchParams().get('id');


  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const response = await getSMRById(id);
        console.log('response', JSON.stringify(response.data, null, 2));
        setData(response?.data);
      } catch (error) {
        console.error('error', error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [id]);

  const formatAddress = (address) => {
    return `${address?.street}, ${address?.city}, ${address?.state} ${address?.postcode}, ${address?.country}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currencyCode,
    }).format(amount)
  }

  return (
    <UILoader loading={isFetching} type='page'>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">SMR Details</h1>
                <p className="text-sm text-muted-foreground">{data?.uid}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-warning bg-warning/10 text-warning-foreground px-3 py-1 text-sm font-medium"
            >
              {data?.status.charAt(0).toUpperCase() + data?.status.slice(1) || 'Draft'}
            </Badge>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          {/* Overview Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Report ID</p>
                  <p className="font-mono text-sm font-semibold text-foreground">{data?.uid}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(data?.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sequence</p>
                  <p className="text-sm font-semibold text-foreground">#{data?.sequence}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Part A - Service Status */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    A
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Designated Services</CardTitle>
                    <p className="text-sm text-muted-foreground">Service status and reasons for suspicion</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Service Status</p>
                    <Badge
                      variant="outline"
                      className="border-success bg-success/10 text-success-foreground capitalize px-3 py-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      {data?.partA.serviceStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Designated Services</p>
                    <p className="text-sm text-foreground">
                      {data?.partA.designatedServices.length > 0
                        ? data?.partA.designatedServices.join(", ")
                        : "None specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part B - Grounds for Suspicion */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive text-destructive-foreground font-semibold text-sm">
                    B
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Grounds for Suspicion</CardTitle>
                    <p className="text-sm text-muted-foreground">Detailed reasoning and red flags identified</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-destructive">Suspicious Activity Identified</p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {data?.partB.groundsForSuspicion.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-sm leading-relaxed text-muted-foreground last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part C - Person/Organisation */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    C
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Person or Organisation</CardTitle>
                    <p className="text-sm text-muted-foreground">Subject of the suspicious matter report</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-muted/50 p-5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                      {data?.partC.personOrganisation.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold capitalize text-foreground">
                        {data?.partC.personOrganisation.name}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        <User className="h-3 w-3 mr-1" />
                        Individual
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Contact Information</p>
                      <div className="space-y-2">
                        {data?.partC.personOrganisation.emails.map((email, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{email}</span>
                          </div>
                        ))}
                        {data?.partC.personOrganisation.phoneNumbers.map((phone, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{phone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Other Details</p>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Accounts: {data?.partC.personOrganisation.accounts.length || "None"}</p>
                        <p>Digital Wallets: {data?.partC.personOrganisation.digitalWallets.length || "None"}</p>
                        <p>Beneficial Owners: {data?.partC.personOrganisation.beneficialOwners.length || "None"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part D - Other Parties */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm">
                    D
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Other Parties</CardTitle>
                    <p className="text-sm text-muted-foreground">Additional parties involved in the matter</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {data?.partD.hasOtherParties
                      ? `${data?.partD.otherParties.length} other parties identified`
                      : "No other parties identified"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Part E - Unidentified Persons */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm">
                    E
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Unidentified Persons</CardTitle>
                    <p className="text-sm text-muted-foreground">Unknown individuals related to the matter</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  <UserX className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {data?.partE.hasUnidentifiedPersons
                      ? `${data?.partE.unidentifiedPersons.length} unidentified persons`
                      : "No unidentified persons"}
                  </p>
                </div>
                <div>
                  {data?.partE.unidentifiedPersons.map((person, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl  p-4">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{person.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Part F - Transactions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                    F
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Transaction Details</CardTitle>
                    <p className="text-sm text-muted-foreground">Financial transactions under investigation</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {data?.partF.transactions.map((transaction, index) => (
                  <div key={index} className="rounded-xl bg-muted/50 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-primary" />
                        <Badge variant="secondary" className="font-medium capitalize">
                          {transaction.type}
                        </Badge>
                      </div>
                      <span className="text-2xl font-bold text-foreground">
                        {formatCurrency(transaction.totalAmount.amount, transaction.totalAmount.currencyCode)}
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-medium text-foreground">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Currency</p>
                          <p className="text-sm font-medium text-foreground">{transaction.totalAmount.currencyCode}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Reference</p>
                          <p className="font-mono text-sm font-medium text-foreground">{transaction.referenceNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Part G - Additional Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm">
                    G
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Additional Information</CardTitle>
                    <p className="text-sm text-muted-foreground">Likely offences, previous reports, and attachments</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                    <FileWarning className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Likely Offences</p>
                      <p className="text-sm font-medium text-foreground">
                        {data?.partG.likelyOffence.length || "None specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Previous Reports</p>
                      <p className="text-sm font-medium text-foreground">
                        {data?.partG.previousReports.length || "None"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Other Government Bodies</p>
                      <p className="text-sm font-medium text-foreground">
                        {data?.partG.otherGovernmentBodies.length || "None"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Attachments</p>
                      <p className="text-sm font-medium text-foreground">{data?.partG.attachments.length || "None"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part H - Reporting Entity */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm">
                    H
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Reporting Entity</CardTitle>
                    <p className="text-sm text-muted-foreground">Organisation submitting this report</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{data?.partH.reportingEntity?.name || "Not specified"}</p>
                </div>
                {/* address */}
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{formatAddress(data?.partH?.reportingEntity?.address)}</p>
                </div>
                {/* completed by */}
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {/* name, job title, phone, emai */}
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm text-muted-foreground font-semibold">{data?.partH?.reportingEntity?.completedBy?.name || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Job Title</p>
                      <p className="text-sm text-muted-foreground font-semibold">{data?.partH?.reportingEntity?.completedBy?.jobTitle || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground font-semibold">{data?.partH?.reportingEntity?.completedBy?.phone || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm text-muted-foreground font-semibold">{data?.partH?.reportingEntity?.completedBy?.email || "Not specified"}</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Workflow History */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Activity Timeline</CardTitle>
                    <p className="text-sm text-muted-foreground">Workflow history and status changes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.metadata?.workflowHistory?.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      {index !== data?.metadata.workflowHistory.length - 1 && (
                        <div className="absolute left-[7px] top-6 h-full w-px bg-border" />
                      )}
                      <div className="relative z-10 mt-1 h-4 w-4 rounded-full border-2 border-primary bg-card" />
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium capitalize text-foreground">{event.action}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                        {event.notes && <p className="mt-1 text-xs text-muted-foreground">{event.notes}</p>}
                        {event.toStatus && (
                          <Badge variant="secondary" className="mt-2 text-xs capitalize">
                            → {event.toStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </UILoader>
  )
}
