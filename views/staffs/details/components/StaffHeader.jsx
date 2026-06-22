"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn, dateShowFormat, fmt } from "@/lib/utils";
import {
  IconArrowLeft,
  IconUser,
  IconBuildingBank,
  IconCalendar,
  IconHash,
} from "@tabler/icons-react";

const getStatusVariant = (status) => {
  const map = {
    active: "success",
    draft: "muted",
    inactive: "danger",
    pending: "warning",
  };
  return map[status?.toLowerCase()] || "muted";
};

function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl shrink-0 border-2 border-primary/20">
      {initials}
    </div>
  );
}

export default function StaffHeader({ staff }) {
  const router = useRouter();
  const fullName =
    staff?.fullName ||
    `${staff?.personal?.firstName || ""} ${staff?.personal?.lastName || ""}`.trim();

  return (
    <div className="border border-border bg-card rounded-xl overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-6 py-3 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground h-7 w-7"
        >
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Staff Management</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">{fullName}</span>
      </div>

      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={fullName} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{fullName}</h1>
              <StatusPill variant={staff?.isActive ? "success" : "danger"}>
                {staff?.isActive ? "Active" : "Inactive"}
              </StatusPill>
              <StatusPill variant={getStatusVariant(staff?.status)}>
                {fmt(staff?.status)}
              </StatusPill>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <IconUser className="h-3.5 w-3.5" />
                {staff?.user?.role || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <IconBuildingBank className="h-3.5 w-3.5" />
                {staff?.client?.name || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <IconCalendar className="h-3.5 w-3.5" />
                Joined {staff?.createdAt ? dateShowFormat(staff.createdAt) : "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-right shrink-0">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Staff ID</span>
            <div className="flex items-center gap-1 font-mono text-sm font-semibold text-foreground">
              <IconHash className="h-3.5 w-3.5 text-muted-foreground" />
              {staff?.uid || "—"}
            </div>
            <span className="text-xs text-muted-foreground">Sequence #{staff?.sequence}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
