import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono, Montserrat, sansFlex, JetBrains_Mono } from "next/font/google";
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
// const sansFlex = SansFlex({ subsets: ["latin"], variable: "--font-sans-flex" });
const jetbrainsMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Dooit Wallet",
  description: "Generate your online wallet",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head> */}
      <body
        // className={`font-sans antialiased ${montserrat.className} text-sm`}
        className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable)}
        suppressHydrationWarning
      >
        {/* <AuthProvider> */}

        <AuthProvider> {children}</AuthProvider>
        <Toaster />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
