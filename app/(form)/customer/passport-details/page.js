import { Button } from '@/components/ui/button';
import CustomInput from '@/components/ui/CustomInput';
import CustomSelect from '@/components/ui/CustomSelect';
import Link from 'next/link';
import React from 'react';
import FormSubtitle from '../../(layouts)/FormSubtitle';
import FormTitle from '../../(layouts)/FormTitle';

const PassportDetails = () => {
    const nationalityOptions = [
        {
            label: 'Bangladesh',
            value: 'Bangladesh'
        },

        {
            label: 'India',
            value: 'India'
        },
        {
            label: 'Pakistan',
            value: 'Pakistan'
        }
    ]
    const genderOptions = [
        {
            label: 'Male',
            value: 'Male'
        },

        {
            label: 'Female',
            value: 'Female'
        },

        {
            label: 'Other',
            value: 'Other'
        }
    ]
    return (
        <div className='grid place-items-center min-h-[80vh] mt-10'>
            <div>
                <FormTitle>Confirm your passport details</FormTitle>
                <FormSubtitle>Please review the extracted information and make any necessary corrections.</FormSubtitle>
                {/* form fields */}
                <div className='mt-8 space-y-4 border rounded-lg px-6 py-8'>
                    <div>
                        <CustomInput label='Surname' />
                    </div>
                    <div>
                        <CustomInput label='Given Name' />
                    </div>
                    <div>
                        <CustomSelect options={nationalityOptions} label='Nationality' />
                    </div>
                    <div className='flex flex-row gap-4 w-full'>
                        <CustomInput type='date' label='Date of Birth' />
                        <CustomSelect label='Gender' options={genderOptions} />
                    </div>
                    <div className='flex flex-row gap-4 w-full'>
                        <CustomInput label='Place of Birth' />
                        <CustomInput label='Issuing Authority' />
                    </div>
                    <div className='flex flex-row gap-4 w-full'>
                        <CustomInput label='Date of Issue' />
                        <CustomInput label='Date of Expiry' />
                    </div>
                    <div>
                        <CustomInput label='Passport/Identification Number' />
                    </div>
                </div>

                <div className='mt-8 mb-8 flex justify-center'>
                    <Button>
                        <Link href='/customer/take-selfie'>Confirm & Continue</Link>
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default PassportDetails;