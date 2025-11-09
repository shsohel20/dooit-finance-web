import CustomInput from '@/components/ui/CustomInput';
import CustomSelect from '@/components/ui/CustomSelect';
import React from 'react';
import FormTitle from './FormTitle';

const PersonalInfo = () => {
    return (
        <div>
            <FormTitle>Personal Information</FormTitle>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
                <CustomInput label='First Name' />
                <CustomInput label='Last Name' />
                <CustomInput label='Date of Birth' />
                <CustomInput label='Phone Number' />
                <CustomInput label='Email' />
                <CustomInput label='Occupation' />
                <CustomInput label='Employer&apos; Name' />
                <CustomInput label='Industry' />
                <div className='col-span-2'>
                    <h4 className=' mb-2'>Residential Address</h4>
                    <CustomInput label='Address Line 1' />
                </div>
                <div className='col-span-2 grid grid-cols-3 gap-4'>
                    <CustomSelect label='City' />
                    <CustomSelect label='State' />
                    <CustomInput label='Zip Code' />
                </div>
            </div>

        </div>
    );
};

export default PersonalInfo;