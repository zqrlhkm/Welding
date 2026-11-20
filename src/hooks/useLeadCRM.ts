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

export const STORAGE_KEY = 'welding_leads_data';
const STORAGE_UPDATED_EVENT = 'storage_updated';

const DEFAULT_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbyDF3B9PS63ElhWCydKiUb8G7u2TweH3da1oQkweMrBaopdfUmLqsZ1IrEGphXCAjoI/exec';

const WEBAPP_URL = (
  import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL || DEFAULT_WEBAPP_URL
).trim();

let inMemoryLeadsFallback: LeadRecord[] = [];

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

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__gis_crm_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readStoredLeads(): LeadRecord[] {
  if (typeof window === 'undefined' || !isStorageAvailable()) {
    return inMemoryLeadsFallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        id: String(item.id || `LEAD-${Date.now()}`),
        createdAt: String(item.createdAt || new Date().toISOString()),
        name: String(item.name || ''),
        phone: String(item.phone || ''),
        email: String(item.email || ''),
        program: String(item.program || ''),
        experienceLevel: normalizeExperience(item.experienceLevel ?? item.experience),
        notes: typeof item.notes === 'string' ? item.notes : '',
        status: isValidStatus(item.status) ? item.status : 'New Lead',
      }));
  } catch (error) {
    console.error('[CRM] Ralat membaca localStorage:', error);
    return [];
  }
}

function writeStoredLeads(records: LeadRecord[]): boolean {
  inMemoryLeadsFallback = records;
  if (typeof window === 'undefined' || !isStorageAvailable()) {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('[CRM] Ralat menulis ke localStorage:', error);
    return false;
  }
}

function notifyStorageUpdated(): void {
  if (typeof window === 'undefined') return;
  queueMicrotask(() => {
    window.dispatchEvent(new Event(STORAGE_UPDATED_EVENT));
  });
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
  const [leads, setLeads] = useState<Lead[]>(() => readStoredLeads());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const isGoogleSheetConfigured = Boolean(WEBAPP_URL && WEBAPP_URL.startsWith('http'));

  const refreshLeads = useCallback(async () => {
    if (!isGoogleSheetConfigured) {
      const local = readStoredLeads();
      setLeads(local);
      return;
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
        throw new Error(`HTTP ${response.status}: Gagal memuatkan data dari Google Sheets.`);
      }
      const data = await response.json();
      if (data && data.status === 'success' && Array.isArray(data.leads)) {
        const fetchedLeads: LeadRecord[] = data.leads
          .map((item: Record<string, unknown>) => ({
            id: String(item.id ?? ''),
            createdAt: String(item.createdAt ?? ''),
            name: String(item.name ?? ''),
            phone: String(item.phone ?? ''),
            email: String(item.email ?? ''),
            program: String(item.program ?? ''),
            experienceLevel: normalizeExperience(item.experienceLevel),
            notes: String(item.notes ?? ''),
            status: isValidStatus(item.status) ? item.status : 'New Lead',
          }))
          .sort(
            (a: LeadRecord, b: LeadRecord) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setLeads(fetchedLeads);
        writeStoredLeads(fetchedLeads);
        console.log('[CRM] Berjaya menyegerakkan leads dari Google Sheets:', fetchedLeads.length);
      } else {
        throw new Error(data.message || 'Gagal memuatkan data dari Google Sheets.');
      }
    } catch (err: any) {
      console.warn('[CRM] Gagal sambung ke Google Sheet Web App, menggunakan cache tempatan:', err);
      setSyncError(err.message || 'Ralat sambungan rangkaian Google Sheets.');
      const local = readStoredLeads();
      setLeads(local);
    } finally {
      setIsLoading(false);
    }
  }, [isGoogleSheetConfigured]);

  useEffect(() => {
    refreshLeads();

    const handleCustomStorageUpdated = () => {
      const local = readStoredLeads();
      setLeads(local);
    };

    window.addEventListener(STORAGE_UPDATED_EVENT, handleCustomStorageUpdated);
    window.addEventListener('pageshow', refreshLeads);

    return () => {
      window.removeEventListener(STORAGE_UPDATED_EVENT, handleCustomStorageUpdated);
      window.removeEventListener('pageshow', refreshLeads);
    };
  }, [refreshLeads]);

  const postToGoogleSheet = async (payload: object) => {
    if (!isGoogleSheetConfigured) return;
    try {
      await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        redirect: 'follow',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      console.log('[CRM] Berjaya hantar tindakan ke Google Sheet:', payload);
    } catch (err) {
      console.error('[CRM] Ralat menghantar kemas kini ke Google Sheet:', err);
    }
  };

  const addLead = useCallback((input: NewLeadInput): LeadRecord => {
    const newRecord: LeadRecord = {
      id: `LEAD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      program: input.program,
      experienceLevel: normalizeExperience(input.experienceLevel ?? input.experience),
      notes: input.notes ? input.notes.trim() : '',
      status: isValidStatus(input.status) ? input.status : 'New Lead',
    };

    const current = readStoredLeads();
    const next = [newRecord, ...current];
    writeStoredLeads(next);
    setLeads(next);
    notifyStorageUpdated();

    postToGoogleSheet({
      action: 'create',
      lead: newRecord,
    });

    return newRecord;
  }, [isGoogleSheetConfigured]);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    const current = readStoredLeads();
    const next = current.map((lead) =>
      lead.id === id ? { ...lead, status } : lead
    );
    writeStoredLeads(next);
    setLeads(next);
    notifyStorageUpdated();

    postToGoogleSheet({
      action: 'updateStatus',
      id,
      status,
    });
  }, [isGoogleSheetConfigured]);

  const deleteLead = useCallback((id: string) => {
    const current = readStoredLeads();
    const next = current.filter((lead) => lead.id !== id);
    writeStoredLeads(next);
    setLeads(next);
    notifyStorageUpdated();

    postToGoogleSheet({
      action: 'delete',
      id,
    });
  }, [isGoogleSheetConfigured]);

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
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');

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
    syncError,
    isGoogleSheetConfigured,
    addLead,
    updateLeadStatus,
    deleteLead,
    refreshLeads,
    exportLeadsToCSV,
  };
}
