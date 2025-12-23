'use client'
import { GFSForm } from '@/components/gfs-form'
import React from 'react'
import { useSearchParams } from 'next/navigation';

export default function GFSFormPage() {
  const id = useSearchParams().get('id');
  return (
    <div>
      <GFSForm id={id} />
    </div>
  )
}
