"use client";
import { Button } from '@/components/ui/button';
import Stepper from '@/components/ui/Stepper';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import IdentificationDocuments from './components/IdentificationDocuments';
import OtherInfo from './components/OtherInfo';
import PersonalInfo from './components/PersonalInfo';


const TOTAL_STEPS = 3;
const CustomerRegistration = () => {
    const [currentStep, setCurrentStep] = useState( 1 );
    const router = useRouter();

    const handleStep = () => {
        setCurrentStep( prev => {
            if ( prev === TOTAL_STEPS ) {
                router.push( '/customer/registration/preview' );
                return TOTAL_STEPS;
            }
            return prev + 1;
        } );
    }
    const handlePreviousStep = () => {
        setCurrentStep( prev => {
            if ( prev === 1 ) {
                return prev;
            }
            return prev - 1;
        } );
    }
    return (
        <div className='container'>
            {/* stepper */}
            <div>
                <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </div>
            {/* content */}
            <div>
                {currentStep === 1 && <PersonalInfo />}
                {currentStep === 2 && <IdentificationDocuments />}
                {currentStep === 3 && <OtherInfo />}
            </div>
            <div className='flex justify-end gap-2 my-8'>
                {currentStep > 1 && <Button
                    variant='outline'
                    onClick={handlePreviousStep}
                    className={'w-[200px]'}>Previous</Button>}
                <Button onClick={handleStep} className={'w-[200px]'}>
                    {currentStep === TOTAL_STEPS ? 'Preview' : 'Next'}
                </Button>
            </div>
        </div>
    );
};

export default CustomerRegistration;