'use client'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getGFSById } from '../../actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Globe,
  Shield,
  Database,
} from "lucide-react"


export default function GFSFormDetailPage() {
  const id = useSearchParams().get('id');
  const [data, setData] = useState(null);
  console.log('data', data);

  const getData = async () => {
    try {
      const response = await getGFSById(id);
      setData(response?.data);
    } catch (error) {
      console.error('error', error);
    }
  }

  useEffect(() => {
    getData();
  }, [id]);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Suspicion Investigation Report</h1>
              <p className="mt-2 text-muted-foreground">Detailed review of suspicious activity</p>
            </div>
            <Badge variant="destructive" className="mt-1 flex items-center gap-1.5 px-3 py-1.5">
              <AlertCircle className="h-4 w-4" />
              Under Review
            </Badge>
          </div>
        </div>

        {/* Suspicion Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Suspicion Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Suspicion Type" value={data?.suspicionType} />
              <InfoField label="Suspicion Reason" value={data?.suspicionReason} />
              <InfoField label="Suspicion Dates" value={data?.suspicionDates} />
              <InfoField label="Total Deposited" value={`$${data?.totalDeposited.toLocaleString()}`} icon={DollarSign} />
              <InfoField
                label="Total Suspicion Amount"
                value={`$${data?.totalSuspicionAmount.toLocaleString()}`}
                icon={DollarSign}
              />
              <InfoField
                label="Review Period"
                value={`${data?.reviewStartDate} to ${data?.reviewEndDate}`}
                icon={Calendar}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Customer Name" value={data?.customerName} />
              <InfoField label="Customer UID" value={data?.customerUID} />
              <InfoField label="Company Name" value={data?.companyName} icon={Building2} />
              <InfoField label="Age" value={data?.customerAge} />
              <InfoField label="Account Opening Date" value={data?.accountOpeningDate} icon={Calendar} />
              <InfoField label="Source of Funds" value={data?.sourceOfFunds} />
            </div>
            <Separator className="my-4" />
            <InfoField label="Account Opening Purpose" value={data?.accountOpeningPurpose} />
          </CardContent>
        </Card>

        {/* OFIS Reports */}
        {data?.ofis.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                OFIS Reports ({data?.ofis.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.ofis.map((ofi) => (
                  <div key={ofi.id} className="rounded-lg border bg-muted/30 p-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Report Name</p>
                        <p className="mt-1 font-semibold">{ofi?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Report Date</p>
                        <p className="mt-1 font-semibold">{ofi?.reportDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Scam Type</p>
                        <p className="mt-1 font-semibold">{ofi.scamType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        {data?.transactions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transactions ({data?.transactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.transactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-lg border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="outline">{transaction?.type}</Badge>
                      <span className="text-xl font-bold">${transaction?.amount.toLocaleString()}</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="mt-1 font-medium">{transaction?.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">From Bank</p>
                        <p className="mt-1 font-medium">{transaction?.fromBank}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">From Name</p>
                        <p className="mt-1 font-medium">{transaction?.fromName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reference</p>
                        <p className="mt-1 font-medium font-mono text-sm">{transaction?.reference}</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">From Account</p>
                        <p className="mt-1 font-medium font-mono text-sm">{transaction?.fromAccount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">To Account</p>
                        <p className="mt-1 font-medium font-mono text-sm">{transaction?.toAccount}</p>
                      </div>
                    </div>
                    {transaction?.cryptoAddress && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">Crypto Address</p>
                        <p className="mt-1 font-medium font-mono text-sm break-all">{transaction.cryptoAddress}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Crypto Addresses */}
          {data?.cryptoAddresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Crypto Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.cryptoAddresses.map((address, index) => (
                    <div key={index} className="rounded-md bg-muted p-3">
                      <p className="font-mono text-sm break-all">{address}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* IP Addresses */}
          {data?.ipAddresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  IP Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.ipAddresses.map((ip) => (
                    <div key={ip.id} className="rounded-lg border bg-muted/30 p-3">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="mt-1 font-medium font-mono text-sm">{ip?.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Country</p>
                          <p className="mt-1 font-medium">{ip?.country}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="mt-1 font-medium">{ip?.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Notes */}
        {data?.additionalNotes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data?.additionalNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="font-medium">{value}</p>
    </div>
  )
}