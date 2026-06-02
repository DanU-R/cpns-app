"use client";

import { useState, useEffect } from "react";
import { getStats, clearProgress } from "@/lib/storage";
import { getTopicName } from "@/lib/questions";
import Link from "next/link";

export default function StatsPage() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const handleClear = () => {
    if (confirm("Yakin reset semua progress?")) {
      clearProgress();
      setStats(getStats());
    }
  };

  if (!stats) return <div className="text-center py-12 text-gray-500">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📊 Statistik Belajar</h1>
        {stats.totalSessions > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-700 underline"
          >
            Reset Progress
          </button>
        )}
      </div>

      {/* Summary */}
      {stats.totalSessions === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 text-lg mb-4">Belum ada riwayat latihan</p>
          <Link href="/quiz?mode=all" className="text-indigo-600 hover:underline">
            Mulai latihan sekarang →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalSessions}</div>
              <div className="text-sm text-gray-500 mt-1">Total Sesi</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalQuestions}</div>
              <div className="text-sm text-gray-500 mt-1">Soal Dikerjakan</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalCorrect}</div>
              <div className="text-sm text-gray-500 mt-1">Benar</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div
                className={`text-3xl font-bold ${
                  stats.accuracy >= 70 ? "text-green-500" : stats.accuracy >= 50 ? "text-yellow-500" : "text-red-500"
                }`}
              >
                {stats.accuracy.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Akurasi</div>
            </div>
          </div>

          {/* Topic breakdown */}
          {Object.keys(stats.topicStats).length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4">Akurasi per Topik</h2>
              <div className="space-y-3">
                {Object.entries(stats.topicStats)
                  .sort((a, b) => b[1].total - a[1].total)
                  .map(([topic, s]) => {
                    const acc = s.total > 0 ? (s.correct / s.total) * 100 : 0;
                    const color = acc >= 70 ? "green" : acc >= 50 ? "yellow" : "red";
                    return (
                      <div key={topic} className="flex items-center gap-4">
                        <div className="w-48 text-sm text-gray-700 truncate">{getTopicName(topic)}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`bg-${color}-500 h-3 rounded-full transition-all`}
                            style={{ width: `${acc}%` }}
                          />
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

          {/* Recent sessions */}
          {stats.recentSessions.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4">5 Sesi Terakhir</h2>
              <div className="space-y-2">
                {stats.recentSessions.reverse().map((session) => {
                  const acc = session.total > 0 ? (session.correct / session.total) * 100 : 0;
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{session.date}</span>
                        <span className="text-sm font-medium text-gray-700">{session.mode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {session.correct}/{session.total}
                        </span>
                        <span
                          className={`text-sm font-bold px-2 py-0.5 rounded ${
                            acc >= 70 ? "bg-green-100 text-green-700" : acc >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}
                        >
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
