import { useCallback, useEffect, useState } from 'react';
import {
  EXPERIENCE_LEVELS,
  ExperienceLevel,
  LEAD_STATUSES,
  Lead,
  LeadRecord,
  LeadStatus,
  NewLeadInput,
} from '../types/crm';

export const DEFAULT_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbyDF3B9PS63ElhWCydKiUb8G7u2TweH3da1oQkweMrBaopdfUmLqsZ1IrEGphXCAjoI/exec';

export const WEBAPP_URL = (
  import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL || DEFAULT_WEBAPP_URL
).trim();

const CRM_SHEETS_UPDATED_EVENT = 'gis_sheets_crm_updated';

function isValidStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && LEAD_STATUSES.includes(value as LeadStatus);
}

function normalizeExperience(value: unknown): ExperienceLevel {
  if (
    typeof value === 'string' &&
    EXPERIENCE_LEVELS.includes(value as ExperienceLevel)
  ) {
    return value as ExperienceLevel;
  }
  return EXPERIENCE_LEVELS[0];
}

function isApiSuccess(data: Record<string, unknown> | null): boolean {
  if (!data) return false;
  return data.status === 'success' || data.success === true;
}

function normalizeLeadList(rawList: unknown[]): LeadRecord[] {
  return rawList
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null
    )
    .map((item) => ({
      id: String(item.id ?? ''),
      createdAt: String(item.createdAt ?? ''),
      name: String(item.name ?? ''),
      phone: String(item.phone ?? ''),
      email: String(item.email ?? ''),
      program: String(item.program ?? ''),
      experienceLevel: normalizeExperience(
        item.experienceLevel ?? item.experience
      ),
      notes: typeof item.notes === 'string' ? item.notes : String(item.notes ?? ''),
      status: isValidStatus(item.status) ? item.status : 'New Lead',
    }))
    .filter((lead) => Boolean(lead.id || lead.name || lead.phone))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

async function parseJsonResponse(response: Response): Promise<Record<string, unknown>> {
  const rawText = await response.text();
  if (!rawText) {
    return {};
  }
  try {
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) {
      return { status: 'success', leads: parsed };
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    throw new Error(
      'Google Apps Script memulangkan respons bukan JSON. Pastikan Web App ditetapkan kepada "Execute as: Me" dan "Who has access: Anyone".'
    );
  }
}

function notifySheetsUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CRM_SHEETS_UPDATED_EVENT));
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function useLeadCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isGoogleSheetConfigured = Boolean(
    WEBAPP_URL && WEBAPP_URL.startsWith('http')
  );

  const refreshLeads = useCallback(async (): Promise<LeadRecord[]> => {
    if (!isGoogleSheetConfigured) {
      const msg = 'URL Google Sheets Web App belum dikonfigurasi.';
      setSyncError(msg);
      setLeads([]);
      return [];
    }

    setIsLoading(true);
    setSyncError(null);
    try {
      const cacheBustedUrl = `${WEBAPP_URL}${WEBAPP_URL.includes('?') ? '&' : '?'}t=${Date.now()}`;
      const response = await fetch(cacheBustedUrl, {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Gagal mendapatkan data daripada Google Sheets.`
        );
      }

      const data = await parseJsonResponse(response);
      if (isApiSuccess(data) && Array.isArray(data.leads)) {
        const fetchedLeads = normalizeLeadList(data.leads);
        setLeads(fetchedLeads);
        console.log(
          '[CRM] Berjaya memuat turun rekod dari Google Sheets:',
          fetchedLeads.length
        );
        return fetchedLeads;
      }

      throw new Error(
        typeof data.message === 'string' && data.message
          ? data.message
          : 'Format respons Google Sheets tidak sah.'
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal berhubung dengan Google Sheets Web App.';
      console.error('[CRM] Ralat menyegerakkan Google Sheets:', err);
      setSyncError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isGoogleSheetConfigured]);

  useEffect(() => {
    void refreshLeads();

    const handleSheetsUpdated = () => {
      void refreshLeads();
    };

    window.addEventListener(CRM_SHEETS_UPDATED_EVENT, handleSheetsUpdated);
    window.addEventListener('pageshow', handleSheetsUpdated);

    return () => {
      window.removeEventListener(CRM_SHEETS_UPDATED_EVENT, handleSheetsUpdated);
      window.removeEventListener('pageshow', handleSheetsUpdated);
    };
  }, [refreshLeads]);

  const postToGoogleSheet = useCallback(
    async (payload: Record<string, unknown>): Promise<Record<string, unknown>> => {
      if (!isGoogleSheetConfigured) {
        throw new Error('URL Google Sheets Web App belum dikonfigurasi.');
      }

      const response = await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Gagal menghantar data ke Google Sheets.`
        );
      }

      const data = await parseJsonResponse(response);
      if (!isApiSuccess(data)) {
        throw new Error(
          typeof data.message === 'string' && data.message
            ? data.message
            : 'Google Sheets menolak permintaan ini.'
        );
      }

      return data;
    },
    [isGoogleSheetConfigured]
  );

  const addLead = useCallback(
    async (input: NewLeadInput): Promise<LeadRecord> => {
      setIsSubmitting(true);
      setSubmitError(null);

      const newRecord: LeadRecord = {
        id: `LEAD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        program: input.program,
        experienceLevel: normalizeExperience(
          input.experienceLevel ?? input.experience
        ),
        notes: input.notes ? input.notes.trim() : '',
        status: isValidStatus(input.status) ? input.status : 'New Lead',
      };

      try {
        console.log('[CRM] Menghantar rekod baharu ke Google Sheets:', newRecord);
        const result = await postToGoogleSheet({
          action: 'create',
          lead: newRecord,
        });
        console.log('[CRM] Respons Google Sheets (create):', result);

        await refreshLeads();
        notifySheetsUpdated();
        return newRecord;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal menyimpan rekod ke Google Sheets. Sila cuba sebentar lagi.';
        console.error('[CRM] Gagal menambah lead ke Google Sheets:', err);
        setSubmitError(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [postToGoogleSheet, refreshLeads]
  );

  const updateLeadStatus = useCallback(
    async (id: string, status: LeadStatus): Promise<void> => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSyncError(null);

      try {
        const result = await postToGoogleSheet({
          action: 'updateStatus',
          id,
          status,
        });
        console.log('[CRM] Status lead dikemas kini dalam Google Sheets:', {
          id,
          status,
          result,
        });

        await refreshLeads();
        notifySheetsUpdated();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal mengemas kini status dalam Google Sheets.';
        console.error('[CRM] Gagal kemas kini status:', err);
        setSyncError(message);
        setSubmitError(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [postToGoogleSheet, refreshLeads]
  );

  const deleteLead = useCallback(
    async (id: string): Promise<void> => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSyncError(null);

      try {
        const result = await postToGoogleSheet({
          action: 'delete',
          id,
        });
        console.log('[CRM] Lead dipadam dari Google Sheets:', { id, result });

        await refreshLeads();
        notifySheetsUpdated();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal memadam rekod daripada Google Sheets.';
        console.error('[CRM] Gagal memadam lead:', err);
        setSyncError(message);
        setSubmitError(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [postToGoogleSheet, refreshLeads]
  );

  const exportLeadsToCSV = useCallback((recordsToExport: LeadRecord[]) => {
    const headers = [
      'ID',
      'Tarikh & Masa',
      'Nama Penuh',
      'No. Telefon',
      'Emel',
      'Program Diminati',
      'Tahap Pengalaman',
      'Catatan',
      'Status',
    ];

    const rows = recordsToExport.map((lead) => [
      lead.id,
      formatTimestamp(lead.createdAt),
      lead.name,
      lead.phone,
      lead.email,
      lead.program,
      lead.experienceLevel,
      lead.notes ?? '',
      lead.status,
    ]);

    const escapeCell = (val: string) => {
      const norm = val.replace(/\r?\n/g, ' ');
      return /[",]/.test(norm) ? `"${norm.replace(/"/g, '""')}"` : norm;
    };

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join(
        '\n'
      );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `gis-kimpalan-leads-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return {
    leads,
    isLoading,
    isSubmitting,
    syncError,
    submitError,
    isGoogleSheetConfigured,
    addLead,
    updateLeadStatus,
    deleteLead,
    refreshLeads,
    exportLeadsToCSV,
  };
}
