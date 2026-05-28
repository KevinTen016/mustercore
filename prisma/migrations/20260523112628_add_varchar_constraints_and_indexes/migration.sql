/*
  Warnings:

  - You are about to alter the column `name` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `firma` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `email` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `telefon` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `branche` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `eingegangen` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `status` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `stil` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `statusWebsite` on the `demos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `name` on the `kunden` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `branche` on the `kunden` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `paket` on the `kunden` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `status` on the `kunden` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `email` on the `kunden` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `since` on the `kunden` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `name` on the `nachrichten` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `email` on the `nachrichten` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `betreff` on the `nachrichten` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `text` on the `nachrichten` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `eingegangen` on the `nachrichten` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `status` on the `nachrichten` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "demos" ALTER COLUMN "name" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "firma" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "telefon" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "branche" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "eingegangen" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "status" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "stil" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "features" DROP DEFAULT,
ALTER COLUMN "statusWebsite" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "kunden" ALTER COLUMN "name" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "branche" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "paket" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "status" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "since" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "nachrichten" ALTER COLUMN "name" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "betreff" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "text" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "eingegangen" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "status" SET DATA TYPE VARCHAR(20);

-- CreateIndex
CREATE INDEX "demos_email_idx" ON "demos"("email");

-- CreateIndex
CREATE INDEX "demos_eingegangen_idx" ON "demos"("eingegangen");

-- CreateIndex
CREATE INDEX "kunden_status_idx" ON "kunden"("status");
