import questionsPranataKomputer from "@/data/questions.json";
import questionsGuru from "@/data/questions-guru.json";
import questionsTenagaKesehatan from "@/data/questions-tenaga-kesehatan.json";
import questionsAnalisKebijakan from "@/data/questions-analis-kebijakan.json";
import questionsPustakawan from "@/data/questions-pustakawan.json";
import questionsAuditor from "@/data/questions-auditor.json";
import questionsTWK from "@/data/questions-twk.json";
import questionsTIU from "@/data/questions-tiu.json";
import questionsTKP from "@/data/questions-tkp.json";
import { getFormasi } from "@/lib/formasi";

const questionBankMap: Record<string, Record<string, any[]>> = {
  "twk": questionsTWK,
  "tiu": questionsTIU,
  "tkp": questionsTKP,
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
    // SKD - TWK
    pancasila: "Pancasila",
    uud_1945: "UUD 1945",
    nkri: "NKRI & Bhinneka Tunggal Ika",
    sejarah_indonesia: "Sejarah Indonesia",
    tata_negara: "Tata Negara",
    // SKD - TIU
    verbal: "Verbal (Sinonim, Antonim, Analogi)",
    numerik: "Numerik (Deret, Aritmatika)",
    logika: "Logika (Silogisme, Analitis)",
    figural: "Figural (Pola Gambar)",
    analisis: "Analisis Kuantitatif",
    // SKD - TKP
    pelayanan_publik: "Pelayanan Publik",
    integritas: "Integritas",
    anti_korupsi: "Anti Korupsi",
    kerjasama: "Kerjasama Tim",
    manajemen_diri: "Manajemen Diri",
    // SKB - Pranata Komputer
    jaringan_komputer: "Jaringan Komputer",
    database: "Database",
    keamanan_informasi: "Keamanan Informasi",
    sistem_operasi: "Sistem Operasi",
    pemrograman_teori: "Pemrograman (Teori)",
    hardware: "Hardware & Arsitektur",
    // SKB - Guru
    pedagogik: "Pedagogik",
    kepribadian_guru: "Kepribadian Guru",
    sosial: "Kompetensi Sosial",
    profesional: "Kompetensi Profesional",
    kurikulum: "Kurikulum & Pembelajaran",
    // SKB - Nakes
    kesehatan_masyarakat: "Kesehatan Masyarakat",
    farmasi: "Farmasi Dasar",
    keperawatan: "Keperawatan Dasar",
    gizi: "Gizi & Nutrisi",
    epidemiologi: "Epidemiologi",
    // SKB - Analis Kebijakan
    kebijakan_publik: "Kebijakan Publik",
    hukum_administrasi: "Hukum Administrasi",
    riset_kebijakan: "Riset Kebijakan",
    statistik: "Statistik Dasar",
    manajemen_publik: "Manajemen Publik",
    // SKB - Pustakawan
    ilmu_perpustakaan: "Ilmu Perpustakaan",
    klasifikasi: "Klasifikasi & Katalogisasi",
    layanan_informasi: "Layanan Informasi",
    ti_perpustakaan: "TI Perpustakaan",
    manajemen_koleksi: "Manajemen Koleksi",
    // SKB - Auditor
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
