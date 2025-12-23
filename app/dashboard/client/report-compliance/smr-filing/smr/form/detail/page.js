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
  Receipt,
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
                <p className="text-sm text-muted-foreground">Suspicious Matter Report</p>
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

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Grounds for Suspicion */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <CardTitle className="text-lg font-semibold">Grounds for Suspicion</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {data?.partB.groundsForSuspicion.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-sm leading-relaxed text-muted-foreground last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <ArrowRightLeft className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">Transaction Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {data?.partF.transactions.map((transaction, index) => (
                    <div key={index} className="rounded-xl bg-muted/50 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <Badge variant="secondary" className="font-medium capitalize">
                          {transaction.type}
                        </Badge>
                        <span className="text-2xl font-bold text-foreground">
                          {formatCurrency(transaction.totalAmount.amount, transaction.totalAmount.currencyCode)}
                        </span>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid gap-4 sm:grid-cols-2">
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
                        <div className="flex items-start gap-3 sm:col-span-2">
                          <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Reference Number</p>
                            <p className="font-mono text-sm font-medium text-foreground">{transaction.referenceNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Person/Organisation */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">Subject</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
                      {data?.partC.personOrganisation.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium capitalize text-foreground">{data?.partC.personOrganisation.name}</p>
                      <p className="text-sm text-muted-foreground">Individual</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    {data?.partC.personOrganisation.emails.map((email, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{email}</span>
                      </div>
                    ))}
                    {data?.partC.personOrganisation.phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{phone}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Status */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/20">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <CardTitle className="text-lg font-semibold">Service Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="outline"
                    className="border-success bg-success/10 text-success-foreground capitalize px-3 py-1"
                  >
                    {data?.partA.serviceStatus}
                  </Badge>
                </CardContent>
              </Card>

              {/* Workflow History */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold">Activity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.metadata.workflowHistory.map((event, index) => (
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

              {/* Other Parties */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Other Parties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {data?.partD.hasOtherParties ? "Additional parties involved" : "No other parties identified"}
                  </p>
                </CardContent>
              </Card>

              {/* Unidentified Persons */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Unidentified Persons</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {data?.partE.hasUnidentifiedPersons ? "Unidentified persons present" : "No unidentified persons"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </UILoader>
  )
}
