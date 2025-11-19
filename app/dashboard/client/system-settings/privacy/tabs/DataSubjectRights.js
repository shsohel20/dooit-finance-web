'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';


const mockRequests = [
  {
    id: 'DSAR-2023-001',
    subjectName: 'John Smith',
    requestType: 'Data Access',
    dateSubmitted: '2023-09-10',
    status: 'Completed',
    dueDate: '2023-10-24',
  },
  {
    id: 'DSAR-2023-001',
    subjectName: 'John Smith',
    requestType: 'Data Access',
    dateSubmitted: '2023-09-10',
    status: 'In Progress',
    dueDate: '2023-10-24',
  },
  {
    id: 'DSAR-2023-001',
    subjectName: 'John Smith',
    requestType: 'Data Access',
    dateSubmitted: '2023-09-10',
    status: 'Pending',
    dueDate: '2023-10-24',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function DSARPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = mockRequests.filter(
    (req) =>
      req.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.dateSubmitted.includes(searchTerm)
  );

  return (
    <div className="min-h-screen py-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black mb-2">Data Subject Access Requests</h1>
          <p className="text-gray-600">Manage and track GDPR data access requests</p>
        </div>

        {/* Search and Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg mb-8">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Request ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Subject Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Request Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Date Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, idx) => (
                <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-primary underline cursor-pointer">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-black">{request.subjectName}</td>
                  <td className="px-6 py-4 text-sm text-black">{request.requestType}</td>
                  <td className="px-6 py-4 text-sm text-black">{request.dateSubmitted}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">{request.dueDate}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button className="text-gray-600 hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">Previous</span>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${currentPage === page
                ? 'bg-gray-400 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {page}
            </button>
          ))}
          <span className="text-gray-400">...</span>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">67</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">68</button>
          <span className="text-sm text-gray-600">Next</span>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Compliance Alert */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-start gap-3">
          <div className="text-yellow-600 font-semibold text-lg">!</div>
          <p className="text-yellow-800 text-sm">
            Data Subject Access Requests must be completed within 30 days of receipt as per GDPR requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
