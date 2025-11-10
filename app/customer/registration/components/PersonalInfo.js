'use client';
import CustomInput from '@/components/ui/CustomInput';
import React from 'react';
import FormTitle from './FormTitle';
import { Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
const CustomSelect = dynamic(() => import('@/components/ui/CustomSelect'), { ssr: false });

const PersonalInfo = ({ control, errors }) => {
    return (
        <div>
            <FormTitle>Personal Information</FormTitle>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4 mt-8'>
                <Controller
                    control={control}
                    name='personalInfo.customer_details.given_name'
                    render={({ field }) => (
                        <CustomInput
                            label='First Name'
                            placeholder='John'
                            {...field}
                            error={errors.personalInfo?.customer_details?.given_name?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.customer_details.middle_name'
                    render={({ field }) => (
                        <CustomInput
                            label='Middle Name'
                            placeholder='Marco'
                            {...field}
                            error={errors.personalInfo?.customer_details?.middle_name?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.customer_details.surname'
                    render={({ field }) => (
                        <CustomInput
                            label='Last Name'
                            placeholder='Doe'
                            {...field}
                            error={errors.personalInfo?.customer_details?.surname?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.customer_details.date_of_birth'
                    render={({ field }) => (
                        <CustomInput
                            label='Date of Birth'
                            type='date'
                            placeholder='YYYY-MM-DD'
                            {...field}
                            error={errors.personalInfo?.customer_details?.date_of_birth?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.contact_details.phone'
                    render={({ field }) => (
                        <CustomInput
                            label='Phone Number'
                            type='tel'
                            placeholder='+1 (555) 000-0000'
                            {...field}
                            error={errors.personalInfo?.contact_details?.phone?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.contact_details.email'
                    render={({ field }) => (
                        <CustomInput
                            label='Email'
                            type='email'
                            {...field}
                            placeholder='example@example.com'
                            error={errors.personalInfo?.contact_details?.email?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.employment_details.occupation'
                    render={({ field }) => (
                        <CustomInput label='Occupation' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.employment_details.employer_name'
                    render={({ field }) => (
                        <CustomInput label='Employer&apos; Name' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.employment_details.industry'
                    render={({ field }) => (
                        <CustomInput label='Industry' {...field} />
                    )}
                />
                <div className='lg:col-span-3 xl:col-span-4'>
                    <h4 className=' mb-2'>Residential Address</h4>
                    <CustomInput label='Address Line 1' type='textarea' />
                </div>
                <Controller
                    control={control}
                    name='personalInfo.residential_address.city'
                    render={({ field }) => (
                        <CustomSelect label='City' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.residential_address.state'
                    render={({ field }) => (
                        <CustomSelect label='State' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='personalInfo.residential_address.zip_code'
                    render={({ field }) => (
                        <CustomInput label='Zip Code' {...field} />
                    )}
                />

            </div>

        </div>
    );
};

export default PersonalInfo;