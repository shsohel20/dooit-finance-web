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
  IconChartBar,
  IconCircleCheck,
  IconCircleDashedCheck,
  IconDatabase,
  IconInnerShadowTop,
  IconListDetails,
  IconPentagonX,
  IconProgress,
} from "@tabler/icons-react"
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { useSession } from 'next-auth/react'

export default function ClientSidebar({ ...props }) {
  const session = useSession();
  const onBoardingMenuItems = [

    {
      title: "Customer Queue",
      // url: "#",
      icon: IconListDetails,
      // current: true,
      children: [
        {
          title: 'Overview',
          icon: IconListDetails,
          url: '/dashboard/client/onboarding/customer-queue',
        },
        {
          title: 'Pending Collection',
          url: '/dashboard/client/onboarding/customer-queue/pending',
          icon: IconDatabase,
          current: true,
        },
        {
          title: 'Rejected Application',
          url: '/dashboard/client/onboarding/customer-queue/rejected',
          icon: IconPentagonX,
          current: true,
        },
        {
          title: 'Verified',
          url: '/dashboard/client/onboarding/customer-queue/verified',
          icon: IconCircleDashedCheck,
          current: true,
        },
        {
          title: 'In Review',
          url: '/dashboard/client/onboarding/customer-queue/in-review',
          icon: IconProgress,
          current: true,
        },
      ]
    },
    {
      title: 'Branch Management',
      icon: IconListDetails,
      children: [
        {
          title: 'Branch List',
          url: '/dashboard/client/branch',
        }
      ]
    },
    {
      title: 'Customer Risk Assessment',
      icon: IconListDetails,
      children: [
        {
          title: 'Customer List',
          url: '/#',
          icon: IconDatabase,
          current: true,
        },

      ]

    }
  ]
  const reportingMenuItems = [
    {
      title: 'Overview',
      icon: IconListDetails,
      url: '/dashboard/client/report-compliance',
    },
    {
      title: 'STR Filing Report',
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
      title: 'SMR Filing Report',
      icon: IconListDetails,
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
      title: 'Compliance Report',
      icon: IconListDetails,
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
      icon: IconListDetails,
      children: [
        {
          title: 'Alerts',
          url: '/dashboard/client/monitoring-and-cases/case-list',
          icon: IconDatabase,
        },

      ]
    }
  ]

  const watchlistAndScreeningMenuItems = [
    {
      title: 'Internal Blacklist',
      icon: IconListDetails,
      url: '/dashboard/client/watchlist-and-screening/internal-blacklist',
    },
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
        <NavMain items={watchlistAndScreeningMenuItems} label="Watchlist & Screening" />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.data?.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
