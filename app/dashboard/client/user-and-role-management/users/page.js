"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchIcon, EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteUser, getAllRoles, getAllUsers } from "../actions";
import dynamic from "next/dynamic";
import CustomPagination from "@/components/CustomPagination";
import UserForm from "@/views/user-and-role/form";
import PermissionDrawer from "@/views/privacy/permissions/PermissionDrawer";
const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

export default function UserManagementDashboard() {
  const [activeTab, setActiveTab] = useState("all-users");
  const [searchQuery, setSearchQuery] = useState("");
  const [allRoles, setAllRoles] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [id, setId] = useState(null);

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
    };

    try {
      const users = await getAllUsers(queryParams);
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [currentPage, limit]);
  useEffect(() => {
    fetchRoles();
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit]);

  const statCards = [
    { label: "Total Users", value: "42" },
    { label: "Active Users", value: "38" },
    { label: "Pending", value: "3" },
    { label: "Suspended", value: "2" },
  ];

  const handleEditUser = (id) => {
    setId(id);
    setOpenUserForm(true);
  };
  const handleDeleteUser = async (id) => {
    // try {
    //   const response = await deleteUser(id)
    //   if(response.success) {
    //     fetchUsers()
    //   }
    // } catch (error) {
    //   console.error("Error deleting user:", error);
    // }
  };

  const usersColumns = [
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          {/* <Button size="sm" variant="outline" className="">
            <EyeIcon />
          </Button> */}
          <Button
            size="sm"
            variant="outline"
            className=""
            onClick={() => handleEditUser(row.original._id)}
          >
            <PencilIcon />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className=""
            onClick={() => handleDeleteUser(row.original._id)}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
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
    // {
    //   id: 'department',
    //   header: 'Department',
    //   accessorKey: 'department',
    //   cell: ({ row }) => (
    //     <div className='text-sm text-gray-500'>
    //       <p>{row.original.department}</p>
    //     </div>
    //   ),
    // },
    // {
    //   id: 'lastLogin',
    //   header: 'Last Login',
    //   accessorKey: 'lastLogin',
    //   cell: ({ row }) => (
    //     <div className='text-sm text-gray-500'>
    //       <p>{row.original.lastLogin}</p>
    //     </div>
    //   ),
    // },
    // {
    //   id: 'status',
    //   header: 'Status',
    //   accessorKey: 'status',
    //   cell: ({ row }) => (
    //     <div className='text-sm text-gray-500'>
    //       <p>{row.original.status}</p>
    //     </div>
    //   ),
    // },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleLimitChange = (limit) => {
    setLimit(limit);
    setCurrentPage(1);
  };
  const totalUsers = allUsers?.totalRecords;
  return (
    <div className="min-h-screen ">
      <PageHeader>
        <PageTitle>User Management</PageTitle>
        {/* <PageDescription>Manage users and roles in the system</PageDescription> */}
      </PageHeader>

      <main className="">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-smoke-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div> */}
        {/* Role Management Section */}
        {/* <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allRoles?.data?.map((role) => (
              <div key={role.name} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 uppercase">{role.name}</h3>
                <p className="text-sm text-gray-600 mt-3">{role.users} users</p>
                <PermissionDrawer role={role} />
              </div>
            ))}
          </div>
        </div> */}

        {/* User Management Section */}
        <div className="mb-12">
          <Tabs
            defaultValue="all-users"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* <TabsList className="border-b border-gray-200 bg-white p-0 mb-4">
              <TabsTrigger
                value="all-users"

              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="admins"

              >
                Admins
              </TabsTrigger>
              <TabsTrigger
                value="compliance"

              >
                Compliance
              </TabsTrigger>
              <TabsTrigger
                value="analysts"

              >
                Analysts
              </TabsTrigger>
            </TabsList> */}

            <TabsContent value="all-users" className="mt-4">
              <div className="flex items-center justify-between">
                {/* filter */}
                <div>
                  <div className=" flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 max-w-md w-full">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="border-0 bg-transparent shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button size="sm" className="" onClick={() => setOpenUserForm(true)}>
                  <PlusIcon /> Add User
                </Button>
              </div>

              {/* Users Table */}
              <div className=" ">
                <CustomResizableTable
                  columns={usersColumns}
                  data={allUsers?.data}
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
            </TabsContent>

            {/* Other tab contents */}
            {["admins", "compliance", "analysts"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="mb-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <SearchIcon className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="border-0 bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0"
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-500">Users in this category will appear here</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      {openUserForm && (
        <UserForm
          open={openUserForm}
          setOpen={setOpenUserForm}
          allRoles={allRoles?.data || []}
          fetchUsers={fetchUsers}
          id={id}
          setId={setId}
          fetchRoles={fetchRoles}
        />
      )}
    </div>
  );
}
