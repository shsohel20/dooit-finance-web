'use server'
import { fetchWithAuth } from '@/services/serverApi';
import { revalidateTag } from 'next/cache';

export const getSMRList=async()=>{
    const response=await fetchWithAuth('smr-report',{
        next: {tags: ['smr-list']}
    });
    revalidateTag('smr-list');
    return response.json();
}