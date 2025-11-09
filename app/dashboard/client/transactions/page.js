"use client";
import CustomDatatable from '@/components/CustomDatatable'
import { DataTableColumnHeader } from '@/components/DatatableColumnHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import ResizableTable from '@/components/ui/Resizabletable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { StatusPill } from '@/components/ui/StatusPill';
import { Textarea } from '@/components/ui/textarea';
import { IconAlertCircle, IconAlertSquare, IconDots, IconDotsCircleHorizontal, IconEye, IconGridDots, IconList, IconPennant, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
const transactions = [
  {
    id: 1,
    name: 'John Doe',
    credit: 100,
    debit: 0,
    type: 'Credit',
    date: '2021-01-01',
    amount: 100,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-984512',
    risk: 'Low',
  },
  {
    id: 2,
    name: 'Jane Smith',
    credit: 0,
    debit: 50,
    type: 'Debit',
    date: '2021-01-03',
    amount: 50,
    currency: 'USD',
    method: 'Bank Transfer',
    ref: 'TXN-231674',
    risk: 'Medium',
  },
  {
    id: 3,
    name: 'Robert Wilson',
    credit: 250,
    debit: 0,
    type: 'Credit',
    date: '2021-01-05',
    amount: 250,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-875421',
    risk: 'High',
  },
  {
    id: 4,
    name: 'Emily Johnson',
    credit: 0,
    debit: 30,
    type: 'Debit',
    date: '2021-01-07',
    amount: 30,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-782364',
    risk: 'Low',
  },
  {
    id: 5,
    name: 'Michael Brown',
    credit: 400,
    debit: 0,
    type: 'Credit',
    date: '2021-01-08',
    amount: 400,
    currency: 'USD',
    method: 'Wire Transfer',
    ref: 'TXN-986452',
    risk: 'Medium',
  },
  {
    id: 6,
    name: 'Sarah Davis',
    credit: 0,
    debit: 120,
    type: 'Debit',
    date: '2021-01-10',
    amount: 120,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-658214',
    risk: 'Low',
  },
  {
    id: 7,
    name: 'David Miller',
    credit: 300,
    debit: 0,
    type: 'Credit',
    date: '2021-01-12',
    amount: 300,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-912546',
    risk: 'Medium',
  },
  {
    id: 8,
    name: 'Olivia Taylor',
    credit: 0,
    debit: 90,
    type: 'Debit',
    date: '2021-01-13',
    amount: 90,
    currency: 'USD',
    method: 'Bank Transfer',
    ref: 'TXN-473215',
    risk: 'Low',
  },
  {
    id: 9,
    name: 'Daniel Anderson',
    credit: 600,
    debit: 0,
    type: 'Credit',
    date: '2021-01-14',
    amount: 600,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-857493',
    risk: 'High',
  },
  {
    id: 10,
    name: 'Sophia Thomas',
    credit: 0,
    debit: 70,
    type: 'Debit',
    date: '2021-01-15',
    amount: 70,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-234678',
    risk: 'Low',
  },
  {
    id: 11,
    name: 'James Jackson',
    credit: 500,
    debit: 0,
    type: 'Credit',
    date: '2021-01-17',
    amount: 500,
    currency: 'USD',
    method: 'Wire Transfer',
    ref: 'TXN-765432',
    risk: 'Medium',
  },
  {
    id: 12,
    name: 'Mia White',
    credit: 0,
    debit: 40,
    type: 'Debit',
    date: '2021-01-18',
    amount: 40,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-564738',
    risk: 'Low',
  },
  {
    id: 13,
    name: 'William Harris',
    credit: 200,
    debit: 0,
    type: 'Credit',
    date: '2021-01-19',
    amount: 200,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-983726',
    risk: 'Medium',
  },
  {
    id: 14,
    name: 'Ava Martin',
    credit: 0,
    debit: 110,
    type: 'Debit',
    date: '2021-01-20',
    amount: 110,
    currency: 'USD',
    method: 'Bank Transfer',
    ref: 'TXN-192837',
    risk: 'Low',
  },
  {
    id: 15,
    name: 'Henry Thompson',
    credit: 450,
    debit: 0,
    type: 'Credit',
    date: '2021-01-21',
    amount: 450,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-829173',
    risk: 'Medium',
  },
  {
    id: 16,
    name: 'Charlotte Garcia',
    credit: 0,
    debit: 80,
    type: 'Debit',
    date: '2021-01-22',
    amount: 80,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-627384',
    risk: 'High',
  },
  {
    id: 17,
    name: 'Elijah Martinez',
    credit: 320,
    debit: 0,
    type: 'Credit',
    date: '2021-01-23',
    amount: 320,
    currency: 'USD',
    method: 'Wire Transfer',
    ref: 'TXN-453728',
    risk: 'Medium',
  },
  {
    id: 18,
    name: 'Isabella Robinson',
    credit: 0,
    debit: 60,
    type: 'Debit',
    date: '2021-01-24',
    amount: 60,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-128374',
    risk: 'Low',
  },
  {
    id: 19,
    name: 'Benjamin Clark',
    credit: 700,
    debit: 0,
    type: 'Credit',
    date: '2021-01-25',
    amount: 700,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-763921',
    risk: 'High',
  },
  {
    id: 20,
    name: 'Amelia Rodriguez',
    credit: 0,
    debit: 150,
    type: 'Debit',
    date: '2021-01-26',
    amount: 150,
    currency: 'USD',
    method: 'Bank Transfer',
    ref: 'TXN-234986',
    risk: 'Low',
  },
  {
    id: 21,
    name: 'Logan Lewis',
    credit: 180,
    debit: 0,
    type: 'Credit',
    date: '2021-01-27',
    amount: 180,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-389274',
    risk: 'Medium',
  },
  {
    id: 22,
    name: 'Harper Lee',
    credit: 0,
    debit: 90,
    type: 'Debit',
    date: '2021-01-28',
    amount: 90,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-783452',
    risk: 'Low',
  },
  {
    id: 23,
    name: 'Lucas Walker',
    credit: 520,
    debit: 0,
    type: 'Credit',
    date: '2021-01-29',
    amount: 520,
    currency: 'USD',
    method: 'Wire Transfer',
    ref: 'TXN-129837',
    risk: 'Medium',
  },
  {
    id: 24,
    name: 'Evelyn Hall',
    credit: 0,
    debit: 200,
    type: 'Debit',
    date: '2021-01-30',
    amount: 200,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-982374',
    risk: 'Low',
  },
  {
    id: 25,
    name: 'Jack Allen',
    credit: 350,
    debit: 0,
    type: 'Credit',
    date: '2021-02-01',
    amount: 350,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-347821',
    risk: 'Medium',
  },
  {
    id: 26,
    name: 'Ella Young',
    credit: 0,
    debit: 60,
    type: 'Debit',
    date: '2021-02-02',
    amount: 60,
    currency: 'USD',
    method: 'Bank Transfer',
    ref: 'TXN-981234',
    risk: 'Low',
  },
  {
    id: 27,
    name: 'Sebastian Hernandez',
    credit: 275,
    debit: 0,
    type: 'Credit',
    date: '2021-02-03',
    amount: 275,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-564123',
    risk: 'Medium',
  },
  {
    id: 28,
    name: 'Grace King',
    credit: 0,
    debit: 45,
    type: 'Debit',
    date: '2021-02-04',
    amount: 45,
    currency: 'USD',
    method: 'Credit Card',
    ref: 'TXN-671239',
    risk: 'Low',
  },
  {
    id: 29,
    name: 'Owen Wright',
    credit: 410,
    debit: 0,
    type: 'Credit',
    date: '2021-02-05',
    amount: 410,
    currency: 'USD',
    method: 'Wire Transfer',
    ref: 'TXN-812364',
    risk: 'Medium',
  },
  {
    id: 30,
    name: 'Lily Scott',
    credit: 0,
    debit: 130,
    type: 'Debit',
    date: '2021-02-06',
    amount: 130,
    currency: 'USD',
    method: 'PayPal',
    ref: 'TXN-927364',
    risk: 'Low',
  },
];

const ListView = () => {
  const [openDetailView, setOpenDetailView] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [viewReport, setViewReport] = useState(false);
  const [currentItemReport, setCurrentItemReport] = useState(null);
  const handleViewReportClick = (item) => {
    setCurrentItemReport(item);
    setViewReport(true);
  }
  const riskVariants = {
    Low: 'info',
    Medium: 'warning',
    High: 'danger',
  };
  const handleViewClick = (item) => {
    setCurrentItem(item);
    setOpenDetailView(true);
  }
  const columns = [
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
        />
      ),
      accessorKey: 'id',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
        />
      ),
      accessorKey: 'name',
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Credit"
        />
      ),
      accessorKey: 'credit',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Debit"
        />
      ),
      accessorKey: 'debit',
      size: 100,
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
          title="Date"
        />
      ),
      accessorKey: 'date',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Amount"
        />
      ),
      accessorKey: 'amount',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Currency"
        />
      ),
      accessorKey: 'currency',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Method"
        />
      ),
      accessorKey: 'method',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Ref"
        />
      ),
      accessorKey: 'ref'
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Risk"
        />
      ),
      accessorKey: 'risk',
      cell: ({ row }) => {
        return <>
          <StatusPill
            icon={<IconPennant />}
            variant={riskVariants[row.original.risk]}
          >
            {row.original.risk}
          </StatusPill>
        </>
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              // size="sm"
              className="!py-2 h-auto "
            >
              <IconDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleViewClick(row.original)}>
              <IconEye className="mr-2 size-3 text-muted-foreground/70" />
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ]

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 mb-4'>
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
        data={transactions}
        onDoubleClick={handleViewReportClick}
      />
      <DetailView
        open={openDetailView}
        setOpen={setOpenDetailView}
        currentItem={currentItem}
      />
      <ReportingModal
        open={viewReport}
        setOpen={setViewReport}
      />
    </div>
  )
}

