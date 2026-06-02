"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getStats as getLocalStats, clearProgress } from "@/lib/storage";
import { getTopicName } from "@/lib/questions";
import Link from "next/link";

interface CloudStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  topicStats: { topic: string; total: number; correct: number }[];
  recentSessions: { id: string; email: string | null; date: string; mode: string; topic: string | null; total: number; correct: number }[];
}

const topicIcons: Record<string, string> = {
  jaringan_komputer: "🌐",
  database: "🗄️",
  keamanan_informasi: "🔒",
  sistem_operasi: "💻",
  pemrograman_teori: "📝",
  hardware: "🔧",
};

export default function StatsClient() {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");
  const email = urlEmail || (typeof window !== "undefined" ? localStorage.getItem("cpns-email") || "" : "");
  const [cloudStats, setCloudStats] = useState<CloudStats | null>(null);
  const [loading, setLoading] = useState(false);

  const localStats = getLocalStats();

  useEffect(() => {
    if (email) {
      setLoading(true);
      fetch(`/api/stats?email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((data) => {
          setCloudStats(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [email]);

  const handleClearLocal = () => {
    if (confirm("Reset semua progress lokal?")) {
      clearProgress();
      window.location.reload();
    }
  };

  const displayStats = cloudStats || { ...localStats, topicStats: Object.entries(localStats.topicStats).map(([topic, s]) => ({ topic, ...s })), recentSessions: localStats.recentSessions };
  const isCloud = !!cloudStats;
  const accuracy = displayStats.totalQuestions > 0 ? (displayStats.totalCorrect / displayStats.totalQuestions) * 100 : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Statistik</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {isCloud ? `Cloud (${email})` : "Lokal"}
          </p>
        </div>
        {!isCloud && localStats.totalSessions > 0 && (
          <button onClick={handleClearLocal} className="text-sm text-[var(--danger)] hover:underline">
            Reset
          </button>
        )}
      </div>

      {!email && (
        <div className="card p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">☁️</div>
          <div>
            <p className="text-sm font-medium">Lihat statistik cloud</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Isi email di <Link href="/" className="text-[var(--primary)] hover:underline">beranda</Link> untuk sync.</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-[var(--muted)]">Memuat statistik cloud...</p>
        </div>
      )}

      {displayStats.totalSessions === 0 && !loading && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-[var(--muted)] mb-4">Belum ada riwayat latihan</p>
          <Link href="/quiz?mode=all" className="btn-primary inline-block">Mulai Latihan →</Link>
        </div>
      )}

      {displayStats.totalSessions > 0 && !loading && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Sesi", value: displayStats.totalSessions, color: "text-[var(--primary)]" },
              { label: "Soal", value: displayStats.totalQuestions, color: "text-[var(--muted)]" },
              { label: "Benar", value: displayStats.totalCorrect, color: "text-[var(--success)]" },
              { label: "Akurasi", value: `${accuracy.toFixed(0)}%`, color: accuracy >= 70 ? "text-[var(--success)]" : accuracy >= 50 ? "text-[var(--warning)]" : "text-[var(--danger)]" },
            ].map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-[var(--muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Topic breakdown */}
          {displayStats.topicStats && displayStats.topicStats.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Per Topik</h2>
              <div className="space-y-4">
                {displayStats.topicStats
                  .sort((a, b) => b.total - a.total)
                  .map((s) => {
                    const acc = s.total > 0 ? (s.correct / s.total) * 100 : 0;
                    return (
                      <div key={s.topic} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[var(--muted-light)] rounded-lg flex items-center justify-center text-sm shrink-0">
                          {topicIcons[s.topic] || "📖"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium truncate">{getTopicName(s.topic)}</span>
                            <span className="text-xs text-[var(--muted)] font-mono ml-2">{s.correct}/{s.total}</span>
                          </div>
                          <div className="w-full bg-[var(--muted-light)] rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${acc >= 70 ? "bg-[var(--success)]" : acc >= 50 ? "bg-[var(--warning)]" : "bg-[var(--danger)]"}`}
                              style={{ width: `${acc}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-semibold w-12 text-right ${acc >= 70 ? "text-[var(--success)]" : acc >= 50 ? "text-[var(--warning)]" : "text-[var(--danger)]"}`}>
                          {acc.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Recent sessions */}
          {displayStats.recentSessions && displayStats.recentSessions.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Riwayat</h2>
              <div className="space-y-1">
                {displayStats.recentSessions.slice(0, 10).map((session) => {
                  const acc = session.total > 0 ? (session.correct / session.total) * 100 : 0;
                  return (
                    <div key={session.id} className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0">
                      <div>
                        <p className="text-sm font-medium">{session.mode}</p>
                        <p className="text-xs text-[var(--muted)]">{session.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-[var(--muted)]">{session.correct}/{session.total}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${acc >= 70 ? "bg-[var(--success-light)] text-[var(--success)]" : acc >= 50 ? "bg-[var(--warning-light)] text-[var(--warning)]" : "bg-[var(--danger-light)] text-[var(--danger)]"}`}>
                          {acc.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
