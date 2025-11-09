import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ProfileCard } from '../page';

const Application = () => {
    return (
        <div className='container pt-8'>
            <div className='flex justify-between items-center'>
                <div>
                    <h4 className='text-2xl font-bold'>Dashboard</h4>
                    <p>Welcome back, Sarah! Here&apos;s an overview of your KYC activities.</p>
                </div>
                <div className='flex gap-4'>
                    {/* <Button className={'w-[200px] bg-[#4ED7F1] text-black'}>Share KYC</Button> */}
                    <Button className={' bg-[#402E7A]'}><Plus />
                        <Link href='/customer/dashboard/application/new'>Start New Application</Link>
                    </Button>
                </div>

            </div>

            <div className='mt-8 flex items-start gap-4'>
                <ProfileCard />
                <div className=' w-full border '>
                    <div className='flex justify-between items-center p-4 border-b'>
                        <h4 className='text-2xl font-bold tracking-tighter'>My Applications</h4>
                        <Button variant='outline' className='w-fit border-[#402E7A] text-[#402E7A]'>View All</Button>
                    </div>
                    <table className='w-full '>
                        <thead>
                            <tr className='p-4 bg-muted'>
                                <th className='p-4 font-bold text-left '>Application Id</th>
                                <th className='p-4 font-bold text-left '>Status</th>
                                <th className='p-4 font-bold text-left '>Date Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='p-4'>1234567890</td>
                                <td className='p-4'>Pending</td>
                                <td className='p-4'>2025-01-01</td>
                            </tr>
                            <tr className='bg-muted'>
                                <td className='p-4'>1234567330</td>
                                <td className='p-4'>In Review</td>
                                <td className='p-4'>2025-01-02</td>
                            </tr>
                            <tr>
                                <td className='p-4'>1234567440</td>
                                <td className='p-4'>Approved</td>
                                <td className='p-4'>2025-01-03</td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
};

export default Application;