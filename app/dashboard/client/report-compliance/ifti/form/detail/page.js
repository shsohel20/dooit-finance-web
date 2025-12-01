'use client'
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRightLeft,
  User,
  Building2,
  FileText,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getIFTIById } from "../../actions"


function formatIntermediaryTitle(key) {
  const titles = {
    acceptingInstruction: "Accepting Instruction",
    acceptingMoney: "Accepting Money",
    sendingInstruction: "Sending Instruction",
    receivingInstruction: "Receiving Instruction",
    distributingMoney: "Distributing Money",
    retailOutlet: "Retail Outlet",
  }
  return titles[key] || key
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-2">
      {icon && <div className="text-muted-foreground mt-0.5">{icon}</div>}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
        <dt className=" font-medium text-muted-foreground">{label}</dt>
        <dd className=" md:col-span-2 font-medium text-card-foreground">{value || "—"}</dd>
      </div>
    </div>
  )
}

export default function TransactionDetails() {
  const id = useSearchParams().get('id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await getIFTIById(id);
        setData(response?.data);
      } catch (error) {
        console.error('error', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 max-w-6xl mx-auto">
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transaction Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1">
                <InfoRow
                  label="Total Amount"
                  value={`${data?.transaction?.totalAmount} ${data?.transaction?.currencyCode}`}
                  icon={<CreditCard className="h-4 w-4" />}
                />
                <Separator className="my-2" />
                <InfoRow
                  label="Date Received"
                  value={data?.transaction?.dateReceived}
                  icon={<Calendar className="h-4 w-4" />}
                />
                <InfoRow
                  label="Date Available"
                  value={data?.transaction?.dateAvailable}
                  icon={<Calendar className="h-4 w-4" />}
                />
                <Separator className="my-2" />
                <InfoRow label="Transfer Type" value={data?.transaction?.transferType || "Standard Transfer"} />
              </dl>
            </CardContent>
          </Card>

          {/* Ordering Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Ordering Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1">
                <InfoRow label="Full Name" value={data?.orderingCustomer?.fullName} icon={<User className="h-4 w-4" />} />
                <Separator className="my-2" />
                <InfoRow label="Address" value={data?.orderingCustomer?.address} icon={<MapPin className="h-4 w-4" />} />
                <InfoRow label="City" value={data?.orderingCustomer?.city} />
                <InfoRow label="State" value={data?.orderingCustomer?.state} />
                <InfoRow label="Postcode" value={data?.orderingCustomer?.postcode} />
                <InfoRow label="Country" value={data?.orderingCustomer?.country} />
                <Separator className="my-2" />
                <InfoRow label="Phone" value={data?.orderingCustomer?.phone} icon={<Phone className="h-4 w-4" />} />
                <InfoRow label="Email" value={data?.orderingCustomer?.email} icon={<Mail className="h-4 w-4" />} />
                <InfoRow label="Occupation" value={data?.orderingCustomer?.occupation} />
              </dl>
            </CardContent>
          </Card>

          {/* Beneficiary Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Beneficiary Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1">
                <InfoRow
                  label="Full Name"
                  value={data?.beneficiaryCustomer?.fullName}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoRow
                  label="Account Number"
                  value={data?.beneficiaryCustomer?.accountNumber}
                  icon={<CreditCard className="h-4 w-4" />}
                />
                <Separator className="my-2" />
                <InfoRow
                  label="Address"
                  value={data?.beneficiaryCustomer?.address}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <InfoRow label="City" value={data?.beneficiaryCustomer?.city} />
                <InfoRow label="Country" value={data?.beneficiaryCustomer?.country} />
              </dl>
            </CardContent>
          </Card>

          {/* Intermediaries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Intermediaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data?.intermediaries?.map((intermediary, index) => (
                  <div key={intermediary?.key}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="mb-3">
                      <h3 className="font-semibold text-base flex items-center gap-2">
                        {formatIntermediaryTitle(intermediary?.key)}
                        {intermediary.present && (
                          <Badge variant="outline" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </h3>
                    </div>
                    <dl className="space-y-1 pl-0 md:pl-4">
                      <InfoRow label="Name" value={intermediary.fullName} />
                      <InfoRow label="Address" value={intermediary?.address} />
                      <InfoRow label="City" value={intermediary?.city} />
                      <InfoRow label="State" value={intermediary?.state} />
                      <InfoRow label="Postcode" value={intermediary?.postcode} />
                      <InfoRow label="Country" value={intermediary?.country} />
                    </dl>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Report Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1">
                <InfoRow label="Transfer Reason" value={data?.reportCompletion?.transferReason} />
                <Separator className="my-3" />
                <div className="mb-2">
                  <h4 className="text-sm font-semibold">Completed By</h4>
                </div>
                <InfoRow
                  label="Full Name"
                  value={data?.reportCompletion?.completedBy?.fullName}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoRow label="Job Title" value={data?.reportCompletion?.completedBy?.jobTitle} />
                <InfoRow
                  label="Phone"
                  value={data?.reportCompletion?.completedBy?.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoRow
                  label="Email"
                  value={data?.reportCompletion?.completedBy?.email}
                  icon={<Mail className="h-4 w-4" />}
                />
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
