import {
  ArrowLeft,
  Download,
  ExternalLink,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { PROGRAM_TRACKS } from '../data/programData';
import { formatTimestamp } from '../hooks/useLeadCRM';
import {
  EXPERIENCE_LEVELS,
  ExperienceLevel,
  LEAD_STATUSES,
  LeadRecord,
  LeadStatus,
  NewLeadInput,
} from '../types/crm';
import { BrandLogo } from './BrandLogo';

interface AdminDashboardProps {
  leads: LeadRecord[];
  onAddLead: (lead: NewLeadInput) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onExportCSV: (records: LeadRecord[]) => void;
  onExitAdmin: (scrollToForm?: boolean) => void;
  onLogout: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isGoogleSheetConfigured?: boolean;
  syncError?: string | null;
}

const STATUS_SELECT_STYLES: Record<LeadStatus, string> = {
  'New Lead': 'bg-amber-50 text-amber-800 border-amber-300',
  Contacted: 'bg-sky-50 text-sky-800 border-sky-300',
  Registered: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Closed: 'bg-slate-100 text-slate-700 border-slate-300',
};

function toWhatsAppLink(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('60')) return `https://wa.me/${digits}`;
  if (digits.startsWith('0')) return `https://wa.me/6${digits}`;
  return `https://wa.me/60${digits}`;
}

