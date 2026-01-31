"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconAlertTriangle,
  IconBook,
  IconBuildingBank,
  IconChartBar,
  IconCirclesRelation,
  IconDatabase,
  IconLayoutDashboard,
  IconListDetails,
  IconPentagonX,
  IconProgress,
  IconUserOff,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useSession } from "next-auth/react";
import {
  TrendingUp,
  Building2,
  PieChart,
  FileInput,
  FileText,
  GraduationCap,
  Home,
  Newspaper,
  Scale,
  Search,
  ShieldHalf,
  ShieldUser,
  Users,
  Wallet,
  Send,
  Download,
} from "lucide-react";
import useGetUser from "@/hooks/useGetUser";

export default function ClientSidebar({ ...props }) {
  const session = useSession();
  const { loggedInUser } = useGetUser();
  const clientType = loggedInUser?.client?.clientType;
  const isRealState = clientType === "Real Estate";
  const isFinancial = clientType === "Financial";
  const isPreciousMetal = clientType === "Precious Metal";
  const isCrypto = clientType === "Crypto";
  const isBranch = loggedInUser?.role === "branch";

  const onBoardingMenuItems = [
    {
      title: "Dashboard",
      icon: IconLayoutDashboard,
      url: "/dashboard/client",
    },

    {
      title: "Customers",
      // url: "#",
      icon: IconUsers,
      // current: true,
      children: [
        {
          title: "Overview",
          icon: IconListDetails,
          url: "/dashboard/client/onboarding/customer-queue",
        },
        {
          title: "Pending",
          url: "/dashboard/client/onboarding/customer-queue/pending",
          icon: IconDatabase,
          current: true,
        },
        {
          title: "Rejected",
          url: "/dashboard/client/onboarding/customer-queue/rejected",
          icon: IconPentagonX,
          current: true,
        },
        // {
        //   title: 'Verified',
        //   url: '/dashboard/client/onboarding/customer-queue/verified',
        //   icon: IconCircleDashedCheck,
        //   current: true,
        // },
        {
          title: "In Review",
          url: "/dashboard/client/onboarding/customer-queue/in-review",
          icon: IconProgress,
          current: true,
        },
      ],
    },
    ...(isBranch
      ? []
      : [
          {
            title: "Branches",
            icon: IconBuildingBank,
            url: "/dashboard/client/branch",
          },
        ]),
    {
      title: "Risk Assessment",
      icon: IconAlertTriangle,
      url: "/dashboard/client/risk-assessment",
    },
  ];

  const STRMenu = {
    title: "STR Filing",
    icon: IconChartBar,
    children: [
      {
        title: "STR Review",
        url: "/dashboard/client/str-filling-report/review",
        icon: IconDatabase,
        current: true,
      },
      {
        title: "STR Approval",
        url: "/dashboard/client/str-filling-report/approval",
        icon: IconDatabase,
        current: true,
      },
      {
        title: "Draft STR",
        url: "/dashboard/client/str-filling-report/draft",
        icon: IconDatabase,
        current: true,
      },
    ],
  };
  const reportingMenuItems = [
    ...(isFinancial || isCrypto ? [STRMenu] : []),
    {
      title: "SMR Filing ",
      icon: FileInput,
      children: [
        {
          title: "SMR",
          url: "/dashboard/client/report-compliance/smr-filing/smr",
          icon: IconDatabase,
          current: true,
        },
        {
          title: "GFS",
          url: "/dashboard/client/report-compliance/smr-filing/gfs",
          icon: IconDatabase,
          current: true,
        },
      ],
    },
    {
      title: "Compliance ",
      icon: ShieldHalf,
      children: [
        {
          title: "TTR Reports",
          url: "/dashboard/client/report-compliance/ttr",
          icon: IconDatabase,
          current: true,
        },
        {
          title: "IFTI Reports",
          url: "/dashboard/client/report-compliance/ifti",
          icon: IconDatabase,
          current: true,
        },
        {
          title: "Compliance Health",
          url: "/#",
          icon: IconDatabase,
          current: true,
        },
      ],
    },
    {
      title: "Registers",
      icon: IconListDetails,
      url: "/dashboard/client/report-compliance/registers",
    },
  ];
  const monitoringMenuItems = [
    {
      title: "Case Management",
      icon: Newspaper,
      children: [
        {
          title: "Alerts",
          url: "/dashboard/client/monitoring-and-cases/case-list",
          icon: IconAlertTriangle,
        },
      ],
    },
    {
      title: "ECDD",
      icon: ShieldUser,
      url: "/dashboard/client/report-compliance/ecdd",
    },
  ];

  const watchlistAndScreeningMenuItems = [
    {
      title: "Internal Blacklist",
      icon: IconUserOff,
      url: "/dashboard/client/watchlist-and-screening/internal-blacklist",
    },
  ];

  const knowledgeHubMenuItems = [
    {
      title: "Policy Hub",
      icon: IconBook,
      url: "/dashboard/client/knowledge-hub/policy-hub",
    },
    {
      title: "Training Hub",
      icon: GraduationCap,
      url: "/dashboard/client/knowledge-hub/training-hub",
    },
    {
      title: "EWRA",
      icon: IconWorld,
      url: "/dashboard/client/faq",
      children: [
        {
          title: "Dashboard",
          url: "/dashboard/client/knowledge-hub/ewra/dashboard",
          icon: IconListDetails,
        },
        {
          title: "ML Risk Assessment",
          url: "/dashboard/client/knowledge-hub/ewra/ml-risk-assesment",
          icon: IconListDetails,
        },
        {
          title: "TF Risk Assessment",
          url: "/dashboard/client/knowledge-hub/ewra/tf-risk-assesment",
          icon: IconListDetails,
        },
        {
          title: "ABC Risk Assessment",
          url: "/dashboard/client/knowledge-hub/ewra/abc-risk-assesment",
          icon: IconListDetails,
        },
      ],
    },
    {
      title: "Regulatory Links",
      icon: IconCirclesRelation,
      url: "/dashboard/client/knowledge-hub/regulatory-links",
    },
  ];
  const pepScreenigItems = [
    {
      title: "AML Screening",
      icon: IconListDetails,
      url: "/dashboard/client/pep-and-adverse-media/aml-screening",
    },
  ];

  const configurationMenuItems = [
    {
      title: "User & Role Management",
      icon: IconListDetails,
      url: "/dashboard/client/user-and-role-management",
    },
    {
      title: "Risk Rule Engine",
      icon: IconListDetails,
      children: [
        {
          title: "Rule Configuration",
          url: "/dashboard/client/risk-rule-engine/rule-configuration",
          icon: IconDatabase,
        },
        {
          title: "CRA Scoring Configuration",
          url: "/dashboard/client/risk-rule-engine/cra-scoring-config",
          icon: IconDatabase,
        },
        {
          title: "Transaction Rule Editor",
          url: "/dashboard/client/risk-rule-engine/transaction-rule-editor",
          icon: IconDatabase,
        },
      ],
    },
    {
      title: "Training Module",
      url: "/dashboard/client/risk-rule-engine/training-module",
      icon: IconDatabase,
      children: [
        {
          title: "Anti-Money Laundering Training",
          url: "/dashboard/client/risk-rule-engine/training-module/anti-money-laundering",
          icon: IconDatabase,
        },
        {
          title: "AML Red Flags",
          url: "/dashboard/client/risk-rule-engine/training-module/aml-red-flags",
          icon: IconAlertTriangle,
        },
        {
          title: "Our Ecosystem",
          url: "/dashboard/client/risk-rule-engine/training-module/our-ecosystem",
          icon: IconDatabase,
        },
      ],
    },
    {
      title: "System Settings",
      icon: IconListDetails,
      children: [
        {
          title: "Privacy",
          url: "/dashboard/client/system-settings/privacy",
          icon: IconDatabase,
        },
        {
          title: "Role Management",
          url: "/dashboard/client/user-and-role-management",
          icon: IconDatabase,
        },
      ],
    },
  ];

  const realStateMenu = [
    {
      title: "Client Portal",
      items: [
        { title: "Property Search", url: "/dashboard/client/properties", icon: Search },
        { title: "My Documents", url: "/dashboard/client/documents", icon: FileText },
        { title: "Track Status", url: "/dashboard/client/track-status", icon: Building2 },
      ],
    },
    // {
    //   title: "Conveyancer Portal",
    //   items: [
    //     { title: "Matter Management", url: "/dashboard/client/conveyancer/matters", icon: Scale },
    //     { title: "Title Searches", url: "/dashboard/client/conveyancer/title-search", icon: Search },
    //     { title: "Settlements", url: "/dashboard/client/conveyancer/settlements", icon: CreditCard },
    //     // { title: "Trust Account", url: "/conveyancer/trust", icon: CreditCard },
    //   ],
    // },
    {
      title: "Agent Portal",
      items: [
        { title: "Listings", url: "/dashboard/client/agent/listing", icon: Building2 },
        // { title: "Clients", url: "/dashboard/client/agent/client", icon: Users },
        { title: "Contracts", url: "/dashboard/client/agent/contracts", icon: FileText },
      ],
    },
    // {
    //   title: "Compliance",
    //   items: [
    //     { name: "AML Dashboard", href: "/compliance/aml", icon: ShieldCheck },
    //     { name: "Case Management", href: "/compliance/cases", icon: FileText },
    //     { name: "Reports", href: "/compliance/reports", icon: BarChart3 },
    //   ],
    // },
  ];

  const preciousMetalMenu = [
    {
      title: "Overview",
      items: [
        { title: "Trade", url: "/dashboard/client/trade", icon: TrendingUp },
        { title: "Portfolio", url: "/dashboard/client/portfolio", icon: PieChart },

        // { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
    },
  ];
  const dueDiligenceMenu = [
    {
      title: "Compliance Officer and Governing Body",
      icon: IconListDetails,
      url: "/dashboard/client/due-diligence/compliance-officer-and-governing-body",
    },
    {
      title: "Personnel",
      icon: IconListDetails,
      url: "/dashboard/client/due-diligence/personnel",
    },
    {
      title: "Compliance ",
      icon: IconListDetails,
      url: "/dashboard/client/due-diligence/compliance-officer",
    },
  ];
  const cryptoMenu = [
    {
      title: "Overview",
      items: [
        { title: "Wallet", url: "/dashboard/client/wallet", icon: Wallet },
        { title: "Send Crypto", url: "/dashboard/client/send-crypto", icon: Send },
        { title: "Travel Rule", url: "/dashboard/client/travel-rule", icon: IconListDetails },
        { title: "Receive Crypto", url: "/dashboard/client/receive-crypto", icon: Download },
        { title: "Market", url: "/dashboard/client/market", icon: TrendingUp },
      ],
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props} className={"border-0"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <div className="py-2  relative">
                <div className="w-28 ">
                  <img src="/logo.png" alt="Logo" className=" w-full h-8 object-contain " />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={onBoardingMenuItems} label="Onboarding" />
        {isRealState && (
          <>
            {realStateMenu.map((item) => (
              <NavMain key={item.title} items={item.items} label={item.title} />
            ))}
          </>
        )}
        {isPreciousMetal && (
          <>
            {preciousMetalMenu.map((item) => (
              <NavMain key={item.title} items={item.items} label={item.title} />
            ))}
          </>
        )}
        {isCrypto && (
          <>
            {cryptoMenu.map((item) => (
              <NavMain key={item.title} items={item.items} label={item.title} />
            ))}
          </>
        )}
        <NavMain items={dueDiligenceMenu} label="Due Diligence" />
        <NavMain items={reportingMenuItems} label="Reporting & Registers" />
        <NavMain items={monitoringMenuItems} label="Monitoring & Cases" />
        <NavMain items={pepScreenigItems} label="PEP Screening" />
        <NavMain items={configurationMenuItems} label="Configuration" />
        <NavMain items={knowledgeHubMenuItems} label="Knowledge Hub" />
        <NavMain items={watchlistAndScreeningMenuItems} label="Watchlist & Screening" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.data?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
