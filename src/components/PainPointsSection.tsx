import { Briefcase, Building2, ShieldAlert, Wallet } from 'lucide-react';
import { PAIN_POINTS } from '../data/programData';

const PAIN_ICONS = [Wallet, ShieldAlert, Building2, Briefcase];

export function PainPointsSection() {
  return (
    <section id="cabaran" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-2xl mb-14">
        <p className="text-xs sm:text-sm font-semibold text-amber-700 tracking-wide mb-3">
          Situasi Yang Sering Merisaukan Ibu Bapa
        </p>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight"
          style={{ textWrap: 'balance' }}
        >
          Adakah Anda Sebagai Ibu Bapa Berdepan 4 Masalah Ini?
        </h2>
        <p className="text-slate-600 text-base mt-4 leading-relaxed">
          Ramai ibu bapa berkongsi kebimbangan yang sama apabila anak remaja tidak lagi berminat
          dengan laluan peperiksaan akademik biasa.
        </p>
      </div>

      {/* Asymmetric 4-Card Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {PAIN_POINTS.map((item, idx) => {
          const IconComponent = PAIN_ICONS[idx] ?? Wallet;
          const colSpanClass =
            idx === 0 || idx === 3 ? 'lg:col-span-7' : 'lg:col-span-5';

          return (
            <article
              key={item.number}
              className={`bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 transition-transform duration-200 hover:-translate-y-0.5 ${colSpanClass}`}
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-mono-spec text-xs font-semibold text-slate-400">
                  {item.number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-950 mb-2.5 tracking-tight">
                {item.number}. {item.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
