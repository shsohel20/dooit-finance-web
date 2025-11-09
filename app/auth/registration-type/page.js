'use client';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/CustomSelect';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react';

const RegistrationType = () => {
    const [selectedType, setSelectedType] = useState( null );
    const types = [
        {
            type: 'Individual',
            desc: 'Register as an individual user',
        },
        {
            type: 'Business',
            desc: 'Register as a business entity',
        },
        {
            type: 'Join Account',
            desc: 'Register as a join account',
        },

    ]
    return (
        <div className='container grid place-items-center min-h-[80vh] py-8 '>
            <div className='min-w-[500px]'>
                <h1 className='text-2xl font-bold tracking-tighter text-center'>Choose Registration Type</h1>
                <p className='text-center'>Select the option that best describes you to get started.</p>
                <div className='py-8 space-y-4 flex flex-col items-center'>
                    {
                        types.map( ( type, index ) => (
                            <div
                                onClick={() => setSelectedType( index )}
                                key={index}
                                className={cn( 'flex items-center gap-4 py-6 px-4 border rounded-lg cursor-pointer transition-all duration-300 w-[400px]', {
                                    'border-yellow-500 w-[460px]  px-6': selectedType === index,
                                } )}>
                                <div className={
                                    cn( 'size-4 rounded-full border', {
                                        'border-yellow-500 bg-yellow-500': selectedType === index,
                                    } )
                                } />
                                <div>
                                    <h2 className='text-lg font-semibold'>{type.type}</h2>
                                    <p>{type.desc}</p>
                                </div>
                            </div>
                        ) )
                    }
                </div>
                <div className='my-4 flex justify-center '>
                    <div className='w-[400px]'>
                        <CustomSelect placeholder='Select Country' />
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Button>
                        <Link href='/customer/document-type'>
                            Continue
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationType;