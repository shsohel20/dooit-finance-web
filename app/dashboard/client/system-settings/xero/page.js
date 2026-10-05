import { Suspense } from "react";

import XeroSettings from "@/views/xero";

export const metadata = { title: "Xero | System Settings" };

export default function XeroPage() {
  // The view reads `?xero=` (set by the API's OAuth callback redirect).
  return (
    <Suspense fallback={null}>
      <XeroSettings />
    </Suspense>
  );
}
