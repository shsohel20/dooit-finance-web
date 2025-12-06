
import ChatBot from "@/components/ChatBot";

export default function DashboardLayout({
  children,
  isComponentLoading = false,
  title = "Dashbarod",
}) {




  return (
    <div className="relative">
      {children}
      <ChatBot />
    </div>
  );
}
