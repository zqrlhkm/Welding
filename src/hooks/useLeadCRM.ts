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
export const CRM_STORAGE_KEY = STORAGE_KEY;
const LEGACY_STORAGE_KEY = 'gis_welding_crm_leads_v1';
const CRM_SYNC_EVENT = 'gis_welding_crm_sync';

// In-memory fallback for mobile private browsing / strict WebViews where localStorage is blocked
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

function parseRawLeads(raw: string | null): LeadRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.phone === 'string' &&
          typeof item.email === 'string' &&
          typeof item.program === 'string' &&
          typeof item.createdAt === 'string'
      )
      .map((item) => ({
        id: item.id as string,
        createdAt: item.createdAt as string,
        name: item.name as string,
        phone: item.phone as string,
        email: item.email as string,
        program: item.program as string,
        experienceLevel: normalizeExperience(
          item.experienceLevel ?? item.experience
        ),
        notes: typeof item.notes === 'string' ? item.notes : '',
        status: isValidStatus(item.status) ? item.status : 'New Lead',
      }));
  } catch {
    return [];
  }
}

function readStoredLeads(): LeadRecord[] {
  if (typeof window === 'undefined' || !isStorageAvailable()) {
    return inMemoryLeadsFallback;
  }
  try {
    const primaryRaw = window.localStorage.getItem(STORAGE_KEY);
    if (primaryRaw) {
      const normalized = parseRawLeads(primaryRaw);
      inMemoryLeadsFallback = normalized;
      return normalized;
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const migrated = parseRawLeads(legacyRaw);
      if (migrated.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        inMemoryLeadsFallback = migrated;
        return migrated;
      }
    }

    return inMemoryLeadsFallback;
  } catch {
    return inMemoryLeadsFallback;
  }
}

function writeStoredLeads(records: LeadRecord[]): boolean {
  inMemoryLeadsFallback = records;
  if (typeof window === 'undefined' || !isStorageAvailable()) {
    console.warn('[CRM] localStorage tidak tersedia, rekod disimpan dalam memori sesi.');
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('[CRM] Gagal menulis ke localStorage:', error);
    return false;
  }
}

function notifySameTabCRMListeners(): void {
  if (typeof window === 'undefined') return;
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(CRM_SYNC_EVENT));
  });
}

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' ');
  if (/[",]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
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

  const refreshLeads = useCallback(() => {
    const fresh = readStoredLeads();
    console.log(`[CRM] Muat semula rekod (${STORAGE_KEY}):`, fresh.length);
    setLeads((prev) =>
      JSON.stringify(prev) === JSON.stringify(fresh) ? prev : fresh
    );
  }, []);

  useEffect(() => {
    refreshLeads();

    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        refreshLeads();
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshLeads();
      }
    };

    window.addEventListener('storage', handleStorageSync);
    window.addEventListener(CRM_SYNC_EVENT, refreshLeads);
    window.addEventListener('pageshow', refreshLeads);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener(CRM_SYNC_EVENT, refreshLeads);
      window.removeEventListener('pageshow', refreshLeads);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshLeads]);

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
    const persisted = writeStoredLeads(next);

    console.log('[CRM] Lead baharu disimpan:', newRecord);
    console.log(`[CRM] Status localStorage (${STORAGE_KEY}):`, {
      persisted,
      totalLeads: next.length,
    });

    setLeads(next);
    notifySameTabCRMListeners();
    return newRecord;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    const current = readStoredLeads();
    const next = current.map((lead) =>
      lead.id === id ? { ...lead, status } : lead
    );
    writeStoredLeads(next);
    console.log('[CRM] Status lead dikemas kini:', { id, status });
    setLeads(next);
    notifySameTabCRMListeners();
  }, []);

  const deleteLead = useCallback((id: string) => {
    const current = readStoredLeads();
    const next = current.filter((lead) => lead.id !== id);
    writeStoredLeads(next);
    console.log('[CRM] Lead dipadam:', { id, remainingLeads: next.length });
    setLeads(next);
    notifySameTabCRMListeners();
  }, []);

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
      escapeCsvCell(lead.id),
      escapeCsvCell(formatTimestamp(lead.createdAt)),
      escapeCsvCell(lead.name),
      escapeCsvCell(lead.phone),
      escapeCsvCell(lead.email),
      escapeCsvCell(lead.program),
      escapeCsvCell(lead.experienceLevel),
      escapeCsvCell(lead.notes ?? ''),
      escapeCsvCell(lead.status),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

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
    addLead,
    updateLeadStatus,
    deleteLead,
    refreshLeads,
    exportLeadsToCSV,
  };
}
