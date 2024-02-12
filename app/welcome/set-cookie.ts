'use server';

import { cookies } from 'next/headers';

const codes = [
  'GLOW-bkgO2x2IzT',
  'GLOW-Jdn55tZmhj',
  'GLOW-Zs3vuaVCw6',
  'GLOW-XHAX7kvvtv',
  'GLOW-fBf1v3OdRw',
  'GLOW-mQqKhNQ6Px',
  'GLOW-6vmihT7fe1',
  'GLOW-wli9MFONFS',
  'GLOW-P23LMpXIWo',
];

export async function setCookie() {
  cookies().set('inviteCode', codes[Math.floor(Math.random() * codes.length)], {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}
