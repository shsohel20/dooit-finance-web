"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActionAndDisposition() {
  return (
    <div className="">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1440px] px-8 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Case Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View case actions and disposition details
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Case Actions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                Case Actions
              </h2>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                3 Available
              </span>
            </div>

            <div className="space-y-3">
              {/* Escalate Button */}
              <Button className="w-full h-12 justify-between px-6 bg-gradient-to-r from-amber-50 to-amber-50 hover:from-amber-100 hover:to-amber-100 text-foreground border border-amber-200/50 shadow-sm transition-all duration-200">
                <span className="font-medium">Escalate Case</span>
                <ArrowUpRight className="h-4 w-4 text-amber-600" />
              </Button>

              {/* SMR Button */}
              <Button className="w-full h-12 justify-between px-6 bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 text-foreground border border-blue-200/50 shadow-sm transition-all duration-200">
                <span className="font-medium">Suspicious Activity Report</span>
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </Button>

              {/* Terminate Button */}
              <Button className="w-full h-12 justify-between px-6 bg-gradient-to-r from-red-50 to-red-50 hover:from-red-100 hover:to-red-100 text-foreground border border-red-200/50 shadow-sm transition-all duration-200">
                <span className="font-medium">Terminate Case</span>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>

          {/* Case Disposition Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                Case Disposition
              </h2>
              <Badge variant="outline" className="text-xs font-medium">
                Active
              </Badge>
            </div>

            <Card className="border shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {/* Status Alert */}
                <div className="bg-blue-50 border-b border-blue-200/50 px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Case is correctly under investigation
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        All required documentation has been received
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="px-6 py-6 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Next Steps
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked
                        className="mt-1 h-4 w-4 rounded border-border bg-background cursor-pointer"
                        readOnly
                      />
                      <label className="text-sm text-muted-foreground cursor-pointer">
                        Await RFI response from customer
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-border bg-background cursor-pointer"
                        readOnly
                      />
                      <label className="text-sm text-muted-foreground cursor-pointer">
                        Complete source of wealth verification
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-border bg-background cursor-pointer"
                        readOnly
                      />
                      <label className="text-sm text-muted-foreground cursor-pointer">
                        Finalize investigation report
                      </label>
                    </div>
                  </div>
                </div>

                {/* Expected Completion */}
                <div className="px-6 py-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Expected Completion
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">
                        01-12-2025
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Target completion date
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Clock className="h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
