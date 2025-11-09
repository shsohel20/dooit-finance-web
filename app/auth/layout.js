import React from 'react';
import Header from '../(form)/(layouts)/Header';

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
};

export default Layout;