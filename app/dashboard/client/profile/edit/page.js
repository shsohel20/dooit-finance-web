'use client'
import { useLoggedInUserStore } from '@/app/store/useLoggedInUser'
import { ClientEditForm } from '@/views/profile/Edit';
import React from 'react'

export default function EditProfile() {

  return (
    <div>
      <ClientEditForm />
    </div>
  )
}
