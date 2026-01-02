"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  User,
  MapPin,
  Scale,
  FileText,
  Settings,
  Upload,
  Trash2,
  Plus,
  ArrowLeft,
  Save,
  Globe,
  Mail,
  Phone,
  Camera,
} from "lucide-react"
import { useLoggedInUserStore } from "@/app/store/useLoggedInUser"


export function ClientEditForm() {
  const { loggedInUser: formData, bindLoggedInUser } = useLoggedInUserStore();
  console.log('formData', JSON.stringify(formData, null, 2));
  console.log('bindLoggedInUser', bindLoggedInUser);
  const [activeTab, setActiveTab] = useState("company")
  const updateNestedField = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    const newObj = structuredClone(obj || {});
    let current = newObj;

    keys.forEach((key) => {
      if (!current[key]) current[key] = {};
      current = current[key];
    });

    current[lastKey] = value;
    return newObj;
  };
  const updateField = (path, value) => {
    bindLoggedInUser((prev) => {
      const keys = path.split(".")
      const newData = { ...prev }
      let current = newData
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]]) }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const navItems = [
    { id: "company", label: "Company Info", icon: Building2 },
    { id: "contacts", label: "Contacts", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "legal", label: "Legal Representative", icon: Scale },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-14 w-14 border-2 border-border">
                  <AvatarImage src={formData?.photoUrl || "/placeholder.svg"} alt={formData?.client?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {formData?.client?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 flex items-center justify-center bg-foreground/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-background" />
                </button>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{formData?.client?.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {formData?.client?.clientType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{formData?.client?.registrationNumber}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden border-b border-border bg-card px-4 py-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Company Info Section */}
            {activeTab === "company" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Company Information
                  </CardTitle>
                  <CardDescription>Basic details about the company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData?.client?.name}
                        onChange={(e) => updateField("client.name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientType">Client Type</Label>
                      <Select
                        value={formData?.client?.clientType}
                        onValueChange={(value) => updateField("client.clientType", value)}
                      >
                        <SelectTrigger id="clientType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        value={formData?.client?.registrationNumber}
                        onChange={(e) => updateField("client.registrationNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={formData?.client?.taxId}
                        onChange={(e) => updateField("client.taxId", e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData?.client?.email}
                        onChange={(e) => updateField("client.email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData?.client?.phone}
                        onChange={(e) => updateField("client.phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData?.client?.website}
                      onChange={(e) => updateField("client.website", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contacts Section */}
            {activeTab === "contacts" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Contacts
                      </CardTitle>
                      <CardDescription>Manage company contact persons</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Plus className="h-4 w-4" />
                      Add Contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData?.client?.contacts?.map((contact, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {contact?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{contact?.name}</p>
                            <p className="text-sm text-muted-foreground">{contact?.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact?.primary && (
                            <Badge variant="default" className="text-xs">
                              Primary
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={contact.name} />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input value={contact.title} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={contact.email} />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={contact.phone} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Address Section */}
            {activeTab === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Address
                  </CardTitle>
                  <CardDescription>Company location and mailing address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData?.client?.address?.street}
                      onChange={(e) => updateField("client.address.street", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData?.client?.address?.city}
                        onChange={(e) => updateField("client.address.city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input
                        id="state"
                        value={formData?.client?.address?.state}
                        onChange={(e) => updateField("client.address.state", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData?.client?.address?.country}
                        onChange={(e) => updateField("client.address.country", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipcode">Zip / Postal Code</Label>
                      <Input
                        id="zipcode"
                        value={formData?.client?.address?.zipcode}
                        onChange={(e) => updateField("client.address.zipcode", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legal Representative Section */}
            {activeTab === "legal" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Legal Representative
                  </CardTitle>
                  <CardDescription>Company legal contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="legalName">Full Name</Label>
                      <Input
                        id="legalName"
                        value={formData?.client?.legalRepresentative?.name}
                        onChange={(e) => updateField("client.legalRepresentative.name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legalDesignation">Designation</Label>
                      <Input
                        id="legalDesignation"
                        value={formData?.client?.legalRepresentative?.designation}
                        onChange={(e) => updateField("client.legalRepresentative.designation", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="legalEmail">Email</Label>
                      <Input
                        id="legalEmail"
                        type="email"
                        value={formData?.client?.legalRepresentative?.email}
                        onChange={(e) => updateField("client.legalRepresentative.email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legalPhone">Phone</Label>
                      <Input
                        id="legalPhone"
                        value={formData?.client?.legalRepresentative?.phone}
                        onChange={(e) => updateField("client.legalRepresentative.phone", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents Section */}
            {activeTab === "documents" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Documents
                      </CardTitle>
                      <CardDescription>Manage company documents and files</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Upload className="h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData?.client?.documents?.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs">
                                {doc.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload Zone */}
                  <div className="mt-4 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or images up to 10MB</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Section */}
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Settings
                  </CardTitle>
                  <CardDescription>Billing and preferences configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="billingCycle">Billing Cycle</Label>
                      <Select
                        value={formData?.client?.settings?.billingCycle}
                        onValueChange={(value) => updateField("client.settings.billingCycle", value)}
                      >
                        <SelectTrigger id="billingCycle">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData?.client?.settings?.currency}
                        onValueChange={(value) => updateField("client.settings.currency", value)}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
