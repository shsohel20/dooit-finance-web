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
import { cn } from '@/lib/utils';

const Preview = () => {
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { customerRegisterData, registerType, country } = useCustomerRegisterStore();
    console.log("customerRegisterData", customerRegisterData);
    const handleContinue = async () => {
        setLoading(true);
        const token = localStorage.getItem("invite_token");
        const cid = localStorage.getItem("invite_cid");

        const submittedData = {
            token,
            cid,
            requestedType: registerType,
            country: country,
            personalKyc: {
                personal_form: {
                    customer_details: customerRegisterData?.customer_details,
                    contact_details: customerRegisterData?.contact_details,
                    employment_details: customerRegisterData?.employment_details,
                    residential_address: {
                        ...customerRegisterData?.residential_address,
                        country: customerRegisterData?.residential_address.country.value
                    },
                    mailing_address: {
                        ...customerRegisterData?.mailing_address,
                        country: customerRegisterData?.mailing_address.country.value
                    },

                },
                funds_wealth: customerRegisterData?.funds_wealth,
                sole_trader: customerRegisterData?.sole_trader,
            },
            documents: customerRegisterData?.documents,
            declaration: customerRegisterData?.declaration,
        }
        console.log("submittedData", submittedData);
        const response = await individualCustomerRegistration(submittedData);
        setLoading(false);
        console.log("response", response);
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
                    <div className='grid grid-cols-6 gap-2 py-6'>
                        <LabelDetails label="First Name" value={customerRegisterData.customer_details?.given_name} />
                        <LabelDetails label="Middle Name" value={customerRegisterData?.customer_details?.middle_name} />
                        <LabelDetails label="Last Name" value={customerRegisterData?.customer_details?.surname} />
                        <LabelDetails label="Date of Birth" value={customerRegisterData?.customer_details?.date_of_birth} />
                        <LabelDetails label="Occupation" value={customerRegisterData?.employment_details?.occupation} />
                        <LabelDetails label="Email" value={customerRegisterData?.contact_details?.email} />
                        <LabelDetails label="Industry" value={customerRegisterData?.employment_details?.industry} />
                        <LabelDetails label="Employer&apos; Name" value={customerRegisterData?.employment_details?.employer_name} />
                        <LabelDetails label="Residential Address" value={customerRegisterData?.residential_address?.address} />
                        <LabelDetails label="Country" value={customerRegisterData?.residential_address?.country?.value} />
                        <LabelDetails label="State" value={customerRegisterData?.residential_address?.state} />
                        <LabelDetails label="Zip Code" value={customerRegisterData?.residential_address?.postcode} />
                    </div>
                </div>
                <div className=''>
                    <h4 className='text-md font-bold tracking-tighter'>Identification Documents</h4>
                    <div className=''>
                        <p>Document Type: <span className='font-bold'>{customerRegisterData?.document_type?.label}</span></p>
                        <div className='flex py-4 gap-2'>
                            {
                                customerRegisterData?.documents?.map((document, index) => (
                                    <div key={document.id} className={
                                        cn('h-[200px] aspect-3/4 rounded-md overflow-hidden border')
                                    }>
                                        <img src={document.url} alt={document.name} className='w-full h-full object-cover' />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <h4 className='text-md font-bold tracking-tighter'>Bank Statement</h4>
                    <div className='h-[150px]'>

                    </div>
                </div>
                <div>
                    <h4 className='text-md font-bold tracking-tighter'>Funds/Wealth Information</h4>
                    <div className='grid grid-cols-6 gap-2 py-6'>
                        <LabelDetails label="Source of Wealth" value={customerRegisterData?.funds_wealth?.source_of_wealth} />
                        <LabelDetails label="Reason Of Opening Account" value={customerRegisterData?.funds_wealth?.account_purpose} />
                        <LabelDetails label="Estimated Trading Volume" value={customerRegisterData?.funds_wealth?.estimated_trading_volume} />
                        <LabelDetails label="Email" value={customerRegisterData?.contact_details?.email} />
                        <LabelDetails label="Occupation" value={customerRegisterData?.employment_details?.occupation} />
                        <LabelDetails label="Employer&apos; Name" value={customerRegisterData?.employment_details?.employer_name} />
                        <LabelDetails label="Industry" value={customerRegisterData?.employment_details?.industry} />
                    </div>
                </div>
                <div>
                    <h4 className='text-md font-bold tracking-tighter'>Sole Trader Status</h4>
                    <div className='space-y-4'>
                        <div>
                            Are you acting as a sole trader?: <span className='font-bold'>{customerRegisterData?.sole_trader?.is_sole_trader ? 'Yes' : 'No'}</span>
                        </div>

                    </div>
                </div>
                <div>
                    {/* <h4 className='text-md font-bold tracking-tighter'>Declaration</h4>
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
                    </div> */}
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