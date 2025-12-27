'use client'

import { getCustomerById, getCustomers } from '@/app/dashboard/client/onboarding/customer-queue/actions'
import { useCustomerStore } from '@/app/store/useCustomer'
import CustomPagination from '@/components/CustomPagination'
import { DataTableColumnHeader } from '@/components/DatatableColumnHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import ResizableTable from '@/components/ui/Resizabletable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusPill } from '@/components/ui/StatusPill'

import { Textarea } from '@/components/ui/textarea'
import { dateShowFormatWithTime, objWithValidValues, riskLevelVariants } from '@/lib/utils'
import { IconChevronRight, IconDownload, IconEye, IconGridDots, IconList, IconPennant, IconSearch, IconUpload, } from '@tabler/icons-react'
import {
  Plus
} from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { DetailViewModal } from '../details'
import { useRouter } from 'next/navigation'
import CustomDropZone from '@/components/ui/DropZone'
import { toast } from 'sonner'
const statusVariants = {
  pending: 'warning',
  rejected: 'danger',
  approved: 'success',
  'in_review': 'info',
  closed: 'muted',
}


const GridView = () => {
  const { customers } = useCustomerStore();
  const [openReporting, setOpenReporting] = useState(false);
  const [openDetailView, setOpenDetailView] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const handleDoubleClick = (item) => {
    setCurrentItem(item);
    setOpenReporting(true);
  }
  const handleViewClick = (item) => {
    setCurrentItem(item);
    setOpenDetailView(true);
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4  mt-4'>
      {
        customers?.map((item) => (
          <Item key={item.id} onDoubleClick={() => handleDoubleClick(item)} className={'p-6 border border-neutral-100 '}>

            <ItemMedia className='size-20 rounded-full overflow-hidden'>
              <img src={item.user?.photoUrl} alt="" className='w-full h-full object-cover' />
            </ItemMedia>
            <ItemContent className='text-xs gap-2 '>
              <div className='flex items-center justify-between w-full'>
                <div className=''>
                  <ItemDescription className='text-[0.6rem] uppercase'>Customer ID</ItemDescription>
                  <ItemTitle className={'font-mono'}>{item.user?.slug}</ItemTitle>
                </div>
                <Badge
                  variant={riskLevelVariants[item.riskLevel]}>
                  {item.riskLevel} Risk
                </Badge>
              </div>
              <div>
                <ItemDescription className='text-[0.6rem]  uppercase'>Customer Name</ItemDescription>
                <ItemTitle className={'text-base font-semibold'}>
                  {item.user?.name}
                </ItemTitle>
              </div>
            </ItemContent>
            {/* <ItemActions >
              <Button onClick={() => handleViewClick(item)} variant="outline">View</Button>
            </ItemActions> */}
            <ItemFooter className='flex justify-end border-t border-neutral-100 py-4'>
              <Button
                className='w-full flex items-center justify-between font-semibold text-xs'
                onClick={() => handleViewClick(item)}
                variant="outline"
              >
                View Details
                <IconChevronRight className='size-4 text-mute-200' />
              </Button>
            </ItemFooter>
          </Item>
        ))
      }
      <ReportingModal open={openReporting} setOpen={setOpenReporting} currentItem={currentItem} />
      <DetailViewModal open={openDetailView} setOpen={setOpenDetailView} currentId={currentItem?.id} />
    </div>
  )
}

