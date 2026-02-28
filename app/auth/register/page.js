import AuthLayout from "@/components/AuthLayout";
import RegisterForm from "@/components/RegisterForm";
import React from "react";

const RegisterPage = ({ searchParams }) => {
  const { token, cid, email } = searchParams;
  return (
    <AuthLayout>
      <RegisterForm token={token} cid={cid} email={email} />
    </AuthLayout>
  );
};

export default RegisterPage;
