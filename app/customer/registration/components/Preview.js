'use client';
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import React, { useState } from 'react'
import FormTitle from './FormTitle'
import { useCustomerRegisterStore } from '@/app/store/useCustomerRegister';
import LabelDetails from '@/components/LabelDetails';
import { Label } from '@/components/ui/label';
import { individualCustomerRegistration } from '../actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Preview = () => {
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { customerRegisterData } = useCustomerRegisterStore();
    console.log("customerRegisterData", customerRegisterData);
    const handleContinue = async () => {
        setLoading(true);
        const response = await individualCustomerRegistration(customerRegisterData);
        if (response.success) {
            router.push('/customer/dashboard');
            localStorage.removeItem('invite_token');
            localStorage.removeItem('invite_cid');
            toast.success('Welcome onboard!');
        }
    }
    return (
        <div className='container py-8'>
            <FormTitle>Preview</FormTitle>
            <div className='space-y-4 mt-4'>
                <div className=''>
                    <h4 className='text-md font-bold tracking-tighter'>Personal Information</h4>
                    <div className='grid grid-cols-4 gap-2 py-6'>
                        <LabelDetails label="First Name" value={customerRegisterData?.personalKyc?.personal_form?.customer_details?.given_name} />
                        <LabelDetails label="Middle Name" value={customerRegisterData?.personalKyc?.personal_form?.customer_details?.middle_name} />
                        <LabelDetails label="Last Name" value={customerRegisterData?.personalKyc?.personal_form?.customer_details?.surname} />
                        <LabelDetails label="Date of Birth" value={customerRegisterData?.personalKyc?.personal_form?.customer_details?.date_of_birth} />
                        <LabelDetails label="Occupation" value={customerRegisterData?.personalKyc?.personal_form?.employment_details?.occupation} />
                        <LabelDetails label="Email" value={customerRegisterData?.personalKyc?.personal_form?.contact_details?.email} />
                        <LabelDetails label="Industry" value={customerRegisterData?.personalKyc?.personal_form?.employment_details?.industry} />
                        <LabelDetails label="Employer&apos; Name" value={customerRegisterData?.personalKyc?.personal_form?.employment_details?.employer_name} />
                        <LabelDetails label="Residential Address" value={customerRegisterData?.personalKyc?.personal_form?.residential_address?.address} />
                        <LabelDetails label="Country" value={customerRegisterData?.personalKyc?.personal_form?.residential_address?.country?.value} />
                        <LabelDetails label="State" value={customerRegisterData?.personalKyc?.personal_form?.residential_address?.state} />
                        <LabelDetails label="Zip Code" value={customerRegisterData?.personalKyc?.personal_form?.residential_address?.zip_code} />
                    </div>
                </div>
                <div className=''>
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
                        <Checkbox id='agreed' checked={agreed} onCheckedChange={(checked) => setAgreed(checked)} />
                        <Label htmlFor='agreed'>I have read and agreed</Label>
                    </div>
                    <div>
                        <Button onClick={handleContinue} disabled={!agreed || loading}>
                            {loading ? <Loader2 className='animate-spin size-4' /> : 'Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Preview