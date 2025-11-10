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
const personalInfoSchema = z.object({
    customer_details: z.object({
        given_name: z.string().min(1, 'First name is required'),
        middle_name: z.string().min(1, 'Middle name is required'),
        surname: z.string().min(1, 'Last name is required'),
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
        suburb: z.string().min(1, 'Suburb is required'),
        state: z.string().min(1, 'State is required'),
        postcode: z.string().min(1, 'Postcode is required'),
        country: z.string().min(1, 'Country is required'),
    }),
    documents: z.array(z.object({
        name: z.string().min(1, 'Document name is required'),
        url: z.string().min(1, 'Document URL is required'),
        mimeType: z.string().min(1, 'Document MIME type is required'),
        type: z.string().min(1, 'Document type is required'),
    })),
    declaration: z.object({
        declarations_accepted: z.boolean(),
        signatory_name: z.string().min(1, 'Signatory name is required'),
        signature: z.string().min(1, 'Signature is required'),
        date: z.string().min(1, 'Date is required'),
    }),
});
const TOTAL_STEPS = 3;
const CustomerRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const initialFormData = {
        personalInfo: {
            customer_details: {
                given_name: '',
                middle_name: '',
                surname: '',
                date_of_birth: '',
                other_names: '',
                referral: '',
            }
        },
        contact_details: {
            email: '',
            phone: ''
        },
        employment_details: {
            occupation: '',
            industry: '',
            employer_name: '',
        },
        residential_address: {
            address: '',
            suburb: '',
            state: '',
            postcode: '',
            country: '',

        },
        documents: [
            {
                name: '',
                url: '',
                mimeType: '',
                type: '',
            }
        ],
        declaration: {
            declarations_accepted: true,
            signatory_name: '',
            signature: '',
            date: '',
        }
    }
    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: initialFormData,
        resolver: zodResolver(personalInfoSchema),
    });
    const onSubmit = (data) => {
        console.log("data", data);
    }
    console.log("errors", errors);
    const router = useRouter();

    const handleStep = () => {
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
    return (
        <div className='container'>
            {/* stepper */}
            <div>
                <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </div>
            {/* content */}
            <div>
                {currentStep === 1 && <PersonalInfo control={control} errors={errors} />}
                {currentStep === 2 && <IdentificationDocuments />}
                {currentStep === 3 && <OtherInfo />}
            </div>
            <div className='flex justify-end gap-2 my-8'>
                {currentStep > 1 && <Button
                    variant='outline'
                    onClick={handlePreviousStep}
                    className={'w-[200px]'}>Previous</Button>}
                {currentStep < TOTAL_STEPS && <Button onClick={handleStep} className={'w-[200px]'}>
                    Next
                </Button>}
                {currentStep === TOTAL_STEPS && <Button onClick={handleSubmit(onSubmit)} className={'w-[200px]'}>
                    Preview
                </Button>}
            </div>
        </div>
    );
};

export default CustomerRegistration;