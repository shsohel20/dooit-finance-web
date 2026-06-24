"use client";
import { Button } from "@/components/ui/button";
import useGetUser from "@/hooks/useGetUser";
import React, { useState } from "react";
import { cn, dateShowFormat, fmt, KYC_HISTORY_STATUS } from "@/lib/utils";

const VerificationSuccess = () => (
  <div className="flex flex-col gap-4 items-center justify-center">
    <div className="size-20">
      <img
        src="/VerificationSuccess.svg"
        alt="verification"
        className="w-full h-full object-cover"
      />
    </div>
    <p className="text-2xl font-bold tracking-tighter">You are Verified!</p>
    <p className="text-success">You got three points</p>
    <p className="text-yellow-400 text-2xl">⭐⭐⭐</p>
    <p>You can now access all the features of your account.</p>
  </div>
);

const DashboardDetailSection = ({ title, children }) => (
  <section className="rounded-xl border bg-white p-5 shadow-sm">
    <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h5>
    <div className="mt-4 space-y-3">{children}</div>
  </section>
);

const DetailItem = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-2 last:border-none last:pb-0">
    <p className="text-sm text-gray-500 flex-shrink-0">{label}</p>
    <p className="text-right text-sm font-medium text-gray-900">{value || "—"}</p>
  </div>
);

const StatusPill = ({ label, value, positive, negative }) => {
  const cls = negative
    ? "bg-red-100 text-red-700"
    : positive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-slate-600";
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit", cls)}>
        {value ?? "—"}
      </span>
    </div>
  );
};

