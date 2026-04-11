"use client";
import CustomResizableTable from "@/components/ui/CustomResizable";
import CustomPagination from "@/components/CustomPagination";
import React, { useCallback, useEffect, useState } from "react";
import { getAllRoles } from "../actions";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import PermissionDrawer from "@/views/privacy/permissions/PermissionDrawer";

const getRolesColumns = (handleViewPermissions) => {
  return [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    // {
    //   id: "description",
    //   header: "Description",
    //   accessorKey: "description",
    // },
    {
      id: "permissions",
      header: "Permissions",
      accessorKey: "permissions",
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className=""
            onClick={() => handleViewPermissions(row.original)}
          >
            <EyeIcon /> Permissions
          </Button>
        </div>
      ),
    },
  ];
};
export default function RolesPage() {
  const [allRoles, setAllRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const fetchRoles = useCallback(async () => {
    try {
      const roles = await getAllRoles();
      setAllRoles(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleLimitChange = (limit) => {
    setLimit(limit);
    setCurrentPage(1);
  };
  const totalRoles = allRoles?.totalRecords;
  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setOpenPermissions(true);
  };
  return (
    <div>
      {" "}
      <CustomResizableTable
        columns={getRolesColumns(handleViewPermissions)}
        data={allRoles?.data}
        tableId="roles-table"
        mainClass="roles-table"
      />
      <CustomPagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalRoles}
        limit={limit}
        onChangeLimit={handleLimitChange}
      />
      {selectedRole && openPermissions && (
        <PermissionDrawer
          open={openPermissions}
          onClose={() => setOpenPermissions(false)}
          role={selectedRole}
        />
      )}
    </div>
  );
}
