import { LoginForm } from "@/components/login-form";
import AuthLayout from "@/components/AuthLayout";

export default async function LoginPage({ searchParams }) {
  const token = await searchParams?.token;
  const cid = await searchParams?.cid;

  return (
    <AuthLayout>
      <LoginForm token={token} cid={cid} />
    </AuthLayout>
  );
}
