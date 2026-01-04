"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CustomInput from '@/components/ui/CustomInput';
import CustomSelect from '@/components/ui/CustomSelect';
import { Label } from '@/components/ui/label';
import { Camera, ChevronLeft, ChevronRight, Pencil, Upload } from 'lucide-react';
import React, { useState } from 'react';
import Stepper from './(components)/Stepper';
import LabelDetails from '@/components/LabelDetails';






const Success = () => {
    return (
        <div className='flex flex-col gap-4 items-center justify-center'>
            <div className='bg-blue-50 p-10 rounded-lg flex flex-col gap-4 items-center justify-center max-w-[500px]'>
                <div className='size-20'>
                    <img src="/success.svg" alt="verification" className='w-full h-full object-cover' />
                </div>
                <p className='text-2xl font-bold tracking-tighter'>Application Submitted</p>
                <p className='text-purple text-center'>Thank you. Your application has been successfully received and is now under review.</p>
                <div className='w-[400px] flex flex-col gap-4'>
                    <div className='bg-white py-8 w-full rounded-lg flex flex-col items-center justify-center'>
                        <p>Reference Number</p>
                        <p className='text-lg text-cyan-500'>Ref-1234567890</p>
                    </div>
                    <div className='bg-white py-8 w-full rounded-lg flex flex-col items-center justify-center'>
                        <p>Estimated Review Time</p>
                        <p className='text-lg font-bold'>3-5 Business days</p>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <Button className={'w-[200px]'}>Dashboard</Button>
                </div>
            </div>
        </div>

    )
}

const Step4 = () => {
    return (
        <div className='space-y-4'>
            <div className='space-y-2 pb-4 border-b'>
                <div className='flex justify-between items-center'>
                    <h4 className='font-semibold'>Basic Information</h4>
                    <Button variant='outline'><Pencil /> Edit</Button>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <LabelDetails label='Full Name' value='John Doe' />
                    <LabelDetails label='Email' value='john.doe@example.com' />
                    <LabelDetails label='Phone Number' value='+1234567890' />
                    <LabelDetails label='Registration Type' value='Individual' />

                </div>
            </div>
            <div className='space-y-2 pb-4 border-b'>
                <div className='flex justify-between items-center'>
                    <h4 className='font-semibold'>Identity Verification</h4>
                    <Button variant='outline'><Pencil /> Edit</Button>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <LabelDetails label='Document Type' value='Passport' />
                    <LabelDetails label='Uploaded Document' value='passport.pdf' />

                </div>
            </div>
            <div className='space-y-2 pb-4 border-b'>
                <div className='flex justify-between items-center'>
                    <h4 className='font-semibold'>Financial Information</h4>
                    <Button variant='outline'><Pencil /> Edit</Button>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <LabelDetails label='Source of Income' value='Salary' />
                    <LabelDetails label='Uploaded Document' value='$ 50,000 - $ 100,000' />

                </div>
            </div>

            <div className='flex items-center gap-2 py-4'>
                <Checkbox /> <Label htmlFor=''>I confirm that the information provided is accurate to the best of my knowledge and I agree to the <span className='text-purple'>Terms and Conditions.</span></Label>
            </div>
        </div>
    )
}

const Step3 = () => {
    const goals = ['Retirement', 'Wealth Growth', 'Income Generation', 'Major Purchase', 'Education', 'Other']
    return (
        <div className='space-y-2 '>
            <h4 className=' font-bold tracking-tighter'>Step 3: Financial Information</h4>
            <div className='grid grid-cols-2 gap-4 py-4 border-b'>
                <CustomSelect label='Source of Income' />
                <CustomSelect label='Estimated annual income.' />

            </div>
            <div className='py-4 border-b space-y-2'>
                <h4 className='font-semibold'>Primary Bank Account</h4>
                <div className='grid grid-cols-2 gap-4'>
                    <CustomInput label='Bank Name' />
                    <CustomInput label='Account Number' />
                    <div className='col-span-2'>
                        <CustomInput label='Routing Number' />
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <h4 className='font-semibold'>Investment Goals (select that apply)</h4>
                <div className='flex flex-wrap gap-2 '>
                    {goals.map((goal, index) => (
                        <div key={index} className='flex items-center gap-2 p-3 rounded-md bg-gray-50 border border-gray-200'>
                            <Checkbox label={goal} />
                            <Label htmlFor={goal}>{goal}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const Step1 = () => {
    return (
        <div className='space-y-2 '>
            <h4 className=' font-bold tracking-tighter'>Step 1: Application Type</h4>

            <CustomSelect placeholder='Select Application Type' />
        </div>
    );
}
const Step2 = () => {
    return (
        <div className='space-y-2 '>
            <h4 className=' font-bold tracking-tighter'>Step 2: Identity Verification</h4>
            <CustomSelect placeholder='Select Identity Verification' />

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <span className='font-semibold'>Front of document</span>
                    <div className='h-[200px] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center'>
                        <span><Upload /></span>
                        <span>Upload a file or drag and drop a PNG, JPG, or PDF up to 10MB</span>
                    </div>
                </div>
                <div className='space-y-2'>
                    <span className='font-semibold'>Back of document</span>
                    <div className='h-[200px] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center'>
                        <span><Upload /></span>
                        <span>Upload a file or drag and drop a PNG, JPG, or PDF up to 10MB</span>
                    </div>
                </div>
            </div>

            <div className='flex justify-center items-center mt-4 p-6 border rounded-lg'>
                <p className='flex items-center gap-2'><span>Or take a photo</span> <Button><Camera /> Open Camera</Button></p>
            </div>
        </div>
    );
}

const TotalSteps = 4;
const NewApplication = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePreviousStep = () => {
        setCurrentStep(prev => {
            if (prev === 1) {
                return prev;
            }
            return prev - 1;
        });
    }
    const handleStep = () => {
        setCurrentStep(prev => {
            if (prev === TotalSteps) {
                return prev;
            }
            return prev + 1;
        });
    }
    const handleSubmit = () => {
        setShowSuccess(true);
    }
    return (
        <div className='container pt-8'>
            {
                showSuccess ? <Success /> : (
                    <>
                        <div>
                            <h4 className='text-2xl font-bold tracking-tighter'>Start New Application</h4>
                            <p>Follow the steps to complete a new KYC application.</p>
                        </div>

                        <div className='mt-8 p-4 border rounded-lg'>
                            <Stepper currentStep={currentStep} totalSteps={TotalSteps} />
                            <div className='mt-8'>
                                {currentStep === 1 && <Step1 />}
                                {currentStep === 2 && <Step2 />}
                                {currentStep === 3 && <Step3 />}
                                {currentStep === 4 && <Step4 />}
                            </div>
                            <div className='flex justify-between gap-2 my-8'>
                                <Button variant='outline' onClick={handlePreviousStep}><ChevronLeft /> Back</Button>
                                {currentStep !== TotalSteps && <Button variant='outline' onClick={handleStep}>Next<ChevronRight /></Button>}
                                {currentStep === TotalSteps && <Button variant='outline' onClick={handleSubmit}>Submit</Button>}
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default NewApplication;