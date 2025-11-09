'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react';
import FormSubtitle from '../../(layouts)/FormSubtitle';
import FormTitle from '../../(layouts)/FormTitle';

const DocumentType = () => {
    const [selectedDocument, setSelectedDocument] = useState( null );
    const documents = [
        {
            name: 'Passport',
            img: '/passport.svg'
        },
        {
            name: 'National Id',
            img: '/nid.svg'
        },
        {
            name: 'Driving License',
            img: '/drivingLicense.svg'
        }
    ]
    const handleDocumentSelect = ( document ) => {
        setSelectedDocument( document );
    }

    return (
        <div className='grid place-items-center min-h-[80vh]'>
            <div>
                <FormTitle>Verify Your Identity</FormTitle>
                <FormSubtitle>Select a document type to continue</FormSubtitle>
                <div className='flex flex-row gap-4 mt-8'>
                    {
                        documents.map( doc => {
                            return (
                                <div
                                    onClick={() => handleDocumentSelect( doc )} role='button'
                                    key={doc.name}
                                    className={cn( 'flex flex-col items-center gap-2 border px-4 py-2 w-[200px] border-gray-200 rounded-xl cursor-pointer', {
                                        'border-yellow-500': selectedDocument?.name === doc.name
                                    } )}
                                >
                                    <div className='size-20'>
                                        <img src={doc.img} alt={doc.name} className='w-full h-full object-cover' />
                                    </div>
                                    <p className='text-lg tracking-tight font-semibold text-gray-800'>{doc.name}</p>
                                </div>
                            )
                        } )
                    }
                </div>
                <div className='flex justify-center mt-8'>
                    <Button asChild disabled={!selectedDocument}>
                        <Link href='/customer/upload-passport'>Continue</Link>
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default DocumentType;