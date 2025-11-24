'use client'

import { getEcdds } from '@/app/dashboard/client/report-compliance/ecdd/actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ResizableTable from '@/components/ui/Resizabletable';
import { IconDotsVertical } from '@tabler/icons-react';
import { Edit, Eye, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EcddList = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

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
    const handleEdit = (caseNumber) => {
        router.push(`/dashboard/client/report-compliance/ecdd/form?caseNumber=${caseNumber}`);
    }
    const handleDelete = (id) => {
        router.push(`/dashboard/client/report-compliance/ecdd/form/${id}`);
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
                    <DropdownMenuItem onClick={() => handleEdit(row?.original?.caseNumber)}> <Edit />Edit</DropdownMenuItem>
                    <DropdownMenuItem variant='destructive'> <Trash />Delete</DropdownMenuItem>
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
        </div>
    );
};

export default EcddList;