import { UserProgress, QuizResult } from './types';

const STORAGE_KEY = 'cpns-progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return { history: [] };
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { history: [] };
  } catch {
    return { history: [] };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addResult(result: QuizResult): void {
  const progress = getProgress();
  progress.history.push(result);
  saveProgress(progress);
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getStats() {
  const progress = getProgress();
  const totalSessions = progress.history.length;
  const totalQuestions = progress.history.reduce((sum, s) => sum + s.total, 0);
  const totalCorrect = progress.history.reduce((sum, s) => sum + s.correct, 0);
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Per-topic stats
  const topicStats: Record<string, { correct: number; total: number }> = {};
  for (const session of progress.history) {
    for (const q of session.questions) {
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
      topicStats[q.topic].total++;
      if (q.correct) topicStats[q.topic].correct++;
    }
  }

  return {
    totalSessions,
    totalQuestions,
    totalCorrect,
    accuracy,
    topicStats,
    recentSessions: progress.history.slice(-5),
  };
}
