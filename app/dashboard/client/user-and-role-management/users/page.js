"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SearchIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MoreVertical,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, PageTitle } from "@/components/common";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUser, getAllRoles, getAllUsers, updateUser } from "../actions";
import dynamic from "next/dynamic";
import CustomPagination from "@/components/CustomPagination";
import UserForm from "@/views/user-and-role/form";
import useGetUser from "@/hooks/useGetUser";
import { toast } from "sonner";

const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

export default function UserManagementDashboard() {
  const { loggedInUser } = useGetUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allRoles, setAllRoles] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [id, setId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Debounce the search box before it drives a fetch.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setSearchTerm(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchRoles = useCallback(async () => {
    try {
      const roles = await getAllRoles();
      setAllRoles(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    const queryParams = {
      page: currentPage,
      limit: limit,
      ...(searchTerm ? { name: searchTerm } : {}),
    };

    setLoading(true);
    try {
      const users = await getAllUsers(queryParams);
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Hiding these actions is convenience only — the API is the real guard and
  // returns 403 for both. `loggedInUser` loads asynchronously, so on the first
  // render nothing matches and the actions are briefly visible on your own row;
  // clicking through in that window is still rejected server-side.
  const currentUserId = loggedInUser?._id ?? loggedInUser?.id ?? null;
  const isCurrentUser = (userId) =>
    Boolean(currentUserId) && String(currentUserId) === String(userId);

  const handleEditUser = (userId) => {
    setId(userId);
    setOpenUserForm(true);
  };

  const handleAddUser = () => {
    setId(null);
    setOpenUserForm(true);
  };

  // Also clear `id` whenever the sheet closes (cancel, backdrop click, submit),
  // so it can't leak into the next "Add User" open.
  const handleUserFormOpenChange = (open) => {
    setOpenUserForm(open);
    if (!open) setId(null);
  };

  const handleDeleteUser = (userId) => {
    setDeleteId(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    setDeleting(true);
    try {
      const response = await deleteUser(deleteId);
      if (response.success) {
        toast.success("User deleted successfully");
        setDeleteDialogOpen(false);
        setDeleteId(null);
        fetchUsers();
      } else {
        toast.error(response.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (user) => {
    const toastId = toast.loading(user.isActive ? "Deactivating user..." : "Activating user...");
    try {
      const response = await updateUser(user._id, { isActive: !user.isActive });
      if (response.success) {
        toast.success(user.isActive ? "User deactivated" : "User activated", { id: toastId });
        fetchUsers();
      } else {
        toast.error(response.error || "Failed to update user status", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status", { id: toastId });
    }
  };

  const usersColumns = [
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      size: 80,
      cell: ({ row }) => {
        // You can't deactivate or delete yourself — the API rejects both (403),
        // so don't offer the actions in the first place.
        const isSelf = isCurrentUser(row.original._id);

        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEditUser(row.original._id)}>
                  <PencilIcon className="size-3 text-muted-foreground/70" />
                  Edit
                </DropdownMenuItem>
                {!isSelf && (
                  <DropdownMenuItem onClick={() => handleToggleActive(row.original)}>
                    {row.original.isActive ? (
                      <>
                        <UserX className="size-3 text-muted-foreground/70" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-3 text-muted-foreground/70" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {!isSelf && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDeleteUser(row.original._id)}
                  >
                    <TrashIcon className="size-3" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      id: "user",
      header: "User",
      accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-gray-700 font-bold capitalize">{row.original.name}</p>
          <p className="text-sm text-gray-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <div className=" text-gray-500 border rounded-full flex items-center gap-2 px-3 py-1 w-max">
          <div className="size-2 rounded-full bg-gray-500" />
          <p className="text-xs font-semibold">{row.original.role}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <div
          className={`flex items-center gap-2 border rounded-full px-3 py-1 w-max text-xs font-semibold ${
            row.original.isActive ? "text-green-600" : "text-gray-500"
          }`}
        >
          <div
            className={`size-2 rounded-full ${row.original.isActive ? "bg-green-500" : "bg-gray-400"}`}
          />
          {row.original.isActive ? "Active" : "Inactive"}
        </div>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };
  const totalUsers = allUsers?.totalRecords;

  return (
    <div className="min-h-screen">
      <PageHeader>
        <PageTitle>User Management</PageTitle>
      </PageHeader>

      <main>
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 max-w-md w-full">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name..."
                className="border-0 bg-transparent shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleAddUser}>
              <PlusIcon /> Add User
            </Button>
          </div>

          <div>
            <CustomResizableTable
              columns={usersColumns}
              data={allUsers?.data}
              loading={loading}
              tableId="users-table"
              mainClass="users-table"
            />
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={totalUsers}
              limit={limit}
              onChangeLimit={handleLimitChange}
            />
          </div>
        </div>
      </main>

      {openUserForm && (
        <UserForm
          open={openUserForm}
          setOpen={handleUserFormOpenChange}
          allRoles={allRoles?.data || []}
          fetchUsers={fetchUsers}
          id={id}
          setId={setId}
          fetchRoles={fetchRoles}
          isSelf={Boolean(id) && isCurrentUser(id)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              variant="destructive"
              disabled={deleting}
            >
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
    </div>
  );
}
