import AuthLayout from "@/components/AuthLayout";
import XeroSignup from "@/views/auth/xero";

export const metadata = { title: "Sign up with Xero" };

// Landing page for three entry points:
//   /auth/xero                  → starts the flow (also the Xero App Store launch URL)
//   /auth/xero?ticket=…         → API callback for a NEW visitor → pre-filled form
//   /auth/xero?pending=…        → org already belongs to a client → waiting for its admin's approval
//   /auth/xero?error=…          → something went wrong / cancelled
export default async function XeroPage({ searchParams }) {
  const params = await searchParams;
  return (
    <AuthLayout>
      <XeroSignup
        ticket={params?.ticket}
        loginCode={params?.loginCode}
        pending={params?.pending}
        error={params?.error}
        message={params?.message}
      />
    </AuthLayout>
  );
}
