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
    if (confirm("Yakin reset semua progress lokal?")) {
      clearProgress();
      window.location.reload();
    }
  };

  const displayStats = cloudStats || { ...localStats, topicStats: Object.entries(localStats.topicStats).map(([topic, s]) => ({ topic, ...s })), recentSessions: localStats.recentSessions };
  const isCloud = !!cloudStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          📊 Statistik Belajar {isCloud ? "(Cloud)" : "(Lokal)"}
        </h1>
        {!isCloud && localStats.totalSessions > 0 && (
          <button onClick={handleClearLocal} className="text-sm text-red-500 hover:text-red-700 underline">
            Reset Progress
          </button>
        )}
      </div>

      {!email && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">☁️ Lihat statistik cloud?</p>
          <p>Tambahkan <code className="bg-blue-100 px-1 rounded">?email=kamu@email.com</code> di URL.</p>
        </div>
      )}

      {loading && <div className="text-center py-8 text-gray-500">Memuat statistik cloud...</div>}

      {displayStats.totalSessions === 0 && !loading ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 text-lg mb-4">Belum ada riwayat latihan</p>
          <Link href="/quiz?mode=all" className="text-indigo-600 hover:underline">
            Mulai latihan sekarang →
          </Link>
        </div>
      ) : displayStats && !loading ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-indigo-600">{displayStats.totalSessions}</div>
              <div className="text-sm text-gray-500 mt-1">Total Sesi</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-purple-600">{displayStats.totalQuestions}</div>
              <div className="text-sm text-gray-500 mt-1">Soal Dikerjakan</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600">{displayStats.totalCorrect}</div>
              <div className="text-sm text-gray-500 mt-1">Benar</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold ${displayStats.totalQuestions > 0 && (displayStats.totalCorrect / displayStats.totalQuestions) * 100 >= 70 ? "text-green-500" : displayStats.totalQuestions > 0 && (displayStats.totalCorrect / displayStats.totalQuestions) * 100 >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                {displayStats.totalQuestions > 0 ? ((displayStats.totalCorrect / displayStats.totalQuestions) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Akurasi</div>
            </div>
          </div>

          {displayStats.topicStats && displayStats.topicStats.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4">Akurasi per Topik</h2>
              <div className="space-y-3">
                {displayStats.topicStats
                  .sort((a, b) => b.total - a.total)
                  .map((s) => {
                    const acc = s.total > 0 ? (s.correct / s.total) * 100 : 0;
                    const color = acc >= 70 ? "green" : acc >= 50 ? "yellow" : "red";
                    return (
                      <div key={s.topic} className="flex items-center gap-4">
                        <div className="w-48 text-sm text-gray-700 truncate">{getTopicName(s.topic)}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className={`bg-${color}-500 h-3 rounded-full transition-all`} style={{ width: `${acc}%` }} />
                        </div>
                        <div className="text-sm font-mono text-gray-600 w-24 text-right">
                          {s.correct}/{s.total} ({acc.toFixed(0)}%)
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {displayStats.recentSessions && displayStats.recentSessions.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4">Sesi Terbaru</h2>
              <div className="space-y-2">
                {displayStats.recentSessions.slice(0, 10).map((session) => {
                  const acc = session.total > 0 ? (session.correct / session.total) * 100 : 0;
                  return (
                    <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{session.date}</span>
                        <span className="text-sm font-medium text-gray-700">{session.mode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{session.correct}/{session.total}</span>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${acc >= 70 ? "bg-green-100 text-green-700" : acc >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
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
      ) : null}
    </div>
  );
}
