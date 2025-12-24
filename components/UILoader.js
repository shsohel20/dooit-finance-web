'use client';
import React from 'react'

import FormSkeleton from './Formskeleton'

import { DataProcessingLoader } from './ui/CommonLoader'



export default function UILoader({ loading = false, children, type = 'form' }) {
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-[500px] w-full">
          {type === 'form' ? (
            <FormSkeleton />
          ) : (
            <DataProcessingLoader />
          )}
        </div>
      ) : (
        children
      )}
    </>
  )
}