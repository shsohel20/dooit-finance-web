import { ECDDForm } from '@/components/ecdd-form';
import React from 'react';

const EcddFormPage = async ({ searchParams }) => {
    const caseNumber = await searchParams?.caseNumber;
    const id = await searchParams?.id;
    // const data = await getEcddByCaseNumber( caseNumber );
    // console.log( 'form page ecdd data', data );
    return (
        <div>
            <ECDDForm caseNumber={caseNumber}
                id={id} />
        </div>
    )
}

export default EcddFormPage