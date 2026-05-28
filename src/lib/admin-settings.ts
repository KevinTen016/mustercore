import { PrismaClient } from '@prisma/client';

const _gp = globalThis as unknown as { prisma?: PrismaClient };
const prisma = _gp.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') _gp.prisma = prisma;

export interface AdminSettings {
  totpEnabled: boolean;
  totpSecret: string | null;
  totpPendingSecret: string | null;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
}

const DEFAULT: AdminSettings = {
  totpEnabled: false,
  totpSecret: null,
  totpPendingSecret: null,
  ipWhitelistEnabled: false,
  ipWhitelist: [],
};

const _gc = globalThis as unknown as { _adminSettingsCache?: AdminSettings | null };
if (!('_adminSettingsCache' in _gc)) _gc._adminSettingsCache = null;

export async function getAdminSettings(): Promise<AdminSettings> {
  if (_gc._adminSettingsCache) return _gc._adminSettingsCache;
  try {
    const row = await prisma.adminSettings.findUnique({ where: { id: 'singleton' } });
    _gc._adminSettingsCache = row
      ? {
          totpEnabled: row.totpEnabled,
          totpSecret: row.totpSecret,
          totpPendingSecret: row.totpPendingSecret,
          ipWhitelistEnabled: row.ipWhitelistEnabled,
          ipWhitelist: row.ipWhitelist,
        }
      : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
  return _gc._adminSettingsCache!;
}

export async function updateAdminSettings(
  updates: Partial<AdminSettings>,
): Promise<AdminSettings> {
  const row = await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    update: updates,
    create: { id: 'singleton', ...DEFAULT, ...updates },
  });
  const settings: AdminSettings = {
    totpEnabled: row.totpEnabled,
    totpSecret: row.totpSecret,
    totpPendingSecret: row.totpPendingSecret,
    ipWhitelistEnabled: row.ipWhitelistEnabled,
    ipWhitelist: row.ipWhitelist,
  };
  _gc._adminSettingsCache = settings;
  return settings;
}

export function invalidateSettingsCache(): void {
  _gc._adminSettingsCache = null;
}

// Returns true if the given IP is permitted to access the admin.
// Localhost is always allowed — prevents accidental self-lockout.
export function isIPAllowed(ip: string, settings: AdminSettings): boolean {
  if (!settings.ipWhitelistEnabled || settings.ipWhitelist.length === 0) return true;
  if (['127.0.0.1', '::1', '::ffff:127.0.0.1', 'unknown'].includes(ip)) return true;
  return settings.ipWhitelist.some(pattern =>
    pattern.includes('/') ? matchesCIDR(ip, pattern) : ip === pattern,
  );
}

function ipToNum(ip: string): number | null {
  const plain = ip.replace(/^::ffff:/i, '');
  const parts = plain.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function matchesCIDR(ip: string, cidr: string): boolean {
  try {
    const [range, bitsStr] = cidr.split('/');
    const bits = parseInt(bitsStr, 10);
    if (!range || isNaN(bits) || bits < 0 || bits > 32) return false;
    const ipNum = ipToNum(ip);
    const rangeNum = ipToNum(range);
    if (ipNum === null || rangeNum === null) return false;
    if (bits === 0) return true;
    const mask = (~0 << (32 - bits)) >>> 0;
    return (ipNum & mask) === (rangeNum & mask);
  } catch {
    return false;
  }
}
