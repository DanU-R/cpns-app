import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

export async function saveResult(data: {
  id: string;
  email?: string;
  date: string;
  mode: string;
  topic?: string;
  total: number;
  correct: number;
  questions: { topic: string; correct: boolean; question: string }[];
}) {
  await db.execute({
    sql: `INSERT INTO quiz_results (id, email, date, mode, topic, total, correct)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [data.id, data.email || null, data.date, data.mode, data.topic || null, data.total, data.correct],
  });

  for (const q of data.questions) {
    await db.execute({
      sql: `INSERT INTO quiz_questions (result_id, topic, question, is_correct)
            VALUES (?, ?, ?, ?)`,
      args: [data.id, q.topic, q.question, q.correct ? 1 : 0],
    });
  }
}

export async function getStats(email?: string) {
  const whereClause = email ? "WHERE email = ?" : "";
  const args = email ? [email] : [];

  const totalResults = await db.execute({
    sql: `SELECT COUNT(*) as count FROM quiz_results ${whereClause}`,
    args,
  });

  const accuracy = await db.execute({
    sql: `SELECT 
            COALESCE(SUM(correct), 0) as total_correct,
            COALESCE(SUM(total), 0) as total_questions
          FROM quiz_results ${whereClause}`,
    args,
  });

  const topicStats = await db.execute({
    sql: `SELECT qq.topic, 
                 COUNT(*) as total, 
                 SUM(qq.is_correct) as correct
          FROM quiz_questions qq
          JOIN quiz_results qr ON qq.result_id = qr.id
          ${whereClause ? whereClause.replace("email", "qr.email") : ""}
          GROUP BY qq.topic
          ORDER BY total DESC`,
    args,
  });

  const recentSessions = await db.execute({
    sql: `SELECT id, email, date, mode, topic, total, correct 
          FROM quiz_results ${whereClause}
          ORDER BY date DESC LIMIT 20`,
    args,
  });

  return {
    totalSessions: Number(totalResults.rows[0]?.count || 0),
    totalCorrect: Number(accuracy.rows[0]?.total_correct || 0),
    totalQuestions: Number(accuracy.rows[0]?.total_questions || 0),
    topicStats: topicStats.rows.map((r) => ({
      topic: r.topic as string,
      total: Number(r.total),
      correct: Number(r.correct),
    })),
    recentSessions: recentSessions.rows.map((r) => ({
      id: r.id as string,
      email: r.email as string | null,
      date: r.date as string,
      mode: r.mode as string,
      topic: r.topic as string | null,
      total: Number(r.total),
      correct: Number(r.correct),
    })),
  };
}

export async function clearData(email?: string) {
  if (email) {
    const results = await db.execute({
      sql: "SELECT id FROM quiz_results WHERE email = ?",
      args: [email],
    });
    for (const row of results.rows) {
      await db.execute({
        sql: "DELETE FROM quiz_questions WHERE result_id = ?",
        args: [row.id as string],
      });
    }
    await db.execute({
      sql: "DELETE FROM quiz_results WHERE email = ?",
      args: [email],
    });
  } else {
    await db.execute("DELETE FROM quiz_questions");
    await db.execute("DELETE FROM quiz_results");
  }
}
