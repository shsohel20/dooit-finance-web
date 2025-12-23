"use client";
import { LoginForm } from "@/components/login-form";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage({ searchParams }) {
  const token = searchParams?.token;
  const cid = searchParams?.cid;

  return (
    <AuthLayout>
      <LoginForm token={token} cid={cid} />
    </AuthLayout>
  );
}
