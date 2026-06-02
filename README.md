# 🎓 Latihan SKB CPNS - Pranata Komputer

Simulasi CAT SKB CPNS untuk jabatan Pranata Komputer. Dibangun dengan **Next.js + Tailwind CSS**, deploy gratis di **Vercel**.

## 📚 Fitur

- **65 soal** teori IT (Jaringan, Database, Security, OS, Pemrograman, Hardware)
- **Timer 90 detik/soal** seperti CAT BKN
- **Pembahasan** setiap soal
- **Tracking progress** dengan localStorage
- **Statistik per topik**
- **Simulasi lengkap** (semua topik acak)

## 🚀 Deploy ke Vercel (Gratis)

### Cara 1: Langsung dari GitHub (Recommended)

1. **Push repo ke GitHub:**
   ```bash
   cd /root/cpns-app
   git remote add origin https://github.com/USERNAME/cpns-app.git
   git push -u origin main
   ```

2. **Buka [vercel.com](https://vercel.com) → Login dengan GitHub**

3. **Import project:**
   - Klik "New Project"
   - Pilih repo `cpns-app`
   - Klik "Deploy"

4. **Selesai!** App live di `https://cpns-app.vercel.app`

### Cara 2: Upload Manual

1. Buka [vercel.com/new](https://vercel.com/new)
2. Pilih "Import Git Repository"
3. Paste URL repo GitHub kamu
4. Klik "Deploy"

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build

# Preview production build
npm run start
```

## 📁 Struktur

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── quiz/
│   │   ├── page.tsx      # Quiz wrapper (Suspense)
│   │   └── QuizClient.tsx # Quiz client component
│   └── stats/page.tsx    # Statistics page
├── data/
│   └── questions.json    # Bank soal (65 soal)
└── lib/
    ├── questions.ts      # Question helpers
    ├── storage.ts        # localStorage helpers
    └── types.ts          # TypeScript types
```

## ➕ Tambah Soal

Edit `src/data/questions.json`:

```json
{
  "jaringan_komputer": [
    {
      "q": "Pertanyaan kamu?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "answer": 0,
      "explanation": "Penjelasan jawaban"
    }
  ]
}
```

- `answer`: index jawaban benar (0=A, 1=B, 2=C, 3=D)

## 📝 Catatan

- **Tanpa database** — progress tersimpan di localStorage browser
- **Static site** — semua soal embed di build
- **Free di Vercel** — tanpa biaya hosting

## 📄 License

MIT
