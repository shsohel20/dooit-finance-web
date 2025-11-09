import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import React from 'react'
import FormTitle from './FormTitle'

const Preview = () => {
    return (
        <div className='container py-8'>
            <FormTitle>Preview</FormTitle>
            <div className='space-y-4 mt-4'>
                <div className=''>
                    <h4 className='text-md font-bold tracking-tighter'>Personal Information</h4>
                    <div className='space-y-4 mt-4'>
                        <div>
                            First Name: John
                        </div>
                        <div>
                            Last Name: Doe
                        </div>
                        <div>
                            Date of Birth: 18th Oct, 1999
                        </div>
                        <div>
                            Occupation: Banker
                        </div>
                        <div>
                            Email: john@gmail.com
                        </div>
                        <div>
                            Industry: Finance & Banking
                        </div>
                        <div>
                            Employer&apos; Name:
                        </div>
                        <div>
                            Residential Address:
                        </div>
                        <div>
                            City:
                        </div>
                        <div>
                            State:
                        </div>
                        <div>
                            Zip Code:
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className='text-md font-bold tracking-tighter'>Identification Documents</h4>
                    <p>Upload Government
                        issued ID document :</p>
                    <div className='h-[150px]'></div>
                    <h4 className='text-md font-bold tracking-tighter'>Bank Statement</h4>
                    <div className='h-[150px]'></div>
                </div>
                <div>
                    <h4 className='text-md font-bold tracking-tighter'>Funds/Wealth Information</h4>
                    <div className='space-y-4'>
                        <div>
                            Source of Funds:
                        </div>
                        <div>
                            Source of Wealth:
                        </div>
                        <div>
                            Reason Of Opening Account:
                        </div>
                        <div>
                            Estimated Trading Volume:
                        </div>
                        <div>
                            Email:
                        </div>
                        <div>
                            Occupation:
                        </div>
                        <div>
                            Employer&apos; Name:
                        </div>
                        <div>
                            Industry:
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className='text-md font-bold tracking-tighter'>Sole Trader Status</h4>
                    <div className='space-y-4'>
                        <div>
                            Are you acting as a sole trader?: Yes
                        </div>

                    </div>
                </div>
                <div>
                    <h4 className='text-md font-bold tracking-tighter'>Declaration</h4>
                    <div className='space-y-1 mt-2'>
                        <p>1. I declare that the information I have provided is TRUE and CORRECT</p>
                        <p>2. I declare that I am NOT a politically exposed person (PEP),
                            all my funds are not sourced from any kinds of corrupt,
                            criminal, money laundering
                            and/or terrorist financing activities.
                        </p>
                        <p>3. I acknowledge that all the information provided by
                            CloudTechX Pty Ltd does not take into account my financial
                            situation, objectives or needs.
                        </p>
                        <p>4. I have been advised to seek independent advice before
                            making any decisions.</p>
                        <p>5. I have read, understood, and accept the Terms and
                            Conditions; and Privacy Policy on CobWeb Pay website:
                            https://www.cobwebpay.com/.</p>
                        <p>6. I declare that I am not a U.S resident for tax purposes.</p>
                    </div>
                </div>

                <div className='flex flex-col items-center justify-center gap-4 mt-8'>
                    <div className='flex items-center gap-2'>
                        <Checkbox />
                        <p>I have read and agreed</p>
                    </div>
                    <div>
                        <Button>
                            <Link href='/customer/dashboard'>Continue</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Preview