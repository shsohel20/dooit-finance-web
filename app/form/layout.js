import { Menu } from "lucide-react";
import Logo from "../components/Logo";
import React from "react";
import Link from "next/link";

export default function CompanyLayout({ children }) {
  return (
    <main className="bg-white">
      <div className="container mx-auto">
        <header>
          <nav className="fixed z-50 top-0 right-0 left-0 bg-blue-600 min-h-14 flex justify-between ">
            <div className="bg-white py-4 px-8">
              <Logo />
            </div>
            <div className="flex flex-wrap gap-4 items-center text-white font-medium">
              <Link href="/form/kyc-onboarding" className="hover:text-gray-200">
                Personal Form
              </Link>
              <Link href="/form/company" className="hover:text-gray-200">
                Company Form
              </Link>
              <Link href="/form/non-indivisual" className="hover:text-gray-200">
                Non-individual
              </Link>
              <Link href="/form/trust" className="hover:text-gray-200">
                Trust
              </Link>
            </div>
            <div className="py-4 px-8 text-white">
              <Menu />
            </div>
          </nav>
        </header>
        <div className="py-16">{children}</div>
        <footer className="bg-gray-200 px-8 py-4 text-center">
          <div className="text-secondary text-xl font-semibold">
            2025 @ powered by Dooit.ai
          </div>
        </footer>
      </div>
    </main>
  );
}
