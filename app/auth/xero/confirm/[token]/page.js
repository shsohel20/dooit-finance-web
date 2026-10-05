import { auth } from "@/auth";
import AuthLayout from "@/components/AuthLayout";
import { getXeroConnectionRequest } from "@/app/auth/xero/actions";
import ConfirmXeroConnection from "@/views/auth/xero/confirm";

export const metadata = { title: "Confirm Xero connection" };

// Opened from the approval email sent to the client's registered address.
// `/auth/*` is public, so signed-out visitors can read the request (and reject
// it); approving needs a signed-in administrator, enforced by the API.
export default async function ConfirmXeroPage({ params, searchParams }) {
  const { token } = await params;
  const query = await searchParams;
  const [session, res] = await Promise.all([auth(), getXeroConnectionRequest(token)]);

  return (
    <AuthLayout>
      <ConfirmXeroConnection
        token={token}
        request={res.ok ? res.data : null}
        error={res.ok ? null : res.error}
        signedIn={!!session?.user?.accessToken}
        intent={query?.action === "reject" ? "reject" : "approve"}
      />
    </AuthLayout>
  );
}
