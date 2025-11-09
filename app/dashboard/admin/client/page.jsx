import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import ClientList from "@/views/admin/client/list";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";

export default async function ClientPage() {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <PageHeader>
          <PageTitle>Clients</PageTitle>
          <PageDescription>Manage and track all clients</PageDescription>
        </PageHeader>
        <Button asChild>
          <Link href="/dashboard/admin/client/form">
            <IconPlus /> Add Client
          </Link>
        </Button>
      </div>
      <ClientList />
    </div>
  );
}
