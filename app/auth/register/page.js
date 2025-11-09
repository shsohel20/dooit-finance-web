import AuthLayout from '@/components/AuthLayout';
import RegisterForm from '@/components/RegisterForm';
import React from 'react';

const RegisterPage = () => {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
};

export default RegisterPage;