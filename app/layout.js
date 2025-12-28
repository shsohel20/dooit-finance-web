import AuthProvider from "@/providers/SessionProvider";
import { Geist, Geist_Mono, Inter, Manrope, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Dooit Wallet",
  description: "Generate your online wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased bg-body`} suppressHydrationWarning>
        {/* <AuthProvider> */}

        <AuthProvider>{children}</AuthProvider>
        <Toaster />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
