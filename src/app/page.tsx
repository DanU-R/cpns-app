"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { questionBank, getTopicName } from "@/lib/questions";
import { getStats as getLocalStats } from "@/lib/storage";

const topicIcons: Record<string, string> = {
  jaringan_komputer: "🌐",
  database: "🗄️",
  keamanan_informasi: "🔒",
  sistem_operasi: "💻",
  pemrograman_teori: "📝",
  hardware: "🔧",
};

export default function Home() {
  const localStats = getLocalStats();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cpns-email");
    if (saved) setEmail(saved);
  }, []);

  const saveEmail = () => {
    if (email) {
      localStorage.setItem("cpns-email", email);
    } else {
      localStorage.removeItem("cpns-email");
    }
  };

  const totalQuestions = Object.values(questionBank).reduce((s, q) => s + q.length, 0);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-8 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
          Simulasi CAT BKN
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Latihan SKB CPNS
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-md mx-auto mb-2">
          Pranata Komputer
        </p>
        <p className="text-sm text-[var(--muted)]">
          {Object.keys(questionBank).length} topik • {totalQuestions} soal • Timer & pembahasan
        </p>
      </section>

      {/* Cloud Sync */}
      <section className="card p-6 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center text-base">
                ☁️
              </div>
              <h2 className="font-semibold">Cloud Sync</h2>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Simpan progress ke cloud, akses dari device mana saja.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@kamu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input max-w-xs"
              />
              <button onClick={saveEmail} className="btn-primary">
                {email ? "✓ Active" : "Connect"}
              </button>
            </div>
            {email && (
              <p className="text-xs text-[var(--muted)] mt-2 font-mono">
                Syncing as {email}
              </p>
            )}
          </div>
          {email && (
            <div className="badge badge-success">Connected</div>
          )}
        </div>
      </section>

      {/* Stats Overview */}
      {localStats.totalSessions > 0 && (
        <section className="grid grid-cols-3 gap-4 animate-fadeIn" style={{ animationDelay: "0.15s" }}>
          {[
            { label: "Sesi", value: localStats.totalSessions, color: "text-[var(--primary)]" },
            { label: "Akurasi", value: `${localStats.accuracy.toFixed(0)}%`, color: localStats.accuracy >= 70 ? "text-[var(--success)]" : "text-[var(--warning)]" },
            { label: "Soal", value: localStats.totalQuestions, color: "text-[var(--muted)]" },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{stat.label}</div>
            </div>
          ))}
        </section>
      )}

      {/* Topics */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">Topik Latihan</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(questionBank).map(([key, questions]) => (
            <Link
              key={key}
              href={`/quiz?topic=${key}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
              className="card p-5 group hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[var(--muted-light)] rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  {topicIcons[key] || "📖"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{getTopicName(key)}</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{questions.length} soal</p>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
        <Link
          href={`/quiz?mode=all${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          className="block card p-8 text-center group hover:shadow-xl transition-all duration-300 border-2 border-dashed hover:border-[var(--primary)] hover:border-solid"
        >
          <div className="text-3xl mb-3">🎯</div>
          <h2 className="text-xl font-bold mb-1.5">Simulasi Lengkap</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Semua topik diacak • {totalQuestions} soal • Passing grade 60%
          </p>
          <span className="btn-primary inline-block">
            Mulai Simulasi →
          </span>
        </Link>
      </section>
    </div>
  );
}
