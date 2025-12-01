'use server'
import { fetchWithAuth } from '@/services/serverApi';


export const getSMRList = async () => {
    const response = await fetchWithAuth('smr-report');
    return response.json();
}

export const createSMR = async (formData) => {
    const response = await fetchWithAuth('smr-report/new', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
    // revalidateTag('smr-list');
    return response.json();
}


export const getSMRById = async (id) => {
    const response = await fetchWithAuth(`smr-report/${id}`);
    return response.json();
}