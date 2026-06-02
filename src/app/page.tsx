"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formasiList, skdList, skbList, type FormasiConfig } from "@/lib/formasi";
import { getQuestionBank } from "@/lib/questions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [selectedFormasi, setSelectedFormasi] = useState<FormasiConfig | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cpns-email");
    if (saved) setEmail(saved);
    const savedFormasi = localStorage.getItem("cpns-formasi");
    if (savedFormasi) {
      const f = formasiList.find((x) => x.id === savedFormasi);
      if (f) setSelectedFormasi(f);
    }
  }, []);

  const saveEmail = () => {
    if (email) localStorage.setItem("cpns-email", email);
    else localStorage.removeItem("cpns-email");
  };

  const selectFormasi = (f: FormasiConfig) => {
    const next = selectedFormasi?.id === f.id ? null : f;
    setSelectedFormasi(next);
    if (next) localStorage.setItem("cpns-formasi", next.id);
    else localStorage.removeItem("cpns-formasi");
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-8 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
          Simulasi CAT CPNS
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Latihan SKD & SKB
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-md mx-auto mb-2">
          SKD: TWK • TIU • TKP | SKB: Sesuai Formasi
        </p>
        <p className="text-sm text-[var(--muted)]">
          {formasiList.length} kategori • {formasiList.reduce((t, f) => t + f.topics.length, 0)} topik • {formasiList.reduce((t, f) => t + Object.values(getQuestionBank(f.id)).reduce((s, q) => s + q.length, 0), 0)} soal
        </p>
      </section>

      {/* Cloud Sync */}
      <section className="card p-5 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">☁️</div>
            <div className="flex-1">
              <input
                type="email"
                placeholder="Sync progress — email@kamu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input max-w-xs"
              />
            </div>
          </div>
          <button onClick={saveEmail} className="btn-primary">
            {email ? "✓" : "Connect"}
          </button>
        </div>
        {email && (
          <p className="text-xs text-[var(--muted)] mt-2 ml-12 font-mono">
            Syncing as {email}
          </p>
        )}
      </section>

      {/* SKD Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-xs">📝</div>
          <h2 className="font-semibold text-lg">SKD — Seleksi Kompetensi Dasar</h2>
          <span className="text-xs text-[var(--muted)] bg-[var(--muted-light)] px-2 py-0.5 rounded-full">Wajib semua peserta</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {skdList.map((f) => {
            const qBank = getQuestionBank(f.id);
            const questionCount = Object.values(qBank).reduce((s, q) => s + q.length, 0);
            const isSelected = selectedFormasi?.id === f.id;
            const colors: Record<string, string> = { twk: "text-blue-600 bg-blue-50", tiu: "text-purple-600 bg-purple-50", tkp: "text-rose-600 bg-rose-50" };

            return (
              <button
                key={f.id}
                onClick={() => selectFormasi(f)}
                className={`card p-5 text-left group transition-all duration-300 cursor-pointer ${
                  isSelected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-lg" : "hover:border-[var(--primary)] hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${colors[f.id] || "bg-[var(--muted-light)]"}`}>
                    {f.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{f.name}</h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{f.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--muted)]">{f.topics.length} topik</span>
                      <span className="text-xs text-[var(--muted)]">•</span>
                      <span className="text-xs text-[var(--muted)]">{questionCount} soal</span>
                    </div>
                  </div>
                  <span className={`text-lg transition-all ${isSelected ? "text-[var(--primary)] rotate-90" : "text-[var(--muted)] group-hover:text-[var(--primary)]"}`}>
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SKB Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-xs">🎯</div>
          <h2 className="font-semibold text-lg">SKB — Seleksi Kompetensi Bidang</h2>
          <span className="text-xs text-[var(--muted)] bg-[var(--muted-light)] px-2 py-0.5 rounded-full">Sesuai formasi</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skbList.map((f) => {
            const qBank = getQuestionBank(f.id);
            const questionCount = Object.values(qBank).reduce((s, q) => s + q.length, 0);
            const isSelected = selectedFormasi?.id === f.id;

            return (
              <button
                key={f.id}
                onClick={() => selectFormasi(f)}
                className={`card p-5 text-left group transition-all duration-300 cursor-pointer ${
                  isSelected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-lg" : "hover:border-[var(--primary)] hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--muted-light)] rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform shrink-0">
                    {f.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{f.name}</h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{f.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--muted)]">{f.topics.length} topik</span>
                      <span className="text-xs text-[var(--muted)]">•</span>
                      <span className="text-xs text-[var(--muted)]">{questionCount} soal</span>
                    </div>
                  </div>
                  <span className={`text-lg transition-all ${isSelected ? "text-[var(--primary)] rotate-90" : "text-[var(--muted)] group-hover:text-[var(--primary)]"}`}>
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Topics for selected formasi */}
      {selectedFormasi && (
        <section className="animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">
              {selectedFormasi.icon} Topik — {selectedFormasi.name}
            </h2>
            <Link
              href={`/quiz?formasi=${selectedFormasi.id}&mode=all${email ? `&email=${encodeURIComponent(email)}` : ""}`}
              className="btn-primary text-sm"
            >
              Semua Topik →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedFormasi.topics.map((topic) => {
              const qBank = getQuestionBank(selectedFormasi.id);
              const questions = qBank[topic.key] || [];

              return (
                <Link
                  key={topic.key}
                  href={`/quiz?formasi=${selectedFormasi.id}&topic=${topic.key}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
                  className="card p-4 group hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[var(--muted-light)] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{topic.name}</h3>
                      <p className="text-xs text-[var(--muted)]">{questions.length} soal</p>
                    </div>
                    <span className="text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
