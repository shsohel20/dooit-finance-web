"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getCompanies } from "@/app/dashboard/client/companies/actions";
import CustomResizableTable from "@/components/ui/CustomResizable";
import { companiesColumns } from "./column";
import CompaniesDashboard from "./dashboard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";

export default function CompaniesList() {
  const [data, setData] = useState([]);
  // The list endpoint is paginated and its default page size is 25 (docs/65
  // Step 58) — this call previously passed no params, so the "All Companies"
  // table silently showed only the first 25 records with nothing indicating
  // more existed. `total` is tracked so the count shown is the real one.
  const [total, setTotal] = useState(null);
  const router = useRouter();

  const getCompaniesData = async () => {
    const response = await getCompanies();
    setData(response?.data || []);
    setTotal(typeof response?.total === "number" ? response.total : null);
  };

  useEffect(() => {
    getCompaniesData();
  }, []);

  const handleView = (id) => {
    router.push(`/dashboard/client/companies/review?id=${id}`);
  };
  const columns = companiesColumns(handleView);
  const truncated = total !== null && data.length < total;

  return (
    <div>
      <PageHeader className="flex-row items-start justify-between">
        <div>
          <PageTitle>All Companies</PageTitle>
          <PageDescription>Manage and track all companies</PageDescription>
        </div>
        <Button asChild>
          <Link href="/dashboard/client/companies/add">
            <Plus /> Add New Company
          </Link>
        </Button>
      </PageHeader>

      <CompaniesDashboard />

      {truncated && (
        <p className="mb-3 text-xs text-muted-foreground">
          Showing the {data.length} most recent of {total.toLocaleString()} companies. The analytics above cover all{" "}
          {total.toLocaleString()}.
        </p>
      )}

      <CustomResizableTable
        columns={columns}
        data={data}
        mainClass="companies-table"
        tableId="companies-table"
      />
    </div>
  );
}
