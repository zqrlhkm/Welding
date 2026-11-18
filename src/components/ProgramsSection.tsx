import { ArrowUpRight, Check } from 'lucide-react';
import { PROGRAM_TRACKS } from '../data/programData';

interface ProgramsSectionProps {
  selectedProgram: string;
  onSelectProgram: (programTitle: string) => void;
}

export function ProgramsSection({
  selectedProgram,
  onSelectProgram,
}: ProgramsSectionProps) {
  const handleChooseProgram = (programTitle: string) => {
    onSelectProgram(programTitle);
    const formEl = document.getElementById('daftar');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="program" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold text-amber-700 tracking-wide mb-3">
            Pilihan Laluan Pengajian
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Pilih Program Yang Sesuai Dengan Tahap &amp; Minat Anak Anda
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-sm">
          Klik mana-mana program di bawah untuk memilih terus pada borang konsultasi WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PROGRAM_TRACKS.map((track) => {
          const isSelected = selectedProgram === track.title;

          return (
            <article
              key={track.id}
              className={`bg-white rounded-2xl p-7 sm:p-8 border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 ring-1 ring-amber-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4">
                  <span className="font-mono-spec text-slate-800 font-semibold">{track.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{track.audience}</span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-3 leading-snug">
                  {track.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">{track.focus}</p>

                <ul className="space-y-3 border-t border-slate-100 pt-5 mb-8">
                  {track.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check
                        className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleChooseProgram(track.title)}
                className={`w-full inline-flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl text-sm transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 ${
                  isSelected
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-950 hover:bg-amber-400'
                }`}
              >
                <span>{isSelected ? 'Program Dipilih — Terus Ke Borang' : 'Pilih Program Ini'}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
