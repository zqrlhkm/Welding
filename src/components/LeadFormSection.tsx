import { AlertCircle, CheckCircle2, Loader2, MessageCircle, PhoneCall } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { DISPLAY_PHONE, PROGRAM_TRACKS, WHATSAPP_NUMBER } from '../data/programData';
import { useLeadCRM } from '../hooks/useLeadCRM';
import { EXPERIENCE_LEVELS, ExperienceLevel, LeadRecord } from '../types/crm';

interface LeadFormSectionProps {
  selectedProgram: string;
  onSelectProgram: (programTitle: string) => void;
}

interface FormErrors {
  nama?: string;
  telefon?: string;
  emel?: string;
  kursus?: string;
  pengalaman?: string;
}

export function LeadFormSection({
  selectedProgram,
  onSelectProgram,
}: LeadFormSectionProps) {
  const { addLead, isSubmitting, submitError } = useLeadCRM();
  const [nama, setNama] = useState('');
  const [telefon, setTelefon] = useState('');
  const [emel, setEmel] = useState('');
  const [kursus, setKursus] = useState(selectedProgram);
  const [pengalaman, setPengalaman] = useState<ExperienceLevel | ''>('');
  const [catatan, setCatatan] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<LeadRecord | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProgram) {
      setKursus(selectedProgram);
      setErrors((prev) => ({ ...prev, kursus: undefined }));
    }
  }, [selectedProgram]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const cleanName = nama.trim();
    const cleanPhone = telefon.replace(/[\s\-()+]/g, '');
    const cleanEmail = emel.trim();

    if (cleanName.length < 2) {
      nextErrors.nama = 'Sila masukkan nama penuh (sekurang-kurangnya 2 aksara).';
    }

    if (cleanPhone.length < 9 || !/^[0-9]{9,15}$/.test(cleanPhone)) {
      nextErrors.telefon = 'Sila masukkan nombor telefon WhatsApp yang sah (cth: 0123456789).';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      nextErrors.emel = 'Sila masukkan alamat emel yang sah (cth: nama@contoh.com).';
    }

    if (!kursus) {
      nextErrors.kursus = 'Sila pilih satu program latihan yang diminati.';
    }

    if (!pengalaman) {
      nextErrors.pengalaman = 'Sila pilih tahap pengalaman kimpalan semasa.';
    }

    return nextErrors;
  };

  const focusFirstInvalidField = (validationErrors: FormErrors) => {
    const fieldOrder: (keyof FormErrors)[] = [
      'nama',
      'telefon',
      'emel',
      'kursus',
      'pengalaman',
    ];
    const firstKey = fieldOrder.find((key) => Boolean(validationErrors[key]));
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.warn('[LeadFormSection] Pengesahan borang gagal:', validationErrors);
      setErrors(validationErrors);
      focusFirstInvalidField(validationErrors);
      return;
    }

    setErrors({});
    setFormSubmitError(null);

    const chosenExperience = pengalaman as ExperienceLevel;
    const cleanName = nama.trim();
    const cleanPhone = telefon.trim();
    const cleanEmail = emel.trim().toLowerCase();
    const cleanNotes = catatan.trim();

    console.log('[LeadFormSection] Menghantar data ke Google Sheets via addLead()...', {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      program: kursus,
      experience: chosenExperience,
      notes: cleanNotes,
    });

    try {
      const savedRecord = await addLead({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        program: kursus,
        experience: chosenExperience,
        notes: cleanNotes,
        status: 'New Lead',
      });

      const notesLine = cleanNotes ? `\n- Catatan: ${cleanNotes}` : '';
      const rawMessage =
        `Hai, saya berminat dengan program welding anda.\n\n` +
        `*Maklumat Pendaftaran:*\n` +
        `- Nama: ${cleanName}\n` +
        `- No Telefon: ${cleanPhone}\n` +
        `- Emel: ${cleanEmail}\n` +
        `- Kursus Diminati: ${kursus}\n` +
        `- Tahap Pengalaman: ${chosenExperience}${notesLine}\n\n` +
        `Sila berikan butiran lanjut. Terima kasih!`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(rawMessage)}`;
      setSubmittedLead(savedRecord);
      setSubmittedUrl(waUrl);

      setNama('');
      setTelefon('');
      setEmel('');
      setPengalaman('');
      setCatatan('');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan rekod pendaftaran ke Google Sheets. Sila cuba lagi.';
      console.error('[LeadFormSection] Gagal menyimpan lead:', err);
      setFormSubmitError(message);
    }
  };

  const handleResetForNewEntry = () => {
    setSubmittedLead(null);
    setSubmittedUrl(null);
    setFormSubmitError(null);
  };

  const activeSubmitError = formSubmitError || submitError;

  return (
    <section
      id="daftar"
      className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Advisor reassurance & steps */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-700 tracking-wide mb-3">
              Pendaftaran Pantas · Terus Ke WhatsApp
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Dapatkan Info Penuh &amp; Slot Kemasukan Untuk Anak Anda
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Isikan maklumat asas di sebelah. Rekod pendaftaran anda akan disimpan dan mesej
              dihubungkan terus kepada penasihat akademik Akademi Kemahiran Kimpalan (GIS).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Talian Rasmi Penasihat Akademik</div>
                <div className="font-mono-spec text-base font-bold text-slate-950">
                  {DISPLAY_PHONE}
                </div>
              </div>
            </div>

            <ol className="divide-y divide-slate-100 border-t border-slate-100 pt-2 text-sm text-slate-700">
              <li className="py-2.5 flex gap-3">
                <span className="font-mono-spec text-xs font-semibold text-slate-400 mt-0.5">
                  01
                </span>
                <span>Lengkapkan nama, nombor WhatsApp, emel, program, dan tahap pengalaman.</span>
              </li>
              <li className="py-2.5 flex gap-3">
                <span className="font-mono-spec text-xs font-semibold text-slate-400 mt-0.5">
                  02
                </span>
                <span>
                  Butiran direkodkan serta dipindahkan ke WhatsApp rasmi Akademi Kemahiran Kimpalan
                  (GIS).
                </span>
              </li>
              <li className="py-2.5 flex gap-3">
                <span className="font-mono-spec text-xs font-semibold text-slate-400 mt-0.5">
                  03
                </span>
                <span>Terima penerangan jadual pengambilan, syarat umur, dan laluan kerjaya.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Right: Quick Lead Capture Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            {submittedUrl && submittedLead ? (
              <div className="py-4 space-y-6" role="status" aria-live="polite">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-950">
                      Pendaftaran Berjaya Direkodkan
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Rekod anda (<span className="font-mono-spec font-semibold">{submittedLead.id}</span>) telah disimpan. Klik butang di bawah untuk membuka WhatsApp penasihat kami ({DISPLAY_PHONE}).
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-1.5">
                  <div>
                    <span className="font-semibold text-slate-900">Nama:</span>{' '}
                    {submittedLead.name}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">No. Telefon:</span>{' '}
                    {submittedLead.phone}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Emel:</span>{' '}
                    {submittedLead.email}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Program:</span>{' '}
                    {submittedLead.program}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Tahap Pengalaman:</span>{' '}
                    {submittedLead.experienceLevel}
                  </div>
                  {submittedLead.notes && (
                    <div>
                      <span className="font-semibold text-slate-900">Catatan:</span>{' '}
                      {submittedLead.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 touch-manipulation"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Buka WhatsApp Sekarang</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetForNewEntry}
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-3.5 rounded-xl text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 touch-manipulation"
                  >
                    Daftar Permohonan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-950">
                    Borang Pertanyaan Program Welding
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Lengkapkan maklumat di bawah untuk konsultasi pantas bersama penasihat kami.
                  </p>
                </div>

                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Nama Penuh (Ibu Bapa / Penjaga / Anak)
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    autoComplete="name"
                    required
                    value={nama}
                    onChange={(e) => {
                      setNama(e.target.value);
                      if (errors.nama) setErrors((prev) => ({ ...prev, nama: undefined }));
                    }}
                    aria-invalid={Boolean(errors.nama)}
                    placeholder="cth: En. Razak bin Abdullah"
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-slate-50/70 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                      errors.nama
                        ? 'border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-300 focus:border-slate-900 focus:ring-slate-900/15'
                    }`}
                  />
                  {errors.nama && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.nama}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="telefon"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      No. Telefon (WhatsApp)
                    </label>
                    <input
                      id="telefon"
                      name="telefon"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={telefon}
                      onChange={(e) => {
                        setTelefon(e.target.value);
                        if (errors.telefon) setErrors((prev) => ({ ...prev, telefon: undefined }));
                      }}
                      aria-invalid={Boolean(errors.telefon)}
                      placeholder="cth: 0123456789"
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-slate-50/70 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        errors.telefon
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 focus:border-slate-900 focus:ring-slate-900/15'
                      }`}
                    />
                    {errors.telefon && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.telefon}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="emel"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Emel
                    </label>
                    <input
                      id="emel"
                      name="emel"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      required
                      value={emel}
                      onChange={(e) => {
                        setEmel(e.target.value);
                        if (errors.emel) setErrors((prev) => ({ ...prev, emel: undefined }));
                      }}
                      aria-invalid={Boolean(errors.emel)}
                      placeholder="cth: emel@contoh.com"
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-slate-50/70 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        errors.emel
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 focus:border-slate-900 focus:ring-slate-900/15'
                      }`}
                    />
                    {errors.emel && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.emel}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="kursus"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Kursus / Program Yang Diminati
                    </label>
                    <select
                      id="kursus"
                      name="kursus"
                      required
                      value={kursus}
                      onChange={(e) => {
                        const val = e.target.value;
                        setKursus(val);
                        onSelectProgram(val);
                        if (errors.kursus) setErrors((prev) => ({ ...prev, kursus: undefined }));
                      }}
                      aria-invalid={Boolean(errors.kursus)}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-slate-50/70 text-slate-950 focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        errors.kursus
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 focus:border-slate-900 focus:ring-slate-900/15'
                      }`}
                    >
                      <option value="" disabled>
                        -- Sila Pilih Program --
                      </option>
                      {PROGRAM_TRACKS.map((track) => (
                        <option key={track.id} value={track.title}>
                          {track.title}
                        </option>
                      ))}
                    </select>
                    {errors.kursus && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.kursus}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="pengalaman"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Tahap Pengalaman Pelajar
                    </label>
                    <select
                      id="pengalaman"
                      name="pengalaman"
                      required
                      value={pengalaman}
                      onChange={(e) => {
                        setPengalaman(e.target.value as ExperienceLevel);
                        if (errors.pengalaman) {
                          setErrors((prev) => ({ ...prev, pengalaman: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.pengalaman)}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-slate-50/70 text-slate-950 focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        errors.pengalaman
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 focus:border-slate-900 focus:ring-slate-900/15'
                      }`}
                    >
                      <option value="" disabled>
                        -- Sila Pilih Tahap --
                      </option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.pengalaman && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.pengalaman}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="catatan"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Catatan / Soalan Tambahan (Pilihan)
                  </label>
                  <textarea
                    id="catatan"
                    name="catatan"
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="cth: Anak berumur 16 tahun, ingin tahu tarikh pengambilan terdekat atau kemudahan asrama."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm bg-slate-50/70 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-slate-900 focus:ring-slate-900/15 focus:bg-white transition-colors resize-none"
                  />
                </div>

                {activeSubmitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs sm:text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold">Gagal Menyimpan Rekod</p>
                      <p className="mt-0.5">{activeSubmitError}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-extrabold py-4 px-6 rounded-xl shadow-sm transition-colors duration-150 sm:hover:-translate-y-0.5 text-base flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 shrink-0 animate-spin" aria-hidden="true" />
                      <span>Menyimpan rekod...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Hantar &amp; Terus ke WhatsApp</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
