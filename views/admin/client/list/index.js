"use client";
import { deleteClient, getAllClients } from "@/app/dashboard/client/list/actions";
import useClientStore from "@/app/store/useClient";
import CustomPagination from "@/components/CustomPagination";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import CustomResizableTable from "@/components/ui/CustomResizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientList() {
  const {
    clients,
    fetching,
    currentPage,
    limit,
    totalItems,
    setClients,
    setFetching,
    setCurrentPage,
    setLimit,
    setTotalItems,
  } = useClientStore();
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const columns = [
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      size: 100,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/client/list/details/${row?.original?.id}`}>
                  <IconEye className="size-3 text-muted-foreground/70" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/client/list/form/${row?.original?.id}`}>
                  <IconEdit className="size-3 " />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(row?.original?.id)}
              >
                <IconTrash className="size-3 " />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      size: 100,
      cell: ({ row }) => {
        return (
          <div>
            <p className="font-bold text-gray-700">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        );
      },
      // bod
    },

    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      size: 100,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.phone || "-"}</span>
      ),
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "address.street",
      size: 50,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          `${row?.original?.address?.street}, ${row?.original?.address?.city}, $
          {row?.original?.address?.country}`
        </span>
      ),
    },
    {
      id: "website",
      header: "Website",
      accessorKey: "website",
      size: 100,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link
            href={row?.original?.website || "#"}
            target="_blank"
            className="text-primary hover:underline"
          >
            {row?.original?.website || "-"}
          </Link>
          <IconExternalLink className="size-3 text-primary" />
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorKey: "createdAt",
      size: 100,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "updatedAt",
      header: "Updated At",
      accessorKey: "updatedAt",
      size: 100,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];
  const fetchData = async (page, limit) => {
    setFetching(true);
    const response = await getAllClients(page, limit);
    setTotalItems(response.totalRecords);
    setClients(response.data);
    setFetching(false);
  };
  useEffect(() => {
    setLoading(true);
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleLimitChange = (limit) => {
    setLimit(limit);
    setCurrentPage(1);
  };

  return (
    <div>
      <CustomResizableTable
        columns={columns}
        data={clients}
        loading={fetching}
        tableId="client-list"
        mainClass="client-table"
      />
      {/* <CustomResizableTable
        columns={columns}
        data={customers}
        onDoubleClick={handleDoubleClick}
        loading={fetching}
        actions={<Actions />}
        mainClass="customer-queue-table"
        tableId="customer-queue-table"
      /> */}
      <CustomPagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        limit={limit}
        onChangeLimit={handleLimitChange}
      />
      {/* <DataTable2 columns={columns} data={clients} loading={fetching}
        config={{
          size: "default",
          columnResizingTableId: "user-camel-case-table",

        }} /> */}
      <DeleteDialog
        id={deleteId}
        setId={setDeleteId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}

const DeleteDialog = ({ id, setId, open, onOpenChange }) => {
  const { currentPage, limit, setClients, setTotalItems, setFetching } = useClientStore();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const response = await deleteClient(id);
    console.log("response", response);
    if (response.success) {
      setDeleting(false);
      setId(null);
      onOpenChange(false);
      setFetching(true);
      const response = await getAllClients(currentPage, limit);
      setFetching(false);
      setClients(response.data);
      setTotalItems(response.totalRecords);
      toast.success("Client deleted successfully");
      setFetching(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the client and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive" disabled={deleting}>
            {deleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
