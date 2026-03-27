import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const data = getAnalytics();
  return NextResponse.json(data);
}
