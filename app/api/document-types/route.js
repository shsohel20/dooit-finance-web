import { NextResponse } from "next/server";

const DOCUMENT_TYPES_URL = "http://31.97.71.194:5053/api/v1/document-types";

export async function GET() {
  try {
    const response = await fetch(DOCUMENT_TYPES_URL, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (!response.ok) throw new Error("Upstream error");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    // return a minimal fallback so the UI never breaks
    return NextResponse.json({ document_types: [], total: 0 }, { status: 200 });
  }
}
