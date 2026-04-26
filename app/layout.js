import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { EncryptDecryptFAB } from "@/components/EncryptBtn";
import ChatBotNissa from "@/components/nisa-ai";
import { ModuleProvider } from "@/contexts/module-context";
import { cn } from "@/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Dooit Wallet",
  description: "Generate your online wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased ${montserrat.className} text-sm`}
        // className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
        suppressHydrationWarning
      >
        {/* <AuthProvider> */}
        <EncryptDecryptFAB />
        <ChatBotNissa />
        <AuthProvider>
          {" "}
          <ModuleProvider>{children}</ModuleProvider>
        </AuthProvider>
        <Toaster />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
