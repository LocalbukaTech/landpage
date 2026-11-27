import type { Team } from '@/lib/api/services/teams.service';

export const TEAM_DEPARTMENTS: { key: string; label: string }[] = [
  { key: 'leadership', label: 'Leadership' },
  { key: 'product', label: 'Product' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'operations', label: 'Operations' },
  { key: 'brand_finance', label: 'Brand & Finance' },
  { key: 'human_resource', label: 'Human Resource' },
];

const DEPT_ORDER = new Map(TEAM_DEPARTMENTS.map((d, idx) => [d.key, idx]));

/** Normalize a backend department string to a canonical snake_case key */
export function normalizeDept(dept?: string | null): string {
  return (dept ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s&]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/** Human-readable department label */
export function getDepartmentLabel(dept?: string | null): string {
  const key = normalizeDept(dept);
  const found = TEAM_DEPARTMENTS.find((d) => d.key === key);
  if (found) return found.label;
  if (!key) return 'Team';
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Title-case multi-word first and last names cleanly */
export function formatTeamName(firstName?: string | null, lastName?: string | null): string {
  const raw = `${firstName ?? ''} ${lastName ?? ''}`.trim().replace(/\s+/g, ' ');
  if (!raw) return 'Team Member';
  return raw
    .split(' ')
    .map((part) =>
      part
        .split('-')
        .map((seg) => (seg ? seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase() : ''))
        .join('-')
    )
    .join(' ');
}

/** Clean minor spacing typos in backend position titles */
export function formatTeamPosition(position?: string | null): string {
  return (position ?? '')
    .trim()
    .replace(/\bCo-\s*Founder\b/gi, 'Co-Founder')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ');
}

/** Upgrade http:// Cloudinary URLs to https:// */
export function normalizeTeamImageUrl(url?: string | null): string {
  if (!url) return '';
  return url.startsWith('http://res.cloudinary.com')
    ? url.replace('http://', 'https://')
    : url;
}

/** Initials fallback when a member photo is missing or fails to load */
export function getTeamInitials(firstName?: string | null, lastName?: string | null): string {
  const f = (firstName ?? '').trim()[0] ?? '';
  const l = (lastName ?? '').trim()[0] ?? '';
  return `${f}${l}`.toUpperCase() || 'LB';
}

/** Identify Co-Founders & executive leadership for top-tier grouping */
export function isLeadershipMember(member: Team): boolean {
  if (normalizeDept(member.department) === 'leadership') return true;
  const pos = (member.position ?? '').toLowerCase();
  return /\b(co-?\s*founder|founder|ceo|cto|cfo|coo|chief)\b/.test(pos);
}

/** Deterministic executive-first sorting for landing page & /team page */
export function sortTeamMembers(members: Team[]): Team[] {
  return [...members].sort((a, b) => {
    const aLead = isLeadershipMember(a) ? 0 : 1;
    const bLead = isLeadershipMember(b) ? 0 : 1;
    if (aLead !== bLead) return aLead - bLead;

    // Within leadership, put explicit Leadership department before cross-functional co-founders
    if (aLead === 0 && bLead === 0) {
      const aPrimary = normalizeDept(a.department) === 'leadership' ? 0 : 1;
      const bPrimary = normalizeDept(b.department) === 'leadership' ? 0 : 1;
      if (aPrimary !== bPrimary) return aPrimary - bPrimary;
    }

    const aDept = DEPT_ORDER.get(normalizeDept(a.department)) ?? 99;
    const bDept = DEPT_ORDER.get(normalizeDept(b.department)) ?? 99;
    if (aDept !== bDept) return aDept - bDept;

    return formatTeamName(a.first_name, a.last_name).localeCompare(
      formatTeamName(b.first_name, b.last_name)
    );
  });
}
