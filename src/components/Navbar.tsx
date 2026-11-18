import { BrandLogo } from './BrandLogo';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#utama"
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-md whitespace-nowrap shrink-0"
        >
          <BrandLogo />
        </a>

        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600"
        >
          <a
            href="#cabaran"
            className="hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-sm"
          >
            Cabaran
          </a>
          <a
            href="#kelebihan"
            className="hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-sm"
          >
            Kelebihan
          </a>
          <a
            href="#program"
            className="hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-sm"
          >
            Program
          </a>
          <a
            href="#soalan"
            className="hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-sm"
          >
            Soalan Lazim
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <a
            href="#daftar"
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            Daftar Pertanyaan
          </a>
        </div>
      </div>
    </header>
  );
}
