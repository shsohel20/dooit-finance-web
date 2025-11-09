import ClientDetails from '@/views/admin/client/details'
import React from 'react'

export default async function ClientDetailsPage({ params }) {
  const { id } = await params;
  console.log('id', id);
  return (
    <ClientDetails id={id} />
  )
}