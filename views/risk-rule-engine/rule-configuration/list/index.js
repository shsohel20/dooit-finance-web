'use client'
import React, { useEffect, useState } from 'react'
import allRuleConfigurations from '../JSON/rules.json'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import RuleConfigurationForm from '../form'
import dynamic from 'next/dynamic'
import { getAllRules } from '@/app/dashboard/client/risk-rule-engine/rule-configuration/actions'
const CustomResizableTable = dynamic(() => import('@/components/ui/CustomResizable'), {
  ssr: false,
})

export default function RuleConfigurationList() {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [data, setData] = useState([])

  const handleEdit = (item) => {
    setCurrentItem(item)
    setOpenEditModal(true)
  }

  const getRules = async () => {
    try {
      const res = await getAllRules();
      console.log('res', res)
      setData(res.data)
    } catch (error) {

    }
  }
  useEffect(() => {
    getRules()
  }, [])
  const columns = [
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className=' ' hidden={!row?.original.isEditable}>
            <Button variant='outline' size='sm' onClick={() => handleEdit(row.original)}>Edit</Button>
          </div>
        )
      },
      size: 80,

    },
    {
      id: "name",
      header: "Name",
      accessorKey: "ruleName",
      cell: ({ row }) => {
        return (
          <div className='space-y-2'>
            <p className='font-bold'>{row.original.ruleName}</p>
            <p className='text-sm text-gray-500 text-wrap max-w-[400px]'>{row.original.descriptiveExplanation}</p>
          </div>
        )
      }
    },
    {
      id: "condition",
      header: "Condition",
      accessorKey: "ruleCondition",
      cell: ({ row }) => {
        return (
          <div className='text-gray-500'>
            <p>{row.original.ruleCondition}</p>
          </div>
        )
      }
    },
    {
      id: 'riskscore',
      header: 'Risk Score',
      accessorKey: 'riskScore'
    },

    {
      id: "mainDomain",
      header: "Main Domain",
      accessorKey: "mainDomain",
      cell: ({ row }) => {
        return (
          <div className='text-gray-500'>
            <p>{row.original.mainDomain}</p>
          </div>
        )
      }
    },
    {
      id: "ruleDomain",
      header: "Sub Domain",
      accessorKey: "ruleDomainSubdomain",
      cell: ({ row }) => {
        return (
          <div className='text-gray-500'>
            <p>{row.original.ruleDomainSubdomain}</p>
          </div>
        )
      }
    },
  ]
  return (
    <div>
      <PageHeader>
        <PageTitle>Rule Configuration</PageTitle>
        <PageDescription>Manage and track all rule configurations</PageDescription>
      </PageHeader>
      <div className='flex gap-2'>
        <Input type='text' placeholder='Search' />
        <Select >
          <SelectTrigger className='max-w-[200px]'>
            <SelectValue placeholder='Select a rule domain' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='rule-domain-1'>Rule Domain 1</SelectItem>
            <SelectItem value='rule-domain-2'>Rule Domain 2</SelectItem>
            <SelectItem value='rule-domain-3'>Rule Domain 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CustomResizableTable
        columns={columns}
        data={data}
        // onDoubleClick={handleDoubleClick}
        tableId="rule-configuration-table"
        mainClass="rule-configuration-table-id"
      />
      {openEditModal && <RuleConfigurationForm
        open={openEditModal}
        setOpen={setOpenEditModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        setData={setData}
        data={data}
      />}
    </div>
  )
}
