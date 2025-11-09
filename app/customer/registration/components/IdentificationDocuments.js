import { Upload } from 'lucide-react';
import React from 'react';
import FormTitle from './FormTitle';

const IdentificationDocuments = () => {
    return (
        <div className='mt-4'>
            <FormTitle>Identification Documents</FormTitle>

            <div className='mt-6'>
                <p className='mb-2'>Upload Bank statement <span className='italic'>(issued within 30 days and covers 90
                    days of transaction history)</span></p>
                <div className='border-2 h-[300px] w-full border-dashed rounded-xl flex flex-col items-center justify-center'>
                    <span><Upload /></span>
                    <p>Upload a file or drag and drop a PNG, JPG, or PDF up to 10MB</p>
                </div>
            </div>
        </div>
    );
};

export default IdentificationDocuments;