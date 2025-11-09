import React from 'react';
import Header from './(layouts)/Header';

const Layout = ( { children } ) => {
    return (
        <div>
            <Header />
            <div className=''>
                {children}
            </div>
        </div>
    );
};

export default Layout;