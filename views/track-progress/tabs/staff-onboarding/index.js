"use client";
import React, { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STAFF_DATA = [
  {
    id: 1,
    name: "Jack Guthrie",
    roles: ["Compliance officer"],
    training: "NOT STARTED",
    onboarded: "IN PROGRESS",
    hasViewed: true,
  },
  {
    id: 2,
    name: "Steve Short",
    roles: ["Client facing", "Governing body"],
    training: "NOT STARTED",
    onboarded: "IN PROGRESS",
    hasViewed: false,
  },
  {
    id: 3,
    name: "Penelope Peterson",
    roles: ["Client facing"],
    training: "NOT STARTED",
    onboarded: "IN PROGRESS",
    hasViewed: false,
  },
  {
    id: 4,
    name: "David Marshall",
    roles: ["Client facing"],
    training: "NOT STARTED",
    onboarded: "IN PROGRESS",
    hasViewed: false,
  },
  {
    id: 5,
    name: "Michael Manager",
    roles: ["Client facing", "Senior manager"],
    training: "NOT STARTED",
    onboarded: "IN PROGRESS",
    hasViewed: false,
  },
  {
    id: 6,
    name: "Oliver Ownerson",
    roles: [],
    training: "NOT STARTED",
    onboarded: "IN PROGRESS",
    hasViewed: false,
  },
];

const FILTER_OPTIONS = ["All", "In Progress", "Completed", "Not Started"];

const StaffOnboardingTab = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = STAFF_DATA.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold mb-4">Staff Onboarding</h2>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search staff"
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Filter by ▾
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {FILTER_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt} onClick={() => setFilter(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/4">Staff</th>
              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/3">Role</th>
              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/5">Training</th>
              <th className="text-left font-medium text-gray-500 px-4 py-2.5 w-1/5">Onboarded</th>
              <th className="px-4 py-2.5 w-24" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((staff, idx) => (
              <tr
                key={staff.id}
                className={`border-b last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-white"}`}
              >
                <td className="px-4 py-3">
                  <span className="text-primary font-medium cursor-pointer hover:underline">
                    {staff.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {staff.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-[0.65rem] px-2 py-0.5 font-normal">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-700 text-[0.65rem] tracking-wide">
                    {staff.training}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-orange-500 text-[0.65rem] tracking-wide">
                    {staff.onboarded}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {staff.hasViewed ? (
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-3 text-gray-500 border border-gray-200">
                      View
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs h-7 px-3 text-primary border-primary hover:bg-primary/5">
                      Onboard
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffOnboardingTab;
