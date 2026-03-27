import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

// Called by the client to track a page view
export async function POST() {
  try {
    await trackPageView();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
