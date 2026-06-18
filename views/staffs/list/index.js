"use client";
import { getStaffs } from "@/app/dashboard/client/staffs/actions";
import { Button } from "@/components/ui/button";
import CustomResizableTable from "@/components/ui/CustomResizable";
import { IconEye } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
export default function StaffsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const fetchData = async () => {
    setLoading(true);
    const response = await getStaffs({ page: currentPage, limit: limit });
    console.log("response", response);
    setData(response.data);
    setLoading(false);
    setTotalItems(response.totalRecords);
    setTotalPages(response.totalPages);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);

  const columns = [
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            <Button variant="outline" size="icon">
              <IconEye />
            </Button>
          </div>
        );
      },
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <div>
            <p>
              {row.original?.personal.firstName} {row.original?.personal.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{row.original?.contact?.workEmail}</p>
          </div>
        );
      },
    },

    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground tabular-nums">
            {row.original?.personal?.nationality} {row.original?.contact?.phone}
          </div>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        return <div className="text-sm text-muted-foreground">{row.original?.user?.role}</div>;
      },
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "status",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            {row.original?.contact?.residentialAddress}
          </div>
        );
      },
    },
    // {
    //   id: "createdAt",
    //   header: "Created At",
    //   accessorKey: "createdAt",
    // },
    // {
    //   id: "updatedAt",
    //   header: "Updated At",
    //   accessorKey: "updatedAt",
    // },
  ];
  return (
    <div>
      <CustomResizableTable
        columns={columns}
        data={data}
        mainClass="staffs-table"
        tableId="staffs-table"
        loading={loading}
      />
    </div>
  );
}
