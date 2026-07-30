import React from "react";
import ResetPassword from "@/views/auth/reset-password";
import AuthLayout from "@/components/AuthLayout";
export default function ResetPasswordPage({ searchParams }) {
  const { resetToken } = searchParams;
  return (
    <AuthLayout>
      <ResetPassword token={resetToken} />
    </AuthLayout>
  );
}
