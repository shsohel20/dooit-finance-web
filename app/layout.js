import AuthProvider from "@/providers/SessionProvider";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Dooit Wallet",
  description: "Generate your online wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`} suppressHydrationWarning>
        {/* <AuthProvider> */}

        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
