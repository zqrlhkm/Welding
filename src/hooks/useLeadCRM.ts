import { useCallback, useEffect, useState } from 'react';
import {
  EXPERIENCE_LEVELS,
  ExperienceLevel,
  LEAD_STATUSES,
  LeadRecord,
  LeadStatus,
  NewLeadInput,
} from '../types/crm';

export const CRM_STORAGE_KEY = 'gis_welding_crm_leads_v1';

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

function readStoredLeads(): LeadRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(CRM_STORAGE_KEY);
    if (!raw) return [];
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
        experienceLevel: normalizeExperience(item.experienceLevel),
        status: isValidStatus(item.status) ? item.status : 'New Lead',
      }));
  } catch {
    return [];
  }
}

function writeStoredLeads(records: LeadRecord[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors silently
  }
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
  const [leads, setLeads] = useState<LeadRecord[]>(() => readStoredLeads());

  useEffect(() => {
    writeStoredLeads(leads);
  }, [leads]);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === CRM_STORAGE_KEY) {
        setLeads(readStoredLeads());
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const addLead = useCallback((input: NewLeadInput): LeadRecord => {
    const newRecord: LeadRecord = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      program: input.program,
      experienceLevel: normalizeExperience(input.experienceLevel),
      status: 'New Lead',
    };

    setLeads((prev) => {
      const next = [newRecord, ...prev];
      writeStoredLeads(next);
      return next;
    });
    return newRecord;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) => {
      const next = prev.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      );
      writeStoredLeads(next);
      return next;
    });
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => {
      const next = prev.filter((lead) => lead.id !== id);
      writeStoredLeads(next);
      return next;
    });
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
    exportLeadsToCSV,
  };
}
