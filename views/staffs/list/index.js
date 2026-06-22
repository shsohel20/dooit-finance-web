"use client";
import { getStaffs, onboardStaff } from "@/app/dashboard/client/staffs/actions";
import { Button } from "@/components/ui/button";
import CustomResizableTable from "@/components/ui/CustomResizable";
import { IconEye } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
export default function StaffsList({ onboarding = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const router = useRouter();
  const fetchData = async () => {
    setLoading(true);
    const response = await getStaffs({ page: currentPage, limit: limit });
    console.log("list response", response);
    setData(response.data);
    setLoading(false);
    setTotalItems(response.totalRecords);
    setTotalPages(response.totalPages);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);

  const handleOnboard = async (id) => {
    const response = await onboardStaff(id);
    console.log("response", response);
    if (response.success) {
      toast.success("Staff onboarded successfully");
      fetchData();
    } else {
      toast.error(response.message);
    }
  };
  const columns = [
    ...(!onboarding
      ? [
          {
            id: "actions",
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => {
              return (
                <div className="text-sm text-muted-foreground">
                  <Button
                    onClick={() =>
                      router.push(`/dashboard/client/staffs/details?id=${row.original._id}`)
                    }
                    variant="outline"
                    size="icon"
                  >
                    <IconEye />
                  </Button>
                </div>
              );
            },
          },
        ]
      : []),
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
      id: "nationality",
      header: "Nationality",
      accessorKey: "nationality",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">{row.original?.personal?.nationality}</div>
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
            {row.original?.contact?.phone}
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
    ...(onboarding
      ? [
          {
            id: "onboarding",
            header: "Onboarding",
            accessorKey: "onboarding",
            cell: ({ row }) => {
              return (
                <div>
                  <Button onClick={() => handleOnboard(row.original._id)} variant="outline">
                    Onboard
                  </Button>
                </div>
              );
            },
          },
        ]
      : []),
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
