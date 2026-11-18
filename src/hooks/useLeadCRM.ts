import { useCallback, useEffect, useState } from 'react';
import { LeadRecord, LeadStatus, NewLeadInput } from '../types/crm';

const STORAGE_KEY = 'gis_welding_crm_leads_v1';

function readStoredLeads(): LeadRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is LeadRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.phone === 'string' &&
        typeof item.email === 'string' &&
        typeof item.program === 'string' &&
        typeof item.createdAt === 'string' &&
        typeof item.status === 'string'
    );
  } catch {
    return [];
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
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch {
      // Ignore storage quota errors silently
    }
  }, [leads]);

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
      experienceLevel: input.experienceLevel,
      status: 'New Lead',
    };

    setLeads((prev) => [newRecord, ...prev]);
    return newRecord;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
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
