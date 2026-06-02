import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SKB CPNS — Pranata Komputer",
  description: "Simulasi CAT SKB CPNS untuk jabatan Pranata Komputer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[var(--background)]">
        {/* Nav */}
        <header className="sticky top-0 z-50 bg-[var(--card)]/80 backdrop-blur-xl border-b border-[var(--card-border)]">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
                SK
              </div>
              <span className="font-semibold text-[15px] tracking-tight">SKB CPNS</span>
            </Link>
            <nav className="flex items-center gap-1">
              {[
                { href: "/", label: "Beranda" },
                { href: "/quiz?mode=all", label: "Latihan" },
                { href: "/stats", label: "Statistik" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--muted-light)] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-6 py-10 animate-slideUp">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--card-border)] py-8 mt-16">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>© 2026 SKB CPNS</span>
            <span>Pranata Komputer</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
