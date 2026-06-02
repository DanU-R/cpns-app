export interface FormasiConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: { key: string; name: string; icon: string }[];
}

export const formasiList: FormasiConfig[] = [
  {
    id: "pranata-komputer",
    name: "Pranata Komputer",
    icon: "💻",
    description: "SKB teknis IT: jaringan, database, keamanan, sistem operasi, pemrograman, hardware",
    topics: [
      { key: "jaringan_komputer", name: "Jaringan Komputer", icon: "🌐" },
      { key: "database", name: "Database", icon: "🗄️" },
      { key: "keamanan_informasi", name: "Keamanan Informasi", icon: "🔒" },
      { key: "sistem_operasi", name: "Sistem Operasi", icon: "⚙️" },
      { key: "pemrograman_teori", name: "Pemrograman (Teori)", icon: "📝" },
      { key: "hardware", name: "Hardware & Arsitektur", icon: "🔧" },
    ],
  },
  {
    id: "guru",
    name: "Guru",
    icon: "👩‍🏫",
    description: "Pedagogik, kompetensi kepribadian, sosial, profesional keguruan",
    topics: [
      { key: "pedagogik", name: "Pedagogik", icon: "📚" },
      { key: "kepribadian_guru", name: "Kepribadian Guru", icon: "🧠" },
      { key: "sosial", name: "Kompetensi Sosial", icon: "🤝" },
      { key: "profesional", name: "Kompetensi Profesional", icon: "📋" },
      { key: "kurikulum", name: "Kurikulum & Pembelajaran", icon: "📐" },
    ],
  },
  {
    id: "tenaga-kesehatan",
    name: "Tenaga Kesehatan",
    icon: "🏥",
    description: "Kesehatan masyarakat, farmasi, keperawatan, gizi, epidemiologi",
    topics: [
      { key: "kesehatan_masyarakat", name: "Kesehatan Masyarakat", icon: "🏘️" },
      { key: "farmasi", name: "Farmasi Dasar", icon: "💊" },
      { key: "keperawatan", name: "Keperawatan Dasar", icon: "🩺" },
      { key: "gizi", name: "Gizi & Nutrisi", icon: "🥗" },
      { key: "epidemiologi", name: "Epidemiologi", icon: "🔬" },
    ],
  },
  {
    id: "analis-kebijakan",
    name: "Analis Kebijakan",
    icon: "📊",
    description: "Analisis kebijakan publik, hukum administrasi, riset kebijakan, statistik",
    topics: [
      { key: "kebijakan_publik", name: "Kebijakan Publik", icon: "🏛️" },
      { key: "hukum_administrasi", name: "Hukum Administrasi", icon: "⚖️" },
      { key: "riset_kebijakan", name: "Riset Kebijakan", icon: "📈" },
      { key: "statistik", name: "Statistik Dasar", icon: "📉" },
      { key: "manajemen_publik", name: "Manajemen Publik", icon: "🏢" },
    ],
  },
  {
    id: "pustakawan",
    name: "Pustakawan",
    icon: "📖",
    description: "Ilmu perpustakaan, klasifikasi, katalogisasi, layanan informasi, teknologi informasi",
    topics: [
      { key: "ilmu_perpustakaan", name: "Ilmu Perpustakaan", icon: "📚" },
      { key: "klasifikasi", name: "Klasifikasi & Katalogisasi", icon: "🗂️" },
      { key: "layanan_informasi", name: "Layanan Informasi", icon: "🔍" },
      { key: "ti_perpustakaan", name: "TI Perpustakaan", icon: "💾" },
      { key: "manajemen_koleksi", name: "Manajemen Koleksi", icon: "📦" },
    ],
  },
  {
    id: "auditor",
    name: "Auditor",
    icon: "🔎",
    description: "Audit keuangan, audit kinerja, SPIP, peraturan BPKP, standar audit",
    topics: [
      { key: "audit_keuangan", name: "Audit Keuangan", icon: "💰" },
      { key: "audit_kinerja", name: "Audit Kinerja", icon: "📊" },
      { key: "spip", name: "SPIP & Pengendalian Internal", icon: "🛡️" },
      { key: "peraturan_bpkp", name: "Peraturan BPKP", icon: "📜" },
      { key: "standar_audit", name: "Standar Audit", icon: "✅" },
    ],
  },
];

export function getFormasi(id: string): FormasiConfig | undefined {
  return formasiList.find((f) => f.id === id);
}
