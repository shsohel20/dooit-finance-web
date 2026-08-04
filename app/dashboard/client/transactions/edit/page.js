'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TransactionForm from '@/views/transactions/form';
import { PageHeader, PageTitle, PageDescription } from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';

function EditTransactionInner() {
  const id = useSearchParams().get('id');
  return <TransactionForm id={id} />;
}

export default function EditTransactionPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Edit Transaction</PageTitle>
        <PageDescription>Update an existing transaction record</PageDescription>
      </PageHeader>
      <Suspense fallback={
        <div className="space-y-5 max-w-6xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      }>
        <EditTransactionInner />
      </Suspense>
    </div>
  );
}
