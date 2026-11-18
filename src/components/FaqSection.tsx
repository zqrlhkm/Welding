import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS } from '../data/programData';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="soalan"
      className="bg-white py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide mb-3">
            Soalan Lazim Ibu Bapa
          </p>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Maklumat Penting Sebelum Mendaftar
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left py-1 cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-md"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-amber-700 transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-slate-950' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed pr-8">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
