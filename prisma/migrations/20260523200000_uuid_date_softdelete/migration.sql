-- Migration: UUID primary keys, DATE columns, soft delete
-- Safe for existing data: all casts are lossless (valid UUIDs and ISO date strings).

-- ── kunden ────────────────────────────────────────────────────────────────────
ALTER TABLE "kunden"
  ALTER COLUMN "id"    SET DATA TYPE UUID USING "id"::UUID,
  ALTER COLUMN "since" SET DATA TYPE DATE USING "since"::DATE,
  ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "kunden_deletedAt_idx" ON "kunden"("deletedAt");

-- ── demos ─────────────────────────────────────────────────────────────────────
ALTER TABLE "demos"
  ALTER COLUMN "id"          SET DATA TYPE UUID USING "id"::UUID,
  ALTER COLUMN "eingegangen" SET DATA TYPE DATE USING "eingegangen"::DATE,
  ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "demos_deletedAt_idx" ON "demos"("deletedAt");

-- ── nachrichten ───────────────────────────────────────────────────────────────
ALTER TABLE "nachrichten"
  ALTER COLUMN "id"          SET DATA TYPE UUID USING "id"::UUID,
  ALTER COLUMN "eingegangen" SET DATA TYPE DATE USING "eingegangen"::DATE,
  ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "nachrichten_deletedAt_idx" ON "nachrichten"("deletedAt");
