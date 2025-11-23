'use client'

import { getCustomerById, getCustomers } from '@/app/dashboard/client/onboarding/customer-queue/actions'
import { useCustomerStore } from '@/app/store/useCustomer'
import CustomPagination from '@/components/CustomPagination'
import { DataTableColumnHeader } from '@/components/DatatableColumnHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import ResizableTable from '@/components/ui/Resizabletable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { Textarea } from '@/components/ui/textarea'
import { dateShowFormat, dateShowFormatWithTime, objWithValidValues } from '@/lib/utils'
import { IconChevronDown, IconChevronRight, IconDownload, IconEye, IconGrid3x3, IconGridDots, IconList, IconPennant, IconSearch, IconUpload } from '@tabler/icons-react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
const statusVariants = {
  Pending: 'outline',
  Rejected: 'danger',
  Approved: 'success',
  'In Review': 'warning',
  Closed: 'secondary',
}
const riskLevelVariants = {
  Low: 'info',
  Medium: 'warning',
  High: 'danger',
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
  console.log('customers => ', customers);


  const [openReporting, setOpenReporting] = useState(false);
  const [openDetailView, setOpenDetailView] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const columns = [
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Customer"
        />
      ),
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
        <Badge variant={statusVariants[row.original.kycStatus]} >
          {row.original.kycStatus}
        </Badge>
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
        <Badge variant={riskLevelVariants[row.original.riskLabel]} >
          <IconPennant />
          {row.original.riskLabel}
        </Badge>
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
    {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Actions"
        />
      ),
      accessorKey: 'actions',
      size: 100,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleViewClick(row.original.id)}
        >
          <IconEye />
        </Button>
      ),
    }

  ]
  const handleDoubleClick = (item) => {
    setCurrentItem(item);
    setOpenReporting(true);
  }
  const handleViewClick = (id) => {
    setCurrentItem(id);
    setOpenDetailView(true);
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
      <ReportingModal open={openReporting} setOpen={setOpenReporting} currentItem={currentItem} />
      <DetailViewModal open={openDetailView} setOpen={setOpenDetailView} currentId={currentItem} />
    </>
  )
}

