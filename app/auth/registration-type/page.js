'use client';
import { Button } from '@/components/ui/button';

import { countriesData } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getLoggedInCustomer, getLoggedInUser } from '../actions';
import dynamic from 'next/dynamic';
import { useCustomerRegisterStore } from '@/app/store/useCustomerRegister';
const CustomSelect = dynamic(() => import('@/components/ui/CustomSelect'), { ssr: false });

const RegistrationType = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [country, setCountry] = useState(null);
    const [user, setUser] = useState(null);
    console.log("user", user);
    const { setRegisterType, setCountry: setCountryStore } = useCustomerRegisterStore();
    const handleGetLoggedInUser = async () => {
        const user = await getLoggedInCustomer();
        console.log("user", user);
        setUser(user?.data?.customer);
    }
    useEffect(() => {
        handleGetLoggedInUser();
    }, []);
    const router = useRouter();
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
    const handleSelectType = (type) => {
        setSelectedType(type);
    }
    const handleContinue = () => {
        if (selectedType && country) {
            setRegisterType(selectedType?.type?.toLowerCase());
            setCountryStore(country?.value?.toLowerCase());

            if (user?.kycStatus === 'pending') {
                router.push('/customer/document-type');
            } else {
                router.push('/customer/registration/individual');
            }
        }
    }
    return (
        <div className='container grid place-items-center min-h-[80vh] py-8 '>
            <div className='min-w-[500px]'>
                <h1 className='text-2xl font-bold tracking-tighter text-center'>Choose Registration Type</h1>
                <p className='text-center'>Select the option that best describes you to get started.</p>
                <div className='py-8 space-y-4 flex flex-col items-center'>
                    {
                        types.map((type, index) => (
                            <div
                                onClick={() => handleSelectType(type)}
                                role='button'
                                aria-label={type.type}
                                aria-pressed={selectedType === index}
                                key={index}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleSelectType(type);
                                    }
                                }}
                                tabIndex={index + 1}
                                className={cn('flex items-center gap-4 py-6 px-4 border rounded-lg cursor-pointer transition-all duration-300 w-[400px] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2', {
                                    'border-yellow-500 w-[460px]  px-6': selectedType?.type === type.type,
                                })}>
                                <div className={
                                    cn('size-4 rounded-full border', {
                                        'border-yellow-500 bg-yellow-500': selectedType?.type === type?.type,
                                    })
                                } />
                                <div>
                                    <h2 className='font-semibold'>{type.type}</h2>
                                    <p>{type.desc}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='my-4 flex justify-center '>
                    <div className='w-[400px] max-w-full'>
                        <CustomSelect
                            placeholder='Select Country'
                            value={country}
                            onChange={(data, e) => setCountry(data)}
                            options={countriesData}
                        />
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Button onClick={handleContinue}>

                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationType;