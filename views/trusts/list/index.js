"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import { getTrusts } from "@/app/dashboard/client/companies/actions";
import CustomResizableTable from "@/components/ui/CustomResizable";
import CustomPagination from "@/components/CustomPagination";
import { countriesData } from "@/constants";
import { trustsColumns, TRUST_TYPE_LABELS } from "./column";
import { REVIEW_STATUS_LABELS } from "@/views/companies/list/column";
import ListToolbar from "@/views/companies/list/toolbar";
import { useListQuery } from "@/views/companies/list/useListQuery";

const REVIEW_STATUS_OPTIONS = Object.entries(REVIEW_STATUS_LABELS);
const TRUST_TYPE_OPTIONS = Object.entries(TRUST_TYPE_LABELS);
const COUNTRY_OPTIONS = countriesData.map((c) => [c.value, c.value]);

export default function TrustsList() {
  const router = useRouter();
  const q = useListQuery({
    fetcher: getTrusts,
    initialFilters: { search: "", review_status: "", trust_type: "", country: "" },
  });

  const columns = trustsColumns((trust) => router.push(`/dashboard/client/trusts/review?id=${trust?._id ?? trust}`), { sort: q.sort, onSort: q.handleSort });

  return (
    <div>
      <PageHeader className="flex-row items-start justify-between">
        <div>
          <PageTitle>All Trusts</PageTitle>
          <PageDescription>Manage and track all trust records</PageDescription>
        </div>
        <Button asChild>
          <Link href="/dashboard/client/trusts/add">
            <Plus /> Add New Trust
          </Link>
        </Button>
      </PageHeader>

      <ListToolbar
        search={q.filters.search}
        onSearch={(v) => q.setFilter("search", v)}
        searchPlaceholder="Search trust name or ID…"
        facets={[
          { name: "review_status", label: "Review status", options: REVIEW_STATUS_OPTIONS },
          { name: "trust_type", label: "Trust type", options: TRUST_TYPE_OPTIONS },
          { name: "country", label: "Country", options: COUNTRY_OPTIONS },
        ]}
        filters={q.filters}
        onFilterChange={q.setFilter}
        onClear={q.clearFilters}
        activeFilters={q.activeFilters}
      />

      {q.fetching ? (
        <p className="py-6 text-center text-xs text-muted-foreground">Loading trusts…</p>
      ) : q.rows.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No trusts match these filters. Trusts are created from a company&apos;s beneficial-trust form, or saved on
          their own from that form.
        </p>
      ) : (
        <CustomResizableTable columns={columns} data={q.rows} mainClass="trusts-table" tableId="trusts-table" />
      )}

      <CustomPagination
        currentPage={q.page}
        totalItems={q.total}
        limit={q.limit}
        onPageChange={(p) => q.setPage((p?.selected ?? 0) + 1)}
        // Radix Select's onValueChange — a raw string.
        onChangeLimit={(value) => {
          q.setLimit(Number(value) || 25);
          q.setPage(1);
        }}
      />
    </div>
  );
}
