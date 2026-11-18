import { ArrowRight } from 'lucide-react';
import { HERO_METRICS } from '../data/programData';

export function HeroBanner() {
  return (
    <section id="utama" className="relative bg-white border-b border-slate-200">
      {/* Wide-Screen Cinematic Banner */}
      <div className="relative min-h-[76vh] flex items-center justify-center overflow-hidden bg-slate-950 px-6 py-20 lg:py-28">
        {/* Atmospheric Industrial Welding Workshop Backdrop (SVG + Radial Glows) */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* Deep architectural steel grid */}
          <svg
            className="w-full h-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 800"
          >
            <defs>
              <pattern id="workshopGrid" width="72" height="72" patternUnits="userSpaceOnUse">
                <path
                  d="M 72 0 L 0 0 0 72"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.75"
                  strokeOpacity="0.45"
                />
              </pattern>
              <radialGradient id="arcFlash" cx="72%" cy="42%" r="48%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.42" />
                <stop offset="35%" stopColor="#EA580C" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="coolSteel" cx="22%" cy="68%" r="45%">
                <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1440" height="800" fill="url(#workshopGrid)" />
            <rect width="1440" height="800" fill="url(#arcFlash)" />
            <rect width="1440" height="800" fill="url(#coolSteel)" />

            {/* Structural overhead steel trusses */}
            <path
              d="M0 110 H1440 M0 170 H1440 M120 110 L180 170 L240 110 L300 170 L360 110 L420 170 L480 110 L540 170 L600 110 L660 170 L720 110 L780 170 L840 110 L900 170 L960 110 L1020 170 L1080 110 L1140 170 L1200 110 L1260 170 L1320 110"
              fill="none"
              stroke="#475569"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />

            {/* Precision welder silhouette & arc light vectors */}
            <g className="animate-spark-drift" opacity="0.75">
              <circle cx="1040" cy="340" r="3.5" fill="#FDE68A" />
              <circle cx="1040" cy="340" r="24" fill="#F59E0B" fillOpacity="0.22" />
              <line x1="1040" y1="340" x2="1175" y2="255" stroke="#FCD34D" strokeWidth="1.3" strokeOpacity="0.55" />
              <line x1="1040" y1="340" x2="1210" y2="395" stroke="#F59E0B" strokeWidth="1.1" strokeOpacity="0.45" />
              <line x1="1040" y1="340" x2="940" y2="215" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="1040" y1="340" x2="915" y2="475" stroke="#FB923C" strokeWidth="1.2" strokeOpacity="0.45" />
              <line x1="1040" y1="340" x2="1130" y2="510" stroke="#F59E0B" strokeWidth="0.9" strokeOpacity="0.35" />
              <circle cx="1128" cy="288" r="2" fill="#FDE68A" />
              <circle cx="1162" cy="378" r="1.8" fill="#FBBF24" />
              <circle cx="964" cy="435" r="2.2" fill="#FB923C" />
              <circle cx="980" cy="252" r="1.6" fill="#FEF3C7" />
            </g>

            {/* Steel I-beam frame accent */}
            <path
              d="M840 620 L1340 620 L1380 680 L800 680 Z"
              fill="#0F172A"
              fillOpacity="0.65"
              stroke="#334155"
              strokeWidth="1.2"
            />
          </svg>

          {/* Measured contrast scrim for guaranteed 4.5:1+ text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/55" />
        </div>

        {/* Hero Foreground Copy */}
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-amber-300 mb-5">
            <span>Khas Untuk Ibu Bapa</span>
            <span className="mx-2.5 text-slate-500" aria-hidden="true">
              ·
            </span>
            <span>Anak Remaja Berumur 15 Tahun Ke Atas</span>
          </p>

          <h1
            className="font-extrabold tracking-tight text-white mb-6 leading-[1.16]"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3.35rem)',
              textWrap: 'balance',
            }}
          >
            <span className="block">Risau Masa Depan Anak?</span>
            <span className="block">Susah Dapat Kerja?</span>
            <span className="block">Bekalkan Mereka</span>
            <span className="block text-amber-400 underline decoration-amber-400/50 decoration-2 underline-offset-8">
              Kemahiran Kimpalan Secara Profesional.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Program latihan teknikal bertauliah tinggi dengan persekitaran positif, jaminan sahsiah
            terpelihara, dan laluan kerjaya bergaji lumayan di dalam serta luar negara.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#daftar"
              className="inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-150 hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <span>Dapatkan Konsultasi Percuma</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
            <a
              href="#program"
              className="inline-flex items-center justify-center text-slate-200 hover:text-white font-semibold px-5 py-3.5 text-sm sm:text-base transition-colors duration-150 underline-offset-4 hover:underline whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-lg"
            >
              Lihat 3 Pilihan Program
            </a>
          </div>
        </div>
      </div>

      {/* 4-Column Full-Width Key-Fact Strip Directly Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 py-6 sm:py-7">
          {HERO_METRICS.map((metric) => (
            <div key={metric.label} className="px-4 sm:px-6 py-3 sm:py-1 text-center lg:text-left">
              <div className="font-mono-spec text-lg sm:text-xl font-bold text-slate-950 tracking-tight">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
