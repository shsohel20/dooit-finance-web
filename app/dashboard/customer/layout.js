import { Menu } from "lucide-react";
import React from "react";
import Logo from "../../components/Logo";

export default function CompanyLayout( { children } ) {
  return (
    <main className="bg-white">
      <div className="container mx-auto">
        <header>
          <nav className="fixed z-50 top-0 right-0 left-0 bg-blue-600 min-h-14 flex justify-between ">
            <div className="bg-white py-4 px-8">
              <Logo />
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
