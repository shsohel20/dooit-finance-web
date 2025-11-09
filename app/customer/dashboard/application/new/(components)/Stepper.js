import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

const Stepper = ( { currentStep, totalSteps } ) => {
    return (
        <div className='flex items-center justify-between py-4 relative'>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-full bg-gray-200 rounded-full'></div>
            {
                Array.from( { length: totalSteps } ).map( ( _, index ) => (
                    <div key={index} className={`size-10 relative  flex justify-center items-center rounded-full ${currentStep === index + 1 || currentStep > index + 1 ? 'bg-purple' : 'bg-gray-200'} `}>
                        <span className={cn( 'text-white font-bold', currentStep === index + 1 || currentStep > index + 1 ? 'text-white' : 'text-gray-800' )}>
                            {
                                currentStep === index + 1 || currentStep > index + 1 ? <Check /> : index + 1
                            }
                        </span>
                    </div>
                ) )
            }
        </div>
    );
};

export default Stepper;