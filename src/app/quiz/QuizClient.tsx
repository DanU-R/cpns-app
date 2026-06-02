"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { questionBank, getTopicName, shuffleArray } from "@/lib/questions";
import { addResult as addLocalResult } from "@/lib/storage";
import Link from "next/link";

const TIME_PER_QUESTION = 90;

export default function QuizClient() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const mode = searchParams.get("mode");
  const urlEmail = searchParams.get("email");
  const email = urlEmail || (typeof window !== "undefined" ? localStorage.getItem("cpns-email") || "" : "");

  const [questions, setQuestions] = useState<
    { q: string; options: string[]; answer: number; explanation: string; topic: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<{ topic: string; correct: boolean; question: string }[]>([]);

  useEffect(() => {
    let allQuestions: { q: string; options: string[]; answer: number; explanation: string; topic: string }[] = [];

    if (mode === "all") {
      for (const [topicKey, qs] of Object.entries(questionBank)) {
        for (const q of qs) {
          allQuestions.push({ ...q, topic: topicKey });
        }
      }
      allQuestions = shuffleArray(allQuestions);
    } else if (topic && questionBank[topic]) {
      allQuestions = questionBank[topic].map((q) => ({ ...q, topic }));
      allQuestions = shuffleArray(allQuestions);
    }

    setQuestions(allQuestions);
    setTimeLeft(TIME_PER_QUESTION);
  }, [topic, mode]);

  useEffect(() => {
    if (isFinished || showResult || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleNext(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isFinished, showResult, questions.length]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === questions[currentIndex].answer;
    if (isCorrect) setCorrect((c) => c + 1);

    setResults((prev) => [
      ...prev,
      {
        topic: questions[currentIndex].topic,
        correct: isCorrect,
        question: questions[currentIndex].q.substring(0, 50),
      },
    ]);
  };

  const handleNext = useCallback(
    (timedOut = false) => {
      if (!showResult && !timedOut) return;

      setShowResult(false);
      setSelectedAnswer(null);

      if (currentIndex + 1 >= questions.length) {
        setIsFinished(true);
        const resultData = {
          id: Date.now().toString(),
          email: email || undefined,
          date: new Date().toLocaleString("id-ID"),
          mode: mode === "all" ? "Simulasi Lengkap" : getTopicName(topic || ""),
          topic: topic || undefined,
          total: questions.length,
          correct,
          questions: [...results],
        };
        addLocalResult(resultData);
        fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultData),
        }).catch(() => {});
        return;
      }

      setCurrentIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
    },
    [currentIndex, questions, correct, showResult, selectedAnswer, results, topic, mode, email]
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Finished
  if (isFinished) {
    const accuracy = questions.length > 0 ? (correct / questions.length) * 100 : 0;
    const passing = 60;
    const passed = accuracy >= passing;

    return (
      <div className="max-w-lg mx-auto text-center animate-fadeIn">
        <div className="card p-10">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${passed ? "bg-[var(--success-light)]" : "bg-[var(--danger-light)]"}`}>
            {passed ? "✅" : "❌"}
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {passed ? "Lulus!" : "Belum Lulus"}
          </h1>
          <p className="text-[var(--muted)] text-sm mb-6">
            Passing grade: {passing}%
          </p>

          <div className="text-5xl font-bold mb-8">
            <span className={passed ? "text-[var(--success)]" : "text-[var(--danger)]"}>
              {accuracy.toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-[var(--success-light)] rounded-xl p-3">
              <div className="text-xl font-bold text-[var(--success)]">{correct}</div>
              <div className="text-xs text-[var(--muted)]">Benar</div>
            </div>
            <div className="bg-[var(--danger-light)] rounded-xl p-3">
              <div className="text-xl font-bold text-[var(--danger)]">{questions.length - correct}</div>
              <div className="text-xs text-[var(--muted)]">Salah</div>
            </div>
            <div className="bg-[var(--muted-light)] rounded-xl p-3">
              <div className="text-xl font-bold text-[var(--muted)]">{questions.length}</div>
              <div className="text-xs text-[var(--muted)]">Total</div>
            </div>
          </div>

          {email && (
            <p className="text-xs text-[var(--muted)] mb-6 font-mono">
              ☁️ Disimpan ke cloud ({email})
            </p>
          )}

          <div className="flex gap-3">
            <Link href="/" className="btn-ghost flex-1">
              ← Beranda
            </Link>
            <button onClick={() => window.location.reload()} className="btn-primary flex-1">
              Ulangi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm">Memuat soal...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-medium">
            {mode === "all" ? "Simulasi Lengkap" : getTopicName(topic || "")}
          </p>
          <p className="text-sm font-medium mt-0.5">
            Soal {currentIndex + 1} <span className="text-[var(--muted)]">/ {questions.length}</span>
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-medium ${timeLeft <= 10 ? "bg-[var(--danger-light)] text-[var(--danger)]" : timeLeft <= 30 ? "bg-[var(--warning-light)] text-[var(--warning)]" : "bg-[var(--success-light)] text-[var(--success)]"}`}>
          <span>⏱</span>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-[var(--muted-light)] rounded-full h-1.5 mb-8">
        <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="card p-6 md:p-8 mb-6">
        <p className="text-lg md:text-xl font-medium leading-relaxed mb-8">{currentQ.q}</p>

        <div className="space-y-3">
          {currentQ.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isCorrect = i === currentQ.answer;
            const isSelected = i === selectedAnswer;

            let baseClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ";

            if (showResult) {
              if (isCorrect) baseClass += "border-[var(--success)] bg-[var(--success-light)] ";
              else if (isSelected) baseClass += "border-[var(--danger)] bg-[var(--danger-light)] ";
              else baseClass += "border-[var(--card-border)] opacity-40 ";
            } else {
              baseClass += "border-[var(--card-border)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)] cursor-pointer ";
            }

            return (
              <button key={i} onClick={() => handleAnswer(i)} className={baseClass} disabled={showResult}>
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                  showResult && isCorrect ? "bg-[var(--success)] text-white" :
                  showResult && isSelected ? "bg-[var(--danger)] text-white" :
                  "bg-[var(--muted-light)] text-[var(--muted)]"
                }`}>
                  {letter}
                </span>
                <span className="text-sm md:text-base">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-fadeIn">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Pembahasan</p>
            <p className="text-sm text-blue-800 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Next */}
      {showResult && (
        <button onClick={() => handleNext()} className="w-full btn-primary py-3.5 text-base">
          {currentIndex + 1 >= questions.length ? "Lihat Hasil" : "Soal Berikutnya →"}
        </button>
      )}
    </div>
  );
}
