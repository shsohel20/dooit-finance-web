import { ECDDForm } from '@/components/ecdd-form';
import React from 'react';

const EcddFormPage = async ({ searchParams }) => {
    const caseNumber = searchParams?.caseNumber;
    // const data = await getEcddByCaseNumber( caseNumber );
    // console.log( 'form page ecdd data', data );
    return (
        <div>
            <ECDDForm caseNumber={caseNumber} />
        </div>
    )
}

export default EcddFormPage