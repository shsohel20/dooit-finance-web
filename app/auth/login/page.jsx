import { LoginForm } from "@/components/login-form";
import AuthLayout from "@/components/AuthLayout";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  const token = params?.token;
  const cid = params?.cid;

  return (
    <AuthLayout>
      <LoginForm token={token} cid={cid} />
    </AuthLayout>
  );
}
