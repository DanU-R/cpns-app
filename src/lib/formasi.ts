export interface FormasiConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "skd" | "skb";
  topics: { key: string; name: string; icon: string }[];
}

export const formasiList: FormasiConfig[] = [
  // ===== SKD (Seleksi Kompetensi Dasar) =====
  {
    id: "twk",
    name: "TWK",
    icon: "🇮🇩",
    description: "Tes Wawasan Kebangsaan: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, Sejarah Indonesia",
    category: "skd",
    topics: [
      { key: "pancasila", name: "Pancasila", icon: "⭐" },
      { key: "uud_1945", name: "UUD 1945", icon: "📜" },
      { key: "nkri", name: "NKRI & Bhinneka Tunggal Ika", icon: "🏛️" },
      { key: "sejarah_indonesia", name: "Sejarah Indonesia", icon: "📖" },
      { key: "tata_negara", name: "Tata Negara", icon: "⚖️" },
    ],
  },
  {
    id: "tiu",
    name: "TIU",
    icon: "🧠",
    description: "Tes Intelegensia Umum: Verbal, Numerik, Logika",
    category: "skd",
    topics: [
      { key: "verbal", name: "Verbal (Sinonim, Antonim, Analogi)", icon: "📝" },
      { key: "numerik", name: "Numerik (Deret, Aritmatika)", icon: "🔢" },
      { key: "logika", name: "Logika (Silogisme, Analitis)", icon: "🔍" },
      { key: "figural", name: "Figural (Pola Gambar)", icon: "🔷" },
      { key: "analisis", name: "Analisis Kuantitatif", icon: "📊" },
    ],
  },
  {
    id: "tkp",
    name: "TKP",
    icon: "❤️",
    description: "Tes Karakteristik Pribadi: Situational judgment, pelayanan publik, integritas",
    category: "skd",
    topics: [
      { key: "pelayanan_publik", name: "Pelayanan Publik", icon: "🤝" },
      { key: "integritas", name: "Integritas", icon: "🛡️" },
      { key: "anti_korupsi", name: "Anti Korupsi", icon: "⚖️" },
      { key: "kerjasama", name: "Kerjasama Tim", icon: "👥" },
      { key: "manajemen_diri", name: "Manajemen Diri", icon: "🎯" },
    ],
  },
  // ===== SKB (Seleksi Kompetensi Bidang) =====
  {
    id: "pranata-komputer",
    name: "Pranata Komputer",
    icon: "💻",
    description: "SKB teknis IT: jaringan, database, keamanan, sistem operasi, pemrograman, hardware",
    category: "skb",
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
    category: "skb",
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
    category: "skb",
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
    category: "skb",
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
    category: "skb",
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
    category: "skb",
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

export const skdList = formasiList.filter((f) => f.category === "skd");
export const skbList = formasiList.filter((f) => f.category === "skb");
