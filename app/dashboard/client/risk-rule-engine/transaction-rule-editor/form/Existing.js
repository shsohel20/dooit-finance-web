'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';



const mockRules = [
  {
    id: 'TRX-001',
    name: 'High Value Transaction Alert',
    category: 'Transaction Monitoring',
    priority: 'High',
    status: 'Active',
    lastModified: '2025-09-14 14:32:10',
  },
  {
    id: 'TRX-002',
    name: 'High Value Transaction Alert',
    category: 'Transaction Monitoring',
    priority: 'High',
    status: 'Active',
    lastModified: '2025-09-14 14:32:10',
  },
  {
    id: 'TRX-003',
    name: 'High Value Transaction Alert',
    category: 'Transaction Monitoring',
    priority: 'High',
    status: 'Active',
    lastModified: '2025-09-14 14:32:10',
  },
];

export default function ExistingRulesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      case 'Draft':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white ">
      <div className="">
        <h1 className=" font-semibold text-gray-900 mb-4">Existing Rules</h1>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rule ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rule Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Modified</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockRules.map((rule, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{rule.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{rule.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rule.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rule.lastModified}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === page ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
