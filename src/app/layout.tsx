import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Latihan SKB CPNS - Pranata Komputer",
  description: "Simulasi CAT SKB CPNS untuk jabatan Pranata Komputer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-indigo-600 text-white shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg hover:text-indigo-200">
              🎓 SKB CPNS
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-indigo-200">
                Beranda
              </Link>
              <Link href="/quiz" className="hover:text-indigo-200">
                Latihan
              </Link>
              <Link href="/stats" className="hover:text-indigo-200">
                Statistik
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center py-6 text-gray-400 text-sm">
          Latihan SKB CPNS Pranata Komputer © 2026
        </footer>
      </body>
    </html>
  );
}
