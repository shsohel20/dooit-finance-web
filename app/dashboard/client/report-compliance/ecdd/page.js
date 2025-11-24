import { PageDescription, PageHeader, PageTitle } from '@/components/common';
import EcddList from '@/views/reports/ecdd/list';
import React from 'react';
import { getEcdds } from './actions';

const EcddPage = async () => {
    return (
        <div>
            <PageHeader>
                <PageTitle>ECDD</PageTitle>
                <PageDescription>Enhanced Customer Due Diligence</PageDescription>
            </PageHeader>
            <EcddList />
        </div>
    );
};

export default EcddPage;