import { auth } from "@/auth";
import { BASE_URL } from "@/services/serverApi";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const session = await auth();
  const token = session?.user?.accessToken;

  const response = await fetch(`${BASE_URL}policy-hub-templates/${params.id}/export-pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return NextResponse.json({ success: false }, { status: response.status });
  }

  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        `attachment; filename=template-${params.id}.pdf`,
    },
  });
}
