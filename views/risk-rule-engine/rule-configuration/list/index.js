'use client'
import React, { useState } from 'react'
import allRuleConfigurations from '../JSON/rules.json'
import CustomResizableTable from '@/components/ui/CustomResizable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import RuleConfigurationForm from '../form'

export default function RuleConfigurationList() {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [data, setData] = useState(allRuleConfigurations.slice(0, 20))

  const handleEdit = (item) => {
    setCurrentItem(item)
    setOpenEditModal(true)
  }
  const columns = [
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={() => handleEdit(row.original)}>Edit</Button>
          </div>
        )
      }
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        console.log('row', row)
        return (
          <div className='space-y-2'>
            <p className='font-bold'>{row.original.name}</p>
            <p className='text-sm text-gray-500 text-wrap max-w-[300px]'>{row.original.description}</p>
          </div>
        )
      }
    },
    {
      id: "condition",
      header: "Condition",
      accessorKey: "condition",
      cell: ({ row }) => {
        return (
          <div className='text-gray-500'>
            <p>{row.original.condition}</p>
          </div>
        )
      }
    },
    {
      id: "ruleDomain",
      header: "Rule Domain",
      accessorKey: "ruleDomain",
      cell: ({ row }) => {
        return (
          <div className='text-gray-500'>
            <p>{row.original.ruleDomain}</p>
          </div>
        )
      }
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
    }
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
