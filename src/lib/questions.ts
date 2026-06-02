import questions from '@/data/questions.json';

export type QuestionData = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type QuestionBank = Record<string, QuestionData[]>;

export const questionBank = questions as QuestionBank;

export function getTopics() {
  return Object.keys(questionBank);
}

export function getTopicName(key: string): string {
  const names: Record<string, string> = {
    jaringan_komputer: "Jaringan Komputer",
    database: "Database",
    keamanan_informasi: "Keamanan Informasi",
    sistem_operasi: "Sistem Operasi",
    pemrograman_teori: "Pemrograman (Teori)",
    hardware: "Hardware",
  };
  return names[key] || key;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
