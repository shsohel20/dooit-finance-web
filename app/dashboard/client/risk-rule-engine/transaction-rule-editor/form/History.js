'use client';

import { useState } from 'react';
import { Search, Download } from 'lucide-react';


const mockChanges = [
  {
    id: '1',
    date: '2025-06-15',
    time: '14:32:10',
    user: 'admin@fintech.com',
    ruleId: 'TRK-001',
    action: 'Modified',
    description: 'Updated transaction amount threshold from 5000 to 10000',
  },
  {
    id: '2',
    date: '2025-06-15',
    time: '14:32:10',
    user: 'admin@fintech.com',
    ruleId: 'TRK-001',
    action: 'Modified',
    description: 'Updated transaction amount threshold from 5000 to 10000',
  },
  {
    id: '3',
    date: '2025-06-15',
    time: '14:32:10',
    user: 'admin@fintech.com',
    ruleId: 'TRK-001',
    action: 'Modified',
    description: 'Updated transaction amount threshold from 5000 to 10000',
  },
];

export default function ChangeHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = 68;

  const filteredChanges = mockChanges.filter((change) =>
    change.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    change.ruleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    change.date.includes(searchQuery)
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">Change History</h1>
          <p className="text-muted-foreground">Audit log of all rule modifications and changes</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity font-medium">
            <Download className="w-4 h-4" />
            Export CSV/Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-card border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date & Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rule ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Change Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredChanges.map((change, index) => (
                <tr
                  key={change.id}
                  className={`border-b border-border hover:bg-secondary/30 transition-colors ${index === filteredChanges.length - 1 ? 'border-b-0' : ''
                    }`}
                >
                  <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                    {change.date} {change.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{change.user}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{change.ruleId}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{change.action}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{change.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${currentPage === page
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {page}
              </button>
            ))}
            <span className="text-muted-foreground">...</span>
            <button className="w-8 h-8 text-sm text-muted-foreground hover:text-foreground transition-colors">67</button>
            <button className="w-8 h-8 text-sm text-muted-foreground hover:text-foreground transition-colors">68</button>
          </div>
          <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}
