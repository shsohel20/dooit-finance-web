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
      className="flex flex-col  h-full w-full"
    >
      <SiteHeader />
      <SidebarInset className=" grid grid-cols-12">
        <div className="col-span-2 max-h-screen overflow-y-auto bg-smoke-300">
          <ClientSidebar variant="inset" />
        </div>
        <div className="h-screen overflow-y-auto col-span-10">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-4">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}