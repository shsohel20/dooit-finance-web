import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/login-form";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  const token = params?.token;
  const cid = params?.cid;

  return (
    <AuthLayout>
      <LoginForm token={token} cid={cid} type="dooit" />
    </AuthLayout>
  );
}
