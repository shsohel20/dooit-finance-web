import { ShieldCheck, Clock } from "lucide-react";

export function ComplianceDisclaimer({ lastScanDate, sourcesCount }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="size-5 shrink-0 text-muted-foreground mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Compliance Disclaimer & Audit Information
          </h4>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              This OSINT report was generated using publicly available information from{" "}
              <span className="font-semibold text-foreground">{sourcesCount}</span> independent
              sources. All data was retrieved through lawful open-source intelligence methods in
              accordance with applicable data protection regulations including GDPR, and relevant
              AML/CFT directives (EU 2015/849, as amended).
            </p>
            <p>
              Results are provided as investigative intelligence only and do not constitute legal
              advice or a definitive determination of sanctions status, PEP classification, or
              criminal involvement. All findings must be independently verified by a qualified
              compliance officer before being used to make customer due diligence decisions.
            </p>
            <p>
              Screen captures, archived pages, and document references are preserved with SHA-256
              integrity hashes for audit trail purposes. This report and its contents are classified
              as CONFIDENTIAL and should only be shared on a need-to-know basis within the
              compliance function.
            </p>
            {lastScanDate && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/70">
                <Clock className="size-3" />
                Report generated: {new Date(lastScanDate).toISOString()} UTC
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
