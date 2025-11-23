'use client'

import { useState } from 'react'
import { Edit2, Trash2, Copy, SearchIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UserManagementDashboard() {
  const [activeTab, setActiveTab] = useState('all-users')
  const [searchQuery, setSearchQuery] = useState('')

  const statCards = [
    { label: 'Total Users', value: '42' },
    { label: 'Active Users', value: '38' },
    { label: 'Pending', value: '3' },
    { label: 'Suspended', value: '2' },
  ]

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@infsecure.com',
      role: 'System Admin',
      department: 'IT & Security',
      lastLogin: 'Today, 09:24 AM',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@infsecure.com',
      role: 'Compliance Officer',
      department: 'Compliance',
      lastLogin: 'Yesterday, 03:45 PM',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@infsecure.com',
      role: 'KYC Analyst',
      department: 'Operations',
      lastLogin: '2 days ago',
      status: 'Active',
    },
  ]

  const roles = [
    {
      name: 'System Administrator',
      users: 4,
    },
    {
      name: 'Compliance Officer',
      users: 8,
    },
    {
      name: 'KYC Analyst',
      users: 22,
    },
  ]

  return (
    <div className="min-h-screen ">


      <main className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* User Management Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
              Add User
            </Button>
          </div>

          <Tabs defaultValue="all-users" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="border-b border-gray-200 bg-white p-0 mb-4">
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
            </TabsList>

            <TabsContent value="all-users" className="mt-0">
              <div className="mb-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="border-0 bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Users Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-700">User</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Department</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Last Login</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{user.role}</td>
                        <td className="px-4 py-3 text-gray-700">{user.department}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{user.lastLogin}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{user.status}</Badge>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Other tab contents */}
            {['admins', 'compliance', 'analysts'].map((tab) => (
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

        {/* Role Management Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div key={role.name} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-600 mt-3">{role.users} users</p>
                <Button size="sm" variant="outline" className="w-full mt-4">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
