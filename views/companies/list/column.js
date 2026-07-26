import { IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
export const companiesColumns = (handleView) => {
  return [
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-xs">
            <Button variant="outline" size="icon" onClick={() => handleView(row.original._id)}>
              <IconEye />
            </Button>
          </div>
        );
      },
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "generalInformation.legalName",
      cell: ({ row }) => {
        const generalData = row.original.general_information;
        // contact_email/phone_number now support multiple entries (docs/65
        // Step 38) — may still be a legacy scalar string on old records.
        const toCsv = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean).join(", ");
        return (
          <div className=" ">
            <p className="text-xs font-semibold">
              {generalData?.legal_name} ({generalData?.trading_names})
            </p>
            <p className="text-xs text-muted-foreground text-wrap">
              {toCsv(generalData?.contact_email)} ({toCsv(generalData?.phone_number)})
            </p>
          </div>
        );
      },
    },
    {
      id: "nature-of-business",
      header: "Nature of Business",
      accessorKey: "nature_of_business",
      // size: 100,
      cell: ({ row }) => {
        return (
          <div className="text-xs  max-w-[150px] text-wrap text-gray-500">
            {row.original.general_information?.nature_of_business}
          </div>
        );
      },
    },

    {
      id: "local-agent",
      header: "Local Agent",
      accessorKey: "local_agents.0.name",
      cell: ({ row }) => {
        const agents = row.original.general_information?.local_agents || [];
        return <div className="text-xs">{agents.map((a) => a.name).filter(Boolean).join(", ")}</div>;
      },
    },
    {
      id: "annual-income",
      header: "Annual Income",
      accessorKey: "annual_income",
      cell: ({ row }) => {
        return (
          <div className="font-mono font-bold">
            {row.original.general_information?.annual_income}
          </div>
        );
      },
    },
    {
      id: "address",
      header: "Address",
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
      header: "Country",
      accessorKey: "country_of_incorporation",
      cell: ({ row }) => {
        return (
          <div className="text-xs">
            {row.original.general_information?.country_of_incorporation}
          </div>
        );
      },
    },
  ];
};
