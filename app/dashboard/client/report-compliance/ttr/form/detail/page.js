"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Building2, Calendar, FileText, User, Wallet } from "lucide-react"
import { getTTRById } from "../../actions";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TransactionDetails() {
  const [reportData, setReportData] = useState(null);
  const id = useSearchParams().get('id');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTTRById(id);
        console.log('response', response);
        setReportData(response?.data);
      } catch (error) {
        console.error('error', error);
      }
    }
    fetchData();
  }, [id])



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount, currencyCode) => {
    return `${currencyCode} $${amount?.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Transaction Report</h1>
              <Badge variant={reportData?.status === "draft" ? "secondary" : "default"}>
                {reportData?.status?.toUpperCase()}
              </Badge>
            </div>
            <p className="mt-2  text-muted-foreground">
              Reference Number: <span className="font-medium text-foreground">{reportData?.referenceNumber}</span>
            </p>
          </div>
          <div className="flex items-center gap-2  text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Completed: {formatDate(reportData?.completionDate)}</span>
          </div>
        </div>

        {/* Part A: Customer Information */}
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-accent" />
              Part A: Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reportData?.partA?.map((part, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className=" text-xs text-muted-foreground">Full Name</p>
                    <p className=" font-semibold text-xs">{part?.customers?.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className=" font-medium text-muted-foreground">Date of Birth</p>
                    <p className=" font-semibold text-xs">{formatDate(part?.customers?.dateOfBirth)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className=" font-medium text-muted-foreground">Occupation</p>
                    <p className=" font-semibold text-xs">{part?.customers?.occupation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className=" font-medium text-muted-foreground">Business Structure</p>
                    <p className=" capitalize font-semibold text-xs">{part?.customers?.businessStructure}</p>
                  </div>
                  <div className="space-y-1">
                    <p className=" font-medium text-muted-foreground">ABN</p>
                    <p className=" font-semibold text-xs">{part?.customers?.abn}</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                  <p className=" font-medium text-foreground">Business Address</p>
                  <p className=" text-muted-foreground">
                    {part?.customers?.businessAddress?.fullStreetAddress}
                    <br />
                    {part?.customers?.businessAddress?.city}, {part?.customers?.businessAddress?.state}{" "}
                    {part?.customers?.businessAddress?.postcode}
                    <br />
                    {part?.customers?.businessAddress?.country}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className=" font-medium text-muted-foreground">Phone Numbers</p>
                    <p className=" font-semibold text-xs">{part?.customers?.phoneNumbers?.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className=" font-medium text-muted-foreground">Email Addresses</p>
                    <p className=" font-semibold text-xs">{part?.customers?.emailAddresses?.join(", ")}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className=" font-medium text-muted-foreground">Transaction Conduct Method</p>
                  <p className=" capitalize font-semibold text-xs">{part?.transactionConductMethod}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Part B: Transaction Conductor */}
        <Card className="border-l-4 border-l-chart-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-chart-2" />
              Part B: Transaction Conductor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Type</p>
                <p className=" capitalize font-semibold text-xs">{reportData?.partB?.type}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Full Name</p>
                <p className=" font-semibold text-xs">{reportData?.partB?.details?.fullName}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Date of Birth</p>
                <p className=" font-semibold text-xs">{formatDate(reportData?.partB?.details?.dateOfBirth)}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Occupation</p>
                <p className=" font-semibold text-xs">{reportData?.partB?.details?.occupation}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Relationship to Customer</p>
                <p className=" capitalize font-semibold text-xs">
                  {reportData?.partB?.details?.relationshipToCustomer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Part C: Transaction Details */}
        <Card className="border-l-4 border-l-chart-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wallet className="h-5 w-5 text-chart-3" />
              Part C: Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Transaction Date</p>
                <p className=" font-semibold text-xs">{formatDate(reportData?.partC?.transaction?.date)}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Reference Number</p>
                <p className=" font-semibold text-xs">{reportData?.partC?.transaction?.referenceNumber}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Designated Service</p>
                <p className=" capitalize font-semibold text-xs">
                  {reportData?.partC?.transaction?.designatedService?.replace("-", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Total Amount</p>
                <p className=" font-semibold text-xs">
                  {formatCurrency(
                    reportData?.partC?.transaction?.totalAmount?.amount,
                    reportData?.partC?.transaction?.totalAmount?.currencyCode,
                  )}
                </p>
              </div>
            </div>

            {/* Transaction Flow Visualization */}
            <div className="rounded-lg bg-muted/30 p-6">
              <p className="mb-4  font-medium text-foreground">Transaction Flow</p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2 rounded-lg bg-card p-4 border border-border">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Money Received</p>
                  <p className="text-2xl font-bold text-chart-3">
                    {formatCurrency(
                      reportData?.partC?.transaction?.moneyReceived?.australianDollars?.amount,
                      reportData?.partC?.transaction?.moneyReceived?.australianDollars?.currencyCode,
                    )}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1 space-y-2 rounded-lg bg-card p-4 border border-border">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Money Provided</p>
                  <p className="text-2xl font-bold text-chart-1">
                    {formatCurrency(
                      reportData?.partC?.transaction?.moneyProvided?.australianDollars?.amount,
                      reportData?.partC?.transaction?.moneyProvided?.australianDollars?.currencyCode,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              <p className=" font-medium text-foreground">Recipients</p>
              {reportData?.partC?.recipients?.map((recipient, index) => (
                <div key={index} className="rounded-lg border border-border bg-card p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                      <p className=" font-semibold text-xs">{recipient?.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Occupation</p>
                      <p className=" font-semibold text-xs">{recipient?.occupation}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Is Customer</p>
                      <p className=" font-semibold text-xs">{recipient?.isCustomer ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Part D: Reporting Entity */}
        <Card className="border-l-4 border-l-chart-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-chart-4" />
              Part D: Reporting Entity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Entity Name</p>
                <p className=" font-semibold text-xs">{reportData?.partD?.name}</p>
              </div>
              <div className="space-y-1">
                <p className=" font-medium text-muted-foreground">Identification Number</p>
                <p className=" font-semibold text-xs">{reportData?.partD?.identificationNumber}</p>
              </div>
            </div>

            {/* Branch Information */}
            <div className="space-y-3 rounded-lg bg-muted/30 p-4">
              <p className=" font-medium text-foreground">Branch Information</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Branch Name</p>
                  <p className=" font-semibold text-xs">{reportData?.partD?.branch?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Branch ID</p>
                  <p className=" font-semibold text-xs">{reportData?.partD?.branch?.identificationNumber}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Branch Address</p>
                <p className=" font-semibold text-xs">
                  {reportData?.partD?.branch?.address?.fullStreetAddress}
                  <br />
                  {reportData?.partD?.branch?.address?.city}, {reportData?.partD?.branch?.address?.state}{" "}
                  {reportData?.partD?.branch?.address?.postcode}
                </p>
              </div>
            </div>

            {/* Person Completing */}
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className=" font-medium text-foreground">Person Completing Report</p>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Name</p>
                  <p className=" font-semibold text-xs">{reportData?.partD?.personCompleting?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Job Title</p>
                  <p className=" font-semibold text-xs">{reportData?.partD?.personCompleting?.jobTitle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Phone</p>
                  <p className=" font-semibold text-xs">{reportData?.partD?.personCompleting?.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className=" font-semibold text-xs">{reportData?.partD?.personCompleting?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
