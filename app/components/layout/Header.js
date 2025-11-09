"use client";

import Link from "next/link";

import React from "react";
import StaticNavigation from "./StaticNavigation";

import { mainNavigation } from "@/app/utils/constant";
import Logo from "../Logo";
import SidebarNav from "./SidebarNav";
import { usePathname } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = (props) => {
  const { sidebarOpen = false, onSidebar } = props;

  const pathname = usePathname();

  return (
    <div>
      {/* SidebarNav  for Mobile */}
      <SidebarNav onHandleSidebar={onSidebar} isOpen={sidebarOpen}>
        <div className="flex flex-shrink-0 items-center bg-white px-4">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="mt-5 h-0 flex-1 overflow-y-auto  w-screen md:w-full">
          <nav className="px-2">
            <div className="space-y-1">
              {mainNavigation.map((nav, index) => (
                <div key={index} className="space-y-1">
                  <h3
                    className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    id="desktop-teams-headline"
                  >
                    {nav.title}
                  </h3>
                  <div>
                    {nav.navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:border-r hover:border-primary hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center rounded-sm px-2 py-2 text-sm font-medium",
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        <item.icon
                          className={classNames(
                            pathname === item.href
                              ? "bg-primary text-white"
                              : "text-primary group-hover:text-gray-500",
                            "mr-3 h-6 w-6 flex-shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </SidebarNav>

      {/* StaticNavigation for Desktop Version */}
      <StaticNavigation mainNavigation={mainNavigation} />
    </div>
  );
};

export default Header;
