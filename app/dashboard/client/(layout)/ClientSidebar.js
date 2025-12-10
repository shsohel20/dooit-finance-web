'use client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconAlertTriangle,
  IconBuildingBank,
  IconChartBar,
  IconCircleCheck,
  IconCircleDashedCheck,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconListDetails,
  IconPentagonX,
  IconProgress,
  IconUsers,
} from "@tabler/icons-react"
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { useSession } from 'next-auth/react'
import { FileInput, Newspaper, ShieldHalf, ShieldUser } from 'lucide-react'

export default function ClientSidebar({ ...props }) {
  const session = useSession();
  const onBoardingMenuItems = [
    {
      title: 'Dashboard',
      icon: IconDashboard,
      url: '/dashboard/client',
    },

    {
      title: "Customers",
      // url: "#",
      icon: IconUsers,
      // current: true,
      children: [
        {
          title: 'Overview',
          icon: IconListDetails,
          url: '/dashboard/client/onboarding/customer-queue',
        },
        {
          title: 'Pending',
          url: '/dashboard/client/onboarding/customer-queue/pending',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'Rejected',
          url: '/dashboard/client/onboarding/customer-queue/rejected',
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
          title: 'In Review',
          url: '/dashboard/client/onboarding/customer-queue/in-review',
          icon: IconProgress,
          current: true,
        },
      ]
    },
    {
      title: 'Branches',
      icon: IconBuildingBank,
      url: '/dashboard/client/branch',

    },
    {
      title: 'Risk Assessment',
      icon: IconAlertTriangle,
      url: '/dashboard/client/risk-assessment',

    }
  ]
  const reportingMenuItems = [
    {
      title: 'Overview',
      icon: IconListDetails,
      url: '/dashboard/client/report-compliance',
    },
    {
      title: 'STR Filing',
      icon: IconChartBar,
      children: [
        {
          title: 'STR Review',
          url: '/dashboard/client/str-filling-report/review',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'STR Approval',
          url: '/dashboard/client/str-filling-report/approval',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'Draft STR',
          url: '/dashboard/client/str-filling-report/draft',
          icon: IconDatabase,
          current: true,
        },
      ]
    },
    {
      title: 'SMR Filing ',
      icon: FileInput,
      children: [
        {
          title: 'SMR',
          url: '/dashboard/client/report-compliance/smr-filing/smr',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'GFS',
          url: '/dashboard/client/report-compliance/smr-filing/gfs',
          icon: IconDatabase,
          current: true,
        },
      ]
    },
    {
      title: 'Compliance ',
      icon: ShieldHalf,
      children: [

        {
          title: 'TTR Reports',
          url: '/dashboard/client/report-compliance/ttr',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'IFTI Reports',
          url: '/dashboard/client/report-compliance/ifti',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'Compliance Health',
          url: '/#',
          icon: IconDatabase,
          current: true,
        },
      ]
    },
    {
      title: 'Registers',
      icon: IconListDetails,
      url: '/dashboard/client/report-compliance/registers',
    }

  ]
  const monitoringMenuItems = [
    // {
    //   title: 'Alerts',
    //   icon: IconListDetails,
    //   url: '/dashboard/client/alerts',
    // },
    {
      title: 'Case Management',
      icon: Newspaper,
      children: [
        {
          title: 'Alerts',
          url: '/dashboard/client/monitoring-and-cases/case-list',
          icon: IconAlertTriangle,
        },

      ]
    },
    {
      title: 'ECDD',
      icon: ShieldUser,
      url: '/dashboard/client/report-compliance/ecdd',
    }
  ]

  const watchlistAndScreeningMenuItems = [
    {
      title: 'Internal Blacklist',
      icon: IconListDetails,
      url: '/dashboard/client/watchlist-and-screening/internal-blacklist',
    },
  ]

  const knowledgeHubMenuItems = [
    {
      title: 'Policy Hub',
      icon: IconListDetails,
      url: '/dashboard/client/knowledge-hub/policy-hub',
    },
    {
      title: 'Training Hub',
      icon: IconListDetails,
      url: '/dashboard/client/knowledge-hub/training-hub',
    },
    {
      title: 'EWRA',
      icon: IconListDetails,
      url: '/dashboard/client/faq',
      children: [
        // {
        //   title: 'Risk Assessment',
        //   url: '/dashboard/client/risk-assessment',
        //   icon: IconListDetails,
        // },
        {
          title: 'ML Risk Assessment',
          url: '/dashboard/client/knowledge-hub/ewra/ml-risk-assesment',
          icon: IconListDetails,
        },
        {
          title: 'TF Risk Assessment',
          url: '/dashboard/client/knowledge-hub/ewra/tf-risk-assesment',
          icon: IconListDetails,
        },
        {
          title: 'ABC Risk Assessment',
          url: '/dashboard/client/knowledge-hub/ewra/abc-risk-assesment',
          icon: IconListDetails,
        },
      ]
    },
    {
      title: 'Regulatory Links',
      icon: IconListDetails,
      url: '/dashboard/client/knowledge-hub/regulatory-links',

    },
  ]
  const configurationMenuItems = [
    {
      title: 'User & Role Management',
      icon: IconListDetails,
      url: '/dashboard/client/user-and-role-management',
    },
    {
      title: 'Risk Rule Engine',
      icon: IconListDetails,
      children: [
        {
          title: 'CRA Scoring Configuration',
          url: '/dashboard/client/risk-rule-engine/cra-scoring-config',
          icon: IconDatabase,
        },
        {
          title: 'Transaction Rule Editor',
          url: '/dashboard/client/risk-rule-engine/transaction-rule-editor',
          icon: IconDatabase,
        }
      ]
    },
    {
      title: 'System Settings',
      icon: IconListDetails,
      children: [
        {
          title: 'Privacy',
          url: '/dashboard/client/system-settings/privacy',
          icon: IconDatabase,
        },
      ]
    }
  ]


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Dooit Wallet.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={onBoardingMenuItems} label="Onboarding" />
        <NavMain items={monitoringMenuItems} label="Monitoring & Cases" />
        <NavMain items={reportingMenuItems} label="Reporting & Registers" />
        <NavMain items={knowledgeHubMenuItems} label="Knowledge Hub" />
        <NavMain items={watchlistAndScreeningMenuItems} label="Watchlist & Screening" />
        <NavMain items={configurationMenuItems} label="Configuration" />

        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.data?.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
