"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, User, FileText, Hash } from "lucide-react"
import { useState } from "react";
import { getRFIById } from "@/app/dashboard/client/monitoring-and-cases/case-list/actions";
import { useEffect } from "react";



export default function CaseDetailsDrawer({ open, onOpenChange, id, setId }) {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await getRFIById(id);
            console.log("response", response);
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);

    const toggle=()=>{
        onOpenChange(false);
        setId(null);
    }
  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto ">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-2xl font-semibold">Case Details</SheetTitle>
          <SheetDescription>Complete information about this case request</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-6" >
          {/* Case Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Case Information</h3>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Case Number</p>
                  <p className="font-mono font-semibold">{data?.caseNumber}</p>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Active
                </Badge>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Case ID</p>
                <p className="font-mono text-sm">{data?.caseId}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Contact Information
              </h3>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Primary Contact</p>
                <p className="font-semibold">{data?.primaryContactName}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Reply To Email</p>
                </div>
                <a href={`mailto:${data?.replyToEmail}`} className="text-sm text-primary hover:underline">
                  {data?.replyToEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Requested Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Requested Items ({data?.requestedItems?.length})
              </h3>
            </div>
            <div className="space-y-2">
              {data?.requestedItems?.map((item, index) => (
                <div key={index} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                System Information
              </h3>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Client ID</p>
                  <p className="font-mono text-xs break-all">{data?.clientId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Customer ID</p>
                  <p className="font-mono text-xs break-all">{data?.customerId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
