'use client'

import { getEcdds } from '@/app/dashboard/client/report-compliance/ecdd/actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ResizableTable from '@/components/ui/Resizabletable';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit, Eye, FileText, Loader2, Trash } from 'lucide-react';
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

const EcddList = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    console.log("data", data);
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const getData = async () => {
        setLoading(true)
        try {

            const res = await getEcdds();
            setData(res?.data)
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()

    }, [])

    const handleView = (id) => {
        router.push(`/dashboard/client/report-compliance/ecdd/form/${id}`);
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
            header: 'Action',
            accessorKey: 'id',
            cell: ({ row }) => <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size='sm' variant='ghost'>
                        <IconDotsVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem > <Eye />View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(row?.original?._id)}> <Edit />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGenerateEcdd(row?.original?.caseId)}> <FileText />Generate ECDD</DropdownMenuItem>
                    <DropdownMenuItem variant='destructive' onClick={() => handleDelete(row?.original?._id)}> <Trash />Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        },
        {
            header: 'Case ID',
            accessorKey: 'caseNumber',
        },
        {
            header: 'Customer Name',
            accessorKey: 'customerName',
        },
        {
            header: 'Suspicion Date',
            accessorKey: 'createdAt',
        },
        {
            header: 'Analyst',
            accessorKey: 'analystName',
        },
        {
            header: 'Transaction',
            accessorKey: 'transaction.amount',
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

    return (
        <div>
            <ResizableTable
                columns={columns}
                data={data}
                loading={loading}
                actions={<Actions />}
            />
            <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} id={deleteId} />
        </div>
    );
};

export default EcddList;

const DeleteModal = ({open, setOpen, id}) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
       try {
        const res = await deleteEcdd(id);
        console.log("res", res);
        if (res.success) {
            setOpen(false);
           
            toast.success('ECDD deleted successfully');
        }
       } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete ECDD');
       }finally{
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