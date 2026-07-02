"use client";
// Reusable Sumsub-style KYC report export button.
// Downloads the per-customer KYC applicant PDF (GET customer/:id/kyc-export)
// via the exportCustomerKycPdf server action. Used on the customer queue
// details page and as a per-row action in the queue list.

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconFileTypePdf, IconLoader2 } from "@tabler/icons-react";
import { exportCustomerKycPdf } from "@/app/dashboard/client/onboarding/customer-queue/actions";

// Decode the server action's base64 payload into a browser file download.
const downloadBase64Pdf = (base64, filename) => {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function KycExportButton({
  customerId,
  label = "Export KYC PDF",
  iconOnly = false,
  size = "sm",
  variant = "outline",
  className = "",
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (e) => {
    // Table rows open details on double-click — keep the export click contained.
    e?.stopPropagation?.();
    if (!customerId || exporting) return;
    setExporting(true);
    try {
      const res = await exportCustomerKycPdf(customerId);
      if (res?.success && res.base64) {
        downloadBase64Pdf(res.base64, res.filename || `KYC_Report_${customerId}.pdf`);
        toast.success("KYC report downloaded");
      } else {
        toast.error(res?.error || "KYC export failed");
      }
    } catch (error) {
      console.error("KYC export failed", error);
      toast.error("KYC export failed");
    } finally {
      setExporting(false);
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant={variant}
        size="icon"
        className={className}
        onClick={handleExport}
        disabled={exporting}
        title="Export KYC PDF"
      >
        {exporting ? <IconLoader2 className="size-4 animate-spin" /> : <IconFileTypePdf />}
      </Button>
    );
  }

  return (
    <Button
      className={`text-xs ${className}`}
      size={size}
      variant={variant}
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? (
        <>
          Exporting... <IconLoader2 className="size-4 animate-spin" />
        </>
      ) : (
        <>
          {label} <IconFileTypePdf className="size-4" />
        </>
      )}
    </Button>
  );
}
