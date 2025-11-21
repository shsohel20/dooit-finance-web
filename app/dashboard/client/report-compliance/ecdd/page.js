import { PageDescription, PageHeader, PageTitle } from '@/components/common';
import EcddList from '@/views/reports/ecdd/list';
import React from 'react';
import { getEcdds } from './actions';

const EcddPage = async () => {
    let loading = true;
    const data = await getEcdds();
    loading = false;
    console.log( 'ecdd data', data );
    return (
        <div>
            <PageHeader>
                <PageTitle>ECDD</PageTitle>
                <PageDescription>Enhanced Customer Due Diligence</PageDescription>
            </PageHeader>
            <EcddList data={data?.data} loading={loading} />
        </div>
    );
};

export default EcddPage;