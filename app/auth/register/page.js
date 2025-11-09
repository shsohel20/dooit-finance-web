import AuthLayout from '@/components/AuthLayout';
import RegisterForm from '@/components/RegisterForm';
import React from 'react';

const RegisterPage = ({ searchParams }) => {
    const { token, cid } = searchParams;
    return (
        <AuthLayout>
            <RegisterForm token={token} cid={cid} />
        </AuthLayout>
    );
};

export default RegisterPage;