import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import FormSubtitle from '../../(layouts)/FormSubtitle';
import FormTitle from '../../(layouts)/FormTitle';

const UploadPassport = () => {
    return (
        <div className='grid place-items-center min-h-[80vh] mt-10'>
            <div>
                <FormTitle>Upload Your Passport</FormTitle>
                <FormSubtitle>Upload your passport to continue</FormSubtitle>
                <div className='mt-8'>
                    <div className='h-[300px] w-[700px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col gap-2 items-center justify-center
                    bg-[#F8FAFC] text-gray-700 text-center'>
                        <span><Upload /></span>
                        <span>Upload a file or drag and drop a PNG, JPG, or PDF up to 10MB</span>
                    </div>
                    <p className='text-center mt-4'>Or Use Camera</p>

                    <div className='flex justify-center mt-4'>
                        <Button variant='secondary' size='lg' className={' py-6 font-semibold'}>
                            <Camera className='size-4' /> Open Camera
                        </Button>
                    </div>
                    <div className='h-[400px]  py-4 border flex items-center justify-center my-4 rounded-lg'>
                        {/* <div> */}
                        <img src="/dummyPassport.svg" alt="" className=' h-full object-cover' />
                        {/* </div> */}
                    </div>
                    <div className='flex justify-center mt-8'>
                        <Button asChild size='lg' className={'w-[200px] font-semibold'}>
                            <Link href='/customer/passport-details'>Next</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPassport;