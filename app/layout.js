import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { EncryptDecryptFAB } from "@/components/EncryptBtn";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const montserrat = Montserrat({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: "Dooit Wallet",
  description: "Generate your online wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased `} suppressHydrationWarning>
        {/* <AuthProvider> */}
        <EncryptDecryptFAB />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