export default function TransactionList() {
  return (
    <div>
      <ListView />
    </div>
  )
}


const DetailView = ({ open, setOpen, currentItem }) => {
  const [viewReport, setViewReport] = useState(false);
  const [currentItemReport, setCurrentItemReport] = useState(null);
  const handleViewReportClick = (item) => {
    setCurrentItemReport(item);
    setViewReport(true);
  }
  const metaData = [
    {
      name: 'Total Debits',
      value: '13690.00',
    },
    {
      name: 'Total Credits',
      value: '78640.00',
    },
    {
      name: 'Net Flow',
      value: '587690.00',
    },
    {
      name: 'Avg. Transaction Value',
      value: '250.40',
    }

  ]
  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Transaction ID',
      accessorKey: 'ref',
    },
    {
      header: 'Type',
      accessorKey: 'method',
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
    },
    {
      header: 'Balance',
      accessorKey: 'amount',
    },


  ]
  const data = transactions.slice(0, 10);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto '>
        <SheetHeader>
          <SheetTitle>Detail View</SheetTitle>
          <SheetDescription>
            View the detail view here.
          </SheetDescription>
        </SheetHeader>
        <div className='px-8 py-4 space-y-4'>
          <div className='flex justify-between border rounded-md p-4'>
            <div className='flex  gap-4 '>
              <div className='size-20 rounded-full overflow-hidden'>
                <img src="/profile.png" alt="" className='w-full h-full object-cover' />
              </div>
              <div>
                <h4 className='text-lg font-bold relative w-max pr-2'>{currentItem?.name}
                  <div className='absolute -top-1 left-full'>
                    <Badge variant="success">
                      Verified
                    </Badge>
                  </div>
                </h4>
                <p className='font-mono text-neutral-700'>Customer ID: C-10045 </p>


              </div>
            </div>
            <div className='flex gap-8'>
              <div className='flex flex-col  items-center'>
                <h4 className='text-xs text-muted-foreground uppercase'>Account No</h4>
                <p className='font-mono text-xl text-center'>1234567890</p>
              </div>
              <div className='flex flex-col  items-center'>
                <h4 className='text-xs text-muted-foreground uppercase'>Current Balance</h4>
                <p className='font-mono text-xl text-center'>AUD 8,420.50</p>
              </div>
              <div className='flex flex-col  items-center'>
                <h4 className='text-xs text-muted-foreground uppercase'>Total Transactions</h4>
                <p className='font-mono text-xl text-center'>120</p>
              </div>
            </div>
          </div>
          <Alert variant="destructive">
            <IconAlertSquare />
            <AlertTitle className={'font-semibold'}>Risk Alert!</AlertTitle>
            <AlertDescription >
              Unusual Activity Detected - High Risk Score
            </AlertDescription>
          </Alert>
          <div className='space-y-2'>
            <div>
              <h4 className='text-lg font-semibold'>30 day activity</h4>
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {metaData.map((item) => (
                <div key={item.name} className='flex flex-col  w-full border rounded-md gap-8 p-4'>
                  <h4 className='text-xs text-muted-foreground uppercase'>{item.name}</h4>
                  <p className='font-mono text-xl '>AUD {item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='space-y-2'>
            <h4 className='text-lg font-semibold'>Transaction History</h4>
            <div>
              {/* <CustomDatatable data={data} columns={columns} onDoubleClick={handleViewReportClick} /> */}
              <ResizableTable columns={columns} data={data} />
            </div>
          </div>
        </div>

      </SheetContent>
      <ReportingModal open={viewReport} setOpen={setViewReport} />
    </Sheet>
  )
}

export const ReportingModal = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reporting</DialogTitle>
          <DialogDescription>Risk Level: Medium</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Label className={'font-bold'}>Share your insights</Label>
          <Textarea placeholder='Share your insights' />
        </div>
        <DialogFooter>
          <Button className={'w-full'}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}