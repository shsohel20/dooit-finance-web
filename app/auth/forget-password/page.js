import AuthLayout from "@/components/AuthLayout";
import ForgetPassword from "@/views/auth/forget-password";
import React from "react";

export default function ForgetPasswordPage() {
  return (
    <div>
      <AuthLayout>
        <ForgetPassword />
      </AuthLayout>
    </div>
  );
}
