import { NextResponse } from "next/server";
import { clearData } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await clearData(body.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear data error:", error);
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 });
  }
}
