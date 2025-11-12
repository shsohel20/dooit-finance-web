'use client';
import CustomInput from '@/components/ui/CustomInput';
import React from 'react';
import FormTitle from './FormTitle';
import { Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { countriesData } from '@/constants';
const CustomSelect = dynamic(() => import('@/components/ui/CustomSelect'), { ssr: false });

const PersonalInfo = ({ control, errors }) => {
    return (
        <div className='pb-8'>
            <FormTitle>Personal Information</FormTitle>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4 mt-8'>
                <Controller
                    control={control}
                    name='customer_details.given_name'
                    render={({ field }) => (
                        <CustomInput
                            label='First Name'
                            placeholder='John'
                            {...field}
                            error={errors.customer_details?.given_name?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='customer_details.middle_name'
                    render={({ field }) => (
                        <CustomInput
                            label='Middle Name'
                            placeholder='Marco'
                            {...field}
                            error={errors.customer_details?.middle_name?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='customer_details.surname'
                    render={({ field }) => (
                        <CustomInput
                            label='Last Name'
                            placeholder='Doe'
                            {...field}
                            error={errors.customer_details?.surname?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='customer_details.date_of_birth'
                    render={({ field }) => (
                        <CustomInput
                            label='Date of Birth'
                            type='date'
                            placeholder='YYYY-MM-DD'
                            {...field}
                            error={errors.customer_details?.date_of_birth?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='contact_details.phone'
                    render={({ field }) => (
                        <CustomInput
                            label='Phone Number'
                            type='tel'
                            placeholder='+1 (555) 000-0000'
                            {...field}
                            error={errors.contact_details?.phone?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='contact_details.email'
                    render={({ field }) => (
                        <CustomInput
                            label='Email'
                            type='email'
                            {...field}
                            placeholder='example@example.com'
                            error={errors.contact_details?.email?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='employment_details.occupation'
                    render={({ field }) => (
                        <CustomInput label='Occupation' {...field} error={errors.employment_details?.occupation?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='employment_details.employer_name'
                    render={({ field }) => (
                        <CustomInput label='Employer&apos; Name' {...field} error={errors.employment_details?.employer_name?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='employment_details.industry'
                    render={({ field }) => (
                        <CustomInput label='Industry' {...field} error={errors.employment_details?.industry?.message} />
                    )}
                />
                <div className='lg:col-span-3 xl:col-span-4 mt-4'>
                    <h4 className='font-semibold mb-4'>Residential Address</h4>
                    <Controller
                        control={control}
                        name='residential_address.address'
                        render={({ field }) => (
                            <CustomInput label='Address Line 1' type='textarea' {...field} error={errors.residential_address?.address?.message} />
                        )}
                    />
                </div>

                <Controller
                    control={control}
                    name='residential_address.suburb'
                    render={({ field }) => (
                        <CustomInput label='Suburb' {...field} error={errors.residential_address?.suburb?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='residential_address.state'
                    render={({ field }) => (
                        <CustomInput label='State' {...field} error={errors.residential_address?.state?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='residential_address.country'
                    render={({ field }) => (
                        <CustomSelect label='Country' {...field} options={countriesData} error={errors.residential_address?.country?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='residential_address.zip_code'
                    render={({ field }) => (
                        <CustomInput label='Zip Code' {...field} error={errors.residential_address?.zip_code?.message} />
                    )}
                />
                <div className='lg:col-span-3 xl:col-span-4 mt-4'>
                    <h4 className='font-semibold mb-4'>Mailing Address</h4>
                    <Controller
                        control={control}
                        name='mailing_address.address'
                        render={({ field }) => (
                            <CustomInput label='Address Line 1' type='textarea' {...field} error={errors.mailing_address?.address?.message} />
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    name='mailing_address.suburb'
                    render={({ field }) => (
                        <CustomInput label='Suburb' {...field} error={errors.mailing_address?.suburb?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='mailing_address.state'
                    render={({ field }) => (
                        <CustomInput label='State' {...field} error={errors.mailing_address?.state?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='mailing_address.country'
                    render={({ field }) => (
                        <CustomSelect label='Country' {...field} options={countriesData} error={errors.mailing_address?.country?.message} />
                    )}
                />
                <Controller
                    control={control}
                    name='mailing_address.postcode'
                    render={({ field }) => (
                        <CustomInput label='Postcode' {...field} error={errors.mailing_address?.postcode?.message} />
                    )}
                />


            </div>

        </div>
    );
};

export default PersonalInfo;