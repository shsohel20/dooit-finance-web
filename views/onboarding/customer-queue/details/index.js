'use client'
import { useEffect, useState } from "react";

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Shield, User, Calendar, Clock, Globe, MapPin, Phone, FileText, ChevronRight, TrendingUp, AlertCircle, CheckCircle2, BarChart3, AlertTriangle } from 'lucide-react'
import { getCustomerById } from '@/app/dashboard/client/onboarding/customer-queue/actions'
import { cn, dateShowFormat } from "@/lib/utils";

export const DetailViewModal = ({ open, setOpen, currentId }) => {
  const [details, setDetails] = useState(null);
  const currentItem = null;

  console.log('details => ', details);


  const fetchDetails = async () => {
    const response = await getCustomerById(currentId);
    if (response.success) {
      setDetails(response.data);
    }
  }

  useEffect(() => {
    if (currentId) {
      fetchDetails();
    }
  }, [currentId]);

  const riskAssessment = details?.riskAssessment || {};

  const totalRiskScore = Object.values(riskAssessment)
    .filter((item) => typeof item === "object" && "score" in item)
    .reduce((sum, item) => sum + (item).score, 0)

  const getLabelColor = (label) => {
    if (label === "Unacceptable") return "bg-destructive/15 text-destructive border-destructive/30"
    if (label === "High") return "bg-danger/15 text-danger border-danger/30"
    if (label === "Medium") return "bg-warning/15 text-warning-foreground border-warning/30"
    return "bg-success/15 text-success border-success/30"
  }
  const getRiskColor = (score) => {
    if (score === 0) return "text-success"
    if (score <= 20) return "text-success"
    if (score <= 30) return "text-warning-foreground"
    return "text-danger"
  }
  const getRiskBadgeColor = (score) => {
    if (score === 0) return "bg-muted text-muted-foreground border-border"
    if (score <= 20) return "bg-success/15 text-success border-success/30"
    if (score <= 30) return "bg-warning/15 text-warning-foreground border-warning/30"
    return "bg-danger/15 text-danger border-danger/30"
  }

  return (

    <div className='grid flex-1 auto-rows-min gap-6 '>
      <div className="">


        <div className="px-8 mx-auto ">
          {/* User Profile Section */}
          <Card className="mb-6 overflow-hidden border-border/50">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="size-16 border-2 border-primary/20">
                    <AvatarImage src="/images/image.png" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="size-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold capitalize">{
                        details?.personalKyc?.personal_form?.customer_details?.given_name + " " + details?.personalKyc?.personal_form?.customer_details?.middle_name + " " + details?.personalKyc?.personal_form?.customer_details?.surname
                      }</h2>
                      <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
                        <Clock className="size-3 mr-1" />
                        Pending Review
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{details?.personalKyc?.personal_form?.contact_details?.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Created: {dateShowFormat(details?.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        Updated: {dateShowFormat(details?.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Review Timeline</div>
                  <div className="text-2xl font-bold text-primary">27 days</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Status Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            {/* Current Status Card */}
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/50">
                      <Clock className="size-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold">Current Status</h3>
                  </div>
                  <Badge className={cn("bg-success/15 text-success hover:bg-success/20 border-success/30", details?.isActive ? 'bg-success/15 text-success hover:bg-success/20 border-success/30' : 'bg-danger/15 text-danger hover:bg-danger/20 border-danger/30')}>
                    <CheckCircle2 className="size-3 mr-1" />
                    {details?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Awaiting manual verification of address proof documentation.
                </p>
              </div>
            </Card>

            {/* Risk Assessment Card */}
            <Card className="border-border/50 hover:border-danger/30 transition-colors">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-danger/15">
                      <AlertCircle className="size-5 text-danger" />
                    </div>
                    <h3 className="font-semibold">Risk Assessment</h3>
                  </div>
                  <Badge className="bg-danger/15 text-danger hover:bg-danger/20 border-danger/30">
                    <TrendingUp className="size-3 mr-1" />
                    Risk
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Flagged for foreign transaction history requiring additional review.
                </p>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="border-border/50">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <User className="size-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Phone className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Phone Number</span>
                      </div>
                      <span className="text-sm font-mono">2347689316687</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Date of Birth</span>
                      </div>
                      <span className="text-sm">12 Aug 2025</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Globe className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Country</span>
                      </div>
                      <span className="text-sm capitalize">Afghanistan</span>
                    </div>

                    <div className="flex items-start justify-between py-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm font-medium text-muted-foreground">Address</span>
                      </div>
                      <span className="text-sm text-right max-w-xs leading-relaxed">
                        Apartment 4A, Green View Residences, 25 Wentworth Avenue, Sydney NSW 2000
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Document Verification Status */}
              <Card className="border-border/50">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    Document Verification Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-success/15">
                          <CheckCircle2 className="size-4 text-success" />
                        </div>
                        <span className="font-medium">Identity Proof</span>
                      </div>
                      <Badge className="bg-success text-success-foreground">Passed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-warning/15">
                          <Clock className="size-4 text-warning-foreground" />
                        </div>
                        <span className="font-medium">Address Proof</span>
                      </div>
                      <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-success/15">
                          <CheckCircle2 className="size-4 text-success" />
                        </div>
                        <span className="font-medium">Source of Funds Declaration</span>
                      </div>
                      <Badge className="bg-success text-success-foreground">Passed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/15">
                          <Clock className="size-4 text-primary" />
                        </div>
                        <span className="font-medium">Facial Recognition Check</span>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">Pending</Badge>
                    </div>
                  </div>

                  <Separator className="my-5" />

                  <Button variant="outline" className="w-full bg-transparent">
                    Review Upload Documents
                    <ChevronRight className="size-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Timeline & Activity */}
            <div className="space-y-6">
              {/* Onboarding Timeline */}
              <Card className="border-border/50">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    Onboarding Timeline
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Created On</div>
                      <div className="text-sm font-medium">28 Nov 2025</div>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Last Updated</div>
                      <div className="text-sm font-medium">28 Nov 2025</div>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Review Time</div>
                      <div className="text-sm font-medium">27 days</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Activity Log */}
              <Card className="border-border/50">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    Activity Log
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="p-1.5 rounded-full bg-success/15 h-fit">
                        <CheckCircle2 className="size-3 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Identity verified</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-1.5 rounded-full bg-warning/15 h-fit">
                        <Clock className="size-3 text-warning-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Address proof pending</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-1.5 rounded-full bg-primary/15 h-fit">
                        <FileText className="size-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Documents uploaded</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-1.5 rounded-full bg-muted h-fit">
                        <User className="size-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Account created</p>
                        <p className="text-xs text-muted-foreground">27 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Card className="border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Risk Assessment Breakdown
            </h3>
            <div className="flex items-center gap-3">
              <Badge className={getLabelColor(riskAssessment?.pibLabel)} variant="outline">
                {riskAssessment?.pibLabel}
              </Badge>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Total Score</div>
                <div className={`text-2xl font-bold ${getRiskColor(totalRiskScore)}`}>{totalRiskScore}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Channel</span>
                  {riskAssessment?.channel?.score > 0 && <AlertCircle className="size-3 text-warning-foreground" />}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{riskAssessment?.channel?.value}</div>
              </div>
              <Badge className={getRiskBadgeColor(riskAssessment?.channel?.score)} variant="outline">
                Score: {riskAssessment?.channel?.score}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Customer Retention</span>
                  {riskAssessment?.customerRetention?.score > 0 && (
                    <AlertCircle className="size-3 text-warning-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {riskAssessment?.customerRetention?.value}
                </div>
              </div>
              <Badge className={getRiskBadgeColor(riskAssessment?.customerRetention?.score)} variant="outline">
                Score: {riskAssessment?.customerRetention?.score}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Customer Type</span>
                  {riskAssessment?.customerType?.score > 0 && (
                    <AlertCircle className="size-3 text-warning-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {riskAssessment?.customerType?.value}
                </div>
              </div>
              <Badge className={getRiskBadgeColor(riskAssessment?.customerType?.score)} variant="outline">
                Score: {riskAssessment?.customerType?.score}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Industry</span>
                  {riskAssessment?.industry?.score > 0 && (
                    <AlertCircle className="size-3 text-warning-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{riskAssessment?.industry?.value}</div>
              </div>
              <Badge className={getRiskBadgeColor(riskAssessment?.industry?.score)} variant="outline">
                Score: {riskAssessment?.industry?.score}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/30">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Jurisdiction</span>
                  <AlertTriangle className="size-4 text-destructive" />
                </div>
                <div className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                  {riskAssessment?.jurisdiction?.value}
                  <Badge className="bg-destructive/20 text-destructive text-[10px] px-1.5 py-0" variant="outline">
                    {riskAssessment?.jurisdiction?.band}
                  </Badge>
                </div>
              </div>
              <Badge className="bg-destructive/15 text-destructive border-destructive/30" variant="outline">
                Score: {riskAssessment?.jurisdiction?.score}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Occupation</span>
                  {riskAssessment?.occupation?.score > 0 && (
                    <AlertCircle className="size-3 text-warning-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{riskAssessment?.occupation?.value}</div>
              </div>
              <Badge className={getRiskBadgeColor(riskAssessment?.occupation?.score)} variant="outline">
                Score: {riskAssessment?.occupation?.score}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Product</span>
                  {riskAssessment?.product?.score > 0 && <AlertCircle className="size-3 text-warning-foreground" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {riskAssessment?.product?.value || "Not specified"}
                </div>
              </div>
              <Badge className={getRiskBadgeColor(riskAssessment?.product?.score)} variant="outline">
                Score: {riskAssessment?.product?.score}
              </Badge>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">High-Risk Jurisdiction Detected</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The customer is from Afghanistan, classified as UHRC (Ultra High Risk Country). Enhanced due
                  diligence and additional verification measures are required before account activation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>


  )
}