export function AdminDashboard({
  leads,
  onAddLead,
  onUpdateStatus,
  onDeleteLead,
  onExportCSV,
  onExitAdmin,
  onLogout,
  onRefresh,
  isLoading = false,
  isGoogleSheetConfigured = false,
  syncError = null,
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showManualAdd, setShowManualAdd] = useState(false);

  // Manual walk-in lead state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualProgram, setManualProgram] = useState(PROGRAM_TRACKS[0]?.title ?? '');
  const [manualExperience, setManualExperience] = useState<ExperienceLevel>(
    EXPERIENCE_LEVELS[0]
  );
  const [manualError, setManualError] = useState('');

  const statusCounts = useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      'New Lead': 0,
      Contacted: 0,
      Registered: 0,
      Closed: 0,
    };
    for (const lead of leads) {
      if (lead.status in counts) {
        counts[lead.status] += 1;
      }
    }
    return counts;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) {
        return false;
      }
      if (programFilter !== 'ALL' && lead.program !== programFilter) {
        return false;
      }
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.program.toLowerCase().includes(q) ||
        (lead.notes ?? '').toLowerCase().includes(q)
      );
    });
  }, [leads, searchQuery, programFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setProgramFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleManualSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (manualName.trim().length < 2 || manualPhone.trim().length < 8) {
      setManualError('Sila masukkan nama dan nombor telefon yang sah.');
      return;
    }
    setManualError('');
    onAddLead({
      name: manualName.trim(),
      phone: manualPhone.trim(),
      email: manualEmail.trim() || 'tiada@rekod.tempatan',
      program: manualProgram,
      experienceLevel: manualExperience,
    });
    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setShowManualAdd(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Breadcrumb Left + 1-2 Actions Right */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onExitAdmin(false)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Laman Utama</span>
            </button>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
              /
            </span>
            <BrandLogo size="sm" className="hidden md:inline-flex" />
            <span className="text-slate-300 hidden md:inline" aria-hidden="true">
              /
            </span>
            <span className="text-sm font-bold text-slate-950 truncate">
              Pengurusan Lead CRM
            </span>
            {/* Sync Badge */}
            <span
              className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isGoogleSheetConfigured
                  ? syncError
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
              title={isGoogleSheetConfigured ? (syncError || 'Google Sheets Connected (ziqrul@gis.edu.my)') : 'Using LocalStorage Fallback'}
            >
              <span className={`w-2 h-2 rounded-full ${isGoogleSheetConfigured && !syncError ? 'bg-emerald-500 animate-pulse' : isGoogleSheetConfigured ? 'bg-amber-500' : 'bg-slate-400'}`} />
              <span>
                {isGoogleSheetConfigured ? (syncError ? 'Google Sheet (Ralat Sambutan)' : 'Google Sheets Aktif') : 'Storan Tempatan (LocalStorage)'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                title="Muat semula dari Google Sheets"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <RefreshCw className={`w-4 h-4 shrink-0 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span className="hidden md:inline">Segar Semula</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowManualAdd((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Tambah Lead</span>
            </button>
            <button
              type="button"
              disabled={filteredLeads.length === 0}
              onClick={() => onExportCSV(filteredLeads)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Eksport CSV</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Log Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Manual Lead Add Drawer */}
        {showManualAdd && (
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-950">
                  Tambah Rekod Lead Secara Manual
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Untuk pertanyaan telefon atau pendaftaran terus di pejabat akademi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManualAdd(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Tutup borang manual"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Nama Penuh *"
                required
                className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <input
                type="tel"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                placeholder="No. Telefon *"
                required
                className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <input
                type="email"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="Emel (Pilihan)"
                className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
              />
              <select
                value={manualProgram}
                onChange={(e) => setManualProgram(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
              >
                {PROGRAM_TRACKS.map((track) => (
                  <option key={track.id} value={track.title}>
                    {track.title}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <select
                  value={manualExperience}
                  onChange={(e) => setManualExperience(e.target.value as ExperienceLevel)}
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                >
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer whitespace-nowrap shrink-0"
                >
                  Simpan
                </button>
              </div>
            </form>
            {manualError && <p className="text-xs font-medium text-rose-700 mt-2">{manualError}</p>}
          </section>
        )}

        {/* Live Summary Strip (Single Elevation, Tabular Numerals) */}
        <section
          aria-label="Ringkasan Status Lead"
          className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
        >
          <div className="px-6 py-4">
            <div className="text-xs font-medium text-slate-500">Jumlah Keseluruhan</div>
            <div className="font-mono-spec text-2xl font-bold text-slate-950 mt-1">
              {leads.length}
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="text-xs font-medium text-amber-700">New Lead</div>
            <div className="font-mono-spec text-2xl font-bold text-slate-950 mt-1">
              {statusCounts['New Lead']}
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="text-xs font-medium text-sky-700">Contacted</div>
            <div className="font-mono-spec text-2xl font-bold text-slate-950 mt-1">
              {statusCounts.Contacted}
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="text-xs font-medium text-emerald-700">Registered</div>
            <div className="font-mono-spec text-2xl font-bold text-slate-950 mt-1">
              {statusCounts.Registered}
            </div>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, no. telefon, atau emel..."
                aria-label="Cari lead"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50/70 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              aria-label="Tapis mengikut program"
              className="lg:w-80 px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-slate-50/70 focus:bg-white focus:outline-none focus:border-slate-900"
            >
              <option value="ALL">Semua Program ({leads.length})</option>
              {PROGRAM_TRACKS.map((track) => (
                <option key={track.id} value={track.title}>
                  {track.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div
              role="group"
              aria-label="Tapis mengikut status"
              className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
            >
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Semua ({leads.length})
              </button>
              {LEAD_STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    statusFilter === st
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {st} ({statusCounts[st]})
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono-spec">
              Menunjukkan {filteredLeads.length} daripada {leads.length} rekod
            </div>
          </div>
        </section>

        {/* Data Table or Empty States */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {leads.length === 0 ? (
            <div className="py-16 px-6 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-slate-950">Belum Ada Rekod Lead</h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Setiap permohonan yang dihantar melalui borang pendaftaran landing page akan
                disimpan di sini secara automatik.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onExitAdmin(true)}
                  className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Isi Borang Pendaftaran
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualAdd(true)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Tambah Lead Manual
                </button>
              </div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-14 px-6 text-center max-w-md mx-auto">
              <h2 className="text-base font-bold text-slate-950">Tiada Rekod Sepadan</h2>
              <p className="text-sm text-slate-600 mt-1">
                Cuba ubah kata kunci carian atau tetapkan semula penapis status dan program.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Set Semula Penapis
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4 whitespace-nowrap">Tarikh &amp; Masa</th>
                    <th className="py-3 px-4 whitespace-nowrap">Nama</th>
                    <th className="py-3 px-4 whitespace-nowrap">No. Telefon</th>
                    <th className="py-3 px-4 whitespace-nowrap">Emel</th>
                    <th className="py-3 px-4 whitespace-nowrap">Program &amp; Tahap</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredLeads.map((lead) => {
                    const isConfirmingDelete = pendingDeleteId === lead.id;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono-spec text-xs text-slate-600 whitespace-nowrap">
                          {formatTimestamp(lead.createdAt)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-950 whitespace-nowrap">
                          {lead.name}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <a
                            href={toWhatsAppLink(lead.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono-spec text-xs font-medium text-emerald-700 hover:underline"
                          >
                            <span>{lead.phone}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {lead.email}
                        </td>
                        <td className="py-3 px-4 min-w-[240px]">
                          <div className="font-medium text-slate-900">{lead.program}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {lead.experienceLevel}
                          </div>
                          {lead.notes && (
                            <div className="text-xs text-slate-600 mt-1 italic">
                              &ldquo;{lead.notes}&rdquo;
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            aria-label={`Status untuk ${lead.name}`}
                            onChange={(e) =>
                              onUpdateStatus(lead.id, e.target.value as LeadStatus)
                            }
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/15 ${
                              STATUS_SELECT_STYLES[lead.status]
                            }`}
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option key={st} value={st} className="bg-white text-slate-900">
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isConfirmingDelete ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteLead(lead.id);
                                  setPendingDeleteId(null);
                                }}
                                className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                              >
                                Sahkan
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(null)}
                                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(lead.id)}
                              aria-label={`Padam rekod ${lead.name}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>Padam</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
