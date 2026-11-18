export type LeadStatus = 'New Lead' | 'Contacted' | 'Registered' | 'Closed';

export type ExperienceLevel =
  | 'Tiada Asas (Permulaan)'
  | 'Asas Sekolah / Bengkel'
  | 'Ada Pengalaman Asas Kerja';

export interface LeadRecord {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  experienceLevel: ExperienceLevel;
  status: LeadStatus;
}

export interface NewLeadInput {
  name: string;
  phone: string;
  email: string;
  program: string;
  experienceLevel: ExperienceLevel;
}

export const LEAD_STATUSES: LeadStatus[] = [
  'New Lead',
  'Contacted',
  'Registered',
  'Closed',
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Tiada Asas (Permulaan)',
  'Asas Sekolah / Bengkel',
  'Ada Pengalaman Asas Kerja',
];
