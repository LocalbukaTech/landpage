import type { AdminUser, RealAccountUser, UserStatus } from '@/types/admin';

const locations = [
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'London, UK',
    'Accra, Ghana',
    'New York, USA',
    'Nairobi, Kenya',
];

const flagReasons = [
    'High Follow Rate',
    'Duplicate IP',
    'Suspicious IP',
    'Fake email domain',
    'VPN detected',
    'Multiple accounts',
    'Bot behavior',
];

const emails = [
    'jane.doe@gmail.com',
    'micheal.k@yahoo.com',
    'ada.chi@outlook.com',
    'bola.joe@gmail.com',
    'femi.king@proton.me',
    'kemi.brown@mail.com',
    'uche.mike@gmail.com',
    'sarah.n@company.io',
    'tunde.a@live.com',
    'amaka.o@yahoo.com',
    'emeka.p@icloud.com',
    'grace.q@hotmail.com',
    'david.r@gmail.com',
    'mercy.s@outlook.com',
    'peter.t@proton.me',
    'funke.u@gmail.com',
    'ngozi.v@yahoo.com',
    'chidi.w@mail.com',
    'yemi.x@gmail.com',
    'nneka.y@live.com',
];

const realStatuses: UserStatus[] = ['Active', 'Banned', 'Suspended'];

// Generate dates in DD/MM/YY format spread across 2024–2025
function mockDate(index: number): string {
    const baseYear = 2024;
    const month = (index * 3 + 7) % 12 + 1;
    const day = (index * 7 + 5) % 28 + 1;
    const year = baseYear + (index % 2);
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

const ips = [
    '190.00.11.23',
    '102.89.44.12',
    '41.58.100.7',
    '78.129.55.90',
    '198.51.100.3',
    '172.16.0.14',
    '10.0.0.88',
    '203.0.113.42',
];

const postCounts = [30, 12, 45, 8, 67, 23, 5, 91, 14, 38, 55, 19, 72, 3, 41, 28, 60, 16, 33, 49];

/* ── Real Account Users ── */
export const mockRealAccountUsers: RealAccountUser[] = Array.from({ length: 20 }, (_, i) => ({
    id: `real-${i + 1}`,
    userId: `LB-${String(i + 1).padStart(3, '0')}`,
    email: emails[i % emails.length],
    registrationDate: mockDate(i),
    location: locations[i % locations.length],
    totalPosts: postCounts[i % postCounts.length],
    status: realStatuses[i % realStatuses.length],
}));

/* ── Fake / Spam Account Users ── */
export const mockFakeUsers: AdminUser[] = Array.from({ length: 20 }, (_, i) => ({
    id: `fake-${i + 1}`,
    userId: `LB-${String(100 + i + 1).padStart(3, '0')}`,
    signUpIp: ips[(i + 3) % ips.length],
    email: emails[(i + 5) % emails.length],
    registrationDate: mockDate(i + 10),
    location: locations[(i + 2) % locations.length],
    systemFlagReason: flagReasons[(i + 1) % flagReasons.length],
    status: realStatuses[(i + 1) % realStatuses.length],
}));
