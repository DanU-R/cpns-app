import { NextResponse } from "next/server";
import { saveResult } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await saveResult(body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save result error:", error?.message || error);
    // Return success anyway so localStorage still works
    return NextResponse.json({ success: true, note: "DB unavailable, using local only" });
  }
}