export const ProfileCard = ({ loggedInUser }) => (
  <div className="flex items-center gap-4 bg-brown flex-shrink-0 max-w-[400px] py-8 px-8 rounded-md">
    <div className="size-20 rounded-full bg-white text-white">
      <img
        src={loggedInUser?.photoUrl}
        alt="profile"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
    <div>
      <h4 className="text-2xl font-bold tracking-tighter">{loggedInUser?.name}</h4>
      <p>{loggedInUser?.email}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { loggedInUser } = useGetUser();
  const customer = loggedInUser?.customer;
  const [activeTab, setActiveTab] = useState("personal");

  const personalKyc = customer?.personalKyc;
  const personalForm = personalKyc?.personal_form;
  const fundsWealth = personalKyc?.funds_wealth;
  const soleTrader = personalKyc?.sole_trader;
  const kycHistory = customer?.kycHistory || [];
  const relations = customer?.relations || [];

  const sidebarTabs = [
    { id: "personal", label: "Personal" },
    { id: "contact", label: "Contact" },
    { id: "employment", label: "Employment" },
    { id: "residential", label: "Residential" },
    { id: "mailing", label: "Mailing" },
    { id: "funds", label: "Funds & Wealth" },
    { id: "sole-trader", label: "Sole Trader" },
    { id: "kyc-status", label: "KYC Status" },
    { id: "aml", label: "AML" },
    { id: "relations", label: `Relations (${relations.length})` },
    { id: "kyc-history", label: `KYC History (${kycHistory.length})` },
    { id: "compliance", label: "Compliance" },
    { id: "system", label: "System" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <DashboardDetailSection title="Personal Details">
            <DetailItem label="Given Name" value={personalForm?.customer_details?.given_name} />
            <DetailItem label="Middle Name" value={personalForm?.customer_details?.middle_name} />
            <DetailItem label="Surname" value={personalForm?.customer_details?.surname} />
            <DetailItem
              label="Date of Birth"
              value={
                personalForm?.customer_details?.date_of_birth
                  ? dateShowFormat(personalForm.customer_details.date_of_birth)
                  : null
              }
            />
          </DashboardDetailSection>
        );

      case "contact":
        return (
          <DashboardDetailSection title="Contact Details">
            <DetailItem label="Email" value={customer?.metadata?.email} />
            <DetailItem label="Phone" value={customer?.metadata?.phone} />
          </DashboardDetailSection>
        );

      case "employment":
        return (
          <DashboardDetailSection title="Employment Details">
            <DetailItem label="Occupation" value={personalForm?.employment_details?.occupation} />
            <DetailItem label="Industry" value={personalForm?.employment_details?.industry} />
            <DetailItem label="Employer" value={personalForm?.employment_details?.employer_name} />
          </DashboardDetailSection>
        );

      case "residential":
        return (
          <DashboardDetailSection title="Residential Address">
            <DetailItem label="Address" value={personalForm?.residential_address?.address} />
            <DetailItem label="Suburb" value={personalForm?.residential_address?.suburb} />
            <DetailItem label="State" value={personalForm?.residential_address?.state} />
            <DetailItem label="Postcode" value={personalForm?.residential_address?.postcode} />
            <DetailItem label="Country" value={fmt(personalForm?.residential_address?.country)} />
          </DashboardDetailSection>
        );

      case "mailing":
        return (
          <DashboardDetailSection title="Mailing Address">
            <DetailItem label="Address" value={personalForm?.mailing_address?.address} />
            <DetailItem label="Suburb" value={personalForm?.mailing_address?.suburb} />
            <DetailItem label="State" value={personalForm?.mailing_address?.state} />
            <DetailItem label="Postcode" value={personalForm?.mailing_address?.postcode} />
            <DetailItem label="Country" value={fmt(personalForm?.mailing_address?.country)} />
          </DashboardDetailSection>
        );

      case "funds":
        return (
          <DashboardDetailSection title="Funds & Wealth">
            <DetailItem label="Source of Funds" value={fmt(fundsWealth?.source_of_funds)} />
            <DetailItem label="Source of Wealth" value={fmt(fundsWealth?.source_of_wealth)} />
            <DetailItem label="Account Purpose" value={fmt(fundsWealth?.account_purpose)} />
            <DetailItem
              label="Est. Trading Volume"
              value={fmt(fundsWealth?.estimated_trading_volume)}
            />
          </DashboardDetailSection>
        );

      case "sole-trader":
        return (
          <DashboardDetailSection title="Sole Trader">
            <DetailItem label="Is Sole Trader" value={soleTrader?.is_sole_trader ? "Yes" : "No"} />
            {soleTrader?.is_sole_trader && (
              <DetailItem
                label="Business Name"
                value={soleTrader?.business_details?.business_name}
              />
            )}
          </DashboardDetailSection>
        );

      case "kyc-status":
        return (
          <DashboardDetailSection title="KYC Status">
            <DetailItem label="Status" value={fmt(customer?.kycStatus)} />
            <DetailItem
              label="Verified At"
              value={customer?.kycVerifiedAt ? dateShowFormat(customer.kycVerifiedAt) : null}
            />
            <DetailItem label="Review Answer" value={customer?.kycRawResult?.reviewAnswer} />
            <DetailItem label="Notes" value={customer?.kycNotes || "—"} />
            {customer?.kycRejectReason && (
              <div className="pt-1">
                <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-red-700 mb-1">Rejection Reason</p>
                  <p className="text-xs text-red-600 whitespace-pre-line leading-relaxed">
                    {customer.kycRejectReason}
                  </p>
                </div>
              </div>
            )}
          </DashboardDetailSection>
        );

      case "aml":
        return (
          <DashboardDetailSection title="AML">
            <DetailItem label="Status" value={fmt(customer?.amlStatus)} />
            <DetailItem label="Vendor" value={customer?.amlVendor} />
            <DetailItem
              label="Checked At"
              value={customer?.amlCheckedAt ? dateShowFormat(customer.amlCheckedAt) : null}
            />
            {customer?.amlRiskLabels?.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] text-gray-500 mb-1.5">Risk Labels</p>
                <div className="flex flex-wrap gap-1.5">
                  {customer.amlRiskLabels.map((l, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {customer?.amlHits?.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] text-gray-500 mb-1.5">Hits</p>
                <div className="flex flex-wrap gap-1.5">
                  {customer.amlHits.map((h, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-medium text-red-700"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </DashboardDetailSection>
        );

      case "relations":
        return relations.length === 0 ? (
          <DashboardDetailSection title="Relations">
            <p className="text-sm text-gray-400">No relations found.</p>
          </DashboardDetailSection>
        ) : (
          <div className="space-y-3">
            {relations.map((rel, i) => (
              <DashboardDetailSection key={rel._id ?? i} title={`Relation ${i + 1}`}>
                <DetailItem label="Client ID" value={rel.client} />
                <DetailItem label="Type" value={fmt(rel.type)} />
                <DetailItem label="Channel" value={fmt(rel.onboardingChannel)} />
                <DetailItem label="Source" value={fmt(rel.source)} />
                <DetailItem label="Active" value={rel.active ? "Yes" : "No"} />
                <DetailItem
                  label="Registered"
                  value={rel.registeredAt ? dateShowFormat(rel.registeredAt) : null}
                />
                <DetailItem
                  label="Invite Created"
                  value={rel.inviteCreatedAt ? dateShowFormat(rel.inviteCreatedAt) : null}
                />
                <DetailItem
                  label="Invite Expires"
                  value={rel.inviteTokenExpire ? dateShowFormat(rel.inviteTokenExpire) : null}
                />
                {rel.notes && <DetailItem label="Notes" value={rel.notes} />}
              </DashboardDetailSection>
            ))}
          </div>
        );

      case "kyc-history":
        return (
          <DashboardDetailSection title={`KYC History (${kycHistory.length})`}>
            {kycHistory.length === 0 ? (
              <p className="text-sm text-gray-400">No history available.</p>
            ) : (
              <div className="space-y-0 -mt-1">
                {kycHistory.map((entry, i) => {
                  const s = KYC_HISTORY_STATUS[entry.status] ?? {
                    badge: "bg-slate-50 text-slate-600 border-slate-200",
                    dot: "bg-slate-400",
                  };
                  return (
                    <div
                      key={entry._id ?? i}
                      className="flex items-start gap-3 py-2.5 border-b border-dashed border-gray-200 last:border-none"
                    >
                      <span
                        className={cn(
                          "mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border flex-shrink-0 flex items-center gap-1",
                          s.badge,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", s.dot)} />
                        {fmt(entry.status)}
                      </span>
                      <p className="flex-1 text-xs text-gray-600 leading-relaxed">
                        {entry.note || "—"}
                      </p>
                      <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">
                        {entry.changedAt ? dateShowFormat(entry.changedAt) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardDetailSection>
        );

      case "compliance":
        return (
          <DashboardDetailSection title="Compliance">
            <DetailItem label="PEP" value={customer?.isPep ? "Yes" : "No"} />
            <DetailItem label="Sanction" value={customer?.sanction ? "Yes" : "No"} />
            <DetailItem
              label="Consent to Screen"
              value={customer?.consentToScreen ? "Yes" : "No"}
            />
            <DetailItem
              label="Declarations Accepted"
              value={customer?.declaration?.declarations_accepted ? "Yes" : "No"}
            />
            <DetailItem
              label="Documents Attested"
              value={customer?.authorized?.documents_attested ? "Yes" : "No"}
            />
            <DetailItem label="Data Encrypted" value={customer?.isDataEncrypted ? "Yes" : "No"} />
            <DetailItem label="Documents" value={`${customer?.documents?.length ?? 0} file(s)`} />
          </DashboardDetailSection>
        );

      case "system":
        return (
          <DashboardDetailSection title="System">
            <DetailItem label="UID" value={customer?.uid} />
            <DetailItem
              label="Sequence"
              value={customer?.sequence != null ? `#${customer.sequence}` : null}
            />
            <DetailItem label="Country" value={customer?.country} />
            <DetailItem label="Active" value={customer?.isActive ? "Yes" : "No"} />
            <DetailItem label="Email (metadata)" value={customer?.metadata?.email} />
            <DetailItem label="Phone (metadata)" value={customer?.metadata?.phone} />
            <DetailItem
              label="Created"
              value={customer?.createdAt ? dateShowFormat(customer.createdAt) : null}
            />
            <DetailItem
              label="Updated"
              value={customer?.updatedAt ? dateShowFormat(customer.updatedAt) : null}
            />
            {/* <div className="pt-2 space-y-2">
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Sumsub Applicant ID</p>
                <p className="font-mono text-xs text-gray-700 break-all">
                  {customer?.sumsubApplicantId ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Sumsub Inspection ID</p>
                <p className="font-mono text-xs text-gray-700 break-all">
                  {customer?.sumsubInspectionId ?? "—"}
                </p>
              </div>
            </div> */}
          </DashboardDetailSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container pb-10 pt-8">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-2xl font-bold">Dashboard</h4>
          <p>
            Welcome back, <span className="font-bold">{loggedInUser?.name}</span>! Here&apos;s an
            overview of your KYC activities.
          </p>
        </div>
        <div className="flex gap-4">
          <Button className={"w-[200px] bg-[#4ED7F1] text-black"}>Share KYC</Button>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-6 flex flex-wrap gap-6 rounded-xl border bg-white px-5 py-4">
        <StatusPill
          label="KYC Status"
          value={fmt(customer?.kycStatus)}
          positive={customer?.kycStatus === "verified"}
          negative={["rejected", "flagged"].includes(customer?.kycStatus)}
        />
        <StatusPill
          label="AML Status"
          value={fmt(customer?.amlStatus)}
          positive={customer?.amlStatus === "clear"}
          negative={customer?.amlStatus === "flagged"}
        />
        <StatusPill
          label="PEP"
          value={customer?.isPep ? "Yes" : "No"}
          positive={!customer?.isPep}
          negative={customer?.isPep}
        />
        <StatusPill
          label="Sanction"
          value={customer?.sanction ? "Yes" : "No"}
          positive={!customer?.sanction}
          negative={customer?.sanction}
        />
        <StatusPill
          label="Active"
          value={customer?.isActive ? "Yes" : "No"}
          positive={customer?.isActive}
          negative={!customer?.isActive}
        />
        <StatusPill label="Country" value={customer?.country} />
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4">
        <VerificationSuccess />
      </div>

      <div className="mt-8 gap-4">
        <div className="w-full rounded-xl border bg-slate-50 p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <h5 className="text-lg font-bold tracking-tight text-slate-900">KYC Details</h5>
              <p className="text-sm text-slate-500">
                Structured customer information for onboarding review.
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                customer?.kycStatus === "verified"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700",
              )}
            >
              {fmt(customer?.kycStatus ?? "pending")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-xl border bg-white p-2 shadow-sm">
                {sidebarTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`mb-1 w-full rounded-lg px-4 py-2 text-left text-sm transition last:mb-0 ${
                      activeTab === tab.id
                        ? "bg-slate-900 font-semibold text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            <div className="lg:col-span-8 xl:col-span-9">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
