"use client";
import React from "react";
import { getCompanies } from "@/app/dashboard/client/companies/actions";
import CustomResizableTable from "@/components/ui/CustomResizable";
import CustomPagination from "@/components/CustomPagination";
import { companiesColumns, REVIEW_STATUS_LABELS, ENTITY_TYPE_LABELS } from "./column";
import CompaniesDashboard from "./dashboard";
import ListToolbar from "./toolbar";
import { useListQuery } from "./useListQuery";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import { countriesData } from "@/constants";

const REVIEW_STATUS_OPTIONS = Object.entries(REVIEW_STATUS_LABELS);
const ENTITY_TYPE_OPTIONS = Object.entries(ENTITY_TYPE_LABELS);
const REGISTRY_STATUS_OPTIONS = [
  ["active", "Active"],
  ["deregistered", "Deregistered"],
  ["external_administration", "External administration"],
];
const COUNTRY_OPTIONS = countriesData.map((c) => [c.value, c.value]);

function CompaniesTable() {
  const router = useRouter();
  const q = useListQuery({
    fetcher: getCompanies,
    initialFilters: { search: "", review_status: "", entity_type: "", status: "", country: "" },
  });

  const columns = companiesColumns(
    (id) => router.push(`/dashboard/client/companies/review?id=${id}`),
    { sort: q.sort, onSort: q.handleSort },
  );

  return (
    <div>
      <ListToolbar
        search={q.filters.search}
        onSearch={(v) => q.setFilter("search", v)}
        searchPlaceholder="Search name, ACN/ABN or company ID…"
        facets={[
          { name: "review_status", label: "Review status", options: REVIEW_STATUS_OPTIONS },
          { name: "entity_type", label: "Entity type", options: ENTITY_TYPE_OPTIONS },
          { name: "status", label: "Registry status", options: REGISTRY_STATUS_OPTIONS },
          { name: "country", label: "Country", options: COUNTRY_OPTIONS },
        ]}
        filters={q.filters}
        onFilterChange={q.setFilter}
        onClear={q.clearFilters}
        activeFilters={q.activeFilters}
      />

      {q.fetching ? (
        <p className="py-6 text-center text-xs text-muted-foreground">Loading companies…</p>
      ) : q.rows.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">No companies match these filters.</p>
      ) : (
        <CustomResizableTable columns={columns} data={q.rows} mainClass="companies-table" tableId="companies-table" />
      )}

      <CustomPagination
        currentPage={q.page}
        totalItems={q.total}
        limit={q.limit}
        onPageChange={(p) => q.setPage((p?.selected ?? 0) + 1)}
        onChangeLimit={(value) => {
          q.setLimit(Number(value) || 25);
          q.setPage(1);
        }}
      />
    </div>
  );
}

export default function CompaniesList() {

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
      <CompaniesTable />
    </div>
  );
}
