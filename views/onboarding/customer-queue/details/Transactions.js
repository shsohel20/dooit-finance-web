import { getCustomerTransactions } from "@/app/dashboard/client/onboarding/customer-queue/actions";
import { DataTableColumnHeader } from "@/components/DatatableColumnHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatAUD, formatDateTime } from "@/lib/utils";
import { IconDotsVertical, IconPennant } from "@tabler/icons-react";
import { ArrowRight, Button } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomResizableTable from "@/components/ui/CustomResizable";

const statusVariants = {
  pending: "info",
  completed: "success",
  flagged: "warning",
  rejected: "danger",
};

const getColumns = () => {
  const columns = [
    // {
    //   id: "actions",
    //   header: "Actions",
    //   accessorKey: "actions",
    //   size: 60,
    //   cell: ({ row }) => (
    //     <div className="flex justify-center">
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             // size="sm"
    //             className="!py-2 h-auto "
    //           >
    //             <IconDotsVertical />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="start">
    //           <DropdownMenuItem onClick={() => handleViewClick(row.original)}>
    //             <IconEye className="mr-2 size-3 text-muted-foreground/70" />
    //             View
    //           </DropdownMenuItem>
    //           <DropdownMenuItem onClick={() => handleEditClick(row.original)}>
    //             <IconPencil className="mr-2 size-3 text-muted-foreground/70" />
    //             Edit
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     </div>
    //   ),
    // },
    {
      id: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      accessorKey: "uid",
      cell: ({ row }) => {
        return (
          <div>
            <p className=" font-mono text-muted-foreground text-sm">#{row.original?.uid}</p>
          </div>
        );
      },
    },
    {
      id: "Flow Direction",
      header: ({ column }) => <span>Flow Direction</span>,
      accessorKey: "sender.name",
      size: 200,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center ">
            <div>
              <h4 className=" font-semibold capitalize  text-sm">{row.original?.sender?.name}</h4>
              <p className="text-muted-foreground text-md">{row.original?.sender?.account}</p>
            </div>
            <div>
              <ArrowRight className="size-4 text-green-500" />
            </div>
            <div>
              <h4 className=" font-semibold capitalize  text-sm">{row.original?.receiver?.name}</h4>
              <p className="text-muted-foreground ">{row.original?.receiver?.account}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      accessorKey: "type",
      size: 100,
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-muted-foreground">{row.original?.type}</p>
          </div>
        );
      },
    },
    {
      id: "beneficiaryName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficial Owner" />,
      accessorKey: "beneficiary.name",
      size: 100,
      cell: ({ row }) => {
        return (
          <div>
            <h4 className=" text-neutral-600 text-sm">{row.original?.beneficiary?.name}</h4>
            <p className="text-neutral-500 ">{row.original?.beneficiary?.account}</p>
          </div>
        );
      },
    },
    {
      id: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      accessorKey: "amount",
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-heading text-end">
              {formatAUD(row.original?.amount, row.original?.currency)}
            </p>
          </div>
        );
      },
      size: 100,
    },

    {
      id: "channel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
      accessorKey: "channel",
      size: 100,
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-center text-muted-foreground">{row.original?.channel || "N/A"}</p>
          </div>
        );
      },
    },
    {
      id: "reference",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ref" />,
      accessorKey: "reference",
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-muted-foreground">{row.original?.reference || "N/A"}</p>
          </div>
        );
      },
    },
    {
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      accessorKey: "Status",
      cell: ({ row }) => {
        return (
          <>
            <StatusPill icon={<IconPennant />} variant={statusVariants[row.original.status]}>
              {row.original.status}
            </StatusPill>
          </>
        );
      },
    },
    {
      id: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date & Time" />,
      accessorKey: "date",
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-muted-foreground font-semibold">
              {formatDateTime(row.original?.timeStamp)?.date}
            </p>
            <p className="text-secondary-heading ">
              {formatDateTime(row.original?.timeStamp)?.time}
            </p>
          </div>
        );
      },
      size: 100,
    },
  ];
  return columns;
};

export const Transactions = ({ customerId }) => {
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    const fetchTransactions = async () => {
      setFetching(true);
      const transactions = await getCustomerTransactions(customerId);
      setFetching(false);
      setTransactions(transactions);
    };
    fetchTransactions();
  }, [customerId]);
  return (
    <div>
      <CustomResizableTable
        columns={getColumns()}
        data={transactions?.data || []}
        loading={fetching}
        mainClass="transactions-table"
      />
    </div>
  );
};
