"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getStats as getLocalStats, clearProgress } from "@/lib/storage";
import { getTopicName } from "@/lib/questions";
import { formasiList, getFormasi } from "@/lib/formasi";
import Link from "next/link";

interface CloudStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  topicStats: { topic: string; total: number; correct: number }[];
  recentSessions: { id: string; email: string | null; date: string; mode: string; topic: string | null; total: number; correct: number; formasi?: string }[];
}

const topicIcons: Record<string, string> = {
  jaringan_komputer: "🌐", database: "🗄️", keamanan_informasi: "🔒",
  sistem_operasi: "⚙️", pemrograman_teori: "📝", hardware: "🔧",
  pedagogik: "📚", kepribadian_guru: "🧠", sosial: "🤝",
  profesional: "📋", kurikulum: "📐",
  kesehatan_masyarakat: "🏘️", farmasi: "💊", keperawatan: "🩺",
  gizi: "🥗", epidemiologi: "🔬",
  kebijakan_publik: "🏛️", hukum_administrasi: "⚖️", riset_kebijakan: "📈",
  statistik: "📉", manajemen_publik: "🏢",
  ilmu_perpustakaan: "📚", klasifikasi: "🗂️", layanan_informasi: "🔍",
  ti_perpustakaan: "💾", manajemen_koleksi: "📦",
  audit_keuangan: "💰", audit_kinerja: "📊", spip: "🛡️",
  peraturan_bpkp: "📜", standar_audit: "✅",
};

export default function StatsClient() {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");
  const urlFormasi = searchParams.get("formasi");
  const email = urlEmail || (typeof window !== "undefined" ? localStorage.getItem("cpns-email") || "" : "");
  const [filterFormasi, setFilterFormasi] = useState(urlFormasi || "all");
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

  // Filter sessions by formasi
  const filterByFormasi = (sessions: any[]) => {
    if (filterFormasi === "all") return sessions;
    return sessions.filter((s) => s.formasi === filterFormasi);
  };

  const filteredSessions = filterByFormasi(localStats.recentSessions || []);
  const filteredTopicStats = filterFormasi === "all"
    ? localStats.topicStats
    : Object.fromEntries(
        Object.entries(localStats.topicStats).filter(([key]) => {
          const formasi = getFormasi(filterFormasi);
          return formasi?.topics.some((t) => t.key === key);
        })
      );

  const totalFiltered = filteredSessions.reduce((s, r) => s + r.total, 0);
  const correctFiltered = filteredSessions.reduce((s, r) => s + r.correct, 0);
  const accuracyFiltered = totalFiltered > 0 ? (correctFiltered / totalFiltered) * 100 : 0;

  const displayStats = {
    totalSessions: filteredSessions.length,
    totalQuestions: totalFiltered,
    totalCorrect: correctFiltered,
    topicStats: Object.entries(filteredTopicStats).map(([topic, s]: [string, any]) => ({ topic, ...s })),
    recentSessions: filteredSessions,
  };

  const isCloud = !!cloudStats;

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

      {/* Formasi filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterFormasi("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            filterFormasi === "all" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-light)] text-[var(--muted)] hover:bg-[var(--card-border)]"
          }`}
        >
          Semua
        </button>
        {formasiList.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterFormasi(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filterFormasi === f.id ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-light)] text-[var(--muted)] hover:bg-[var(--card-border)]"
            }`}
          >
            {f.icon} {f.name}
          </button>
        ))}
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
          <p className="text-[var(--muted)] mb-4">
            {filterFormasi !== "all" ? `Belum ada riwayat untuk ${getFormasi(filterFormasi)?.name}` : "Belum ada riwayat latihan"}
          </p>
          <Link href="/" className="btn-primary inline-block">Mulai Latihan →</Link>
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
              { label: "Akurasi", value: `${accuracyFiltered.toFixed(0)}%`, color: accuracyFiltered >= 70 ? "text-[var(--success)]" : accuracyFiltered >= 50 ? "text-[var(--warning)]" : "text-[var(--danger)]" },
            ].map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-[var(--muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Topic breakdown */}
          {displayStats.topicStats.length > 0 && (
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
          {displayStats.recentSessions.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Riwayat</h2>
              <div className="space-y-1">
                {displayStats.recentSessions.slice(0, 10).map((session) => {
                  const acc = session.total > 0 ? (session.correct / session.total) * 100 : 0;
                  const sessionFormasi = getFormasi(session.formasi || "");
                  return (
                    <div key={session.id} className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0">
                      <div>
                        <p className="text-sm font-medium">
                          {sessionFormasi?.icon} {session.mode}
                        </p>
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
