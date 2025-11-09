import { Checkbox } from '@/components/ui/checkbox';
import CustomInput from '@/components/ui/CustomInput';
import { Label } from '@/components/ui/label';
import React from 'react';
import FormTitle from './FormTitle';

const OtherInfo = () => {
    return (
        <div>
            <FormTitle>Funds/Wealth Information</FormTitle>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 mb-8'>
                <CustomInput label='Source of Funds' />
                <CustomInput label='Source of Wealth' />
                <CustomInput label='Reason Of Opening Account' />
                <CustomInput label='Estimated Trading Volume' />
                <CustomInput label='Email' />
                <CustomInput label='Occupation' />
                <CustomInput label='Employer&apos; Name' />
                <CustomInput label='Industry' />
            </div>

            <FormTitle>Sole Trader Status</FormTitle>
            <div className='mt-4'>
                <div className='flex gap-4 items-center'>
                    <Label htmlFor='sole-trader'>Are you acting as a sole trader?</Label>
                    <div className='flex gap-4'>
                        <div className='flex items-center gap-2'>
                            <Checkbox label='Yes' id='is-sole-trader' />
                            <Label htmlFor='is-sole-trader'>Yes</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Checkbox label='No' id='is-not-sole-trader' />
                            <Label htmlFor='is-not-sole-trader'>No</Label>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                    <CustomInput label='First Name' />
                    <CustomInput label='Last Name' />
                    <CustomInput label='Date of Birth' />
                    <CustomInput label='Phone Number' />
                    <CustomInput label='ID Number' />

                </div>
            </div>
        </div>

    );
};

export default OtherInfo;