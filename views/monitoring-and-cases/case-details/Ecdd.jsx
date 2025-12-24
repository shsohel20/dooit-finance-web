"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAlertStore from "@/app/store/alerts";
import { getEcddByCaseNumber } from "@/app/dashboard/client/report-compliance/ecdd/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  User,
  Building2,
  DollarSign,
  Globe,
  Shield,
  Calendar,
  TrendingUp,
} from "lucide-react";
import UILoader from "@/components/UILoader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Ecdd = () => {
  const [caseData, setCaseData] = useState(null);
  const params = useParams();
  const query = useSearchParams();
  const caseNumber = query.get("caseNumber");
  const { details } = useAlertStore();
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  console.log("details", details);
  const fetchEcddData = async () => {
    setFetching(true);
    try {
      const response = await getEcddByCaseNumber(details?.uid);
      console.log("ecdd response", response);
      if (response?.data) {
        setCaseData(response.data);
      } else {
        toast.error("No data found");
      }
    } catch (error) {
      console.error("Failed to get data", error);
    } finally {
      setFetching(false);
    }
  };
  useEffect(() => {
    if (details?.uid) {
      fetchEcddData();
    }
  }, [details?.uid]);

  const handleGenerateEcdd = (caseNumber) => {
    // console.log("caseNumber", caseNumber);
    router.push(`/dashboard/client/report-compliance/ecdd/form?caseNumber=${details?.uid}`);
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <UILoader loading={fetching} type="page">
        {caseData ? (
          <>
            <header className="border-b bg-card">
              <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-7 w-7 text-accent" />
                      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        ECDD Review
                      </h1>
                    </div>
                    <p className="text-muted-foreground">
                      Detailed review and compliance assessment
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-sm px-4 py-2">
                    {caseData?.caseNumber}
                  </Badge>
                </div>
              </div>
            </header>

            <main className="mx-auto max-w-7xl  py-8">
              {/* Overview Section */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Analyst</p>
                        <p className="text-lg font-medium capitalize">{caseData?.analystName}</p>
                      </div>
                      <div className="rounded-full bg-accent/10 p-3">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Analysis Date</p>
                        <p className="text-lg font-medium">{formatDate(caseData?.date)}</p>
                      </div>
                      <div className="rounded-full bg-accent/10 p-3">
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Expected Volume</p>
                        <p className="text-lg font-medium">
                          {formatCurrency(caseData?.expectedVolume)}
                        </p>
                      </div>
                      <div className="rounded-full bg-accent/10 p-3">
                        <TrendingUp className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-accent" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium capitalize">{caseData?.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Purpose</p>
                        <Badge variant="outline" className="capitalize">
                          {caseData?.accountPurpose}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Onboarding Date</p>
                        <p className="text-sm">{formatDate(caseData?.onboardingDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Created</p>
                        <p className="text-sm">{formatDate(caseData?.accountCreationDate)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Registered Address</p>
                      <p className="text-sm capitalize leading-relaxed">
                        {caseData?.registeredAddress}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
                        <p className="font-medium">{formatCurrency(caseData?.annualIncome)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">IP Locations</p>
                        <p className="font-medium">{caseData?.ipLocations}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-accent" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Beneficial Owner</p>
                        <p className="font-medium">{caseData?.beneficialOwner}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Directors</p>
                        <p className="font-medium">{caseData?.directors}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ABN Date</p>
                      <p className="text-sm">{formatDate(caseData?.abn)}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Related Party</p>
                      <p className="text-sm">{caseData?.relatedParty}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Behavioral Analysis Score
                      </p>
                      <p className="leading-relaxed">{caseData?.behavioralAnalysis}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-accent" />
                      Financial Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Deposits (AUD)</span>
                        <span className="text-lg font-semibold">
                          {formatCurrency(caseData?.totalDepositsAUD)}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-4/5"></div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <p className="text-sm font-medium">Withdrawals by Currency</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">USDT</span>
                          <span className="font-medium">
                            {formatCurrency(caseData?.totalWithdrawalsUSDT)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">ETH</span>
                          <span className="font-medium">
                            {formatCurrency(caseData?.totalWithdrawalsETH)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">BTC</span>
                          <span className="font-medium">
                            {formatCurrency(caseData?.totalWithdrawalsBTC)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Politically Exposed Person</p>
                          <p className="text-xs text-muted-foreground">PEP Status</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground hover:bg-success/90">
                        {caseData?.isPEP}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sanctions Screening</p>
                          <p className="text-xs text-muted-foreground">Sanctioned Status</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground hover:bg-success/90">
                        {caseData?.isSanctioned}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Analysis Period</p>
                      <p className="text-sm">
                        {formatDate(caseData?.onboardingDate)} -{" "}
                        {formatDate(caseData?.analysisEndDate)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* IDs Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Reference Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                      <p className="text-sm font-mono break-all">{caseData?.transaction?.uid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Customer ID</p>
                      <p className="text-sm font-mono break-all">{caseData?.customer?.uid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Analyst ID</p>
                      <p className="text-sm font-mono break-all">{caseData?.analyst?.uid}</p>
                    </div>
                    {/* <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Generated By
                </p>
                <p className="text-sm font-mono break-all">
                  {caseData?.generatedBy}
                </p>
              </div> */}
                  </div>
                </CardContent>
              </Card>
            </main>
          </>
        ) : (
          <div className="flex justify-between items-center gap-4">
            <div>
              <h4 className="text-2xl font-bold">No data found</h4>
              <p>Please generate a new ECDD</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => handleGenerateEcdd(caseNumber)}>Generate ECDD</Button>
            </div>
          </div>
        )}
      </UILoader>
    </div>
  );
};

export default Ecdd;
