'use client'

import TransactionForm from '@/views/transactions/form';
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function EditTransaction() {
  const id = useSearchParams().get('id');
  return (
    <div>
      <TransactionForm id={id} />
    </div>
  )
}