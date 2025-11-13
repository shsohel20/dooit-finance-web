import React from 'react';
import Header from './(layout)/Header';

const layout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className='bg-brown py-8'>
                <div className='container'>
                    <div className='flex items-center justify-between'>
                        <div className=''>
                            <h2 className='text-3xl font-bold tracking-tighter max-w-[400px]'>Account Registration and Authorization</h2>
                            <p>Please provide the necessary information to complete the KYC process.</p>
                        </div>
                        <div>
                            {/* <p className='font-semibold'>Type: Individual</p> */}
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};

export default layout;