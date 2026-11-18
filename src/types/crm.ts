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

export type Lead = LeadRecord;

export interface NewLeadInput {
  name: string;
  phone: string;
  email: string;
  program: string;
  experienceLevel?: ExperienceLevel;
  experience?: ExperienceLevel;
  status?: LeadStatus;
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
