"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { IconAlertSquare, } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import TransactionReportingModal from './ReportingModal';
import { getTransactionById } from '@/app/dashboard/client/transactions/actions';
import {
  Shield,
  AlertCircle,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Building2,
  Calendar,
  FileText,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TransactionDetailView = ({ open, setOpen, currentItem }) => {
  console.log('currentItem', currentItem);
  const [viewReport, setViewReport] = useState(false);
  const [customer, setCustomer] = useState(null);

  console.log('customer', customer);
  useEffect(() => {

    if (currentItem) {
      fetchDetails();
    }
  }, [currentItem]);

  const fetchDetails = async () => {
    const details = await getTransactionById(currentItem?._id);
    setCustomer(details?.data || null);
  }

  const metaData = [
    {
      name: 'Total Debits',
      value: '13690.00',
    },
    {
      name: 'Total Credits',
      value: '78640.00',
    },
    {
      name: 'Net Flow',
      value: '587690.00',
    },
    {
      name: 'Avg. Transaction Value',
      value: '250.40',
    }

  ]
  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Transaction ID',
      accessorKey: 'ref',
    },
    {
      header: 'Type',
      accessorKey: 'method',
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
    },
    {
      header: 'Balance',
      accessorKey: 'amount',
    },


  ]
  const data = [];

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto '>
        <SheetHeader>
          <SheetTitle>Detail View</SheetTitle>
          <SheetDescription>
            View the detail view here.
          </SheetDescription>
        </SheetHeader>
        {/* <div className='px-8 py-4 space-y-4'>
          <div className='flex justify-between border rounded-md p-4'>
            <div className='flex  gap-4 '>
              <div className='size-20 rounded-full overflow-hidden'>
                <img src="/profile.png" alt="" className='w-full h-full object-cover' />
              </div>
              <div>
                <h4 className='text-lg font-bold relative w-max pr-2'>{currentItem?.name}
                  <div className='absolute -top-1 left-full'>
                    <Badge variant="success">
                      Verified
                    </Badge>
                  </div>
                </h4>
                <p className='font-mono text-neutral-700'>Customer ID: C-10045 </p>


              </div>
            </div>
            <div className='flex gap-8'>
              <div className='flex flex-col  items-center'>
                <h4 className='text-xs text-muted-foreground uppercase'>Account No</h4>
                <p className='font-mono text-xl text-center'>1234567890</p>
              </div>
              <div className='flex flex-col  items-center'>
                <h4 className='text-xs text-muted-foreground uppercase'>Current Balance</h4>
                <p className='font-mono text-xl text-center'>AUD 8,420.50</p>
              </div>
              <div className='flex flex-col  items-center'>
                <h4 className='text-xs text-muted-foreground uppercase'>Total Transactions</h4>
                <p className='font-mono text-xl text-center'>120</p>
              </div>
            </div>
          </div>
          <Alert variant="destructive">
            <IconAlertSquare />
            <AlertTitle className={'font-semibold'}>Risk Alert!</AlertTitle>
            <AlertDescription >
              Unusual Activity Detected - High Risk Score
            </AlertDescription>
          </Alert>
          <div className='space-y-2'>
            <div>
              <h4 className='text-lg font-semibold'>30 day activity</h4>
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {metaData.map((item) => (
                <div key={item.name} className='flex flex-col  w-full border rounded-md gap-8 p-4'>
                  <h4 className='text-xs text-muted-foreground uppercase'>{item.name}</h4>
                  <p className='font-mono text-xl '>AUD {item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='space-y-2'>
            <h4 className='text-lg font-semibold'>Transaction History</h4>
            <div>

              <ResizableTable columns={columns} data={data} />
            </div>
          </div>
        </div> */}
        <div className='grid grid-cols-2 gap-4 px-4'>
          {/* Sender */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4" />
              <p className="text-sm font-medium">SENDER</p>
            </div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3">
              <div>
                <p className=" font-semibold text-balance">
                  {customer?.client?.name}{" "}

                </p>
                <p className="text-sm text-muted-foreground">
                  {customer?.sender?.name}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                {/* <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {customer.personalKyc.personal_form.contact_details.email}
                  </span>
                </div> */}
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {customer?.sender?.account}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {customer?.sender?.address || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Receiver */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4" />
              <p className="text-sm font-medium">RECEIVER</p>
            </div>
            <div className="rounded-lg bg-secondary/50 border p-4 space-y-3">
              <div>
                <p className=" font-semibold text-balance">{customer?.receiver?.institution}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {customer?.receiver?.name}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">

                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {customer?.receiver?.account}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-px w-12 bg-border" />
            <span className="font-medium">Amount: ${customer?.amount}</span>
            <div className="h-px w-12 bg-border" />
          </div>
        </div>


        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b bg-muted/30">
            <div className=" px-4 py-6 lg:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-balance">Transaction Details</h1>
                  <p className="mt-2 text-sm text-muted-foreground">ID: {customer?.uid}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={customer?.status ? "destructive" : "secondary"} className="h-7">
                    {customer?.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className=" px-4 py-8 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Forensic Analysis */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="size-5 text-primary" />
                      <CardTitle>Security Analysis</CardTitle>
                    </div>
                    <CardDescription>Automated security screening results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Wallet Cluster</p>
                        <p className="mt-1 font-mono text-sm">{customer?.forensic?.walletCluster}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${customer?.forensic?.chainalysisScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{customer?.forensic?.chainalysisScore}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Analysis Notes</p>
                      <p className="mt-1 text-sm">{customer?.forensic?.notes}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information Tabs */}
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="employment">Employment</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <User className="size-5 text-primary" />
                          <CardTitle>Personal Information</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="mt-1">
                              {customer?.personalKyc?.personal_form?.customer_details?.given_name}{" "}
                              {customer?.personalKyc?.personal_form?.customer_details?.middle_name}{" "}
                              {customer?.personalKyc?.personal_form?.customer_details?.surname}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Also Known As</p>
                            <p className="mt-1">
                              {customer?.personalKyc?.personal_form?.customer_details?.other_names || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                            <p className="mt-1">
                              {formatDate(customer?.personalKyc?.personal_form?.customer_details?.date_of_birth)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Referral Source</p>
                            <p className="mt-1">{customer?.personalKyc?.personal_form?.customer_details?.referral}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Phone className="size-4" />
                            Contact Details
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-start gap-2">
                              <Mail className="size-4 mt-0.5 text-muted-foreground" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="mt-0.5 text-sm truncate">
                                  {customer?.personalKyc?.personal_form?.contact_details?.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="size-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p className="mt-0.5 text-sm">{customer?.personalKyc?.personal_form?.contact_details?.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="size-4" />
                            Residential Address
                          </h4>
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm">{customer?.personalKyc?.personal_form?.residential_address?.address}</p>
                            <p className="mt-1 text-sm">
                              {customer?.personalKyc?.personal_form?.residential_address?.suburb},{" "}
                              {customer?.personalKyc?.personal_form?.residential_address?.state}{" "}
                              {customer?.personalKyc?.personal_form?.residential_address?.postcode}
                            </p>
                            <p className="mt-1 text-sm font-medium">
                              {customer?.personalKyc?.personal_form?.residential_address?.country}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="employment" className="mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Briefcase className="size-5 text-primary" />
                          <CardTitle>Employment Information</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                            <p className="mt-1 text-lg font-medium">
                              {customer?.personalKyc?.personal_form?.employment_details?.occupation}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Industry</p>
                            <p className="mt-1 text-lg font-medium">
                              {customer?.personalKyc?.personal_form?.employment_details?.industry}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Employer</p>
                            <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                              <Building2 className="size-5 text-muted-foreground" />
                              <p className="font-medium">
                                {customer?.personalKyc?.personal_form?.employment_details?.employer_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financial" className="mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <FileText className="size-5 text-primary" />
                          <CardTitle>Financial Information</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Source of Funds</p>
                            <p className="mt-1">{customer?.personalKyc?.funds_wealth?.source_of_funds}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Source of Wealth</p>
                            <p className="mt-1">{customer?.personalKyc?.funds_wealth?.source_of_wealth}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Account Purpose</p>
                            <p className="mt-1">{customer?.personalKyc?.funds_wealth?.account_purpose}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Estimated Trading Volume</p>
                            <p className="mt-1 text-lg font-semibold">
                              $
                              {Number.parseInt(customer?.personalKyc?.funds_wealth?.estimated_trading_volume).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Declaration */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="size-5 text-primary" />
                      <CardTitle>Declaration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge
                        variant={customer?.declaration?.declarations_accepted ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {customer?.declaration?.declarations_accepted ? "Accepted" : "Pending"}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Signatory</p>
                      <p className="mt-1 font-medium">{customer?.declaration?.signatory_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date Signed</p>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-muted-foreground" />
                        {formatDate(customer?.declaration?.date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Relations */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="size-5 text-primary" />
                      <CardTitle>Relations</CardTitle>
                    </div>
                    <CardDescription>Connected client accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customer?.relations?.slice(0, 3).map((relation, index) => (
                        <div key={index} className="rounded-lg border p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {relation.type}
                            </Badge>
                            {relation.active && (
                              <div className="flex items-center gap-1">
                                <div className="size-2 rounded-full bg-green-500" />
                                <span className="text-xs text-muted-foreground">Active</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Source: <span className="font-medium text-foreground">{relation.source}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">Registered: {formatDate(relation.registeredAt)}</p>
                        </div>
                      ))}
                      {customer?.relations?.length > 3 && (
                        <p className="text-center text-xs text-muted-foreground pt-2">
                          +{customer?.relations?.length - 3} more relations
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Transaction Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Transaction ID</p>
                      <p className="mt-1 font-mono text-xs break-all">{customer?.uid}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sequence</p>
                      <p className="mt-1 font-semibold">{customer?.sequence}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
      <TransactionReportingModal open={viewReport} setOpen={setViewReport} />
    </Sheet>
  )
}
export default TransactionDetailView;