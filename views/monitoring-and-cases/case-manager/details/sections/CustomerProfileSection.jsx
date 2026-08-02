"use client";

import CollapsibleSection from "../components/CollapsibleSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconId,
  IconBuildingBank,
  IconUsers,
  IconShieldCheck,
  IconShieldX,
} from "@tabler/icons-react";
import { dateShowFormat, getInitials } from "@/lib/utils";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-0">
      <div className="mt-0.5 shrink-0 rounded-md bg-muted p-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-heading text-right">{value ?? "—"}</span>
      </div>
    </div>
  );
}

function computeBadges(caseData) {
  const badges = [];
  if (caseData.riskTag === "High") badges.push({ label: "High Risk", variant: "danger" });
  if (caseData.kycStatus === "Verified") badges.push({ label: "KYC Verified", variant: "success" });
  if (caseData.kycStatus === "Pending Review") badges.push({ label: "KYC Pending Review", variant: "warning" });
  if (caseData.kycStatus === "Expired") badges.push({ label: "KYC Expired", variant: "danger" });
  if (caseData.pepStatus && caseData.pepStatus !== "Not a PEP")
    badges.push({ label: caseData.pepStatus, variant: "warning" });
  if (caseData.sanctionsStatus === "Confirmed Match")
    badges.push({ label: "Sanction Match", variant: "danger" });
  if (caseData.sanctionsStatus === "Potential Match")
    badges.push({ label: "Sanction Match (Potential)", variant: "warning" });
  return badges;
}

export default function CustomerProfileSection({ caseData, sectionRef }) {
  const c = caseData?.customer;
  if (!c) return null;

  const badges = computeBadges(caseData);
  const linkedAccounts = caseData.atm?.linkedAccounts || [];
  const beneficialOwners = caseData.beneficialOwners || [];

  return (
    <CollapsibleSection id="customer-profile" title="Customer Profile" icon={IconUser} sectionRef={sectionRef}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col items-center gap-2 lg:w-40">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(c.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-center text-sm font-semibold text-heading">{c.name}</p>
          <p className="text-center text-xs text-muted-foreground">{caseData.customerType}</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {badges.map((b) => (
              <StatusPill key={b.label} variant={b.variant}>
                {b.label}
              </StatusPill>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Identity
            </p>
            <InfoRow icon={IconUser} label="Customer ID" value={caseData.uid} />
            {c.age && <InfoRow icon={IconUser} label="Age" value={`${c.age} years`} />}
            {c.nationality && <InfoRow icon={IconUser} label="Nationality" value={c.nationality} />}
            {c.occupation && <InfoRow icon={IconUser} label="Occupation" value={c.occupation} />}
            {c.industry && <InfoRow icon={IconUser} label="Industry" value={c.industry} />}
            {c.accountOpeningDate && (
              <InfoRow icon={IconUser} label="Account Opened" value={dateShowFormat(c.accountOpeningDate)} />
            )}
            <InfoRow icon={IconUser} label="Risk Rating" value={c.riskRating || caseData.riskTag} />
            <InfoRow
              icon={IconShieldCheck}
              label="CDD Status"
              value={caseData.cddStatus}
            />
            <InfoRow icon={IconShieldX} label="EDD Status" value={caseData.eddStatus} />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contact & Registration
            </p>
            <InfoRow icon={IconMail} label="Email" value={c.email} />
            <InfoRow icon={IconPhone} label="Phone" value={c.phone} />
            <InfoRow icon={IconMapPin} label="Registered Address" value={c.address} />
            {c.idType && <InfoRow icon={IconId} label="ID Type" value={c.idType} />}
            {c.idNumber && <InfoRow icon={IconId} label="ID Number" value={c.idNumber} />}
            {c.registrationNo && <InfoRow icon={IconId} label="Registration No." value={c.registrationNo} />}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <IconBuildingBank className="size-3.5" />
            Linked Accounts ({linkedAccounts.length})
          </p>
          {linkedAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No linked accounts on file.</p>
          ) : (
            <div className="divide-y rounded-lg border">
              {linkedAccounts.map((acc) => (
                <div key={acc.accountNo} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-heading">{acc.bank}</p>
                    <p className="font-mono text-xs text-muted-foreground">{acc.accountNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{acc.type}</p>
                    <p className="text-sm font-semibold text-heading">
                      {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
                        acc.balance,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <IconUsers className="size-3.5" />
            Beneficial Owners ({beneficialOwners.length})
          </p>
          {beneficialOwners.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {caseData.customerType === "Business" ? "No beneficial owners on file." : "Not applicable for individual customers."}
            </p>
          ) : (
            <div className="divide-y rounded-lg border">
              {beneficialOwners.map((bo) => (
                <div key={bo.name} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-heading">{bo.name}</p>
                    <p className="text-xs text-muted-foreground">{bo.nationality}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-heading">{bo.ownershipPct}%</p>
                    {bo.pepStatus && bo.pepStatus !== "Not a PEP" && bo.pepStatus !== "N/A" && (
                      <StatusPill variant="warning">{bo.pepStatus}</StatusPill>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
