"use client";
import { Button } from '@/components/ui/button';
import Stepper from '@/components/ui/Stepper';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import IdentificationDocuments from '../components/IdentificationDocuments';
import OtherInfo from '../components/OtherInfo';
import PersonalInfo from '../components/PersonalInfo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomerRegisterStore } from '@/app/store/useCustomerRegister';
const personalInfoSchema = z.object({
    customer_details: z.object({
        given_name: z.string().min(1, 'First name is required'),
        middle_name: z.string().min(1, 'Middle name is required'),
        surname: z.string().min(1, 'Last name is required'),
    }),
    document_type: z.object({
        value: z.string().min(1, 'Document type is required'),
        label: z.string().min(1, 'Document type is required'),
    }),
    contact_details: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(1, 'Phone number is required'),
    }),
    employment_details: z.object({
        occupation: z.string().min(1, 'Occupation is required'),
        industry: z.string().min(1, 'Industry is required'),
    }),
    residential_address: z.object({
        address: z.string().min(1, 'Address is required'),
        suburb: z.string().optional(),
        state: z.string(),
        postcode: z.string().optional(),
        country: z.object({
            value: z.string(),
            label: z.string(),
        }).nullable(),
    }),
    documents: z.array(z.object({
        name: z.string().optional(),
        url: z.string().optional(),
        mimeType: z.string().optional(),
        type: z.string().optional(),
        docType: z.string().optional(),
    })),
    declaration: z.object({
        declarations_accepted: z.boolean().optional(),
        signatory_name: z.string().optional(),
        signature: z.string().optional(),
        date: z.string().optional(),
    }),
    funds_wealth: z.object({
        source_of_funds: z.string().optional(),
        source_of_wealth: z.string().optional(),
        account_purpose: z.string().optional(),
        estimated_trading_volume: z.string().optional(),
    }),
    sole_trader: z.object({
        is_sole_trader: z.boolean().optional(),
        business_details: z.object({
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            date_of_birth: z.string().optional(),
            phone_number: z.string().optional(),
            id_number: z.string().optional(),
        }),
    }),
    mailing_address: z.object({
        address: z.string().optional(),
        suburb: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
        country: z.object({
            value: z.string(),
            label: z.string(),
        }).nullable().optional(),
    }),
});
const TOTAL_STEPS = 3;
const CustomerRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const { customerRegisterData, setCustomerRegisterData, registerType, country } = useCustomerRegisterStore();


    const { handleSubmit, control, formState: { errors, }, setValue } = useForm({
        defaultValues: customerRegisterData,
        resolver: zodResolver(personalInfoSchema),
        mode: 'onChange',
    });
    const onSubmit = (data) => {
        console.log("data", data);

        setCustomerRegisterData(data);
        router.push('/customer/registration/preview')
    }
    console.log("errors", errors);
    const router = useRouter();

    const handleNextStep = () => {
        setCurrentStep(prev => {
            if (prev === TOTAL_STEPS) {
                // router.push('/customer/registration/preview');
                return TOTAL_STEPS;
            }
            return prev + 1;
        });
    }
    const handlePreviousStep = () => {
        setCurrentStep(prev => {
            if (prev === 1) {
                return prev;
            }
            return prev - 1;
        });
    }
    const handleStep = (step) => {
        setCurrentStep(step);
    }
    return (
        <div className='container'>
            {/* stepper */}
            <div>
                <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} handleStep={handleStep} />
            </div>
            {/* content */}
            <div>
                {currentStep === 1 && <IdentificationDocuments control={control} errors={errors} />}
                {currentStep === 2 && <PersonalInfo control={control} errors={errors} />}

                {currentStep === 3 && <OtherInfo control={control} errors={errors} setValue={setValue} />}
            </div>
            <div className='flex justify-end gap-2 my-8'>
                {currentStep > 1 && <Button
                    variant='outline'
                    onClick={handlePreviousStep}
                    className={'w-[200px]'}>
                    Previous
                </Button>
                }
                {currentStep < TOTAL_STEPS &&
                    <Button
                        onClick={handleNextStep}
                        className={'w-[200px]'}
                    >
                        Next
                    </Button>
                }
                {currentStep === TOTAL_STEPS && <Button onClick={handleSubmit(onSubmit)} className={'w-[200px]'}>
                    Preview
                </Button>}
            </div>
        </div>
    );
};

export default CustomerRegistration;