"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ClientSidebar from "./(layout)/ClientSidebar";
import { SiteHeader } from "@/components/site-header";
import useGetUser from "@/hooks/useGetUser";
import RealEstateDashboardHeader from "@/views/real-estate/DashboardHeader";

export default function ClientLayout({ children }) {
  const { loggedInUser } = useGetUser();

  const clientType = loggedInUser?.client?.clientType;
  const isRealState = clientType === "Real Estate";
  const isFinancial = clientType === "Financial";
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <ClientSidebar variant="inset" />
      <SidebarInset>
        {/* {isRealState && <RealEstateDashboardHeader />} */}
        <SiteHeader />
        <div className="flex flex-1 flex-col ">
          <div className="@container/main flex flex-1 flex-col gap-2  ">
            <div className="flex flex-col gap-4 py-4 md:gap-6  rounded-xl  mr-4 ">{children}</div>
          </div>
          <div className="fixed w-[50vw] h-[10vh] bg-primary/30 bottom-0 left-1/2 -translate-x-1/2 rounded-t-full translate-y-10 z-[-1] blur-3xl" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
