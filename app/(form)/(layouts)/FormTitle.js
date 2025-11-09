import React from 'react';

const FormTitle = ( { children } ) => {
    return (
        <h4 className='text-3xl tracking-tighter font-bold text-gray-800 mb-1 text-center'>
            {children}
        </h4>
    );
};

export default FormTitle;