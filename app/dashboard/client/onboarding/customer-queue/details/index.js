'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import { DetailViewModal } from '@/views/onboarding/customer-queue/details';

export default function CustomerQueueDetails() {
  const id = useSearchParams().get('id');
  return (
    <div>
      <DetailViewModal open={open} setOpen={setOpen} currentId={id} />
    </div>
  )
}