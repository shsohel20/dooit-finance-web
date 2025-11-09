import CustomInput from '@/components/ui/CustomInput';
import Link from 'next/link';
import React from 'react';

const KYC = () => {
    return (
        <div className='container grid place-items-center min-h-[80vh] py-8'>
            <div className=''>
                <h1 className='text-2xl font-bold tracking-tighter text-center'>Start Dooit KYC</h1>
                <p className='text-center text-gray-500'>Get Verified</p>
                <div className='bg-gray-100 p-8 rounded-lg mt-8'>
                    <Link href='/auth/registration-type'>
                        <div className='w-[500px] py-8 border-b'>
                            <img src="/map.svg" alt="" className='w-full h-full object-cover' />
                        </div>
                    </Link>
                    <h2 className='font-semibold py-4 text-xl text-center tracking-tighter'>Dooit KYC Passport</h2>
                    <div className='flex gap-4'>
                        <div className='size-[150px] flex-shrink-0 bg-white rounded'>
                            <img src="/person.svg" alt="" className='w-full h-full object-cover' />
                        </div>
                        <div className='w-full flex flex-col gap-4'>
                            <CustomInput label='First Name' />
                            <CustomInput label='Last Name' />
                            <CustomInput label='Date of Birth' />
                            <CustomInput label='Address' />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default KYC;