const ListView = () => {
  const { customers, fetching, currentPage, limit, totalItems, setCustomers, setFetching, setCurrentPage, setLimit, setTotalItems } = useCustomerStore();
  const [openReporting, setOpenReporting] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const router = useRouter();

  const columns = [
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Actions"
        />
      ),
      accessorKey: 'actions',
      size: 20,
      cell: ({ row }) => (
        <div className='flex items-center justify-center '>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleViewClick(row.original.id)}
          >
            <IconEye />
          </Button>
        </div>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Customer"
        />
      ),
      size: 100,
      accessorKey: 'user.name',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <div className='size-10 rounded-full overflow-hidden'>
            <img src={row.original?.user?.photoUrl} alt="" className='w-full h-full object-cover' />
          </div>
          <div>
            <p className='font-bold'>{row.original?.user?.name}</p>
            <p className='text-xs text-muted-foreground'>{row.original?.user?.email}</p>
          </div>
        </div>
      ),
      size: 100,
    },

    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Country"
        />
      ),
      accessorKey: 'country',
      size: 100,
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="KYC Status"
        />
      ),
      accessorKey: 'kycStatus',
      size: 100,
      cell: ({ row }) => (
        <StatusPill variant={statusVariants[row.original.kycStatus]} >
          {row.original.kycStatus}
        </StatusPill>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
        />
      ),
      accessorKey: 'riskAssessment?.customerType?.value',
      cell: ({ row }) => (
        <span className='capitalize'>
          {row.original.riskAssessment?.customerType?.value}
        </span>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Risk Level"
        />
      ),
      accessorKey: 'riskLabel',
      size: 100,
      cell: ({ row }) => (
        <StatusPill icon={<IconPennant />} variant={riskLevelVariants[row.original.riskLabel]} >
          {row.original.riskLabel}
        </StatusPill>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created On"
        />
      ),
      accessorKey: 'createdAt',
      size: 100,
      cell: ({ row }) => (
        <span>{dateShowFormatWithTime(row.original.createdAt)}</span>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Last Updated"
        />
      ),
      accessorKey: 'updatedAt',
      size: 100,
      cell: ({ row }) => (
        <span>{dateShowFormatWithTime(row.original.updatedAt)}</span>
      ),
    },


  ]
  const handleDoubleClick = (item) => {
    setCurrentItem(item);
    setOpenReporting(true);
  }
  const handleViewClick = (id) => {
    router.push(`/dashboard/client/onboarding/customer-queue/details?id=${id}`);
    // setCurrentItem(id);
    // setOpenDetailView(true);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1);
  }
  const handleLimitChange = (limit) => {
    setLimit(limit);
    setCurrentPage(1);
  }

  const Actions = () => {
    return (
      <div className='flex items-center gap-2 '>
        <Button className='text-xs' size='sm' variant='outline'>
          Export CSV <IconDownload className='size-4' />
        </Button>
        <Button className='text-xs' size='sm' variant='outline'>
          Import CSV <IconUpload className='size-4' />
        </Button>
      </div>
    )
  }
  return (
    <>
      {/* <div className='flex justify-end'>
        <Button>Send Invite</Button>
      </div> */}
      <ResizableTable
        columns={columns}
        data={customers}
        onDoubleClick={handleDoubleClick}
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
      {/* <CustomDatatable data={data} columns={columns} onDoubleClick={handleDoubleClick} /> */}
      {openReporting && <ReportingModal
        open={openReporting}
        setOpen={setOpenReporting}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem} />}
      {/* <DetailViewModal open={openDetailView} setOpen={setOpenDetailView} currentId={currentItem} /> */}
    </>
  )
}

export default function CustomerQueueList({ variant, data, kycStatus }) {
  const [view, setView] = useState('list')
  const { currentPage, limit, setCustomers, setFetching, setCurrentPage, setLimit, setTotalItems } = useCustomerStore();


  const fetchData = async () => {
    setFetching(true);

    const queryParams = objWithValidValues({
      page: currentPage,
      limit: limit,
      kycStatus: kycStatus
    });
    const response = await getCustomers(queryParams);
    setFetching(false);
    setCustomers(response.data);
    setTotalItems(response.totalRecords);


  }

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, kycStatus]);




  return (
    <div className='my-2'>
      {/* <CustomerDashboard /> */}
      <div className='flex items-center justify-between  py-4 bg-white rounded-md px-4 shadow'>
        {/* Search and Filter */}
        <div className='flex items-center gap-2  '>
          <InputGroup className={'max-w-64'}>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon >
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Case ID" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Email" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Risk Level" />
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
          <Button size='icon' variant='outline'><Plus className='size-4' /></Button>

        </div>
        <div className='flex items-center gap-2 '>
          {/* <Button size={'sm'} className={'text-xs'}><IconBrandTelegram />  Send Invite </Button> */}

          <ButtonGroup>
            <Button
              onClick={() => setView('grid')}
              variant={view === 'grid' ? 'default' : 'outline'}>
              <IconGridDots />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}>
              <IconList />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className=''>
        {view === 'grid' ?
          <GridView data={data} /> :
          <ListView data={data} />
        }
      </div>

    </div>
  )
}


export const ReportingModal = ({ open, setOpen, currentItem, setCurrentItem }) => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log('currentItem', currentItem);
  const handleFileChange = (file) => {
    console.log(file);
    setFile(file);
  }
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // const response = await submitReporting(file);
      //sleep for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOpen(false);
      toast.success('Reporting submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit reporting');
    } finally {
      setIsSubmitting(false);
      setCurrentItem(null);
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reporting</DialogTitle>
          <DialogDescription>Risk Level: <Badge variant={riskLevelVariants[currentItem?.riskLabel ?? '']}>{currentItem?.riskLabel}</Badge></DialogDescription>
        </DialogHeader>
        <div className='flex flex-col '>
          <Label className={'font-bold'}>Share your insights</Label>
          <Textarea placeholder='Share your insights' />
        </div>
        <div>
          <CustomDropZone
            className=''
            handleChange={handleFileChange}
            file={file}
            setFile={setFile} />
        </div>
        <DialogFooter>
          <Button className={'w-full'} onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
