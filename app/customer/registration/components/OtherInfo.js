import { Checkbox } from '@/components/ui/checkbox';
import CustomInput from '@/components/ui/CustomInput';
import { Label } from '@/components/ui/label';
import React, { useEffect } from 'react';
import FormTitle from './FormTitle';
import { Controller, useWatch } from 'react-hook-form';

const OtherInfo = ({ control, errors, setValue }) => {
    const isSoleTrader = useWatch({ control, name: 'sole_trader.is_sole_trader' });

    useEffect(() => {
        if (!isSoleTrader) {
            setValue('sole_trader.business_details.first_name', '');
            setValue('sole_trader.business_details.last_name', '');
            setValue('sole_trader.business_details.date_of_birth', '');
            setValue('sole_trader.business_details.phone_number', '');
            setValue('sole_trader.business_details.id_number', '');
        }
    }, [isSoleTrader]);
    return (
        <div>
            <FormTitle>Funds/Wealth Information</FormTitle>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 mb-8'>
                <Controller
                    control={control}
                    name='funds_wealth.source_of_funds'
                    render={({ field }) => (
                        <CustomInput label='Source of Funds' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='funds_wealth.source_of_wealth'
                    render={({ field }) => (
                        <CustomInput label='Source of Wealth' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='funds_wealth.account_purpose'
                    render={({ field }) => (
                        <CustomInput label='Reason Of Opening Account' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='funds_wealth.estimated_trading_volume'
                    render={({ field }) => (
                        <CustomInput label='Estimated Trading Volume' {...field} />
                    )}
                />
                {/* <Controller
                    control={control}
                    name='funds_wealth.email'
                    render={({ field }) => (
                        <CustomInput label='Email' {...field} />
                    )}
                /> */}
                {/* <Controller
                    control={control}
                    name='funds_wealth.occupation'
                    render={({ field }) => (
                        <CustomInput label='Occupation' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='funds_wealth.employer_name'
                    render={({ field }) => (
                        <CustomInput label='Employer&apos; Name' {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name='funds_wealth.industry'
                    render={({ field }) => (
                        <CustomInput label='Industry' {...field} />
                    )}
                /> */}
            </div>

            <FormTitle>Sole Trader Status</FormTitle>
            <div className='mt-4'>

                <Controller
                    control={control}
                    name='sole_trader.is_sole_trader'
                    render={({ field }) => (
                        <div className='flex items-center gap-2'>
                            <Label htmlFor='is-sole-trader'>Are you acting as a sole trader?</Label>
                            <Checkbox label='Are you acting as a sole trader?' id='is-sole-trader' checked={field.value} onCheckedChange={field.onChange} />

                        </div>
                    )}
                />


                {isSoleTrader && <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>

                    <Controller
                        control={control}
                        name='sole_trader.business_details.first_name'
                        render={({ field }) => (
                            <CustomInput label='First Name' {...field} />
                        )}
                    />
                    <Controller
                        control={control}
                        name='sole_trader.business_details.last_name'
                        render={({ field }) => (
                            <CustomInput label='Last Name' {...field} />
                        )}
                    />
                    <Controller
                        control={control}
                        name='sole_trader.business_details.date_of_birth'
                        render={({ field }) => (
                            <CustomInput label='Date of Birth' {...field} type='date' />
                        )}
                    />
                    <Controller
                        control={control}
                        name='sole_trader.business_details.phone_number'
                        render={({ field }) => (
                            <CustomInput label='Phone Number' type='tel' {...field} />
                        )}
                    />
                    <Controller
                        control={control}
                        name='sole_trader.business_details.id_number'
                        render={({ field }) => (
                            <CustomInput label='ID Number' {...field} />
                        )}
                    />
                    {/* <CustomInput label='First Name' />
                    <CustomInput label='Last Name' />
                    <CustomInput label='Date of Birth' />
                    <CustomInput label='Phone Number' />
                    <CustomInput label='ID Number' /> */}

                </div>}
            </div>
        </div>

    );
};

export default OtherInfo;