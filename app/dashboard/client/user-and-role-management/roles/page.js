"use client";
import CustomResizableTable from "@/components/ui/CustomResizable";
import CustomPagination from "@/components/CustomPagination";
import React, { useCallback, useEffect, useState } from "react";
import { getAllRoles, updateRole } from "../actions";
import { Button } from "@/components/ui/button";
import { Lock, PencilIcon } from "lucide-react";
import PermissionDrawer from "@/views/privacy/permissions/PermissionDrawer";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const getRolesColumns = (handleViewPermissions, handleEditRole) => {
  return [
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
            <Lock />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className=""
            onClick={() => handleEditRole(row.original)}
          >
            <PencilIcon />
          </Button>
        </div>
      ),
      size: 100,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
  ];
};
export default function RolesPage() {
  const [allRoles, setAllRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openRoleForm, setOpenRoleForm] = useState(false);
  const [roleInput, setRoleInput] = useState("");
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
  const handleEditRole = (role) => {
    setRoleInput(role.name);
    setSelectedRole(role);
    setOpenRoleForm(true);
  };
  const handleModalClose = () => {
    setOpenRoleForm(false);
    setRoleInput("");
  };
  const handleEditRoleSubmit = async () => {
    try {
      const response = await updateRole(selectedRole?._id, { name: roleInput });
      if (response.succeed || response.success) {
        toast.success("Role updated successfully!");
        fetchRoles();
        setSelectedRole(null);
        handleModalClose();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role!");
    }
  };
  return (
    <div>
      {" "}
      <CustomResizableTable
        columns={getRolesColumns(handleViewPermissions, handleEditRole)}
        data={allRoles?.data}
        tableId="roles-permissions-table"
        mainClass="roles-permissions-table"
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
          setRole={setSelectedRole}
        />
      )}
      {openRoleForm && (
        <Dialog open={openRoleForm} onOpenChange={handleModalClose}>
          <DialogContent className="z-50">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Role</Label>
              <Input
                type="text"
                placeholder="Enter Role"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
              />
            </div>
            <div>
              <Button variant="outline" className="w-full mt-2" onClick={handleEditRoleSubmit}>
                Add Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
