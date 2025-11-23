'use client';

import { useState } from 'react';
import { Search, Download } from 'lucide-react';

const mockData = [
  {
    id: '1',
    dateTime: '2023-06-15 14:32:10',
    user: 'admin@fintech.com',
    component: 'Scoring Rule',
    description: 'Updated weight for Transaction Frequency rule',
    previousValue: '20%',
    newValue: '25%',
  },
  {
    id: '2',
    dateTime: '2023-06-15 14:32:10',
    user: 'admin@fintech.com',
    component: 'Scoring Rule',
    description: 'Updated weight for Transaction Frequency rule',
    previousValue: '20%',
    newValue: '25%',
  },
  {
    id: '3',
    dateTime: '2023-06-15 14:32:10',
    user: 'admin@fintech.com',
    component: 'Scoring Rule',
    description: 'Updated weight for Transaction Frequency rule',
    previousValue: '20%',
    newValue: '25%',
  },
];

export default function ScoringChangeHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = 68;

  const filteredData = mockData.filter(
    (item) =>
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dateTime.includes(searchQuery)
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-black mb-2">Change History</h1>
            <p className="text-gray-600">Audit trail of scoring configuration changes</p>
          </div>
        </div>

        {/* Search and Export */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, ID, date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-6 py-2 bg-cyan-400 text-black rounded-lg font-medium hover:bg-cyan-500 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV/Excel
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Component</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Change Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Previous Value</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">New Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-black">{item.dateTime}</td>
                    <td className="px-6 py-4 text-sm text-black">{item.user}</td>
                    <td className="px-6 py-4 text-sm text-black">{item.component}</td>
                    <td className="px-6 py-4 text-sm text-black">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-black">{item.previousValue}</td>
                    <td className="px-6 py-4 text-sm text-black font-medium">{item.newValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors">
            ← Previous
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${currentPage === 1
              ? 'bg-gray-400 text-white'
              : 'border border-gray-300 text-black hover:bg-gray-100'
              }`}
          >
            1
          </button>
          <button className="w-8 h-8 rounded border border-gray-300 text-black hover:bg-gray-100 flex items-center justify-center text-sm font-medium">
            2
          </button>
          <button className="w-8 h-8 rounded border border-gray-300 text-black hover:bg-gray-100 flex items-center justify-center text-sm font-medium">
            3
          </button>
          <span className="text-gray-600 text-sm">...</span>
          <button className="w-8 h-8 rounded border border-gray-300 text-black hover:bg-gray-100 flex items-center justify-center text-sm font-medium">
            67
          </button>
          <button className="w-8 h-8 rounded border border-gray-300 text-black hover:bg-gray-100 flex items-center justify-center text-sm font-medium">
            68
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors">
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}
