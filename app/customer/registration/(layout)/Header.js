import { IconInnerShadowTop } from '@tabler/icons-react';
import { Bell } from 'lucide-react';
import React from 'react';

const Header = () => {
    return (
        <div className=' border-b py-4 flex justify-between items-center'>
            <div className='flex items-center justify-between container'>
                <div className=''>
                    <a href="#" className='flex items-center gap-2'>
                        <IconInnerShadowTop className="!size-5" />
                        <span className="text-base font-semibold">Dooit Wallet.</span>
                    </a>
                </div>
                {/* <div className='flex items-center gap-4'>
                    <Link href='#'>Dashboard</Link>
                    <Link href='#'>Customers</Link>
                    <Link href='#'>Reports</Link>
                    <Link href='#'>Settings</Link>
                </div> */}
                <div className='flex items-center gap-4'>
                    <span><Bell /></span>
                    <span>Sarah Miller</span>
                    <div>
                        <div className='size-10 rounded-full bg-white border'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;