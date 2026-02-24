'use client';

import { useState, useMemo } from 'react';
import { Plus, Shield, Download, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExceptionFilters } from './exception-filters';
import { ExceptionTable } from './exception-table';
import { ExceptionForm } from './exception-form';
import { ExceptionDetail } from './exception-detail';
import { ExceptionStats } from './exception-stat';
import { mockExceptions, currentUser } from './dummyData';

export default function ExceptionRegisterPage() {
  const [exceptions, setExceptions] = useState(mockExceptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expiryDateFilter, setExpiryDateFilter] = useState();
  const [formOpen, setFormOpen] = useState(false);
  const [detailException, setDetailException] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const hasActiveFilters =
    searchQuery !== '' ||
    riskFilter !== 'all' ||
    statusFilter !== 'all' ||
    expiryDateFilter !== undefined;

  const filteredExceptions = useMemo(() => {
    return exceptions.filter((exc) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !exc.id.toLowerCase().includes(q) &&
          !exc.relatedPolicy.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (riskFilter !== 'all' && exc.riskLevel !== riskFilter) return false;
      if (statusFilter !== 'all' && exc.status !== statusFilter) return false;
      if (expiryDateFilter) {
        const expiryDate = new Date(exc.expiryDate);
        if (expiryDate > expiryDateFilter) return false;
      }
      return true;
    });
  }, [exceptions, searchQuery, riskFilter, statusFilter, expiryDateFilter]);

  function handleClearFilters() {
    setSearchQuery('');
    setRiskFilter('all');
    setStatusFilter('all');
    setExpiryDateFilter(undefined);
  }

  function handleCreateException(exception) {
    setExceptions((prev) => [exception, ...prev]);
  }

  function handleViewDetails(exception) {
    setDetailException(exception);
    setDetailOpen(true);
  }

  const pendingCount = exceptions.filter(
    (e) => e.approvalStatus === 'Pending' || e.approvalStatus === 'Under Review'
  ).length;

  return (
    <div className="min-h-screen ">
      {/* Top nav bar */}

      <main className=" max-w-[1440px]   py-6">
        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight text-balance">
                Exception Register
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage policy exceptions, track approvals, and monitor
                compliance risk across your organization.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm">
                <Download className="size-4" />
                Export
              </Button>
              <Button size="sm" onClick={() => setFormOpen(true)}>
                <Plus className="size-4" />
                Create Exception
              </Button>
            </div>
          </div>

          {/* Stats */}
          <ExceptionStats exceptions={exceptions} />

          {/* Filters + Table Card */}
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    All Exceptions
                  </h2>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {filteredExceptions.length}
                  </Badge>
                </div>
                {hasActiveFilters && (
                  <span className="text-xs text-muted-foreground">
                    Showing {filteredExceptions.length} of {exceptions.length}{' '}
                    exceptions
                  </span>
                )}
              </div>
              <ExceptionFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                riskFilter={riskFilter}
                onRiskFilterChange={setRiskFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                expiryDateFilter={expiryDateFilter}
                onExpiryDateFilterChange={setExpiryDateFilter}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            <ExceptionTable
              exceptions={filteredExceptions}
              userRole={currentUser.role}
              onViewDetails={handleViewDetails}
            />

            {/* Footer */}
            <div className="border-t px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {filteredExceptions.length} exception
                {filteredExceptions.length !== 1 ? 's' : ''} displayed
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated: Feb 24, 2026
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sheet panels */}
      <ExceptionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreateException}
      />

      <ExceptionDetail
        exception={detailException}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
