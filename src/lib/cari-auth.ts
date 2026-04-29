import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export type CariRole = 'secretary' | 'doctor';

export interface CariSession {
  id: string;
  username: string;
  email?: string | null;
  name: string;
  role: CariRole;
}

const CARI_SESSION_COOKIE = 'cari_session';

const FALLBACK_USERS = [
  {
    username: 'sekreter',
    password: process.env.CARI_SECRETARY_PASSWORD || 'sekreter123',
    name: 'Sekreter',
    role: 'secretary' as CariRole,
  },
  {
    username: 'doktor',
    password: process.env.CARI_DOCTOR_PASSWORD || 'doktor123',
    name: 'Doktor',
    role: 'doctor' as CariRole,
  },
];

function encodeSession(session: CariSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

function decodeSession(value: string): CariSession | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (!parsed?.id || !parsed?.username || !parsed?.name || !['secretary', 'doctor'].includes(parsed?.role)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getCariSession(): Promise<CariSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CARI_SESSION_COOKIE);
  return cookie?.value ? decodeSession(cookie.value) : null;
}

export async function requireCariSession(roles?: CariRole[]): Promise<CariSession> {
  const session = await getCariSession();

  if (!session) throw new Error('Unauthorized');
  if (roles?.length && !roles.includes(session.role)) throw new Error('Forbidden');

  return session;
}

export async function setCariSession(session: CariSession) {
  const cookieStore = await cookies();
  cookieStore.set(CARI_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12,
    path: '/',
  });
}

export async function clearCariSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CARI_SESSION_COOKIE);
}

function fallbackSession(username: string, password: string): CariSession | null {
  const fallback = FALLBACK_USERS.find((user) => user.username === username && user.password === password);
  if (!fallback) return null;

  return {
    id: `fallback-${fallback.username}`,
    username: fallback.username,
    email: null,
    name: fallback.name,
    role: fallback.role,
  };
}

export function normalizeCariLogin(value: string) {
  return value.trim().toLocaleLowerCase('tr-TR');
}

export function hashCariResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createCariResetToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export async function hashCariPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyCariPassword(session: CariSession, password: string) {
  if (session.id.startsWith('fallback-')) {
    const fallback = FALLBACK_USERS.find((user) => user.username === session.username);
    return fallback?.password === password;
  }

  const user = await prisma.cariUser.findUnique({
    where: { id: session.id },
    select: { passwordHash: true, username: true },
  });
  if (!user?.passwordHash) return false;

  return bcrypt.compare(password, user.passwordHash);
}

export function getFallbackUser(username: string) {
  return FALLBACK_USERS.find((user) => user.username === username) || null;
}

export async function verifyCariCredentials(username: string, password: string): Promise<CariSession | null> {
  const normalizedUsername = normalizeCariLogin(username);

  try {
    const user = await prisma.cariUser.findFirst({
      where: {
        isActive: true,
        OR: [
          { username: normalizedUsername },
          { email: normalizedUsername },
        ],
      },
    });

    if (user) {
      const fallback = FALLBACK_USERS.find((item) => item.username === user.username);
      const passwordMatches = user.passwordHash
        ? await bcrypt.compare(password, user.passwordHash)
        : fallback?.password === password;

      if (!passwordMatches) return null;

      await prisma.cariUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role as CariRole,
      };
    }
  } catch (error) {
    console.error('Cari credential DB lookup failed, trying fallback credentials.', error);
  }

  return fallbackSession(normalizedUsername, password);
}
