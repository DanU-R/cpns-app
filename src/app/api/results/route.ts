import { NextResponse } from "next/server";
import { saveResult } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await saveResult(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save result error:", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}
