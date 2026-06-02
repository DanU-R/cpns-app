import { NextResponse } from "next/server";
import { getStats } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || undefined;
    const stats = await getStats(email);
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Get stats error:", error?.message || error);
    return NextResponse.json({
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      topicStats: [],
      recentSessions: [],
      note: "DB unavailable",
    });
  }
}
