import React from 'react';
import Header from '../registration/(layout)/Header';

const Layout = ( { children } ) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
};

export default Layout;