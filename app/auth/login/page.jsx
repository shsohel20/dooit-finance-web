import { LoginForm } from "@/components/login-form";
import AuthLayout from "@/components/AuthLayout";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
