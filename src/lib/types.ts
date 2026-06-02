export interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface QuestionWithTopic extends Question {
  topic: string;
}

export interface QuizResult {
  id: string;
  date: string;
  mode: string;
  topic?: string;
  total: number;
  correct: number;
  questions: {
    topic: string;
    correct: boolean;
    question: string;
  }[];
}

export interface UserProgress {
  history: QuizResult[];
}

export const TOPIC_NAMES: Record<string, string> = {
  jaringan_komputer: "Jaringan Komputer",
  database: "Database",
  keamanan_informasi: "Keamanan Informasi",
  sistem_operasi: "Sistem Operasi",
  pemrograman_teori: "Pemrograman (Teori)",
  hardware: "Hardware",
};
