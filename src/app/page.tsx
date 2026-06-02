import Link from "next/link";
import { questionBank, getTopicName } from "@/lib/questions";
import { getStats as getLocalStats } from "@/lib/storage";

export default function Home() {
  const localStats = getLocalStats();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Latihan SKB CPNS</h1>
        <p className="text-indigo-100 text-lg">Pranata Komputer</p>
        <p className="text-indigo-200 mt-2 text-sm">
          Simulasi CAT dengan soal teori IT, timer, dan pembahasan
        </p>
      </div>

      {/* Email sync banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">☁️ Sinkronisasi Cloud (Turso)</p>
        <p className="text-amber-700">
          Tambahkan <code className="bg-amber-100 px-1 rounded">?email=kamu@email.com</code> di URL untuk sync progress ke cloud.
          <br />
          Contoh: <code className="bg-amber-100 px-1 rounded">/quiz?mode=all&email=test@mail.com</code>
        </p>
      </div>

      {/* Quick Stats */}
      {localStats.totalSessions > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">📊 Ringkasan Progress (Lokal)</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{localStats.totalSessions}</div>
              <div className="text-sm text-gray-500">Sesi Latihan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{localStats.accuracy.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">Akurasi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{localStats.totalQuestions}</div>
              <div className="text-sm text-gray-500">Soal Dikerjakan</div>
            </div>
          </div>
        </div>
      )}

      {/* Topic Cards */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-4">📚 Pilih Topik Latihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(questionBank).map(([key, questions]) => (
            <Link
              key={key}
              href={`/quiz?topic=${key}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{getTopicName(key)}</h3>
                  <p className="text-sm text-gray-500 mt-1">{questions.length} soal</p>
                </div>
                <span className="text-indigo-500 text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Full Simulation */}
      <div>
        <Link
          href="/quiz?mode=all"
          className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-bold mb-1">🎯 Simulasi SKB Lengkap</h2>
          <p className="text-green-100 text-sm">
            Semua topik acak • {Object.values(questionBank).reduce((s, q) => s + q.length, 0)} soal
          </p>
        </Link>
      </div>
    </div>
  );
}
