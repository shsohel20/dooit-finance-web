"use client";
import { PageDescription, PageHeader, PageTitle } from '@/components/common';

import { DataTableColumnHeader } from '@/components/DatatableColumnHeader';


import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import ResizableTable from '@/components/ui/Resizabletable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { StatusPill } from '@/components/ui/StatusPill';

import { IconDotsVertical, IconDownload, IconEye, IconGridDots, IconList, IconPennant, IconSearch, IconUpload } from '@tabler/icons-react';

import React, { useEffect, useState } from 'react'

import { ArrowRight, Plus } from 'lucide-react';
import { formatAUD, formatDateTime, objWithValidValues } from '@/lib/utils';
import TransactionDetailView from '../form/Details';
import { getTransactions } from '@/app/dashboard/client/transactions/actions';
import TransactionReportingModal from '../form/ReportingModal';
import TransactionDashboard from './Dashboard';
import CustomPagination from '@/components/CustomPagination';


const TransactionListView = () => {
  const [openDetailView, setOpenDetailView] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [viewReport, setViewReport] = useState(false);
  const [currentItemReport, setCurrentItemReport] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const totalItems = transactions?.totalRecords || 0;
  console.log('transactions', transactions)

  useEffect(() => {
    const fetchTransactions = async () => {
      setFetching(true);
      const queryParams = {
        page: currentPage,
        limit: limit,
      };
      const transactions = await getTransactions(queryParams);
      setFetching(false);
      setTransactions(transactions);
    }
    fetchTransactions();
  }, [currentPage, limit]);

  const handleViewReportClick = (item) => {
    setCurrentItemReport(item);
    setViewReport(true);
  }

  const riskVariants = {
    Low: 'info',
    Medium: 'warning',
    High: 'danger',
  };
  const statusVariants = {
    pending: 'info',
    completed: 'success',
    flagged: 'warning',
    rejected: 'danger',
  };
  const handleViewClick = (item) => {
    setCurrentItem(item);
    setOpenDetailView(true);
  }
  const columns = [
    {
      header: 'Actions',
      accessorKey: 'actions',
      size: 60,
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                // size="sm"
                className="!py-2 h-auto "
              >
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleViewClick(row.original)}>
                <IconEye className="mr-2 size-3 text-muted-foreground/70" />
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
        />
      ),
      accessorKey: 'uid',
    },
    {
      header: ({ column }) => (
        <span>Flow Direction</span>
      ),
      accessorKey: 'sender.name',
      size: 200,
      cell: ({ row }) => {
        return <div className='flex gap-2 items-center'>
          <div >
            <h4 className='text-zinc-800 font-semibold'>{row.original?.sender?.name}</h4>
            <p className='text-zinc-500 text-xs'>{row.original?.sender?.account}</p>
          </div>
          <div><ArrowRight className='size-4 text-green-500' /></div>
          <div>
            <h4 className='text-zinc-800 font-semibold'>{row.original?.receiver?.name}</h4>
            <p className='text-zinc-500 text-xs'>{row.original?.receiver?.account}</p>
          </div>
        </div>
      },
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
        />
      ),
      accessorKey: 'type',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Beneficial Owner"
        />
      ),
      accessorKey: 'beneficiary.name',
      size: 100,
      cell: ({ row }) => {
        return <div>
          <h4 className='text-zinc-800 font-semibold'>{row.original?.beneficiary?.name}</h4>
          <p className='text-zinc-500 text-xs'>{row.original?.beneficiary?.account}</p>
        </div>
      },
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Amount"
        />
      ),
      accessorKey: 'amount',
      cell: ({ row }) => {
        return <div>
          <p className='text-zinc-600 text-end'>{formatAUD(row.original?.amount, row.original?.currency)}</p>
        </div>
      },
      size: 100,
    },

    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Method"
        />
      ),
      accessorKey: 'channel',
      size: 100,
      cell: ({ row }) => {
        return <div>
          <p className='text-zinc-600 text-end'>{row.original?.channel || 'N/A'}</p>
        </div>
      },
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Ref"
        />
      ),
      accessorKey: 'reference'
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      accessorKey: 'Status',
      cell: ({ row }) => {
        return <>
          <StatusPill
            icon={<IconPennant />}
            variant={statusVariants[row.original.status]}
          >
            {row.original.status}
          </StatusPill>
        </>
      },
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date & Time"
        />
      ),
      accessorKey: 'date',
      cell: ({ row }) => {
        return <div>
          <p className='text-zinc-800 font-semibold'>{formatDateTime(row.original?.timeStamp)?.date}</p>
          <p className='text-zinc-400 '>{formatDateTime(row.original?.timeStamp)?.time}</p>
        </div>
      },
      size: 100,
    },


  ]

  const Actions = () => {
    return (
      <div className='flex items-center gap-2'>
        <Button variant="outline" size='sm'>
          <IconDownload />
          Export CSV
        </Button>
        <Button variant="outline" size='sm'>
          <IconUpload />
          Import CSV
        </Button>
        <Button size='sm'>
          <Plus /> Add New
        </Button>
      </div>
    )
  }

  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  }
  const handleLimitChange = (limit) => {
    setLimit(limit);
    setCurrentPage(1);
  }



  return (
    <div>
      <PageHeader>
        <PageTitle>Transaction History</PageTitle>
        <PageDescription>
          View and manage transaction history for your clients.
        </PageDescription>
      </PageHeader>
      <TransactionDashboard transactions={transactions?.data || []} />

      <div className='flex items-center justify-between bg-white shadow-sm rounded-md p-4'>
        <div className='flex items-center gap-2   '>
          <InputGroup className={'max-w-64'}>
            <InputGroupInput placeholder="Search by name, id..." />
            <InputGroupAddon >
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="ID" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Name" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Credit" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Debit" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size='sm'>+</Button>
        </div>
        <div>
          <ButtonGroup>
            <Button
              variant="outline"
            // onClick={() => setView('grid')}
            // variant={view === 'grid' ? 'default' : 'outline'}
            >
              <IconGridDots />
            </Button>
            <Button
              variant="outline"
            // variant={view === 'list' ? 'default' : 'outline'}
            // onClick={() => setView('list')}
            >
              <IconList />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      {/* <CustomDatatable data={transactions} columns={columns} onDoubleClick={handleViewReportClick} /> */}
      <ResizableTable
        columns={columns}
        data={transactions?.data || []}
        onDoubleClick={handleViewReportClick}
        loading={fetching}
        actions={<Actions />}
      />
      <CustomPagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        limit={limit}
        onChangeLimit={handleLimitChange}
      />
      <TransactionDetailView
        open={openDetailView}
        setOpen={setOpenDetailView}
        currentItem={currentItem}
      />
      <TransactionReportingModal
        open={viewReport}
        setOpen={setViewReport}
      />
    </div>
  )
}
export default TransactionListView;