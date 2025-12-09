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

export const autoPopulatedSMRData = async (caseNumber) => {
    const response = await fetch(`http://4.227.188.44:8000/smr_report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: caseNumber })
    });
    return response.json();
}