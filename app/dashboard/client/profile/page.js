'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLoggedInUserStore } from "@/app/store/useLoggedInUser"
import { Mail, Phone, Globe, MapPin, FileText, Building2, Calendar } from "lucide-react"



export default function CustomerProfile() {
    const { loggedInUser: userData } = useLoggedInUserStore()
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-border bg-muted">
            <img
              src={userData?.photoUrl || "/placeholder.svg"}
              alt={userData?.name}
              className="h-full w-full object-cover"
            />
            {userData.isActive && (
              <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{userData?.userName}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{userData?.name}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {userData?.role}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {userData?.userType}
            </Badge>
            <Badge variant="default" className={userData.isActive ? "bg-green-600" : "bg-gray-600"}>
              {userData?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex flex-col gap-2  text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${userData?.email}`} className="hover:text-foreground transition-colors">
                {userData?.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Member since {formatDate(userData?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Organization Section */}
      {userData?.client && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Building2 className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold text-foreground">Organization</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Info Card */}
            <Card className="p-6 space-y-4 bg-card">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Company Details</h3>
                <div className="space-y-3">
                  <DataRow label="Company Name" value={userData?.client?.name} />
                  <DataRow label="Type" value={userData?.client?.clientType} />
                  <DataRow label="Registration" value={userData?.client?.registrationNumber} />
                  <DataRow label="Tax ID" value={userData?.client?.taxId} />
                  <DataRow label="Industry" value={userData?.client?.metadata?.industry} />
                  <div className="flex items-center justify-between pt-2">
                    <span className=" text-muted-foreground">Status</span>
                    <Badge variant="default" className="bg-green-600">
                      {userData?.client?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info Card */}
            <Card className="p-6 space-y-4 bg-card">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className=" text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${userData?.client?.email}`}
                        className="font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        {userData?.client?.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className=" text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${userData?.client?.phone}`}
                        className=" font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        {userData?.client?.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className=" text-muted-foreground">Website</p>
                      <a
                        href={userData?.client?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        {userData?.client?.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className=" text-muted-foreground">Address</p>
                      <p className=" font-semibold text-foreground">
                        {userData?.client?.address?.street}
                        <br />
                        {userData?.client?.address?.city}, {userData?.client?.address?.state}
                        <br />
                        {userData?.client?.address?.country} {userData?.client?.address?.zipcode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Primary Contact Card */}
            {userData.client.contacts[0] && (
              <Card className="p-6 space-y-4 bg-card">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Primary Contact</h3>
                    {userData.client.contacts[0].primary && <Badge variant="secondary">Primary</Badge>}
                  </div>
                  <div className="space-y-3">
                    <DataRow label="Name" value={userData.client.contacts[0].name} />
                    <DataRow label="Title" value={userData.client.contacts[0].title} />
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${userData.client.contacts[0].email}`}
                        className=" text-foreground hover:text-accent transition-colors"
                      >
                        {userData.client.contacts[0].email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${userData.client.contacts[0].phone}`}
                        className=" text-foreground hover:text-accent transition-colors"
                      >
                        {userData.client.contacts[0].phone}
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Legal Representative Card */}
            <Card className="p-6 space-y-4 bg-card">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Legal Representative</h3>
                <div className="space-y-3">
                  <DataRow label="Name" value={userData.client.legalRepresentative.name} />
                  <DataRow label="Designation" value={userData.client.legalRepresentative.designation} />
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${userData.client.legalRepresentative.email}`}
                      className=" text-foreground hover:text-accent transition-colors"
                    >
                      {userData.client.legalRepresentative.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${userData.client.legalRepresentative.phone}`}
                      className=" text-foreground hover:text-accent transition-colors"
                    >
                      {userData.client.legalRepresentative.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Documents Section */}
          {userData.client.documents && userData.client.documents.length > 0 && (
            <Card className="p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">Documents</h3>
              </div>
              <div className="space-y-3">
                {userData.client.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className=" font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc?.type} • Uploaded {formatDate(doc?.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Settings Card */}
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <DataRow label="Billing Cycle" value={userData.client.settings.billingCycle} className="capitalize" />
              <DataRow label="Currency" value={userData?.client?.settings?.currency} />
              <DataRow label="Source" value={userData?.client?.metadata?.source} className="capitalize" />
            </div>
          </Card>
        </div>
      )}
    </div>
  </div>
  )
}
function DataRow({ label, value, className = "" }) {
  return (
    <div className="flex items-center justify-between">
      <span className=" text-muted-foreground">{label}</span>
      <span className={` font-medium text-foreground ${className}`}>{value}</span>
    </div>
  )
}