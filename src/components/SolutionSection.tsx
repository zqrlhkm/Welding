import { Check } from 'lucide-react';
import { SOLUTION_BENEFITS, WORKSHOP_SPECS } from '../data/programData';

export function SolutionSection() {
  return (
    <section
      id="kelebihan"
      className="bg-white py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide mb-3">
            Jawapan Kepada Kerisauan Anda
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Bagaimana Program Kami Membantu Masa Depan Anak Anda?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: 4 Pillars separated by clean hairline dividers */}
          <div className="lg:col-span-7 flex flex-col justify-between divide-y divide-slate-200 border-y border-slate-200">
            {SOLUTION_BENEFITS.map((benefit) => (
              <div key={benefit.title} className="py-6 flex items-start gap-4">
                <div className="mt-0.5 w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Structured Light-Mode Workshop Spec Card */}
          <div className="lg:col-span-5 flex">
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 tracking-wide mb-2">
                  Struktur Latihan Akademi Kemahiran Kimpalan (GIS)
                </p>
                <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-3">
                  Gabungan Kemahiran Teknikal &amp; Pembentukan Sahsiah
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-7">
                  Pelatih bukan sahaja dilatih memegang elektrod kimpalan dengan tepat, malah
                  dibimbing menjadi tenaga kerja berdisiplin yang dipercayai majikan.
                </p>

                <dl className="divide-y divide-slate-200 border-t border-slate-200">
                  {WORKSHOP_SPECS.map((spec) => (
                    <div
                      key={spec.code}
                      className="py-3.5 flex items-baseline justify-between gap-4"
                    >
                      <dt className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                        <span className="font-mono-spec text-xs text-slate-400">{spec.code}</span>
                        <span>{spec.label}</span>
                      </dt>
                      <dd className="text-sm font-semibold text-slate-950 text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-slate-600">
                  Sesuai untuk pelajar lepasan PT3, SPM, atau remaja 15+ tahun.
                </span>
                <a
                  href="#daftar"
                  className="text-sm font-bold text-slate-950 hover:text-amber-700 underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
                >
                  Tanya Penasihat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
