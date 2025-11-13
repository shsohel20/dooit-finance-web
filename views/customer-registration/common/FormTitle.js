import React from 'react';

const FormTitle = ( { children } ) => {
    return (
        <h2 className='text-2xl font-bold tracking-tighter'>
            {children}
        </h2>
    );
};

export default FormTitle;