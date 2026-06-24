import React, { Suspense } from 'react';
import TransactionForm from '@/views/transactions/form';
import { PageHeader, PageTitle, PageDescription } from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewTransactionPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>New Transaction</PageTitle>
        <PageDescription>Create a new transaction record</PageDescription>
      </PageHeader>
      <Suspense fallback={
        <div className="space-y-5 max-w-6xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      }>
        <TransactionForm />
      </Suspense>
    </div>
  );
}
