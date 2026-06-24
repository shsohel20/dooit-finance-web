import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import StaffsList from "@/views/staffs/list/index";
import React from "react";

export default function Staffs() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Staffs</PageTitle>
        <PageDescription>Manage and track all staffs</PageDescription>
      </PageHeader>
      <StaffsList />
    </div>
  );
}
