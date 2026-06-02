import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-[var(--muted)]">
          <div className="animate-spin w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm">Memuat...</p>
        </div>
      }
    >
      <QuizClient />
    </Suspense>
  );
}
