import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/programData';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-slate-600">
        <BrandLogo size="sm" />

        <nav aria-label="Pautan Kaki" className="flex flex-wrap items-center justify-center gap-6">
          <a href="#cabaran" className="hover:text-slate-950 transition-colors whitespace-nowrap">
            Cabaran
          </a>
          <a href="#kelebihan" className="hover:text-slate-950 transition-colors whitespace-nowrap">
            Kelebihan
          </a>
          <a href="#program" className="hover:text-slate-950 transition-colors whitespace-nowrap">
            Program
          </a>
          <a href="#daftar" className="hover:text-slate-950 transition-colors whitespace-nowrap">
            Daftar
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-spec font-semibold text-slate-800 hover:text-emerald-700 transition-colors whitespace-nowrap"
          >
            WhatsApp: {DISPLAY_PHONE}
          </a>
        </nav>

        <p className="text-slate-500 text-center md:text-right">
          &copy; 2026 Akademi Kemahiran Kimpalan (GIS). Hak Cipta Terpelihara.
        </p>
      </div>
    </footer>
  );
}
