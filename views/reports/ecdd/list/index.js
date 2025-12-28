'use client'

import { getEcdds } from '@/app/dashboard/client/report-compliance/ecdd/actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ResizableTable from '@/components/ui/Resizabletable';
import { IconDotsVertical } from '@tabler/icons-react';
import { ArrowRight, Edit, Eye, FileText, Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteEcdd } from '@/app/dashboard/client/report-compliance/ecdd/actions';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import CustomPagination from '@/components/CustomPagination';

const EcddList = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    console.log('data', data)
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const getData = async () => {
        setLoading(true)
        try {
            const queryParams = {
                page: currentPage,
                limit: limit,
            };
            const res = await getEcdds(queryParams);
            setData(res?.data)
            setTotalItems(res?.totalRecords)
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()

    }, [currentPage, limit])

    const handleView = (caseId) => {
        router.push(`/dashboard/client/monitoring-and-cases/case-list/details/${caseId}?tab=ecdd-review`);
    }
    const handleEdit = (id) => {
        // router.push(`/dashboard/client/report-compliance/ecdd/form?caseNumber=${caseNumber}`);
        router.push(`/dashboard/client/report-compliance/ecdd/form?id=${id}`)
    }
    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    }
    const handleGenerateEcdd = (alertId) => {
        router.push(`/dashboard/client/monitoring-and-cases/case-list/details/${alertId}`);
    }
    const columns = [
        {
            size: 40,
            header: 'Action',
            accessorKey: 'id',
            cell: ({ row }) => <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size='sm' variant='ghost'>
                        <IconDotsVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleView(row?.original?.caseId)}> <Eye />View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(row?.original?._id)}> <Edit />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGenerateEcdd(row?.original?.caseId)}> <FileText />Generate ECDD</DropdownMenuItem>
                    <DropdownMenuItem variant='destructive' onClick={() => handleDelete(row?.original?._id)}> <Trash />Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        },
        {
            header: 'UID',
            cell: ({ row }) => <div>
                <p className="font-mono">#{row?.original?.uid}</p>
            </div>
        },
        {
            header: 'Case ID',
            accessorKey: 'caseNumber',
            cell: ({ row }) => <div>
                <h5 className="text-heading font-semibold capitalize" >{row?.original?.fullName}</h5>
                <p className="font-mono text-neutral-500">#{row?.original?.caseNumber}</p>
            </div>
        },

        {
            header: 'Suspicion Date',
            accessorKey: 'createdAt',
            cell: ({ row }) => <div>
                <p className=" text-heading">
                    {formatDateTime(row?.original?.createdAt)?.date}</p>
                <p className="font-mono text-neutral-500">  {formatDateTime(row?.original?.createdAt)?.time}</p>
            </div>
        },
        {
            header: 'Analyst',
            accessorKey: 'analystName',
        },
        {
            header: 'Transaction',
            accessorKey: 'transaction.amount',
            cell: ({ row }) => <div hidden={!row?.original?.transaction}>

                <div className="flex items-center gap-2">

                    <div>
                        <p className="text-heading font-semibold capitalize" >{row?.original?.transaction?.sender?.name}</p>
                        <p className="font-mono text-neutral-500">#{row?.original?.transaction?.sender?.account}</p>
                    </div>
                    <div>
                        <ArrowRight className="size-4 text-green-500" />
                    </div>
                    <div>
                        <p className="text-heading font-semibold capitalize" >{row?.original?.transaction?.receiver?.name}</p>
                        <p className="font-mono text-neutral-500">#{row?.original?.transaction?.receiver?.account}</p>
                    </div>
                </div>
                <div className='bg-accent/10'>
                    <p className="text-heading font-semibold capitalize text-center" >
                        (${row?.original?.transaction?.amount})
                    </p>
                </div>
            </div>
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
    ]

    const Actions = () => {
        return (
            <Button size='sm' onClick={() => router.push('/dashboard/client/report-compliance/ecdd/form')}>Add new</Button>
        )
    }
    const handlePageChange = (page) => {
        setCurrentPage(page.selected + 1);
    };
    const handleLimitChange = (limit) => {
        setLimit(limit);
        setCurrentPage(1);
    };


    return (
        <div>
            <ResizableTable
                columns={columns}
                data={data}
                loading={loading}
                actions={<Actions />}
            />
            <CustomPagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                limit={limit}
                onChangeLimit={handleLimitChange}
            />
            <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} id={deleteId} getData={getData} />
        </div>
    );
};

export default EcddList;

const DeleteModal = ({ open, setOpen, id, getData }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await deleteEcdd(id);
            if (res.success) {
                setOpen(false);
                getData();
                toast.success('ECDD deleted successfully');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete ECDD');
        } finally {
            setDeleting(false);
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the ECDD and remove the data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleting}>{deleting ? <Loader2 className="size-4 animate-spin" /> : 'Continue'}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}