"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getCompanies } from "@/app/dashboard/client/companies/actions";
import CustomResizableTable from "@/components/ui/CustomResizable";
import { companiesColumns } from "./column";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
export default function CompaniesList() {
  const [data, setData] = useState([]);
  console.log("data", data);
  const router = useRouter();
  const getCompaniesData = async () => {
    console.log("hello");
    const response = await getCompanies();
    console.log("companies", response);
    setData(response.data);
  };

  useEffect(() => {
    getCompaniesData();
  }, []);
  const handleView = (id) => {
    router.push(`/dashboard/client/companies/details?id=${id}`);
  };
  const columns = companiesColumns(handleView);
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
      <CustomResizableTable
        columns={columns}
        data={data}
        mainClass="companies-table"
        tableId="companies-table"
      />
    </div>
  );
}
