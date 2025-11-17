'use client';

import React, { useState } from 'react';
import { Download, Search, File, FileText } from 'lucide-react';

const documents = [
  {
    id: 1,
    name: 'Risk Assessment Report',
    type: 'PDF',
    uploadDate: '2023-05-18',
    size: '1.2 MB'
  },
  {
    id: 2,
    name: 'Performance Metrics Data',
    type: 'Excel',
    uploadDate: '2023-05-18',
    size: '1.2 MB'
  },
  {
    id: 3,
    name: 'Mitigation Plan',
    type: 'Doc',
    uploadDate: '2023-05-18',
    size: '1.2 MB'
  }
];

export default function DocumentsTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const getFileIcon = (type) => {
    if (type === 'PDF') return '📄';
    if (type === 'Excel') return '📊';
    if (type === 'Doc') return '📝';
    return '📋';
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full ">
      <div className="mb-8">
        <h2 className="font-bold text-foreground mb-1">
          Documents
        </h2>
        <p className="text-muted-foreground">
          Manage and download incident-related documentation
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
      </div>

      {/* Documents grid */}
      <div className="grid gap-4">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-lg p-4 md:p-6 hover:border-accent hover:shadow-sm transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="text-2xl flex-shrink-0">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium">
                      {doc.type}
                    </span>
                    <span>{doc.uploadDate}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Search document"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-all hover:shadow-md"
                  aria-label="Download document"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <File className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold ">{filteredDocuments.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Documents</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold ">
            {(filteredDocuments.reduce((sum, doc) => sum + parseFloat(doc.size), 0)).toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Size (MB)</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center col-span-2 md:col-span-1">
          <div className="text-2xl font-bold ">May 2023</div>
          <div className="text-xs text-muted-foreground mt-1">Last Updated</div>
        </div>
      </div>
    </div>
  );
}
