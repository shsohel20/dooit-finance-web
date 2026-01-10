'use client'

import { createInstantReport, getCustomerById, getCustomers } from '@/app/dashboard/client/onboarding/customer-queue/actions'
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
import { dateShowFormatWithTime, formatDateTime, objWithValidValues, riskLevelVariants } from '@/lib/utils'
import { IconChevronRight, IconDownload, IconEye, IconGridDots, IconList, IconPennant, IconSearch, IconUpload, } from '@tabler/icons-react'
import {
  Filter,
  Plus,
  XCircle
} from 'lucide-react'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DetailViewModal } from '../details'
import { useRouter } from 'next/navigation'
import CustomDropZone from '@/components/ui/DropZone'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { XMarkIcon } from '@heroicons/react/24/outline'
import _, { isObject } from 'lodash';
import CustomSelect from '@/components/ui/CustomSelect'
import { countriesData } from '@/constants'
import dynamic from 'next/dynamic'
import { fileUploadOnCloudinary } from '@/app/actions'
const CustomResizableTable = dynamic(() => import('@/components/ui/CustomResizable'), { ssr: false });
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
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState(null);
  const handleDoubleClick = (item) => {
    setCurrentItem(item);
    setOpenReporting(true);
  }
  const handleViewClick = (item) => {
    setCurrentItem(item);
    router.push(`/dashboard/client/onboarding/customer-queue/details?id=${item?.id}`);
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
      {/* <DetailViewModal open={openDetailView} setOpen={setOpenDetailView} currentId={currentItem?.id} /> */}
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
      id: 'actions',
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
      id: 'uid',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Customer ID"
        />
      ),
      cell: ({ row }) => (
        <div>
          <p className='font-semibold text-muted-foreground font-mono'>#{row.original?.uid}</p>
        </div>
      ),
      accessorKey: 'uid',
    },
    {
      id: 'user.name',
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
      id: 'country',
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
      id: 'kycStatus',
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
      id: 'riskAssessment?.customerType?.value',
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
      id: 'riskLabel',
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
      id: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created On"
        />
      ),
      accessorKey: 'createdAt',
      size: 100,
      cell: ({ row }) => (
        <div>
          <p className='font-semibold'>{formatDateTime(row.original.createdAt)?.date}</p>
          <span className='text-xs text-muted-foreground'>{formatDateTime(row.original.createdAt)?.time}</span>
        </div>
      ),
    },
    // {
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       title="Last Updated"
    //     />
    //   ),
    //   accessorKey: 'updatedAt',
    //   size: 100,
    //   cell: ({ row }) => (
    //     <span>{dateShowFormatWithTime(row.original.updatedAt)}</span>
    //   ),
    // },


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
      <CustomResizableTable
        columns={columns}
        data={customers}
        onDoubleClick={handleDoubleClick}
        loading={fetching}
        actions={<Actions />}
        mainClass="customer-queue-table"
        tableId="customer-queue-table"
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


const getFilterLabel = (key) => {
  switch (key) {
    case 'uid':
      return 'Customer ID';
    case 'email':
      return 'Email';
    case 'type':
      return 'Type';
    case 'riskLabel':
      return 'Risk Level';
    default:
      return key;
  }
}

