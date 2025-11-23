import { ECDDForm } from '@/components/ecdd-form';
import React from 'react';
import { getEcddByCaseNumber } from '../actions';

const EcddFormPage = async ( { searchParams } ) => {
    const caseNumber = searchParams?.caseNumber;
    const data = await getEcddByCaseNumber( caseNumber );
    console.log( 'form page ecdd data', data );
    return (
        <div>
            <ECDDForm data={data} caseNumber={caseNumber} />
        </div>
    )
}

export default EcddFormPage