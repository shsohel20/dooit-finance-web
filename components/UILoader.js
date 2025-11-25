import React from 'react'
import { Loader2 } from 'lucide-react'
import FormSkeleton from './Formskeleton'
export default function UILoader({ loading = false, children, type = 'form' }) {
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          {type === 'form' ? (
            <FormSkeleton />
          ) : (
            <Loader2 className="animate-spin size-10" />
          )}
        </div>
      ) : (
        children
      )}
    </>
  )
}