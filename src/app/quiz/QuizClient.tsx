"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { questionBank, getTopicName, shuffleArray } from "@/lib/questions";
import { addResult } from "@/lib/storage";
import Link from "next/link";

const TIME_PER_QUESTION = 90; // seconds

export default function QuizClient() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const mode = searchParams.get("mode");

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

  // Initialize quiz
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

  // Timer
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

      const finalCorrect = correct + (showResult && selectedAnswer === questions[currentIndex]?.answer ? 0 : 0);

      setShowResult(false);
      setSelectedAnswer(null);

      if (currentIndex + 1 >= questions.length) {
        setIsFinished(true);
        addResult({
          id: Date.now().toString(),
          date: new Date().toLocaleString("id-ID"),
          mode: mode === "all" ? "Simulasi Lengkap" : getTopicName(topic || ""),
          topic: topic || undefined,
          total: questions.length,
          correct: finalCorrect,
          questions: [...results],
        });
        return;
      }

      setCurrentIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
    },
    [currentIndex, questions, correct, showResult, selectedAnswer, results, topic, mode]
  );

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Finished state
  if (isFinished) {
    const accuracy = questions.length > 0 ? (correct / questions.length) * 100 : 0;
    const passing = 60;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">📊 Hasil Latihan</h1>

          <div className="text-6xl font-bold mb-4">
            <span className={accuracy >= passing ? "text-green-500" : "text-red-500"}>
              {accuracy.toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{correct}</div>
              <div className="text-xs text-green-700">Benar</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{questions.length - correct}</div>
              <div className="text-xs text-red-700">Salah</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-xs text-blue-700">Total</div>
            </div>
          </div>

          <div
            className={`inline-block px-6 py-2 rounded-full text-white font-semibold mb-6 ${
              accuracy >= passing ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {accuracy >= passing ? "✅ LULUS" : "❌ BELUM LULUS"}
          </div>

          <p className="text-sm text-gray-500 mb-6">Passing grade: {passing}%</p>

          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              ← Kembali
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Ulangi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No questions loaded
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Memuat soal...</p>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
          ← Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-800">
            {mode === "all" ? "Simulasi Lengkap" : getTopicName(topic || "")}
          </h1>
          <p className="text-sm text-gray-500">
            Soal {currentIndex + 1} dari {questions.length}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-mono font-bold ${
            timeLeft <= 10
              ? "bg-red-100 text-red-600"
              : timeLeft <= 30
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-lg text-gray-800 mb-6">{currentQ.q}</p>

        <div className="space-y-3">
          {currentQ.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            let className = "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ";

            if (showResult) {
              if (i === currentQ.answer) {
                className += "border-green-500 bg-green-50 text-green-800";
              } else if (i === selectedAnswer) {
                className += "border-red-500 bg-red-50 text-red-800";
              } else {
                className += "border-gray-200 text-gray-400";
              }
            } else {
              className += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer";
            }

            return (
              <button key={i} onClick={() => handleAnswer(i)} className={className} disabled={showResult}>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    showResult && i === currentQ.answer
                      ? "bg-green-500 text-white"
                      : showResult && i === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-semibold text-blue-800 mb-1">💡 Pembahasan:</p>
            <p className="text-sm text-blue-700">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      {showResult && (
        <button
          onClick={() => handleNext()}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {currentIndex + 1 >= questions.length ? "Lihat Hasil" : "Soal Berikutnya →"}
        </button>
      )}
    </div>
  );
}
