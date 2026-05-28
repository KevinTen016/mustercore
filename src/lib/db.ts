import { PrismaClient, Prisma } from '@prisma/client';

// Singleton: один клиент на весь процесс; в dev hot-reload не плодит соединения
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ── DTOs — то, что видит API-клиент; внутренние поля (deletedAt) не утекают ──

export type KundeDTO = {
  id: string; name: string; branche: string;
  paket: string; status: string; email: string; since: string;
};

export type DemoDTO = {
  id: string; name: string; firma: string; email: string;
  telefon: string; branche: string; eingegangen: string;
  status: string; stil: string | null;
  features: string[]; statusWebsite: string | null;
};

export type NachrichtDTO = {
  id: string; name: string; email: string; betreff: string;
  text: string; eingegangen: string; status: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date | string): string {
  if (typeof d === 'string') return d.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function toKundeDTO(k: { id: string; name: string; branche: string; paket: string; status: string; email: string; since: Date | string }): KundeDTO {
  return { id: k.id, name: k.name, branche: k.branche, paket: k.paket, status: k.status, email: k.email, since: toDateStr(k.since) };
}

function toDemoDTO(d: { id: string; name: string; firma: string; email: string; telefon: string; branche: string; eingegangen: Date | string; status: string; stil: string | null; features: string[]; statusWebsite: string | null }): DemoDTO {
  return { id: d.id, name: d.name, firma: d.firma, email: d.email, telefon: d.telefon, branche: d.branche, eingegangen: toDateStr(d.eingegangen), status: d.status, stil: d.stil, features: d.features, statusWebsite: d.statusWebsite };
}

function toNachrichtDTO(n: { id: string; name: string; email: string; betreff: string; text: string; eingegangen: Date | string; status: string }): NachrichtDTO {
  return { id: n.id, name: n.name, email: n.email, betreff: n.betreff, text: n.text, eingegangen: toDateStr(n.eingegangen), status: n.status };
}

function notFound(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
}

// Soft-delete filter applied to all list/update/remove operations
const LIVE = { deletedAt: null } as const;

// ── Input types ───────────────────────────────────────────────────────────────

type KundeCreate = { name: string; branche: string; paket: string; email: string; status: string; since: Date };
type DemoCreate  = { name: string; firma: string; email: string; telefon: string; branche: string; eingegangen: Date; status: string; stil: string; features: string[]; statusWebsite: string };

// ── Public API ────────────────────────────────────────────────────────────────

export const db = {
  async ping(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  },

  kunden: {
    async list(): Promise<KundeDTO[]> {
      const rows = await prisma.kunde.findMany({ where: LIVE, orderBy: { since: 'desc' }, take: 500 });
      return rows.map(toKundeDTO);
    },
    async add(input: KundeCreate): Promise<KundeDTO> {
      const row = await prisma.kunde.create({ data: input });
      return toKundeDTO(row);
    },
    async update(id: string, patch: Partial<{ status: string; name: string; email: string; branche: string; paket: string }>): Promise<KundeDTO | null> {
      try {
        const row = await prisma.kunde.update({ where: { id, ...LIVE }, data: patch });
        return toKundeDTO(row);
      } catch (e) {
        if (notFound(e)) return null;
        throw e;
      }
    },
    async remove(id: string): Promise<boolean> {
      try {
        await prisma.kunde.update({ where: { id, ...LIVE }, data: { deletedAt: new Date() } });
        return true;
      } catch (e) {
        if (notFound(e)) return false;
        throw e;
      }
    },
  },

  demos: {
    async list(): Promise<DemoDTO[]> {
      const rows = await prisma.demo.findMany({ where: LIVE, orderBy: { eingegangen: 'desc' }, take: 500 });
      return rows.map(toDemoDTO);
    },
    async add(input: DemoCreate): Promise<DemoDTO> {
      const row = await prisma.demo.create({ data: { ...input, features: input.features ?? [] } });
      return toDemoDTO(row);
    },
    async update(id: string, patch: Partial<{ status: string }>): Promise<DemoDTO | null> {
      try {
        const row = await prisma.demo.update({ where: { id, ...LIVE }, data: patch });
        return toDemoDTO(row);
      } catch (e) {
        if (notFound(e)) return null;
        throw e;
      }
    },
    async remove(id: string): Promise<boolean> {
      try {
        await prisma.demo.update({ where: { id, ...LIVE }, data: { deletedAt: new Date() } });
        return true;
      } catch (e) {
        if (notFound(e)) return false;
        throw e;
      }
    },
    async existsByEmailToday(email: string): Promise<boolean> {
      // UTC date boundaries — consistent with how eingegangen is stored.
      // Dedup applies regardless of deletedAt: prevents re-submit on same day
      // even if admin removed the lead.
      const start = new Date(); start.setUTCHours(0, 0, 0, 0);
      const end   = new Date(); end.setUTCHours(23, 59, 59, 999);
      const existing = await prisma.demo.findFirst({
        where: { email, eingegangen: { gte: start, lte: end } },
        select: { id: true },
      });
      return existing != null;
    },
  },

  nachrichten: {
    async list(): Promise<NachrichtDTO[]> {
      const rows = await prisma.nachricht.findMany({ where: LIVE, orderBy: { eingegangen: 'desc' }, take: 500 });
      return rows.map(toNachrichtDTO);
    },
    async add(input: { name: string; email: string; betreff: string; text: string; eingegangen: Date; status: string }): Promise<NachrichtDTO> {
      const row = await prisma.nachricht.create({ data: input });
      return toNachrichtDTO(row);
    },
    async update(id: string, patch: Partial<{ status: string }>): Promise<NachrichtDTO | null> {
      try {
        const row = await prisma.nachricht.update({ where: { id, ...LIVE }, data: patch });
        return toNachrichtDTO(row);
      } catch (e) {
        if (notFound(e)) return null;
        throw e;
      }
    },
    async remove(id: string): Promise<boolean> {
      try {
        await prisma.nachricht.update({ where: { id, ...LIVE }, data: { deletedAt: new Date() } });
        return true;
      } catch (e) {
        if (notFound(e)) return false;
        throw e;
      }
    },
  },
};