export default function CustomerQueueList({ variant, data }) {
  const [view, setView] = useState('list')
  const { currentPage, limit, setCustomers, setFetching, setCurrentPage, setLimit, setTotalItems, kycStatus } = useCustomerStore();
  const fetchData = async () => {
    setFetching(true);
    const queryParams = objWithValidValues({
      page: currentPage,
      limit: limit,
      kycStatus: kycStatus
    });

    const response = await getCustomers(queryParams);
    setCustomers(response.data);
    setTotalItems(response.totalRecords);
    setCurrentPage(response.currentPage);
    setLimit(response.limit);
    setFetching(false);
  }

  useEffect(() => {
    fetchData();

  }, [currentPage, limit, kycStatus]);


  return (
    <div className='my-2'>
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

export const DetailViewModal = ({ open, setOpen, currentId }) => {
  const [details, setDetails] = useState(null);
  const currentItem = null;


  const fetchDetails = async () => {
    const response = await getCustomerById(currentId);
    if (response.success) {
      setDetails(response.data);
    }
  }

  useEffect(() => {
    if (currentId) {
      fetchDetails();
    }
  }, [currentId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
          <SheetDescription>
            View the customer details here.
          </SheetDescription>
        </SheetHeader>
        <div className='grid flex-1 auto-rows-min gap-6 px-8 py-4'>
          <div className='flex items-center gap-4'>
            <div className='size-20 rounded-md overflow-hidden'>
              <img
                src={details?.user?.photoUrl}
                alt=""
                className='w-full h-full object-cover'
              />
            </div>
            <div>
              <h4 className='text-lg font-bold'>{details?.user?.name}</h4>
              <p>{details?.user?.email}</p>
              <p className='text-sm mt-2'>
                <Badge variant={statusVariants[details?.kycStatus]}>
                  {details?.kycStatus}
                </Badge>
              </p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Card className={'shadow-none'}>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
                <CardDescription className={'text-xs'}>
                  Awaiting manual verification of address proof.</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={statusVariants[currentItem?.kycStatus]} >{details?.isActive ? 'Active' : 'Inactive'}</Badge>
                {/* <p className='mt-2 text-xs'></p> */}
              </CardContent>
            </Card>
            <Card className={'shadow-none'}>
              <CardHeader>
                <CardTitle>Risk assessment</CardTitle>
                <CardDescription className={'text-xs'}>Flagged for foreign transaction history.</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={riskLevelVariants[currentItem?.riskLevel]} >{currentItem?.riskLevel} Risk</Badge>
              </CardContent>
            </Card>


          </div>

          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-7 space-y-4'>
              <Card className={'shadow-none'}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>

                    <div className='flex items-center gap-2'>
                      <h4 className='font-bold w-[80px] '>Phone</h4>
                      <p>{details?.user?.phone}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-bold w-[80px]'>Date of Birth</h4>
                      <p>12 Aug 2025</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-bold w-[80px] '>Country</h4>
                      <p>{details?.country}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-bold w-[80px] flex-shrink-0'>Address</h4>
                      <p> Apartment 4A, Green View Residences, 25 Wentworth Avenue, Sydney NSW 2000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className={'shadow-none'}>
                <CardHeader>
                  <CardTitle>Document Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 divide-y'>
                    <div className='flex items-center justify-between  pb-2'>
                      <p>Identity Proof</p>
                      <Badge variant='success' >Passed</Badge>
                    </div>
                    <div className='flex items-center justify-between  pb-2'>
                      <p>Address Proof</p>
                      <Badge variant='warning' >Pending</Badge>
                    </div>
                    <div className='flex items-center justify-between  pb-2'>
                      <p>Source of Funds Declaration</p>
                      <Badge variant='success' >Passed</Badge>
                    </div>
                    <div className='flex items-center justify-between  pb-2'>
                      <p>Facial Recognition Check</p>
                      <Badge variant='info' >Pending</Badge>
                    </div>
                    <div className=''>
                      <Collapsible>
                        <CollapsibleTrigger className='w-full'>
                          <div className='flex items-center justify-between w-full '>
                            <h4 className='font-bold'>Review Upload Documents</h4>
                            <IconChevronDown className='text-gray-500 size-4' />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className='min-h-80 pt-6 pb-3  w-3/4 mx-auto'>
                            <Carousel>
                              <CarouselContent>
                                <CarouselItem className={' overflow-hidden'}>
                                  <div className='w-full overflow-hidden mx-auto rounded-md'>
                                    <img src="/dummyPassport.svg" alt="" className='w-full h-full object-cover' />
                                  </div>
                                </CarouselItem>
                                <CarouselItem>...</CarouselItem>
                                <CarouselItem>...</CarouselItem>
                              </CarouselContent>
                              <CarouselPrevious />
                              <CarouselNext />
                            </Carousel>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='col-span-5 space-y-4'>
              <Card className={'shadow-none'}>
                <CardHeader>
                  <CardTitle>Onboarding timeline</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4 text-xs'>
                  <div className='flex items-center gap-2'>
                    <h4 className=' font-bold w-[80px]'>Created On</h4>
                    <p>{dateShowFormat(details?.createdAt)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <h4 className=' font-bold  w-[80px]'>Last Updated</h4>
                    <p>{dateShowFormat(details?.updatedAt)}</p>
                  </div>
                  <div className='flex items-center gap-2 '>
                    <h4 className=' font-bold  w-[80px]'>Review Time</h4>
                    <p>27 days</p>
                  </div>

                </CardContent>
              </Card>
              <Card className={'shadow-none'}>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4  divide-y [&>p]:pb-2 [&>p]:relative [&>p]:before:content-[""] [&>p]:before:absolute [&>p]:before:left-0 [&>p]:before:top-1/2 [&>p]:before:-translate-y-1/2 [&>p]:before:size-2.5 [&>p]:before:bg-cyan-500 [&>p]:before:rounded-full [&>p]:pl-5'>

                    {
                      details?.kycHistory?.map((item) => (
                        <p className='flex gap-1 flex-wrap' key={item.id}>
                          <span>
                            {item.note}
                          </span>
                          <span>
                            {dateShowFormatWithTime(item.createdAt)}
                          </span>
                        </p>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='flex justify-end items-center gap-2 py-4'>
            <Button variant='destructive' >Reject</Button>
            <Button className=''>Approve</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

  )
}
