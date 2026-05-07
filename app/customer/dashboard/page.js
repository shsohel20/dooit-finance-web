"use client";
import { Button } from "@/components/ui/button";
import useGetUser from "@/hooks/useGetUser";
import React, { useState } from "react";

const VerificationSuccess = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center ">
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
};

const DashboardDetailSection = ({ title, children }) => {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h5>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
};

const DetailItem = ({ label, value }) => {
  const displayValue = value || "N/A";

  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-2 last:border-none last:pb-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-right text-sm font-medium text-gray-900">{displayValue}</p>
    </div>
  );
};

export const ProfileCard = ({ loggedInUser }) => {
  return (
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
};

const Dashboard = () => {
  const { loggedInUser } = useGetUser();
  const [activeTab, setActiveTab] = useState("personal");
  const personalKyc = loggedInUser?.customer?.personalKyc;
  const personalForm = personalKyc?.personal_form;
  const fundsWealth = personalKyc?.funds_wealth;
  const soleTrader = personalKyc?.sole_trader;

  const sidebarTabs = [
    { id: "personal", label: "Personal Details" },
    { id: "contact", label: "Contact Details" },
    { id: "employment", label: "Employment Details" },
    { id: "residential", label: "Residential Address" },
    { id: "mailing", label: "Mailing Address" },
    { id: "funds", label: "Funds & Wealth" },
    { id: "sole-trader", label: "Sole Trader" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <DashboardDetailSection title="Personal Details">
            <DetailItem label="Given Name" value={personalForm?.customer_details?.given_name} />
            <DetailItem label="Middle Name" value={personalForm?.customer_details?.middle_name} />
            <DetailItem label="Surname" value={personalForm?.customer_details?.surname} />
          </DashboardDetailSection>
        );
      case "contact":
        return (
          <DashboardDetailSection title="Contact Details">
            <DetailItem label="Email" value={personalForm?.contact_details?.email} />
            <DetailItem label="Phone" value={personalForm?.contact_details?.phone} />
          </DashboardDetailSection>
        );
      case "employment":
        return (
          <DashboardDetailSection title="Employment Details">
            <DetailItem label="Occupation" value={personalForm?.employment_details?.occupation} />
            <DetailItem label="Industry" value={personalForm?.employment_details?.industry} />
          </DashboardDetailSection>
        );
      case "residential":
        return (
          <DashboardDetailSection title="Residential Address">
            <DetailItem label="Address" value={personalForm?.residential_address?.address} />
            <DetailItem label="Suburb" value={personalForm?.residential_address?.suburb} />
            <DetailItem label="State" value={personalForm?.residential_address?.state} />
            <DetailItem label="Postcode" value={personalForm?.residential_address?.postcode} />
            <DetailItem label="Country" value={personalForm?.residential_address?.country} />
          </DashboardDetailSection>
        );
      case "mailing":
        return (
          <DashboardDetailSection title="Mailing Address">
            <DetailItem label="Address" value={personalForm?.mailing_address?.address} />
            <DetailItem label="Suburb" value={personalForm?.mailing_address?.suburb} />
            <DetailItem label="State" value={personalForm?.mailing_address?.state} />
            <DetailItem label="Postcode" value={personalForm?.mailing_address?.postcode} />
            <DetailItem label="Country" value={personalForm?.mailing_address?.country} />
          </DashboardDetailSection>
        );
      case "funds":
        return (
          <DashboardDetailSection title="Funds & Wealth">
            <DetailItem label="Source of Funds" value={fundsWealth?.source_of_funds} />
            <DetailItem label="Source of Wealth" value={fundsWealth?.source_of_wealth} />
            <DetailItem label="Account Purpose" value={fundsWealth?.account_purpose} />
            <DetailItem
              label="Estimated Trading Volume"
              value={fundsWealth?.estimated_trading_volume}
            />
          </DashboardDetailSection>
        );
      case "sole-trader":
        return (
          <DashboardDetailSection title="Sole Trader Information">
            <DetailItem label="Is Sole Trader" value={soleTrader?.is_sole_trader ? "Yes" : "No"} />
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
          {/* <Link href="/customer/dashboard/application/new">
            <Button className={" bg-[#402E7A]"}>
              <Plus /> Start New Application
            </Button>
          </Link> */}
        </div>
      </div>
      <div className="mt-6 rounded-xl border bg-white p-4">
        <VerificationSuccess />
      </div>

      <div className="mt-8  gap-4">
        {/* <ProfileCard loggedInUser={loggedInUser} /> */}
        <div className="w-full rounded-xl border bg-slate-50 p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <h5 className="text-lg font-bold tracking-tight text-slate-900">KYC Details</h5>
              <p className="text-sm text-slate-500">
                Structured customer information for onboarding review.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Completed
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
