"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formasiList, type FormasiConfig } from "@/lib/formasi";
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

  const totalQuestions = selectedFormasi
    ? Object.values(getQuestionBank(selectedFormasi.id)).reduce((s, q) => s + q.length, 0)
    : formasiList.reduce((total, f) => {
        return total + Object.values(getQuestionBank(f.id)).reduce((s, q) => s + q.length, 0);
      }, 0);

  const totalTopics = formasiList.reduce(
    (total, f) => total + f.topics.length, 0
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-8 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
          Simulasi CAT SKB CPNS
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Latihan SKB CPNS
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-md mx-auto mb-2">
          Pilih formasi, latihan sesuai bidang
        </p>
        <p className="text-sm text-[var(--muted)]">
          {formasiList.length} formasi • {totalTopics} topik • {totalQuestions} soal
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
          <div className="flex items-center gap-2">
            <button onClick={saveEmail} className="btn-primary">
              {email ? "✓" : "Connect"}
            </button>
          </div>
        </div>
        {email && (
          <p className="text-xs text-[var(--muted)] mt-2 ml-12 font-mono">
            Syncing as {email}
          </p>
        )}
      </section>

      {/* Formasi Selection */}
      <section>
        <h2 className="font-semibold text-lg mb-4">Pilih Formasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {formasiList.map((f) => {
            const qBank = getQuestionBank(f.id);
            const topicCount = f.topics.length;
            const questionCount = Object.values(qBank).reduce((s, q) => s + q.length, 0);
            const isSelected = selectedFormasi?.id === f.id;

            return (
              <button
                key={f.id}
                onClick={() => selectFormasi(f)}
                className={`card p-5 text-left group transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-lg"
                    : "hover:border-[var(--primary)] hover:shadow-md"
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
                      <span className="text-xs text-[var(--muted)]">{topicCount} topik</span>
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
              Topik — {selectedFormasi.name}
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

      {/* CTA */}
      {!selectedFormasi && (
        <section className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <div className="card p-8 text-center border-2 border-dashed border-[var(--card-border)]">
            <div className="text-3xl mb-3">👆</div>
            <h2 className="text-xl font-bold mb-1.5">Pilih formasi di atas</h2>
            <p className="text-sm text-[var(--muted)]">
              Klik salah satu formasi untuk melihat topik latihan
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
