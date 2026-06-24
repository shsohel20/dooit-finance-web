import React from "react";
import ResetPassword from "@/views/auth/reset-password";
import AuthLayout from "@/components/AuthLayout";
export default function ResetPasswordPage({ searchParams }) {
  const { token } = searchParams;
  return (
    <AuthLayout>
      <ResetPassword token={token} />
    </AuthLayout>
  );
}
