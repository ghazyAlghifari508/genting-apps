export type Phase = 'kehamilan' | 'bayi_0_3' | 'bayi_3_12' | 'anak_1_2';
export type UserStatus = 'hamil' | 'punya_anak';
export type Category = 'nutrisi' | 'kesehatan' | 'stimulasi' | 'perkembangan' | 'aktivitas';

export interface EducationContent {
  id: string;
  day: number;
  phase: Phase;
  month: number;
  title: string;
  description: string;
  content: string;
  tips: string[];
  category: Category;
  thumbnail_url?: string;
  tags: string[];
  related_days: number[];
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  status: UserStatus;
  pregnancy_month?: number;
  child_birth_date?: string;
  current_day: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  day: number;
  is_read: boolean;
  read_at?: string;
  is_favorite: boolean;
  favorited_at?: string;
}

export interface PhaseDetail {
  id: Phase;
  label: string;
  color: string;
  dayRange: [number, number];
  description: string;
}

export const PHASES: PhaseDetail[] = [
  {
    id: 'kehamilan',
    label: 'Fase Kehamilan',
    color: 'bg-rose-500',
    dayRange: [1, 270],
    description: 'Periode 9 bulan kehamilan yang krusial untuk perkembangan organ.'
  },
  {
    id: 'bayi_0_3',
    label: 'Bayi 0-3 Bulan',
    color: 'bg-blue-500',
    dayRange: [271, 365],
    description: 'Fase bayi baru lahir, fokus pada ASI eksklusif dan bonding.'
  },
  {
    id: 'bayi_3_12',
    label: 'Bayi 3-12 Bulan',
    color: 'bg-green-500',
    dayRange: [366, 635],
    description: 'Fase mulai MPASI dan perkembangan motorik halus.'
  },
  {
    id: 'anak_1_2',
    label: 'Anak 1-2 Tahun',
    color: 'bg-purple-500',
    dayRange: [636, 1000],
    description: 'Fase pertumbuhan cepat dan eksplorasi dunia luar.'
  }
];

export function getPhaseFromDay(day: number): Phase {
  if (day <= 270) return 'kehamilan';
  if (day <= 365) return 'bayi_0_3';
  if (day <= 635) return 'bayi_3_12';
  return 'anak_1_2';
}

export function getPhaseLabelFromDay(day: number): string {
  return PHASES.find(p => p.id === getPhaseFromDay(day))?.label || '';
}

export interface PhaseInfo {
  label: string;
  color: string;
}

export function getPhaseInfo(phase: Phase): PhaseInfo {
  const phaseDetail = PHASES.find(p => p.id === phase);
  return {
    label: phaseDetail?.label || '',
    color: phaseDetail?.color || 'bg-cerulean'
  };
}

export function calculateCurrentDay(
    status: UserStatus,
    pregnancy_month?: number,
    child_birth_date?: Date
): number {
    let current_day: number;
    
    if (status === 'hamil' && pregnancy_month !== undefined) {
        // Each month approximately 30 days
        current_day = pregnancy_month * 30;
    } else if (status === 'punya_anak' && child_birth_date !== undefined) {
        // Days since birth
        const diffTime = Math.abs(new Date().getTime() - new Date(child_birth_date).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Add 270 days for pregnancy phase
        current_day = 270 + diffDays;
    } else {
        current_day = 1;
    }
    
    // Cap at 1000
    return Math.min(Math.max(1, current_day), 1000);
}
