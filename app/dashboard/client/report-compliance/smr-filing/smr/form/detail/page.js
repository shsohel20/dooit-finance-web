'use client'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, User, Users, Receipt, AlertTriangle, Building } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getSMRById } from "../../actions"
import { useEffect, useState } from "react"


export default function ReportDetailView() {
  const [data, setData] = useState(null);
  const id = useSearchParams().get('id');
  console.log('id', id);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSMRById(id);
      console.log('response', response);
      setData(response?.data);
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
    <div className=" p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-balance">Suspicious Matter Report</h1>
          <Badge variant={data?.status === "draft" ? "secondary" : "default"} className="text-sm px-3 py-1">
            {data?.status?.toUpperCase()}
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">Detailed view of report submission</p>
      </div>

      <div className="space-y-6">
        {/* Part A: Service and Suspicion Details */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part A: Service Details</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <InfoRow label="Service Status" value={data?.partA?.serviceStatus} />
            <InfoRow label="Designated Services" value={data?.partA?.designatedServices?.join(", ")} />
            <InfoRow label="Suspicion Reasons" value={data?.partA?.suspicionReasons?.join(", ")} highlight />
          </div>
        </Card>

        {/* Part B: Grounds for Suspicion */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part B: Grounds for Suspicion</h2>
          </div>
          <Separator className="mb-4" />
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground leading-relaxed">{data?.partB?.groundsForSuspicion}</p>
          </div>
        </Card>

        {/* Part C: Person/Organisation Details */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part C: Person/Organisation Details</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <InfoRow label="Name" value={data?.partC?.personOrganisation?.name} />
            <InfoRow label="Business Address" value={formatAddress(data?.partC?.personOrganisation?.businessAddress)} />
            <InfoRow label="Phone Numbers" value={data?.partC?.personOrganisation?.phoneNumbers?.join(", ")} />
            <InfoRow label="Email Addresses" value={data?.partC?.personOrganisation?.emails?.join(", ")} />
            <InfoRow label="Customer Status" value={data?.partC?.personOrganisation?.isCustomer ? "Yes" : "No"} />
            <InfoRow label="Date of Birth" value={formatDate(data?.partC?.personOrganisation?.dateOfBirth)} />
            <InfoRow label="Citizenship" value={data?.partC?.personOrganisation?.citizenship} />
          </div>
        </Card>

        {/* Part D: Other Parties */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part D: Other Parties</h2>
          </div>
          <Separator className="mb-4" />
          {data?.partD?.hasOtherParties ? (
            <div className="space-y-4">
              {data?.partD?.otherParties?.map((party, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground">Party {index + 1}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No other parties involved</p>
          )}
        </Card>

        {/* Part E: Unidentified Persons */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part E: Unidentified Persons</h2>
          </div>
          <Separator className="mb-4" />
          {data?.partE?.hasUnidentifiedPersons ? (
            <div className="space-y-4">
              {data?.partE?.unidentifiedPersons?.map((person, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground">Person {index + 1}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No unidentified persons</p>
          )}
        </Card>

        {/* Part F: Transactions */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part F: Transactions</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {data?.partF?.transactions?.map((transaction, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">Transaction {index + 1}</h3>
                  <Badge variant={transaction.completed ? "default" : "secondary"}>
                    {transaction.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <InfoRow label="Date" value={formatDate(transaction.date)} compact />
                  <InfoRow label="Type" value={transaction.type} compact />
                  <InfoRow label="Reference Number" value={transaction.referenceNumber} compact />
                  <InfoRow
                    label="Total Amount"
                    value={formatCurrency(transaction.totalAmount.amount, transaction.totalAmount.currencyCode)}
                    compact
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Part G: Offence and Related Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part G: Offence Information</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            <InfoRow label="Likely Offence" value={data?.partG?.likelyOffence?.join(", ")} highlight />
            <InfoRow label="Previous Reports" value={data?.partG?.previousReports?.length > 0 ? "Yes" : "None"} />
            <InfoRow
              label="Other Government Bodies Notified"
              value={data?.partG?.otherGovernmentBodies?.length > 0 ? "Yes" : "None"}
            />
            <InfoRow
              label="Attachments"
              value={data?.partG?.attachments?.length > 0 ? `${data?.partG?.attachments?.length} file(s)` : "None"}
            />
          </div>
        </Card>

        {/* Part H: Reporting Entity */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Part H: Reporting Entity</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-foreground mb-3">Entity Details</h3>
              <div className="space-y-3">
                <InfoRow label="Name" value={data?.partH?.reportingEntity?.name} />
                <InfoRow label="Address" value={formatAddress(data?.partH?.reportingEntity?.address)} />
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-foreground mb-3">Completed By</h3>
              <div className="space-y-3">
                <InfoRow label="Name" value={data?.partH?.reportingEntity?.completedBy?.name} />
                <InfoRow label="Job Title" value={data?.partH?.reportingEntity?.completedBy?.jobTitle} />
                <InfoRow label="Phone" value={data?.partH?.reportingEntity?.completedBy?.phone} />
                <InfoRow label="Email" value={data?.partH?.reportingEntity?.completedBy?.email} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}


function InfoRow({ label, value, highlight = false, compact = false }) {
  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className={`${compact ? "text-sm" : "text-base"} text-foreground ${highlight ? "font-medium" : ""}`}>
        {value}
      </dd>
    </div>
  )
}
