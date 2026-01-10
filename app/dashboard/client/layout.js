import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ClientSidebar from "./(layout)/ClientSidebar";
import { SiteHeader } from "@/components/site-header";

export default function ClientLayout({ children }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <ClientSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 bg-sidebar-bg ">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-8 px-8 bg-white rounded-xl  mr-4 shadow-xl">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}