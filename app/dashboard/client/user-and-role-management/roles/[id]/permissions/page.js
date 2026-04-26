"use client";
import PermissionsListView from "@/views/privacy/permissions/ListView";
import { useParams } from "next/navigation";
import React from "react";

export default function PermissionsPage() {
  const { id } = useParams();
  return (
    <div>
      <PermissionsListView />
    </div>
  );
}
