import { IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DatatableColumnHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { REVIEW_STATUS_LABELS } from "@/views/companies/list/column";
import { OwnershipBadge, trustOwnership } from "@/views/kyb/ownership-summary";

// TrustKyc's trust_type.selected_type vocabulary (api/models/TrustKyc.js).
export const TRUST_TYPE_LABELS = {
  unregulated_trust: "Unregulated Trust",
  self_managed_super_fund: "Self-Managed Super Fund",
  managed_investment_scheme_registered: "MIS (Registered)",
  managed_investment_scheme_unregistered: "MIS (Unregistered)",
  government_superannuation_fund: "Government Super Fund",
  other_superannuation_trust: "Other Superannuation Trust",
};
const REVIEW_STATUS_VARIANTS = {
  draft: "muted",
  in_review: "info",
  approved: "success",
  escalated: "warning",
  declined: "danger",
};

const dateOnly = (v) => (v ? String(v).slice(0, 10) : "—");

export const trustsColumns = (handleView, { sort, onSort } = {}) => {
  const sortable = (title, sortKey) => {
    const Header = ({ column }) => (
      <DataTableColumnHeader column={column} title={title} sortKey={sortKey} sortValue={sort} onSort={onSort} />
    );
    Header.displayName = `TrustSortableHeader(${sortKey})`;
    return Header;
  };
  const plain = (title) => {
    const Header = ({ column }) => <DataTableColumnHeader column={column} title={title} sortable={false} />;
    Header.displayName = `TrustHeader(${title})`;
    return Header;
  };

  return [
    {
      id: "uid",
      header: sortable("Trust ID", "uid"),
      accessorKey: "uid",
      cell: ({ row }) => <div className="font-mono text-xs">{row.original.uid || "—"}</div>,
    },
    {
      id: "actions",
      header: plain("Actions"),
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="text-xs">
          <Button variant="outline" size="icon" onClick={() => handleView(row.original)}>
            <IconEye />
          </Button>
        </div>
      ),
    },
    {
      id: "name",
      header: sortable("Trust Name", "trust_details.full_trust_name"),
      accessorKey: "trust_details.full_trust_name",
      cell: ({ row }) => {
        const td = row.original.trust_details || {};
        // Same badge the companies register carries: one count beside the
        // name, the actual map on hover (docs/65 Step 70). The list endpoint
        // doesn't carry the reverse company lookup, so "Companies held" is
        // counted only on the trust's own page — the badge here summarises
        // the parties inside the trust.
        const summary = trustOwnership(row.original);
        return (
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs font-semibold">{td.full_trust_name || "Unnamed trust"}</p>
              <OwnershipBadge summary={summary} subjectName={td.full_trust_name} subjectRole="Subject trust" />
            </div>
            <p className="text-xs text-muted-foreground">
              {row.original.settlor?.full_name ? `Settlor: ${row.original.settlor.full_name}` : ""}
            </p>
          </div>
        );
      },
    },
    {
      id: "review-status",
      header: sortable("Review", "review_status"),
      accessorKey: "review_status",
      cell: ({ row }) => {
        const s = row.original.review_status || "draft";
        return <StatusPill variant={REVIEW_STATUS_VARIANTS[s] || "muted"}>{REVIEW_STATUS_LABELS[s] || s}</StatusPill>;
      },
    },
    {
      id: "trust-type",
      header: plain("Trust Type"),
      accessorKey: "trust_type",
      cell: ({ row }) => {
        const t = row.original.trust_details?.trust_type?.selected_type;
        return <div className="text-xs">{TRUST_TYPE_LABELS[t] || "—"}</div>;
      },
    },
    {
      id: "country",
      header: sortable("Country", "trust_details.country_of_establishment"),
      accessorKey: "country",
      cell: ({ row }) => (
        <div className="text-xs">{row.original.trust_details?.country_of_establishment || "—"}</div>
      ),
    },
    {
      // The registers that make a trust reviewable at a glance — a trust with
      // no trustee or no beneficiary recorded is the thing worth spotting
      // from the list rather than by opening it.
      id: "parties",
      header: plain("Parties"),
      accessorKey: "parties",
      cell: ({ row }) => {
        const trustees = row.original.individual_trustees?.trustees?.length || 0;
        const companies = row.original.company_trustees?.company_details?.length || 0;
        const beneficiaries = row.original.beneficiaries?.length || 0;
        return (
          <div className="text-xs text-muted-foreground">
            <span className={trustees + companies === 0 ? "text-danger font-semibold" : ""}>
              {trustees + companies} trustee{trustees + companies === 1 ? "" : "s"}
            </span>
            {" · "}
            <span className={beneficiaries === 0 ? "text-danger font-semibold" : ""}>
              {beneficiaries} beneficiar{beneficiaries === 1 ? "y" : "ies"}
            </span>
          </div>
        );
      },
    },
    {
      id: "documents",
      header: plain("Docs"),
      accessorKey: "documents",
      cell: ({ row }) => <div className="text-xs">{row.original.documents?.length || 0}</div>,
    },
    {
      id: "created",
      header: sortable("Created", "createdAt"),
      accessorKey: "createdAt",
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{dateOnly(row.original.createdAt)}</div>,
    },
  ];
};
