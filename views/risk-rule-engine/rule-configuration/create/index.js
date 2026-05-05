'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader, PageTitle, PageDescription } from '@/components/common'
import RuleForm from '../form'

const LIST_PATH = '/dashboard/client/risk-rule-engine/rule-configuration'

export default function RuleCreate() {
  const router = useRouter()
  return (
    <div>
      <PageHeader>
        <PageTitle>Create Rule</PageTitle>
        <PageDescription>
          Define a new rule. Required fields are marked *.
        </PageDescription>
      </PageHeader>
      <RuleForm
        mode="create"
        onCancel={() => router.push(LIST_PATH)}
        onSaved={(rule) =>
          router.push(rule?._id ? `${LIST_PATH}/${rule._id}` : LIST_PATH)
        }
      />
    </div>
  )
}
