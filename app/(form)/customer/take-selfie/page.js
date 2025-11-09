'use client';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import FormSubtitle from '../../(layouts)/FormSubtitle';
import FormTitle from '../../(layouts)/FormTitle';

const TakeSelfie = () => {
    const regType = 'individual';
    return (
        <div className='grid place-items-center min-h-[80vh] mt-10'>
            <div>
                <FormTitle>Take a selfie</FormTitle>
                <FormSubtitle>Please position your face within the frame</FormSubtitle>
                <div className='flex justify-center items-center mt-4'>
                    <div className='p-4 border border-gray-300 rounded-full'>
                        <div className='size-[200px] rounded-full bg-black'>

                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center mt-4'>
                    <Button variant='secondary' className='w-[200px] font-semibold'><Camera /> Open Camera</Button>

                </div>
                <p className='text-center text-gray-700 mt-4'>For best results, ensure good lighting and clear focus</p>
                <div className='flex justify-center'>
                    <Button variant={'outline'} className={'mt-4'}>
                        <Link href={`/customer/registration/${regType}`}>Skip</Link>
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default TakeSelfie;