export default function CustomerQueueList({ data, kycStatus }) {
  const [view, setView] = useState('list')
  const { currentPage, limit, customers, setCustomers, setFetching, setTotalItems } = useCustomerStore();
  const initialState = {
    uid: '',
    type: '',
    email: '',
    riskLabel: '',
    country: null
    // riskLevel: '',
    // dateRange: '',
    // country: '',
  }
  const [filters, setFilters] = useState(initialState);
  const debouncedFetchRef = useRef(null);


  const fetchData = useCallback(async (params = null) => {
    setFetching(true);

    const queryParams = objWithValidValues({
      page: currentPage,
      limit: limit,
      kycStatus: kycStatus,
      ...filters,
      ...params
    });

    for (const [key, value] of Object.entries(queryParams)) {
      if (value && isObject(value)) {
        queryParams[key] = value?.value;
      }
    }
    const response = await getCustomers(queryParams);
    setFetching(false);
    setCustomers(response.data);
    setTotalItems(response.totalRecords);

  }, []);

  useEffect(() => {
    debouncedFetchRef.current = _.debounce(fetchData, 500);

    return () => {
      debouncedFetchRef.current.cancel(); // cleanup
    };
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, kycStatus]);


  const handleFilterChange = (name, value) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    debouncedFetchRef.current(updatedFilters);
  }
  // const handleSearch = () => {
  //   fetchData();
  // }
  const handleReset = () => {
    setFilters(initialState);
    debouncedFetchRef.current(initialState);
  }
  const handleRemoveFilter = (key) => {
    const initialState = { ...filters, [key]: '' };
    setFilters(initialState);
    fetchData(initialState);
  }
  return (
    <div className='my-2'>
      {/* <CustomerDashboard /> */}
      <div className='flex items-center justify-between  py-4 bg-sidebar-bg rounded-md px-4 '>
        {/* Search and Filter */}
        <div className='flex items-center gap-2 flex-shrink-0 flex-grow  flex-wrap'>
          <InputGroup className={'w-64 flex-shrink-0'}>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon >
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>

          <Input
            name='uid'
            placeholder='Customer ID'
            className='w-40 flex-shrink-0'
            value={filters.uid}
            onChange={(e) => handleFilterChange('uid', e.target.value?.replace(/^#/, ''))}
          />
          <Input
            name='email'
            placeholder='Email'
            className='w-40 flex-shrink-0'
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
          />
          {/* <Select>
            <SelectTrigger>
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
          </Select> */}
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)} >
            <SelectTrigger className='max-w-40 flex-shrink-0'>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="non-profit">Non-Profit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.riskLabel} onValueChange={(value) => handleFilterChange('riskLabel', value)}>
            <SelectTrigger className='max-w-40 flex-shrink-0'>
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unacceptable">Unacceptable</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>


          <div className='w-44 flex-shrink-0'>
            <CustomSelect
              placeholder='Select a country'
              options={countriesData}
              value={filters.country}
              onChange={(value) => handleFilterChange('country', value)}
            />
          </div>
          <Button size='icon' variant='outline'><Plus className='size-4' /></Button>
          {/* <Button onClick={handleSearch} lit={!!filters.uid || !!filters.email || !!filters.type || !!filters.riskLabel}>
            <MagnifyingGlassIcon className='size-4' />Search
          </Button>
          <Button onClick={handleReset} variant='outline' > <XMarkIcon className='size-4' /> Reset</Button> */}

        </div>
        <div className='flex items-center gap-2 flex-shrink-0 '>
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
      <div className=' flex flex-wrap gap-2 py-2'>
        {Object.entries(filters).map(([key, value]) => {
          if (value) {
            return (
              <Badge key={key} variant='outline' className='py-1 flex-shrink-0'>
                <div className='flex items-center gap-2'>
                  <span className='text-primary'>{getFilterLabel(key)}</span>: <span className='py-1 px-3 text-[0.65rem] rounded-full bg-primary text-white capitalize '>{value?.label || value}</span>
                </div>
                <Button className={'size-6'} size='icon' variant='outline' onClick={() => handleRemoveFilter(key)}>
                  <XMarkIcon className='size-3' />
                </Button>
              </Badge>
            )
          }
          return null;
        })}
        {Object.entries(filters).some(([key, value]) => value) && <Button variant='outline' onClick={handleReset}
          className='text-xs py-1 h-8'>
          <XCircle className='size-4' /> Clear
        </Button>}
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
  const [formData, setFormData] = useState({
    riskLevel: currentItem?.riskLabel ?? '',
    insights: '',
    file: null,
  });
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = (file) => {
    setFile(file);
  }
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        notifyFor: "Customer",
        notes: formData?.insights,
        resourceType: "Customer",
        resourceId: currentItem?.id,
        isActive: true,
        metadata: {
          priority: "high",
          origin: "automated-rule"
        },
        documents: [
          // {
          //   name: file?.name,
          //   url: fileUrl,
          //   mimeType: file?.type,
          //   type: "invoice",
          //   docType: "billing"
          // }
        ]
      }
      const response = await createInstantReport(payload);
      if (response.succeed) {
        setOpen(false);
        toast.success('Reporting submitted successfully');
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
      setCurrentItem(null);
    }
  }

  // const handleFileUpload = async (file) => {
  //   setUploading(true);
  //   try {
  //     const response = await fileUploadOnCloudinary(file);
  //     console.log('response', response);
  //     if (response.success) {
  //       setFileUrl(response.data.fileUrl);
  //     } else {
  //       toast.error('Failed to upload file');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to upload file');
  //   } finally {
  //     setUploading(false);
  //   }
  // }


  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className='md:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Reporting</DialogTitle>
          {/* <DialogDescription>
            <div className='bg-smoke-200 border w-max p-2 rounded-md'>
              Risk Level: <Badge variant={riskLevelVariants[currentItem?.riskLabel ?? '']}>{currentItem?.riskLabel}</Badge>
            </div>
          </DialogDescription> */}
        </DialogHeader>
        <div className='flex items-center gap-2'>
          <Label className='font-bold'>Risk Level</Label>
          <Badge variant={riskLevelVariants[currentItem?.riskLabel ?? '']}>{currentItem?.riskLabel}</Badge>
        </div>
        <div className='flex flex-col '>
          <Label className={'font-bold'}>Share your insights</Label>
          <Textarea placeholder='Share your insights' className='min-h-40' onChange={(e) => setFormData({ ...formData, insights: e.target.value })} />
        </div>
        <div>
          <CustomDropZone
            fileTypes={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']}
            className=''
            handleChange={handleFileChange}
            file={file}
            loading={uploading}
            disabled={uploading}
            url={fileUrl}
            setFile={setFile} />
        </div>
        <DialogFooter>
          <Button className={'w-full'} onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
