import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono, Montserrat, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

// const sansFlex = SansFlex({ subsets: ["latin"], variable: "--font-sans-flex" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Dooit Wallet",
  description: "Generate your online wallet",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head> */}
      <body
        // className={`font-sans antialiased ${montserrat.className} text-sm`}
        className={cn("antialiased", interTight.variable, geist.variable, geistMono.variable)}
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
