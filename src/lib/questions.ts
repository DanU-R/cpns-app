import questionsPranataKomputer from "@/data/questions.json";
import questionsGuru from "@/data/questions-guru.json";
import questionsTenagaKesehatan from "@/data/questions-tenaga-kesehatan.json";
import questionsAnalisKebijakan from "@/data/questions-analis-kebijakan.json";
import questionsPustakawan from "@/data/questions-pustakawan.json";
import questionsAuditor from "@/data/questions-auditor.json";
import { getFormasi } from "@/lib/formasi";

const questionBankMap: Record<string, Record<string, any[]>> = {
  "pranata-komputer": questionsPranataKomputer,
  "guru": questionsGuru,
  "tenaga-kesehatan": questionsTenagaKesehatan,
  "analis-kebijakan": questionsAnalisKebijakan,
  "pustakawan": questionsPustakawan,
  "auditor": questionsAuditor,
};

export function getQuestionBank(formasiId: string = "pranata-komputer") {
  return questionBankMap[formasiId] || questionBankMap["pranata-komputer"];
}

// Backward compatible — default to pranata-komputer
export const questionBank = questionBankMap["pranata-komputer"];

export function getTopicName(key: string): string {
  const names: Record<string, string> = {
    jaringan_komputer: "Jaringan Komputer",
    database: "Database",
    keamanan_informasi: "Keamanan Informasi",
    sistem_operasi: "Sistem Operasi",
    pemrograman_teori: "Pemrograman (Teori)",
    hardware: "Hardware & Arsitektur",
    pedagogik: "Pedagogik",
    kepribadian_guru: "Kepribadian Guru",
    sosial: "Kompetensi Sosial",
    profesional: "Kompetensi Profesional",
    kurikulum: "Kurikulum & Pembelajaran",
    kesehatan_masyarakat: "Kesehatan Masyarakat",
    farmasi: "Farmasi Dasar",
    keperawatan: "Keperawatan Dasar",
    gizi: "Gizi & Nutrisi",
    epidemiologi: "Epidemiologi",
    kebijakan_publik: "Kebijakan Publik",
    hukum_administrasi: "Hukum Administrasi",
    riset_kebijakan: "Riset Kebijakan",
    statistik: "Statistik Dasar",
    manajemen_publik: "Manajemen Publik",
    ilmu_perpustakaan: "Ilmu Perpustakaan",
    klasifikasi: "Klasifikasi & Katalogisasi",
    layanan_informasi: "Layanan Informasi",
    ti_perpustakaan: "TI Perpustakaan",
    manajemen_koleksi: "Manajemen Koleksi",
    audit_keuangan: "Audit Keuangan",
    audit_kinerja: "Audit Kinerja",
    spip: "SPIP & Pengendalian Internal",
    peraturan_bpkp: "Peraturan BPKP",
    standar_audit: "Standar Audit",
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
