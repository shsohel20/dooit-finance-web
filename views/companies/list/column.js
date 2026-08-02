import { IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DatatableColumnHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { OwnershipBadge, companyOwnership } from "@/views/kyb/ownership-summary";

// Server-side sortable columns must match middleware/kybListQuery.js's
// whitelist (docs/65 Step 68) — a header offering a sort the API rejects
// would silently do nothing. Columns built from arrays or several fields
// (Address, Name+contact) are rendered with sortable={false}.
export const REVIEW_STATUS_LABELS = {
  draft: "Draft",
  in_review: "In review",
  approved: "Approved",
  escalated: "Escalated",
  declined: "Declined",
};
const REVIEW_STATUS_VARIANTS = {
  draft: "muted",
  in_review: "info",
  approved: "success",
  escalated: "warning",
  declined: "danger",
};
export const ENTITY_TYPE_LABELS = {
  proprietary_limited: "Proprietary Limited",
  public_company: "Public Company",
  foreign_company: "Foreign Company",
  other: "Other",
};

const dateOnly = (v) => (v ? String(v).slice(0, 10) : "—");

export const companiesColumns = (handleView, { sort, onSort } = {}) => {
  // Named so react/display-name is satisfied — TanStack renders these as
  // components, so an anonymous arrow shows up as <Unknown> in a trace.
  const sortable = (title, sortKey) => {
    const Header = ({ column }) => (
      <DataTableColumnHeader column={column} title={title} sortKey={sortKey} sortValue={sort} onSort={onSort} />
    );
    Header.displayName = `CompanySortableHeader(${sortKey})`;
    return Header;
  };
  const plain = (title) => {
    const Header = ({ column }) => <DataTableColumnHeader column={column} title={title} sortable={false} />;
    Header.displayName = `CompanyHeader(${title})`;
    return Header;
  };

  return [
    // ID first — it is the identifier an operator quotes on the phone and
    // cross-references against ASIC, so it leads the row (docs/65 Step 70).
    {
      id: "uid",
      header: sortable("Company ID", "uid"),
      accessorKey: "uid",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.original.uid || "—"}
          <span className="block text-muted-foreground">
            {row.original.general_information?.registration_number || ""}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: plain("Actions"),
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="text-xs">
          <Button variant="outline" size="icon" onClick={() => handleView(row.original._id)}>
            <IconEye />
          </Button>
        </div>
      ),
    },
    {
      id: "name",
      header: sortable("Name", "general_information.legal_name"),
      accessorKey: "generalInformation.legalName",
      cell: ({ row }) => {
        const generalData = row.original.general_information;
        // contact_email/phone_number now support multiple entries (docs/65
        // Step 38) — may still be a legacy scalar string on old records.
        const toCsv = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean).join(", ");
        const summary = companyOwnership(row.original);
        return (
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs font-semibold">
                {generalData?.legal_name} {generalData?.trading_names ? `(${generalData.trading_names})` : ""}
              </p>
              {/* Ownership moved off its own column and onto the name, so the
                  register stays scannable; hovering opens the actual map
                  (docs/65 Step 70). */}
              <OwnershipBadge summary={summary} subjectName={generalData?.legal_name} subjectRole="Subject company" />
            </div>
            <p className="text-xs text-muted-foreground text-wrap">
              {toCsv(generalData?.contact_email)} ({toCsv(generalData?.phone_number)})
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
    // The former "Ownership" column is gone: seven pills per row made the
    // register unreadable and still only showed counts. The same figures now
    // ride on the company name as a single badge, with the full chain in the
    // hover panel (docs/65 Step 70, ui/views/kyb/ownership-summary.js).
    {
      id: "entity-type",
      header: sortable("Entity Type", "general_information.entity_type"),
      accessorKey: "entity_type",
      cell: ({ row }) => (
        <div className="text-xs">
          {ENTITY_TYPE_LABELS[row.original.general_information?.entity_type] || "—"}
        </div>
      ),
    },
    {
      id: "nature-of-business",
      header: plain("Nature of Business"),
      accessorKey: "nature_of_business",
      cell: ({ row }) => (
        <div className="text-xs max-w-[150px] text-wrap text-gray-500">
          {row.original.general_information?.nature_of_business}
        </div>
      ),
    },
    {
      id: "local-agent",
      header: plain("Local Agent"),
      accessorKey: "local_agents.0.name",
      cell: ({ row }) => {
        const agents = row.original.general_information?.local_agents || [];
        return <div className="text-xs">{agents.map((a) => a.name).filter(Boolean).join(", ")}</div>;
      },
    },
    {
      id: "annual-income",
      header: plain("Annual Income"),
      accessorKey: "annual_income",
      cell: ({ row }) => (
        <div className="font-mono font-bold">{row.original.general_information?.annual_income}</div>
      ),
    },
    {
      id: "address",
      header: plain("Address"),
      accessorKey: "address",
      size: 400,
      cell: ({ row }) => {
        const addr = row.original.general_information?.registered_addresses?.[0];
        if (!addr) return <div className="text-xs text-muted-foreground max-w-[300px]" />;
        return (
          <div className="text-xs text-muted-foreground text-wrap max-w-[300px]">
            {addr.street}, {addr.suburb}, {addr.state}, {addr.postcode}, {addr.country}
          </div>
        );
      },
    },
    {
      id: "country-of-incorporation",
      header: sortable("Country", "general_information.country_of_incorporation"),
      accessorKey: "country_of_incorporation",
      cell: ({ row }) => (
        <div className="text-xs">{row.original.general_information?.country_of_incorporation}</div>
      ),
    },
    {
      id: "created",
      header: sortable("Created", "createdAt"),
      accessorKey: "createdAt",
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{dateOnly(row.original.createdAt)}</div>,
    },
  ];
};
